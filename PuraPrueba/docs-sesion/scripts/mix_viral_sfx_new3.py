#!/usr/bin/env python3
"""
Mastering de Voz Viral de Alta Energía (-14 LUFS) + Mezcla de Efectos de Sonido de Estudio (Foley/SFX reales)
sincronizados al frame exacto de `words.json` para los 3 Nuevos Episodios Combinados:
  - `chicken-wash-myth`
  - `premium-gas-myth`
  - `water-chug-myth`
"""
import json, os, re, subprocess, sys, tempfile, unicodedata
from pathlib import Path
import numpy as np

SR = 44100
KF = Path("/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba")
os.environ["PATH"] = f"{KF / 'node_modules' / '.bin'}:/usr/local/bin:" + os.environ.get("PATH", "")

SFX_TH_ASSETS = KF / "assets" / "talking-head" / "sfx"
SFX_TH_ENGINE = KF / "engine" / "talking-head" / "sfx"
SFX_CELF = SFX_TH_ENGINE / "celfstudies"

LIBRARY = {
    "impact_hit": (SFX_TH_ENGINE / "cinematic-impact-hit-352702.mp3", "onset", 2.2),
    "impact_boom": (SFX_TH_ENGINE / "impact-cinematic-boom-05-352465.mp3", "onset", 2.2),
    "metal_slam": (SFX_TH_ENGINE / "mixkit-metal-hit-woosh-1485.wav", "peak", 1.8),
    "landing": (SFX_TH_ASSETS / "landing.wav", "onset", 1.4),
    "thud": (SFX_TH_ASSETS / "thud.wav", "onset", 1.2),
    "whoosh_cine": (SFX_TH_ENGINE / "mixkit-cinematic-whoosh-fast-transition-1492.wav", "peak", 1.2),
    "whoosh_fast": (SFX_TH_ENGINE / "mixkit-fast-whoosh-transition-1490.wav", "peak", 1.2),
    "whoosh_flick": (SFX_CELF / "Whoosh_05_Fast_Flick.wav", "peak", 0.9),
    "whoosh_arrow": (SFX_TH_ENGINE / "mixkit-arrow-whoosh-1491.wav", "peak", 1.0),
    "riser": (SFX_TH_ENGINE / "popular-riser-metallic-sound-effect-trimmed.mp3", "peak", 1.6),
    "deny": (SFX_TH_ASSETS / "deny.wav", "onset", 1.2),
    "confirm": (SFX_TH_ASSETS / "confirm.wav", "onset", 1.2),
    "electric_pop": (SFX_TH_ENGINE / "mixkit-electric-pop-2365.wav", "onset", 1.0),
    "tech_select": (SFX_TH_ENGINE / "mixkit-modern-technology-select-3124.wav", "onset", 1.0),
    "hard_pop": (SFX_TH_ENGINE / "mixkit-hard-pop-click-2364.wav", "onset", 0.9),
    "snap": (SFX_TH_ASSETS / "snap.wav", "onset", 0.7),
    "pop": (SFX_TH_ASSETS / "pop.wav", "onset", 0.7),
    "level_up": (SFX_CELF / "Sparkle_02_Level_Up.wav", "onset", 1.6),
    "shutter": (SFX_CELF / "Camera_02_Shutter_Click.wav", "onset", 0.9),
    "tick": (SFX_TH_ASSETS / "tick.wav", "onset", 0.35),
    "tock": (SFX_TH_ASSETS / "tock.wav", "onset", 0.35),
    "typing": (SFX_CELF / "Typing_03_Short_Phrase.wav", "onset", 1.35),
    "mouse_click": (SFX_CELF / "Mouse_Click_01_Crisp.wav", "onset", 0.6),
    "msg_pop": (SFX_TH_ENGINE / "mixkit-message-pop-alert-2354.mp3", "onset", 1.0),
}

_CACHE = {}


def db_to_lin(db: float) -> float:
    return float(10.0 ** (db / 20.0))


def load_sfx(name: str):
    if name in _CACHE:
        return _CACHE[name]
    path, align_mode, max_dur = LIBRARY[name]
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-f", "f32le", "-acodec", "pcm_f32le", "-ac", "2", "-ar", str(SR), "-"],
        capture_output=True,
        check=True,
    ).stdout
    arr = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
    max_n = int(max_dur * SR)
    if len(arr) > max_n:
        arr = arr[:max_n]
        fade_n = min(int(0.08 * SR), len(arr) // 4)
        if fade_n > 0:
            arr[-fade_n:] *= np.linspace(1.0, 0.0, fade_n, dtype=np.float32)[:, None]

    env = np.max(np.abs(arr), axis=1)
    peak = float(np.max(env)) if len(env) else 1.0
    if peak > 1e-6:
        arr /= peak

    env = np.max(np.abs(arr), axis=1)
    if align_mode == "peak":
        win = max(1, int(0.015 * SR))
        smooth = np.convolve(env, np.ones(win) / win, mode="same")
        anchor = int(np.argmax(smooth))
    else:
        idx = np.where(env >= 0.12)[0]
        trim = max(0, int(idx[0]) - int(0.004 * SR)) if len(idx) else 0
        arr = arr[trim:]
        anchor = 0

    _CACHE[name] = (arr, anchor)
    return arr, anchor


def norm_tok(s: str) -> str:
    s = unicodedata.normalize("NFD", s).encode("ascii", "ignore").decode("ascii").lower()
    return re.sub(r"[^a-z0-9$€%]", "", s)


CUES_BY_SLUG = {
    "chicken-wash-myth": [
        ("hook", "no", [("impact_hit", 0.0, -9.8), ("snap", 0.04, -12.0)]),
        ("hook", "dispersa", [("whoosh_flick", -0.02, -13.2), ("deny", 0.0, -11.5)]),
        ("hook", "90", [("impact_boom", 0.0, -9.6), ("hard_pop", 0.06, -12.0), ("hard_pop", 0.16, -12.0)]),
        ("usda", "Agricultura", [("tech_select", 0.0, -12.0)]),
        ("usda", "ultravioleta", [("electric_pop", 0.0, -11.8), ("tick", 0.08, -14.0), ("tock", 0.15, -14.0)]),
        ("usda", "chorro", [("whoosh_arrow", -0.02, -13.5)]),
        ("usda", "microgotas", [("impact_hit", 0.0, -10.2), ("pop", 0.06, -12.2)]),
        ("aerosol", "Campylobacter", [("deny", 0.0, -11.5)]),
        ("aerosol", "Salmonella", [("electric_pop", 0.0, -11.8)]),
        ("aerosol", "platos", [("whoosh_flick", -0.02, -13.5), ("metal_slam", 0.0, -10.2)]),
        ("aerosol", "esponja", [("landing", 0.0, -11.8)]),
        ("biofilm", "fría", [("tech_select", 0.0, -12.0)]),
        ("biofilm", "bacterias", [("hard_pop", 0.0, -12.0)]),
        ("biofilm", "multiplica", [("riser", 0.0, -14.2), ("deny", 0.02, -11.5)]),
        ("biofilm", "infección", [("impact_boom", 0.0, -10.0)]),
        ("heat", "destruye", [("impact_hit", 0.0, -10.0)]),
        ("heat", "cien", [("whoosh_arrow", -0.02, -13.5)]),
        ("heat", "74", [("riser", -0.04, -14.2), ("level_up", 0.0, -11.5), ("confirm", 0.08, -11.8)]),
        ("rule", "regla", [("shutter", 0.04, -12.2)]),
        ("rule", "sartén", [("hard_pop", 0.0, -12.0)]),
        ("rule", "papel", [("snap", 0.0, -11.8)]),
        ("rule", "manos", [("whoosh_flick", -0.06, -13.8), ("confirm", 0.0, -11.5)]),
        ("cta", "comentarios", [("tech_select", 0.0, -12.0)]),
        ("cta", "lavan", [("whoosh_arrow", -0.03, -13.8), ("typing", 0.0, -12.5)]),
        ("cta", "esto", [("mouse_click", -0.06, -11.5), ("msg_pop", 0.02, -11.5)]),
    ],
    "premium-gas-myth": [
        ("hook", "no", [("impact_hit", 0.0, -9.8), ("snap", 0.04, -12.0)]),
        ("hook", "potencia", [("whoosh_flick", -0.02, -13.2), ("deny", 0.0, -11.5)]),
        ("hook", "18%", [("impact_boom", 0.0, -9.6), ("hard_pop", 0.06, -12.0), ("hard_pop", 0.16, -12.0)]),
        ("aaa", "Automovilística", [("tech_select", 0.0, -12.0)]),
        ("aaa", "dinamómetro", [("electric_pop", 0.0, -11.8), ("tick", 0.08, -14.0), ("tock", 0.15, -14.0)]),
        ("aaa", "cero", [("whoosh_arrow", -0.02, -13.5), ("metal_slam", 0.0, -10.4)]),
        ("aaa", "litro", [("confirm", 0.0, -12.0)]),
        ("octane", "95", [("hard_pop", 0.0, -12.0), ("tick", 0.07, -14.0)]),
        ("octane", "pureza", [("deny", 0.0, -11.8)]),
        ("octane", "combustible", [("whoosh_flick", -0.02, -13.5), ("electric_pop", 0.0, -11.8)]),
        ("octane", "presión", [("impact_hit", 0.0, -10.2)]),
        ("compression", "turbo", [("riser", 0.0, -14.2), ("tech_select", 0.02, -12.0)]),
        ("compression", "cascabeleo", [("deny", 0.0, -11.5)]),
        ("compression", "normal", [("whoosh_arrow", -0.02, -13.5)]),
        ("compression", "igual", [("confirm", 0.0, -11.5), ("snap", 0.05, -12.0)]),
        ("detergents", "técnica", [("tech_select", 0.0, -12.0)]),
        ("detergents", "Regular", [("hard_pop", 0.0, -12.0)]),
        ("detergents", "detergentes", [("whoosh_flick", -0.02, -13.5), ("level_up", 0.0, -11.5)]),
        ("detergents", "inyectores", [("confirm", 0.0, -11.8)]),
        ("rule", "regla", [("shutter", 0.04, -12.2)]),
        ("rule", "tapa", [("hard_pop", 0.0, -12.0)]),
        ("rule", "87", [("snap", 0.0, -11.8)]),
        ("rule", "cientos", [("whoosh_flick", -0.06, -13.8), ("confirm", 0.0, -11.5)]),
        ("cta", "comentarios", [("tech_select", 0.0, -12.0)]),
        ("cta", "pones", [("whoosh_arrow", -0.03, -13.8), ("typing", 0.0, -12.5)]),
        ("cta", "esto", [("mouse_click", -0.06, -11.5), ("msg_pop", 0.02, -11.5)]),
    ],
    "water-chug-myth": [
        ("hook", "2", [("whoosh_flick", -0.02, -13.2), ("hard_pop", 0.0, -12.0)]),
        ("hook", "no", [("impact_hit", 0.0, -9.8), ("snap", 0.04, -12.0)]),
        ("hook", "error", [("whoosh_arrow", -0.02, -13.5), ("deny", 0.0, -11.5)]),
        ("hook", "minerales", [("impact_boom", 0.0, -9.6), ("hard_pop", 0.08, -12.0)]),
        ("sensors", "hidratación", [("tech_select", 0.0, -12.0)]),
        ("sensors", "segundos", [("tick", 0.0, -14.0), ("tock", 0.07, -14.0), ("tick", 0.14, -14.0)]),
        ("sensors", "sensores", [("whoosh_flick", -0.02, -13.5), ("electric_pop", 0.0, -11.8)]),
        ("sensors", "sangre", [("impact_hit", 0.0, -10.4)]),
        ("dilution", "electrolitos", [("electric_pop", 0.0, -11.8)]),
        ("dilution", "sanguíneo", [("whoosh_arrow", -0.02, -13.5)]),
        ("dilution", "cerebro", [("deny", 0.0, -11.5), ("hard_pop", 0.05, -12.0)]),
        ("dilution", "exceso", [("landing", 0.0, -11.8)]),
        ("kidneys", "riñones", [("tech_select", 0.0, -12.0)]),
        ("kidneys", "antidiurética", [("whoosh_flick", -0.02, -13.5), ("metal_slam", 0.0, -10.2)]),
        ("kidneys", "vejiga", [("deny", 0.0, -11.5)]),
        ("kidneys", "dos", [("impact_boom", 0.0, -10.2)]),
        ("cells", "sodio", [("electric_pop", 0.0, -11.8)]),
        ("cells", "cansado", [("riser", -0.03, -14.2), ("deny", 0.0, -11.5)]),
        ("cells", "células", [("impact_hit", 0.0, -10.2)]),
        ("rule", "verdad", [("shutter", 0.04, -12.2)]),
        ("rule", "día", [("hard_pop", 0.0, -12.0)]),
        ("rule", "comidas", [("snap", 0.0, -11.8)]),
        ("rule", "electrolitos", [("whoosh_flick", -0.06, -13.8), ("level_up", 0.0, -11.5), ("confirm", 0.06, -11.8)]),
        ("cta", "comentarios", [("tech_select", 0.0, -12.0)]),
        ("cta", "vasos", [("whoosh_arrow", -0.03, -13.8), ("typing", 0.0, -12.5)]),
        ("cta", "esto", [("mouse_click", -0.06, -11.5), ("msg_pop", 0.02, -11.5)]),
    ],
}


def build_sfx_bed(slug: str, words_json_path: Path):
    data = json.loads(words_json_path.read_text())
    dur = float(data["duration"])
    words = data["words"]
    scenes = data["scenes"]
    total_samples = int(np.ceil(dur * SR)) + SR // 2
    bed = np.zeros((total_samples, 2), dtype=np.float32)

    def place(name: str, t_sec: float, target_db: float, pan: float = 0.0):
        arr, anchor = load_sfx(name)
        gain = db_to_lin(target_db)
        l_gain = gain * min(1.0, 1.0 - pan * 0.35)
        r_gain = gain * min(1.0, 1.0 + pan * 0.35)
        start = int(round(t_sec * SR)) - anchor
        src_lo = 0
        if start < 0:
            src_lo = -start
            start = 0
        if src_lo >= len(arr) or start >= total_samples:
            return
        n = min(len(arr) - src_lo, total_samples - start)
        if n <= 0:
            return
        seg = arr[src_lo : src_lo + n]
        bed[start : start + n, 0] += seg[:, 0] * l_gain
        bed[start : start + n, 1] += seg[:, 1] * r_gain

    def cue_time(token: str, scene_id: str) -> float:
        key = norm_tok(token)
        lo, hi = 0, len(words) - 1
        for idx, sc in enumerate(scenes):
            if sc["id"] == scene_id:
                lo = sc["firstWord"]
                hi = (scenes[idx + 1]["firstWord"] - 1) if idx + 1 < len(scenes) else len(words) - 1
                break
        for i in range(lo, hi + 1):
            if norm_tok(words[i]["w"]) == key:
                return max(0.0, float(words[i]["t"]) - 0.03)
        return max(0.0, float(words[lo]["t"]) + 0.25)

    events = 0
    place("whoosh_flick", 0.06, -14.0)
    place("tech_select", 0.08, -12.5)
    events += 2

    for i in range(1, len(scenes)):
        fw = scenes[i]["firstWord"]
        mid = 0.5 * (float(words[fw - 1]["e"]) + float(words[fw]["t"]))
        w_name = "whoosh_cine" if i % 2 == 1 else "whoosh_fast"
        place(w_name, mid, -13.5, pan=0.15 if i % 2 else -0.15)
        place("thud", mid + 0.05, -13.0)
        events += 2

    for sc_id, tok, sfx_list in CUES_BY_SLUG[slug]:
        t0 = cue_time(tok, sc_id)
        for sfx_name, dt, db in sfx_list:
            place(sfx_name, t0 + dt, db)
            events += 1

    bed *= db_to_lin(2.0)
    sfx_peak = float(np.max(np.abs(bed)))
    cap = db_to_lin(-7.2)
    if sfx_peak > cap:
        bed = np.tanh(bed / cap) * cap

    return bed[: int(round(dur * SR))], events


def master_and_mux(slug: str, reel_dir: Path, mp4_path: Path):
    words_json = reel_dir / "words.json"
    voice_mp3 = reel_dir / "voice.mp3"
    bed, n_events = build_sfx_bed(slug, words_json)

    tmp_dir = Path(tempfile.mkdtemp())
    sfx_wav = tmp_dir / "sfx_bed.wav"
    voice_master_wav = tmp_dir / "voice_master.wav"
    mixed_aac = tmp_dir / "final_audio.m4a"
    out_mp4 = mp4_path.with_suffix(".mastered.mp4")

    pcm16 = np.clip(bed * 32767.0, -32768, 32767).astype(np.int16)
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", str(sfx_wav)],
        input=pcm16.tobytes(),
        check=True,
    )

    vocal_chain = (
        "highpass=f=80,"
        "equalizer=f=135:t=q:w=1.2:g=2.0,"
        "equalizer=f=3400:t=q:w=1.1:g=3.2,"
        "equalizer=f=7500:t=q:w=1.4:g=1.8,"
        "acompressor=threshold=-20dB:ratio=3.0:attack=5:release=80:makeup=2.2,"
        "volume=4.2dB,"
        "alimiter=limit=0.89:level=0"
    )
    subprocess.run(
        ["ffmpeg", "-y", "-v", "error", "-i", str(voice_mp3), "-af", vocal_chain, "-ar", str(SR), "-ac", "2", str(voice_master_wav)],
        check=True,
    )

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            str(voice_master_wav),
            "-i",
            str(sfx_wav),
            "-filter_complex",
            "[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=0:normalize=0,alimiter=limit=0.93:level=0[aout]",
            "-map",
            "[aout]",
            "-c:a",
            "aac",
            "-b:a",
            "256k",
            str(mixed_aac),
        ],
        check=True,
    )

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-v",
            "error",
            "-i",
            str(mp4_path),
            "-i",
            str(mixed_aac),
            "-map",
            "0:v:0",
            "-map",
            "1:a:0",
            "-c:v",
            "copy",
            "-c:a",
            "copy",
            "-shortest",
            str(out_mp4),
        ],
        check=True,
    )
    out_mp4.replace(mp4_path)
    print(f"✓ [{slug}] MASTERED AUDIO (-14 LUFS) + {n_events} STUDIO SFX EVENTS -> {mp4_path}")


if __name__ == "__main__":
    slug = sys.argv[1]
    reel = KF / "engine/full-visual/reels" / slug
    mp4 = Path(sys.argv[2])
    master_and_mux(slug, reel, mp4)

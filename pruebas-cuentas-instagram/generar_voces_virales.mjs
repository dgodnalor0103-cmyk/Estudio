#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { escribirJson, escribirWav, ffmpeg, leerAudio, leerJson, r3 } from "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/motor/lib/comun.mjs";

const ROOT = "/Users/rol.travel/.gemini/antigravity/scratch/pruebas-cuentas-instagram";
const ATOM = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM";
const FFMPEG_DIR = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/node_modules/@remotion/compositor-darwin-arm64";

const PROYECTOS = [
  { dir: `${ROOT}/viral-01-pantalla-es`, duracionObjetivo: 84.50 },
  { dir: `${ROOT}/viral-02-teclado-es`, duracionObjetivo: 78.57 },
  { dir: `${ROOT}/viral-03-bateria-es`, duracionObjetivo: 89.90 },
];

function calibrarDuracionExacta(dir, duracionObjetivo) {
  const SR = 48000;
  const fTiempos = join(dir, "voz", "tiempos.json");
  const fWav = join(dir, "voz", "voz.wav");
  const tiempos = leerJson(fTiempos);
  const audioOrig = leerAudio(fWav, SR);
  const N = tiempos.frases.length;

  // Extraer cada frase con margen de respiración de 35ms antes y 55ms después
  const segs = tiempos.frases.map((f, i) => {
    const prevFin = i > 0 ? tiempos.frases[i - 1].fin : 0;
    const nextIni = i + 1 < N ? tiempos.frases[i + 1].inicio : audioOrig.length / SR;
    const a = Math.max(prevFin, Math.max(0, f.inicio - 0.035));
    const b = Math.min(nextIni, Math.min(audioOrig.length / SR, f.fin + 0.055));
    const i0 = Math.max(0, Math.round(a * SR));
    const i1 = Math.min(audioOrig.length, Math.round(b * SR));
    return {
      a,
      b,
      dur: (i1 - i0) / SR,
      muestras: audioOrig.subarray(i0, i1),
    };
  });

  const sumaHabla = segs.reduce((acc, s) => acc + s.dur, 0);
  const colaFinal = 1.10;
  const startOffset = 0.06;
  const finHablaObjetivo = duracionObjetivo - colaFinal - startOffset;

  const pausaCompacta = 0.16;
  const durCompacta = sumaHabla + (N - 1) * pausaCompacta;

  let factor = 1.0;
  let pausaFinal = pausaCompacta;

  if (durCompacta > finHablaObjetivo) {
    // Usar WSOLA (ffmpeg atempo) sobre el bloque compacto para preservar el tono de voz al 100%
    factor = finHablaObjetivo / durCompacta;
  } else {
    pausaFinal = (finHablaObjetivo - sumaHabla) / Math.max(1, N - 1);
  }

  // Armar el audio compacto con pausas antes de aplicar atempo (si factor < 1)
  const durPre = sumaHabla + (N - 1) * pausaFinal;
  const muestrasPre = new Float32Array(Math.ceil((durPre + 0.1) * SR));
  const offsetsPre = [];
  let curPre = 0;

  for (let i = 0; i < N; i++) {
    offsetsPre.push(curPre);
    const m = segs[i].muestras;
    const idx0 = Math.round(curPre * SR);
    for (let k = 0; k < m.length && idx0 + k < muestrasPre.length; k++) {
      muestrasPre[idx0 + k] = m[k];
    }
    curPre += segs[i].dur + (i + 1 < N ? pausaFinal : 0);
  }

  let muestrasEsc = muestrasPre;
  if (factor < 0.999) {
    const tmpIn = join(dir, "voz", "_tmp_pre.wav");
    const tmpOut = join(dir, "voz", "_tmp_esc.wav");
    escribirWav(tmpIn, muestrasPre, SR);
    const atempo = Math.min(2.0, Math.max(0.5, 1 / factor));
    ffmpeg(["-i", tmpIn, "-filter:a", `atempo=${atempo.toFixed(6)}`, "-ar", String(SR), "-ac", "1", tmpOut]);
    muestrasEsc = leerAudio(tmpOut, SR);
    rmSync(tmpIn, { force: true });
    rmSync(tmpOut, { force: true });
  }

  const totalMuestras = Math.round((duracionObjetivo + 0.05) * SR);
  const nuevoAudio = new Float32Array(totalMuestras);
  const idxStart = Math.round(startOffset * SR);
  for (let k = 0; k < muestrasEsc.length && idxStart + k < totalMuestras; k++) {
    nuevoAudio[idxStart + k] = muestrasEsc[k];
  }

  const nuevasFrases = [];
  const nuevasPalabras = [];

  for (let i = 0; i < N; i++) {
    const fOrig = tiempos.frases[i];
    const seg = segs[i];
    const basePre = offsetsPre[i];
    const mapearT = (tOrig) => r3(startOffset + (basePre + (tOrig - seg.a)) * factor);

    nuevasFrases.push({
      ...fOrig,
      inicio: mapearT(fOrig.inicio),
      fin: mapearT(fOrig.fin),
    });

    for (const w of tiempos.palabras) {
      if (w.frase === fOrig.n) {
        nuevasPalabras.push({
          ...w,
          inicio: mapearT(w.inicio),
          fin: mapearT(w.fin),
        });
      }
    }
  }

  escribirWav(fWav, nuevoAudio, SR);
  const nuevoTiempos = {
    ...tiempos,
    duracion: duracionObjetivo,
    frases: nuevasFrases,
    palabras: nuevasPalabras,
  };
  escribirJson(fTiempos, nuevoTiempos);

  return {
    duracionOriginal: tiempos.duracion,
    duracionCalibrada: duracionObjetivo,
    pausaEntreFrases: r3(pausaFinal * factor),
    atempo: r3(1 / factor),
    frases: nuevasFrases.map((f) => ({ n: f.n, inicio: f.inicio, fin: f.fin, clave: f.clave, texto: f.texto })),
  };
}

const rehacer = process.argv.includes("--rehacer");
const resultados = [];
for (const { dir, duracionObjetivo } of PROYECTOS) {
  const args = [`${ATOM}/motor/voz.mjs`, dir];
  if (rehacer) args.push("--rehacer");
  const r = spawnSync("/usr/local/bin/node", args, {
    cwd: ATOM,
    env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR },
    encoding: "utf8",
  });
  let cal = null;
  if (r.status === 0) {
    cal = calibrarDuracionExacta(dir, duracionObjetivo);
  }
  resultados.push({
    proyecto: dir.split("/").pop(),
    status: r.status,
    calibracion: cal,
    stderr: r.stderr,
  });
}

writeFileSync(`${ROOT}/.cola/voces_virales_res.json`, JSON.stringify(resultados, null, 2));
console.log("Voces calibradas con atempo:", resultados.map((x) => `${x.proyecto}:${x.status} (${x.calibracion?.duracionOriginal}s -> ${x.calibracion?.duracionCalibrada}s, atempo=${x.calibracion?.atempo})`).join(", "));

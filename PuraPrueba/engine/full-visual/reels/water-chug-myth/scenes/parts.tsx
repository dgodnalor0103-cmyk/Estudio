// Kit Visual V3 Extra-Dynamic Híbrido (PuraPrueba Ilustraciones 16:9 + ATOM 60 fps · Multi-Red 1080x1920).
import React from "react";
import { Img, OffthreadVideo, staticFile } from "remotion";
import { arrive, ease, pop, prog, useScene } from "../../../src/engine";

export const SLUG = "water-chug-myth";
export const DEFAULT_ICON: "battery" | "cpu" | "radar" | "droplet" = "droplet";
export const asset = (name: string) => staticFile(`${SLUG}/${name}`);
export const STAGE = { left: 108, width: 864, safeWidth: 864, top: 522, bottom: 1450, cx: 540 };

export const TECH = {
  crimson: "#FF1E56",
  crimsonGlow: "rgba(255, 30, 86, 0.42)",
  crimsonSoft: "rgba(255, 30, 86, 0.20)",
  amber: "#FFB800",
  amberGlow: "rgba(255, 184, 0, 0.38)",
  amberSoft: "rgba(255, 184, 0, 0.20)",
  cyan: "#00D2FF",
  cyanBright: "#00F0FF",
  cyanGlow: "rgba(0, 240, 255, 0.40)",
  cyanSoft: "rgba(0, 210, 255, 0.18)",
  emerald: "#00E699",
  emeraldGlow: "rgba(0, 230, 153, 0.42)",
  emeraldSoft: "rgba(0, 230, 153, 0.20)",
  darkCard: "#0E1626",
  darkDeep: "#070B14",
  lightCard: "#FFFFFF",
  borderDark: "rgba(148, 163, 184, 0.26)",
  borderLight: "#CBD5E1",
};

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/**
 * Rig de impacto cinético V3: flotación continua de cámara a 60 fps + micro-sacudida y golpe de zoom en acentos.
 */
export const ImpactRig: React.FC<{ triggers: number[]; intensity?: number; children: React.ReactNode }> = ({
  triggers,
  intensity = 10,
  children,
}) => {
  const { f } = useScene();
  let dx = Math.cos(f * 0.048) * 1.8;
  let dy = Math.sin(f * 0.058) * 2.4;
  let boost = 0;
  for (const t of triggers) {
    const dt = f - t;
    if (dt >= 0 && dt <= 14) {
      const decay = Math.exp(-dt * 0.26);
      dx += Math.sin(dt * 2.45) * intensity * decay;
      dy += Math.cos(dt * 3.15) * (intensity * 0.78) * decay;
      boost = Math.max(boost, 0.022 * decay);
    }
  }
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${dx.toFixed(2)}px, ${dy.toFixed(2)}px) scale(${(1 + boost).toFixed(4)})`,
        transformOrigin: "540px 980px",
      }}
    >
      {children}
    </div>
  );
};

/**
 * Onda expansiva de choque + 14 chispas radiales a 60 fps en golpes visuales.
 */
export const ShockwaveBurst: React.FC<{ at: number; x?: number; y?: number; color?: string; size?: number }> = ({
  at,
  x = 540,
  y = 840,
  color = TECH.cyanBright,
  size = 250,
}) => {
  const { f } = useScene();
  const dt = f - at;
  if (dt < 0 || dt > 24) return null;
  const p = prog(f, at, 22, ease.out);
  const fade = 1 - prog(f, at + 5, 19, ease.in);
  const r = lerp(24, size, p);

  return (
    <svg
      width={size * 2.4}
      height={size * 2.4}
      viewBox={`${-size * 1.2} ${-size * 1.2} ${size * 2.4} ${size * 2.4}`}
      style={{
        position: "absolute",
        left: x - size * 1.2,
        top: y - size * 1.2,
        pointerEvents: "none",
        zIndex: 40,
        opacity: fade,
      }}
    >
      <circle cx={0} cy={0} r={r} fill="none" stroke={color} strokeWidth={lerp(13, 2, p)} />
      <circle cx={0} cy={0} r={r * 0.68} fill="none" stroke="#FFFFFF" strokeWidth={lerp(6.5, 1, p)} opacity={0.8} />
      {Array.from({ length: 14 }).map((_, i) => {
        const ang = (i / 14) * Math.PI * 2 + 0.2;
        const r1 = lerp(18, size * 0.64, p);
        const r2 = lerp(44, size * 1.1, p);
        return (
          <line
            key={i}
            x1={Math.cos(ang) * r1}
            y1={Math.sin(ang) * r1}
            x2={Math.cos(ang) * r2}
            y2={Math.sin(ang) * r2}
            stroke={i % 2 === 0 ? color : "#FFFFFF"}
            strokeWidth={lerp(6, 2, p)}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

const NODES = [
  { x: 115, y: 555, r: 24, sp: 0.068, ph: 0.3, c: "rgba(0, 240, 255, 0.32)" },
  { x: 940, y: 615, r: 28, sp: 0.058, ph: 1.5, c: "rgba(255, 30, 86, 0.32)" },
  { x: 145, y: 980, r: 21, sp: 0.074, ph: 2.8, c: "rgba(0, 230, 153, 0.32)" },
  { x: 920, y: 1055, r: 26, sp: 0.064, ph: 3.9, c: "rgba(0, 240, 255, 0.32)" },
  { x: 215, y: 1385, r: 24, sp: 0.054, ph: 4.7, c: "rgba(255, 184, 0, 0.30)" },
  { x: 865, y: 1400, r: 22, sp: 0.069, ph: 5.5, c: "rgba(0, 230, 153, 0.30)" },
];

/**
 * Atmósfera neón V3 con partículas ascendentes a 60 fps + haces diagonales dinámicos.
 */
export const TechLabBackdrop: React.FC<{ alert?: boolean; emerald?: boolean }> = ({
  alert = false,
  emerald = false,
}) => {
  const { f, scene } = useScene();
  const dark = scene.ground === "dark";
  const breath = 0.9 + 0.14 * Math.sin(f * 0.105);
  const glow = alert
    ? "radial-gradient(circle, rgba(255,30,86,0.32) 0%, rgba(255,184,0,0.14) 44%, rgba(0,0,0,0) 72%)"
    : emerald
      ? "radial-gradient(circle, rgba(0,230,153,0.28) 0%, rgba(0,240,255,0.13) 46%, rgba(0,0,0,0) 72%)"
      : dark
        ? "radial-gradient(circle, rgba(0,240,255,0.27) 0%, rgba(0,230,153,0.12) 46%, rgba(0,0,0,0) 72%)"
        : "radial-gradient(circle, rgba(0,210,255,0.21) 0%, rgba(0,230,153,0.11) 46%, rgba(255,255,255,0) 74%)";

  const beamShift = ((f * 3.2) % 1400) - 320;
  const particleCol = alert ? "#FF1E56" : emerald ? "#00E699" : "#00D2FF";

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 490,
          width: 940,
          height: 960,
          background: glow,
          transform: `scale(${breath.toFixed(4)})`,
        }}
      />
      {/* Haz diagonal energético suave en movimiento continuo */}
      <div
        style={{
          position: "absolute",
          left: -200,
          top: beamShift,
          width: 1480,
          height: 190,
          transform: "rotate(-18deg)",
          background: alert
            ? "linear-gradient(180deg, rgba(255,30,86,0) 0%, rgba(255,30,86,0.09) 50%, rgba(255,30,86,0) 100%)"
            : emerald
              ? "linear-gradient(180deg, rgba(0,230,153,0) 0%, rgba(0,230,153,0.09) 50%, rgba(0,230,153,0) 100%)"
              : "linear-gradient(180deg, rgba(0,210,255,0) 0%, rgba(0,210,255,0.08) 50%, rgba(0,210,255,0) 100%)",
        }}
      />
      {NODES.map((p, idx) => {
        const dx = Math.sin(f * p.sp + p.ph) * 44;
        const dy = Math.cos(f * p.sp * 0.95 + p.ph) * 46;
        const op = 0.62 + 0.38 * Math.sin(f * 0.12 + idx);
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: p.x + dx,
              top: p.y + dy,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: 999,
              background: alert && idx % 2 === 0 ? "rgba(255, 30, 86, 0.38)" : p.c,
              filter: "blur(4px)",
              opacity: op,
            }}
          />
        );
      })}
      {/* 16 partículas bokeh ascendentes a 60 fps en los márgenes del laboratorio */}
      {Array.from({ length: 16 }).map((_, i) => {
        const cycle = ((f * (1.5 + (i % 4) * 0.42) + i * 73) % 1020) / 1020;
        const sideLeft = i % 2 === 0;
        const baseX = sideLeft ? 24 + ((i * 29) % 76) : 980 + ((i * 31) % 76);
        const x = baseX + Math.sin(f * 0.09 + i) * 14;
        const y = lerp(1520, 460, cycle);
        const sz = 6 + (i % 3) * 3.5;
        return (
          <div
            key={`bk-${i}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: 999,
              background: particleCol,
              boxShadow: `0 0 12px ${particleCol}`,
              opacity: (1 - Math.abs(cycle - 0.5) * 1.7) * (dark ? 0.65 : 0.42),
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Brasas térmicas ascendentes + pulso de alerta roja a 60 fps.
 */
export const ThermalEmbersOverlay: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const { f } = useScene();
  if (!active) return null;
  const pulse = 0.45 + 0.35 * Math.sin(f * 0.18);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 48px rgba(255, 30, 86, ${pulse.toFixed(3)})`,
        }}
      />
      {Array.from({ length: 16 }).map((_, i) => {
        const seed = i * 61.7;
        const cycle = ((f * (2.1 + (i % 4) * 0.5) + seed) % 220) / 220;
        const x = 36 + ((i * 67) % 788) + Math.sin(f * 0.14 + i) * 26;
        const y = lerp(405, -20, cycle);
        const sz = 7 + (i % 4) * 3.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: 999,
              background: i % 2 === 0 ? "#FF1E56" : "#FFB800",
              boxShadow: `0 0 14px ${i % 2 === 0 ? "#FF1E56" : "#FFB800"}`,
              opacity: (1 - cycle) * 0.94,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Cristales criogénicos flotantes a 60 fps para suspensión en RAM.
 */
export const CryoFrostOverlay: React.FC<{ active?: boolean }> = ({ active = true }) => {
  const { f } = useScene();
  if (!active) return null;
  const pulse = 0.38 + 0.26 * Math.sin(f * 0.13);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: `inset 0 0 46px rgba(0, 240, 255, ${pulse.toFixed(3)})`,
        }}
      />
      {Array.from({ length: 16 }).map((_, i) => {
        const seed = i * 53.3;
        const cycle = ((f * (1.15 + (i % 3) * 0.36) + seed) % 240) / 240;
        const x = 42 + ((i * 63) % 780) + Math.sin(f * 0.1 + i) * 20;
        const y = lerp(-16, 404, cycle);
        const sz = 8 + (i % 4) * 3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: sz,
              height: sz,
              borderRadius: i % 2 === 0 ? 4 : 999,
              transform: `rotate(${(f * 1.8 + i * 25).toFixed(1)}deg)`,
              background: i % 2 === 0 ? "#E0F2FE" : "#00F0FF",
              boxShadow: "0 0 14px #00F0FF",
              opacity: (1 - Math.abs(cycle - 0.5) * 1.6) * 0.9,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Matriz de paquetes de red / anillos de rastreo a 60 fps (Modo Incógnito / ISP / Huella Digital).
 */
export const RadarMatrixOverlay: React.FC<{ active?: boolean; alert?: boolean }> = ({
  active = true,
  alert = true,
}) => {
  const { f } = useScene();
  if (!active) return null;
  const col = alert ? TECH.crimson : TECH.emerald;
  const ringP = (f % 54) / 54;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: lerp(70, 560, ringP),
          height: lerp(70, 560, ringP),
          transform: "translate(-50%, -50%)",
          borderRadius: 999,
          border: `3px solid ${col}`,
          opacity: (1 - ringP) * 0.72,
        }}
      />
      {Array.from({ length: 14 }).map((_, i) => {
        const cycle = ((f * (2.2 + (i % 4) * 0.4) + i * 47) % 240) / 240;
        const x = lerp(-30, 880, cycle);
        const y = 34 + ((i * 53) % 344) + Math.sin(f * 0.14 + i) * 10;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 24 + (i % 3) * 12,
              height: 4,
              borderRadius: 99,
              background: i % 2 === 0 ? col : "#00F0FF",
              boxShadow: `0 0 12px ${col}`,
              opacity: 0.78,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Gotas de humedad / esporas de almidón y corrosión a 60 fps (Celular Mojado en Arroz).
 */
export const WaterCorrosionOverlay: React.FC<{ active?: boolean; mode?: "water" | "starch" | "air" }> = ({
  active = true,
  mode = "water",
}) => {
  const { f } = useScene();
  if (!active) return null;
  const col = mode === "starch" ? "#FDE047" : mode === "air" ? "#00E699" : "#00F0FF";
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {Array.from({ length: 16 }).map((_, i) => {
        const cycle = ((f * (1.8 + (i % 4) * 0.45) + i * 59) % 220) / 220;
        const x =
          mode === "air"
            ? lerp(-30, 890, cycle)
            : 40 + ((i * 61) % 784) + Math.sin(f * 0.12 + i) * 18;
        const y =
          mode === "air"
            ? 38 + ((i * 49) % 340) + Math.sin(f * 0.16 + i) * 12
            : mode === "starch"
              ? lerp(398, -14, cycle)
              : lerp(-18, 406, cycle);
        const w = mode === "air" ? 38 : 8 + (i % 3) * 3.5;
        const h = mode === "air" ? 4 : mode === "water" ? 14 + (i % 3) * 4 : 8 + (i % 3) * 3.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: h,
              borderRadius: 999,
              background: col,
              boxShadow: `0 0 12px ${col}`,
              opacity: (1 - Math.abs(cycle - 0.5) * 1.4) * 0.85,
            }}
          />
        );
      })}
    </div>
  );
};

/**
 * Arcos eléctricos animados en SVG a 60 fps.
 */
export const ElectricArcOverlay: React.FC<{ active?: boolean; color?: string }> = ({
  active = true,
  color = TECH.cyanBright,
}) => {
  const { f } = useScene();
  if (!active) return null;
  const mkBolt = (yBase: number, phase: number) => {
    const pts: string[] = [];
    for (let s = 0; s <= 8; s++) {
      const x = 40 + s * 98;
      const jit = s === 0 || s === 8 ? 0 : Math.sin(f * 0.72 + s * 2.1 + phase) * 28;
      pts.push(`${x.toFixed(1)},${(yBase + jit).toFixed(1)}`);
    }
    return pts.join(" ");
  };
  const showA = f % 5 !== 0;
  const showB = (f + 2) % 6 !== 0;
  return (
    <svg
      width={864}
      height={416}
      viewBox="0 0 864 416"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.88 }}
    >
      {showA && (
        <polyline
          points={mkBolt(190, 0.4)}
          fill="none"
          stroke={color}
          strokeWidth={4.5}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 10px ${color})` }}
        />
      )}
      {showB && (
        <polyline
          points={mkBolt(234, 2.7)}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.82}
        />
      )}
    </svg>
  );
};

/**
 * Esquinas HUD luminosas con pulso energético.
 */
const HudCorners: React.FC<{ color: string }> = ({ color }) => {
  const s = 28;
  const b = `4.5px solid ${color}`;
  return (
    <>
      <div style={{ position: "absolute", left: 10, top: 10, width: s, height: s, borderLeft: b, borderTop: b, borderTopLeftRadius: 10, pointerEvents: "none", zIndex: 18 }} />
      <div style={{ position: "absolute", right: 10, top: 10, width: s, height: s, borderRight: b, borderTop: b, borderTopRightRadius: 10, pointerEvents: "none", zIndex: 18 }} />
      <div style={{ position: "absolute", left: 10, bottom: 10, width: s, height: s, borderLeft: b, borderBottom: b, borderBottomLeftRadius: 10, pointerEvents: "none", zIndex: 18 }} />
      <div style={{ position: "absolute", right: 10, bottom: 10, width: s, height: s, borderRight: b, borderBottom: b, borderBottomRightRadius: 10, pointerEvents: "none", zIndex: 18 }} />
    </>
  );
};

/**
 * Icono HUD animado a 60 fps adaptable por episodio (battery | cpu | radar | droplet).
 */
export const TelemetryPulseIcon: React.FC<{
  pct: number;
  status: "safe" | "warn" | "myth";
  kind?: "battery" | "cpu" | "radar" | "droplet";
}> = ({ pct, status, kind = DEFAULT_ICON }) => {
  const { f } = useScene();
  const pulse = 1 + 0.09 * Math.sin(f * 0.18);
  const col = status === "myth" || status === "warn" ? TECH.crimson : pct >= 70 || pct <= 5 ? TECH.emerald : TECH.cyanBright;

  return (
    <div style={{ width: 68, height: 64, flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={68} height={64} viewBox="0 0 100 94" style={{ display: "block", overflow: "visible" }}>
        <g transform={`translate(50,47) scale(${pulse.toFixed(3)}) translate(-50,-47)`}>
          {kind === "battery" && (
            <>
              <rect x="8" y="21" width="76" height="52" rx="12" fill="none" stroke={col} strokeWidth="6.5" />
              <rect x="88" y="35" width="7" height="24" rx="3.5" fill={col} />
              <rect x="16" y="29" width={Math.max(8, Math.min(60, (60 * pct) / 100))} height="36" rx="7" fill={col} />
            </>
          )}
          {kind === "cpu" && (
            <>
              <rect x="20" y="17" width="60" height="60" rx="13" fill="none" stroke={col} strokeWidth="6.5" />
              <rect x="33" y="30" width="34" height="34" rx="7" fill={col} opacity={0.92} />
              {[32, 50, 68].map((pos) => (
                <React.Fragment key={pos}>
                  <line x1={pos} y1="5" x2={pos} y2="17" stroke={col} strokeWidth="5.5" strokeLinecap="round" />
                  <line x1={pos} y1="77" x2={pos} y2="89" stroke={col} strokeWidth="5.5" strokeLinecap="round" />
                  <line x1="8" y1={pos - 3} x2="20" y2={pos - 3} stroke={col} strokeWidth="5.5" strokeLinecap="round" />
                  <line x1="80" y1={pos - 3} x2="92" y2={pos - 3} stroke={col} strokeWidth="5.5" strokeLinecap="round" />
                </React.Fragment>
              ))}
            </>
          )}
          {kind === "radar" && (
            <>
              <path
                d="M 10 47 Q 50 10 90 47 Q 50 84 10 47 Z"
                fill="none"
                stroke={col}
                strokeWidth="6.5"
                strokeLinejoin="round"
              />
              <circle cx={50 + Math.sin(f * 0.14) * 5} cy={47} r="15" fill={col} />
              <circle cx={50 + Math.sin(f * 0.14) * 5} cy={47} r="6" fill="#070B14" />
            </>
          )}
          {kind === "droplet" && (
            <>
              <path
                d="M 50 10 C 50 10 82 44 82 62 A 32 32 0 0 1 18 62 C 18 44 50 10 50 10 Z"
                fill="none"
                stroke={col}
                strokeWidth="6.5"
              />
              <circle cx="50" cy="61" r="14" fill={col} opacity={0.9} />
            </>
          )}
        </g>
      </svg>
    </div>
  );
};

/**
 * Barra superior continua de Telemetría HUD V3 (una sola línea garantizada + barrido luminoso a 60 fps).
 */
export const TechTelemetryStrip: React.FC<{
  at: number;
  label: string;
  verdict: string;
  pct: number;
  unit?: string;
  status?: "safe" | "warn" | "myth";
  iconKind?: "battery" | "cpu" | "radar" | "droplet";
}> = ({ at, label, verdict, pct, unit = "%", status = "safe", iconKind }) => {
  const { f, theme, ground, scene } = useScene();
  const dark = scene.ground === "dark";
  const k = arrive(f, at, 14);
  const y = (1 - k) * -68;
  const clamped = Math.max(0, Math.min(100, pct));

  const accent = status === "myth" || status === "warn" ? TECH.crimson : TECH.emerald;
  const badgeBg = status === "myth" || status === "warn" ? TECH.crimson : TECH.emerald;
  const badgeInk = status === "myth" || status === "warn" ? "#FFFFFF" : "#042217";
  const barBg =
    status === "myth" || status === "warn"
      ? "linear-gradient(90deg, #FFB800 0%, #FF1E56 100%)"
      : "linear-gradient(90deg, #00F0FF 0%, #00E699 100%)";

  const shimmerLeft = lerp(-30, 120, (f % 54) / 54);

  return (
    <div
      style={{
        position: "absolute",
        left: STAGE.left,
        top: 526,
        width: STAGE.safeWidth,
        height: 96,
        borderRadius: 24,
        padding: "0 22px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 16,
        background: dark ? "rgba(14, 22, 38, 0.96)" : TECH.lightCard,
        boxShadow: dark
          ? `0 18px 44px rgba(0,0,0,0.58), 0 0 24px ${status === "warn" ? "rgba(255,30,86,0.24)" : "rgba(0,240,255,0.18)"}, inset 0 0 0 2.5px ${accent}`
          : `0 16px 38px rgba(15, 23, 42, 0.11), inset 0 0 0 2.5px ${accent}`,
        opacity: prog(f, at, 4, ease.linear),
        transform: `translateY(${y.toFixed(1)}px)`,
        zIndex: 15,
      }}
    >
      <TelemetryPulseIcon pct={clamped} status={status} kind={iconKind} />

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <span
            style={{
              fontFamily: theme.font.ui,
              fontSize: 31,
              fontWeight: 800,
              color: ground.ink,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "none" }}>
            <span
              style={{
                padding: "3px 14px",
                borderRadius: 999,
                background: badgeBg,
                color: badgeInk,
                fontFamily: theme.font.mono,
                fontSize: 30,
                fontWeight: 800,
                whiteSpace: "nowrap",
              }}
            >
              {verdict}
            </span>
            <span
              style={{
                fontFamily: theme.font.mono,
                fontSize: 33,
                fontWeight: 800,
                fontVariantNumeric: "tabular-nums",
                color: status === "warn" ? TECH.crimson : dark ? TECH.emerald : "#059669",
                whiteSpace: "nowrap",
              }}
            >
              {Math.round(clamped)}
              {unit}
            </span>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: 14,
            borderRadius: 999,
            background: dark ? "rgba(255,255,255,0.12)" : "#E2E8F0",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "relative",
              width: `${Math.max(clamped, 8)}%`,
              height: "100%",
              borderRadius: 999,
              background: barBg,
              boxShadow: `0 0 14px ${accent}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${shimmerLeft.toFixed(1)}%`,
                width: "34%",
                background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.65) 50%, rgba(255,255,255,0) 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Sello cinético tipo golpe con micro-vibración viva a 60 fps.
 */
export const KineticStamp: React.FC<{
  at: number;
  text: string;
  bg?: string;
  ink?: string;
  tilt?: number;
  bottom?: number;
}> = ({ at, text, bg = TECH.emerald, ink = "#042217", tilt = -2.4, bottom = 14 }) => {
  const { f, theme } = useScene();
  if (f < at) return null;
  const p = prog(f, at, 9, ease.out);
  const breath = 1 + 0.016 * Math.sin((f - at) * 0.16);
  const sc = lerp(1.52, 1.0, p) * breath;
  return (
    <div
      style={{
        position: "absolute",
        left: 18,
        bottom,
        maxWidth: 645,
        padding: "9px 20px",
        borderRadius: 16,
        background: bg,
        boxShadow: `0 12px 30px rgba(0,0,0,0.62), 0 0 24px ${bg}, inset 0 0 0 2.5px rgba(255,255,255,0.48)`,
        fontFamily: theme.font.ui,
        fontSize: 31,
        fontWeight: 900,
        color: ink,
        whiteSpace: "nowrap",
        transform: `rotate(${tilt}deg) scale(${sc.toFixed(3)})`,
        transformOrigin: "left bottom",
        zIndex: 17,
      }}
    >
      {text}
    </div>
  );
};

/**
 * Encabezado de tarjeta de evidencia técnica (una sola línea limpia).
 */
export const EvidenceHeader: React.FC<{
  tag: string;
  title: string;
  rightText: string;
  accent?: string;
}> = ({ tag, title, rightText, accent = TECH.cyan }) => {
  const { theme, ground, scene } = useScene();
  const dark = scene.ground === "dark";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        paddingBottom: 12,
        borderBottom: `2px solid ${dark ? "rgba(148,163,184,0.22)" : "#E2E8F0"}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <span
          style={{
            padding: "5px 14px",
            borderRadius: 12,
            background: accent,
            color: accent === TECH.emerald || accent === TECH.amber || accent === TECH.cyanBright ? "#041622" : "#FFFFFF",
            fontFamily: theme.font.mono,
            fontSize: 30,
            fontWeight: 900,
            whiteSpace: "nowrap",
            flex: "none",
          }}
        >
          {tag}
        </span>
        <span
          style={{
            fontFamily: theme.font.ui,
            fontSize: 33,
            fontWeight: 800,
            color: ground.ink,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </span>
      </div>
      <span
        style={{
          fontFamily: theme.font.mono,
          fontSize: 31,
          fontWeight: 900,
          color: accent,
          whiteSpace: "nowrap",
          flex: "none",
        }}
      >
        {rightText}
      </span>
    </div>
  );
};

/**
 * Escenario Híbrido V3 Extra-Dinámico (PuraPrueba Ilustraciones 16:9 + Video Animado ATOM 60 fps):
 * - Cámara cine viva 60 fps (paneo + zoom respiratorio + golpes de zoom rítmicos en palabras clave `punches`).
 * - 3 a 4 cambios visuales por escena: Ilustración A + PiP flotante ATOM -> Barrido láser a ATOM 60fps ->
 *   Pantalla Dividida con costura láser respiratoria (45%..55%) y orbe de plasma vertical!
 */
export const AtomHybridStage: React.FC<{
  srcA: string;
  srcB: string;
  atomSrc?: string;
  at: number;
  atomAt: number;
  splitAt: number;
  climaxAt?: number;
  punches?: number[];
  startWithAtom?: boolean;
  top?: number;
  height?: number;
  accentA?: string;
  accentAtom?: string;
  accentB?: string;
  vfx?: React.ReactNode;
  children?: React.ReactNode;
}> = ({
  srcA,
  srcB,
  atomSrc = "atom-upper.mp4",
  at,
  atomAt,
  splitAt,
  climaxAt,
  punches = [],
  startWithAtom = false,
  top = 632,
  height = 416,
  accentA = TECH.cyanBright,
  accentAtom = TECH.emerald,
  accentB = TECH.crimson,
  vfx,
  children,
}) => {
  const { f, theme, scene } = useScene();
  const dark = scene.ground === "dark";
  const kIn = arrive(f, at, 14);
  const yEnter = (1 - kIn) * 108;

  const kAtom = prog(f, atomAt - 2, 11, ease.out);
  const kSplit = prog(f, splitAt - 2, 11, ease.out);

  const inSplit = f >= splitAt - 2;
  const inAtom = f >= atomAt - 2;
  const activeAccent = inSplit ? accentB : inAtom ? accentAtom : accentA;

  // Golpes de zoom elásticos en cambios de etapa + acentos de voz
  const allPunches = [atomAt - 2, splitAt - 2, ...(climaxAt ? [climaxAt - 2] : []), ...punches];
  let punchZoom = 0;
  for (const pt of allPunches) {
    const dt = f - pt;
    if (dt >= 0 && dt <= 15) {
      punchZoom = Math.max(punchZoom, 0.082 * Math.exp(-dt * 0.25));
    }
  }

  // Movimiento continuo de cámara cine a 60 fps
  const cineScA = 1.08 + 0.032 * Math.sin(f * 0.088) + punchZoom;
  const cineTxA = 11 * Math.sin(f * 0.064);
  const cineTyA = 6 * Math.cos(f * 0.078);
  const cineRot = 0.45 * Math.sin(f * 0.052);

  const cineScAtom = 1.045 + 0.024 * Math.sin(f * 0.095 + 1.1) + punchZoom * 0.85;
  const cineTxAtom = 7 * Math.cos(f * 0.072);
  const cineTyAtom = 4.5 * Math.sin(f * 0.084);

  const cineScB = 1.085 + 0.03 * Math.cos(f * 0.09 + 0.7) + punchZoom;
  const cineTxB = -10 * Math.sin(f * 0.068);
  const cineTyB = 5.5 * Math.sin(f * 0.082);

  // Costura divisoria viva que respira entre 44.8% y 55.2% a 60 fps + orbe láser vertical
  const splitSwing = 5.2 * Math.sin((f - splitAt) * 0.115) * kSplit;
  const leftSplitPct = lerp(100, 50 + splitSwing, kSplit);
  const rightSplitPct = 100 - leftSplitPct;

  const startSwing = 5.2 * Math.sin((f - atomAt) * 0.115) * kAtom;
  const leftStartPct = lerp(100, 50 + startSwing, kAtom);
  const rightStartPct = 100 - leftStartPct;

  const orbY = 50 + 40 * Math.sin(f * 0.17);
  const pipBobY = 6.5 * Math.sin(f * 0.13);
  const pipRot = 0.9 * Math.sin(f * 0.085);
  const liveDotOp = 0.45 + 0.55 * Math.sin(f * 0.24);

  const flashAtom = inAtom && !inSplit ? (1 - prog(f, atomAt - 2, 10, ease.out)) * 0.56 : 0;
  const flashSplit = inSplit ? (1 - prog(f, splitAt - 2, 11, ease.out)) * 0.64 : 0;
  const flashClimax =
    climaxAt && f >= climaxAt - 2 ? (1 - prog(f, climaxAt - 2, 10, ease.out)) * 0.52 : 0;
  const flash = Math.max(flashAtom, flashSplit, flashClimax);

  const cycle = ((f - scene.from + 120) % 62) / 62;
  const scanX = lerp(-35, 125, cycle);
  const wipePct = kAtom * 118;

  const seamActive = !startWithAtom ? kSplit > 0.04 : kAtom > 0.04;
  const seamLeftPct = !startWithAtom ? leftSplitPct : leftStartPct;
  const seamColor = !startWithAtom ? accentB : inSplit ? accentB : accentA;

  return (
    <div
      style={{
        position: "absolute",
        left: STAGE.left,
        top,
        width: STAGE.safeWidth,
        height,
        borderRadius: 28,
        overflow: "hidden",
        background: "#070B14",
        boxShadow: dark
          ? `0 24px 58px rgba(0,0,0,0.66), 0 0 32px ${inSplit ? "rgba(255,30,86,0.28)" : "rgba(0,240,255,0.24)"}, inset 0 0 0 3.5px ${activeAccent}`
          : `0 22px 52px rgba(15, 23, 42, 0.18), inset 0 0 0 3.5px ${activeAccent}`,
        opacity: prog(f, at, 4, ease.linear),
        transform: `translateY(${yEnter.toFixed(1)}px)`,
      }}
    >
      {!startWithAtom ? (
        <>
          {/* Tiempo 1: Ilustración A con cámara cine viva */}
          {kAtom < 0.99 && (
            <Img
              src={asset(srcA)}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: `scale(${cineScA.toFixed(4)}) translate(${cineTxA.toFixed(2)}px, ${cineTyA.toFixed(2)}px) rotate(${cineRot.toFixed(2)}deg)`,
              }}
            />
          )}

          {/* Monitor PiP ATOM flotante durante Tiempo 1 */}
          {!inAtom && (
            <div
              style={{
                position: "absolute",
                right: 16,
                bottom: 14,
                width: 252,
                height: 122,
                borderRadius: 18,
                overflow: "hidden",
                background: "#050914",
                boxShadow: `0 14px 34px rgba(0,0,0,0.78), 0 0 20px rgba(0,240,255,0.32), 0 0 0 3px ${accentAtom}`,
                zIndex: 14,
                transform: `translateY(${pipBobY.toFixed(2)}px) rotate(${pipRot.toFixed(2)}deg) scale(${lerp(0.82, 1, prog(f, at + 3, 11, ease.out)).toFixed(3)})`,
              }}
            >
              <OffthreadVideo
                src={asset(atomSrc)}
                muted
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 8,
                  top: 7,
                  padding: "2px 9px",
                  borderRadius: 99,
                  background: "rgba(5, 10, 20, 0.90)",
                  border: `1.5px solid ${accentAtom}`,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontFamily: theme.font.mono,
                  fontSize: 15,
                  fontWeight: 900,
                  color: accentAtom,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 99,
                    background: accentAtom,
                    opacity: liveDotOp,
                  }}
                />
                ATOM 60FPS
              </div>
            </div>
          )}

          {/* Tiempo 2 (Pantalla completa ATOM) -> Tiempo 3 (Mitad izquierda viva en Split) */}
          {kAtom > 0 && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: `${leftSplitPct.toFixed(2)}%`,
                overflow: "hidden",
                clipPath:
                  kAtom < 0.99
                    ? `polygon(0% 0%, ${wipePct.toFixed(1)}% 0%, ${Math.max(0, wipePct - 14).toFixed(1)}% 100%, 0% 100%)`
                    : undefined,
              }}
            >
              <OffthreadVideo
                src={asset(atomSrc)}
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transform: `scale(${cineScAtom.toFixed(4)}) translate(${cineTxAtom.toFixed(2)}px, ${cineTyAtom.toFixed(2)}px)`,
                }}
              />
            </div>
          )}

          {/* Haz láser diagonal en barrido a ATOM */}
          {kAtom > 0.02 && kAtom < 0.98 && (
            <div
              style={{
                position: "absolute",
                top: -20,
                bottom: -20,
                left: `${(wipePct - 7).toFixed(1)}%`,
                width: 13,
                background: "#FFFFFF",
                boxShadow: `0 0 30px 11px ${accentAtom}`,
                transform: "skewX(-12deg)",
                pointerEvents: "none",
                zIndex: 13,
              }}
            />
          )}

          {/* Miniatura PiP flotante de Ilustración A durante Tiempo 2 */}
          {kAtom >= 0.65 && kSplit < 0.12 && (
            <div
              style={{
                position: "absolute",
                right: 16,
                bottom: 14,
                width: 176,
                height: 100,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: `0 12px 28px rgba(0,0,0,0.74), 0 0 0 3px ${accentA}`,
                zIndex: 14,
                transform: `translateY(${pipBobY.toFixed(2)}px) rotate(${(-pipRot).toFixed(2)}deg)`,
              }}
            >
              <Img src={asset(srcA)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}

          {/* Tiempo 3: Mitad derecha viva con Ilustración B */}
          {kSplit > 0.01 && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: `${rightSplitPct.toFixed(2)}%`,
                overflow: "hidden",
              }}
            >
              <Img
                src={asset(srcB)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${cineScB.toFixed(4)}) translate(${cineTxB.toFixed(2)}px, ${cineTyB.toFixed(2)}px) rotate(${(-cineRot).toFixed(2)}deg)`,
                }}
              />
            </div>
          )}
        </>
      ) : (
        <>
          {/* Modo startWithAtom: Arranca con ATOM 60fps -> Split respiratorio con srcA -> Cambia a srcB */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: `${leftStartPct.toFixed(2)}%`,
              overflow: "hidden",
            }}
          >
            <OffthreadVideo
              src={asset(atomSrc)}
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: `scale(${cineScAtom.toFixed(4)}) translate(${cineTxAtom.toFixed(2)}px, ${cineTyAtom.toFixed(2)}px)`,
              }}
            />
          </div>

          {!inAtom && (
            <div
              style={{
                position: "absolute",
                right: 16,
                bottom: 14,
                width: 188,
                height: 106,
                borderRadius: 16,
                overflow: "hidden",
                boxShadow: `0 12px 28px rgba(0,0,0,0.74), 0 0 0 3px ${accentA}`,
                zIndex: 14,
                transform: `translateY(${pipBobY.toFixed(2)}px) rotate(${pipRot.toFixed(2)}deg)`,
              }}
            >
              <Img src={asset(srcA)} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          )}

          {kAtom > 0.01 && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                bottom: 0,
                width: `${rightStartPct.toFixed(2)}%`,
                overflow: "hidden",
              }}
            >
              <Img
                src={asset(inSplit ? srcB : srcA)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: `scale(${(inSplit ? cineScB : cineScA).toFixed(4)}) translate(${(inSplit ? cineTxB : cineTxA).toFixed(2)}px, ${cineTyB.toFixed(2)}px)`,
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Costura láser divisoria viva + Orbe de plasma vertical a 60 fps */}
      {seamActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `calc(${seamLeftPct.toFixed(2)}% - 3px)`,
            width: 6,
            background: seamColor,
            boxShadow: `0 0 22px 4px ${seamColor}`,
            pointerEvents: "none",
            zIndex: 14,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: -7,
              top: `${orbY.toFixed(1)}%`,
              width: 20,
              height: 44,
              transform: "translateY(-50%)",
              borderRadius: 999,
              background: "#FFFFFF",
              boxShadow: `0 0 24px 8px ${seamColor}`,
            }}
          />
        </div>
      )}

      {vfx}

      {/* Escáner óptico rápido */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${scanX.toFixed(1)}%`,
          width: "26%",
          background: `linear-gradient(105deg, rgba(255,255,255,0) 0%, ${
            inSplit ? "rgba(255, 30, 86, 0.25)" : "rgba(0, 240, 255, 0.24)"
          } 52%, rgba(255,255,255,0) 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Viñeta cinematográfica para contraste perfecto */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(6,9,17,0.38) 0%, rgba(6,9,17,0.02) 48%, rgba(6,9,17,0.62) 100%)",
          pointerEvents: "none",
        }}
      />

      {flash > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#FFFFFF",
            opacity: flash,
            pointerEvents: "none",
          }}
        />
      )}

      <HudCorners color={activeAccent} />
      {children}
    </div>
  );
};

/**
 * Panel Inferior Datos Neón ATOM V3 a 60 fps con respiración óptica y barrido de cristal.
 */
export const AtomNeonDeck: React.FC<{
  at: number;
  tag: string;
  title: string;
  rightText: string;
  accent?: string;
  borderAccent?: string;
  atomLowerSrc?: string;
}> = ({
  at,
  tag,
  title,
  rightText,
  accent = TECH.cyan,
  borderAccent,
  atomLowerSrc = "atom-lower.mp4",
}) => {
  const { f, scene } = useScene();
  const dark = scene.ground === "dark";
  const bCol = borderAccent ?? accent;
  const deckBreath = 1.016 + 0.014 * Math.sin(f * 0.085);
  const sheenX = lerp(-40, 130, ((f + 35) % 88) / 88);

  return (
    <div
      style={{
        position: "absolute",
        left: STAGE.left,
        top: 1060,
        width: STAGE.safeWidth,
        height: 376,
        borderRadius: 28,
        padding: "16px 24px 18px",
        boxSizing: "border-box",
        background: dark ? TECH.darkCard : TECH.lightCard,
        boxShadow: dark
          ? `0 24px 58px rgba(0,0,0,0.58), 0 0 26px rgba(0,240,255,0.16), inset 0 0 0 2.5px ${bCol}`
          : `0 22px 54px rgba(15,23,42,0.12), inset 0 0 0 3px ${bCol}`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transform: `translateY(${((1 - arrive(f, at, 15)) * 102).toFixed(1)}px)`,
        opacity: prog(f, at, 4, ease.linear),
      }}
    >
      <EvidenceHeader tag={tag} title={title} rightText={rightText} accent={accent} />

      <div
        style={{
          position: "relative",
          width: 816,
          height: 268,
          borderRadius: 20,
          overflow: "hidden",
          background: "#0C0F16",
          boxShadow: `0 10px 26px rgba(0,0,0,0.42), inset 0 0 0 1.5px rgba(255,255,255,0.08)`,
        }}
      >
        <OffthreadVideo
          src={asset(atomLowerSrc)}
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transform: `scale(${deckBreath.toFixed(4)})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: `${sheenX.toFixed(1)}%`,
            width: "22%",
            background: "linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.11) 50%, rgba(255,255,255,0) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

#!/usr/bin/env node
/**
 * Generador Procedural 60 FPS (@napi-rs/canvas + ffmpeg) para los 3 Nuevos Episodios Combinados:
 *  1. `chicken-wash-myth` (prefijo `chick-01.jpg` .. `chick-14.jpg` + `atom-upper.mp4` + `atom-lower.mp4`)
 *  2. `premium-gas-myth`  (prefijo `gas-01.jpg`   .. `gas-14.jpg`   + `atom-upper.mp4` + `atom-lower.mp4`)
 *  3. `water-chug-myth`   (prefijo `wat-01.jpg`   .. `wat-14.jpg`   + `atom-upper.mp4` + `atom-lower.mp4`)
 *
 * Produce:
 *  - `atom-upper.mp4` (864x416 @ 60 fps): Escenario animado ATOM sincronizado a las 7 escenas de `words.json`
 *  - `atom-lower.mp4` (816x268 @ 60 fps): Panel Datos Neón ATOM sincronizado a las 7 escenas de `words.json`
 *  - 14 ilustraciones 16:9 (`1280x720`, sin texto incrustado) en `reels/<slug>/assets/` y `public/<slug>/`
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ESTUDIO = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio";
const FV_DIR = path.join(ESTUDIO, "PuraPrueba/engine/full-visual");
const FFMPEG = path.join(ESTUDIO, "PuraPrueba/node_modules/.bin/ffmpeg");
const canvasMod = await import(
  pathToFileURL(path.join(ESTUDIO, "ATOM/node_modules/@napi-rs/canvas/index.js")).href
);
const { createCanvas, GlobalFonts } = canvasMod;

const fontDir = path.join(ESTUDIO, "ATOM/motor/fuentes");
if (fs.existsSync(fontDir)) {
  for (const f of fs.readdirSync(fontDir)) {
    if (f.endsWith(".ttf") || f.endsWith(".otf")) {
      GlobalFonts.registerFromPath(path.join(fontDir, f), "Figtree");
    }
  }
}

const C = {
  bg: "#060911",
  deckBg: "#0C0F16",
  cyan: "#00F0FF",
  crimson: "#FF1E56",
  emerald: "#00E699",
  amber: "#FFB800",
  violet: "#A855F7",
  white: "#FFFFFF",
  slate: "#94A3B8",
  darkCard: "#0D1526",
};

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeOut = (x) => 1 - Math.pow(1 - clamp(x, 0, 1), 3);

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawGrid(ctx, w, h, color = "rgba(0, 240, 255, 0.055)", step = 36, offset = 0) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let x = (offset % step) - step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = (offset * 0.5 % step) - step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGlow(ctx, cx, cy, r, hex, alpha = 0.28) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const [cr, cg, cb] = m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 240, 255];
  g.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha})`);
  g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
}

function drawTopPill(ctx, w, text, accent) {
  ctx.save();
  ctx.font = "800 22px Figtree, sans-serif";
  const tw = ctx.measureText(text).width;
  const pw = tw + 46;
  const px = (w - pw) / 2;
  const py = 18;
  roundRect(ctx, px, py, pw, 42, 21);
  ctx.fillStyle = "rgba(8, 13, 26, 0.92)";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = accent;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(px + 20, py + 21, 6, 0, Math.PI * 2);
  ctx.fillStyle = accent;
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText(text, px + 34, py + 22);
  ctx.restore();
}

// ============================================================================
// DEFINICIÓN DE ESCENAS POR EPISODIO (UPPER 864x416 + LOWER 816x268)
// ============================================================================
const EPISODES = {
  "chicken-wash-myth": {
    prefix: "chick",
    scenes: [
      {
        pill: "ALERTA COCINA · RADIO 90 CM",
        accent: C.crimson,
        lowerA: ["ALCANCE DEL CHORRO", 90, "90 CM", C.crimson, "CONTAMINA"],
        lowerB: ["BACTERIAS ELIMINADAS", 4, "0%", C.amber, "MITO FALSO"],
        mode: "spray90",
      },
      {
        pill: "CÁMARA UV · REBOTE HIDRÁULICO",
        accent: C.cyan,
        lowerA: ["MICROGOTAS LANZADAS", 94, "2,400/S", C.crimson, "INVISIBLES"],
        lowerB: ["VISIBILIDAD A OJO DESNUDO", 8, "0%", C.cyan, "SOLO LUZ UV"],
        mode: "uv_camera",
      },
      {
        pill: "CAMPYLOBACTER + SALMONELLA",
        accent: C.crimson,
        lowerA: ["ESPONJA Y PLATOS LIMPIOS", 94, "94% RIESGO", C.crimson, "INFECTADOS"],
        lowerB: ["DOSIS PARA ENFERMAR", 18, "500 BACT", C.amber, "MUY BAJA"],
        mode: "bacteria_plate",
      },
      {
        pill: "BIOFILM EN FIBRA MUSCULAR",
        accent: C.crimson,
        lowerA: ["RIESGO INFECCIÓN CRUZADA", 96, "5X MÁS", C.crimson, "PELIGRO"],
        lowerB: ["DESPRENDIMIENTO CON AGUA", 6, "0.0%", C.cyan, "ADHERIDAS"],
        mode: "biofilm_fiber",
      },
      {
        pill: "TERMODINÁMICA · 74 °C (165 °F)",
        accent: C.emerald,
        lowerA: ["COCCIÓN INTERNA A 74 °C", 100, "100% MUERTAS", C.emerald, "GANADOR"],
        lowerB: ["LAVADO CON AGUA FRÍA", 8, "0% EFECTO", C.crimson, "INÚTIL"],
        mode: "thermal_74c",
      },
      {
        pill: "PROTOCOLO OFICIAL DE COCINA",
        accent: C.emerald,
        lowerA: ["DIRECTO AL SARTÉN + JABÓN 20S", 100, "100% SEGURO", C.emerald, "REGLA"],
        lowerB: ["SALPICADURAS EN FREGADERO", 5, "0 CM", C.cyan, "LIMPIO"],
        mode: "kitchen_shield",
      },
      {
        pill: "COCINA 100% LIBRE DE RIESGO",
        accent: C.emerald,
        lowerA: ["SEGURIDAD ALIMENTARIA", 100, "100%", C.emerald, "ÓPTIMO"],
        lowerB: ["CONTAGIO CRUZADO", 4, "0%", C.cyan, "CONTROLADO"],
        mode: "portal_emerald",
      },
    ],
  },
  "premium-gas-myth": {
    prefix: "gas",
    scenes: [
      {
        pill: "MOTOR ESTÁNDAR · -18% DINERO",
        accent: C.crimson,
        lowerA: ["SOBRECOSTO GASOLINA PREMIUM", 92, "+18% CARA", C.crimson, "PÉRDIDA"],
        lowerB: ["POTENCIA EXTRA EN TU AUTO", 5, "+0.0 HP", C.amber, "MITO"],
        mode: "fuel_waste",
      },
      {
        pill: "PRUEBA EN DINAMÓMETRO AAA",
        accent: C.emerald,
        lowerA: ["GASOLINA REGULAR (87 OCT)", 88, "100% HP", C.emerald, "EMPATE"],
        lowerB: ["GASOLINA PREMIUM (95 OCT)", 88, "100% HP", C.cyan, "+0.0% KM/L"],
        mode: "dyno_test",
      },
      {
        pill: "OCTANAJE 95/98 = ANTI-DETONACIÓN",
        accent: C.amber,
        lowerA: ["RESISTENCIA A COMPRESIÓN", 96, "98 OCT", C.amber, "PRESIÓN"],
        lowerB: ["ENERGÍA TÉRMICA POR LITRO", 84, "34.2 MJ/L", C.cyan, "IDÉNTICA"],
        mode: "piston_pressure",
      },
      {
        pill: "TURBO 12:1 VS MOTOR NORMAL 9.5:1",
        accent: C.emerald,
        lowerA: ["COMBUSTIÓN REGULAR EN AUTO NORMAL", 100, "100% LIMPIA", C.emerald, "IDEAL"],
        lowerB: ["RIESGO DE CASCABELEO", 6, "0.0%", C.cyan, "SIN FALLA"],
        mode: "twin_pistons",
      },
      {
        pill: "NORMA OFICIAL · ADITIVOS LIMPIADORES",
        accent: C.emerald,
        lowerA: ["DETERGENTES EN REGULAR", 95, "100% LEY", C.emerald, "LIMPIA"],
        lowerB: ["DETERGENTES EN PREMIUM", 95, "100% LEY", C.cyan, "IGUALES"],
        mode: "injector_clean",
      },
      {
        pill: "REVISA LA TAPA DE TU TANQUE",
        accent: C.emerald,
        lowerA: ["AHORRO ANUAL CON REGULAR 87", 94, "+$280/AÑO", C.emerald, "AHORRO"],
        lowerB: ["GASTO INNECESARIO", 5, "$0", C.cyan, "INTELIGENTE"],
        mode: "tank_cap",
      },
      {
        pill: "TANQUEO INTELIGENTE · +18% AHORRO",
        accent: C.emerald,
        lowerA: ["EFICIENCIA DE TU BOLSILLO", 100, "100%", C.emerald, "GANADOR"],
        lowerB: ["DINERO QUEMADO", 4, "0%", C.cyan, "CERO"],
        mode: "portal_emerald",
      },
    ],
  },
  "water-chug-myth": {
    prefix: "wat",
    scenes: [
      {
        pill: "2 LITROS DE GOLPE · ERROR RENAL",
        accent: C.crimson,
        lowerA: ["ABSORCIÓN POR SORBOS", 94, "94% REAL", C.emerald, "HIDRATA"],
        lowerB: ["BEBER 2 LITROS DE GOLPE", 32, "32% ÚTIL", C.crimson, "SE PIERDE"],
        mode: "water_bolus",
      },
      {
        pill: "BARORRECEPTORES · FALSA ALARMA",
        accent: C.crimson,
        lowerA: ["VOLUMEN TRAGADO DE GOLPE", 92, "500 ML/5S", C.crimson, "EXCESO"],
        lowerB: ["SEÑAL DE SED EN CEREBRO", 12, "APAGADA", C.amber, "ENGAÑO"],
        mode: "throat_sensors",
      },
      {
        pill: "DILUCIÓN BRUSCA DEL PLASMA",
        accent: C.amber,
        lowerA: ["CAÍDA DE SODIO EN SANGRE", 88, "268 MOSM", C.crimson, "DILUIDO"],
        lowerB: ["BALANCE CON ELECTROLITOS", 95, "290 MOSM", C.emerald, "ESTABLE"],
        mode: "blood_dilution",
      },
      {
        pill: "HORMONA ADH APAGADA · DIURESIS",
        accent: C.crimson,
        lowerA: ["AGUA EXPULSADA A LA VEJIGA", 76, "72% EN <2H", C.crimson, "ORINA"],
        lowerB: ["HORMONA ANTIDIURÉTICA (ADH)", 8, "APAGADA", C.amber, "BLOQUEO"],
        mode: "kidney_flush",
      },
      {
        pill: "LAVADO DE SODIO (Na+) Y POTASIO (K+)",
        accent: C.crimson,
        lowerA: ["PÉRDIDA DE MINERALES CLAVE", 89, "ALTA", C.crimson, "FATIGA"],
        lowerB: ["HIDRATACIÓN INTRACELULAR", 42, "42% BAJA", C.amber, "CANSANCIO"],
        mode: "cell_drain",
      },
      {
        pill: "SORBOS CONSTANTES + COMIDA Y SALES",
        accent: C.emerald,
        lowerA: ["SORBOS CADA 45 MIN + COMIDAS", 98, "98% RETENIDO", C.emerald, "ÓPTIMO"],
        lowerB: ["DESPERDICIO RENAL", 8, "MÍNIMO", C.cyan, "CONTROLADO"],
        mode: "sip_protocol",
      },
      {
        pill: "HIDRATACIÓN CELULAR AL 100%",
        accent: C.emerald,
        lowerA: ["ENERGÍA Y ELECTROLITOS", 100, "100%", C.emerald, "PERFECTO"],
        lowerB: ["FATIGA POR DILUCIÓN", 4, "0%", C.cyan, "CERO"],
        mode: "portal_emerald",
      },
    ],
  },
};

// ============================================================================
// DIBUJO DE ESCENARIO ANIMADO ATOM UPPER (864x416 @ 60FPS)
// ============================================================================
function renderUpperFrame(ctx, w, h, sc, localT, scDur, fGlobal) {
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, w, h);

  const p = clamp(localT / Math.max(0.5, scDur), 0, 1);
  drawGrid(ctx, w, h, sc.accent === C.crimson ? "rgba(255,30,86,0.06)" : "rgba(0,240,255,0.06)", 36, fGlobal * 0.6);
  drawGlow(ctx, w * 0.5, h * 0.54, 240, sc.accent, 0.24 + 0.06 * Math.sin(fGlobal * 0.1));

  const cx = w * 0.5;
  const cy = h * 0.56;

  ctx.save();
  switch (sc.mode) {
    case "spray90":
    case "uv_camera": {
      // Pollo crudo en centro + chorro de agua vertical + ondas de salpicadura de 90 cm
      const isUv = sc.mode === "uv_camera";
      const mainCol = isUv ? C.cyan : C.crimson;
      // Chorro superior
      ctx.strokeStyle = C.cyan;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(cx, 66);
      ctx.lineTo(cx, cy - 10);
      ctx.stroke();

      // Ondas concéntricas de 90 cm
      for (let i = 0; i < 4; i++) {
        const rp = ((fGlobal * 0.025 + i * 0.25) % 1);
        const rx = 50 + rp * 290;
        const ry = 22 + rp * 115;
        ctx.strokeStyle = isUv ? `rgba(0,240,255,${(1 - rp) * 0.85})` : `rgba(255,30,86,${(1 - rp) * 0.85})`;
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 16, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 28 microgotas balísticas
      for (let i = 0; i < 28; i++) {
        const ang = (i / 28) * Math.PI * 2 + fGlobal * 0.015;
        const dist = ((fGlobal * 2.8 + i * 19) % 240) + 30;
        const gx = cx + Math.cos(ang) * dist * 1.15;
        const gy = cy + Math.sin(ang) * dist * 0.48 - Math.sin((dist / 240) * Math.PI) * 42;
        ctx.beginPath();
        ctx.arc(gx, gy, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? C.amber : mainCol;
        ctx.fill();
      }

      // Etiqueta central de radio
      roundRect(ctx, cx - 115, cy - 26, 230, 52, 16);
      ctx.fillStyle = "rgba(6, 9, 17, 0.92)";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = mainCol;
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 28px Figtree, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(isUv ? "2,400 GOTAS UV" : "RADIO: 90 CM", cx, cy);
      break;
    }

    case "bacteria_plate":
    case "biofilm_fiber": {
      // Nodos bacterianos pulsantes + alerta biológica
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + fGlobal * 0.02;
        const r = 85 + 38 * Math.sin(fGlobal * 0.05 + i);
        const bx = cx + Math.cos(a) * r * 1.4;
        const by = cy + Math.sin(a) * r * 0.65;
        roundRect(ctx, bx - 22, by - 10, 44, 20, 10);
        ctx.fillStyle = i % 2 === 0 ? C.crimson : C.amber;
        ctx.fill();
      }
      roundRect(ctx, cx - 155, cy - 34, 310, 68, 18);
      ctx.fillStyle = "rgba(10, 14, 26, 0.94)";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = C.crimson;
      ctx.stroke();
      ctx.fillStyle = "#FDA4AF";
      ctx.font = "900 27px Figtree, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sc.mode === "bacteria_plate" ? "CAMPYLOBACTER 94%" : "BIOFILM ADHERIDO", cx, cy);
      break;
    }

    case "thermal_74c": {
      // Termómetro circular de cocción subiendo a 74 °C
      const deg = Math.round(22 + 52 * easeOut(p * 1.25));
      const r = 104;
      ctx.lineWidth = 16;
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = deg >= 70 ? C.emerald : C.amber;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (deg / 74));
      ctx.stroke();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 44px Figtree, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${deg} °C`, cx, cy - 8);
      ctx.fillStyle = C.emerald;
      ctx.font = "800 20px Figtree, sans-serif";
      ctx.fillText("100% ESTÉRIL", cx, cy + 32);
      break;
    }

    case "fuel_waste":
    case "dyno_test":
    case "piston_pressure":
    case "twin_pistons":
    case "injector_clean":
    case "tank_cap": {
      // Telemetría automotriz de alta precisión (curvas gemelas + medidores)
      const isGood = sc.accent === C.emerald;
      const col = sc.accent;
      // Dos diales laterales + gráfico central
      for (const side of [-1, 1]) {
        const dx = cx + side * 215;
        const dy = cy + 6;
        ctx.lineWidth = 12;
        ctx.strokeStyle = "rgba(255,255,255,0.10)";
        ctx.beginPath();
        ctx.arc(dx, dy, 76, Math.PI * 0.8, Math.PI * 2.2);
        ctx.stroke();

        const valProg = side === -1 ? 0.82 : isGood ? 0.82 : 0.98;
        ctx.strokeStyle = side === -1 ? C.emerald : col;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(dx, dy, 76, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * valProg));
        ctx.stroke();

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 26px Figtree, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(side === -1 ? "87 OCT" : "95 OCT", dx, dy - 6);
        ctx.fillStyle = side === -1 ? C.emerald : col;
        ctx.font = "800 18px Figtree, sans-serif";
        ctx.fillText(side === -1 ? "REGULAR" : "PREMIUM", dx, dy + 22);
      }

      roundRect(ctx, cx - 110, cy - 42, 220, 84, 18);
      ctx.fillStyle = "rgba(8, 13, 25, 0.94)";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = col;
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 30px Figtree, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(sc.mode === "fuel_waste" ? "-18% DINERO" : sc.mode === "dyno_test" ? "+0.0 HP" : "100% IGUAL", cx, cy - 8);
      ctx.fillStyle = col;
      ctx.font = "800 18px Figtree, sans-serif";
      ctx.fillText("LABORATORIO AAA", cx, cy + 22);
      break;
    }

    case "water_bolus":
    case "throat_sensors":
    case "blood_dilution":
    case "kidney_flush":
    case "cell_drain":
    case "sip_protocol": {
      // Fisiología e hidratación celular en tiempo real
      const col = sc.accent;
      // Ondas senoidales de flujo hídrico + células / iones
      for (let row = -1; row <= 1; row++) {
        ctx.beginPath();
        for (let x = 80; x <= w - 80; x += 12) {
          const y = cy + row * 48 + Math.sin(x * 0.025 - fGlobal * 0.12 + row) * 18;
          if (x === 80) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = row === 0 ? col : "rgba(0, 240, 255, 0.35)";
        ctx.lineWidth = row === 0 ? 5 : 2.5;
        ctx.stroke();
      }

      // Iones flotantes (Na+, K+, H2O)
      const labels = ["Na+", "K+", "H2O", "ADH", "Na+", "K+"];
      for (let i = 0; i < 6; i++) {
        const ix = 130 + ((i * 115 + fGlobal * 2.2) % (w - 260));
        const iy = cy + Math.sin(fGlobal * 0.08 + i * 1.4) * 82;
        roundRect(ctx, ix - 28, iy - 16, 56, 32, 16);
        ctx.fillStyle = "rgba(8, 14, 28, 0.92)";
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = i % 2 === 0 ? col : C.cyan;
        ctx.stroke();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "800 16px Figtree, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(labels[i], ix, iy);
      }

      roundRect(ctx, cx - 135, cy - 38, 270, 76, 18);
      ctx.fillStyle = "rgba(6, 10, 20, 0.94)";
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = col;
      ctx.stroke();
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "900 28px Figtree, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        sc.mode === "water_bolus"
          ? "SOLO 32% RETENIDO"
          : sc.mode === "kidney_flush"
            ? "72% A LA VEJIGA"
            : sc.mode === "sip_protocol"
              ? "98% ABSORCIÓN"
              : "DILUCIÓN PLASMA",
        cx,
        cy,
      );
      break;
    }

    default: {
      // Escudo / Portal Esmeralda 60fps para Rule y CTA
      for (let k = 0; k < 3; k++) {
        const rad = 64 + k * 34 + 6 * Math.sin(fGlobal * 0.1 + k);
        ctx.strokeStyle = k === 0 ? C.emerald : k === 1 ? C.cyan : "rgba(0, 230, 153, 0.35)";
        ctx.lineWidth = 5 - k;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, fGlobal * 0.04 * (k % 2 ? 1 : -1), fGlobal * 0.04 * (k % 2 ? 1 : -1) + Math.PI * 1.65);
        ctx.stroke();
      }
      ctx.fillStyle = C.emerald;
      ctx.font = "900 34px Figtree, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("100% VERIFICADO", cx, cy);
      break;
    }
  }
  ctx.restore();

  drawTopPill(ctx, w, sc.pill, sc.accent);
}

// ============================================================================
// DIBUJO DE PANEL INFERIOR DATOS NEÓN ATOM LOWER (816x268 @ 60FPS)
// ============================================================================
function renderLowerFrame(ctx, w, h, sc, localT, scDur, fGlobal) {
  ctx.fillStyle = C.deckBg;
  ctx.fillRect(0, 0, w, h);
  drawGrid(ctx, w, h, "rgba(255,255,255,0.035)", 32, fGlobal * 0.4);

  const p = easeOut(clamp(localT / Math.min(1.4, scDur * 0.45), 0, 1));
  const rows = [sc.lowerA, sc.lowerB];

  rows.forEach((row, idx) => {
    const [label, targetPct, valText, color, badge] = row;
    const y0 = idx === 0 ? 24 : 142;
    const barW = (w - 72) * clamp((targetPct * p) / 100, 0.06, 1);

    // Etiqueta izquierda
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 22px Figtree, sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(label, 36, y0 + 18);

    // Badge y valor derecha
    ctx.font = "900 25px Figtree, sans-serif";
    ctx.fillStyle = color;
    ctx.textAlign = "right";
    ctx.fillText(valText, w - 36, y0 + 18);

    // Pista de barra
    roundRect(ctx, 36, y0 + 42, w - 72, 46, 14);
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fill();

    // Relleno de barra viva con pulso
    roundRect(ctx, 36, y0 + 42, barW, 46, 14);
    ctx.fillStyle = color;
    ctx.fill();

    // Pastilla interna
    ctx.fillStyle = color === C.emerald || color === C.amber || color === C.cyan ? "#041622" : "#FFFFFF";
    ctx.font = "900 19px Figtree, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(badge, 52, y0 + 65);
  });
}

// ============================================================================
// GENERADOR DE LAS 14 ILUSTRACIONES 16:9 (1280x720, CERO TEXTO INCRUSTADO)
// ============================================================================
function generate14Illustrations(slug, reelDir, pubDir) {
  const ep = EPISODES[slug];
  const w = 1280;
  const h = 720;
  const c = createCanvas(w, h);
  const ctx = c.getContext("2d");

  const palettes = [
    ["#050B16", C.cyan, C.crimson],
    ["#071224", C.cyan, C.amber],
    ["#0A0D1D", C.amber, C.crimson],
    ["#120814", C.crimson, C.amber],
    ["#061814", C.emerald, C.cyan],
    ["#071A1E", C.emerald, C.cyan],
    ["#05131B", C.cyan, C.emerald],
  ];

  for (let i = 1; i <= 14; i++) {
    const scIdx = (i - 1) % 7;
    const isBeatB = i > 7;
    const [bgCol, col1, col2] = palettes[scIdx];
    const mainCol = isBeatB ? col2 : col1;
    const secCol = isBeatB ? col1 : col2;

    // Fondo estudio cinematográfico con iluminación volumétrica
    const bgGrad = ctx.createLinearGradient(0, 0, w, h);
    bgGrad.addColorStop(0, bgCol);
    bgGrad.addColorStop(0.5, "#0B1325");
    bgGrad.addColorStop(1, "#04070E");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    drawGrid(ctx, w, h, "rgba(0, 240, 255, 0.05)", 48, i * 11);
    drawGlow(ctx, isBeatB ? w * 0.68 : w * 0.34, h * 0.48, 460, mainCol, 0.36);
    drawGlow(ctx, isBeatB ? w * 0.28 : w * 0.72, h * 0.56, 380, secCol, 0.26);

    const cx = isBeatB ? w * 0.62 : w * 0.42;
    const cy = h * 0.52;

    // Composición visual 3D/macro según el episodio (CERO TEXTO, pura forma e iluminación)
    ctx.save();
    if (slug === "chicken-wash-myth") {
      // Superficie metálica de fregadero / sartén + ondas hidráulicas / gotas macro / calor
      ctx.strokeStyle = mainCol;
      ctx.lineWidth = 6;
      for (let r = 1; r <= 5; r++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy + 50, r * 74, r * 32, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      // Esfera central orgánica iluminada + partículas de bioaerosol / brasas
      const bodyGrad = ctx.createRadialGradient(cx - 35, cy - 30, 18, cx, cy, 155);
      bodyGrad.addColorStop(0, "#FFE4E6");
      bodyGrad.addColorStop(0.55, scIdx === 4 ? "#F59E0B" : "#FB7185");
      bodyGrad.addColorStop(1, "#4C0519");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 155, 105, isBeatB ? -0.18 : 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = mainCol;
      ctx.stroke();

      // Gotas o partículas de energía
      for (let p = 0; p < 34; p++) {
        const a = (p / 34) * Math.PI * 2 + i;
        const d = 135 + ((p * 47) % 240);
        const px = cx + Math.cos(a) * d * 1.25;
        const py = cy + Math.sin(a) * d * 0.72 - 30;
        ctx.beginPath();
        ctx.arc(px, py, 6 + (p % 6), 0, Math.PI * 2);
        ctx.fillStyle = p % 2 === 0 ? mainCol : secCol;
        ctx.fill();
      }
    } else if (slug === "premium-gas-myth") {
      // Cámara de combustión / cilindro / inyector / turbina en macro estudio
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.arc(cx, cy, 110 + k * 54, 0, Math.PI * 2);
        ctx.strokeStyle = k % 2 === 0 ? mainCol : secCol;
        ctx.lineWidth = 8 - k * 2;
        ctx.stroke();
      }
      // Pistón / núcleo metálico central con reflejos especulares
      roundRect(ctx, cx - 95, cy - 115, 190, 230, 28);
      const metalGrad = ctx.createLinearGradient(cx - 95, cy - 115, cx + 95, cy + 115);
      metalGrad.addColorStop(0, "#E2E8F0");
      metalGrad.addColorStop(0.5, "#475569");
      metalGrad.addColorStop(1, "#0F172A");
      ctx.fillStyle = metalGrad;
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = mainCol;
      ctx.stroke();

      // Haz de inyección / chispa
      for (let ray = -3; ray <= 3; ray++) {
        ctx.beginPath();
        ctx.moveTo(cx, cy - 150);
        ctx.lineTo(cx + ray * 62, cy + 160);
        ctx.strokeStyle = ray % 2 === 0 ? mainCol : secCol;
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }
    } else {
      // Hidratación / torrente celular / membrana osmótica en macro estudio
      for (let wv = -2; wv <= 2; wv++) {
        ctx.beginPath();
        for (let x = 0; x <= w; x += 20) {
          const y = cy + wv * 58 + Math.sin(x * 0.012 + i + wv) * 42;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = wv === 0 ? mainCol : secCol;
        ctx.lineWidth = wv === 0 ? 7 : 3;
        ctx.stroke();
      }
      // Esferas celulares translúcidas con núcleo brillante
      for (let cell = 0; cell < 7; cell++) {
        const a = (cell / 7) * Math.PI * 2 + i * 0.5;
        const rad = cell === 0 ? 0 : 210;
        const rx = cx + Math.cos(a) * rad * 1.3;
        const ry = cy + Math.sin(a) * rad * 0.7;
        const cr = cell === 0 ? 115 : 54;
        const cg = ctx.createRadialGradient(rx - cr * 0.3, ry - cr * 0.3, 6, rx, ry, cr);
        cg.addColorStop(0, "#FFFFFF");
        cg.addColorStop(0.4, mainCol);
        cg.addColorStop(1, "rgba(6, 15, 32, 0.15)");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(rx, ry, cr, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = "#FFFFFF";
        ctx.stroke();
      }
    }
    ctx.restore();

    const fileName = `${ep.prefix}-${String(i).padStart(2, "0")}.jpg`;
    const buf = c.toBuffer("image/jpeg", 92);
    fs.writeFileSync(path.join(reelDir, "assets", fileName), buf);
    fs.writeFileSync(path.join(pubDir, fileName), buf);
  }
}

async function renderMp4FromCanvas(width, height, fps, totalFrames, outPath, drawFn) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  await new Promise((resolve, reject) => {
    const proc = spawn(
      FFMPEG,
      [
        "-y",
        "-v",
        "error",
        "-f",
        "rawvideo",
        "-pix_fmt",
        "rgba",
        "-s",
        `${width}x${height}`,
        "-r",
        String(fps),
        "-i",
        "-",
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        "-crf",
        "18",
        "-pix_fmt",
        "yuv420p",
        outPath,
      ],
      { stdio: ["pipe", "inherit", "inherit"] },
    );

    proc.on("error", reject);
    proc.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`))));

    let f = 0;
    function writeNext() {
      let ok = true;
      while (f < totalFrames && ok) {
        drawFn(ctx, f);
        const raw = canvas.data();
        f++;
        ok = proc.stdin.write(raw);
      }
      if (f >= totalFrames) {
        proc.stdin.end();
      } else {
        proc.stdin.once("drain", writeNext);
      }
    }
    writeNext();
  });
}

for (const slug of Object.keys(EPISODES)) {
  const reelDir = path.join(FV_DIR, "reels", slug);
  const pubDir = path.join(FV_DIR, "public", slug);
  fs.mkdirSync(path.join(reelDir, "assets"), { recursive: true });
  fs.mkdirSync(pubDir, { recursive: true });

  const wordsData = JSON.parse(fs.readFileSync(path.join(reelDir, "words.json"), "utf8"));
  const duration = Number(wordsData.duration);
  const fps = 60;
  const totalFrames = Math.ceil(duration * fps);

  // Calcular rangos de tiempo de cada una de las 7 escenas
  const sceneRanges = wordsData.scenes.map((sc, idx) => {
    const startT = idx === 0 ? 0 : wordsData.words[sc.firstWord].t;
    const endT =
      idx + 1 < wordsData.scenes.length
        ? wordsData.words[wordsData.scenes[idx + 1].firstWord].t
        : duration;
    return { startT, endT, dur: Math.max(0.5, endT - startT), def: EPISODES[slug].scenes[idx] };
  });

  function sceneForTime(t) {
    for (let i = sceneRanges.length - 1; i >= 0; i--) {
      if (t >= sceneRanges[i].startT) return sceneRanges[i];
    }
    return sceneRanges[0];
  }

  console.log(`\n[${slug}] Generando 14 ilustraciones 16:9...`);
  generate14Illustrations(slug, reelDir, pubDir);

  const upperAsset = path.join(reelDir, "assets", "atom-upper.mp4");
  const lowerAsset = path.join(reelDir, "assets", "atom-lower.mp4");

  console.log(`[${slug}] Renderizando atom-upper.mp4 (864x416 @ 60fps, ${totalFrames} frames)...`);
  await renderMp4FromCanvas(864, 416, fps, totalFrames, upperAsset, (ctx, f) => {
    const t = f / fps;
    const sr = sceneForTime(t);
    renderUpperFrame(ctx, 864, 416, sr.def, t - sr.startT, sr.dur, f);
  });
  fs.copyFileSync(upperAsset, path.join(pubDir, "atom-upper.mp4"));

  console.log(`[${slug}] Renderizando atom-lower.mp4 (816x268 @ 60fps, ${totalFrames} frames)...`);
  await renderMp4FromCanvas(816, 268, fps, totalFrames, lowerAsset, (ctx, f) => {
    const t = f / fps;
    const sr = sceneForTime(t);
    renderLowerFrame(ctx, 816, 268, sr.def, t - sr.startT, sr.dur, f);
  });
  fs.copyFileSync(lowerAsset, path.join(pubDir, "atom-lower.mp4"));

  console.log(`✓ [${slug}] Assets combinados listos.`);
}

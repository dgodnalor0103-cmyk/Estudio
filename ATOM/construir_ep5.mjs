import fs from "node:fs";
import path from "node:path";

const DIR = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/proyectos/2026-11-04-ep5-modo-avion-rastreo";

// ---------------- 1. video/mundo.js ----------------
const mundoJs = `// Mundo compartido para MITOS DE TU CELULAR · EP. 5 (Estilo Sovera · ATOM Élite 60 fps)
// «Por qué el Modo Avión no apaga el rastreo de tu celular»
import * as k from "#kit";

const { azar, lienzo, fijar, redondo, suave, tramo, mez } = k;
export { redondo };

export function vista(g, Z, cx, cy) {
  g.setTransform(Z, 0, 0, Z, 540 - cx * Z, 960 - cy * Z);
}

export function sinVista(g) {
  g.setTransform(1, 0, 0, 1, 0, 0);
}

export function camino2D(claves) {
  const Zs = k.claves(claves.map(([t, c]) => [t, Math.log(c[0])]));
  const Xs = k.claves(claves.map(([t, c]) => [t, c[1]]));
  const Ys = k.claves(claves.map(([t, c]) => [t, c[2]]));
  return (t) => [Math.exp(Zs(t)), Xs(t), Ys(t)];
}

export function relojPlano(t, tCorte, reposo = 0.16, freno = 0.24) {
  const b = tCorte - reposo;
  const a = b - freno;
  if (t <= a) return t;
  if (t >= b) return a + 0.5 * freno;
  const u = (t - a) / freno;
  return a + freno * (u - u * u * u + 0.5 * u * u * u * u);
}

export function capaSuperiorMarca(g, fuerzaVelo = 0.6) {
  g.save();
  sinVista(g);
  if (fuerzaVelo > 0.01) {
    const vg = g.createLinearGradient(0, 0, 0, 610);
    vg.addColorStop(0, \`rgba(5, 8, 16, \${Math.min(0.94, fuerzaVelo * 1.15)})\`);
    vg.addColorStop(0.62, \`rgba(5, 8, 16, \${fuerzaVelo * 0.74})\`);
    vg.addColorStop(1, "rgba(5, 8, 16, 0)");
    g.fillStyle = vg;
    g.fillRect(0, 0, 1080, 610);
  }
  g.font = "700 28px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "rgba(232, 240, 255, 0.62)";
  g.shadowColor = "rgba(0, 0, 0, 0.65)";
  g.shadowBlur = 12;
  g.fillText("p u r a   p r u e b a", 540, 212);
  g.restore();
}

export function vineta(g, fuerza = 0.56) {
  g.save();
  sinVista(g);
  const vg = g.createRadialGradient(540, 980, 430, 540, 980, 1280);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, \`rgba(0,0,0,\${fuerza})\`);
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

const BALDOSA = (() => {
  const c = lienzo(270, 270);
  const g = c.getContext("2d");
  const bg = g.createLinearGradient(0, 0, 270, 270);
  bg.addColorStop(0, "#1d293d");
  bg.addColorStop(0.5, "#162032");
  bg.addColorStop(1, "#101827");
  g.fillStyle = bg;
  g.fillRect(0, 0, 270, 270);

  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.16;
  g.drawImage(k.manchas, -40, -40, 360, 360);

  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.28;
  g.drawImage(k.red, -20, -20, 320, 320);

  g.globalCompositeOperation = "source-over";
  g.globalAlpha = 1;
  g.fillStyle = "#080c14";
  g.fillRect(0, 0, 270, 10);
  g.fillRect(0, 0, 10, 270);
  g.fillStyle = "rgba(160, 195, 255, 0.14)";
  g.fillRect(10, 10, 258, 3);
  g.fillRect(10, 10, 3, 258);
  return fijar(c);
})();

export function fondoMosaico(g, t, desplazaX = 0, desplazaY = 0, luzColor = "47, 124, 246", luzAl = 0.3) {
  g.save();
  sinVista(g);
  g.fillStyle = "#0a0f1a";
  g.fillRect(0, 0, 1080, 1920);
  const ox = ((desplazaX % 270) + 270) % 270 - 270;
  const oy = ((desplazaY % 270) + 270) % 270 - 270;
  for (let y = oy; y < 1920; y += 270) {
    for (let x = ox; x < 1080; x += 270) {
      g.drawImage(BALDOSA, x, y);
    }
  }
  if (luzAl > 0.005) {
    const lx = 540 + Math.sin(t * 0.7) * 70;
    const ly = 1120 + Math.cos(t * 0.5) * 60;
    const lg = g.createRadialGradient(lx, ly, 40, lx, ly, 860);
    lg.addColorStop(0, \`rgba(\${luzColor}, \${luzAl})\`);
    lg.addColorStop(0.55, \`rgba(\${luzColor}, \${luzAl * 0.35})\`);
    lg.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.globalCompositeOperation = "lighter";
    g.fillStyle = lg;
    g.fillRect(0, 0, 1080, 1920);
  }
  g.restore();
}

export function fondoMesaClara(g, t, paleta = "fria") {
  g.save();
  sinVista(g);
  const colores = paleta === "calida"
    ? { top: "#120d08", mid: "#3b2a1a", mesaA: "#f7ebd9", mesaB: "#e6cfb0", borde: "#fff7eb", rej: "rgba(120, 78, 36, 0.10)" }
    : paleta === "menta"
    ? { top: "#071715", mid: "#153d38", mesaA: "#e3f7f2", mesaB: "#bfe6dc", borde: "#f2fcf9", rej: "rgba(18, 90, 76, 0.10)" }
    : { top: "#091322", mid: "#1c3554", mesaA: "#e4eef9", mesaB: "#bfd3ea", borde: "#f5f9ff", rej: "rgba(30, 64, 110, 0.10)" };

  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, colores.top);
  bg.addColorStop(0.26, colores.mid);
  bg.addColorStop(0.34, colores.mesaA);
  bg.addColorStop(1, colores.mesaB);
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  redondo(g, 32, 535, 1016, 1335, 44);
  const tg = g.createLinearGradient(0, 535, 0, 1870);
  tg.addColorStop(0, colores.mesaA);
  tg.addColorStop(1, colores.mesaB);
  g.fillStyle = tg;
  g.fill();
  g.strokeStyle = colores.borde;
  g.lineWidth = 4;
  g.stroke();

  g.save();
  redondo(g, 32, 535, 1016, 1335, 44);
  g.clip();
  g.strokeStyle = colores.rej;
  g.lineWidth = 2;
  const dx = (t * 18) % 90;
  for (let x = -90 + dx; x < 1120; x += 90) {
    g.beginPath(); g.moveTo(x, 535); g.lineTo(x, 1870); g.stroke();
  }
  for (let y = 580; y < 1870; y += 90) {
    g.beginPath(); g.moveTo(32, y); g.lineTo(1048, y); g.stroke();
  }
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.08;
  g.drawImage(k.manchas, -80, 500, 1250, 1450);
  g.restore();
  g.restore();
}

export function insigniaEpisodio(g, x, y, antetitulo, grande, subtitulo = "", colorSub = "#FBBF24", al = 1, escala = 1) {
  if (al <= 0.005) return;
  g.save();
  g.translate(x, y);
  g.scale(escala, escala);
  g.globalAlpha *= al;

  const w = subtitulo ? 800 : 720;
  const h = subtitulo ? 300 : 250;
  const x0 = -w / 2;
  const y0 = -h / 2;

  g.shadowColor = "rgba(0, 0, 0, 0.72)";
  g.shadowBlur = 46;
  g.shadowOffsetY = 18;
  redondo(g, x0, y0, w, h, 38);
  const fg = g.createLinearGradient(0, y0, 0, y0 + h);
  fg.addColorStop(0, "rgba(18, 25, 38, 0.94)");
  fg.addColorStop(1, "rgba(9, 13, 22, 0.96)");
  g.fillStyle = fg;
  g.fill();

  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  redondo(g, x0 + 2, y0 + 2, w - 4, h - 4, 36);
  g.strokeStyle = "rgba(255, 255, 255, 0.34)";
  g.lineWidth = 3.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 34px Figtree";
  g.fillStyle = "rgba(230, 238, 252, 0.88)";
  g.fillText(antetitulo, 0, y0 + 54);

  g.font = "800 108px Figtree";
  g.fillStyle = "#FFFFFF";
  g.shadowColor = "rgba(251, 191, 36, 0.42)";
  g.shadowBlur = 24;
  g.fillText(grande, 0, y0 + (subtitulo ? 152 : 158));
  g.shadowBlur = 0;

  if (subtitulo) {
    g.font = "800 28px Figtree";
    const sw = g.measureText(subtitulo).width + 54;
    const sh = 50;
    redondo(g, -sw / 2, y0 + h - 72, sw, sh, 16);
    g.fillStyle = colorSub;
    g.fill();
    g.fillStyle = "#140d02";
    g.fillText(subtitulo, 0, y0 + h - 47);
  }
  g.restore();
}

export function pildoraEstado(g, x, y, texto, colorRgb = "34, 227, 155", al = 1, tam = 40, fondoClaro = false) {
  if (al <= 0.005) return;
  g.save();
  g.globalAlpha *= al;
  g.font = \`800 \${tam}px Figtree\`;
  const w = g.measureText(texto).width + 68;
  const h = tam + 34;
  const x0 = x - w / 2;
  const y0 = y - h / 2;

  g.shadowColor = fondoClaro ? "rgba(15, 23, 42, 0.25)" : "rgba(0, 0, 0, 0.62)";
  g.shadowBlur = 26;
  g.shadowOffsetY = 10;
  redondo(g, x0, y0, w, h, 24);
  g.fillStyle = "rgba(10, 15, 26, 0.94)";
  g.fill();

  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  redondo(g, x0 + 1.5, y0 + 1.5, w - 3, h - 3, 22.5);
  g.strokeStyle = \`rgba(\${colorRgb}, 0.78)\`;
  g.lineWidth = 3.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = \`rgba(\${colorRgb}, 0.5)\`;
  g.shadowBlur = 14;
  g.fillStyle = \`rgb(\${colorRgb})\`;
  g.fillText(texto, x, y + 2);
  g.restore();
}

// ---------------------------------------------------------------- Celular con Modo Avión arriba + Mapa GPS en Rayos X abajo
export function dibujarCelularModoAvion(g, cx, cy, w, h, opts = {}) {
  const {
    modoAvion = 1,
    progresoRuta = 0.7,
    mostrarRayosX = 1,
    alertaRastro = true,
    t = 0,
  } = opts;

  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const r = w * 0.135;

  g.save();
  g.shadowColor = "rgba(0, 0, 0, 0.68)";
  g.shadowBlur = 46;
  g.shadowOffsetY = 22;
  redondo(g, x0, y0, w, h, r);
  g.fillStyle = "#121722";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  redondo(g, x0, y0, w, h, r);
  k.metal(g, x0, x0 + w, ["#4d5666", "#d5deec", "#697588", "#eef3fa", "#373f4d"]);

  const b = Math.max(8, w * 0.026);
  redondo(g, x0 + b, y0 + b, w - b * 2, h - b * 2, r - b * 0.7);
  g.fillStyle = "#06080d";
  g.fill();

  const sx = x0 + b * 1.55;
  const sy = y0 + b * 1.55;
  const sw = w - b * 3.1;
  const sh = h - b * 3.1;
  const sr = Math.max(12, r - b * 1.2);

  g.save();
  redondo(g, sx, sy, sw, sh, sr);
  g.clip();

  const pGrad = g.createLinearGradient(sx, sy, sx, sy + sh);
  pGrad.addColorStop(0, "#0f1c32");
  pGrad.addColorStop(1, "#070c16");
  g.fillStyle = pGrad;
  g.fillRect(sx, sy, sw, sh);

  // Tarjeta superior Modo Avión
  const cardW = sw * 0.86;
  const cardH = sh * 0.24;
  const cardY = sy + sh * 0.08;
  redondo(g, cx - cardW / 2, cardY, cardW, cardH, 24);
  g.fillStyle = "rgba(18, 28, 46, 0.94)";
  g.fill();
  g.strokeStyle = modoAvion > 0.5 ? "#f59e0b" : "#38bdf8";
  g.lineWidth = 3.5;
  g.stroke();

  // Círculo naranja de Modo Avión
  const avX = cx - cardW * 0.28;
  const avY = cardY + cardH * 0.5;
  g.fillStyle = modoAvion > 0.5 ? "#f59e0b" : "#334155";
  g.beginPath();
  g.arc(avX, avY, cardH * 0.28, 0, Math.PI * 2);
  g.fill();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = \`800 \${Math.round(sw * 0.08)}px Figtree\`;
  g.fillStyle = "#ffffff";
  g.fillText("✈", avX, avY + 2);

  g.textAlign = "left";
  g.font = \`800 \${Math.round(sw * 0.052)}px Figtree\`;
  g.fillStyle = "#ffffff";
  g.fillText(modoAvion > 0.5 ? "MODO AVIÓN: ON" : "CONECTADO", cx - cardW * 0.08, avY - 18);
  g.font = \`700 \${Math.round(sw * 0.038)}px Figtree\`;
  g.fillStyle = "#94a3b8";
  g.fillText("WiFi ✕ · Datos ✕ · Llamadas ✕", cx - cardW * 0.08, avY + 22);

  // Ventana inferior: Mapa de calles + Chip GPS pasivo registrando cada paso
  if (mostrarRayosX > 0.01) {
    const mW = sw * 0.86;
    const mH = sh * 0.52;
    const mY = sy + sh * 0.38;

    g.save();
    g.globalAlpha = mostrarRayosX;
    redondo(g, cx - mW / 2, mY, mW, mH, 26);
    g.fillStyle = "#06121b";
    g.fill();
    g.clip();

    // Cuadrícula de calles del mapa
    g.strokeStyle = "rgba(56, 189, 248, 0.18)";
    g.lineWidth = 2;
    for (let i = 1; i < 6; i++) {
      const gx = cx - mW / 2 + (mW * i) / 6;
      g.beginPath(); g.moveTo(gx, mY); g.lineTo(gx, mY + mH); g.stroke();
      const gy = mY + (mH * i) / 6;
      g.beginPath(); g.moveTo(cx - mW / 2, gy); g.lineTo(cx + mW / 2, gy); g.stroke();
    }

    // Ruta trazada paso a paso
    const pts = [
      [cx - mW * 0.34, mY + mH * 0.72],
      [cx - mW * 0.14, mY + mH * 0.62],
      [cx - mW * 0.06, mY + mH * 0.36],
      [cx + mW * 0.18, mY + mH * 0.34],
      [cx + mW * 0.32, mY + mH * 0.22],
    ];
    const nTramos = Math.max(1, Math.floor(progresoRuta * (pts.length - 1)));
    g.strokeStyle = alertaRastro ? "#ef4444" : "#22e39b";
    g.lineWidth = 6;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i <= nTramos; i++) {
      g.lineTo(pts[i][0], pts[i][1]);
    }
    g.stroke();

    for (let i = 0; i <= nTramos; i++) {
      const [px, py] = pts[i];
      g.fillStyle = i === nTramos ? "#fde047" : (alertaRastro ? "#f87171" : "#34d399");
      g.beginPath();
      g.arc(px, py, i === nTramos ? 12 : 8, 0, Math.PI * 2);
      g.fill();
    }

    // Etiqueta del chip GPS adentro
    redondo(g, cx - mW * 0.42, mY + mH - 64, mW * 0.84, 50, 14);
    g.fillStyle = "rgba(9, 16, 28, 0.92)";
    g.fill();
    g.strokeStyle = alertaRastro ? "#ef4444" : "#22e39b";
    g.lineWidth = 2.5;
    g.stroke();
    g.textAlign = "center";
    g.font = \`800 \${Math.round(sw * 0.04)}px Figtree\`;
    g.fillStyle = alertaRastro ? "#fca5a5" : "#6ee7b7";
    g.fillText("CHIP GPS + SENSORES: GRABANDO RUTA", cx, mY + mH - 39);

    g.restore();

    redondo(g, cx - mW / 2, mY, mW, mH, 26);
    g.strokeStyle = alertaRastro ? "#ef4444" : "#22e39b";
    g.lineWidth = 3.5;
    g.stroke();
  }

  g.restore();
  g.restore();
}

export function dibujarDedo(g, xPunta, yPunta, ang = -0.38, presion = 0, escala = 1) {
  g.save();
  g.translate(xPunta, yPunta);
  if (presion > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const r = 24 + presion * 54;
    g.strokeStyle = \`rgba(140, 200, 255, \${(1 - presion * 0.5) * 0.78})\`;
    g.lineWidth = 5;
    g.beginPath();
    g.arc(0, 0, r, 0, Math.PI * 2);
    g.stroke();
    g.restore();
  }
  g.rotate(ang);
  g.scale(escala * (1 - presion * 0.03), escala * (1 + presion * 0.02));
  const w = 116;
  const L = 540;
  g.shadowColor = "rgba(0, 0, 0, 0.5)";
  g.shadowBlur = 28;
  g.beginPath();
  g.moveTo(0, -w / 2);
  g.quadraticCurveTo(-w * 0.56, -w / 2, -w * 0.56, 0);
  g.quadraticCurveTo(-w * 0.56, w / 2, 0, w / 2);
  g.lineTo(L, w * 0.58);
  g.lineTo(L, -w * 0.58);
  g.closePath();
  const piel = g.createLinearGradient(0, -w * 0.58, 0, w * 0.58);
  piel.addColorStop(0, "#f5c6a5");
  piel.addColorStop(0.5, "#eab08a");
  piel.addColorStop(1, "#a66846");
  g.fillStyle = piel;
  g.fill();
  g.shadowBlur = 0;
  redondo(g, -w * 0.38, -w * 0.33, w * 0.72, w * 0.66, 24);
  g.fillStyle = "#fbd5bf";
  g.fill();
  g.restore();
}
`;

fs.writeFileSync(path.join(DIR, "video", "mundo.js"), mundoJs, "utf8");

// ---------------- 2. Los 9 planos de EP. 5 ----------------
const planos = {
  "01-avion-ruta.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularModoAvion,
  fondoMosaico,
  insigniaEpisodio,
  pildoraEstado,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = 0;
const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tAvion = f1.t("avión");
  const tRegistrando = f1.t("registrando");
  const tCaminas = f1.t("caminas");

  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tRegistrando, [1.1, 540, 1130]],
    [tCaminas + 0.2, [1.16, 540, 1185]],
    [tCorte - 0.18, [1.16, 540, 1185]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uRuta = suave(tramo(tr, tAvion, tCaminas + 0.2));
  fondoMosaico(g, tr, -tr * 24, tr * 16, "245, 158, 11", 0.32);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularModoAvion(g, 540, 1165, 500, 880, {
    modoAvion: 1,
    progresoRuta: 0.25 + 0.75 * uRuta,
    mostrarRayosX: 1,
    alertaRastro: true,
    t: tr,
  });
  g.restore();

  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tRegistrando - 0.35, tRegistrando + 0.1)));
  insigniaEpisodio(g, 540, 645, "MITOS DE TU CELULAR", "EP. 5", "", "#F59E0B", alIns, 0.92 + 0.08 * alIns);

  const alPil = entra(tramo(tr, tRegistrando - 0.1, tCaminas + 0.15));
  pildoraEstado(g, 540, 1710, "MODO AVIÓN ACTIVO · PERO LA RUTA SIGUE GRABÁNDOSE", "239, 68, 68", alPil, 33);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}
`,

  "02-icono-chip.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(2).inicio - 0.04;
const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.inicio - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tInternet = f2.t("internet");
  const tChip = f2.t("chip");
  const tUbicacion = f2.t("ubicación");

  fondoMesaClara(g, tr, "fria");

  const cam = camino2D([
    [t0, [1.0, 540, 1080]],
    [tInternet, [1.02, 540, 1110]],
    [tUbicacion + 0.15, [1.1, 540, 1215]],
    [tCorte - 0.18, [1.1, 540, 1215]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const slideY = (1 - entra(tramo(tr, t0, t0 + 0.22))) * 34;
  const uChip = suave(tramo(tr, tChip - 0.35, tUbicacion + 0.1));

  g.save();
  vista(g, Z, cx, cy);
  g.translate(0, slideY);

  // Tarjeta superior: Llamadas e Internet APAGADOS
  redondo(g, 90, 600, 900, 410, 34);
  g.fillStyle = "#0e1726";
  g.fill();
  g.strokeStyle = "#475569";
  g.lineWidth = 4;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("LO QUE SÍ APAGA EL MODO AVIÓN", 540, 665);

  const items = [
    { x: 300, tit: "LLAMADAS", sub: "Antena celular OFF" },
    { x: 780, tit: "INTERNET", sub: "WiFi y Datos OFF" },
  ];
  for (const it of items) {
    redondo(g, it.x - 185, 725, 370, 230, 24);
    g.fillStyle = "#1e293b";
    g.fill();
    g.strokeStyle = "#64748b";
    g.lineWidth = 3;
    g.stroke();
    g.font = "800 38px Figtree";
    g.fillStyle = "#cbd5e1";
    g.fillText(it.tit, it.x, 800);
    g.font = "800 26px Figtree";
    g.fillStyle = "#f87171";
    g.fillText("✕ APAGADO", it.x, 885);
  }

  // Tarjeta inferior: Chip GPS de Ubicación ENCENDIDO
  redondo(g, 90, 1060, 900, 520, 34);
  g.fillStyle = "#061d17";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4.5;
  g.stroke();

  k.brillo(g, 540, 1320, 520, "34, 227, 155", 0.25 + 0.45 * uChip);

  redondo(g, 330, 1145, 420, 260, 26);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 4;
  g.stroke();

  g.font = "800 44px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("CHIP GPS", 540, 1235);
  g.font = "800 30px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("LECTOR DE UBICACIÓN", 540, 1300);

  g.font = "800 32px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("● SIGUE ENCENDIDO Y LEYENDO", 540, 1490);

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tChip - 0.1, tUbicacion + 0.15));
  pildoraEstado(g, 540, 1715, "APAGA TU INTERNET · PERO DEJA PRENDIDO EL CHIP GPS", "16, 185, 129", alPil, 33, true);

  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,

  "03-antenas-satelite.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(3).inicio - 0.04;
const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const t0 = f3.inicio - 0.04;
  const tCorte = v.frase(5).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tEmiten = f3.t("emiten");
  const tVuelo = f3.t("vuelo");
  const tGps = f4.t("GPS");
  const tEscucha = f4.t("escucha");
  const tSatelites = f4.t("satélites");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#0c182c");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 1080, 900, "56, 189, 248", 0.24);
  g.restore();

  const cam = camino2D([
    [t0, [1.06, 360, 1140]],
    [tVuelo, [1.06, 380, 1140]],
    [tGps, [1.04, 680, 1130]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uSat = suave(tramo(tr, f4.inicio - 0.1, tEscucha + 0.2));

  g.save();
  vista(g, Z, cx, cy);

  // COLUMNA IZQUIERDA (F3): Antenas que emiten hacia el avión -> CORTADAS
  redondo(g, 65, 620, 445, 960, 32);
  g.fillStyle = "rgba(18, 24, 38, 0.94)";
  g.fill();
  g.strokeStyle = "#f87171";
  g.lineWidth = 3.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("ANTENAS QUE EMITEN", 287, 685);
  g.font = "700 22px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("(WiFi · 5G · Bluetooth)", 287, 725);

  // Avión arriba a la izquierda protegido por barrera roja
  redondo(g, 135, 790, 305, 130, 22);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 3;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#e0f2fe";
  g.fillText("✈ CABINA VUELO", 287, 855);

  // Barrera de corte de emisión
  redondo(g, 115, 1020, 345, 78, 18);
  g.fillStyle = "#450a0a";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 26px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("✕ EMISIÓN BLOQUEADA", 287, 1059);

  // Celular abajo izquierda sin emitir
  redondo(g, 187, 1220, 200, 300, 28);
  g.fillStyle = "#1e293b";
  g.fill();
  g.strokeStyle = "#64748b";
  g.lineWidth = 3;
  g.stroke();
  g.font = "800 25px Figtree";
  g.fillStyle = "#cbd5e1";
  g.fillText("0 ONDAS", 287, 1370);

  // COLUMNA DERECHA (F4): Satélites del cielo -> El GPS solo ESCUCHA en silencio
  redondo(g, 555, 620, 460, 960, 32);
  g.fillStyle = "rgba(8, 30, 28, 0.95)";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();

  g.font = "800 28px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("RECEPTOR GPS PASIVO", 785, 685);
  g.font = "700 22px Figtree";
  g.fillStyle = "#d1fae5";
  g.fillText("No emite nada · Solo escucha", 785, 725);

  // 2 Satélites arriba enviando pulsos hacia abajo
  for (let s = 0; s < 2; s++) {
    const sx = 685 + s * 200;
    const sy = 835;
    k.brillo(g, sx, sy, 130, "250, 204, 21", 0.55);
    redondo(g, sx - 55, sy - 26, 110, 52, 12);
    g.fillStyle = "#fbbf24";
    g.fill();
    g.font = "800 20px Figtree";
    g.fillStyle = "#0f172a";
    g.fillText("SATÉLITE", sx, sy + 1);

    // Ondas bajando hacia el celular
    if (uSat > 0.05) {
      for (let w = 0; w < 3; w++) {
        const fw = ((tr * 1.1 + w * 0.33) % 1 + 1) % 1;
        const wy = mez(sy + 45, 1210, fw);
        g.strokeStyle = \`rgba(52, 211, 153, \${(1 - fw * 0.4) * uSat})\`;
        g.lineWidth = 4;
        g.beginPath();
        g.arc(sx, wy, 28 + fw * 24, 0.2 * Math.PI, 0.8 * Math.PI);
        g.stroke();
      }
    }
  }

  // Celular abajo derecha recibiendo señal satelital en silencio
  redondo(g, 650, 1210, 270, 310, 30);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 30px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("SOLO ESCUCHA", 785, 1335);
  g.font = "800 24px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("UBICACIÓN EXACTA ✓", 785, 1405);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tEmiten - 0.1, tVuelo + 0.1)) * (1 - suave(tramo(tr, f4.inicio - 0.25, f4.inicio)));
  pildoraEstado(g, 540, 1710, "EL MODO AVIÓN SOLO APAGA LO QUE EMITE ONDAS", "248, 113, 113", alP1, 33);

  const alP2 = entra(tramo(tr, tEscucha - 0.1, tSatelites + 0.2));
  pildoraEstado(g, 540, 1710, "EL CHIP GPS NO EMITE NADA: SOLO ESCUCHA SATÉLITES", "34, 227, 155", alP2, 33);

  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,

  "04-boca-libreta.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(5).inicio - 0.04;
const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tBoca = f5.t("boca");
  const tOjos = f5.t("ojos");
  const tAnotando = f5.t("anotando");
  const tLibreta = f5.t("libreta");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120c07");
  bg.addColorStop(0.55, "#26180e");
  bg.addColorStop(1, "#120b06");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 1180, 900, "251, 191, 36", 0.24);
  g.restore();

  const cam = camino2D([
    [t0, [1.08, 360, 1150]],
    [tBoca + 0.2, [1.08, 380, 1150]],
    [tOjos, [1.08, 700, 1150]],
    [tCorte - 0.18, [1.0, 540, 1150]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uEscribe = suave(tramo(tr, tOjos - 0.1, tLibreta + 0.15));

  g.save();
  vista(g, Z, cx, cy);

  // IZQUIERDA: Boca tapada con cinta (No habla / No emite)
  redondo(g, 65, 680, 435, 840, 34);
  g.fillStyle = "#1c1917";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("BOCA CON CINTA", 282, 755);

  // Silueta de cabeza con ojos abiertos y cinta en la boca
  g.fillStyle = "#334155";
  g.beginPath();
  g.arc(282, 1060, 145, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#94a3b8";
  g.lineWidth = 4;
  g.stroke();

  // Ojos bien abiertos mirando a la derecha
  for (const ox of [230, 334]) {
    g.fillStyle = "#ffffff";
    g.beginPath(); g.arc(ox, 1015, 28, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#0ea5e9";
    g.beginPath(); g.arc(ox + 8, 1015, 13, 0, Math.PI * 2); g.fill();
  }

  // Cinta cruzada sobre la boca
  g.save();
  g.translate(282, 1120);
  g.rotate(-0.12);
  redondo(g, -95, -24, 190, 48, 10);
  g.fillStyle = "#f59e0b";
  g.fill();
  g.font = "800 22px Figtree";
  g.fillStyle = "#1c1917";
  g.fillText("SIN HABLAR", 0, 1);
  g.restore();

  g.font = "800 26px Figtree";
  g.fillStyle = "#cbd5e1";
  g.fillText("No emite sonido", 282, 1340);
  g.fillStyle = "#38bdf8";
  g.fillText("¡Pero sí ve todo!", 282, 1395);

  // DERECHA: Libreta abierta anotando cada calle
  redondo(g, 540, 680, 475, 840, 34);
  g.fillStyle = "#fef3c7";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 5;
  g.stroke();

  g.font = "800 32px Figtree";
  g.fillStyle = "#78350f";
  g.fillText("LIBRETA DE CALLES", 777, 760);

  const calles = [
    "14:05 · Av. Reforma 240",
    "14:18 · Calle 12 Norte",
    "14:32 · Plaza Central",
    "14:47 · Café del Parque",
  ];
  const nLineas = Math.max(1, Math.ceil(uEscribe * calles.length));
  g.textAlign = "left";
  for (let i = 0; i < nLineas; i++) {
    const ly = 875 + i * 130;
    redondo(g, 585, ly - 42, 385, 88, 18);
    g.fillStyle = "#ffffff";
    g.fill();
    g.strokeStyle = "#10b981";
    g.lineWidth = 3;
    g.stroke();
    g.font = "800 27px Figtree";
    g.fillStyle = "#064e3b";
    g.fillText("✓ " + calles[i], 610, ly + 2);
  }

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tAnotando - 0.1, tLibreta + 0.15));
  pildoraEstado(g, 540, 1710, "NO HABLA HACIA AFUERA · PERO ANOTA CADA CALLE ADENTRO", "251, 191, 36", alPil, 32);

  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,

  "05-tunel-sensores.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(6).inicio - 0.04;
const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f6 = v.frase(6);
  const t0 = f6.inicio - 0.04;
  const tCorte = v.frase(7).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tGiroscopio = f6.t("giroscopio");
  const tPasos = f6.t("pasos");
  const tGiros = f6.t("giros");
  const tPiso = f6.t("piso");

  fondoMesaClara(g, tr, "calida");

  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tPasos, [1.04, 540, 1145]],
    [tPiso + 0.2, [1.06, 540, 1165]],
    [tCorte - 0.18, [1.06, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uProg = suave(tramo(tr, tGiroscopio - 0.2, tPiso + 0.2));
  const pasos = Math.round(mez(120, 348, uProg));
  const piso = Math.round(mez(1, 5, uProg));

  g.save();
  vista(g, Z, cx, cy);

  const cards = [
    { y: 600, col: "#38bdf8", tit: "1. ACELERÓMETRO INTERNO", val: \`\${pasos} PASOS CONTADOS\`, sub: "Detecta cada zancada y velocidad" },
    { y: 945, col: "#fbbf24", tit: "2. GIROSCOPIO 3 EJES", val: "GIRO 90° A LA DERECHA", sub: "Mide cada vuelta en esquinas o túneles" },
    { y: 1290, col: "#22e39b", tit: "3. BARÓMETRO DE PRESIÓN", val: \`SUBISTE AL PISO \${piso}\`, sub: "Calcula la altura exacta sin internet" },
  ];

  cards.forEach((c) => {
    redondo(g, 88, c.y, 904, 305, 32);
    g.fillStyle = "#0f172a";
    g.fill();
    g.strokeStyle = c.col;
    g.lineWidth = 4.5;
    g.stroke();

    g.textAlign = "left";
    g.textBaseline = "middle";
    g.font = "800 26px Figtree";
    g.fillStyle = c.col;
    g.fillText(c.tit, 140, c.y + 68);

    g.font = "800 52px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText(c.val, 140, c.y + 155);

    g.font = "700 26px Figtree";
    g.fillStyle = "#94a3b8";
    g.fillText(c.sub, 140, c.y + 235);
  });

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tGiros - 0.1, tPiso + 0.15));
  pildoraEstado(g, 540, 1715, "TUS SENSORES INTERNOS CALCULAN PASOS, GIROS Y PISOS", "245, 158, 11", alPil, 32, true);

  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,

  "06-memoria-sube.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(7).inicio - 0.04;
const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tGuarda = f7.t("guarda");
  const tSube = f7.t("sube");
  const tQuitas = f7.t("quitas");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#0d1a2f");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 1120, 880, "56, 189, 248", 0.25);
  g.restore();

  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tGuarda, [1.04, 540, 1160]],
    [tQuitas + 0.15, [1.06, 540, 1100]],
    [tCorte - 0.18, [1.06, 540, 1100]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uSube = suave(tramo(tr, tSube - 0.15, tQuitas + 0.25));

  g.save();
  vista(g, Z, cx, cy);

  // Arriba: Servidores / Nube recibiendo el paquete apenas quitas el Modo Avión
  redondo(g, 140, 620, 800, 290, 32);
  g.fillStyle = "#0c192c";
  g.fill();
  g.strokeStyle = uSube > 0.3 ? "#38bdf8" : "#334155";
  g.lineWidth = 4;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("SERVIDOR EN LA NUBE (AL QUITAR MODO AVIÓN)", 540, 700);
  g.font = "800 46px Figtree";
  g.fillStyle = uSube > 0.4 ? "#22e39b" : "#64748b";
  g.fillText(uSube > 0.4 ? "↑ HISTORIAL COMPLETO SINCRONIZADO" : "ESPERANDO CONEXIÓN...", 540, 805);

  // Haz de subida de datos
  if (uSube > 0.05) {
    const py = mez(1220, 860, uSube);
    k.brillo(g, 540, py, 240, "56, 189, 248", 0.8);
    redondo(g, 370, py - 38, 340, 76, 18);
    g.fillStyle = "#0284c7";
    g.fill();
    g.strokeStyle = "#e0f2fe";
    g.lineWidth = 3;
    g.stroke();
    g.font = "800 26px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText("RUTA_GUARDADA.LOG", 540, py + 1);
  }

  // Abajo: Chip de Memoria Interna con horas exactas
  redondo(g, 140, 1110, 800, 460, 34);
  g.fillStyle = "#091322";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();

  g.font = "800 30px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("MEMORIA INTERNA · CACHÉ DE UBICACIÓN", 540, 1185);

  const logs = [
    "14:10:02 · Lat 19.432 · Lon -99.133 (Guardado)",
    "14:25:40 · Lat 19.438 · Lon -99.141 (Guardado)",
    "14:42:15 · Lat 19.445 · Lon -99.149 (Guardado)",
  ];
  logs.forEach((l, i) => {
    redondo(g, 195, 1245 + i * 95, 690, 74, 16);
    g.fillStyle = "#111e34";
    g.fill();
    g.strokeStyle = "#fbbf24";
    g.lineWidth = 2;
    g.stroke();
    g.font = "700 25px Figtree";
    g.fillStyle = "#f8fafc";
    g.fillText(l, 540, 1282 + i * 95);
  });

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tSube - 0.1, tQuitas + 0.15));
  pildoraEstado(g, 540, 1710, "SE GUARDA EN MEMORIA Y SE SUBE AL QUITAR EL MODO AVIÓN", "56, 189, 248", alPil, 32);

  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,

  "07-boton-rastro.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularModoAvion,
  fondoMesaClara,
  pildoraEstado,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(8).inicio - 0.04;
const { tramo, entra } = k;

export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tRastro = f8.t("rastro");
  const tAlcanza = f8.t("alcanza");

  fondoMesaClara(g, tr, "fria");

  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tAlcanza + 0.15, [1.08, 540, 1165]],
    [tCorte - 0.18, [1.08, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularModoAvion(g, 540, 1135, 480, 840, {
    modoAvion: 1,
    progresoRuta: 1,
    mostrarRayosX: 1,
    alertaRastro: true,
    t: tr,
  });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tRastro - 0.1, tAlcanza + 0.15));
  pildoraEstado(g, 540, 1715, "EL BOTÓN DEL AVIÓN POR SÍ SOLO NO APAGA EL GPS", "239, 68, 68", alPil, 34, true);

  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,

  "08-ajustes-ubicacion.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarDedo,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(9).inicio - 0.04;
const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f9 = v.frase(9);
  const t0 = f9.inicio - 0.04;
  const tCorte = v.frase(10).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tApaga = f9.t("apaga");
  const tUbicacion = f9.t("Ubicación");
  const tActivar = f9.t("activar");

  fondoMesaClara(g, tr, "menta");

  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tUbicacion, [1.05, 540, 1140]],
    [tCorte - 0.18, [1.05, 540, 1140]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uOff = suave(tramo(tr, tApaga - 0.1, tUbicacion + 0.15));
  const uAvion = suave(tramo(tr, tActivar - 0.15, tActivar + 0.3));

  g.save();
  vista(g, Z, cx, cy);

  // Tarjeta 1: Ajustes > Ubicación -> OFF
  redondo(g, 88, 610, 904, 440, 34);
  g.fillStyle = "#0d1b22";
  g.fill();
  g.strokeStyle = "#10b981";
  g.lineWidth = 4.5;
  g.stroke();

  g.textAlign = "left";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("PASO 1 · ENTRA A AJUSTES DE PRIVACIDAD", 145, 690);

  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Ubicación (GPS)", 145, 795);

  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText(uOff > 0.5 ? "✓ Apagado de raíz (no escucha satélites)" : "Desactiva el interruptor general", 145, 885);

  // Switch de Ubicación pasando de verde a apagado seguro
  const swX = 815;
  const swY = 795;
  redondo(g, swX - 85, swY - 44, 170, 88, 44);
  g.fillStyle = uOff > 0.5 ? "#334155" : "#ef4444";
  g.fill();
  const knobX = mez(swX + 38, swX - 38, uOff);
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(knobX, swY, 34, 0, Math.PI * 2);
  g.fill();

  // Tarjeta 2: Ahora sí activa Modo Avión
  redondo(g, 88, 1105, 904, 440, 34);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4.5;
  g.stroke();

  g.textAlign = "left";
  g.font = "800 28px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("PASO 2 · AHORA SÍ ACTIVA EL MODO AVIÓN", 145, 1185);

  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Modo Avión + Sin GPS", 145, 1290);

  g.font = "800 30px Figtree";
  g.fillStyle = "#22e39b";
  g.fillText("🔒 CERO ANTENAS Y CERO RASTREO DE RUTA", 145, 1390);

  // Dedo tocando el interruptor de Ubicación
  if (tr < tActivar) {
    dibujarDedo(g, swX, swY + 25, -0.38, Math.sin(uOff * Math.PI), 0.92);
  }

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tUbicacion - 0.1, tActivar + 0.2));
  pildoraEstado(g, 540, 1715, "APAGA UBICACIÓN EN AJUSTES ANTES DEL MODO AVIÓN", "16, 185, 129", alPil, 33, true);

  vineta(g, 0.3);
  capaSuperiorMarca(g, 0.68);
}
`,

  "09-cierre-loop.js": `import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularModoAvion,
  fondoMosaico,
  insigniaEpisodio,
  pildoraEstado,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(10).inicio - 0.04;
const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f10 = v.frase(10);
  const f11 = v.frase(11);
  const t0 = f10.inicio - 0.04;
  const tFin = v.duracion;

  const tAmigo = f10.t("amigo");
  const tSeis = f11.t("seis");

  const uLoop = suave(tramo(t, tFin - 0.58, tFin - 0.04));

  const cam = camino2D([
    [t0, [1.18, 540, 1165]],
    [tAmigo + 0.5, [1.08, 540, 1060]],
    [f11.inicio, [1.02, 540, 980]],
    [tFin - 0.45, [1.0, 540, 960]],
    [tFin, [1.0, 540, 960]],
  ]);
  const [Z, cx, cy] = cam(t);

  const progPlano = tramo(t, t0, tFin);
  fondoMosaico(g, Math.sin(progPlano * Math.PI) * 2.4, -progPlano * 270, progPlano * 270, "245, 158, 11", 0.32);

  g.save();
  vista(g, Z, cx, cy);
  const uReset = suave(tramo(t, f11.inicio, tFin - 0.3));
  dibujarCelularModoAvion(g, 540, 1165, 500, 880, {
    modoAvion: 1,
    progresoRuta: 1 - 0.75 * uReset,
    mostrarRayosX: 1,
    alertaRastro: true,
    t,
  });
  g.restore();

  sinVista(g);
  const alShare = entra(tramo(t, t0 + 0.08, t0 + 0.32)) * (1 - suave(tramo(t, f11.inicio - 0.28, f11.inicio - 0.04)));
  pildoraEstado(g, 540, 1710, "ENVÍASELO AL AMIGO QUE USA EL MODO AVIÓN PARA OCULTARSE", "56, 189, 248", alShare, 31);

  const alNext = entra(tramo(t, f11.inicio, tSeis + 0.2)) * (1 - uLoop);
  insigniaEpisodio(g, 540, 655, "MAÑANA · MITOS DE TU CELULAR", "EP. 6", "LA TRAMPA DE LA RAM VIRTUAL", "#22E39B", alNext, 0.9 + 0.1 * alNext);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}
`,
};

for (const [name, code] of Object.entries(planos)) {
  fs.writeFileSync(path.join(DIR, "video", "planos", name), code, "utf8");
}

// ---------------- 3. sonidos.js ----------------
const sonidosJs = `export default function sonidos(v) {
  const e = [];
  const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });

  const f1 = v.frase(1);
  const f2 = v.frase(2);
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const f5 = v.frase(5);
  const f6 = v.frase(6);
  const f7 = v.frase(7);
  const f8 = v.frase(8);
  const f9 = v.frase(9);
  const f10 = v.frase(10);
  const f11 = v.frase(11);

  pon("clic", 0.14, { db: -12, que: "insignia EP. 5" });
  pon("desliza", f1.t("celular") + 0.06, { db: -12, que: "encuadre celular modo avión" });
  pon("pitido", f1.t("avión") + 0.06, { db: -11.5, lp: 4800, que: "activa modo avión" });
  pon("tic", f1.t("registrando") + 0.06, { db: -12, que: "traza puntos de ruta GPS" });
  pon("aviso", f1.t("caminas") - 0.04, { db: -10, corta: f2.inicio - 0.14, que: "alerta ruta grabándose" });

  pon("cuadro", f2.t("ícono") + 0.04, { db: -11.5, que: "tarjeta llamadas e internet" });
  pon("hueco", f2.t("llamadas") + 0.04, { db: -12, que: "apaga llamadas" });
  pon("clic", f2.t("internet") + 0.04, { db: -12, que: "apaga internet" });
  pon("sube", f2.t("chip") + 0.04, { db: -11, que: "baja al chip GPS activo" });
  pon("timbre", f2.t("ubicación") - 0.04, { db: -10.5, corta: f3.inicio - 0.14, que: "chip GPS leyendo ubicación" });

  pon("aire", f3.t("avión") + 0.06, { ancla: "empieza", db: -13.5, que: "panel antenas vs cabina" });
  pon("golpe", f3.t("corta") + 0.04, { db: -11, que: "bloquea emisión de ondas" });
  pon("tic", f3.t("cabina") + 0.06, { db: -13, que: "protege cabina de vuelo" });
  pon("desliza", f4.t("chip") + 0.04, { db: -11.5, que: "paneo a satélites GPS" });
  pon("cristal", f4.t("escucha") + 0.06, { db: -11.5, que: "ondas satelitales bajando" });
  pon("timbre", f4.t("satélites") + 0.04, { db: -11, corta: f5.inicio - 0.14, que: "recepción pasiva" });

  pon("cuadro", f5.t("taparte") + 0.04, { db: -12, que: "boca con cinta" });
  pon("aprieta", f5.t("cinta") + 0.04, { db: -11.5, que: "sella la boca" });
  pon("desliza", f5.t("ojos") + 0.04, { db: -11.5, que: "paneo a libreta abierta" });
  pon("tic", f5.t("anotando") + 0.04, { db: -12, que: "anota calles en libreta" });
  pon("timbre", f5.t("libreta") - 0.04, { db: -11, corta: f6.inicio - 0.14, que: "calles registradas" });

  pon("desliza", f6.t("túnel") + 0.04, { db: -12, que: "entran 3 módulos de sensores" });
  pon("pitido", f6.t("giroscopio") + 0.06, { db: -12, que: "activa giroscopio" });
  pon("tic", f6.t("pasos") + 0.04, { db: -11.5, que: "cuenta pasos" });
  pon("clic", f6.t("giros") + 0.04, { db: -12, que: "registra giro 90 grados" });
  pon("sube", f6.t("piso") + 0.04, { db: -11, corta: f7.inicio - 0.14, que: "barómetro marca piso" });

  pon("cuadro", f7.t("mapa") + 0.04, { db: -12, que: "memoria interna con horas" });
  pon("tic", f7.t("hora") + 0.06, { db: -12.5, que: "sello de hora exacta" });
  pon("sube", f7.t("sube") + 0.04, { db: -10.5, que: "paquete sube a la nube" });
  pon("timbre", f7.t("quitas") + 0.04, { db: -11, corta: f8.inicio - 0.14, que: "sincronización al quitar avión" });

  pon("aire", f8.t("verdad") + 0.04, { ancla: "empieza", db: -13.5, que: "celular dejando rastro" });
  pon("aviso", f8.t("rastro") + 0.04, { db: -10.5, que: "alerta rastro en mapa" });
  pon("golpe", f8.t("alcanza") - 0.04, { db: -10.5, corta: f9.inicio - 0.14, que: "el avión no alcanza" });

  pon("desliza", f9.t("Ajustes") + 0.04, { db: -11.5, que: "entra tarjeta Ajustes" });
  pon("clic", f9.t("apaga") + 0.04, { db: -10, que: "dedo apaga Ubicación" });
  pon("timbre", f9.t("Ubicación") + 0.04, { db: -10.5, que: "GPS apagado de raíz" });
  pon("pitido", f9.t("activar") + 0.04, { db: -11.5, corta: f10.inicio - 0.14, que: "modo avión sin rastro" });

  pon("sube", f10.t("Envíaselo") + 0.1, { db: -11, que: "compartir con amigo" });
  pon("clic", f10.t("amigo") + 0.1, { db: -12, que: "píldora compartir" });
  pon("tic", f10.t("invisible") - 0.06, { db: -12.5, que: "regreso encuadre" });
  pon("golpe", f11.t("seis") - 0.04, { db: -10, que: "insignia EP. 6 mañana" });
  pon("timbre", f11.t("lento") - 0.04, { db: -11, corta: v.duracion - 0.2, que: "adelanto RAM virtual" });

  return e;
}
`;

fs.writeFileSync(path.join(DIR, "sonidos.js"), sonidosJs, "utf8");
console.log("EP. 5 construido completamente.");

import fs from "node:fs";
import path from "node:path";

const BASE = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/proyectos";

// ============================================================================
// BASE MUNDO.JS COMPARTIDO (Estilo Sovera · ATOM Élite 60 fps)
// ============================================================================
const COMMON_MUNDO_HEADER = `import * as k from "#kit";

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

// ============================================================================
// EP. 6: 2026-11-04-ep6-ram-virtual-lento
// ============================================================================
function buildEp6() {
  const dir = path.join(BASE, "2026-11-04-ep6-ram-virtual-lento");
  const mundo = COMMON_MUNDO_HEADER + `
export function dibujarCelularRamVirtual(g, cx, cy, w, h, opts = {}) {
  const { ramPlusOn = 1, desgaste = 0.75, lento = true } = opts;
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
  pGrad.addColorStop(0, "#101b30");
  pGrad.addColorStop(1, "#070b14");
  g.fillStyle = pGrad;
  g.fillRect(sx, sy, sw, sh);

  // Tarjeta superior RAM VIRTUAL +8 GB
  const cW = sw * 0.86;
  const cH = sh * 0.25;
  const cY = sy + sh * 0.08;
  redondo(g, cx - cW / 2, cY, cW, cH, 24);
  g.fillStyle = "rgba(18, 28, 46, 0.95)";
  g.fill();
  g.strokeStyle = ramPlusOn > 0.5 ? "#ef4444" : "#22e39b";
  g.lineWidth = 3.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = \`800 \${Math.round(sw * 0.052)}px Figtree\`;
  g.fillStyle = "#ffffff";
  g.fillText(ramPlusOn > 0.5 ? "RAM VIRTUAL: +8 GB ON" : "RAM VIRTUAL: APAGADA", cx, cY + cH * 0.34);

  g.font = \`800 \${Math.round(sw * 0.04)}px Figtree\`;
  g.fillStyle = ramPlusOn > 0.5 ? "#fca5a5" : "#6ee7b7";
  g.fillText(ramPlusOn > 0.5 ? "⚠ USANDO MEMORIA DE FOTOS (15x LENTA)" : "✓ SOLO RAM FÍSICA ULTRARRÁPIDA", cx, cY + cH * 0.72);

  // Ventana Rayos X: Chip RAM Rápido vs Chip NAND desgastándose
  const mW = sw * 0.86;
  const mH = sh * 0.52;
  const mY = sy + sh * 0.38;
  redondo(g, cx - mW / 2, mY, mW, mH, 26);
  g.fillStyle = "#08121e";
  g.fill();
  g.strokeStyle = lento ? "#f59e0b" : "#22e39b";
  g.lineWidth = 3.5;
  g.stroke();

  // Chip RAM real arriba
  redondo(g, cx - mW * 0.4, mY + 26, mW * 0.8, mH * 0.34, 18);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 3;
  g.stroke();
  g.font = \`800 \${Math.round(sw * 0.044)}px Figtree\`;
  g.fillStyle = "#ffffff";
  g.fillText("CHIP RAM REAL · 64 GB/s", cx, mY + 26 + mH * 0.17);

  // Chip Almacenamiento lento abajo
  redondo(g, cx - mW * 0.4, mY + mH * 0.46, mW * 0.8, mH * 0.46, 18);
  g.fillStyle = lento ? "#450a0a" : "#1e293b";
  g.fill();
  g.strokeStyle = lento ? "#ef4444" : "#64748b";
  g.lineWidth = 3;
  g.stroke();
  g.font = \`800 \${Math.round(sw * 0.042)}px Figtree\`;
  g.fillStyle = "#fca5a5";
  g.fillText("MEMORIA DE FOTOS · 15x MÁS LENTA", cx, mY + mH * 0.62);

  // Barra de desgaste
  const bW = mW * 0.68;
  redondo(g, cx - bW / 2, mY + mH * 0.74, bW, 24, 12);
  g.fillStyle = "#1f2937";
  g.fill();
  redondo(g, cx - bW / 2, mY + mH * 0.74, bW * Math.max(0.1, desgaste), 24, 12);
  g.fillStyle = "#ef4444";
  g.fill();

  g.restore();
  g.restore();
}
`;
  fs.writeFileSync(path.join(dir, "video", "mundo.js"), mundo, "utf8");

  const planos = {
    "01-gancho-ram.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularRamVirtual, fondoMosaico, insigniaEpisodio, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = 0;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tVirtual = f1.t("virtual");
  const tLento = f1.t("lento");
  const tMemoria = f1.t("memoria");
  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tLento, [1.1, 540, 1130]],
    [tMemoria + 0.2, [1.16, 540, 1185]],
    [tCorte - 0.18, [1.16, 540, 1185]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uDesgaste = suave(tramo(tr, tVirtual, tMemoria + 0.2));
  fondoMosaico(g, tr, -tr * 24, tr * 16, "239, 68, 68", 0.32);
  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularRamVirtual(g, 540, 1165, 500, 880, { ramPlusOn: 1, desgaste: 0.25 + 0.7 * uDesgaste, lento: true });
  g.restore();
  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tLento - 0.35, tLento + 0.1)));
  insigniaEpisodio(g, 540, 645, "MITOS DE TU CELULAR", "EP. 6", "", "#EF4444", alIns, 0.92 + 0.08 * alIns);
  const alPil = entra(tramo(tr, tLento - 0.1, tMemoria + 0.15));
  pildoraEstado(g, 540, 1710, "LA RAM VIRTUAL PUEDE FRENAR Y DESGASTAR TU CELULAR", "239, 68, 68", alPil, 33);
  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}
`,
    "02-promesa-trampa.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(2).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.inicio - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tOcho = f2.t("ocho");
  const tBoton = f2.t("botón");
  const tTrampa = f2.t("trampa");
  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1080]],
    [tBoton, [1.04, 540, 1120]],
    [tTrampa + 0.15, [1.1, 540, 1200]],
    [tCorte - 0.18, [1.1, 540, 1200]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uTrampa = suave(tramo(tr, tBoton, tTrampa + 0.15));
  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 90, 610, 900, 420, 34);
  g.fillStyle = "#0e1726";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("LO QUE TE PROMETE LA CAJA", 540, 685);
  g.font = "800 84px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("+8 GB RAM GRATIS", 540, 810);
  g.font = "700 30px Figtree";
  g.fillStyle = "#34d399";
  g.fillText("«Actívalo con un botón en Ajustes»", 540, 930);

  redondo(g, 90, 1080, 900, 490, 34);
  g.fillStyle = "#2a0a0e";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4.5;
  g.stroke();
  k.brillo(g, 540, 1320, 500, "239, 68, 68", 0.25 + 0.45 * uTrampa);
  g.font = "800 34px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("LA TRAMPA REAL POR DENTRO", 540, 1175);
  g.font = "800 54px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("NO ES MEMORIA RAM REAL", 540, 1300);
  g.font = "700 32px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Te quita 8 GB de tu espacio de fotos y videos", 540, 1425);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tBoton - 0.1, tTrampa + 0.15));
  pildoraEstado(g, 540, 1715, "PROMETEN +8 GB GRATIS · PERO ES UN TRUCO CON TRAMPA", "239, 68, 68", alPil, 33, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "03-ram-vs-flash.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(3).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const t0 = f3.inicio - 0.04;
  const tCorte = v.frase(5).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tUltrarrapido = f3.t("ultrarrápido");
  const tInstante = f3.t("instante");
  const tVirtual = f4.t("virtual");
  const tQuince = f4.t("quince");
  const tLento = f4.t("lento");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#0c182c");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.06, 360, 1140]],
    [tInstante, [1.06, 380, 1140]],
    [tVirtual, [1.04, 680, 1130]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Columna Izquierda (F3): RAM FÍSICA REAL (LPDDR5)
  redondo(g, 65, 620, 445, 960, 32);
  g.fillStyle = "rgba(8, 30, 24, 0.95)";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("RAM FÍSICA REAL", 287, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#d1fae5";
  g.fillText("Soldada junto al procesador", 287, 735);

  redondo(g, 125, 820, 325, 240, 24);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 54px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("64 GB/s", 287, 915);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("⚡ RESPUESTA AL INSTANTE", 287, 995);

  redondo(g, 125, 1140, 325, 360, 24);
  g.fillStyle = "#042f2e";
  g.fill();
  g.font = "800 32px Figtree";
  g.fillStyle = "#34d399";
  g.fillText("1X VELOCIDAD MÁXIMA", 287, 1320);

  // Columna Derecha (F4): RAM VIRTUAL (Almacenamiento de Fotos)
  redondo(g, 555, 620, 460, 960, 32);
  g.fillStyle = "rgba(32, 12, 16, 0.95)";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 30px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("RAM VIRTUAL PRESTADA", 785, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#fecdd3";
  g.fillText("Chip donde guardas tus fotos", 785, 735);

  redondo(g, 620, 820, 330, 240, 24);
  g.fillStyle = "#450a0a";
  g.fill();
  g.strokeStyle = "#f87171";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 54px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("4 GB/s", 785, 915);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("🐢 CUELLO DE BOTELLA", 785, 995);

  redondo(g, 620, 1140, 330, 360, 24);
  g.fillStyle = "#3b0712";
  g.fill();
  g.font = "800 44px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("15 VECES", 785, 1285);
  g.font = "800 34px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("MÁS LENTA", 785, 1355);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tUltrarrapido - 0.1, tInstante + 0.1)) * (1 - suave(tramo(tr, f4.inicio - 0.25, f4.inicio)));
  pildoraEstado(g, 540, 1710, "LA RAM REAL ESTÁ SOLDADA AL PROCESADOR Y ES ULTRARRÁPIDA", "34, 227, 155", alP1, 31);
  const alP2 = entra(tramo(tr, tQuince - 0.1, tLento + 0.2));
  pildoraEstado(g, 540, 1710, "LA RAM VIRTUAL USA EL CHIP DE TUS FOTOS: 15 VECES MÁS LENTO", "239, 68, 68", alP2, 31);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "04-cocina-sotano.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(5).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tMesa = f5.t("mesa");
  const tSotano = f5.t("sótano");
  const tCorriendo = f5.t("corriendo");
  const tCuchara = f5.t("cuchara");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120c07");
  bg.addColorStop(0.55, "#26180e");
  bg.addColorStop(1, "#120b06");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.06, 540, 920]],
    [tMesa + 0.2, [1.06, 540, 920]],
    [tSotano, [1.06, 540, 1280]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Arriba: Mesa de tu cocina (RAM Real a la mano)
  redondo(g, 90, 610, 900, 410, 34);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = "#a7f3d0";
  g.fillText("MESA DE TU COCINA (RAM FÍSICA REAL)", 540, 690);
  g.font = "800 50px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("TODO A LA MANO EN 0.1 SEGUNDOS", 540, 815);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("Agarras cada utensilio sin moverte", 540, 920);

  // Abajo: Sótano con escaleras largas (RAM Virtual)
  redondo(g, 90, 1080, 900, 500, 34);
  g.fillStyle = "#27120b";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("SÓTANO OSCURO (RAM VIRTUAL EN DISCO)", 540, 1160);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("BAJAR 20 ESCALONES POR CADA CUCHARA", 540, 1295);
  g.font = "800 30px Figtree";
  g.fillStyle = "#f87171";
  g.fillText("✕ Pierdes tiempo subiendo y bajando sin parar", 540, 1445);

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tCorriendo - 0.1, tCuchara + 0.15));
  pildoraEstado(g, 540, 1710, "ES COMO BAJAR AL SÓTANO CORRIENDO POR CADA CUCHARA", "251, 191, 36", alPil, 32);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "05-procesador-esperando.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(6).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f6 = v.frase(6);
  const t0 = f6.inicio - 0.04;
  const tCorte = v.frase(7).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tProcesador = f6.t("procesador");
  const tEsperando = f6.t("esperando");
  const tLento = f6.t("lento");

  fondoMesaClara(g, tr, "calida");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tEsperando, [1.05, 540, 1150]],
    [tCorte - 0.18, [1.05, 540, 1150]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  const cards = [
    { y: 600, col: "#38bdf8", tit: "1. CAMBIAS DE WHATSAPP A CÁMARA", val: "PIDIENDO DATOS...", sub: "La app estaba guardada en la RAM virtual" },
    { y: 945, col: "#f59e0b", tit: "2. PROCESADOR EN PAUSA", val: "ESPERANDO AL CHIP LENTO", sub: "El CPU se queda frenado varios milisegundos" },
    { y: 1290, col: "#ef4444", tit: "3. TIRÓN EN TU PANTALLA", val: "ANIMACIÓN TRABADA", sub: "Sientes tirones al abrir o cambiar de aplicación" },
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
    g.font = "800 50px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText(c.val, 140, c.y + 155);
    g.font = "700 26px Figtree";
    g.fillStyle = "#94a3b8";
    g.fillText(c.sub, 140, c.y + 235);
  });

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tEsperando - 0.1, tLento + 0.15));
  pildoraEstado(g, 540, 1715, "TU PROCESADOR PIERDE TIEMPO ESPERANDO AL CHIP LENTO", "245, 158, 11", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "06-desgaste-memoria.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(7).inicio - 0.04;
const { suave, tramo, entra, mez } = k;
export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tMiles = f7.t("miles");
  const tGastando = f7.t("gastando");
  const tAlmacenamiento = f7.t("almacenamiento");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#1f0910");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tGastando, [1.06, 540, 1120]],
    [tCorte - 0.18, [1.06, 540, 1120]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uWear = suave(tramo(tr, tMiles - 0.2, tAlmacenamiento + 0.15));
  const escrituras = Math.round(mez(1200, 9850, uWear));
  const salud = Math.round(mez(98, 72, uWear));

  g.save();
  vista(g, Z, cx, cy);

  redondo(g, 110, 620, 860, 420, 34);
  g.fillStyle = "#1a0a12";
  g.fill();
  g.strokeStyle = "#f43f5e";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#fda4af";
  g.fillText("ESCRITURAS POR MINUTO EN TU MEMORIA INTERNA", 540, 700);
  g.font = "800 92px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText(\`\${escrituras} / MIN\`, 540, 835);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("Roce eléctrico constante sobre las celdas donde guardas fotos", 540, 955);

  redondo(g, 110, 1100, 860, 460, 34);
  g.fillStyle = "#091322";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText(\`VIDA ÚTIL DE TU ALMACENAMIENTO: \${salud}%\`, 540, 1200);

  redondo(g, 190, 1290, 700, 56, 28);
  g.fillStyle = "#1e293b";
  g.fill();
  redondo(g, 190, 1290, 700 * (salud / 100), 56, 28);
  g.fillStyle = "#ef4444";
  g.fill();

  g.font = "800 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("⚠ Las celdas Flash tienen un límite fijo de escrituras", 540, 1445);

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tGastando - 0.1, tAlmacenamiento + 0.15));
  pildoraEstado(g, 540, 1710, "MILES DE ESCRITURAS POR MINUTO DESGASTAN TU MEMORIA", "244, 63, 94", alPil, 32);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "07-seis-ocho-gigas.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularRamVirtual, fondoMesaClara, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(8).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tFisica = f8.t("física");
  const tEstorba = f8.t("estorba");

  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tEstorba + 0.15, [1.08, 540, 1165]],
    [tCorte - 0.18, [1.08, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularRamVirtual(g, 540, 1135, 480, 840, { ramPlusOn: 1, desgaste: 0.85, lento: true });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tFisica - 0.1, tEstorba + 0.15));
  pildoraEstado(g, 540, 1715, "CON 6 U 8 GB DE RAM FÍSICA · LA RAM VIRTUAL SOLO ESTORBA", "239, 68, 68", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "08-apaga-ram-plus.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarDedo, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(9).inicio - 0.04;
const { suave, tramo, entra, mez } = k;
export function dibuja(g, t) {
  const f9 = v.frase(9);
  const t0 = f9.inicio - 0.04;
  const tCorte = v.frase(10).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tPlus = f9.t("Plus");
  const tApagala = f9.t("apágala");
  const tReinicia = f9.t("reinicia");

  fondoMesaClara(g, tr, "menta");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tApagala, [1.05, 540, 1140]],
    [tCorte - 0.18, [1.05, 540, 1140]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uOff = suave(tramo(tr, tPlus - 0.1, tApagala + 0.2));

  g.save();
  vista(g, Z, cx, cy);

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
  g.fillText("PASO 1 · AJUSTES > EXTENSIÓN DE MEMORIA / RAM PLUS", 135, 690);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("RAM Plus / RAM Virtual", 135, 795);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText(uOff > 0.5 ? "✓ Apagada (recuperas 8 GB y velocidad pura)" : "Desactiva el interruptor", 135, 885);

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

  redondo(g, 88, 1105, 904, 440, 34);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("PASO 2 · REINICIA TU CELULAR", 135, 1185);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("100% RAM Física LPDDR5", 135, 1290);
  g.font = "800 30px Figtree";
  g.fillStyle = "#22e39b";
  g.fillText("⚡ CERO DESGASTE Y RESPUESTA INSTANTÁNEA", 135, 1390);

  if (tr < tReinicia) {
    dibujarDedo(g, swX, swY + 25, -0.38, Math.sin(uOff * Math.PI), 0.92);
  }
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tApagala - 0.1, tReinicia + 0.2));
  pildoraEstado(g, 540, 1715, "APAGA RAM PLUS O EXTENSIÓN DE MEMORIA Y REINICIA", "16, 185, 129", alPil, 33, true);
  vineta(g, 0.3);
  capaSuperiorMarca(g, 0.68);
}
`,
    "09-cierre-loop.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularRamVirtual, fondoMosaico, insigniaEpisodio, pildoraEstado, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(10).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f10 = v.frase(10);
  const f11 = v.frase(11);
  const t0 = f10.inicio - 0.04;
  const tFin = v.duracion;
  const tAmigo = f10.t("amigo");
  const tSiete = f11.t("siete");
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
  fondoMosaico(g, Math.sin(progPlano * Math.PI) * 2.4, -progPlano * 270, progPlano * 270, "239, 68, 68", 0.32);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularRamVirtual(g, 540, 1165, 500, 880, { ramPlusOn: 1, desgaste: 0.75, lento: true });
  g.restore();

  sinVista(g);
  const alShare = entra(tramo(t, t0 + 0.08, t0 + 0.32)) * (1 - suave(tramo(t, f11.inicio - 0.28, f11.inicio - 0.04)));
  pildoraEstado(g, 540, 1710, "ENVÍASELO AL AMIGO QUE SUBIÓ LA RAM VIRTUAL AL MÁXIMO", "56, 189, 248", alShare, 31);

  const alNext = entra(tramo(t, f11.inicio, tSiete + 0.2)) * (1 - uLoop);
  insigniaEpisodio(g, 540, 655, "MAÑANA · MITOS DE TU CELULAR", "EP. 7", "PROTECTORES EN LENTES DE CÁMARA", "#F59E0B", alNext, 0.9 + 0.1 * alNext);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}
`,
  };

  for (const [name, code] of Object.entries(planos)) {
    fs.writeFileSync(path.join(dir, "video", "planos", name), code, "utf8");
  }

  const sonidos = `export default function sonidos(v) {
  const e = [];
  const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5),
        f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);

  pon("clic", 0.14, { db: -12, que: "insignia EP. 6" });
  pon("desliza", f1.t("virtual") + 0.06, { db: -12, que: "encuadre RAM virtual" });
  pon("aviso", f1.t("lento") + 0.04, { db: -11, que: "alerta lentitud" });
  pon("golpe", f1.t("memoria") - 0.04, { db: -10.5, corta: f2.inicio - 0.14, que: "desgaste memoria" });

  pon("cuadro", f2.t("prometen") + 0.04, { db: -11.5, que: "tarjeta +8 GB gratis" });
  pon("clic", f2.t("botón") + 0.04, { db: -12, que: "botón engañoso" });
  pon("aviso", f2.t("trampa") - 0.04, { db: -10.5, corta: f3.inicio - 0.14, que: "truco con trampa" });

  pon("desliza", f3.t("real") + 0.04, { db: -11.5, que: "columna RAM real" });
  pon("cristal", f3.t("ultrarrápido") + 0.04, { db: -11.5, que: "brillo chip 64 GB/s" });
  pon("timbre", f3.t("instante") + 0.04, { db: -11, que: "respuesta al instante" });
  pon("desliza", f4.t("virtual") + 0.04, { db: -11.5, que: "columna RAM virtual" });
  pon("golpe", f4.t("quince") + 0.04, { db: -10.5, que: "15 veces más lento" });
  pon("aviso", f4.t("lento") - 0.04, { db: -11, corta: f5.inicio - 0.14, que: "chip lento" });

  pon("cuadro", f5.t("mesa") + 0.04, { db: -12, que: "mesa de cocina" });
  pon("desliza", f5.t("sótano") + 0.04, { db: -11.5, que: "baja al sótano" });
  pon("tic", f5.t("corriendo") + 0.04, { db: -12, que: "escalones corriendo" });
  pon("timbre", f5.t("cuchara") - 0.04, { db: -11, corta: f6.inicio - 0.14, que: "cada cuchara" });

  pon("desliza", f6.t("aplicaciones") + 0.04, { db: -12, que: "3 tarjetas procesador" });
  pon("pitido", f6.t("procesador") + 0.04, { db: -12, que: "procesador en pausa" });
  pon("aviso", f6.t("lento") - 0.04, { db: -10.5, corta: f7.inicio - 0.14, que: "esperando chip lento" });

  pon("tic", f7.t("miles") + 0.04, { db: -11.5, que: "contador escrituras" });
  pon("aprieta", f7.t("roce") + 0.04, { db: -11.5, que: "roce constante" });
  pon("golpe", f7.t("almacenamiento") - 0.04, { db: -10.5, corta: f8.inicio - 0.14, que: "desgaste vida útil" });

  pon("cuadro", f8.t("ocho") + 0.04, { db: -11.5, que: "6 u 8 GB físicos" });
  pon("aviso", f8.t("estorba") - 0.04, { db: -10.5, corta: f9.inicio - 0.14, que: "memoria prestada estorba" });

  pon("desliza", f9.t("Ajustes") + 0.04, { db: -11.5, que: "entra Ajustes RAM Plus" });
  pon("clic", f9.t("apágala") + 0.04, { db: -10, que: "dedo apaga RAM Plus" });
  pon("timbre", f9.t("reinicia") + 0.04, { db: -10.5, corta: f10.inicio - 0.14, que: "reinicia celular" });

  pon("sube", f10.t("Envíaselo") + 0.1, { db: -11, que: "compartir con amigo" });
  pon("clic", f10.t("amigo") + 0.1, { db: -12, que: "píldora compartir" });
  pon("golpe", f11.t("siete") - 0.04, { db: -10, que: "insignia EP. 7 mañana" });
  pon("timbre", f11.t("fotos") - 0.04, { db: -11, corta: v.duracion - 0.2, que: "adelanto protectores cámara" });

  return e;
}
`;
  fs.writeFileSync(path.join(dir, "sonidos.js"), sonidos, "utf8");
  console.log("EP. 6 construido.");
}

// ============================================================================
// EP. 7: 2026-11-04-ep7-protector-camara-fotos
// ============================================================================
function buildEp7() {
  const dir = path.join(BASE, "2026-11-04-ep7-protector-camara-fotos");
  const mundo = COMMON_MUNDO_HEADER + `
export function dibujarCamaraProtector(g, cx, cy, w, h, opts = {}) {
  const { protectorPuesto = 1, destellos = 0.85 } = opts;
  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const r = w * 0.135;

  g.save();
  g.shadowColor = "rgba(0, 0, 0, 0.68)";
  g.shadowBlur = 46;
  g.shadowOffsetY = 22;
  redondo(g, x0, y0, w, h, r);
  g.fillStyle = "#161d2a";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  redondo(g, x0, y0, w, h, r);
  k.metal(g, x0, x0 + w, ["#4d5666", "#d5deec", "#697588", "#eef3fa", "#373f4d"]);

  const b = Math.max(8, w * 0.026);
  redondo(g, x0 + b, y0 + b, w - b * 2, h - b * 2, r - b * 0.7);
  g.fillStyle = "#0a0f18";
  g.fill();

  // Módulo de triple cámara trasera + sensor láser
  const modW = w * 0.56;
  const modH = h * 0.36;
  const modX = x0 + w * 0.08;
  const modY = y0 + h * 0.07;
  redondo(g, modX, modY, modW, modH, 36);
  g.fillStyle = "#111827";
  g.fill();
  g.strokeStyle = protectorPuesto > 0.5 ? "#ef4444" : "#22e39b";
  g.lineWidth = 4;
  g.stroke();

  const lentes = [
    [modX + modW * 0.3, modY + modH * 0.28, 46],
    [modX + modW * 0.3, modY + modH * 0.72, 46],
    [modX + modW * 0.72, modY + modH * 0.5, 42],
  ];
  for (const [lx, ly, lr] of lentes) {
    g.fillStyle = "#030712";
    g.beginPath(); g.arc(lx, ly, lr, 0, Math.PI * 2); g.fill();
    g.strokeStyle = protectorPuesto > 0.5 ? "#f59e0b" : "#38bdf8";
    g.lineWidth = 5;
    g.stroke();
    if (protectorPuesto > 0.5 && destellos > 0.1) {
      k.brillo(g, lx + 10, ly - 10, lr * 1.9, "74, 222, 128", 0.55 * destellos);
    }
  }

  // Visor de foto nocturna abajo mostrando fantasmas verdes y neblina
  const vW = w * 0.84;
  const vH = h * 0.44;
  const vY = y0 + h * 0.48;
  redondo(g, cx - vW / 2, vY, vW, vH, 26);
  g.fillStyle = "#050914";
  g.fill();
  g.strokeStyle = protectorPuesto > 0.5 ? "#ef4444" : "#22e39b";
  g.lineWidth = 3.5;
  g.stroke();

  // Farola nocturna + fantasmas verdes si tiene protector
  k.brillo(g, cx - 75, vY + vH * 0.38, 160, "253, 224, 71", 0.75);
  if (protectorPuesto > 0.5) {
    k.brillo(g, cx + 65, vY + vH * 0.48, 220, "74, 222, 128", 0.7 * destellos);
    k.brillo(g, cx, vY + vH * 0.55, 360, "255, 255, 255", 0.35 * destellos);
  }

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = \`800 \${Math.round(w * 0.042)}px Figtree\`;
  g.fillStyle = protectorPuesto > 0.5 ? "#fca5a5" : "#6ee7b7";
  g.fillText(protectorPuesto > 0.5 ? "✕ FANTASMAS VERDES + NEBLINA" : "✓ FOTO NOCTURNA NÍTIDA Y LIMPIA", cx, vY + vH - 38);

  g.restore();
}
`;
  fs.writeFileSync(path.join(dir, "video", "mundo.js"), mundo, "utf8");

  const planos = {
    "01-gancho-protector.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCamaraProtector, fondoMosaico, insigniaEpisodio, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = 0;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tVidrio = f1.t("vidrio");
  const tArruina = f1.t("arruina");
  const tNoche = f1.t("noche");
  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tArruina, [1.1, 540, 1130]],
    [tNoche + 0.2, [1.16, 540, 1185]],
    [tCorte - 0.18, [1.16, 540, 1185]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uDest = suave(tramo(tr, tVidrio, tNoche + 0.2));
  fondoMosaico(g, tr, -tr * 24, tr * 16, "245, 158, 11", 0.32);
  g.save();
  vista(g, Z, cx, cy);
  dibujarCamaraProtector(g, 540, 1165, 500, 880, { protectorPuesto: 1, destellos: 0.3 + 0.7 * uDest });
  g.restore();
  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tArruina - 0.35, tArruina + 0.1)));
  insigniaEpisodio(g, 540, 645, "MITOS DE TU CELULAR", "EP. 7", "", "#F59E0B", alIns, 0.92 + 0.08 * alIns);
  const alPil = entra(tramo(tr, tArruina - 0.1, tNoche + 0.15));
  pildoraEstado(g, 540, 1710, "EL PROTECTOR DE CÁMARA ARRUINA TUS FOTOS DE NOCHE", "239, 68, 68", alPil, 33);
  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}
`,
    "02-anillos-sabotean.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(2).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.inicio - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tAnillos = f2.t("anillos");
  const tSabotean = f2.t("sabotean");
  const tOptica = f2.t("óptica");
  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1080]],
    [tAnillos, [1.04, 540, 1120]],
    [tOptica + 0.15, [1.1, 540, 1200]],
    [tCorte - 0.18, [1.1, 540, 1200]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 90, 610, 900, 420, 34);
  g.fillStyle = "#0e1726";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("ACCESORIO DE $3 DÓLARES", 540, 685);
  g.font = "800 72px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("ANILLOS DE VIDRIO Y BRILLOS", 540, 810);
  g.font = "700 30px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("Se pegan con adhesivo encima del lente original", 540, 930);

  redondo(g, 90, 1080, 900, 490, 34);
  g.fillStyle = "#2a0a0e";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 34px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("LO QUE HACEN EN REALIDAD", 540, 1175);
  g.font = "800 56px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("SABOTEAN LA ÓPTICA DE FÁBRICA", 540, 1305);
  g.font = "700 32px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Convierten una cámara de $1,000 en una webcam borrosa", 540, 1430);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tSabotean - 0.1, tOptica + 0.15));
  pildoraEstado(g, 540, 1715, "ESOS ANILLOS BARATOS SABOTEAN LA ÓPTICA DE TU CÁMARA", "239, 68, 68", alPil, 33, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "03-zafiro-vs-colchon.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(3).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const t0 = f3.inicio - 0.04;
  const tCorte = v.frase(5).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tZafiro = f3.t("zafiro");
  const tReflejos = f3.t("reflejos");
  const tVidrio = f4.t("vidrio");
  const tColchon = f4.t("colchón");
  const tCristales = f4.t("cristales");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#0c182c");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.06, 360, 1140]],
    [tReflejos, [1.06, 380, 1140]],
    [tVidrio, [1.04, 680, 1130]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Izquierda (F3): Lente Original con Zafiro + 7 capas antirreflejo
  redondo(g, 65, 620, 445, 960, 32);
  g.fillStyle = "rgba(8, 30, 24, 0.95)";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("LENTE ORIGINAL DE FÁBRICA", 287, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#d1fae5";
  g.fillText("Cristal templado con Zafiro", 287, 735);

  redondo(g, 115, 820, 345, 320, 24);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 50px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("7 CAPAS NANO", 287, 930);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("✓ EVITAN REFLEJOS (99% LUZ)", 287, 1020);

  // Derecha (F4): Vidrio barato encima + colchón de aire encerrado
  redondo(g, 555, 620, 460, 960, 32);
  g.fillStyle = "rgba(32, 12, 16, 0.95)";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("CON PROTECTOR PEGADO", 785, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#fecdd3";
  g.fillText("Dos cristales + aire atrapado", 785, 735);

  redondo(g, 605, 820, 360, 320, 24);
  g.fillStyle = "#450a0a";
  g.fill();
  g.strokeStyle = "#f87171";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 42px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("COLCHÓN DE AIRE", 785, 930);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("✕ ATRAPA POLVO Y REBOTA LUZ", 785, 1020);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tZafiro - 0.1, tReflejos + 0.1)) * (1 - suave(tramo(tr, f4.inicio - 0.25, f4.inicio)));
  pildoraEstado(g, 540, 1710, "TU LENTE YA TRAE CRISTAL CON ZAFIRO Y 7 CAPAS ANTIRREFLEJO", "34, 227, 155", alP1, 30);
  const alP2 = entra(tramo(tr, tColchon - 0.1, tCristales + 0.2));
  pildoraEstado(g, 540, 1710, "EL PROTECTOR DEJA UN COLCHÓN DE AIRE ENTRE LOS DOS CRISTALES", "239, 68, 68", alP2, 30);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "04-lentes-plastico.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(5).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tRayado = f5.t("rayado");
  const tAnteojos = f5.t("anteojos");
  const tLimpiados = f5.t("limpiados");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120c07");
  bg.addColorStop(0.55, "#26180e");
  bg.addColorStop(1, "#120b06");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.04, 540, 1020]],
    [tAnteojos, [1.06, 540, 1180]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  redondo(g, 90, 610, 900, 410, 34);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = "#a7f3d0";
  g.fillText("ABAJO: ANTEOJOS CAROS RECIÉN LIMPIADOS", 540, 690);
  g.font = "800 50px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("CRISTAL ÓPTICO DE ALTA PRECISIÓN", 540, 820);

  redondo(g, 90, 1080, 900, 500, 34);
  g.fillStyle = "#27120b";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("ENCIMA: LENTES DE SOL DE PLÁSTICO RAYADO", 540, 1165);
  g.font = "800 48px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("VES TODO SUCIO, OPACO Y CON REFLEJOS", 540, 1300);
  g.font = "800 30px Figtree";
  g.fillStyle = "#f87171";
  g.fillText("✕ La peor capa define la calidad final de tu foto", 540, 1445);

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tAnteojos - 0.1, tLimpiados + 0.15));
  pildoraEstado(g, 540, 1710, "ES COMO PONER PLÁSTICO RAYADO SOBRE ANTEOJOS CAROS", "251, 191, 36", alPil, 32);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "05-fantasmas-verdes.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(6).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f6 = v.frase(6);
  const t0 = f6.inicio - 0.04;
  const tCorte = v.frase(7).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tRebota = f6.t("rebota");
  const tFantasmas = f6.t("fantasmas");
  const tNeblina = f6.t("neblina");

  fondoMesaClara(g, tr, "calida");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tFantasmas, [1.05, 540, 1150]],
    [tCorte - 0.18, [1.05, 540, 1150]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  const cards = [
    { y: 600, col: "#38bdf8", tit: "1. ENTRA LA LUZ DE LAS FAROLAS", val: "REBOTE EN EL HUECO DE AIRE", sub: "El rayo choca entre el protector barato y el lente" },
    { y: 945, col: "#4ade80", tit: "2. EFECTO FANTASMA (GHOSTING)", val: "PUNTOS Y LUCES VERDES", sub: "Aparecen luces duplicadas flotando en el cielo oscuro" },
    { y: 1290, col: "#ef4444", tit: "3. DESTELLO DEL FLASH", val: "FOTO BLANCA CON NEBLINA", sub: "El flash se mete por el borde del vidrio y lava la foto" },
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
    g.font = "800 50px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText(c.val, 140, c.y + 155);
    g.font = "700 26px Figtree";
    g.fillStyle = "#94a3b8";
    g.fillText(c.sub, 140, c.y + 235);
  });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tFantasmas - 0.1, tNeblina + 0.15));
  pildoraEstado(g, 540, 1715, "LA LUZ REBOTA ADENTRO Y CREA FANTASMAS VERDES Y NEBLINA", "245, 158, 11", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "06-sensor-laser.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(7).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tLaser = f7.t("láser");
  const tDoble = f7.t("doble");
  const tEnfocar = f7.t("enfocar");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#1f0910");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tDoble, [1.06, 540, 1120]],
    [tCorte - 0.18, [1.06, 540, 1120]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 110, 620, 860, 430, 34);
  g.fillStyle = "#1a0a12";
  g.fill();
  g.strokeStyle = "#f43f5e";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#fda4af";
  g.fillText("SENSOR LÁSER LiDAR / AUTOFOCO INVISIBLE", 540, 700);
  g.font = "800 64px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("BLOQUEADO POR EL PEGAMENTO", 540, 835);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("El haz infrarrojo rebota contra el borde sucio del protector", 540, 955);

  redondo(g, 110, 1110, 860, 440, 34);
  g.fillStyle = "#091322";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("TIEMPO PARA ENFOCAR TU FOTO", 540, 1200);
  g.font = "800 84px Figtree";
  g.fillStyle = "#ef4444";
  g.fillText("2X MÁS LENTO", 540, 1340);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("La imagen pulsa y sale movida cuando tomas fotos rápidas", 540, 1465);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tDoble - 0.1, tEnfocar + 0.15));
  pildoraEstado(g, 540, 1710, "EL PEGAMENTO TAPA EL LÁSER Y TARDA EL DOBLE EN ENFOCAR", "244, 63, 94", alPil, 31);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "07-nunca-pegues.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCamaraProtector, fondoMesaClara, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(8).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tAnillos = f8.t("anillos");
  const tCamara = f8.t("cámara");

  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tCamara + 0.15, [1.08, 540, 1165]],
    [tCorte - 0.18, [1.08, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCamaraProtector(g, 540, 1135, 480, 840, { protectorPuesto: 1, destellos: 0.9 });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tAnillos - 0.1, tCamara + 0.15));
  pildoraEstado(g, 540, 1715, "NUNCA PEGUES VIDRIOS NI ANILLOS SOBRE TUS LENTES", "239, 68, 68", alPil, 33, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "08-funda-borde.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(9).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f9 = v.frase(9);
  const t0 = f9.inicio - 0.04;
  const tCorte = v.frase(10).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tFunda = f9.t("funda");
  const tMilimetros = f9.t("milímetros");
  const tLuz = f9.t("luz");

  fondoMesaClara(g, tr, "menta");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tMilimetros, [1.05, 540, 1140]],
    [tCorte - 0.18, [1.05, 540, 1140]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
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
  g.fillText("PASO 1 · QUITA LOS VIDRIOS Y LIMPIA EL LENTE", 135, 690);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Cristal de Zafiro Libre", 135, 795);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("✓ Recuperas el 100% de nitidez y enfoque láser al instante", 135, 885);

  redondo(g, 88, 1105, 904, 440, 34);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("PASO 2 · LA PROTECCIÓN QUE SÍ FUNCIONA", 135, 1185);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Funda con Borde Elevado (+2 mm)", 135, 1290);
  g.font = "800 30px Figtree";
  g.fillStyle = "#22e39b";
  g.fillText("🛡️ PROTEGE DE GOLPES SIN TOCAR LA LUZ DE LA CÁMARA", 135, 1390);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tFunda - 0.1, tLuz + 0.2));
  pildoraEstado(g, 540, 1715, "USA UNA FUNDA CON BORDE ELEVADO DE 2 MM SIN TAPAR EL LENTE", "16, 185, 129", alPil, 31, true);
  vineta(g, 0.3);
  capaSuperiorMarca(g, 0.68);
}
`,
    "09-cierre-loop.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCamaraProtector, fondoMosaico, insigniaEpisodio, pildoraEstado, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(10).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f10 = v.frase(10);
  const f11 = v.frase(11);
  const t0 = f10.inicio - 0.04;
  const tFin = v.duracion;
  const tAmigo = f10.t("amigo");
  const tOcho = f11.t("ocho");
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
  dibujarCamaraProtector(g, 540, 1165, 500, 880, { protectorPuesto: 1, destellos: 0.85 });
  g.restore();

  sinVista(g);
  const alShare = entra(tramo(t, t0 + 0.08, t0 + 0.32)) * (1 - suave(tramo(t, f11.inicio - 0.28, f11.inicio - 0.04)));
  pildoraEstado(g, 540, 1710, "ENVÍASELO AL AMIGO QUE LLEVA PROTECTOR EN LA CÁMARA", "56, 189, 248", alShare, 32);

  const alNext = entra(tramo(t, f11.inicio, tOcho + 0.2)) * (1 - uLoop);
  insigniaEpisodio(g, 540, 655, "MAÑANA · MITOS DE TU CELULAR", "EP. 8", "PELIGRO EN PUERTOS USB PÚBLICOS", "#EF4444", alNext, 0.9 + 0.1 * alNext);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}
`,
  };

  for (const [name, code] of Object.entries(planos)) {
    fs.writeFileSync(path.join(dir, "video", "planos", name), code, "utf8");
  }

  const sonidos = `export default function sonidos(v) {
  const e = [];
  const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5),
        f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);

  pon("clic", 0.14, { db: -12, que: "insignia EP. 7" });
  pon("desliza", f1.t("vidrio") + 0.06, { db: -12, que: "encuadre cámara con protector" });
  pon("aviso", f1.t("arruina") + 0.04, { db: -11, que: "destellos verdes" });
  pon("golpe", f1.t("noche") - 0.04, { db: -10.5, corta: f2.inicio - 0.14, que: "fotos de noche arruinadas" });

  pon("cuadro", f2.t("cuidar") + 0.04, { db: -11.5, que: "anillos baratos" });
  pon("aviso", f2.t("sabotean") + 0.04, { db: -10.5, corta: f3.inicio - 0.14, que: "sabotean óptica" });

  pon("desliza", f3.t("original") + 0.04, { db: -11.5, que: "lente original zafiro" });
  pon("cristal", f3.t("zafiro") + 0.04, { db: -11.5, que: "7 capas antirreflejo" });
  pon("timbre", f3.t("reflejos") + 0.04, { db: -11, que: "evitan reflejos" });
  pon("desliza", f4.t("vidrio") + 0.04, { db: -11.5, que: "protector encima" });
  pon("hueco", f4.t("colchón") + 0.04, { db: -11, corta: f5.inicio - 0.14, que: "colchón de aire" });

  pon("cuadro", f5.t("plástico") + 0.04, { db: -12, que: "lentes de plástico rayado" });
  pon("timbre", f5.t("limpiados") - 0.04, { db: -11, corta: f6.inicio - 0.14, que: "anteojos caros" });

  pon("desliza", f6.t("farolas") + 0.04, { db: -12, que: "3 tarjetas rebote de luz" });
  pon("pitido", f6.t("rebota") + 0.04, { db: -12, que: "rebote en hueco" });
  pon("aviso", f6.t("fantasmas") + 0.04, { db: -10.5, corta: f7.inicio - 0.14, que: "fantasmas verdes" });

  pon("aprieta", f7.t("pegamento") + 0.04, { db: -11.5, que: "borde de pegamento" });
  pon("pitido", f7.t("láser") + 0.04, { db: -11.5, que: "sensor láser tapado" });
  pon("golpe", f7.t("enfocar") - 0.04, { db: -10.5, corta: f8.inicio - 0.14, que: "doble en enfocar" });

  pon("aviso", f8.t("nunca") + 0.04, { db: -10.5, corta: f9.inicio - 0.14, que: "nunca pegues vidrios" });

  pon("desliza", f9.t("Quítalos") + 0.04, { db: -11.5, que: "quita vidrios" });
  pon("clic", f9.t("funda") + 0.04, { db: -11, que: "funda con borde elevado" });
  pon("timbre", f9.t("luz") - 0.04, { db: -10.5, corta: f10.inicio - 0.14, que: "sin tocar la luz" });

  pon("sube", f10.t("Envíaselo") + 0.1, { db: -11, que: "compartir con amigo" });
  pon("clic", f10.t("amigo") + 0.1, { db: -12, que: "píldora compartir" });
  pon("golpe", f11.t("ocho") - 0.04, { db: -10, que: "insignia EP. 8 mañana" });
  pon("timbre", f11.t("públicos") - 0.04, { db: -11, corta: v.duracion - 0.2, que: "adelanto USB públicos" });

  return e;
}
`;
  fs.writeFileSync(path.join(dir, "sonidos.js"), sonidos, "utf8");
  console.log("EP. 7 construido.");
}

// ============================================================================
// EP. 8: 2026-11-04-ep8-usb-publico-datos
// ============================================================================
function buildEp8() {
  const dir = path.join(BASE, "2026-11-04-ep8-usb-publico-datos");
  const mundo = COMMON_MUNDO_HEADER + `
export function dibujarCelularUsbPublico(g, cx, cy, w, h, opts = {}) {
  const { robandoDatos = 1, progresoCopia = 0.8 } = opts;
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
  pGrad.addColorStop(0, "#101b30");
  pGrad.addColorStop(1, "#070b14");
  g.fillStyle = pGrad;
  g.fillRect(sx, sy, sw, sh);

  // Tarjeta superior: Cargando en Puerto USB Público
  const cW = sw * 0.86;
  const cH = sh * 0.24;
  const cY = sy + sh * 0.08;
  redondo(g, cx - cW / 2, cY, cW, cH, 24);
  g.fillStyle = "rgba(18, 28, 46, 0.95)";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 3.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = \`800 \${Math.round(sw * 0.05)}px Figtree\`;
  g.fillStyle = "#ffffff";
  g.fillText("⚡ CARGANDO EN USB PÚBLICO", cx, cY + cH * 0.36);
  g.font = \`800 \${Math.round(sw * 0.038)}px Figtree\`;
  g.fillStyle = "#38bdf8";
  g.fillText("Batería: 42% (Corriente +5V activa)", cx, cY + cH * 0.72);

  // Ventana inferior: Los 4 pines del USB y robo por los 2 hilos centrales
  const mW = sw * 0.86;
  const mH = sh * 0.52;
  const mY = sy + sh * 0.38;
  redondo(g, cx - mW / 2, mY, mW, mH, 26);
  g.fillStyle = robandoDatos > 0.5 ? "#22080d" : "#071d18";
  g.fill();
  g.strokeStyle = robandoDatos > 0.5 ? "#ef4444" : "#22e39b";
  g.lineWidth = 3.5;
  g.stroke();

  g.font = \`800 \${Math.round(sw * 0.042)}px Figtree\`;
  g.fillStyle = robandoDatos > 0.5 ? "#fca5a5" : "#6ee7b7";
  g.fillText(robandoDatos > 0.5 ? "⚠ PINES CENTRALES (D+ / D-) ACTIVOS" : "✓ PINES DE DATOS BLOQUEADOS", cx, mY + 54);

  // 4 Hilos verticales del cable USB
  const pines = [
    { dx: -120, col: "#22e39b", lbl: "+5V" },
    { dx: -40, col: robandoDatos > 0.5 ? "#ef4444" : "#475569", lbl: "DATOS-" },
    { dx: 40, col: robandoDatos > 0.5 ? "#ef4444" : "#475569", lbl: "DATOS+" },
    { dx: 120, col: "#22e39b", lbl: "GND" },
  ];
  for (const p of pines) {
    redondo(g, cx + p.dx - 24, mY + 100, 48, 190, 12);
    g.fillStyle = p.col;
    g.fill();
    g.font = \`800 \${Math.round(sw * 0.032)}px Figtree\`;
    g.fillStyle = "#ffffff";
    g.fillText(p.lbl, cx + p.dx, mY + 320);
  }

  g.font = \`800 \${Math.round(sw * 0.04)}px Figtree\`;
  g.fillStyle = "#fde047";
  g.fillText(robandoDatos > 0.5 ? \`COPIANDO FOTOS Y CLAVES (\${Math.round(progresoCopia * 100)}%)\` : "SOLO ENTRA CORRIENTE SEGURA", cx, mY + mH - 38);

  g.restore();
  g.restore();
}
`;
  fs.writeFileSync(path.join(dir, "video", "mundo.js"), mundo, "utf8");

  const planos = {
    "01-gancho-usb.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularUsbPublico, fondoMosaico, insigniaEpisodio, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = 0;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tPublico = f1.t("público");
  const tDatos = f1.t("datos");
  const tOculta = f1.t("oculta");
  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tDatos, [1.1, 540, 1130]],
    [tOculta + 0.2, [1.16, 540, 1185]],
    [tCorte - 0.18, [1.16, 540, 1185]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uCopia = suave(tramo(tr, tPublico, tOculta + 0.2));
  fondoMosaico(g, tr, -tr * 24, tr * 16, "239, 68, 68", 0.32);
  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularUsbPublico(g, 540, 1165, 500, 880, { robandoDatos: 1, progresoCopia: 0.2 + 0.75 * uCopia });
  g.restore();
  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tDatos - 0.35, tDatos + 0.1)));
  insigniaEpisodio(g, 540, 645, "MITOS DE TU CELULAR", "EP. 8", "", "#EF4444", alIns, 0.92 + 0.08 * alIns);
  const alPil = entra(tramo(tr, tDatos - 0.1, tOculta + 0.15));
  pildoraEstado(g, 540, 1710, "UN USB PÚBLICO PUEDE CONECTAR TUS DATOS A UNA PC OCULTA", "239, 68, 68", alPil, 32);
  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}
`,
    "02-enchufe-aeropuerto.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(2).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.inicio - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tAeropuerto = f2.t("aeropuerto");
  const tHueco = f2.t("hueco");
  const tCargar = f2.t("cargar");
  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1080]],
    [tAeropuerto, [1.04, 540, 1120]],
    [tCargar + 0.15, [1.1, 540, 1200]],
    [tCorte - 0.18, [1.1, 540, 1200]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 90, 610, 900, 420, 34);
  g.fillStyle = "#0e1726";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("LO QUE VES POR FUERA EN LA PARED", 540, 685);
  g.font = "800 68px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("CARGA GRATIS EN AEROPUERTO", 540, 810);
  g.font = "700 30px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("Una simple ranura USB lista para tu cable", 540, 930);

  redondo(g, 90, 1080, 900, 490, 34);
  g.fillStyle = "#2a0a0e";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 34px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("LO QUE ES EN REALIDAD", 540, 1175);
  g.font = "800 56px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("UN PUERTO DE DATOS COMPLETO", 540, 1305);
  g.font = "700 32px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("No es solo corriente: tiene acceso directo a tu memoria", 540, 1430);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tHueco - 0.1, tCargar + 0.15));
  pildoraEstado(g, 540, 1715, "PARECE UN SIMPLE ENCHUFE · PERO HACE MUCHO MÁS QUE CARGAR", "239, 68, 68", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "03-cuatro-hilos-usb.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(3).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const t0 = f3.inicio - 0.04;
  const tCorte = v.frase(5).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tOrillas = f3.t("orillas");
  const tElectricidad = f3.t("electricidad");
  const tCentro = f4.t("centro");
  const tAutopista = f4.t("autopista");
  const tCelular = f4.t("celular");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#0c182c");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.06, 360, 1140]],
    [tElectricidad, [1.06, 380, 1140]],
    [tCentro, [1.04, 680, 1130]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Izquierda (F3): 2 hilos de las orillas -> Electricidad (+5V y Tierra)
  redondo(g, 65, 620, 445, 960, 32);
  g.fillStyle = "rgba(8, 30, 24, 0.95)";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("2 HILOS DE LAS ORILLAS", 287, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#d1fae5";
  g.fillText("Pines 1 y 4 (+5V y Tierra)", 287, 735);

  redondo(g, 115, 820, 345, 320, 24);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("SOLO CORRIENTE", 287, 930);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("⚡ CARGAN TU BATERÍA", 287, 1020);

  // Derecha (F4): 2 hilos del centro -> Autopista de datos a tu memoria
  redondo(g, 555, 620, 460, 960, 32);
  g.fillStyle = "rgba(32, 12, 16, 0.95)";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("2 HILOS DEL CENTRO", 785, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#fecdd3";
  g.fillText("Pines 2 y 3 (Datos D+ y D-)", 785, 735);

  redondo(g, 605, 820, 360, 320, 24);
  g.fillStyle = "#450a0a";
  g.fill();
  g.strokeStyle = "#f87171";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 42px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("AUTOPISTA DE DATOS", 785, 930);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("⚠ DIRECTO A TU MEMORIA", 785, 1020);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tOrillas - 0.1, tElectricidad + 0.1)) * (1 - suave(tramo(tr, f4.inicio - 0.25, f4.inicio)));
  pildoraEstado(g, 540, 1710, "TU CABLE USB TIENE 4 HILOS: SOLO 2 LLEVAN ELECTRICIDAD", "34, 227, 155", alP1, 31);
  const alP2 = entra(tramo(tr, tAutopista - 0.1, tCelular + 0.2));
  pildoraEstado(g, 540, 1710, "LOS 2 HILOS DEL CENTRO SON UNA AUTOPISTA DE DATOS A TU MEMORIA", "239, 68, 68", alP2, 30);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "04-manguera-microfono.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(5).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tAgua = f5.t("agua");
  const tMicrofono = f5.t("micrófono");
  const tSala = f5.t("sala");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120c07");
  bg.addColorStop(0.55, "#26180e");
  bg.addColorStop(1, "#120b06");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.04, 540, 1020]],
    [tMicrofono, [1.06, 540, 1180]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 90, 610, 900, 410, 34);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = "#a7f3d0";
  g.fillText("POR FUERA: MANGUERA PARA LLENAR TU TANQUE DE AGUA", 540, 690);
  g.font = "800 50px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("PARECE QUE SOLO ENTRA AGUA LIMPIA", 540, 820);

  redondo(g, 90, 1080, 900, 500, 34);
  g.fillStyle = "#27120b";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("POR DENTRO DE LA MANGUERA: CABLE ESPÍA", 540, 1165);
  g.font = "800 48px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("MICRÓFONO OCULTO DIRECTO A TU SALA", 540, 1300);
  g.font = "800 30px Figtree";
  g.fillStyle = "#f87171";
  g.fillText("✕ Mientras cargas, el otro lado puede leer tu información", 540, 1445);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tMicrofono - 0.1, tSala + 0.15));
  pildoraEstado(g, 540, 1710, "ES COMO UNA MANGUERA DE AGUA CON UN MICRÓFONO ESCONDIDO", "251, 191, 36", alPil, 31);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "05-chip-detras-pared.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(6).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f6 = v.frase(6);
  const t0 = f6.inicio - 0.04;
  const tCorte = v.frase(7).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tChip = f6.t("chip");
  const tPermiso = f6.t("permiso");
  const tDistraido = f6.t("distraído");

  fondoMesaClara(g, tr, "calida");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tPermiso, [1.05, 540, 1150]],
    [tCorte - 0.18, [1.05, 540, 1150]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  const cards = [
    { y: 600, col: "#38bdf8", tit: "1. PUERTO USB ALTERADO", val: "MINI-PC DETRÁS DE LA PARED", sub: "Un microchip oculto se hace pasar por computadora" },
    { y: 945, col: "#f59e0b", tit: "2. PROTOCOLO DE DATOS USB", val: "ENVÍA SOLICITUD DE ACCESO", sub: "Lanza una ventana de «¿Confiar en esta computadora?»" },
    { y: 1290, col: "#ef4444", tit: "3. MIENTRAS ESTÁS DISTRAÍDO", val: "UN TOQUE ABRE TU MEMORIA", sub: "O explota fallas en sistemas sin actualizar" },
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
    g.font = "800 50px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText(c.val, 140, c.y + 155);
    g.font = "700 26px Figtree";
    g.fillStyle = "#94a3b8";
    g.fillText(c.sub, 140, c.y + 235);
  });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tPermiso - 0.1, tDistraido + 0.15));
  pildoraEstado(g, 540, 1715, "UN CHIP OCULTO DETRÁS DE LA PARED PIDE ACCESO A TUS DATOS", "245, 158, 11", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "06-copia-fotos-claves.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(7).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tConfiar = f7.t("Confiar");
  const tFotos = f7.t("fotos");
  const tClaves = f7.t("claves");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#1f0910");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tFotos, [1.06, 540, 1120]],
    [tCorte - 0.18, [1.06, 540, 1120]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 110, 620, 860, 430, 34);
  g.fillStyle = "#1a0a12";
  g.fill();
  g.strokeStyle = "#f43f5e";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#fda4af";
  g.fillText("SI TOCAS «CONFIAR» POR ERROR O TU SISTEMA ES VIEJO", 540, 700);
  g.font = "800 66px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("PUERTA ABIERTA POR CABLE", 540, 835);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("El ataque se llama Juice Jacking (robo por puerto de carga)", 540, 955);

  redondo(g, 110, 1110, 860, 440, 34);
  g.fillStyle = "#091322";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("EN SEGUNDOS Y SIN QUE LO NOTES", 540, 1200);
  g.font = "800 64px Figtree";
  g.fillStyle = "#ef4444";
  g.fillText("COPIA FOTOS Y CLAVES", 540, 1340);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("Extrae galería, respaldos y sesiones guardadas", 540, 1465);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tFotos - 0.1, tClaves + 0.15));
  pildoraEstado(g, 540, 1710, "EN SEGUNDOS PUEDE COPIAR TUS FOTOS Y CLAVES POR EL CABLE", "244, 63, 94", alPil, 31);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}
`,
    "07-nunca-ranura-suelta.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularUsbPublico, fondoMesaClara, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(8).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tAeropuertos = f8.t("aeropuertos");
  const tComerciales = f8.t("comerciales");

  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tComerciales + 0.15, [1.08, 540, 1165]],
    [tCorte - 0.18, [1.08, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularUsbPublico(g, 540, 1135, 480, 840, { robandoDatos: 1, progresoCopia: 0.95 });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tAeropuertos - 0.1, tComerciales + 0.15));
  pildoraEstado(g, 540, 1715, "NUNCA CONECTES TU CABLE DIRECTO A UNA RANURA USB PÚBLICA", "239, 68, 68", alPil, 31, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}
`,
    "08-cubo-o-bloqueador.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(9).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f9 = v.frase(9);
  const t0 = f9.inicio - 0.04;
  const tCorte = v.frase(10).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tCubo = f9.t("cubo");
  const tBloqueador = f9.t("bloqueador");
  const tCentro = f9.t("centro");

  fondoMesaClara(g, tr, "menta");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tBloqueador, [1.05, 540, 1140]],
    [tCorte - 0.18, [1.05, 540, 1140]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
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
  g.fillText("OPCIÓN 1 · ENCHUFE DE PARED NORMAL (AC)", 135, 690);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Usa tu Propio Cubo Cargador", 135, 795);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("✓ Del enchufe de pared normal solo sale electricidad pura", 135, 885);

  redondo(g, 88, 1105, 904, 440, 34);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("OPCIÓN 2 · BLOQUEADOR DE DATOS USB", 135, 1185);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Corta los 2 Pines del Centro", 135, 1290);
  g.font = "800 30px Figtree";
  g.fillStyle = "#22e39b";
  g.fillText("🔒 DEJA PASAR LA CARGA Y BLOQUEA EL 100% DE LOS DATOS", 135, 1390);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tCubo - 0.1, tCentro + 0.2));
  pildoraEstado(g, 540, 1715, "USA TU PROPIO CUBO DE PARED O UN BLOQUEADOR DE DATOS USB", "16, 185, 129", alPil, 31, true);
  vineta(g, 0.3);
  capaSuperiorMarca(g, 0.68);
}
`,
    "09-cierre-loop.js": `import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularUsbPublico, fondoMosaico, insigniaEpisodio, pildoraEstado, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(10).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f10 = v.frase(10);
  const f11 = v.frase(11);
  const t0 = f10.inicio - 0.04;
  const tFin = v.duracion;
  const tAmigo = f10.t("amigo");
  const tSerie = f11.t("serie");
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
  fondoMosaico(g, Math.sin(progPlano * Math.PI) * 2.4, -progPlano * 270, progPlano * 270, "239, 68, 68", 0.32);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularUsbPublico(g, 540, 1165, 500, 880, { robandoDatos: 1, progresoCopia: 0.8 });
  g.restore();

  sinVista(g);
  const alShare = entra(tramo(t, t0 + 0.08, t0 + 0.32)) * (1 - suave(tramo(t, f11.inicio - 0.28, f11.inicio - 0.04)));
  pildoraEstado(g, 540, 1710, "ENVÍASELO AL AMIGO QUE CARGA SU CELULAR EN CUALQUIER USB", "56, 189, 248", alShare, 31);

  const alNext = entra(tramo(t, f11.inicio, tSerie + 0.2)) * (1 - uLoop);
  insigniaEpisodio(g, 540, 655, "SERIE COMPLETA EN EL PERFIL", "EP. 1–8", "MITOS DE TU CELULAR", "#22E39B", alNext, 0.9 + 0.1 * alNext);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}
`,
  };

  for (const [name, code] of Object.entries(planos)) {
    fs.writeFileSync(path.join(dir, "video", "planos", name), code, "utf8");
  }

  const sonidos = `export default function sonidos(v) {
  const e = [];
  const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5),
        f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);

  pon("clic", 0.14, { db: -12, que: "insignia EP. 8" });
  pon("desliza", f1.t("puerto") + 0.06, { db: -12, que: "encuadre celular USB público" });
  pon("aviso", f1.t("datos") + 0.04, { db: -11, que: "pines centrales activos" });
  pon("golpe", f1.t("oculta") - 0.04, { db: -10.5, corta: f2.inicio - 0.14, que: "computadora oculta" });

  pon("cuadro", f2.t("enchufe") + 0.04, { db: -11.5, que: "carga gratis aeropuerto" });
  pon("aviso", f2.t("hueco") + 0.04, { db: -10.5, corta: f3.inicio - 0.14, que: "hace más que cargar" });

  pon("desliza", f3.t("cuatro") + 0.04, { db: -11.5, que: "columna 2 hilos orillas" });
  pon("cristal", f3.t("orillas") + 0.04, { db: -11.5, que: "solo electricidad" });
  pon("timbre", f3.t("electricidad") + 0.04, { db: -11, que: "carga batería" });
  pon("desliza", f4.t("centro") + 0.04, { db: -11.5, que: "columna 2 hilos centro" });
  pon("aviso", f4.t("autopista") + 0.04, { db: -10.5, corta: f5.inicio - 0.14, que: "autopista de datos" });

  pon("cuadro", f5.t("manguera") + 0.04, { db: -12, que: "manguera tanque de agua" });
  pon("pitido", f5.t("micrófono") + 0.04, { db: -11, corta: f6.inicio - 0.14, que: "micrófono oculto" });

  pon("desliza", f6.t("alterado") + 0.04, { db: -12, que: "3 tarjetas chip oculto" });
  pon("pitido", f6.t("chip") + 0.04, { db: -12, que: "chip detrás de la pared" });
  pon("aviso", f6.t("permiso") + 0.04, { db: -10.5, corta: f7.inicio - 0.14, que: "pide permiso" });

  pon("clic", f7.t("Confiar") + 0.04, { db: -11, que: "toca confiar por error" });
  pon("golpe", f7.t("claves") - 0.04, { db: -10.5, corta: f8.inicio - 0.14, que: "copia fotos y claves" });

  pon("aviso", f8.t("nunca") + 0.04, { db: -10.5, corta: f9.inicio - 0.14, que: "nunca conectes directo" });

  pon("desliza", f9.t("cubo") + 0.04, { db: -11.5, que: "usa tu propio cubo" });
  pon("clic", f9.t("bloqueador") + 0.04, { db: -11, que: "bloqueador USB" });
  pon("timbre", f9.t("centro") - 0.04, { db: -10.5, corta: f10.inicio - 0.14, que: "corta pines del centro" });

  pon("sube", f10.t("Envíaselo") + 0.1, { db: -11, que: "compartir con amigo" });
  pon("clic", f10.t("amigo") + 0.1, { db: -12, que: "píldora compartir" });
  pon("golpe", f11.t("Mitos") - 0.04, { db: -10, que: "insignia serie completa" });
  pon("timbre", f11.t("Celular") - 0.04, { db: -11, corta: v.duracion - 0.2, que: "cierre serie" });

  return e;
}
`;
  fs.writeFileSync(path.join(dir, "sonidos.js"), sonidos, "utf8");
  console.log("EP. 8 construido.");
}

buildEp6();
buildEp7();
buildEp8();

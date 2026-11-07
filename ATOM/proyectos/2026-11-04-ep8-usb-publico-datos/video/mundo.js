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
    vg.addColorStop(0, `rgba(5, 8, 16, ${Math.min(0.94, fuerzaVelo * 1.15)})`);
    vg.addColorStop(0.62, `rgba(5, 8, 16, ${fuerzaVelo * 0.74})`);
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
  vg.addColorStop(1, `rgba(0,0,0,${fuerza})`);
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
    lg.addColorStop(0, `rgba(${luzColor}, ${luzAl})`);
    lg.addColorStop(0.55, `rgba(${luzColor}, ${luzAl * 0.35})`);
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
  g.font = `800 ${tam}px Figtree`;
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
  g.strokeStyle = `rgba(${colorRgb}, 0.78)`;
  g.lineWidth = 3.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = `rgba(${colorRgb}, 0.5)`;
  g.shadowBlur = 14;
  g.fillStyle = `rgb(${colorRgb})`;
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
    g.strokeStyle = `rgba(140, 200, 255, ${(1 - presion * 0.5) * 0.78})`;
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
  g.font = `800 ${Math.round(sw * 0.05)}px Figtree`;
  g.fillStyle = "#ffffff";
  g.fillText("⚡ CARGANDO EN USB PÚBLICO", cx, cY + cH * 0.36);
  g.font = `800 ${Math.round(sw * 0.038)}px Figtree`;
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

  g.font = `800 ${Math.round(sw * 0.042)}px Figtree`;
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
    g.font = `800 ${Math.round(sw * 0.032)}px Figtree`;
    g.fillStyle = "#ffffff";
    g.fillText(p.lbl, cx + p.dx, mY + 320);
  }

  g.font = `800 ${Math.round(sw * 0.04)}px Figtree`;
  g.fillStyle = "#fde047";
  g.fillText(robandoDatos > 0.5 ? `COPIANDO FOTOS Y CLAVES (${Math.round(progresoCopia * 100)}%)` : "SOLO ENTRA CORRIENTE SEGURA", cx, mY + mH - 38);

  g.restore();
  g.restore();
}

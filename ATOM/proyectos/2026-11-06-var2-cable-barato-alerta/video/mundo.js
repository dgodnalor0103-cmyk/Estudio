// Mundo compartido para MITOS DE TU CELULAR · EP. 2 (Estilo Sovera · ATOM Élite 60 fps)
// Todo se calcula desde `t` y semillas fijas (`k.azar`), con luz, volumen, cristal, metal y texturas reales.
import * as k from "#kit";

const { azar, lienzo, fijar, redondo, suave, tramo, mez, mezColor } = k;
export { redondo };

// ---------------------------------------------------------------- Cámara 2D logarítmica y frenado C^1 antes de corte
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

// ---------------------------------------------------------------- Fondos (Mosaico Sovera oscuro + Mesas claras de alto contraste)
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

// Mesa de laboratorio clara en y=535..1865 (zona de subtítulos arriba oscura para legibilidad 100 % y contraste fuerte en cortes)
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

  // Tablero luminoso biselado
  redondo(g, 32, 535, 1016, 1335, 44);
  const tg = g.createLinearGradient(0, 535, 0, 1870);
  tg.addColorStop(0, colores.mesaA);
  tg.addColorStop(1, colores.mesaB);
  g.fillStyle = tg;
  g.fill();
  g.strokeStyle = colores.borde;
  g.lineWidth = 4;
  g.stroke();

  // Retícula técnica sutil en movimiento lento
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

// ---------------------------------------------------------------- Insignias y píldoras estilo @sovera.ia
export function insigniaEpisodio(g, x, y, antetitulo, grande, subtitulo = "", colorSub = "#22E39B", al = 1, escala = 1) {
  if (al <= 0.005) return;
  g.save();
  g.translate(x, y);
  g.scale(escala, escala);
  g.globalAlpha *= al;

  const w = subtitulo ? 780 : 720;
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

  g.font = "800 116px Figtree";
  g.fillStyle = "#FFFFFF";
  g.shadowColor = "rgba(47, 124, 246, 0.45)";
  g.shadowBlur = 24;
  g.fillText(grande, 0, y0 + (subtitulo ? 152 : 158));
  g.shadowBlur = 0;

  if (subtitulo) {
    g.font = "800 30px Figtree";
    const sw = g.measureText(subtitulo).width + 54;
    const sh = 50;
    redondo(g, -sw / 2, y0 + h - 72, sw, sh, 16);
    g.fillStyle = colorSub;
    g.fill();
    g.fillStyle = "#06120e";
    g.fillText(subtitulo, 0, y0 + h - 47);
  }
  g.restore();
}

export function pildoraEstado(g, x, y, texto, colorRgb = "34, 227, 155", al = 1, tam = 44, fondoClaro = false) {
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

// ---------------------------------------------------------------- Chispas eléctricas deterministas (sin rocas)
export function dibujarChispas(g, x, y, t, intensidad = 1, semilla = 41, colorRgb = "255, 135, 40") {
  if (intensidad <= 0.01) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  k.brillo(g, x, y, 260 * (0.7 + 0.3 * Math.sin(t * 22)), colorRgb, intensidad * 0.75);

  const paso = Math.floor(t * 18);
  const az = azar(semilla + paso * 17);
  const nRayos = 7;
  for (let i = 0; i < nRayos; i++) {
    const ang = az() * Math.PI * 2;
    const largo = (48 + az() * 115) * intensidad;
    const mx = x + Math.cos(ang + 0.28) * largo * 0.52;
    const my = y + Math.sin(ang + 0.28) * largo * 0.52;
    const fx = x + Math.cos(ang) * largo;
    const fy = y + Math.sin(ang) * largo;

    g.strokeStyle = `rgba(${colorRgb}, ${0.85 * intensidad})`;
    g.lineWidth = 4.5;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(mx, my);
    g.lineTo(fx, fy);
    g.stroke();

    g.strokeStyle = `rgba(255, 250, 220, ${0.9 * intensidad})`;
    g.lineWidth = 2;
    g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- Celular con batería viva + Puerto USB-C + Rayos X del chip de carga
export function dibujarCelularCarga(g, cx, cy, w, h, opts = {}) {
  const {
    pct = 62,
    modoCarga = "rapida", // "rapida" | "frenada" | "peligro" | "falso"
    tempC = 31,
    rayosX = 0,
    calorPuerto = 0,
    t = 0,
    parpadeoCarga = 1,
  } = opts;

  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const r = w * 0.135;

  g.save();
  g.shadowColor = "rgba(0, 0, 0, 0.68)";
  g.shadowBlur = 50;
  g.shadowOffsetY = 24;
  redondo(g, x0, y0, w, h, r);
  g.fillStyle = "#121722";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  // Marco de titanio
  redondo(g, x0, y0, w, h, r);
  k.metal(g, x0, x0 + w, ["#4d5666", "#d5deec", "#697588", "#eef3fa", "#373f4d"]);

  // Bisel interior
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

  // Fondo OLED reactivo
  const pGrad = g.createLinearGradient(sx, sy, sx, sy + sh);
  pGrad.addColorStop(0, modoCarga === "peligro" ? "#260b10" : "#0e1b33");
  pGrad.addColorStop(1, "#060a14");
  g.fillStyle = pGrad;
  g.fillRect(sx, sy, sw, sh);

  // Dynamic Island
  const iw = sw * 0.29;
  const ih = Math.max(14, sh * 0.028);
  redondo(g, cx - iw / 2, sy + sh * 0.022, iw, ih, ih / 2);
  g.fillStyle = "#020306";
  g.fill();

  // Gran medidor de batería en pantalla
  const batW = sw * 0.64;
  const batH = sh * 0.16;
  const batX = cx - batW / 2;
  const batY = sy + sh * 0.16;

  redondo(g, batX + batW, batY + batH * 0.3, 12, batH * 0.4, 5);
  g.fillStyle = "rgba(255,255,255,0.45)";
  g.fill();

  redondo(g, batX, batY, batW, batH, 24);
  g.fillStyle = "rgba(15, 23, 42, 0.88)";
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.34)";
  g.lineWidth = 4;
  g.stroke();

  const colBarra = modoCarga === "peligro"
    ? "#ff4757"
    : modoCarga === "falso"
    ? (parpadeoCarga > 0.5 ? "#fbbf24" : "#334155")
    : modoCarga === "frenada"
    ? "#22e39b"
    : "#38bdf8";

  const fillW = Math.max(14, (batW - 16) * (Math.max(0, Math.min(100, pct)) / 100));
  redondo(g, batX + 8, batY + 8, fillW, batH - 16, 17);
  g.fillStyle = colBarra;
  g.fill();

  // Porcentaje grande y temperatura
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `800 ${Math.round(sw * 0.13)}px Figtree`;
  g.fillStyle = "#ffffff";
  g.fillText(`${Math.round(pct)} %`, cx, batY + batH + sh * 0.09);

  g.font = `700 ${Math.round(sw * 0.048)}px Figtree`;
  g.fillStyle = modoCarga === "peligro" ? "#ff7b89" : modoCarga === "frenada" ? "#6ee7b7" : "#93c5fd";
  const subTxt = modoCarga === "peligro"
    ? `ALERTA TÉRMICA · ${Math.round(tempC)} °C`
    : modoCarga === "falso"
    ? (parpadeoCarga > 0.5 ? "Conectando..." : "Sin carga · falso contacto")
    : modoCarga === "frenada"
    ? `FRENO AUTOMÁTICO · ${Math.round(tempC)} °C`
    : `CARGA RÁPIDA USB-PD · ${Math.round(tempC)} °C`;
  g.fillText(subTxt, cx, batY + batH + sh * 0.165);

  // Ventana Rayos X inferior sobre el puerto USB-C y el chip de carga
  if (rayosX > 0.01) {
    const rxW = sw * 0.86;
    const rxH = sh * 0.34;
    const rxX = cx;
    const rxY = sy + sh * 0.75;

    g.save();
    g.globalAlpha = rayosX;
    redondo(g, rxX - rxW / 2, rxY - rxH / 2, rxW, rxH, 26);
    g.fillStyle = "#070e17";
    g.fill();
    g.clip();

    // Pistas de cobre hacia el puerto inferior
    const colPista = mezColor("#22e39b", "#ff4d2e", calorPuerto);
    g.strokeStyle = colPista;
    g.lineWidth = 4;
    for (let i = -3; i <= 3; i++) {
      g.beginPath();
      g.moveTo(rxX + i * 16, rxY + rxH / 2);
      g.lineTo(rxX + i * 24, rxY + 26);
      g.lineTo(rxX + i * 18, rxY - 22);
      g.stroke();
    }

    // Chip interno de gestión de carga (PMIC / Tristar)
    const cw = rxW * 0.46;
    const ch = rxH * 0.42;
    redondo(g, rxX - cw / 2, rxY - ch / 2 - 18, cw, ch, 14);
    g.fillStyle = calorPuerto > 0.45 ? "#2e0d0d" : "#111c2b";
    g.fill();
    g.strokeStyle = colPista;
    g.lineWidth = 3.5;
    g.stroke();

    // Pines dorados inferiores del puerto USB-C
    for (let p = -5; p <= 5; p++) {
      g.fillStyle = calorPuerto > 0.6 && Math.abs(p) <= 2 ? "#261c1a" : "#facc15";
      g.fillRect(rxX + p * 14 - 4, rxY + rxH / 2 - 22, 8, 18);
    }

    if (calorPuerto > 0.08) {
      k.brillo(g, rxX, rxY - 12, cw * 1.5, "255, 90, 35", calorPuerto * (0.65 + 0.3 * Math.sin(t * 18)));
    } else {
      k.brillo(g, rxX, rxY - 12, cw * 1.1, "34, 227, 155", 0.4);
    }

    g.fillStyle = calorPuerto > 0.45 ? "#ff8a75" : "#6ee7b7";
    g.font = `800 ${Math.round(sw * 0.044)}px Figtree`;
    g.fillText(calorPuerto > 0.45 ? "CHIP RECALENTADO" : "CHIP PROTEGIDO", rxX, rxY - 18);
    g.restore();

    g.save();
    g.globalAlpha = rayosX;
    redondo(g, rxX - rxW / 2, rxY - rxH / 2, rxW, rxH, 26);
    g.strokeStyle = calorPuerto > 0.45 ? "rgba(255, 82, 56, 0.85)" : "rgba(34, 227, 155, 0.78)";
    g.lineWidth = 3.5;
    g.stroke();
    g.restore();
  }

  // Reflejo diagonal de cristal
  g.save();
  g.globalAlpha = 0.08;
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.moveTo(sx + sw * 0.14, sy);
  g.lineTo(sx + sw * 0.5, sy);
  g.lineTo(sx - sw * 0.1, sy + sh);
  g.lineTo(sx - sw * 0.42, sy + sh);
  g.closePath();
  g.fill();
  g.restore();

  g.restore();

  // Ranura física del puerto USB-C en el borde inferior del marco
  const pw = w * 0.18;
  const ph = 14;
  redondo(g, cx - pw / 2, y0 + h - ph - 2, pw, ph, 6);
  g.fillStyle = "#05070c";
  g.fill();
  g.strokeStyle = calorPuerto > 0.4 ? "#ff6348" : "#94a3b8";
  g.lineWidth = 2;
  g.stroke();

  g.restore();

  return {
    puertoX: cx,
    puertoY: y0 + h,
    chipX: cx,
    chipY: sy + sh * 0.72,
  };
}

// ---------------------------------------------------------------- Conector USB-C realista (Original con microchip vs. Barato hueco)
// Apunta hacia ARRIBA (punta metálica en y = 0..56, cabezal en y = 56..196, cable hacia +Y)
export function dibujarConectorUsbC(g, x, yPunta, opts = {}) {
  const {
    tipo = "original", // "original" | "barato"
    escala = 1,
    abierto = 0,       // 0..1 radiografía abriendo la carcasa
    calor = 0,         // 0..1 incandescencia térmica
    doblez = 0,        // ángulo del cordón (-0.45..0.45)
    largoCable = 520,
    t = 0,
  } = opts;

  g.save();
  g.translate(x, yPunta);
  g.scale(escala, escala);

  // 1. Cordón que baja desde el cabezal (con doblez opcional para falso contacto)
  const yCuello = 205;
  const cableW = tipo === "original" ? 36 : 22;
  g.save();
  g.beginPath();
  g.moveTo(0, yCuello);
  const ctrlX = doblez * 180;
  const endX = doblez * 340;
  g.quadraticCurveTo(ctrlX, yCuello + largoCable * 0.45, endX, yCuello + largoCable);
  g.lineCap = "round";
  g.lineWidth = cableW + 6;
  g.strokeStyle = "rgba(0,0,0,0.45)";
  g.stroke();

  g.lineWidth = cableW;
  g.strokeStyle = tipo === "original" ? "#e8eef7" : "#222730";
  g.stroke();

  // Textura trenzada en cable original
  if (tipo === "original") {
    g.lineWidth = cableW - 8;
    g.setLineDash([12, 10]);
    g.strokeStyle = "rgba(180, 198, 224, 0.55)";
    g.stroke();
    g.setLineDash([]);
  }
  g.restore();

  // Cuello protector (strain relief)
  redondo(g, -24, 174, 48, 40, 10);
  g.fillStyle = tipo === "original" ? "#cfd8e6" : "#171b22";
  g.fill();

  // 2. Punta metálica USB-C (lengüeta superior)
  redondo(g, -28, 0, 56, 62, 10);
  if (calor > 0.05) {
    const cMetal = mezColor("#cbd5e1", "#ff5722", calor);
    g.fillStyle = cMetal;
    g.fill();
    k.brillo(g, 0, 26, 170, "255, 95, 30", calor * (0.65 + 0.25 * Math.sin(t * 16)));
  } else {
    k.metal(g, -28, 28, ["#64748b", "#f1f5f9", "#94a3b8", "#ffffff", "#475569"]);
  }

  // 3. Cabezal / carcasa principal
  const wCab = 108;
  const hCab = 132;
  g.shadowColor = "rgba(0,0,0,0.52)";
  g.shadowBlur = 26;
  g.shadowOffsetY = 12;
  redondo(g, -wCab / 2, 52, wCab, hCab, 24);
  if (tipo === "original") {
    const cg = g.createLinearGradient(-wCab / 2, 52, wCab / 2, 52);
    cg.addColorStop(0, "#d8e1ee");
    cg.addColorStop(0.35, "#ffffff");
    cg.addColorStop(0.8, "#e2e8f0");
    cg.addColorStop(1, "#b8c4d6");
    g.fillStyle = cg;
  } else {
    const cg = g.createLinearGradient(-wCab / 2, 52, wCab / 2, 52);
    cg.addColorStop(0, "#1c2026");
    cg.addColorStop(0.4, "#323842");
    cg.addColorStop(1, "#14171c");
    g.fillStyle = cg;
  }
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  g.strokeStyle = tipo === "original" ? "rgba(100,116,139,0.35)" : "rgba(255,255,255,0.14)";
  g.lineWidth = 2.5;
  g.stroke();

  // Símbolo exterior vectorial de rayo antes de abrir (sin emoji Unicode para evitar caja vacía en Figtree)
  if (abierto < 0.85) {
    g.save();
    g.globalAlpha = 1 - abierto;
    g.fillStyle = tipo === "original" ? "#3b82f6" : "#64748b";
    g.beginPath();
    g.moveTo(4, 98);
    g.lineTo(-12, 120);
    g.lineTo(-1, 120);
    g.lineTo(-5, 138);
    g.lineTo(12, 115);
    g.lineTo(1, 115);
    g.closePath();
    g.fill();
    g.restore();
  }

  // 4. Ventana interior en radiografía (`abierto > 0`)
  if (abierto > 0.01) {
    g.save();
    g.globalAlpha = abierto;
    redondo(g, -wCab / 2 + 10, 62, wCab - 20, hCab - 20, 16);
    g.fillStyle = tipo === "original" ? "#071a14" : "#160d0d";
    g.fill();
    g.clip();

    if (tipo === "original") {
      // Placa verde esmeralda + Microchip E-Marker dorado
      g.strokeStyle = "#10b981";
      g.lineWidth = 3;
      for (const px of [-24, -8, 8, 24]) {
        g.beginPath(); g.moveTo(px, 62); g.lineTo(px, 174); g.stroke();
      }
      redondo(g, -28, 92, 56, 52, 9);
      g.fillStyle = "#0f172a";
      g.fill();
      g.strokeStyle = "#fbbf24";
      g.lineWidth = 3;
      g.stroke();

      // Patitas doradas del chip
      g.fillStyle = "#fbbf24";
      for (let p = -2; p <= 2; p++) {
        g.fillRect(-34, 102 + p * 8, 6, 4);
        g.fillRect(28, 102 + p * 8, 6, 4);
      }
      k.brillo(g, 0, 118, 95, "34, 227, 155", 0.55 + 0.25 * Math.sin(t * 8));
      g.fillStyle = "#6ee7b7";
      g.font = "800 16px Figtree";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("CHIP", 0, 118);
    } else {
      // Hueco vacío sin chip + 3 hilitos de cobre sueltos que tiemblan
      g.strokeStyle = "rgba(255, 90, 70, 0.35)";
      g.setLineDash([6, 6]);
      g.lineWidth = 2.5;
      redondo(g, -28, 90, 56, 54, 9);
      g.stroke();
      g.setLineDash([]);

      for (const hx of [-18, 0, 18]) {
        g.strokeStyle = calor > 0.2 ? "#ff6b35" : "#b45309";
        g.lineWidth = 2.2;
        g.beginPath();
        g.moveTo(hx, 62);
        g.quadraticCurveTo(hx + Math.sin(t * 20 + hx) * (3 + calor * 7), 118, hx * 0.5, 174);
        g.stroke();
      }
      g.fillStyle = "#fda4af";
      g.font = "800 15px Figtree";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText("VACÍO", 0, 117);
    }
    g.restore();
  }

  g.restore();
}

// ---------------------------------------------------------------- Dedo humano realista
export function dibujarDedo(g, xPunta, yPunta, ang = -0.38, presion = 0, escala = 1, calorPunta = 0) {
  g.save();
  g.translate(xPunta, yPunta);

  if (presion > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const r = 24 + presion * 54;
    const col = calorPunta > 0.2 ? "255, 110, 50" : "140, 200, 255";
    g.strokeStyle = `rgba(${col}, ${(1 - presion * 0.5) * 0.78})`;
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
  g.shadowOffsetX = -10;
  g.shadowOffsetY = 16;

  g.beginPath();
  g.moveTo(0, -w / 2);
  g.quadraticCurveTo(-w * 0.56, -w / 2, -w * 0.56, 0);
  g.quadraticCurveTo(-w * 0.56, w / 2, 0, w / 2);
  g.lineTo(L, w * 0.58);
  g.lineTo(L, -w * 0.58);
  g.closePath();

  const piel = g.createLinearGradient(0, -w * 0.58, 0, w * 0.58);
  piel.addColorStop(0, calorPunta > 0.3 ? "#ff9f87" : "#f5c6a5");
  piel.addColorStop(0.4, "#eab08a");
  piel.addColorStop(0.8, "#cf8e68");
  piel.addColorStop(1, "#a66846");
  g.fillStyle = piel;
  g.fill();
  g.shadowBlur = 0;

  g.beginPath();
  redondo(g, -w * 0.38, -w * 0.33, w * 0.72, w * 0.66, 24);
  g.fillStyle = "#fbd5bf";
  g.fill();
  g.strokeStyle = "rgba(255, 255, 255, 0.45)";
  g.lineWidth = 2;
  g.stroke();

  g.restore();
}

// Mundo compartido para MITOS DE TU CELULAR · EP. 1 (Estilo Sovera · ATOM Élite 60 fps)
// Todo se calcula desde `t` y semillas fijas (`k.azar`), con luz, sombras, cristal, metal y texturas reales.
import * as k from "#kit";

const { azar, lienzo, fijar, redondo, suave, tramo, mez, mezColor } = k;
export { redondo };

// ---------------------------------------------------------------- Cámara 2D logarítmica y velos
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

// Reloj con frenado C^1 suave antes de un corte: evita que algo quede a medio moverse en la última décima antes de cortar.
export function relojPlano(t, tCorte, reposo = 0.15, freno = 0.24) {
  const b = tCorte - reposo;
  const a = b - freno;
  if (t <= a) return t;
  if (t >= b) return a + 0.5 * freno;
  const u = (t - a) / freno;
  return a + freno * (u - u * u * u + 0.5 * u * u * u * u);
}

// Velo superior para que el subtítulo (y: 318..482) y la marca (y: 205) se lean siempre con contraste perfecto,
// más la firma discreta "p u r a   p r u e b a" al estilo @sovera.ia.
export function capaSuperiorMarca(g, fuerzaVelo = 0.58) {
  g.save();
  sinVista(g);
  if (fuerzaVelo > 0.01) {
    const vg = g.createLinearGradient(0, 0, 0, 620);
    vg.addColorStop(0, `rgba(5, 8, 16, ${Math.min(0.92, fuerzaVelo * 1.15)})`);
    vg.addColorStop(0.62, `rgba(5, 8, 16, ${fuerzaVelo * 0.72})`);
    vg.addColorStop(1, "rgba(5, 8, 16, 0)");
    g.fillStyle = vg;
    g.fillRect(0, 0, 1080, 620);
  }
  // Firma discreta arriba (libre de UI superior y por encima del subtítulo y=318)
  g.font = "700 28px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "rgba(232, 240, 255, 0.62)";
  g.shadowColor = "rgba(0, 0, 0, 0.65)";
  g.shadowBlur = 12;
  g.fillText("p u r a   p r u e b a", 540, 212);
  g.restore();
}

export function vineta(g, fuerza = 0.62) {
  g.save();
  sinVista(g);
  const vg = g.createRadialGradient(540, 980, 420, 540, 980, 1280);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, `rgba(0,0,0,${fuerza})`);
  g.fillStyle = vg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();
}

// ---------------------------------------------------------------- Textura de baldosa/panel oscuro estilo Sovera
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

  // Juntas oscuras con bisel de luz
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

export function fondoMosaico(g, t, desplazaX = 0, desplazaY = 0, luzColor = "55, 130, 255", luzAl = 0.28) {
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
    const ly = 1040 + Math.cos(t * 0.5) * 60;
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

export function fondoAtmosfera(g, t, cArriba = "#090e1a", cAbajo = "#131e33", luzRgb = "47, 124, 246", luzY = 1020, luzAl = 0.32) {
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, cArriba);
  bg.addColorStop(1, cAbajo);
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  g.globalCompositeOperation = "screen";
  g.globalAlpha = 0.09;
  const drift = (t * 14) % 400;
  g.drawImage(k.manchas, -200 - drift * 0.3, -150, 1600, 2300);

  if (luzAl > 0.005) {
    g.globalCompositeOperation = "lighter";
    g.globalAlpha = 1;
    const rg = g.createRadialGradient(540, luzY, 30, 540, luzY, 820);
    rg.addColorStop(0, `rgba(${luzRgb}, ${luzAl})`);
    rg.addColorStop(0.5, `rgba(${luzRgb}, ${luzAl * 0.35})`);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg;
    g.fillRect(0, 0, 1080, 1920);
  }
  g.restore();
}

// ---------------------------------------------------------------- Insignias y píldoras estilo @sovera.ia
export function insigniaEpisodio(g, x, y, antetitulo, grande, subtitulo = "", colorSub = "#22E39B", al = 1, escala = 1) {
  if (al <= 0.005) return;
  g.save();
  g.translate(x, y);
  g.scale(escala, escala);
  g.globalAlpha *= al;

  const w = subtitulo ? 760 : 720;
  const h = subtitulo ? 300 : 250;
  const x0 = -w / 2;
  const y0 = -h / 2;

  // Sombra profunda
  g.shadowColor = "rgba(0, 0, 0, 0.72)";
  g.shadowBlur = 46;
  g.shadowOffsetY = 18;
  redondo(g, x0, y0, w, h, 38);
  const fg = g.createLinearGradient(0, y0, 0, y0 + h);
  fg.addColorStop(0, "rgba(18, 25, 38, 0.94)");
  fg.addColorStop(1, "rgba(9, 13, 22, 0.96)");
  g.fillStyle = fg;
  g.fill();

  g.shadowColor = "rgba(0,0,0,0)";
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

export function pildoraEstado(g, x, y, texto, colorRgb = "34, 227, 155", al = 1, tam = 46) {
  if (al <= 0.005) return;
  g.save();
  g.globalAlpha *= al;
  g.font = `800 ${tam}px Figtree`;
  const w = g.measureText(texto).width + 68;
  const h = tam + 34;
  const x0 = x - w / 2;
  const y0 = y - h / 2;

  g.shadowColor = "rgba(0, 0, 0, 0.6)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 10;
  redondo(g, x0, y0, w, h, 24);
  g.fillStyle = "rgba(10, 15, 24, 0.90)";
  g.fill();

  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  redondo(g, x0 + 1.5, y0 + 1.5, w - 3, h - 3, 22.5);
  g.strokeStyle = `rgba(${colorRgb}, 0.65)`;
  g.lineWidth = 3.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = `rgba(${colorRgb}, 0.55)`;
  g.shadowBlur = 16;
  g.fillStyle = `rgb(${colorRgb})`;
  g.fillText(texto, x, y + 2);
  g.restore();
}

// ---------------------------------------------------------------- Ondas electromagnéticas WiFi e ícono WiFi
export function dibujarIconoWifi(g, x, y, tam, color = "#ffffff", tachado = 0) {
  g.save();
  g.translate(x, y + tam * 0.28);
  g.strokeStyle = color;
  g.fillStyle = color;
  g.lineCap = "round";
  g.lineWidth = Math.max(4, tam * 0.13);

  // Punto inferior
  g.beginPath();
  g.arc(0, 0, tam * 0.1, 0, Math.PI * 2);
  g.fill();

  // 3 arcos concéntricos
  for (const r of [0.32, 0.58, 0.84]) {
    g.beginPath();
    g.arc(0, 0, tam * r, -Math.PI * 0.76, -Math.PI * 0.24);
    g.stroke();
  }

  // Barra diagonal cuando se apaga de verdad desde Ajustes
  if (tachado > 0.01) {
    const ext = tam * 0.95 * Math.min(1, tachado);
    g.strokeStyle = "#0b101b";
    g.lineWidth = Math.max(7, tam * 0.2);
    g.beginPath();
    g.moveTo(-tam * 0.48, -tam * 0.78);
    g.lineTo(-tam * 0.48 + ext * 1.05, -tam * 0.78 + ext * 1.05);
    g.stroke();

    g.strokeStyle = "#ff4757";
    g.lineWidth = Math.max(5, tam * 0.13);
    g.beginPath();
    g.moveTo(-tam * 0.48, -tam * 0.78);
    g.lineTo(-tam * 0.48 + ext * 1.05, -tam * 0.78 + ext * 1.05);
    g.stroke();
  }
  g.restore();
}

export function dibujarOndasWifi(g, x, y, t, colorRgb = "47, 124, 246", fuerza = 1, radioMax = 420, nAnillos = 4, vel = 0.85) {
  if (fuerza <= 0.005) return;
  g.save();
  g.globalCompositeOperation = "lighter";
  for (let i = 0; i < nAnillos; i++) {
    const fase = ((t * vel + i / nAnillos) % 1 + 1) % 1;
    const r = 28 + fase * radioMax;
    const al = fuerza * Math.sin(Math.PI * Math.min(1, fase * 1.15)) * (1 - fase * 0.72);
    if (al <= 0.01) continue;
    g.strokeStyle = `rgba(${colorRgb}, ${al * 0.85})`;
    g.lineWidth = 4 + (1 - fase) * 5;
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.stroke();

    // Halo suave del anillo
    g.strokeStyle = `rgba(${colorRgb}, ${al * 0.26})`;
    g.lineWidth = 18 * (1 - fase * 0.5);
    g.beginPath();
    g.arc(x, y, r, 0, Math.PI * 2);
    g.stroke();
  }
  g.restore();
}

// ---------------------------------------------------------------- El Celular Realista (con Barra Rápida + Rayos X de Antena)
// estadoWifi: "azul" (conectado), "blanco" (engaño de barra rápida: desconectado pero antena viva), "apagado" (tachado real)
export function dibujarCelular(g, cx, cy, w, h, opts = {}) {
  const {
    estadoWifi = "azul",
    transicionBlanco = 0, // 0 = azul, 1 = blanco/gris barra rápida
    rayosX = 0,           // 0..1 ventana rayos X mostrando chip de antena interior
    antenaViva = 1,       // 0..1 pulso del chip interior
    brilloPantalla = 1,   // 0.15 dormido .. 1 encendido
    t = 0,
    modoPantalla = "barra", // "barra" | "dormido" | "ajustes"
    horaTexto = "11:42",
  } = opts;

  const x0 = cx - w / 2;
  const y0 = cy - h / 2;
  const r = w * 0.135;

  g.save();

  // Sombra proyectada del celular
  g.shadowColor = "rgba(0, 0, 0, 0.72)";
  g.shadowBlur = 55;
  g.shadowOffsetY = 26;
  redondo(g, x0, y0, w, h, r);
  g.fillStyle = "#121722";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  // Botones laterales metálicos
  g.fillStyle = "#8a95a5";
  redondo(g, x0 - 6, y0 + h * 0.22, 7, h * 0.07, 3); g.fill();
  redondo(g, x0 - 6, y0 + h * 0.31, 7, h * 0.07, 3); g.fill();
  redondo(g, x0 + w - 1, y0 + h * 0.26, 7, h * 0.1, 3); g.fill();

  // Marco de titanio pulido
  redondo(g, x0, y0, w, h, r);
  k.metal(g, x0, x0 + w, ["#4d5666", "#cfd8e6", "#6a7587", "#e8eef7", "#3a4250"]);

  // Bisel negro interior
  const b = Math.max(8, w * 0.026);
  redondo(g, x0 + b, y0 + b, w - b * 2, h - b * 2, r - b * 0.7);
  g.fillStyle = "#06080d";
  g.fill();

  // Pantalla OLED recortada
  const sx = x0 + b * 1.55;
  const sy = y0 + b * 1.55;
  const sw = w - b * 3.1;
  const sh = h - b * 3.1;
  const sr = Math.max(12, r - b * 1.2);

  g.save();
  redondo(g, sx, sy, sw, sh, sr);
  g.clip();

  // Fondo de pantalla OLED
  const pGrad = g.createLinearGradient(sx, sy, sx + sw, sy + sh);
  const lum = 0.18 + 0.82 * brilloPantalla;
  pGrad.addColorStop(0, `rgb(${Math.round(16 * lum)}, ${Math.round(28 * lum)}, ${Math.round(54 * lum)})`);
  pGrad.addColorStop(0.55, `rgb(${Math.round(11 * lum)}, ${Math.round(20 * lum)}, ${Math.round(40 * lum)})`);
  pGrad.addColorStop(1, `rgb(${Math.round(7 * lum)}, ${Math.round(12 * lum)}, ${Math.round(24 * lum)})`);
  g.fillStyle = pGrad;
  g.fillRect(sx, sy, sw, sh);

  // Resplandor ambiental del wallpaper
  if (brilloPantalla > 0.2) {
    const wg = g.createRadialGradient(cx - sw * 0.15, sy + sh * 0.25, 10, cx, sy + sh * 0.35, sw * 0.85);
    wg.addColorStop(0, `rgba(47, 124, 246, ${0.32 * brilloPantalla})`);
    wg.addColorStop(1, "rgba(0, 0, 0, 0)");
    g.fillStyle = wg;
    g.fillRect(sx, sy, sw, sh);
  }

  // Dynamic Island
  const iw = sw * 0.29;
  const ih = Math.max(14, sh * 0.028);
  redondo(g, cx - iw / 2, sy + sh * 0.02, iw, ih, ih / 2);
  g.fillStyle = "#020306";
  g.fill();

  // Hora pequeña en esquina superior izquierda
  g.fillStyle = `rgba(255,255,255,${0.35 + 0.55 * brilloPantalla})`;
  g.font = `700 ${Math.round(sw * 0.052)}px Figtree`;
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.fillText(horaTexto, sx + sw * 0.07, sy + sh * 0.034);

  if (modoPantalla === "barra") {
    // Tarjeta esmerilada de la Barra Rápida (Centro de Control)
    const px = sx + sw * 0.07;
    const py = sy + sh * 0.1;
    const pw = sw * 0.86;
    const ph = sh * 0.44;
    redondo(g, px, py, pw, ph, sw * 0.07);
    g.fillStyle = "rgba(22, 31, 48, 0.86)";
    g.fill();
    g.strokeStyle = "rgba(255, 255, 255, 0.16)";
    g.lineWidth = 2;
    g.stroke();

    // Cuadrícula de 4 botones redondos (Avión, Datos, WiFi protagonista, Bluetooth)
    const cardX = px + pw * 0.06;
    const cardY = py + ph * 0.09;
    const cardS = pw * 0.88;
    const btnR = cardS * 0.19;

    // El botón protagonista WiFi grande y claro arriba a la derecha o centrado en bloque conectividad
    const posiciones = [
      { bx: cardX + cardS * 0.25, by: cardY + ph * 0.23, tipo: "avion" },
      { bx: cardX + cardS * 0.73, by: cardY + ph * 0.23, tipo: "wifi" },
      { bx: cardX + cardS * 0.25, by: cardY + ph * 0.64, tipo: "datos" },
      { bx: cardX + cardS * 0.73, by: cardY + ph * 0.64, tipo: "bt" },
    ];

    for (const p of posiciones) {
      g.save();
      if (p.tipo === "wifi") {
        // Color interpolado entre azul activo (#2f7cf6) y blanco engañoso (#e4eaf5)
        const colFondo = estadoWifi === "apagado"
          ? "#1b2230"
          : mezColor("#2f7cf6", "#dfe7f4", transicionBlanco);
        const colIcono = estadoWifi === "apagado"
          ? "#6f7b8f"
          : mezColor("#ffffff", "#1e293b", transicionBlanco);

        if (transicionBlanco < 0.8 && estadoWifi !== "apagado") {
          g.shadowColor = "rgba(47, 124, 246, 0.7)";
          g.shadowBlur = 24 * (1 - transicionBlanco);
        }
        g.beginPath();
        g.arc(p.bx, p.by, btnR * 1.14, 0, Math.PI * 2);
        g.fillStyle = colFondo;
        g.fill();
        g.shadowBlur = 0;

        dibujarIconoWifi(g, p.bx, p.by, btnR * 0.85, colIcono, estadoWifi === "apagado" ? 1 : 0);

        // Etiqueta debajo del botón WiFi
        g.font = `800 ${Math.round(sw * 0.042)}px Figtree`;
        g.textAlign = "center";
        g.fillStyle = estadoWifi === "apagado" ? "#ff6b81" : transicionBlanco > 0.5 ? "#ffd166" : "#9ec5ff";
        const txtEstado = estadoWifi === "apagado" ? "Apagado" : transicionBlanco > 0.5 ? "Sin red" : "Conectado";
        g.fillText(txtEstado, p.bx, p.by + btnR * 1.48);
      } else {
        g.beginPath();
        g.arc(p.bx, p.by, btnR * 0.92, 0, Math.PI * 2);
        g.fillStyle = p.tipo === "datos" ? "#20c997" : p.tipo === "bt" && transicionBlanco > 0.5 ? "#dfe7f4" : "rgba(255,255,255,0.12)";
        g.fill();

        // Símbolos simples limpios para Avión, Datos y Bluetooth
        g.strokeStyle = p.tipo === "bt" && transicionBlanco > 0.5 ? "#1e293b" : "#ffffff";
        g.fillStyle = g.strokeStyle;
        g.lineWidth = Math.max(2.5, btnR * 0.1);
        g.lineCap = "round";
        g.lineJoin = "round";
        if (p.tipo === "avion") {
          const s = btnR * 0.36;
          g.beginPath();
          g.moveTo(p.bx - s, p.by + s * 0.3);
          g.lineTo(p.bx + s, p.by - s * 0.3);
          g.moveTo(p.bx - s * 0.1, p.by - s * 0.85);
          g.lineTo(p.bx + s * 0.2, p.by);
          g.lineTo(p.bx - s * 0.1, p.by + s * 0.85);
          g.stroke();
        } else if (p.tipo === "datos") {
          const s = btnR * 0.32;
          g.beginPath();
          g.arc(p.bx, p.by, s * 0.35, 0, Math.PI * 2);
          g.fill();
          g.beginPath();
          g.arc(p.bx, p.by, s * 0.9, -Math.PI * 0.8, -Math.PI * 0.2);
          g.stroke();
        } else if (p.tipo === "bt") {
          const s = btnR * 0.38;
          g.beginPath();
          g.moveTo(p.bx - s * 0.45, p.by - s * 0.55);
          g.lineTo(p.bx + s * 0.45, p.by + s * 0.5);
          g.lineTo(p.bx, p.by + s);
          g.lineTo(p.bx, p.by - s);
          g.lineTo(p.bx + s * 0.45, p.by - s * 0.5);
          g.lineTo(p.bx - s * 0.45, p.by + s * 0.55);
          g.stroke();
        }
      }
      g.restore();
    }

    // Sliders inferiores de brillo y volumen para dar realismo total al Centro de Control
    const sySlider = py + ph + sh * 0.04;
    for (let kIdx = 0; kIdx < 2; kIdx++) {
      const bx = px + kIdx * (pw * 0.54);
      const bw = pw * 0.46;
      const bh = sh * 0.18;
      redondo(g, bx, sySlider, bw, bh, sw * 0.05);
      g.fillStyle = "rgba(22, 31, 48, 0.8)";
      g.fill();
      g.save();
      redondo(g, bx, sySlider, bw, bh, sw * 0.05);
      g.clip();
      const fillH = bh * (kIdx === 0 ? 0.68 : 0.52);
      g.fillStyle = "rgba(255, 255, 255, 0.82)";
      g.fillRect(bx, sySlider + bh - fillH, bw, fillH);
      g.restore();
    }
  } else if (modoPantalla === "dormido") {
    // Pantalla bloqueada nocturna: hora grande tenue y barra WiFi arriba
    g.fillStyle = `rgba(230, 240, 255, ${0.22 + 0.72 * brilloPantalla})`;
    g.font = `800 ${Math.round(sw * 0.2)}px Figtree`;
    g.textAlign = "center";
    g.fillText(horaTexto, cx, sy + sh * 0.25);

    if (brilloPantalla > 0.45) {
      // Notificación de reconexión automática
      const nx = sx + sw * 0.08;
      const ny = sy + sh * 0.42;
      const nw = sw * 0.84;
      const nh = sh * 0.16;
      redondo(g, nx, ny, nw, nh, 20);
      g.fillStyle = "rgba(25, 42, 74, 0.92)";
      g.fill();
      g.strokeStyle = "rgba(47, 124, 246, 0.8)";
      g.lineWidth = 2.5;
      g.stroke();
      dibujarIconoWifi(g, nx + nw * 0.14, ny + nh * 0.5, nh * 0.34, "#4da3ff", 0);
      g.textAlign = "left";
      g.fillStyle = "#ffffff";
      g.font = `800 ${Math.round(sw * 0.05)}px Figtree`;
      g.fillText("WiFi reactivado solo", nx + nw * 0.26, ny + nh * 0.4);
      g.fillStyle = "#9ec5ff";
      g.font = `600 ${Math.round(sw * 0.04)}px Figtree`;
      g.fillText("05:00 AM · Conectado", nx + nw * 0.26, ny + nh * 0.72);
    }
  }

  // Ventana Rayos X mostrando la placa madre y el chip RF de la antena WiFi latiendo por dentro
  if (rayosX > 0.01) {
    const rxX = cx;
    const rxY = sy + sh * 0.74;
    const rxW = sw * 0.82;
    const rxH = sh * 0.24;

    g.save();
    g.globalAlpha = rayosX;
    redondo(g, rxX - rxW / 2, rxY - rxH / 2, rxW, rxH, 24);
    g.fillStyle = "#071019";
    g.fill();
    g.clip();

    // Pistas de cobre en la placa PCB
    g.strokeStyle = "rgba(42, 168, 128, 0.35)";
    g.lineWidth = 3;
    for (let i = -3; i <= 3; i++) {
      g.beginPath();
      g.moveTo(rxX - rxW * 0.48, rxY + i * 18);
      g.lineTo(rxX - 55, rxY + i * 12);
      g.lineTo(rxX + 55, rxY + i * 12);
      g.lineTo(rxX + rxW * 0.48, rxY + i * 18);
      g.stroke();
    }

    // Bobina de cobre de la antena y chip RF central
    const chipW = rxW * 0.38;
    const chipH = rxH * 0.56;
    redondo(g, rxX - chipW / 2, rxY - chipH / 2, chipW, chipH, 12);
    g.fillStyle = "#151e2b";
    g.fill();
    g.strokeStyle = antenaViva > 0.2 ? "#22e39b" : "#4b5563";
    g.lineWidth = 3;
    g.stroke();

    // Pines metálicos alrededor del chip
    g.fillStyle = "#d4af37";
    for (let p = -3; p <= 3; p++) {
      g.fillRect(rxX + p * 18 - 4, rxY - chipH / 2 - 7, 8, 7);
      g.fillRect(rxX + p * 18 - 4, rxY + chipH / 2, 8, 7);
    }

    // Pulso luminoso del chip activo
    const latido = 0.65 + 0.35 * Math.sin(t * 9);
    if (antenaViva > 0.05) {
      k.brillo(g, rxX, rxY, chipW * 1.15, "34, 227, 155", antenaViva * 0.55 * latido);
    }
    g.fillStyle = antenaViva > 0.2 ? "#22e39b" : "#64748b";
    g.font = `800 ${Math.round(sw * 0.043)}px Figtree`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(antenaViva > 0.2 ? "ANTENA ON" : "ANTENA OFF", rxX, rxY);

    g.restore();

    // Borde de cristal de la ventana rayos X
    g.save();
    g.globalAlpha = rayosX;
    redondo(g, rxX - rxW / 2, rxY - rxH / 2, rxW, rxH, 24);
    g.strokeStyle = antenaViva > 0.2 ? "rgba(34, 227, 155, 0.75)" : "rgba(148, 163, 184, 0.5)";
    g.lineWidth = 3.5;
    g.stroke();
    g.restore();
  }

  // Reflejo diagonal realista de cristal sobre la pantalla
  g.save();
  g.globalAlpha = 0.09;
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.moveTo(sx + sw * 0.15, sy);
  g.lineTo(sx + sw * 0.52, sy);
  g.lineTo(sx - sw * 0.1, sy + sh);
  g.lineTo(sx - sw * 0.42, sy + sh);
  g.closePath();
  g.fill();
  g.restore();

  g.restore(); // fin clip pantalla
  g.restore();

  return {
    botonWifiX: sx + sw * 0.07 + sw * 0.86 * (0.06 + 0.88 * 0.73),
    botonWifiY: sy + sh * 0.1 + sh * 0.44 * (0.09 + 0.23),
    antenaX: cx,
    antenaY: sy + sh * 0.74,
  };
}

// ---------------------------------------------------------------- Dedo humano con volumen y uña realista (como @sovera.ia)
export function dibujarDedo(g, xPunta, yPunta, ang = -0.38, presion = 0, escala = 1) {
  g.save();
  g.translate(xPunta, yPunta);

  // Onda de contacto en el cristal al tocar
  if (presion > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const r = 24 + presion * 54;
    g.strokeStyle = `rgba(140, 200, 255, ${(1 - presion * 0.5) * 0.75})`;
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

  // Sombra proyectada del dedo sobre el celular
  g.shadowColor = "rgba(0, 0, 0, 0.52)";
  g.shadowBlur = 30;
  g.shadowOffsetX = -12;
  g.shadowOffsetY = 18;

  // Cuerpo del dedo (punta en (0,0), se extiende hacia +X)
  g.beginPath();
  g.moveTo(0, -w / 2);
  g.quadraticCurveTo(-w * 0.56, -w / 2, -w * 0.56, 0);
  g.quadraticCurveTo(-w * 0.56, w / 2, 0, w / 2);
  g.lineTo(L, w * 0.58);
  g.lineTo(L, -w * 0.58);
  g.closePath();

  const piel = g.createLinearGradient(0, -w * 0.58, 0, w * 0.58);
  piel.addColorStop(0, "#f5c6a5");
  piel.addColorStop(0.35, "#eab08a");
  piel.addColorStop(0.78, "#cf8e68");
  piel.addColorStop(1, "#a66846");
  g.fillStyle = piel;
  g.fill();

  g.shadowBlur = 0;
  g.shadowOffsetX = 0;
  g.shadowOffsetY = 0;

  // Pliegues suaves del nudillo
  g.strokeStyle = "rgba(130, 72, 44, 0.32)";
  g.lineWidth = 3;
  for (const kx of [165, 180]) {
    g.beginPath();
    g.arc(kx, 0, w * 0.36, -0.7, 0.7);
    g.stroke();
  }

  // Uña con brillo y lúnula clara
  g.beginPath();
  redondo(g, -w * 0.38, -w * 0.33, w * 0.72, w * 0.66, 24);
  const una = g.createLinearGradient(-w * 0.38, -w * 0.33, w * 0.34, w * 0.33);
  una.addColorStop(0, "#ffe7d6");
  una.addColorStop(0.6, "#f7cbb2");
  una.addColorStop(1, "#e3a88b");
  g.fillStyle = una;
  g.fill();
  g.strokeStyle = "rgba(255, 255, 255, 0.45)";
  g.lineWidth = 2;
  g.stroke();

  // Lúnula blanca de la uña
  g.beginPath();
  g.arc(w * 0.24, 0, w * 0.2, Math.PI * 0.62, Math.PI * 1.38);
  g.fillStyle = "rgba(255, 245, 238, 0.55)";
  g.fill();

  g.restore();
}

// ---------------------------------------------------------------- Router WiFi doméstico con antenas y LEDs reales
export function dibujarRouter(g, x, y, escala = 1, t = 0, activo = true, colorLed = "34, 227, 155") {
  g.save();
  g.translate(x, y);
  g.scale(escala, escala);

  // Antenas traseras articuladas
  for (const [ax, ang] of [[-110, -0.18], [110, 0.18]]) {
    g.save();
    g.translate(ax, -22);
    g.rotate(ang);
    redondo(g, -9, -155, 18, 160, 8);
    k.metal(g, -9, 9, ["#1e2636", "#4f5d75", "#171e2b"]);
    g.restore();
  }

  // Sombra de apoyo
  g.fillStyle = "rgba(0, 0, 0, 0.45)";
  g.beginPath();
  g.ellipse(0, 42, 175, 22, 0, 0, Math.PI * 2);
  g.fill();

  // Cuerpo del router con bisel metálico oscuro
  redondo(g, -165, -34, 330, 68, 22);
  const rg = g.createLinearGradient(0, -34, 0, 34);
  rg.addColorStop(0, "#2b364a");
  rg.addColorStop(0.45, "#1a2230");
  rg.addColorStop(1, "#0e131c");
  g.fillStyle = rg;
  g.fill();
  g.strokeStyle = "rgba(255, 255, 255, 0.2)";
  g.lineWidth = 2.5;
  g.stroke();

  // Franja frontal con luces LED parpadeando
  redondo(g, -135, -10, 270, 22, 10);
  g.fillStyle = "#080c12";
  g.fill();

  for (let i = 0; i < 4; i++) {
    const lx = -90 + i * 60;
    const parpadeo = activo ? (i < 2 ? 1 : 0.45 + 0.55 * Math.sin(t * (7 + i * 3) + i)) : 0.15;
    if (activo) {
      k.brillo(g, lx, 1, 28, colorLed, 0.55 * parpadeo);
    }
    g.beginPath();
    g.arc(lx, 1, 5.5, 0, Math.PI * 2);
    g.fillStyle = activo ? `rgba(${colorLed}, ${0.4 + 0.6 * parpadeo})` : "#334155";
    g.fill();
  }

  g.restore();
}

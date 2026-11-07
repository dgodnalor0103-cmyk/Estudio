// Mundo compartido y sistema de diseño exacto de @speedy_devv (getkeyframes.com)
// Resolución: 1080 x 1920 @ 60 fps
import * as k from "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/motor/kit/index.js";

export { k };
export const {
  ANCHO, ALTO, azar, lienzo, fijar, redondo,
  tramo, suave, entra, sale, mez, mezColor, mezRgb, pulso, de, claves
} = k;

export const PALETA = {
  fondo0: "#07090F",
  fondo1: "#0D121C",
  fondo2: "#131B2A",
  azul: "#2F7CF6",
  azulRgb: "47,124,246",
  ambar: "#F5B83D",
  ambarClaro: "#FFD66B",
  ambarRgb: "245,184,61",
  cian: "#38BDF8",
  cianRgb: "56,189,248",
  verde: "#22E39B",
  verdeRgb: "34,227,155",
  rojo: "#FF4D4D",
  rojoRgb: "255,77,77",
  texto: "#FFFFFF",
  gris: "#8A93A2",
  grisOscuro: "#3A4252",
  mono: "JetBrains Mono",
  sans: "Figtree",
};

// Rejilla de ingeniería + trazas sutiles pre-renderizadas para máximo rendimiento a 60 fps
const FONDO_BASE = (() => {
  const c = lienzo(1080, 1920);
  const g = c.getContext("2d");

  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, PALETA.fondo0);
  bg.addColorStop(0.5, PALETA.fondo1);
  bg.addColorStop(1, "#06080D");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  // Luz ambiental suave en el centro
  const rad = g.createRadialGradient(540, 980, 40, 540, 980, 880);
  rad.addColorStop(0, "rgba(47, 124, 246, 0.08)");
  rad.addColorStop(0.55, "rgba(245, 184, 61, 0.03)");
  rad.addColorStop(1, "rgba(0, 0, 0, 0)");
  g.fillStyle = rad;
  g.fillRect(0, 0, 1080, 1920);

  // Rejilla técnica secundaria (48 px)
  g.strokeStyle = "rgba(255, 255, 255, 0.028)";
  g.lineWidth = 1;
  for (let x = 24; x < 1080; x += 48) {
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke();
  }
  for (let y = 24; y < 1920; y += 48) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke();
  }

  // Rejilla principal (240 px)
  g.strokeStyle = "rgba(255, 255, 255, 0.055)";
  g.lineWidth = 1.5;
  for (let x = 60; x < 1080; x += 240) {
    g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1920); g.stroke();
  }
  for (let y = 120; y < 1920; y += 240) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke();
  }

  return fijar(c);
})();

// Partículas/electrones de circuito que suben por las líneas verticales (como en el Reel de 18.2M)
const ELECTRONES = (() => {
  const rnd = azar(771);
  const lista = [];
  for (let i = 0; i < 26; i++) {
    const col = Math.floor(rnd() * 21);
    lista.push({
      x: 24 + col * 48,
      y0: rnd() * 1920,
      vel: 55 + rnd() * 85,
      tam: 2.2 + rnd() * 2.2,
      al: 0.22 + rnd() * 0.45,
    });
  }
  return lista;
})();

export function fondoSpeedy(g, t, { luzColor = PALETA.ambarRgb, luzY = 1040, luzFuerza = 0.16 } = {}) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(FONDO_BASE, 0, 0);

  if (luzFuerza > 0.005) {
    const lg = g.createRadialGradient(540, luzY, 20, 540, luzY, 680);
    lg.addColorStop(0, `rgba(${luzColor}, ${luzFuerza})`);
    lg.addColorStop(0.5, `rgba(${luzColor}, ${luzFuerza * 0.35})`);
    lg.addColorStop(1, `rgba(${luzColor}, 0)`);
    g.globalCompositeOperation = "lighter";
    g.fillStyle = lg;
    g.fillRect(0, luzY - 680, 1080, 1360);
    g.globalCompositeOperation = "source-over";
  }

  // Electrones subiendo con estela corta
  for (const e of ELECTRONES) {
    const y = ((e.y0 - t * e.vel) % 1920 + 1920) % 1920;
    const est = g.createLinearGradient(e.x, y, e.x, y + 34);
    est.addColorStop(0, `rgba(255,255,255,${e.al})`);
    est.addColorStop(1, "rgba(255,255,255,0)");
    g.strokeStyle = est;
    g.lineWidth = 1.6;
    g.beginPath(); g.moveTo(e.x, y); g.lineTo(e.x, y + 34); g.stroke();

    g.fillStyle = `rgba(255,255,255,${Math.min(1, e.al * 1.5)})`;
    g.beginPath(); g.arc(e.x, y, e.tam, 0, Math.PI * 2); g.fill();
  }
  g.restore();
}

// Velo superior para proteger subtítulos (y: 318..482) + viñeta cinematográfica
export function acabadoSpeedy(g, { notaIzq = "Magnified illustration", notaDer = "" } = {}) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);

  // Velo superior oscuro para contraste de subtítulos Figtree y caja azul #2f7cf6
  const vs = g.createLinearGradient(0, 0, 0, 530);
  vs.addColorStop(0, "rgba(5, 7, 12, 0.88)");
  vs.addColorStop(0.65, "rgba(5, 7, 12, 0.48)");
  vs.addColorStop(1, "rgba(5, 7, 12, 0)");
  g.fillStyle = vs;
  g.fillRect(0, 0, 1080, 530);

  // Viñeta perimetral suave
  const vn = g.createRadialGradient(540, 960, 480, 540, 960, 1240);
  vn.addColorStop(0, "rgba(0,0,0,0)");
  vn.addColorStop(1, "rgba(0,0,0,0.55)");
  g.fillStyle = vn;
  g.fillRect(0, 0, 1080, 1920);

  // Notas técnicas al pie estilo @speedy_devv
  if (notaIzq) {
    g.font = `500 22px "${PALETA.sans}"`;
    g.fillStyle = "rgba(255, 255, 255, 0.46)";
    g.textAlign = "left";
    g.textBaseline = "alphabetic";
    g.fillText(notaIzq, 54, 1848);
  }
  if (notaDer) {
    g.font = `500 21px "${PALETA.sans}"`;
    g.fillStyle = "rgba(255, 255, 255, 0.46)";
    g.textAlign = "right";
    g.textBaseline = "alphabetic";
    const lineas = notaDer.split("\n");
    lineas.forEach((l, idx) => {
      g.fillText(l, 1026, 1848 - (lineas.length - 1 - idx) * 26);
    });
  }
  g.restore();
}

// Puntero ortogonal blanco con punto final (•─── Etiqueta), firma visual de @speedy_devv
export function punteroSpeedy(g, xPunto, yPunto, xCodo, yTexto, titulo, subtitulo = "", prog = 1, _alinear = "auto", colorPunto = "#FFFFFF") {
  if (prog <= 0.01) return;
  const u = suave(Math.min(1, prog));
  g.save();
  g.globalAlpha *= u;

  // Punto en el objetivo
  g.fillStyle = colorPunto;
  g.shadowColor = colorPunto;
  g.shadowBlur = 12;
  g.beginPath();
  g.arc(xPunto, yPunto, 5.5, 0, Math.PI * 2);
  g.fill();
  g.shadowBlur = 0;

  // Línea ortogonal: (xPunto, yPunto) -> (xPunto, yTexto) -> (xCodo, yTexto)
  g.strokeStyle = "rgba(255, 255, 255, 0.85)";
  g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(xPunto, yPunto);
  const yInter = mez(yPunto, yTexto, Math.min(1, u * 1.4));
  g.lineTo(xPunto, yInter);
  if (u > 0.35) {
    const u2 = (u - 0.35) / 0.65;
    g.lineTo(mez(xPunto, xCodo, u2), yTexto);
  }
  g.stroke();

  // El texto siempre sale hacia afuera del codo para nunca pisar la línea
  const haciaDerecha = xCodo >= xPunto;
  const alinear = haciaDerecha ? "left" : "right";
  const tx = haciaDerecha ? xCodo + 14 : xCodo - 14;
  g.textAlign = alinear;
  g.textBaseline = "middle";
  g.font = `700 30px "${PALETA.sans}"`;
  g.fillStyle = "#FFFFFF";
  g.fillText(titulo, tx, yTexto);

  if (subtitulo) {
    const lineas = subtitulo.split("\n");
    g.font = `500 22px "${PALETA.sans}"`;
    g.fillStyle = "rgba(255, 255, 255, 0.62)";
    lineas.forEach((lin, i) => {
      g.fillText(lin, tx, yTexto + 32 + i * 26);
    });
  }
  g.restore();
}

// Avatar ilustrado 2.5D de @speedy_devv (camiseta roja, gafas deportivas tornasoladas verde-cian-naranja, cabello castaño)
export function dibujarAvatarSpeedy(g, cx, cy, escala = 1, t = 0, { miraArriba = 0.3, habla = 0, mano = 0 } = {}) {
  g.save();
  g.translate(cx, cy);
  g.scale(escala, escala);

  const respira = Math.sin(t * 2.6) * 3;
  g.translate(0, respira);

  // Sombra detrás del personaje
  const sg = g.createRadialGradient(0, -140, 20, 0, -140, 280);
  sg.addColorStop(0, "rgba(0,0,0,0.55)");
  sg.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = sg;
  g.beginPath(); g.arc(0, -140, 280, 0, Math.PI * 2); g.fill();

  // Torso / Camiseta roja (#C8232C)
  const tg = g.createLinearGradient(-150, -110, 150, 120);
  tg.addColorStop(0, "#E02E38");
  tg.addColorStop(0.5, "#C11F28");
  tg.addColorStop(1, "#7E1218");
  g.fillStyle = tg;
  g.beginPath();
  g.moveTo(-165, 140);
  g.quadraticCurveTo(-152, -45, -95, -75);
  g.lineTo(95, -75);
  g.quadraticCurveTo(152, -45, 165, 140);
  g.closePath();
  g.fill();

  // Pliegues sutiles de la camiseta
  g.strokeStyle = "rgba(70, 5, 10, 0.38)";
  g.lineWidth = 4;
  g.beginPath(); g.moveTo(-92, -20); g.quadraticCurveTo(-78, 55, -88, 130); g.stroke();
  g.beginPath(); g.moveTo(92, -20); g.quadraticCurveTo(78, 55, 88, 130); g.stroke();

  // Cuello de piel continuo (desde dentro de la cabeza hasta el cuello de la camiseta)
  const ng = g.createLinearGradient(-35, -175, 35, -60);
  ng.addColorStop(0, "#B98A70");
  ng.addColorStop(0.45, "#D9AE94");
  ng.addColorStop(1, "#C5977D");
  g.fillStyle = ng;
  redondo(g, -35, -175, 70, 115, 20);
  g.fill();

  // Sombra suave justo debajo de la barbilla
  g.fillStyle = "rgba(85, 52, 38, 0.35)";
  g.beginPath();
  g.ellipse(0, -124 - miraArriba * 6, 35, 14, 0, 0, Math.PI * 2);
  g.fill();

  // Cuello de la camiseta roja (crew-neck)
  g.strokeStyle = "#9A161E";
  g.lineWidth = 14;
  g.beginPath();
  g.arc(0, -90, 48, 0.18 * Math.PI, 0.82 * Math.PI);
  g.stroke();

  // Mano / brazo señalando (si mano > 0)
  if (mano > 0.01) {
    const uM = suave(Math.min(1, mano));
    g.save();
    g.translate(135, 20 - uM * 55);
    g.rotate(-0.25 * uM);
    const bg = g.createLinearGradient(-20, -80, 40, 40);
    bg.addColorStop(0, "#E5BBA1");
    bg.addColorStop(1, "#BD8E74");
    g.fillStyle = bg;
    redondo(g, -22, -40, 44, 110, 20);
    g.fill();
    g.beginPath();
    g.moveTo(-20, -32);
    g.quadraticCurveTo(-36, -68, -12, -74);
    g.quadraticCurveTo(18, -86, 48, -68);
    g.quadraticCurveTo(60, -56, 32, -38);
    g.closePath();
    g.fill();
    g.restore();
  }

  // Cabeza (se inclina hacia arriba según miraArriba)
  g.save();
  const dyCabeza = -202 - miraArriba * 10;
  g.translate(0, dyCabeza);

  // Orejas
  g.fillStyle = "#C99B82";
  g.beginPath(); g.ellipse(-76, 8, 14, 26, -0.15, 0, Math.PI * 2); g.fill();
  g.beginPath(); g.ellipse(76, 8, 14, 26, 0.15, 0, Math.PI * 2); g.fill();

  // Rostro
  const fg = g.createRadialGradient(-16, -24, 10, 0, 0, 95);
  fg.addColorStop(0, "#F1C9B0");
  fg.addColorStop(0.65, "#DFB297");
  fg.addColorStop(1, "#BA8B70");
  g.fillStyle = fg;
  g.beginPath();
  g.moveTo(-72, -38);
  g.quadraticCurveTo(-76, 42, -42, 74);
  g.quadraticCurveTo(0, 98, 42, 74);
  g.quadraticCurveTo(76, 42, 72, -38);
  g.quadraticCurveTo(70, -92, 0, -92);
  g.quadraticCurveTo(-70, -92, -72, -38);
  g.closePath();
  g.fill();

  // Sombra de barba/mandíbula muy sutil (como en 09_reel_10M_keyboard_f2.png)
  const bg = g.createLinearGradient(0, 20, 0, 88);
  bg.addColorStop(0, "rgba(110, 85, 72, 0)");
  bg.addColorStop(1, "rgba(95, 72, 60, 0.25)");
  g.fillStyle = bg;
  g.beginPath();
  g.arc(0, 12, 70, 0.12 * Math.PI, 0.88 * Math.PI);
  g.fill();

  // Nariz (más alta cuando mira hacia arriba)
  const ny = 10 - miraArriba * 10;
  g.fillStyle = "rgba(155, 105, 82, 0.45)";
  g.beginPath();
  g.moveTo(0, ny - 18);
  g.lineTo(-11, ny + 8);
  g.quadraticCurveTo(0, ny + 14, 11, ny + 8);
  g.closePath();
  g.fill();
  if (miraArriba > 0.15) {
    g.fillStyle = "rgba(90, 55, 42, 0.55)";
    g.beginPath(); g.ellipse(-6, ny + 8, 3.5, 2.2, 0.2, 0, Math.PI * 2); g.fill();
    g.beginPath(); g.ellipse(6, ny + 8, 3.5, 2.2, -0.2, 0, Math.PI * 2); g.fill();
  }

  // Boca expresiva y limpia
  const by = 46 - miraArriba * 6;
  const abreBoca = habla * (0.25 + 0.55 * Math.abs(Math.sin(t * 14)));
  g.strokeStyle = "#8C5240";
  g.lineWidth = 3.8;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(-21, by - 1);
  g.quadraticCurveTo(0, by + 7 + abreBoca * 6, 21, by - 1);
  g.stroke();

  // GAFAS DEPORTIVAS TORNASOLADAS (firma icónica de @speedy_devv)
  const gy = -14 - miraArriba * 9;
  g.save();
  g.translate(0, gy);

  // Sombra de las gafas sobre la cara
  g.fillStyle = "rgba(60, 35, 25, 0.32)";
  redondo(g, -74, -18, 148, 50, 16);
  g.fill();

  // Montura negra deportiva envolvente
  g.fillStyle = "#181C24";
  g.beginPath();
  g.moveTo(-76, -22);
  g.lineTo(76, -22);
  g.quadraticCurveTo(82, 0, 70, 22);
  g.lineTo(14, 24);
  g.quadraticCurveTo(0, 8, -14, 24);
  g.lineTo(-70, 22);
  g.quadraticCurveTo(-82, 0, -76, -22);
  g.closePath();
  g.fill();

  // Lente continuo tornasolado (verde esmeralda -> cian -> azul -> naranja)
  g.save();
  g.beginPath();
  g.moveTo(-70, -17);
  g.lineTo(70, -17);
  g.quadraticCurveTo(75, 0, 65, 18);
  g.lineTo(13, 19);
  g.quadraticCurveTo(0, 3, -13, 19);
  g.lineTo(-65, 18);
  g.quadraticCurveTo(-75, 0, -70, -17);
  g.closePath();
  g.clip();

  const lg = g.createLinearGradient(-72, -18, 72, 20);
  lg.addColorStop(0, "#FF8A33");
  lg.addColorStop(0.22, "#22E39B");
  lg.addColorStop(0.55, "#19B5FE");
  lg.addColorStop(0.82, "#22E39B");
  lg.addColorStop(1, "#FF7B29");
  g.fillStyle = lg;
  g.fillRect(-76, -22, 152, 46);

  // Reflejo diagonal blanco brillante en el lente
  g.fillStyle = "rgba(255, 255, 255, 0.38)";
  g.beginPath();
  g.moveTo(-48, -20); g.lineTo(-22, -20); g.lineTo(-42, 22); g.lineTo(-68, 22);
  g.closePath(); g.fill();

  g.fillStyle = "rgba(255, 255, 255, 0.25)";
  g.beginPath();
  g.moveTo(22, -20); g.lineTo(42, -20); g.lineTo(22, 22); g.lineTo(2, 22);
  g.closePath(); g.fill();
  g.restore();
  g.restore();

  // Cabello castaño con volumen peinado hacia arriba/derecha
  const cg = g.createLinearGradient(-75, -125, 75, -40);
  cg.addColorStop(0, "#593A2B");
  cg.addColorStop(0.5, "#7B533E");
  cg.addColorStop(1, "#4A2F22");
  g.fillStyle = cg;
  g.beginPath();
  g.moveTo(-74, -26);
  g.quadraticCurveTo(-82, -78, -52, -104);
  g.quadraticCurveTo(-18, -132, 34, -122);
  g.quadraticCurveTo(78, -126, 86, -96);
  g.quadraticCurveTo(68, -82, 74, -58);
  g.quadraticCurveTo(78, -38, 72, -24);
  g.quadraticCurveTo(62, -62, 32, -68);
  g.quadraticCurveTo(-15, -74, -58, -58);
  g.quadraticCurveTo(-68, -44, -74, -26);
  g.closePath();
  g.fill();

  // Mechones iluminados del cabello
  g.strokeStyle = "rgba(168, 123, 98, 0.55)";
  g.lineWidth = 4;
  g.beginPath(); g.moveTo(-38, -86); g.quadraticCurveTo(4, -110, 52, -96); g.stroke();
  g.beginPath(); g.moveTo(-18, -74); g.quadraticCurveTo(22, -92, 64, -80); g.stroke();

  g.restore(); // fin cabeza
  g.restore(); // fin avatar
}

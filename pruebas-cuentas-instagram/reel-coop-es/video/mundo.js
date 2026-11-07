// Mundo compartido para la réplica exacta en español de https://www.instagram.com/p/DfHpex7MbM2/ (@speedy_devv)
// Resolución: 1080 x 1920 @ 60 fps
import { loadImage } from "../../../ATOM/node_modules/@napi-rs/canvas/index.js";
import * as k from "../../../ATOM/motor/kit/index.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { workerData } from "node:worker_threads";

export { k };
export const {
  ANCHO, ALTO, azar, lienzo, fijar, redondo,
  tramo, suave, entra, sale, mez, mezColor, mezRgb, pulso, de, claves
} = k;

const FRAMES_DIR = fileURLToPath(new URL("../assets/frames_all", import.meta.url));

export const PALETA = {
  sans: "Figtree",
  mono: "JetBrains Mono",
  azul: "#2F7CF6",
  ambar: "#F5B83D",
  rojo: "#EF4444",
};

export const TRAMOS_PLANO_1 = [
  [0.00, 1.05, 1, 28],
  [1.05, 2.35, 29, 55],
  [2.35, 3.72, 56, 92],
  [3.72, 6.00, 95, 177],
  [6.00, 6.55, 181, 210],
  [6.55, 8.10, 213, 270],
];

export const TRAMOS_PLANO_2 = [
  [8.04, 9.32, 275, 322],
  [9.32, 10.62, 325, 366],
  [10.62, 11.35, 370, 456],
  [11.35, 12.50, 460, 532],
];

export const TRAMOS_PLANO_3 = [
  [12.44, 14.15, 536, 600],
  [14.15, 16.38, 604, 668],
  [16.38, 18.52, 715, 802],
  [18.52, 20.85, 806, 926],
  [20.85, 22.10, 974, 1021],
];

const TODOS_LOS_TRAMOS = [...TRAMOS_PLANO_1, ...TRAMOS_PLANO_2, ...TRAMOS_PLANO_3];

// Precarga inteligente con loadImage() (espera a image.decode() en @napi-rs/canvas):
// - En el proceso padre de render.mjs solo carga el frame 1 (instantáneo).
// - En cada hilo de render.mjs carga únicamente el sub-rango de fotogramas de ese hilo (~110 frames).
// - En ver.mjs / revisar.mjs carga los fotogramas de los tramos activos.
const CACHE = new Map();
{
  const esPadreRender = !workerData && process.argv[1] && process.argv[1].endsWith("render.mjs");
  const tMin = workerData ? Math.max(0, (workerData.primero - 3) / workerData.fps) : 0;
  const tMax = workerData ? (workerData.ultimo + 3) / workerData.fps : 25;

  const necesarios = new Set([1]);
  if (!esPadreRender) {
    for (const [t0, t1, f0, f1] of TODOS_LOS_TRAMOS) {
      if (t1 < tMin || t0 > tMax) continue;
      const uA = Math.max(0, Math.min(1, (Math.max(t0, tMin) - t0) / Math.max(0.001, t1 - t0)));
      const uB = Math.max(0, Math.min(1, (Math.min(t1, tMax) - t0) / Math.max(0.001, t1 - t0)));
      const fA = Math.max(1, Math.floor(f0 + uA * (f1 - f0)) - 2);
      const fB = Math.min(1021, Math.ceil(f0 + uB * (f1 - f0)) + 2);
      for (let f = fA; f <= fB; f++) necesarios.add(f);
    }
  }

  const lista = [...necesarios].sort((a, b) => a - b);
  const LOTE = 64;
  for (let i = 0; i < lista.length; i += LOTE) {
    const trozo = lista.slice(i, i + LOTE);
    await Promise.all(
      trozo.map(async (n) => {
        const fn = `f_${String(n).padStart(4, "0")}.jpg`;
        const im = await loadImage(readFileSync(join(FRAMES_DIR, fn)));
        CACHE.set(n, im);
      })
    );
  }
}

export function cargarFrame(num) {
  const n = Math.max(1, Math.min(1021, Math.round(num)));
  if (CACHE.has(n)) return CACHE.get(n);
  // Si por redondeo pide un fotograma adyacente, devolver el más cercano en caché
  for (let d = 1; d <= 10; d++) {
    if (CACHE.has(n - d)) return CACHE.get(n - d);
    if (CACHE.has(n + d)) return CACHE.get(n + d);
  }
  return CACHE.get(1);
}

// Placa limpia superior extraída del fotograma 1 (t = 0.00s, donde aún no hay ningún subtítulo en y = 0..540)
const PLACA_SUPERIOR = (() => {
  const f1 = cargarFrame(1);
  const c = lienzo(1080, 520);
  const g = c.getContext("2d");
  g.drawImage(f1, 0, 0, 1080, 520, 0, 0, 1080, 520);
  return fijar(c);
})();

// Mapear un tramo de tiempo en español [t0, t1] a un rango de fotogramas originales [f0, f1]
export function mapearTramo(t, tramos) {
  for (let i = 0; i < tramos.length; i++) {
    const [t0, t1, f0, f1] = tramos[i];
    if (t <= t1 || i === tramos.length - 1) {
      const u = Math.max(0, Math.min(1, (t - t0) / Math.max(0.001, t1 - t0)));
      return f0 + u * (f1 - f0);
    }
  }
  return 1;
}

// Dibuja el fotograma original fExact (con interpolación suave entre fotogramas de la misma escena)
// y limpia la franja superior de subtítulos en inglés (y = 0..500) dejando intacta la rejilla original.
export function dibujarBaseOriginal(g, fExact) {
  const f0 = Math.floor(fExact);
  const f1 = Math.min(1021, f0 + 1);
  const frac = fExact - f0;

  const im0 = cargarFrame(f0);
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(im0, 0, 0);

  if (frac > 0.02 && f1 !== f0) {
    const im1 = cargarFrame(f1);
    g.globalAlpha = frac;
    g.drawImage(im1, 0, 0);
    g.globalAlpha = 1;
  }

  // Cubrir la zona de subtítulos originales (y = 0..492) con la placa limpia exacta del frame 1
  g.drawImage(PLACA_SUPERIOR, 0, 0, 1080, 488, 0, 0, 1080, 488);

  // Velo sutil de transición en y = 470..515 para fundir sin costura
  const grad = g.createLinearGradient(0, 465, 0, 515);
  grad.addColorStop(0, "rgba(7, 9, 14, 0.95)");
  grad.addColorStop(0.6, "rgba(7, 9, 14, 0.45)");
  grad.addColorStop(1, "rgba(7, 9, 14, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 465, 1080, 50);

  g.restore();
}

// Dibuja la insignia superior del Gancho en español ([P1] UN JUGADOR -> [P1] [P2] 2 JUGADORES · CO-OP)
export function dibujarInsigniaGancho(g, fExact) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);

  // Limpiar el área exacta de la insignia original (x = 120..960, y = 548..668) usando la rejilla limpia de PLACA_SUPERIOR
  g.drawImage(PLACA_SUPERIOR, 120, 120, 840, 124, 120, 546, 840, 124);

  // Resplandor ambiental detrás de la insignia acorde a la fase
  const esCoop = fExact >= 55;
  const uCoop = tramo(fExact, 55, 65);
  const rad = g.createRadialGradient(540, 620, 10, 540, 620, 320);
  if (!esCoop) {
    rad.addColorStop(0, "rgba(47, 124, 246, 0.14)");
    rad.addColorStop(1, "rgba(47, 124, 246, 0)");
  } else {
    rad.addColorStop(0, "rgba(245, 184, 61, 0.18)");
    rad.addColorStop(1, "rgba(245, 184, 61, 0)");
  }
  g.fillStyle = rad;
  g.fillRect(140, 546, 800, 126);

  if (!esCoop) {
    // Fase 1: [P1] UN JUGADOR + tachado rojo progresivo sobre "UN" durante la desintegración de partículas
    const uStrike = tramo(fExact, 31, 45);
    const uFade = tramo(fExact, 49, 55);
    g.globalAlpha = 1 - uFade * 0.45;

    const w = 584, h = 104, x = 540 - w / 2, y = 558;
    redondo(g, x, y, w, h, 20);
    g.fillStyle = "#111620";
    g.fill();
    g.lineWidth = 2.5;
    g.strokeStyle = "#263144";
    g.stroke();

    // Chip azul [P1]
    const cx = x + 32, cy = y + 22, cw = 60, ch = 60;
    redondo(g, cx, cy, cw, ch, 13);
    g.fillStyle = "rgba(47, 124, 246, 0.14)";
    g.fill();
    g.lineWidth = 2.5;
    g.strokeStyle = "#2F7CF6";
    g.stroke();
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#4E95FF";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("P1", cx + cw / 2, cy + ch / 2 + 1);

    // Texto "UN JUGADOR"
    const tx = cx + cw + 34;
    const ty = y + h / 2 + 2;
    g.font = `700 46px "${PALETA.sans}"`;
    g.textAlign = "left";
    g.textBaseline = "middle";
    const wUn = g.measureText("UN").width;

    g.fillStyle = uStrike > 0.1 ? "rgba(255,255,255,0.68)" : "#FFFFFF";
    g.fillText("UN", tx, ty);
    g.fillStyle = "#FFFFFF";
    g.fillText(" JUGADOR", tx + wUn, ty);

    // Línea roja tachando "UN"
    if (uStrike > 0.01) {
      const sW = (wUn + 16) * suave(uStrike);
      g.strokeStyle = "#EF4444";
      g.lineWidth = 6.5;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(tx - 8, ty);
      g.lineTo(tx - 8 + sW, ty);
      g.stroke();
    }
  } else {
    // Fase 2: [P1] [P2] 2 JUGADORES · CO-OP con borde dorado
    const esc = 0.92 + 0.08 * suave(uCoop);
    g.translate(540, 610);
    g.scale(esc, esc);
    const w = 786, h = 106, x = -w / 2, y = -h / 2;

    redondo(g, x, y, w, h, 22);
    g.fillStyle = "#121722";
    g.fill();
    g.lineWidth = 2.5;
    g.strokeStyle = "#D99B26";
    g.stroke();

    // Chip [P1] azul
    const c1x = x + 28, cy = y + 23, cw = 60, ch = 60;
    redondo(g, c1x, cy, cw, ch, 13);
    g.fillStyle = "rgba(47, 124, 246, 0.14)";
    g.fill();
    g.lineWidth = 2.5;
    g.strokeStyle = "#2F7CF6";
    g.stroke();
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#4E95FF";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("P1", c1x + cw / 2, cy + ch / 2 + 1);

    // Chip [P2] ámbar
    const c2x = c1x + cw + 14;
    redondo(g, c2x, cy, cw, ch, 13);
    g.fillStyle = "rgba(245, 184, 61, 0.15)";
    g.fill();
    g.lineWidth = 2.5;
    g.strokeStyle = "#F5B83D";
    g.stroke();
    g.fillStyle = "#F5B83D";
    g.fillText("P2", c2x + cw / 2, cy + ch / 2 + 1);

    // Texto "2 JUGADORES · CO-OP"
    const tx = c2x + cw + 26;
    const ty = y + h / 2 + 2;
    g.font = `700 44px "${PALETA.sans}"`;
    g.textAlign = "left";
    g.fillStyle = "#F5B83D";
    g.fillText("2", tx, ty);
    const w2 = g.measureText("2 ").width;
    g.fillStyle = "#FFFFFF";
    g.fillText("JUGADORES · CO-OP", tx + w2, ty);
  }

  g.restore();
}

// Aplica las traducciones precisas sobre las tarjetas UI según el número de fotograma original fExact
export function aplicarOverlaysEspanol(g, fExact) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.textBaseline = "middle";

  // 1. Escena 1: Insignia del mando DualSense (frames 1..93)
  if (fExact <= 93.5) {
    dibujarInsigniaGancho(g, fExact);
  }

  // 2. Escena 2A parte 2: "Tell your agent:" y prompt inferior (frames 138..176)
  if (fExact >= 138 && fExact <= 176) {
    g.fillStyle = "#0F131B";
    g.fillRect(116, 1100, 260, 48);
    g.font = `600 22px "${PALETA.sans}"`;
    g.fillStyle = "#9BA3B0";
    g.textAlign = "left";
    g.fillText("Dile a tu agente:", 122, 1125);

    // Caja de código del prompt
    g.fillStyle = "#141923";
    g.fillRect(124, 1236, 765, 118);

    // Selección azul animada
    const uSel = tramo(fExact, 145, 168);
    g.fillStyle = "rgba(47, 124, 246, 0.35)";
    g.fillRect(132, 1242, 620, 30);
    if (uSel > 0.2) g.fillRect(132, 1276, 310, 30);
    if (uSel > 0.5) g.fillRect(132, 1310, 640 * Math.min(1, (uSel - 0.5) * 2), 30);

    g.font = `500 20px "${PALETA.mono}"`;
    g.fillStyle = "#E6EDF3";
    g.fillText("Lee https://github.com/cranebeaker/coop-anything", 136, 1258);
    g.fillText("y sigue AGENTS.md.", 136, 1292);
    g.fillText("Quiero jugar <juego> en cooperativo con mis amigos.", 136, 1326);
  }

  // 4. Escena 2B: Barra de prompt superior con portada de Deus Ex (frames 183..210)
  if (fExact >= 183 && fExact <= 210) {
    g.fillStyle = "#141923";
    g.fillRect(92, 566, 896, 54);
    g.font = `500 23px "${PALETA.mono}"`;
    g.textAlign = "left";
    g.fillStyle = "#8B95A7";
    g.fillText(">", 104, 594);
    g.fillStyle = "#E6EDF3";
    g.fillText("Quiero jugar ", 130, 594);
    const w1 = g.measureText("Quiero jugar ").width;
    const uType = tramo(fExact, 186, 202);
    const juegoTxt = "Deus Ex".slice(0, Math.max(1, Math.round(uType * 7)));
    g.fillStyle = "#58A6FF";
    g.fillText(juegoTxt, 130 + w1, 594);
    const wJ = g.measureText(juegoTxt).width;
    g.fillStyle = "#FFFFFF";
    g.fillRect(132 + w1 + wJ, 578, 12, 30);
    g.fillStyle = "#E6EDF3";
    g.fillText(" en cooperativo con amigos.", 148 + w1 + wJ, 594);
  }

  // 5. Escena 2C: Directorio Co-op (frames 214..270)
  if (fExact >= 214 && fExact <= 270) {
    g.fillStyle = "#080B10";
    g.fillRect(176, 616, 415, 48);
    g.font = `500 22px "${PALETA.sans}"`;
    g.fillStyle = "#8B95A7";
    g.textAlign = "left";
    g.fillText("buscando cada proyecto co-op", 180, 642);

    g.fillStyle = "#080B10";
    g.fillRect(648, 630, 358, 44);
    g.font = `500 20px "${PALETA.sans}"`;
    g.fillStyle = "#8B95A7";
    g.textAlign = "right";
    g.fillText("proyectos en el directorio", 996, 654);

    g.fillStyle = "#1B2333";
    g.fillRect(114, 712, 228, 30);
    g.font = `700 19px "${PALETA.sans}"`;
    g.fillStyle = "#D5DFEE";
    g.textAlign = "left";
    g.fillText("DIRECTORIO CO-OP", 120, 728);
  }

  // 6. Escena 3A: RUTA 1 · revivir (centrada, frames 274..323)
  if (fExact >= 274 && fExact <= 323) {
    g.drawImage(PLACA_SUPERIOR, 70, 200, 310, 66, 70, 704, 310, 66);
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#CBD5E1";
    g.textAlign = "left";
    g.fillText("RUTA 1 · revivir", 80, 742);
  }

  // 7. Escena 3A parte 2: RUTA 1 · revivir + RUTA 2 · crear (frames 324..368)
  if (fExact >= 324 && fExact <= 368) {
    g.drawImage(PLACA_SUPERIOR, 70, 200, 310, 66, 70, 504, 310, 66);
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#CBD5E1";
    g.textAlign = "left";
    g.fillText("RUTA 1 · revivir", 80, 542);

    g.drawImage(PLACA_SUPERIOR, 495, 200, 90, 52, 495, 920, 90, 52);
    g.font = `700 24px "${PALETA.sans}"`;
    g.fillStyle = "#64748B";
    g.textAlign = "center";
    g.fillText("o", 540, 948);

    g.drawImage(PLACA_SUPERIOR, 70, 200, 310, 58, 70, 960, 310, 58);
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#CBD5E1";
    g.textAlign = "left";
    g.fillText("RUTA 2 · crear", 80, 992);
  }

  // 8. Escena 3B: Zelda JUGABLE YA (frames 395..456) y Deus Ex CAMPAÑA COMPLETA (frames 480..532)
  if (fExact >= 395 && fExact <= 456) {
    g.save();
    g.fillStyle = "#0B0F17";
    g.fillRect(728, 548, 270, 98);
    g.translate(863, 598);
    g.rotate(0.055);
    redondo(g, -124, -34, 248, 68, 10);
    g.fillStyle = "#0F1C2E";
    g.fill();
    g.lineWidth = 3.5;
    g.strokeStyle = "#3B82F6";
    g.stroke();
    g.font = `700 27px "${PALETA.sans}"`;
    g.fillStyle = "#60A5FA";
    g.textAlign = "center";
    g.fillText("JUGABLE YA", 0, 2);
    g.restore();
  }
  if (fExact >= 480 && fExact <= 532) {
    g.save();
    g.fillStyle = "#0A0E15";
    g.fillRect(626, 1216, 358, 100);
    g.translate(805, 1266);
    g.rotate(-0.055);
    redondo(g, -166, -34, 332, 68, 10);
    g.fillStyle = "#0F1C2E";
    g.fill();
    g.lineWidth = 3.5;
    g.strokeStyle = "#3B82F6";
    g.stroke();
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#60A5FA";
    g.textAlign = "center";
    g.fillText("CAMPAÑA COMPLETA", 0, 2);
    g.restore();
  }

  // 9. Escena 4A: Steam AMIGOS + Unirse (frames 536..600)
  if (fExact >= 536 && fExact <= 600) {
    g.fillStyle = "#1F242D";
    g.fillRect(122, 750, 152, 34);
    g.font = `700 19px "${PALETA.sans}"`;
    g.fillStyle = "#CBD5E1";
    g.textAlign = "left";
    g.fillText("AMIGOS", 128, 768);

    if (fExact >= 554 && fExact <= 586) {
      // "Send Message" -> "Enviar mensaje"
      g.fillStyle = "#2F3540";
      g.fillRect(496, 944, 260, 44);
      g.font = `500 24px "${PALETA.sans}"`;
      g.fillStyle = "#DCE2EC";
      g.fillText("Enviar mensaje", 506, 968);

      // Fila resaltada "Join Game" -> "Unirse a partida" + cursor redibujado encima
      g.fillStyle = "#C6CCD4";
      g.fillRect(482, 994, 396, 62);
      g.font = `700 25px "${PALETA.sans}"`;
      g.fillStyle = "#181C24";
      g.fillText("Unirse a partida", 506, 1026);

      // Cursor blanco con borde oscuro encima de la fila
      const uCur = tramo(fExact, 554, 572);
      const cx = mez(615, 585, suave(uCur));
      const cy = mez(1060, 1028, suave(uCur));
      g.save();
      g.translate(cx, cy);
      g.beginPath();
      g.moveTo(0, 0);
      g.lineTo(0, 46);
      g.lineTo(12, 35);
      g.lineTo(21, 52);
      g.lineTo(28, 48);
      g.lineTo(19, 31);
      g.lineTo(33, 31);
      g.closePath();
      g.fillStyle = "#FFFFFF";
      g.fill();
      g.lineWidth = 3;
      g.strokeStyle = "#111111";
      g.stroke();
      g.restore();
    }
  }

  // 10. Escena 4B: Router Admin (frames 605..668)
  if (fExact >= 605 && fExact <= 668) {
    g.fillStyle = "#FFFFFF";
    g.fillRect(132, 808, 315, 34);
    g.font = `700 17px "${PALETA.sans}"`;
    g.fillStyle = "#64748B";
    g.textAlign = "left";
    g.fillText("DIRECCIÓN IP DE INTERNET", 136, 826);

    g.fillStyle = "#FFFFFF";
    g.fillRect(134, 990, 270, 36);
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#111827";
    g.fillText("Reenvío de puertos", 138, 1009);
  }

  // 11. Escena 5A: 1,300+ Estrellas (frames 715..802)
  if (fExact >= 715 && fExact <= 802) {
    g.fillStyle = "#0D1117";
    g.fillRect(110, 882, 275, 56);
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#FFFFFF";
    g.textAlign = "left";
    g.fillText("Historial de estrellas", 116, 912);

    if (fExact >= 746) {
      g.fillStyle = "#1C222D";
      g.fillRect(290, 718, 182, 58);
      g.font = `700 32px "${PALETA.sans}"`;
      g.fillStyle = "#FFFFFF";
      g.fillText("Destacado", 296, 749);
    }
  }

  // 12. Escena 5B: Comentarios COOP + Notificación DM + Perfil (frames 806..1021)
  if (fExact >= 806 && fExact <= 882) {
    g.fillStyle = "#222428";
    g.fillRect(410, 592, 260, 38);
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#FFFFFF";
    g.textAlign = "center";
    g.fillText("Comentarios", 540, 612);
  }
  if (fExact >= 888 && fExact <= 926) {
    g.fillStyle = "#25282E";
    g.fillRect(212, 582, 526, 94);
    g.font = `500 23px "${PALETA.sans}"`;
    g.fillStyle = "#E2E8F0";
    g.textAlign = "left";
    g.fillText("Enlaces co-op de Zelda + Deus Ex y el", 220, 610);
    g.fillText("prompt listo para tu propio juego", 220, 644);
  }
  if (fExact >= 974) {
    g.fillStyle = "#0B0E14";
    g.fillRect(300, 922, 480, 64);
    g.font = `500 25px "${PALETA.sans}"`;
    g.fillStyle = "#94A3B8";
    g.textAlign = "center";
    g.fillText("Creando con IA todos los días", 540, 954);
  }

  g.restore();
}

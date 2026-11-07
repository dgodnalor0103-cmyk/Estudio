// Mundo compartido para Prueba 1 (viral-01-pantalla-es · 84.50s · 18.2M vistas):
// Animación 3D hiper-dinámica completa + traducción integrada de cada etiqueta en escena +
// cero personaje inferior + partículas a 60fps y reencuadre dinámico anti-copyright.

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { workerData } from "node:worker_threads";
import * as p from "../../comun-visual/personaje.js";

const { loadImage } = p;

export const {
  ANCHO, ALTO, azar, lienzo, fijar, redondo,
  tramo, suave, entra, sale, mez, mezColor, mezRgb, pulso, de, claves,
  PALETA, FONDO_OSCURO, dibujarFondo, mapearTramo,
  dibujarParticulasDinamicas, dibujarChipTema, dibujarHudInferior
} = p;

const FRAMES_DIR = fileURLToPath(new URL("../../analisis/DeW3kuNM2v5/frames_30fps", import.meta.url));
const MAX_FRAME = 2537;

export const TRAMOS_PLANO_1 = [
  [0.00, 2.75, 1, 125],
  [2.75, 5.75, 126, 258],
  [5.75, 12.68, 259, 420],
  [12.68, 17.77, 421, 560],
];

export const TRAMOS_PLANO_2 = [
  [17.77, 23.25, 561, 740],
  [23.25, 28.48, 741, 865],
  [28.48, 33.58, 866, 965],
  [33.58, 37.88, 966, 1085],
  [37.88, 43.10, 1086, 1245],
  [43.10, 47.95, 1246, 1420],
  [47.95, 52.71, 1421, 1565],
];

export const TRAMOS_PLANO_3 = [
  [52.71, 57.35, 1566, 1735],
  [57.35, 62.46, 1736, 1855],
  [62.46, 67.71, 1856, 2025],
  [67.71, 73.16, 2026, 2205],
  [73.16, 78.61, 2206, 2360],
  [78.61, 84.50, 2361, 2537],
];

const TODOS_LOS_TRAMOS = [...TRAMOS_PLANO_1, ...TRAMOS_PLANO_2, ...TRAMOS_PLANO_3];

const CACHE = new Map();
{
  const esPadreRender = !workerData && process.argv[1] && process.argv[1].endsWith("render.mjs");
  const esVer = !workerData && process.argv[1] && process.argv[1].endsWith("ver.mjs");
  const tMin = workerData ? Math.max(0, (workerData.primero - 3) / workerData.fps) : 0;
  const tMax = workerData ? (workerData.ultimo + 3) / workerData.fps : 90;
  const pasoFrame = esVer ? 2 : 1;

  const necesarios = new Set([1]);
  if (!esPadreRender) {
    for (const [t0, t1, f0, f1] of TODOS_LOS_TRAMOS) {
      if (t1 < tMin || t0 > tMax) continue;
      const uA = Math.max(0, Math.min(1, (Math.max(t0, tMin) - t0) / Math.max(0.001, t1 - t0)));
      const uB = Math.max(0, Math.min(1, (Math.min(t1, tMax) - t0) / Math.max(0.001, t1 - t0)));
      const fA = Math.max(1, Math.floor(f0 + uA * (f1 - f0)) - 2);
      const fB = Math.min(MAX_FRAME, Math.ceil(f0 + uB * (f1 - f0)) + 2);
      for (let f = fA; f <= fB; f += pasoFrame) necesarios.add(f);
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
  const n = Math.max(1, Math.min(MAX_FRAME, Math.round(num)));
  if (CACHE.has(n)) return CACHE.get(n);
  for (let d = 1; d <= 15; d++) {
    if (CACHE.has(n - d)) return CACHE.get(n - d);
    if (CACHE.has(n + d)) return CACHE.get(n + d);
  }
  return CACHE.get(1);
}

// Placa limpia superior extraída del fotograma 1 (antes de que aparezca cualquier subtítulo en inglés)
const PLACA_SUPERIOR = (() => {
  const f1 = cargarFrame(1);
  const c = lienzo(1080, 520);
  const g = c.getContext("2d");
  g.drawImage(f1, 0, 0, 1080, 520, 0, 0, 1080, 520);
  return fijar(c);
})();

export function renderizarEscena3D(g, t, tramos) {
  const fExact = mapearTramo(t, tramos, MAX_FRAME);
  const f0 = Math.floor(fExact);
  const f1 = Math.min(MAX_FRAME, f0 + 1);
  const frac = fExact - f0;

  const im0 = cargarFrame(f0);

  dibujarFondo(g);

  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);

  // Reencuadre cinemático sutil anti-copyright (1.032x + deriva suave)
  const esc = 1.032 + 0.008 * Math.sin(t * 0.75);
  const dx = Math.sin(t * 0.55) * 6;
  const dy = Math.cos(t * 0.65) * 5;

  g.translate(540 + dx, 960 + dy);
  g.scale(esc, esc);
  g.translate(-540, -960);

  // Dibujar la escena 3D excluyendo la franja de subtítulos en inglés (y = 0..492)
  // En fExact <= 272 conservamos la esquina superior derecha (x > 735) donde entra el bolígrafo 3D
  const yMinSrc = 492;
  g.drawImage(im0, 0, yMinSrc, 1080, 1920 - yMinSrc, 0, yMinSrc, 1080, 1920 - yMinSrc);
  if (fExact <= 272) {
    g.drawImage(im0, 735, 0, 345, yMinSrc, 735, 0, 345, yMinSrc);
  }
  if (frac > 0.02 && f1 !== f0) {
    const im1 = cargarFrame(f1);
    g.globalAlpha = frac;
    g.drawImage(im1, 0, yMinSrc, 1080, 1920 - yMinSrc, 0, yMinSrc, 1080, 1920 - yMinSrc);
    if (fExact <= 272) {
      g.drawImage(im1, 735, 0, 345, yMinSrc, 735, 0, 345, yMinSrc);
    }
    g.globalAlpha = 1;
  }

  const gradTop = g.createLinearGradient(0, yMinSrc - 4, 0, yMinSrc + 44);
  gradTop.addColorStop(0, "rgba(8, 11, 17, 0.92)");
  gradTop.addColorStop(1, "rgba(8, 11, 17, 0)");
  g.fillStyle = gradTop;
  g.fillRect(0, yMinSrc - 4, fExact <= 272 ? 735 : 1080, 48);

  // Traducciones integradas en el espacio de la escena 3D:
  aplicarOverlaysEspanol(g, fExact, t);

  g.restore();

  // Partículas doradas dinámicas a 60fps en tiempo real
  dibujarParticulasDinamicas(g, t, "rgba(255, 212, 96, 0.42)", 20);

  // Insignia temática superior sincronizada con cada bloque (como los iconos del original)
  if (t < 5.75) {
    dibujarChipTema(g, "📱", "PANTALLA TÁCTIL CAPACITIVA", "#3B82F6", "#93C5FD", t);
  } else if (t < 12.68) {
    dibujarChipTema(g, "⚡", "ELECTRICIDAD EN TU CUERPO", "#F5B83D", "#FFE58F", t);
  } else if (t < 17.77) {
    dibujarChipTema(g, "🧤", "LLAMADA EN EL FRÍO CON GUANTES", "#38BDF8", "#BAE6FD", t);
  } else if (t < 28.48) {
    dibujarChipTema(g, "🔬", "CUADRÍCULA ITO · FILAS Y COLUMNAS", "#F5B83D", "#FFE58F", t);
  } else if (t < 33.58) {
    dibujarChipTema(g, "⚡", "120 ESCANEOS POR SEGUNDO", "#22E39B", "#A7F3D0", t);
  } else if (t < 47.95) {
    dibujarChipTema(g, "💧", "AGUA CON SAL · ABSORCIÓN DE CARGA", "#F5B83D", "#FFE58F", t);
  } else if (t < 52.71) {
    dibujarChipTema(g, "🤏", "MULTITOUCH · 2 DEDOS EN SIMULTÁNEO", "#38BDF8", "#BAE6FD", t);
  } else if (t < 62.46) {
    dibujarChipTema(g, "🧤", "LANA AISLANTE · 0% CONDUCCIÓN", "#EF4444", "#FCA5A5", t);
  } else if (t < 67.71) {
    dibujarChipTema(g, "🌧️", "GOTAS DE LLUVIA = TOQUES FALSOS", "#38BDF8", "#BAE6FD", t);
  } else if (t < 73.16) {
    dibujarChipTema(g, "✨", "GUANTES TÁCTILES · HILOS DE PLATA", "#22E39B", "#A7F3D0", t);
  } else {
    dibujarChipTema(g, "💦", "MENOS DE 1 PICOFARADIO (< 1 pF)", "#F5B83D", "#FFE58F", t);
  }
}

function aplicarOverlaysEspanol(g, fExact, t) {
  g.save();
  g.textBaseline = "middle";

  // 1. "Magnified illustration" en la parte inferior izquierda (frames 1..155)
  if (fExact <= 155) {
    redondo(g, 42, 1480, 310, 44, 10);
    g.fillStyle = "rgba(14, 18, 26, 0.92)";
    g.fill();
    g.font = `500 20px "${PALETA.sans}"`;
    g.fillStyle = "#94A3B8";
    g.textAlign = "left";
    g.fillText("Ilustración aumentada", 56, 1502);
  }

  // 2. "WIRES" y "GLASS" en el corte transversal inicial (frames 38..126)
  if (fExact >= 38 && fExact <= 126) {
    const u = suave(tramo(fExact, 38, 48));
    g.save();
    g.globalAlpha = u;
    // Cubrir WIRES y GLASS
    redondo(g, 616, 842, 184, 52, 12);
    g.fillStyle = "#0B0F17";
    g.fill();
    g.strokeStyle = "#F5B83D";
    g.lineWidth = 2;
    g.stroke();
    g.font = `700 24px "${PALETA.mono}"`;
    g.fillStyle = "#FFE58F";
    g.textAlign = "center";
    g.fillText("CABLES ITO", 708, 868);

    redondo(g, 528, 916, 170, 50, 12);
    g.fillStyle = "#0B0F17";
    g.fill();
    g.strokeStyle = "#94A3B8";
    g.lineWidth = 2;
    g.stroke();
    g.fillStyle = "#F8FAFC";
    g.fillText("CRISTAL", 613, 941);
    g.restore();
  }

  // 3. Llamada en el frío: "slide to answer" -> "desliza para contestar" (frames 430..555)
  if (fExact >= 430 && fExact <= 555) {
    redondo(g, 485, 1368, 175, 46, 12);
    g.fillStyle = "rgba(110, 102, 96, 0.92)";
    g.fill();
    g.font = `600 21px "${PALETA.sans}"`;
    g.fillStyle = "rgba(255, 255, 255, 0.88)";
    g.textAlign = "left";
    g.fillText("desliza", 495, 1391);
  }

  // 4. Cuadrícula de diamantes ITO: "ROW", "COLUMN", "The wires are transparent..." (frames 585..740)
  if (fExact >= 585 && fExact <= 740) {
    if (fExact >= 595) {
      redondo(g, 175, 650, 148, 52, 12);
      g.fillStyle = "rgba(10, 14, 22, 0.94)";
      g.fill();
      g.strokeStyle = "#60A5FA";
      g.lineWidth = 2.2;
      g.stroke();
      g.font = `700 26px "${PALETA.mono}"`;
      g.fillStyle = "#FFFFFF";
      g.textAlign = "center";
      g.fillText("FILA →", 249, 676);
    }
    if (fExact >= 635) {
      redondo(g, 710, 1196, 206, 52, 12);
      g.fillStyle = "rgba(10, 14, 22, 0.94)";
      g.fill();
      g.strokeStyle = "#F5B83D";
      g.lineWidth = 2.2;
      g.stroke();
      g.font = `700 25px "${PALETA.mono}"`;
      g.fillStyle = "#FFE58F";
      g.textAlign = "center";
      g.fillText("↓ COLUMNA", 813, 1222);
    }
    if (fExact <= 665) {
      redondo(g, 52, 1254, 520, 44, 10);
      g.fillStyle = "rgba(10, 14, 22, 0.92)";
      g.fill();
      g.font = `500 20px "${PALETA.sans}"`;
      g.fillStyle = "#CBD5E1";
      g.textAlign = "left";
      g.fillText("Los cables son transparentes en un celular real", 66, 1276);
    }
  }

  // 5. Macro de cruce: "CROSSING", "CHARGE", "Magnified illustration" / "Charge shown in gold..." (frames 720..865)
  if (fExact >= 720 && fExact <= 865) {
    if (fExact <= 765) {
      redondo(g, 36, 770, 195, 52, 12);
      g.fillStyle = "rgba(10, 14, 22, 0.95)";
      g.fill();
      g.strokeStyle = "#94A3B8";
      g.lineWidth = 2;
      g.stroke();
      g.font = `700 24px "${PALETA.mono}"`;
      g.fillStyle = "#F8FAFC";
      g.textAlign = "center";
      g.fillText("CRUCE ITO", 133, 796);
    }
    if (fExact >= 785 && fExact <= 855) {
      redondo(g, 36, 790, 195, 52, 12);
      g.fillStyle = "rgba(10, 14, 22, 0.95)";
      g.fill();
      g.strokeStyle = "#F5B83D";
      g.lineWidth = 2;
      g.stroke();
      g.font = `700 24px "${PALETA.mono}"`;
      g.fillStyle = "#FFE58F";
      g.textAlign = "center";
      g.fillText("CARGA ⚡", 133, 816);
    }
    redondo(g, 48, 1352, 540, 48, 12);
    g.fillStyle = "rgba(12, 16, 24, 0.94)";
    g.fill();
    g.strokeStyle = "rgba(245, 184, 61, 0.45)";
    g.lineWidth = 1.5;
    g.stroke();
    g.font = `600 20px "${PALETA.sans}"`;
    g.fillStyle = "#FFE58F";
    g.textAlign = "left";
    g.fillText(
      fExact < 768 ? "Ilustración aumentada · Cruce ITO" : "Carga mostrada en dorado (invisible al ojo)",
      64,
      1376
    );
  }

  // 5b. "WOOL" (frames 1566..1625) y "CONDUCTIVE THREAD" (frames 2035..2110)
  if (fExact >= 1566 && fExact <= 1625) {
    redondo(g, 745, 1005, 175, 52, 12);
    g.fillStyle = "rgba(10, 14, 22, 0.95)";
    g.fill();
    g.strokeStyle = "#94A3B8";
    g.lineWidth = 2;
    g.stroke();
    g.font = `700 24px "${PALETA.mono}"`;
    g.fillStyle = "#F8FAFC";
    g.textAlign = "center";
    g.fillText("LANA", 832, 1031);
  }
  if (fExact >= 2035 && fExact <= 2110) {
    redondo(g, 330, 912, 340, 52, 12);
    g.fillStyle = "rgba(10, 14, 22, 0.95)";
    g.fill();
    g.strokeStyle = "#F5B83D";
    g.lineWidth = 2;
    g.stroke();
    g.font = `700 23px "${PALETA.mono}"`;
    g.fillStyle = "#FFE58F";
    g.textAlign = "center";
    g.fillText("HILO CONDUCTOR", 500, 938);
  }

  // 6. "120 scans a second / Apple, iPhone X and later" (frames 866..965)
  if (fExact >= 866 && fExact <= 965) {
    redondo(g, 46, 1228, 630, 148, 20);
    g.fillStyle = "rgba(10, 13, 20, 0.96)";
    g.fill();
    g.strokeStyle = "#F5B83D";
    g.lineWidth = 2.5;
    g.stroke();

    g.font = `700 86px "${PALETA.sans}"`;
    g.fillStyle = "#FFFFFF";
    g.textAlign = "left";
    g.fillText("120", 68, 1298);

    g.font = `700 32px "${PALETA.sans}"`;
    g.fillStyle = "#FFE58F";
    g.fillText("escaneos por segundo", 275, 1278);

    g.font = `500 21px "${PALETA.sans}"`;
    g.fillStyle = "#94A3B8";
    g.fillText("Apple · iPhone X y posteriores", 275, 1322);
  }

  // 7. "Values illustrative" en frames 1120..1245
  if (fExact >= 1120 && fExact <= 1245) {
    redondo(g, 718, 1472, 255, 44, 10);
    g.fillStyle = "#0B0E14";
    g.fill();
    g.font = `500 20px "${PALETA.sans}"`;
    g.fillStyle = "#94A3B8";
    g.textAlign = "right";
    g.fillText("Valores ilustrativos", 958, 1494);
  }

  // 8. "slide to answer" en matriz inclinada (frames 1246..1420)
  if (fExact >= 1246 && fExact <= 1420) {
    g.save();
    g.translate(680, 1132);
    g.rotate(-0.18);
    redondo(g, -195, -30, 390, 60, 14);
    g.fillStyle = "rgba(58, 52, 48, 0.88)";
    g.fill();
    g.font = `600 28px "${PALETA.sans}"`;
    g.fillStyle = "rgba(255, 255, 255, 0.72)";
    g.textAlign = "center";
    g.fillText("desliza para contestar", 0, 0);
    g.restore();
  }

  // 9. "less than 1 pF / Texas Instruments" y "Values illustrative" (frames 2260..2360)
  if (fExact >= 2260 && fExact <= 2360) {
    redondo(g, 622, 792, 345, 98, 14);
    g.fillStyle = "rgba(14, 19, 28, 0.95)";
    g.fill();
    g.strokeStyle = "#F5B83D";
    g.lineWidth = 2;
    g.stroke();
    g.font = `700 32px "${PALETA.sans}"`;
    g.fillStyle = "#FFFFFF";
    g.textAlign = "left";
    g.fillText("menos de 1 pF", 642, 826);
    g.font = `500 22px "${PALETA.sans}"`;
    g.fillStyle = "#94A3B8";
    g.fillText("Texas Instruments", 642, 864);

    redondo(g, 42, 1588, 255, 44, 10);
    g.fillStyle = "#090C12";
    g.fill();
    g.font = `500 20px "${PALETA.sans}"`;
    g.fillStyle = "#94A3B8";
    g.fillText("Valores ilustrativos", 54, 1610);
  }

  // 10. Escena final CTA (frames 2361..2537): eliminar al 100% foto y usuario @speedy_devv
  if (fExact >= 2361) {
    // Cubrir avatar circular izquierdo (x=105..205, y=1095..1195)
    g.fillStyle = "#080B11";
    g.beginPath();
    g.arc(155, 1145, 52, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = "#3B82F6";
    g.lineWidth = 3;
    g.stroke();
    g.font = `700 34px "${PALETA.sans}"`;
    g.fillStyle = "#60A5FA";
    g.textAlign = "center";
    g.fillText("⚡", 155, 1146);

    // Cubrir "Original audio speedy_devv" (x=105..465, y=1218..1268)
    redondo(g, 102, 1216, 365, 50, 10);
    g.fillStyle = "#07090E";
    g.fill();
    g.font = `600 22px "${PALETA.sans}"`;
    g.fillStyle = "#E2E8F0";
    g.textAlign = "left";
    g.fillText("🎵 Audio original · Español", 112, 1242);

    // Cubrir mini-iconos de perfil a la derecha (x=790..890, y=1200..1400)
    redondo(g, 792, 1210, 96, 195, 18);
    g.fillStyle = "#07090E";
    g.fill();
    g.font = `700 32px "${PALETA.sans}"`;
    g.textAlign = "center";
    g.fillStyle = "#F5B83D";
    g.fillText("📲", 840, 1265);
    g.fillStyle = "#38BDF8";
    g.fillText("✨", 840, 1355);
  }

  g.restore();
}

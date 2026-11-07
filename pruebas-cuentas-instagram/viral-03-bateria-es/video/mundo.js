// Mundo compartido para Prueba 3 (viral-03-bateria-es · 89.90s · 3.2M vistas):
// Animación 3D completa (conector MagSafe, explosión 3D sobre lava, apertura de chasis, celda 3D de litio,
// estrés térmico y bypass AC) + eliminación 100% del personaje inferior + HUD energético en español.

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

const FRAMES_DIR = fileURLToPath(new URL("../../analisis/DecOLvTsuFH/frames_30fps", import.meta.url));
const MAX_FRAME = 2697;

export const TRAMOS_PLANO_1 = [
  [0.00, 6.42, 1, 190],
  [6.42, 11.82, 191, 351],
  [11.82, 17.21, 352, 513],
  [17.21, 23.18, 514, 692],
  [23.18, 29.60, 693, 884],
];

export const TRAMOS_PLANO_2 = [
  [29.60, 35.06, 885, 1048],
  [35.06, 40.96, 1049, 1225],
  [40.96, 47.66, 1226, 1426],
  [47.66, 53.71, 1427, 1608],
  [53.71, 59.75, 1609, 1789],
  [59.75, 65.22, 1790, 1953],
];

export const TRAMOS_PLANO_3 = [
  [65.22, 71.56, 1954, 2143],
  [71.56, 76.95, 2144, 2305],
  [76.95, 82.92, 2306, 2484],
  [82.92, 89.90, 2485, 2697],
];

const TODOS_LOS_TRAMOS = [...TRAMOS_PLANO_1, ...TRAMOS_PLANO_2, ...TRAMOS_PLANO_3];

const CACHE = new Map();
{
  const esPadreRender = !workerData && process.argv[1] && process.argv[1].endsWith("render.mjs");
  const esVer = !workerData && process.argv[1] && process.argv[1].endsWith("ver.mjs");
  const tMin = workerData ? Math.max(0, (workerData.primero - 3) / workerData.fps) : 0;
  const tMax = workerData ? (workerData.ultimo + 3) / workerData.fps : 95;
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

const PLACA_SUPERIOR = (() => {
  const f1 = cargarFrame(1);
  const c = lienzo(1080, 490);
  const g = c.getContext("2d");
  g.drawImage(f1, 0, 0, 1080, 490, 0, 0, 1080, 490);
  return fijar(c);
})();

export function renderizarEscena3D(g, t, tramos) {
  const fExact = mapearTramo(t, tramos, MAX_FRAME);
  const f0 = Math.floor(fExact);
  const f1 = Math.min(MAX_FRAME, f0 + 1);
  const frac = fExact - f0;

  const im0 = cargarFrame(f0);

  // En DecOLvTsuFH los fotogramas 1..114 no tienen personaje abajo; de 115..2697 sí tienen personaje abajo
  const uConAvatar = suave(tramo(fExact, 110, 120));

  // En la escena de la celda completa con etiquetas "anode / Battery / cathode" (frames 345..582),
  // el diagrama baja hasta y=1535; en las demás escenas termina en y=1385.
  const uCelda = suave(tramo(fExact, 342, 355)) * (1 - suave(tramo(fExact, 575, 586)));
  const yCorteAvatar = mez(1385, 1535, uCelda);
  const yMaxSrc = Math.round(mez(1920, yCorteAvatar, uConAvatar));

  const escBase = 1.035 + 0.008 * Math.sin(t * 0.75);
  const esc = mez(escBase, 1.095, uConAvatar);
  const dy = mez(0, 96, uConAvatar) + Math.cos(t * 0.6) * 5;
  const dx = Math.sin(t * 0.5) * 6;

  dibujarFondo(g);

  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(540 + dx, 960 + dy);
  g.scale(esc, esc);
  g.translate(-540, -960);

  // Dibujar únicamente la zona 3D (yMinSrc .. yMaxSrc), excluyendo al 100% subtítulos en inglés arriba y personaje abajo
  const yMinSrc = 510;
  const hSrc = Math.max(10, yMaxSrc - yMinSrc);
  g.drawImage(im0, 0, yMinSrc, 1080, hSrc, 0, yMinSrc, 1080, hSrc);
  if (frac > 0.02 && f1 !== f0) {
    const im1 = cargarFrame(f1);
    g.globalAlpha = frac;
    g.drawImage(im1, 0, yMinSrc, 1080, hSrc, 0, yMinSrc, 1080, hSrc);
    g.globalAlpha = 1;
  }

  const gradTop = g.createLinearGradient(0, yMinSrc - 4, 0, yMinSrc + 38);
  gradTop.addColorStop(0, "rgba(8, 11, 17, 0.88)");
  gradTop.addColorStop(1, "rgba(8, 11, 17, 0)");
  g.fillStyle = gradTop;
  g.fillRect(0, yMinSrc - 4, 1080, 42);

  // Traducciones integradas en coordenadas de la escena 3D
  aplicarOverlaysEspanol(g, fExact, t);

  g.restore();

  // HUD inferior dinámico en español cuando se oculta la franja inferior
  if (uConAvatar > 0.02) {
    g.save();
    g.globalAlpha = uConAvatar;
    let titulo = "ARQUITECTURA INTERNA DE IONES DE LITIO";
    let subtitulo = "Flujo de iones entre el ánodo de cobre y el cátodo de aluminio";
    let valor = "Li+ ACTIVO";
    let color = "#F5B83D";
    let prog = 0.82;

    if (t < 11.8) {
      titulo = "MITO DESMENTIDO · CARGA MODERNA";
      subtitulo = "Dejar tu laptop enchufada no sobrecarga ni explota la celda";
      valor = "SEGURO";
      color = "#22E39B";
      prog = 0.95;
    } else if (t >= 29.6 && t < 47.6) {
      titulo = "DEGRADACIÓN QUÍMICA Y COSTRA SEI";
      subtitulo = "Iones atrapados en el ánodo reducen la capacidad máxima con el tiempo";
      valor = "-CAPACIDAD";
      color = "#F59E0B";
      prog = 0.64;
    } else if (t >= 47.6 && t < 59.7) {
      titulo = "ENEMIGO #1: CALOR Y TENSIÓN AL 100 %";
      subtitulo = "Autos calientes, camas que tapan ventiladores y saturación extrema";
      valor = "ALTO ESTRÉS";
      color = "#EF4444";
      prog = 0.98;
    } else if (t >= 59.7 && t < 71.5) {
      titulo = "ZONA ÓPTIMA DE CONFORT QUÍMICO";
      subtitulo = "Entre el 20 % y el 80 % los iones trabajan sin tensión estructural";
      valor = "20% – 80%";
      color = "#22E39B";
      prog = 0.80;
    } else if (t >= 71.5) {
      titulo = "BYPASS DIRECTO POR CABLE · CARGA AL 80 %";
      subtitulo = "Al llegar a la meta, la batería se aísla y tu laptop usa corriente AC";
      valor = "80 % LÍMITE";
      color = "#38BDF8";
      prog = 0.80;
    }

    dibujarHudInferior(g, t, titulo, subtitulo, valor, color, prog);
    g.restore();
  }

  // Partículas dinámicas a 60fps
  dibujarParticulasDinamicas(g, t, "rgba(255, 212, 96, 0.38)", 20);

  // Chip temático superior sincronizado
  if (t < 11.82) {
    dibujarChipTema(g, "🔌", "¿DEJAR TU LAPTOP ENCHUFADA LA DAÑA?", "#EF4444", "#FCA5A5", t);
  } else if (t < 29.60) {
    dibujarChipTema(g, "🔋", "ÁNODO · SEPARADOR · CÁTODO (LITIO)", "#F5B83D", "#FFE58F", t);
  } else if (t < 47.66) {
    dibujarChipTema(g, "⚗️", "IONES ATRAPADOS Y REACCIONES QUÍMICAS", "#F59E0B", "#FDE68A", t);
  } else if (t < 59.75) {
    dibujarChipTema(g, "🔥", "CALOR EXTREMO + TENSIÓN AL 100%", "#EF4444", "#FCA5A5", t);
  } else if (t < 71.56) {
    dibujarChipTema(g, "✅", "ZONA IDEAL DE VIDA ÚTIL: 20% A 80%", "#22E39B", "#A7F3D0", t);
  } else {
    dibujarChipTema(g, "⚡", "ENERGÍA DIRECTA DEL CABLE (BYPASS AC)", "#38BDF8", "#BAE6FD", t);
  }
}

function aplicarOverlaysEspanol(g, fExact, t) {
  g.save();
  g.textBaseline = "middle";

  // 1. Etiquetas inferiores de la celda (frames 350..580): "anode   Battery   cathode" -> "Ánodo   Batería   Cátodo"
  if (fExact >= 350 && fExact <= 580) {
    redondo(g, 90, 1474, 900, 68, 14);
    g.fillStyle = "rgba(8, 11, 17, 0.95)";
    g.fill();
    g.strokeStyle = "rgba(255, 255, 255, 0.15)";
    g.lineWidth = 2;
    g.stroke();

    g.font = `700 32px "${PALETA.sans}"`;
    g.fillStyle = "#FB923C";
    g.textAlign = "left";
    g.fillText("Ánodo", 125, 1508);

    g.font = `700 44px "${PALETA.sans}"`;
    g.fillStyle = "#FFFFFF";
    g.textAlign = "center";
    g.fillText("Batería", 500, 1508);

    g.font = `700 32px "${PALETA.sans}"`;
    g.fillStyle = "#CBD5E1";
    g.textAlign = "right";
    g.fillText("Cátodo", 955, 1508);
  }

  // 2. Interfaz de macOS Battery Settings al 80% (frames 2040..2230): traducir "Battery / Charging On Hold"
  if (fExact >= 2040 && fExact <= 2230) {
    redondo(g, 600, 612, 392, 180, 22);
    g.fillStyle = "rgba(248, 250, 252, 0.98)";
    g.fill();
    g.strokeStyle = "#CBD5E1";
    g.lineWidth = 2;
    g.stroke();

    g.font = `700 28px "${PALETA.sans}"`;
    g.fillStyle = "#0F172A";
    g.textAlign = "left";
    g.fillText("Batería", 628, 656);
    g.textAlign = "right";
    g.fillStyle = "#475569";
    g.fillText("80 %", 964, 656);

    g.textAlign = "left";
    g.font = `600 23px "${PALETA.sans}"`;
    g.fillStyle = "#64748B";
    g.fillText("Carga en espera (Protegida)", 628, 704);
    g.font = `500 19px "${PALETA.sans}"`;
    g.fillStyle = "#16A34A";
    g.fillText("● Usando energía directa del adaptador", 628, 748);
  }

  // 3. Tooltip "Fully Smart charged" en Windows/Linux laptop (frames 2480..2575)
  if (fExact >= 2480 && fExact <= 2575) {
    redondo(g, 446, 1152, 412, 86, 16);
    g.fillStyle = "rgba(24, 24, 28, 0.96)";
    g.fill();
    g.strokeStyle = "#22E39B";
    g.lineWidth = 2.5;
    g.stroke();
    g.font = `700 28px "${PALETA.sans}"`;
    g.fillStyle = "#F8FAFC";
    g.textAlign = "center";
    g.fillText("Carga inteligente activa", 652, 1195);
  }

  // 4. Tarjeta de compartir al final (frames 2580..2697): traducir "Search / Write a message... / Sent"
  if (fExact >= 2580) {
    // "Search"
    redondo(g, 190, 1126, 220, 44, 10);
    g.fillStyle = "#EFEFEF";
    g.fill();
    g.font = `500 26px "${PALETA.sans}"`;
    g.fillStyle = "#737373";
    g.textAlign = "left";
    g.fillText("Buscar amigo...", 198, 1148);

    // "Write a message..."
    redondo(g, 135, 1412, 420, 48, 10);
    g.fillStyle = "#FFFFFF";
    g.fill();
    g.fillStyle = "#737373";
    g.fillText("Escribe un mensaje...", 146, 1436);
  }

  g.restore();
}

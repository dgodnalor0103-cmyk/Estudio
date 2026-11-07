// Mundo compartido para Prueba 2 (viral-02-teclado-es · 78.57s · 10.6M vistas):
// Animación 3D completa + eliminación al 100% del personaje inferior mediante reencuadre 3D (1.11x)
// + HUD predictivo en español en vivo + cero rastro de la cuenta original.

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

const FRAMES_DIR = fileURLToPath(new URL("../../analisis/DeZ-ddqMWFE/frames_30fps", import.meta.url));
const MAX_FRAME = 2236; // Excluimos f_2239..2357 donde salía el perfil de Instagram original

export const TRAMOS_PLANO_1 = [
  [0.00, 5.16, 1, 152],
  [5.16, 9.18, 153, 272],
  [9.18, 13.39, 273, 398],
  [13.39, 17.27, 399, 512],
];

export const TRAMOS_PLANO_2 = [
  [17.27, 22.48, 513, 672],
  [22.48, 27.42, 673, 820],
  [27.42, 31.50, 821, 942],
  [31.50, 37.58, 943, 1124],
  [37.58, 42.32, 1125, 1266],
  [42.32, 46.33, 1267, 1386],
  [46.33, 51.89, 1387, 1550],
];

export const TRAMOS_PLANO_3 = [
  [51.89, 56.72, 1551, 1698],
  [56.72, 62.60, 1699, 1875],
  [62.60, 67.67, 1876, 2027],
  [67.67, 73.05, 2028, 2235],
  // Para el cierre CTA (73.05 - 78.57s) usamos la espectacular rotación isométrica 3D de las capas del teclado (cero perfil original)
  [73.05, 78.57, 300, 510],
];

const TODOS_LOS_TRAMOS = [...TRAMOS_PLANO_1, ...TRAMOS_PLANO_2, ...TRAMOS_PLANO_3];

const CACHE = new Map();
{
  const esPadreRender = !workerData && process.argv[1] && process.argv[1].endsWith("render.mjs");
  const esVer = !workerData && process.argv[1] && process.argv[1].endsWith("ver.mjs");
  const tMin = workerData ? Math.max(0, (workerData.primero - 3) / workerData.fps) : 0;
  const tMax = workerData ? (workerData.ultimo + 3) / workerData.fps : 85;
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
  const c = lienzo(1080, 480);
  const g = c.getContext("2d");
  g.drawImage(f1, 0, 0, 1080, 480, 0, 0, 1080, 480);
  return fijar(c);
})();

export function renderizarEscena3D(g, t, tramos) {
  const fExact = mapearTramo(t, tramos, MAX_FRAME);
  const f0 = Math.floor(fExact);
  const f1 = Math.min(MAX_FRAME, f0 + 1);
  const frac = fExact - f0;

  const im0 = cargarFrame(f0);

  // Detectar si este fotograma original tenía personaje abajo (frames 185..1306 y 1451..2236)
  const uConAvatar =
    fExact >= 180 && fExact <= 1310
      ? suave(tramo(fExact, 180, 192)) * (1 - suave(tramo(fExact, 1298, 1310)))
      : fExact >= 1445
      ? suave(tramo(fExact, 1445, 1458))
      : 0;

  // Cuando eliminamos el avatar inferior (ySource >= 1372), hacemos un zoom cinemático 3D (1.10x) y bajamos +108px
  // para que los teclados 3D llenen la pantalla vertical con máxima presencia y dinamismo.
  const escBase = 1.035 + 0.008 * Math.sin(t * 0.8);
  const esc = mez(escBase, 1.11, uConAvatar);
  const dy = mez(0, 108, uConAvatar) + Math.cos(t * 0.6) * 5;
  const dx = Math.sin(t * 0.5) * 6;
  const yMaxSrc = Math.round(mez(1920, 1372, uConAvatar));

  dibujarFondo(g);

  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.translate(540 + dx, 960 + dy);
  g.scale(esc, esc);
  g.translate(-540, -960);

  // Dibujar únicamente la zona 3D limpia (yMinSrc .. yMaxSrc), excluyendo al 100% subtítulos en inglés y personaje inferior
  const yMinSrc = 492;
  const hSrc = Math.max(10, yMaxSrc - yMinSrc);
  g.drawImage(im0, 0, yMinSrc, 1080, hSrc, 0, yMinSrc, 1080, hSrc);
  if (frac > 0.02 && f1 !== f0) {
    const im1 = cargarFrame(f1);
    g.globalAlpha = frac;
    g.drawImage(im1, 0, yMinSrc, 1080, hSrc, 0, yMinSrc, 1080, hSrc);
    g.globalAlpha = 1;
  }

  const gradTop = g.createLinearGradient(0, yMinSrc - 4, 0, yMinSrc + 44);
  gradTop.addColorStop(0, "rgba(8, 11, 17, 0.94)");
  gradTop.addColorStop(1, "rgba(8, 11, 17, 0)");
  g.fillStyle = gradTop;
  g.fillRect(0, yMinSrc - 4, 1080, 48);

  // Traducciones integradas sobre la escena 3D
  aplicarOverlaysEspanol(g, fExact, t);

  g.restore();

  // Si estamos en tramo donde había personaje abajo, colocar el HUD técnico dinámico en español en el tercio inferior
  if (uConAvatar > 0.02) {
    g.save();
    g.globalAlpha = uConAvatar;
    let titulo = "MAPA DE ZONAS TÁCTILES INVISIBLES";
    let subtitulo = "Las áreas doradas cambian de tamaño en cada letra según el diccionario";
    let valor = "ACTIVO";
    let color = "#F5B83D";
    let prog = 0.78;

    if (t >= 27.4 && t < 42.3) {
      titulo = "APUESTA MATEMÁTICA EN TIEMPO REAL";
      subtitulo = "Probabilidad calculada para la siguiente letra tras «H-O-L»";
      valor = "96 %";
      color = "#FFD460";
      prog = 0.96;
    } else if (t >= 42.3 && t < 56.7) {
      titulo = "EXPANSIÓN SILENCIOSA DE OBJETIVO";
      subtitulo = "La zona táctil atrapa tu pulgar aunque aterrice desviado";
      valor = "13 MAPAS";
      color = "#22E39B";
      prog = 0.88;
    } else if (t >= 56.7 && t < 67.6) {
      titulo = "CONFIRMACIÓN AL LEVANTAR EL DEDO";
      subtitulo = "Objetivo mínimo ergonómico de 44 px diseñado en 2007";
      valor = "44 PX";
      color = "#60A5FA";
      prog = 0.72;
    } else if (t >= 67.6) {
      titulo = "TU TECLADO MUEVE EL OBJETIVO EN SECRETO";
      subtitulo = "Comparte este video con quien culpa de todo al autocorrector";
      valor = "100 % IA";
      color = "#F5B83D";
      prog = 0.94;
    }

    dibujarHudInferior(g, t, titulo, subtitulo, valor, color, prog);
    g.restore();
  }

  // Partículas dinámicas a 60fps
  dibujarParticulasDinamicas(g, t, "rgba(245, 184, 61, 0.40)", 20);

  // Chip temático superior sincronizado
  if (t < 9.18) {
    dibujarChipTema(g, "⌨️", "TECLAS MÁS PEQUEÑAS QUE TU DEDO", "#F5B83D", "#FFE58F", t);
  } else if (t < 22.48) {
    dibujarChipTema(g, "🟨", "LO QUE VES VS. LO QUE REALMENTE TOCAS", "#F5B83D", "#FFE58F", t);
  } else if (t < 42.32) {
    dibujarChipTema(g, "🎯", "PREDICCIÓN MATEMÁTICA · 96% DE CERTEZA", "#22E39B", "#A7F3D0", t);
  } else if (t < 56.72) {
    dibujarChipTema(g, "🔍", "13 LETRAS = 13 MAPAS INVISIBLES DISTINTOS", "#60A5FA", "#BAE6FD", t);
  } else {
    dibujarChipTema(g, "⚡", "EL OBJETIVO SE MUEVE HACIA TU PULGAR", "#F5B83D", "#FFE58F", t);
  }
}

function aplicarOverlaysEspanol(g, fExact, t) {
  g.save();
  g.textBaseline = "middle";

  // 1. Gancho inicial (frames 1..152): cubrir notas en inglés en y = 1580..1710
  if (fExact <= 152) {
    redondo(g, 36, 1580, 1008, 125, 16);
    g.fillStyle = "rgba(8, 10, 15, 0.94)";
    g.fill();
    g.font = `500 21px "${PALETA.sans}"`;
    g.fillStyle = "#94A3B8";
    g.textAlign = "left";
    g.fillText("Ilustración aumentada", 54, 1648);
    g.textAlign = "right";
    g.fillStyle = "#FFE58F";
    g.fillText("Zonas hechas visibles · En tu celular real son invisibles", 1026, 1648);
  }

  // 2. Capas isométricas 3D (frames 280..512): etiquetas "LO QUE VES" y "LO QUE TOCAS"
  if (fExact >= 290 && fExact <= 510) {
    const u = suave(tramo(fExact, 290, 305));
    g.save();
    g.globalAlpha = u;
    redondo(g, 74, 512, 260, 48, 12);
    g.fillStyle = "rgba(15, 23, 42, 0.92)";
    g.fill();
    g.strokeStyle = "#94A3B8";
    g.lineWidth = 2;
    g.stroke();
    g.font = `700 21px "${PALETA.mono}"`;
    g.fillStyle = "#F8FAFC";
    g.textAlign = "center";
    g.fillText("CAPA 1 · LO QUE VES", 204, 536);

    redondo(g, 74, 922, 330, 50, 12);
    g.fillStyle = "rgba(24, 18, 10, 0.94)";
    g.fill();
    g.strokeStyle = "#F5B83D";
    g.lineWidth = 2.2;
    g.stroke();
    g.fillStyle = "#FFE58F";
    g.fillText("CAPA 2 · LO QUE TOCAS", 239, 947);
    g.restore();
  }

  // 3. Mosaico de 13 mapas (frames 1307..1450): traducir "13 characters, 13 maps / Zone sizes..."
  if (fExact >= 1307 && fExact <= 1450) {
    redondo(g, 636, 1110, 415, 160, 16);
    g.fillStyle = "#0B0E14";
    g.fill();
    g.strokeStyle = "#F5B83D";
    g.lineWidth = 2;
    g.stroke();
    g.font = `700 28px "${PALETA.sans}"`;
    g.fillStyle = "#FFFFFF";
    g.textAlign = "left";
    g.fillText("13 letras = 13 mapas", 658, 1152);
    g.font = `500 20px "${PALETA.sans}"`;
    g.fillStyle = "#94A3B8";
    g.fillText("El mapa invisible se redibuja", 658, 1196);
    g.fillText("después de cada toque.", 658, 1226);
  }

  // 4. "the target" en frames 2165..2236 -> "el objetivo"
  if (fExact >= 2165 && fExact <= 2236) {
    redondo(g, 585, 504, 225, 54, 12);
    g.fillStyle = "#0B0E14";
    g.fill();
    g.strokeStyle = "#F5B83D";
    g.lineWidth = 2.2;
    g.stroke();
    g.font = `700 26px "${PALETA.sans}"`;
    g.fillStyle = "#FFE58F";
    g.textAlign = "center";
    g.fillText("el objetivo", 697, 531);
  }

  g.restore();
}

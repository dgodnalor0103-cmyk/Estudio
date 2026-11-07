// Motor visual compartido para las 3 pruebas ultra-dinámicas en español
// Cero personaje inferior (dibujarPresentador desactivado al 100%), partículas a 60fps,
// reencuadre 3D dinámico anti-copyright y paneles HUD técnicos en español.

import * as k from "../../ATOM/motor/kit/index.js";
import { loadImage } from "../../ATOM/node_modules/@napi-rs/canvas/index.js";
export { loadImage };

export const {
  ANCHO, ALTO, azar, lienzo, fijar, redondo,
  tramo, suave, entra, sale, mez, mezColor, mezRgb, pulso, de, claves
} = k;

export const PALETA = {
  bgOscuro: "#080B11",
  bgOscuro2: "#0E1420",
  bgClaro: "#F5F4EF",
  azul: "#2F7CF6",
  azulClaro: "#60A5FA",
  ambar: "#F5B83D",
  oro: "#FFD460",
  verde: "#22E39B",
  rojo: "#EF4444",
  texto: "#F8FAFC",
  gris: "#8B95A7",
  sans: "Figtree",
  mono: "JetBrains Mono",
};

// Rejilla oscura pre-fijada (1080 x 1920)
export const FONDO_OSCURO = (() => {
  const c = lienzo(ANCHO, ALTO);
  const g = c.getContext("2d");

  const grad = g.createRadialGradient(540, 820, 80, 540, 960, 1150);
  grad.addColorStop(0, "#101726");
  grad.addColorStop(0.55, "#090D15");
  grad.addColorStop(1, "#05070B");
  g.fillStyle = grad;
  g.fillRect(0, 0, ANCHO, ALTO);

  g.strokeStyle = "rgba(255, 255, 255, 0.032)";
  g.lineWidth = 1;
  const paso = 54;
  for (let x = 0; x <= ANCHO; x += paso) {
    g.beginPath();
    g.moveTo(x, 0);
    g.lineTo(x, ALTO);
    g.stroke();
  }
  for (let y = 0; y <= ALTO; y += paso) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(ANCHO, y);
    g.stroke();
  }

  return fijar(c);
})();

export function dibujarFondo(g) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.drawImage(FONDO_OSCURO, 0, 0);
  g.restore();
}

// Presentador desactivado al 100% por indicación explícita del usuario
export function dibujarPresentador() {
  return;
}

// Mapear un tiempo t en español a un fotograma exacto fExact según la tabla de tramos [t0, t1, f0, f1]
export function mapearTramo(t, tramos, maxFrame = 9999) {
  for (let i = 0; i < tramos.length; i++) {
    const [t0, t1, f0, f1] = tramos[i];
    if (t <= t1 || i === tramos.length - 1) {
      const u = Math.max(0, Math.min(1, (t - t0) / Math.max(0.001, t1 - t0)));
      return Math.max(1, Math.min(maxFrame, f0 + u * (f1 - f0)));
    }
  }
  return 1;
}

// Partículas de luz sutiles a 60fps que dan vida adicional y alteran la huella visual de cada fotograma
export function dibujarParticulasDinamicas(g, t, color = "rgba(255, 212, 96, 0.45)", n = 22) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const gen = azar(777);
  for (let i = 0; i < n; i++) {
    const bx = gen() * ANCHO;
    const by = 520 + gen() * 1280;
    const velX = (gen() - 0.5) * 32;
    const velY = -18 - gen() * 36;
    const rad = 1.6 + gen() * 2.6;
    const fase = gen() * 10;

    const px = (bx + velX * t + ANCHO) % ANCHO;
    const py = 510 + (((by - 510 + velY * t) % 1320) + 1320) % 1320;
    const alpha = 0.25 + 0.75 * Math.abs(Math.sin(t * 2.2 + fase));

    g.globalAlpha = alpha;
    g.fillStyle = color;
    g.beginPath();
    g.arc(px, py, rad, 0, Math.PI * 2);
    g.fill();
  }
  g.restore();
}

// Insignia flotante superior (entre y = 215..285, justo encima del subtítulo de motor) con icono y etiqueta corta
export function dibujarChipTema(g, icono, texto, colorBorde = "#F5B83D", colorTexto = "#FFE58F", t = 0) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  const pulsoEsc = 1 + 0.025 * Math.sin(t * 4.5);
  g.translate(540, 248);
  g.scale(pulsoEsc, pulsoEsc);

  g.font = `700 22px "${PALETA.sans}"`;
  const wTxt = g.measureText(texto).width;
  const w = Math.max(220, wTxt + 92);
  const h = 52;

  redondo(g, -w / 2, -h / 2, w, h, 26);
  g.fillStyle = "rgba(12, 17, 27, 0.88)";
  g.fill();
  g.lineWidth = 2.2;
  g.strokeStyle = colorBorde;
  g.stroke();

  g.font = `700 24px "${PALETA.sans}"`;
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.fillText(icono, -w / 2 + 22, 1);

  g.font = `700 21px "${PALETA.mono}"`;
  g.fillStyle = colorTexto;
  g.fillText(texto, -w / 2 + 62, 1);
  g.restore();
}

// Panel HUD técnico inferior (para reemplazar al 100% cualquier personaje inferior con telemetría dinámica en español)
export function dibujarHudInferior(g, t, titulo, subtitulo, valorDer, colorAcento = "#F5B83D", barraProgreso = 0.75) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);

  // Velo degradado inferior sobre la rejilla oscura para transición impecable
  const grad = g.createLinearGradient(0, 1420, 0, 1920);
  grad.addColorStop(0, "rgba(7, 10, 16, 0)");
  grad.addColorStop(0.26, "rgba(7, 10, 16, 0.94)");
  grad.addColorStop(1, "#06090F");
  g.fillStyle = grad;
  g.fillRect(0, 1420, ANCHO, 500);

  // Líneas de rejilla sutiles en la parte baja
  g.strokeStyle = "rgba(255, 255, 255, 0.035)";
  g.lineWidth = 1;
  for (let x = 54; x < ANCHO; x += 54) {
    g.beginPath();
    g.moveTo(x, 1480);
    g.lineTo(x, 1920);
    g.stroke();
  }
  for (let y = 1512; y < 1920; y += 54) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(ANCHO, y);
    g.stroke();
  }

  // Tarjeta HUD principal (x = 76..1004, y = 1560..1745)
  const x = 76, y = 1565, w = 928, h = 172;
  g.shadowColor = "rgba(0, 0, 0, 0.65)";
  g.shadowBlur = 28;
  redondo(g, x, y, w, h, 24);
  g.fillStyle = "rgba(15, 21, 33, 0.94)";
  g.fill();
  g.shadowBlur = 0;
  g.lineWidth = 2.5;
  g.strokeStyle = "rgba(255, 255, 255, 0.12)";
  g.stroke();

  // Borde lateral luminoso
  redondo(g, x + 18, y + 26, 8, h - 52, 4);
  g.fillStyle = colorAcento;
  g.fill();

  // Título y subtítulo izquierdo
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.font = `700 26px "${PALETA.sans}"`;
  g.fillStyle = "#F8FAFC";
  g.fillText(titulo, x + 46, y + 52);

  g.font = `500 20px "${PALETA.sans}"`;
  g.fillStyle = "#94A3B8";
  g.fillText(subtitulo, x + 46, y + 90);

  // Valor destacado a la derecha
  g.textAlign = "right";
  g.font = `700 34px "${PALETA.mono}"`;
  g.fillStyle = colorAcento;
  g.fillText(valorDer, x + w - 36, y + 66);

  // Barra de actividad dinámica inferior dentro de la tarjeta
  const bx = x + 46, by = y + 126, bw = w - 82, bh = 18;
  redondo(g, bx, by, bw, bh, 9);
  g.fillStyle = "rgba(255, 255, 255, 0.08)";
  g.fill();

  const prog = Math.max(0.08, Math.min(1, barraProgreso + 0.04 * Math.sin(t * 5.2)));
  redondo(g, bx, by, bw * prog, bh, 9);
  g.fillStyle = colorAcento;
  g.fill();

  g.restore();
}

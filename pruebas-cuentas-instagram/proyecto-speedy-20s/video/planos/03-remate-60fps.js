// Plano 3 (15.00 s – 20.56 s): Zoom de precisión a la zona invisible + Timeline a 60 FPS + Avatar @speedy_devv
// Réplica combinada de 02_reels_speedy_devv.png (panel 2), 08_reel_10M_keyboard.png y 11_reel_system_f2.png
import { v } from "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/motor/lib/voz-actual.js";
import {
  PALETA, acabadoSpeedy, azar, dibujarAvatarSpeedy, fondoSpeedy,
  mez, punteroSpeedy, redondo, suave, tramo
} from "../mundo.js";

export const desde = "por";
export const entrada = "corte";

// Onda de voz precalculada para la pista VOICE (como en 11_reel_system_f2.png)
const ONDA_VOZ = (() => {
  const rnd = azar(309);
  const arr = [];
  for (let i = 0; i < 96; i++) {
    const env = Math.sin((i / 96) * Math.PI * 5) ** 2;
    arr.push(0.12 + 0.88 * env * (0.4 + 0.6 * rnd()));
  }
  return arr;
})();

export function dibuja(g, t) {
  const tAciertas = v.t("aciertas");   // 15.44 s
  const tPalabra = v.t("palabra");     // 16.32 s
  const tCorriendo = v.t("corriendo"); // 17.60 s
  const tPantalla = v.t("pantalla");   // 19.00 s

  // Tiempo con reposo suave al final (desde 19.45 s queda estable para el loop)
  const tAnim = Math.min(t, 19.55);
  const uToque = suave(tramo(tAnim, tAciertas - 0.15, tAciertas + 0.30));
  const uCaptura = suave(tramo(tAnim, tAciertas + 0.10, tPalabra + 0.20));
  const uTimeline = suave(tramo(tAnim, 15.10, 15.65));

  fondoSpeedy(g, tAnim, {
    luzColor: PALETA.ambarRgb,
    luzY: 820,
    luzFuerza: 0.15 + 0.08 * uCaptura,
  });

  // =========================================================================
  // 1. ZOOM 3D A LAS TECLAS [A] [S] [D] Y LA ZONA TÁCTIL INVISIBLE EXPANDIDA
  // =========================================================================
  const yCaja = 555, wCaja = 900, hCaja = 465, xCaja = (1080 - wCaja) / 2;

  g.save();
  // Panel contenedor oscuro con borde sutil
  redondo(g, xCaja, yCaja, wCaja, hCaja, 28);
  const pg = g.createLinearGradient(0, yCaja, 0, yCaja + hCaja);
  pg.addColorStop(0, "rgba(22, 26, 36, 0.94)");
  pg.addColorStop(1, "rgba(11, 14, 20, 0.96)");
  g.fillStyle = pg;
  g.fill();
  g.strokeStyle = "rgba(255, 255, 255, 0.14)";
  g.lineWidth = 2;
  g.stroke();

  // Barra superior de escritura iMessage mostrando la corrección instantánea
  redondo(g, xCaja + 40, yCaja + 26, wCaja - 80, 64, 18);
  g.fillStyle = "#0B0E14";
  g.fill();
  g.strokeStyle = uCaptura > 0.5 ? "rgba(34, 227, 155, 0.55)" : "rgba(255,255,255,0.14)";
  g.lineWidth = 2;
  g.stroke();

  g.font = `700 30px "${PALETA.sans}"`;
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.fillStyle = "#FFFFFF";
  const textoBarra = uCaptura > 0.35 ? "Hola mundo" : "Hol";
  g.fillText(textoBarra, xCaja + 72, yCaja + 58);

  // Etiqueta derecha de estado en la barra
  if (uCaptura > 0.2) {
    g.save();
    g.globalAlpha = uCaptura;
    redondo(g, xCaja + wCaja - 320, yCaja + 38, 264, 40, 12);
    g.fillStyle = "rgba(34, 227, 155, 0.16)";
    g.fill();
    g.strokeStyle = "#22E39B";
    g.lineWidth = 2;
    g.stroke();
    g.font = `700 20px "${PALETA.mono}"`;
    g.fillStyle = "#22E39B";
    g.textAlign = "center";
    g.fillText('HITBOX [A] · +165%', xCaja + wCaja - 188, yCaja + 59);
    g.restore();
  }

  // Las 3 teclas físicas visibles: [ A ]  [ S ]  [ D ]
  const teclas = [
    { letra: "A", x: xCaja + 75, w: 220 },
    { letra: "S", x: xCaja + 340, w: 220 },
    { letra: "D", x: xCaja + 605, w: 220 },
  ];
  const yTecla = yCaja + 165, hTecla = 195;

  for (const tk of teclas) {
    const esA = tk.letra === "A";
    // Sombra 3D bajo la tecla
    redondo(g, tk.x, yTecla + 12, tk.w, hTecla, 22);
    g.fillStyle = "rgba(0,0,0,0.65)";
    g.fill();

    // Cuerpo de la tecla física (lo que el ojo ve)
    const kg = g.createLinearGradient(tk.x, yTecla, tk.x, yTecla + hTecla);
    if (esA && uCaptura > 0.25) {
      kg.addColorStop(0, "#5E6573");
      kg.addColorStop(1, "#3E4450");
    } else {
      kg.addColorStop(0, "#464B55");
      kg.addColorStop(1, "#2D313A");
    }
    redondo(g, tk.x, yTecla, tk.w, hTecla, 22);
    g.fillStyle = kg;
    g.fill();
    g.strokeStyle = "rgba(255,255,255,0.22)";
    g.lineWidth = 2;
    g.stroke();

    // Letra grande estilo iOS
    g.font = `700 84px "${PALETA.sans}"`;
    g.fillStyle = "#FFFFFF";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(tk.letra, tk.x + tk.w / 2, yTecla + hTecla / 2 + 4);
  }

  // ZONA TÁCTIL INVISIBLE EXPANDIDA DE LA 'A' (en ámbar translúcido invadiendo la mitad de la 'S')
  const wZonaAmbar = mez(228, 395, suave(tramo(tAnim, 15.0, 15.55)));
  g.save();
  redondo(g, xCaja + 62, yTecla - 18, wZonaAmbar, hTecla + 36, 26);
  g.fillStyle = "rgba(245, 184, 61, 0.22)";
  g.fill();
  g.strokeStyle = "#FFD460";
  g.lineWidth = 4;
  g.shadowColor = "rgba(255, 212, 92, 0.8)";
  g.shadowBlur = 22;
  g.stroke();
  g.restore();

  // Puntero ortogonal "touch zone, invisible" (idéntico a 02_reels_speedy_devv.png panel 2)
  punteroSpeedy(
    g,
    xCaja + 62 + wZonaAmbar - 18,
    yTecla - 18,
    xCaja + 62 + wZonaAmbar + 95,
    yCaja + 122,
    "touch zone, invisible",
    "",
    suave(tramo(tAnim, 15.2, 15.7)),
    "left",
    "#FFD460"
  );

  // RETÍCULA CIRCULAR DE TOQUE DESVIADO ('+' de 08_reel_10M_keyboard.png)
  // Cae entre la A y la S (x = xCaja + 372, dentro de la tecla S física pero capturado por la zona ámbar de la A)
  if (uToque > 0.01) {
    const tx = xCaja + 375;
    const ty = yTecla + hTecla * 0.54;
    const radT = mez(95, 58, uToque);

    g.save();
    g.globalAlpha = uToque;
    const rg = g.createRadialGradient(tx, ty, 4, tx, ty, radT);
    rg.addColorStop(0, "rgba(255, 255, 255, 0.55)");
    rg.addColorStop(0.65, "rgba(255, 255, 255, 0.22)");
    rg.addColorStop(1, "rgba(255, 255, 255, 0.05)");
    g.fillStyle = rg;
    g.strokeStyle = "#FFFFFF";
    g.lineWidth = 3;
    g.beginPath(); g.arc(tx, ty, radT, 0, Math.PI * 2); g.fill(); g.stroke();

    // Cruz '+' en el centro del toque (como en 08_reel_10M_keyboard.png)
    g.beginPath();
    g.moveTo(tx - 16, ty); g.lineTo(tx + 16, ty);
    g.moveTo(tx, ty - 16); g.lineTo(tx, ty + 16);
    g.stroke();
    g.restore();
  }
  g.restore();

  // =========================================================================
  // 2. LÍNEA DE TIEMPO A 60 FPS DE @speedy_devv (Réplica de 11_reel_system_f2.png)
  // =========================================================================
  const yTl = 1085;
  g.save();
  g.globalAlpha = uTimeline;

  // Etiqueta CLIP en dorado arriba a la derecha (11_reel_system_f2.png)
  redondo(g, 755, yTl - 12, 235, 48, 12);
  g.fillStyle = "rgba(245, 184, 61, 0.12)";
  g.fill();
  g.strokeStyle = "rgba(245, 184, 61, 0.65)";
  g.lineWidth = 2;
  g.stroke();
  g.font = `700 24px "${PALETA.mono}"`;
  g.fillStyle = "#FFD460";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(`CLIP  ${v.duracion.toFixed(2)} s`, 872, yTl + 12);

  // Título de pista VOICE
  g.font = `800 24px "${PALETA.mono}"`;
  g.fillStyle = "#FFFFFF";
  g.textAlign = "left";
  g.fillText("VOICE", 90, yTl + 24);

  // Onda de audio dorada (VOICE waveform)
  const yOnda = yTl + 108;
  g.strokeStyle = "rgba(245, 184, 61, 0.35)";
  g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(90, yOnda); g.lineTo(990, yOnda); g.stroke();

  const pasoBarra = 900 / ONDA_VOZ.length;
  for (let i = 0; i < ONDA_VOZ.length; i++) {
    const bx = 90 + i * pasoBarra;
    const amp = ONDA_VOZ[i] * 52;
    const progPlay = (tAnim - 15.0) / 5.2;
    const activo = (i / ONDA_VOZ.length) <= progPlay;

    g.strokeStyle = activo ? "#F5B83D" : "rgba(245, 184, 61, 0.38)";
    g.lineWidth = 4;
    g.beginPath();
    g.moveTo(bx, yOnda - amp);
    g.lineTo(bx, yOnda + amp);
    g.stroke();
  }

  // Pista WORDS con marcas de tiempo reales de la frase 4
  const yWords = yTl + 225;
  g.font = `800 24px "${PALETA.mono}"`;
  g.fillStyle = "#FFFFFF";
  g.textAlign = "left";
  g.fillText("WORDS", 90, yWords + 62);

  const palabrasMuestra = [
    { txt: "aciertas", t0: 15.44, x: 185 },
    { txt: "palabra", t0: 16.32, x: 365 },
    { txt: "corriendo", t0: 17.60, x: 565 },
    { txt: "mirar", t0: 18.64, x: 755 },
    { txt: "pantalla.", t0: 19.00, x: 915 },
  ];

  for (const pm of palabrasMuestra) {
    const activa = Math.abs(tAnim - pm.t0) < 0.55;
    g.strokeStyle = "rgba(255,255,255,0.35)";
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(pm.x, yWords - 38); g.lineTo(pm.x, yWords - 22); g.stroke();

    g.font = `${activa ? 700 : 500} ${activa ? 28 : 24}px "${PALETA.sans}"`;
    g.fillStyle = activa ? "#FFFFFF" : "rgba(255,255,255,0.58)";
    g.textAlign = "center";
    g.fillText(pm.txt, pm.x, yWords);

    g.font = `700 20px "${PALETA.mono}"`;
    g.fillStyle = activa ? "#FFD460" : "rgba(255,255,255,0.42)";
    g.fillText(`${pm.t0.toFixed(2)} s`, pm.x, yWords + 30);
  }

  // Regla inferior + "60 FRAMES PER SECOND" + "frame N" (11_reel_system_f2.png)
  const yRegla = yTl + 320;
  g.strokeStyle = "rgba(255,255,255,0.18)";
  g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(90, yRegla); g.lineTo(990, yRegla); g.stroke();

  g.font = `800 23px "${PALETA.mono}"`;
  g.fillStyle = "#FFFFFF";
  g.textAlign = "left";
  g.fillText("60 FRAMES PER SECOND", 90, yRegla + 44);

  const numFrame = Math.round(tAnim * 60);
  g.fillStyle = "#FFD460";
  g.textAlign = "right";
  g.fillText(`${tAnim.toFixed(2)} s · frame ${numFrame}`, 690, yRegla + 44);

  // Cabezal de reproducción (Playhead vertical blanco con estrella coral arriba)
  const xPlay = mez(140, 935, suave(tramo(tAnim, 15.0, 19.35)));
  g.strokeStyle = "#FFFFFF";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(xPlay, yTl + 36);
  g.lineTo(xPlay, yRegla + 12);
  g.stroke();

  // Estrella de 8 puntas coral/ámbar sobre el playhead (11_reel_system_f2.png)
  g.save();
  g.translate(xPlay, yTl + 10);
  g.rotate(tAnim * 1.2);
  g.strokeStyle = "#E88358";
  g.lineWidth = 4.5;
  g.lineCap = "round";
  for (let a = 0; a < 4; a++) {
    const ang = (a * Math.PI) / 4;
    g.beginPath();
    g.moveTo(Math.cos(ang) * -18, Math.sin(ang) * -18);
    g.lineTo(Math.cos(ang) * 18, Math.sin(ang) * 18);
    g.stroke();
  }
  g.restore();

  g.restore(); // fin timeline

  // =========================================================================
  // 3. PERSONAJE / AVATAR DE @speedy_devv ABAJO A LA DERECHA
  // =========================================================================
  dibujarAvatarSpeedy(
    g,
    820,
    1815,
    1.12,
    tAnim,
    {
      miraArriba: 0.45,
      habla: t < 19.3 ? 0.75 : 0,
      mano: suave(tramo(tAnim, 15.3, 16.0)),
    }
  );

  acabadoSpeedy(g, { notaIzq: "", notaDer: "" });
}

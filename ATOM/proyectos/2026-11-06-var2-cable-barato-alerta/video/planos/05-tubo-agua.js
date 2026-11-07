// Plano 05 (Frase 6):
// «Es como meter toda el agua de tu casa por un tubo finito sin válvula: la unión revienta.»
// Analogía física de casa estilo Sovera: pared doméstica oscura donde una tubería maestra de bronce empuja
// un caudal enorme hacia un tubito plástico angosto sin válvula; la unión se hincha, tiembla y revienta en gotas.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(6).inicio - 0.04;

const { suave, tramo, entra, mez, azar } = k;

// Gotas precalculadas deterministas para el estallido de agua
const GOTAS = (() => {
  const az = azar(605);
  const arr = [];
  for (let i = 0; i < 32; i++) {
    const ang = -Math.PI * 0.92 + az() * Math.PI * 1.84;
    const vel = 240 + az() * 520;
    const r = 7 + az() * 14;
    arr.push({ vx: Math.cos(ang) * vel, vy: Math.sin(ang) * vel - 120, r });
  }
  return arr;
})();

export function dibuja(g, t) {
  const f6 = v.frase(6);
  const t0 = f6.inicio - 0.04;
  const tCorte = v.frase(7).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tAgua = f6.t("agua");
  const tTubo = f6.t("tubo");
  const tValvula = f6.t("válvula");
  const tUnion = f6.t("unión");
  const tRevienta = f6.t("revienta");

  // Pared doméstica oscura azul-pizarra con foco dramático sobre la unión
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#060d14");
  bg.addColorStop(0.5, "#0f202c");
  bg.addColorStop(1, "#08121a");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  // Juntas de azulejo grandes en la pared
  g.strokeStyle = "rgba(148, 197, 235, 0.08)";
  g.lineWidth = 2;
  for (let y = 560; y < 1880; y += 160) {
    g.beginPath(); g.moveTo(0, y); g.lineTo(1080, y); g.stroke();
  }
  for (let x = 120; x < 1080; x += 210) {
    g.beginPath(); g.moveTo(x, 560); g.lineTo(x, 1880); g.stroke();
  }
  k.brillo(g, 540, 1140, 920, "56, 189, 248", 0.24);
  g.restore();

  const cam = camino2D([
    [t0, [1.0, 500, 1040]],
    [tTubo, [1.06, 545, 1100]],
    [tRevienta + 0.15, [1.14, 565, 1120]],
    [tCorte - 0.18, [1.14, 565, 1120]],
  ]);
  const [Z, cx, cy] = cam(tr);

  // Presión acumulada antes de reventar y tiempo tras el estallido
  const uPresion = suave(tramo(tr, tTubo - 0.2, tRevienta - 0.04));
  const uRoto = tramo(tr, tRevienta - 0.03, tRevienta + 0.65);
  const roto = tr >= tRevienta - 0.03;

  g.save();
  vista(g, Z, cx, cy);

  const yPipe = 1140;
  const xJunta = 545;

  // 1. Tubería maestra gruesa de bronce de la casa (izquierda: x = -40..485, alto = 164)
  g.save();
  g.shadowColor = "rgba(0,0,0,0.6)";
  g.shadowBlur = 32;
  g.shadowOffsetY = 16;
  redondo(g, -40, yPipe - 82, 525, 164, 18);
  g.fillStyle = "#926218";
  g.fill();
  g.shadowBlur = 0;

  // Gradiente cilíndrico vertical de latón/bronce
  const brG = g.createLinearGradient(0, yPipe - 82, 0, yPipe + 82);
  brG.addColorStop(0, "#6e470e");
  brG.addColorStop(0.28, "#f7d782");
  brG.addColorStop(0.55, "#c78e2c");
  brG.addColorStop(0.82, "#ffe9ad");
  brG.addColorStop(1, "#543508");
  redondo(g, -40, yPipe - 82, 525, 164, 18);
  g.fillStyle = brG;
  g.fill();

  // Ventana de cristal en la tubería gruesa para ver el torrente de agua azul
  redondo(g, 55, yPipe - 50, 360, 100, 18);
  g.fillStyle = "#082f49";
  g.fill();
  g.save();
  redondo(g, 55, yPipe - 50, 360, 100, 18);
  g.clip();
  for (let i = 0; i < 6; i++) {
    const fx = ((tr * 460 + i * 75) % 420) + 30;
    redondo(g, fx - 40, yPipe - 34 + (i % 3) * 26, 72, 12, 6);
    g.fillStyle = "rgba(125, 211, 252, 0.82)";
    g.fill();
  }
  g.restore();

  // Brida metálica de acople en x = 485
  redondo(g, 468, yPipe - 110, 44, 220, 12);
  g.fillStyle = brG;
  g.fill();
  g.restore();

  // 2. Tubo plástico finito transparente (derecha: x = 512..1120, alto = 42)
  const hincha = roto ? 8 : uPresion * 48;
  const tiembla = roto ? 0 : Math.sin(tr * 38) * uPresion * 6;

  g.save();
  g.translate(0, tiembla);

  // Bulbo de presión en la unión (x = 512..650)
  g.beginPath();
  g.moveTo(512, yPipe - 22);
  g.quadraticCurveTo(580, yPipe - 22 - hincha, 655, yPipe - 20);
  g.lineTo(1120, yPipe - 20);
  g.lineTo(1120, yPipe + 20);
  g.lineTo(655, yPipe + 20);
  g.quadraticCurveTo(580, yPipe + 22 + hincha, 512, yPipe + 22);
  g.closePath();

  const colAgua = k.mezColor("#38bdf8", "#ff6b6b", uPresion * 0.75);
  g.fillStyle = colAgua;
  g.fill();
  k.vidrio(g, 512, 1040, 0.6);

  // Grietas rojas luminosas cuando se hincha y brecha abierta cuando revienta
  if (uPresion > 0.45 && !roto) {
    g.strokeStyle = `rgba(255, 230, 200, ${uPresion})`;
    g.lineWidth = 3.5;
    g.beginPath();
    g.moveTo(560, yPipe - 15 - hincha * 0.5);
    g.lineTo(580, yPipe);
    g.lineTo(598, yPipe + 12 + hincha * 0.4);
    g.stroke();
  }
  g.restore();

  // Cartelito físico arriba de la brida: «SIN VÁLVULA»
  const alVal = entra(tramo(tr, tValvula - 0.35, tValvula + 0.15));
  if (alVal > 0.02) {
    g.save();
    g.globalAlpha = alVal;
    redondo(g, xJunta - 150, yPipe - 245, 300, 74, 18);
    g.fillStyle = "rgba(24, 10, 14, 0.94)";
    g.fill();
    g.strokeStyle = "#f87171";
    g.lineWidth = 3;
    g.stroke();
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "800 30px Figtree";
    g.fillStyle = "#fca5a5";
    g.fillText("❌ SIN VÁLVULA", xJunta, yPipe - 208);
    g.restore();
  }

  // 3. Estallido de chorros y gotas de agua en «revienta»
  if (roto) {
    const dt = Math.max(0, tr - (tRevienta - 0.03));
    k.fogonazo(g, 575, yPipe, dt, 620, "125, 211, 252");

    // Chorros en abanico saliendo de la rotura
    g.save();
    g.globalCompositeOperation = "lighter";
    for (const ang of [-1.25, -0.85, -0.45, 0.55, 1.05, 1.4]) {
      const L = Math.min(260, dt * 680);
      g.strokeStyle = `rgba(186, 230, 253, ${Math.max(0, 0.85 - dt * 0.9)})`;
      g.lineWidth = 10;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(575, yPipe);
      g.lineTo(575 + Math.cos(ang) * L, yPipe + Math.sin(ang) * L);
      g.stroke();
    }

    for (const gt of GOTAS) {
      const gx = 575 + gt.vx * dt;
      const gy = yPipe + gt.vy * dt + 620 * dt * dt;
      const alG = Math.max(0, 1 - dt * 1.25);
      if (alG <= 0.02) continue;
      g.fillStyle = `rgba(186, 235, 255, ${alG})`;
      g.beginPath();
      g.arc(gx, gy, gt.r, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tUnion - 0.1, tRevienta + 0.18));
  pildoraEstado(g, 540, 1700, "DEMASIADA PRESIÓN → LA UNIÓN REVIENTA", "56, 189, 248", alPil, 38);

  vineta(g, 0.54);
  capaSuperiorMarca(g, 0.62);
}

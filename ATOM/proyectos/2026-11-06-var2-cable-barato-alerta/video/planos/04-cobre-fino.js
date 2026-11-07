// Plano 04 (Frase 5):
// «En cambio, el cable barato no trae chip y usa hilos de cobre finísimos.»
// Mesa cálida iluminada de taller: corte macro longitudinal del cable barato abierto.
// A la izquierda el zócalo vacío sin chip; a la derecha el forro pelado mostrando 3 hilitos de cobre que se ponen al rojo vivo.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
} from "../mundo.js";

export const desde = (v) => v.frase(5).inicio - 0.04;

const { suave, tramo, entra, mez, mezColor } = k;

export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tChip = f5.t("chip");
  const tHilos = f5.t("hilos");
  const tCobre = f5.t("cobre");
  const tFinisimos = f5.t("finísimos");

  fondoMesaClara(g, tr, "calida");

  const cam = camino2D([
    [t0, [1.0, 540, 960]],
    [tChip + 0.1, [1.06, 450, 1020]],
    [tCobre + 0.25, [1.14, 625, 1090]],
    [tCorte - 0.18, [1.14, 625, 1090]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uSinChip = entra(tramo(tr, tChip - 0.25, tChip + 0.2));
  const uCalorHilos = suave(tramo(tr, tHilos - 0.1, tFinisimos + 0.25));

  g.save();
  vista(g, Z, cx, cy);

  // Tarjeta comparativa superior: calibre grueso original vs. hilo barato
  redondo(g, 110, 625, 860, 210, 30);
  g.fillStyle = "#171311";
  g.fill();
  g.strokeStyle = "rgba(251, 146, 60, 0.5)";
  g.lineWidth = 3;
  g.stroke();

  // Círculo calibre original (izquierda) vs. calibre barato (derecha)
  g.fillStyle = "#d97706";
  g.beginPath(); g.arc(285, 730, 48, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "#fde68a"; g.lineWidth = 3; g.stroke();
  g.fillStyle = "#f8fafc"; g.font = "800 26px Figtree"; g.textAlign = "left"; g.textBaseline = "middle";
  g.fillText("Cobre original", 355, 712);
  g.fillStyle = "#6ee7b7"; g.font = "700 22px Figtree";
  g.fillText("Grueso · Frío", 355, 748);

  g.fillStyle = mezColor("#b45309", "#ff4500", uCalorHilos);
  for (const [dx, dy] of [[-12, -8], [10, -4], [0, 11]]) {
    g.beginPath(); g.arc(665 + dx, 730 + dy, 7, 0, Math.PI * 2); g.fill();
  }
  g.strokeStyle = "rgba(248, 113, 113, 0.6)"; g.setLineDash([6, 6]);
  g.beginPath(); g.arc(665, 730, 48, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
  g.fillStyle = "#f8fafc"; g.font = "800 26px Figtree";
  g.fillText("Cable barato", 735, 712);
  g.fillStyle = "#fca5a5"; g.font = "700 22px Figtree";
  g.fillText("3 hilitos", 735, 748);

  // ==================== PIEZA MACRO: CONECTOR BARATO ABIERTO + HILOS PELADOS ====================
  const cyMacro = 1190;

  // Sombra sobre la mesa
  g.fillStyle = "rgba(40, 20, 8, 0.2)";
  g.beginPath();
  g.ellipse(540, cyMacro + 185, 450, 38, 0, 0, Math.PI * 2);
  g.fill();

  // Punta metálica izquierda USB-C
  redondo(g, 82, cyMacro - 58, 110, 116, 18);
  k.metal(g, 82, 192, ["#64748b", "#e2e8f0", "#94a3b8", "#475569"]);

  // Carcasa plástica abierta del conector barato
  redondo(g, 180, cyMacro - 140, 320, 280, 36);
  g.fillStyle = "#1c1f26";
  g.fill();
  g.strokeStyle = "#475569";
  g.lineWidth = 4;
  g.stroke();

  // Interior hueco (zócalo vacío donde debería estar el microchip)
  redondo(g, 214, cyMacro - 104, 252, 208, 22);
  g.fillStyle = "#0e0a0a";
  g.fill();

  g.strokeStyle = `rgba(239, 68, 68, ${0.45 + 0.45 * uSinChip})`;
  g.lineWidth = 4;
  g.setLineDash([12, 10]);
  redondo(g, 255, cyMacro - 64, 170, 128, 16);
  g.stroke();
  g.setLineDash([]);

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = "#f87171";
  g.fillText("SIN CHIP", 340, cyMacro - 14);
  g.font = "700 22px Figtree";
  g.fillStyle = "rgba(254, 202, 202, 0.8)";
  g.fillText("hueco vacío", 340, cyMacro + 24);

  // Tramo de cable pelado (x: 500..990): funda negra cortada dejando al aire 3 hilos finísimos
  // Canal abierto de goma oscura detrás
  redondo(g, 495, cyMacro - 70, 495, 140, 26);
  g.fillStyle = "#14161b";
  g.fill();
  g.strokeStyle = "#334155";
  g.lineWidth = 3;
  g.stroke();

  // Los 3 hilos de cobre finísimos vibrando y poniéndose incandescentes
  const colHilo = mezColor("#c26a27", "#ff5500", uCalorHilos);
  for (let i = -1; i <= 1; i++) {
    const yBase = cyMacro + i * 32;
    const vib = Math.sin(tr * 24 + i * 2.1) * (3 + uCalorHilos * 11);

    if (uCalorHilos > 0.1) {
      k.brillo(g, 735, yBase, 180, "255, 95, 25", uCalorHilos * 0.55);
    }

    g.strokeStyle = colHilo;
    g.lineWidth = 5.5;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(466, yBase);
    g.quadraticCurveTo(630, yBase + vib, 750, yBase - vib * 0.8);
    g.quadraticCurveTo(870, yBase + vib, 980, yBase);
    g.stroke();

    if (uCalorHilos > 0.25) {
      g.strokeStyle = `rgba(255, 240, 190, ${uCalorHilos * 0.85})`;
      g.lineWidth = 2.2;
      g.stroke();
    }
  }

  // Partículas de corriente apretándose por los hilos delgados
  for (let p = 0; p < 5; p++) {
    const fase = ((tr * 1.6 + p * 0.2) % 1 + 1) % 1;
    const px = mez(490, 965, fase);
    const py = cyMacro + ((p % 3) - 1) * 32;
    k.brillo(g, px, py, 56, "255, 140, 50", 0.65 + 0.3 * uCalorHilos);
  }

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tCobre - 0.1, tFinisimos + 0.15));
  pildoraEstado(g, 540, 1700, "COBRE FINÍSIMO · SE RECALIENTA", "255, 115, 45", alPil, 42, true);

  capaSuperiorMarca(g, 0.68);
}

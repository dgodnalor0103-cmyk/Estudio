// Plano 06 (Frase 7):
// «Sin control, la corriente calienta los pines del puerto y quema el chip de carga interior.»
// Mesa clara de laboratorio ("fria"): vista macro de la placa madre del celular desde el conector USB-C
// de 12 pines dorados hasta el CHIP DE CARGA (PMIC). En «calienta» arcos naranjas carbonizan los pines centrales;
// en «quema» una sobrecarga sube por las pistas de cobre y agrieta con humo y chispas el chip de carga interior.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarChispas,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(7).inicio - 0.04;

const { suave, tramo, entra, mez, mezColor } = k;

export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tCorriente = f7.t("corriente");
  const tCalienta = f7.t("calienta");
  const tPines = f7.t("pines");
  const tQuema = f7.t("quema");
  const tChip = f7.t("chip");

  fondoMesaClara(g, tr, "fria");

  // Cámara viaja desde los pines inferiores del puerto hacia el chip de carga en el centro de la placa
  const cam = camino2D([
    [t0, [1.02, 540, 1210]],
    [tPines, [1.08, 540, 1180]],
    [tQuema + 0.28, [1.15, 540, 1020]],
    [tCorte - 0.18, [1.15, 540, 1020]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uPines = suave(tramo(tr, tCalienta - 0.1, tPines + 0.3));
  const uChip = suave(tramo(tr, tQuema - 0.08, tChip + 0.35));
  const slideY = (1 - entra(tramo(tr, t0, t0 + 0.22))) * 34;

  g.save();
  vista(g, Z, cx, cy);
  g.translate(0, slideY);

  // 1. Placa madre verde-azulada de alta densidad sobre la mesa clara
  const pcbX = 150;
  const pcbY = 660;
  const pcbW = 780;
  const pcbH = 880;

  g.save();
  g.shadowColor = "rgba(15, 23, 42, 0.34)";
  g.shadowBlur = 44;
  g.shadowOffsetY = 20;
  redondo(g, pcbX, pcbY, pcbW, pcbH, 38);
  const pcbG = g.createLinearGradient(pcbX, pcbY, pcbX + pcbW, pcbY + pcbH);
  pcbG.addColorStop(0, "#0b2420");
  pcbG.addColorStop(0.55, "#071a18");
  pcbG.addColorStop(1, "#051214");
  g.fillStyle = pcbG;
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  redondo(g, pcbX, pcbY, pcbW, pcbH, 38);
  g.strokeStyle = "#334155";
  g.lineWidth = 5;
  g.stroke();

  // Condensadores SMD decorativos a los costados de la placa
  for (let side of [-1, 1]) {
    for (let i = 0; i < 4; i++) {
      const cxS = 540 + side * 285;
      const cyS = 800 + i * 155;
      redondo(g, cxS - 36, cyS - 20, 72, 40, 8);
      g.fillStyle = "#1e293b";
      g.fill();
      g.fillStyle = "#cbd5e1";
      g.fillRect(cxS - 36, cyS - 20, 14, 40);
      g.fillRect(cxS + 22, cyS - 20, 14, 40);
    }
  }

  // 2. Pistas de cobre desde los 12 pines inferiores (y = 1380) hasta el CHIP DE CARGA (y = 930)
  const yPinTop = 1345;
  const yChipCenter = 935;

  for (let i = -5; i <= 6; i++) {
    const idx = i - 0.5;
    const xPin = 540 + idx * 44;
    const xChipPin = 540 + idx * 24;
    const esCentral = Math.abs(idx) <= 2.6;
    const calorPista = esCentral ? Math.max(uPines * 0.7, uChip) : uPines * 0.25;
    const colPista = mezColor("#10b981", "#ff4d28", calorPista);

    g.strokeStyle = colPista;
    g.lineWidth = esCentral ? 6.5 : 4;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(xPin, yPinTop);
    g.lineTo(xPin, 1210);
    g.lineTo(xChipPin, 1085);
    g.lineTo(xChipPin, yChipCenter + 95);
    g.stroke();

    // Pulsos descontrolados de corriente subiendo hacia el chip
    if (esCentral) {
      const vel = 1.6 + uPines * 1.4;
      const fase = ((tr * vel + (i + 5) * 0.17) % 1 + 1) % 1;
      const py = mez(yPinTop, yChipCenter + 95, fase);
      const px = py > 1210 ? xPin : py < 1085 ? xChipPin : mez(xPin, xChipPin, (1210 - py) / 125);
      k.brillo(g, px, py, 46, calorPista > 0.35 ? "255, 110, 40" : "56, 189, 248", 0.85);
    }
  }

  // 3. Zócalo metálico inferior con los 12 pines dorados USB-C
  redondo(g, 250, 1340, 580, 155, 22);
  k.metal(g, 250, 830, ["#475569", "#cbd5e1", "#64748b", "#e2e8f0", "#334155"]);

  redondo(g, 272, 1356, 536, 122, 16);
  g.fillStyle = "#0b0f17";
  g.fill();

  for (let i = -5; i <= 6; i++) {
    const idx = i - 0.5;
    const xPin = 540 + idx * 44;
    const esCentral = Math.abs(idx) <= 2.6;
    const carbon = esCentral ? uPines : 0;

    redondo(g, xPin - 14, 1368, 28, 96, 7);
    const cPin = carbon > 0.55
      ? mezColor("#ea580c", "#1c1917", (carbon - 0.55) / 0.45)
      : mezColor("#facc15", "#ff5722", carbon / 0.55);
    g.fillStyle = cPin;
    g.fill();

    // Hollín oscuro alrededor de los pines quemados
    if (carbon > 0.4) {
      g.fillStyle = `rgba(15, 10, 8, ${(carbon - 0.4) * 0.85})`;
      g.beginPath();
      g.arc(xPin, 1416, 24, 0, Math.PI * 2);
      g.fill();
    }
  }

  // Etiqueta del puerto
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 24px Figtree";
  g.fillStyle = uPines > 0.4 ? "#fda4af" : "#94a3b8";
  g.fillText(uPines > 0.4 ? "PINES CENTRALES CARBONIZADOS" : "PINES DEL PUERTO USB-C", 540, 1524);

  // Chispas entre los pines en «calienta los pines»
  if (uPines > 0.15) {
    dibujarChispas(g, 540, 1405, tr, uPines * (1 - uChip * 0.35), 71, "255, 115, 35");
  }

  // 4. CHIP DE CARGA INTERIOR (PMIC) en el centro superior de la placa
  const chipW = 330;
  const chipH = 210;
  const chipX = 540 - chipW / 2;
  const chipY = yChipCenter - chipH / 2;

  // Patitas laterales QFN del chip
  g.fillStyle = uChip > 0.5 ? "#fb923c" : "#cbd5e1";
  for (let p = 0; p < 7; p++) {
    const py = chipY + 26 + p * 26;
    g.fillRect(chipX - 16, py, 16, 11);
    g.fillRect(chipX + chipW, py, 16, 11);
  }

  if (uChip > 0.05) {
    k.brillo(g, 540, yChipCenter, 380, "255, 72, 32", uChip * (0.7 + 0.25 * Math.sin(tr * 18)));
  }

  redondo(g, chipX, chipY, chipW, chipH, 22);
  g.fillStyle = mezColor("#162032", "#3b0d0c", uChip);
  g.fill();
  g.strokeStyle = mezColor("#38bdf8", "#ff4757", uChip);
  g.lineWidth = 4.5;
  g.stroke();

  g.fillStyle = uChip > 0.45 ? "#fecaca" : "#e2e8f0";
  g.font = "800 30px Figtree";
  g.fillText("CHIP DE CARGA", 540, yChipCenter - 22);
  g.font = "700 23px Figtree";
  g.fillStyle = uChip > 0.45 ? "#ff6b6b" : "#38bdf8";
  g.fillText(uChip > 0.45 ? "QUEMADO · CORTOCIRCUITO" : "REGULADOR PMIC · 5 V", 540, yChipCenter + 22);

  // Grieta incandescente + penacho de humo + chispas sobre el chip en «quema»
  if (uChip > 0.2) {
    g.save();
    g.strokeStyle = `rgba(255, 210, 140, ${uChip})`;
    g.lineWidth = 5;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(475, chipY + 22);
    g.lineTo(525, yChipCenter - 8);
    g.lineTo(508, yChipCenter + 24);
    g.lineTo(585, chipY + chipH - 20);
    g.stroke();

    // Columnas de humo suaves subiendo del chip quemado
    for (let h = 0; h < 4; h++) {
      const fh = ((tr * 0.75 + h * 0.25) % 1 + 1) % 1;
      const hx = 510 + Math.sin(tr * 3 + h * 2) * 34 + h * 18;
      const hy = chipY - fh * 150;
      const hr = 22 + fh * 44;
      g.fillStyle = `rgba(148, 163, 184, ${(1 - fh) * 0.34 * uChip})`;
      g.beginPath();
      g.arc(hx, hy, hr, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();

    dibujarChispas(g, 540, yChipCenter, tr + 0.3, uChip, 89, "255, 85, 35");
  }

  g.restore();
  g.restore();

  sinVista(g);
  const alPil1 = entra(tramo(tr, tCalienta - 0.08, tCalienta + 0.2)) * (1 - suave(tramo(tr, tQuema - 0.32, tQuema - 0.08)));
  pildoraEstado(g, 540, 1705, "SOBRECARGA EN LOS PINES DEL PUERTO", "255, 140, 48", alPil1, 38, true);

  const alPil2 = entra(tramo(tr, tQuema - 0.04, tQuema + 0.22));
  pildoraEstado(g, 540, 1705, "CHIP DE CARGA QUEMADO POR DENTRO", "255, 71, 87", alPil2, 40, true);

  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

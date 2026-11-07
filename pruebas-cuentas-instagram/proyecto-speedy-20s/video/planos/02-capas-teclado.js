// Plano 2 (9.56 s – 15.00 s): 3 Capas Isométricas + Comparación "what you see" vs "what you touch" + Avatar @speedy_devv
// Réplica exacta de 06_reel_stripe_f1.png + 09_reel_10M_keyboard_f2.png
import { v } from "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/motor/lib/voz-actual.js";
import {
  PALETA, acabadoSpeedy, dibujarAvatarSpeedy, fondoSpeedy,
  mez, punteroSpeedy, redondo, suave, tramo
} from "../mundo.js";

export const desde = "ademas";
export const entrada = "corte";

const FILA1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const FILA2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const FILA3 = ["Z", "X", "C", "V", "B", "N", "M"];

// Dibuja una placa isométrica 3D estilo Stripe Reel (06_reel_stripe_f1.png)
function placaIsometrica(g, cx, cy, w, h, colorBorde, etiquetaIzq, etiquetaDer, detalle, prog = 1) {
  if (prog <= 0.01) return;
  const u = suave(Math.min(1, prog));
  g.save();
  g.globalAlpha *= u;
  g.translate(cx, cy + (1 - u) * 35);

  const skew = 36;
  // Sombra inferior
  g.fillStyle = "rgba(0, 0, 0, 0.55)";
  g.beginPath();
  g.moveTo(-w / 2 + skew, -h / 2 + 14);
  g.lineTo(w / 2 + skew, -h / 2 + 14);
  g.lineTo(w / 2 - skew, h / 2 + 14);
  g.lineTo(-w / 2 - skew, h / 2 + 14);
  g.closePath();
  g.fill();

  // Grosor 3D del borde inferior de la placa
  g.fillStyle = "#1E2636";
  g.beginPath();
  g.moveTo(-w / 2 - skew, h / 2);
  g.lineTo(w / 2 - skew, h / 2);
  g.lineTo(w / 2 + skew, -h / 2);
  g.lineTo(w / 2 + skew, -h / 2 + 9);
  g.lineTo(w / 2 - skew, h / 2 + 9);
  g.lineTo(-w / 2 - skew, h / 2 + 9);
  g.closePath();
  g.fill();

  // Superficie de la placa isométrica
  const pg = g.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  pg.addColorStop(0, "rgba(22, 29, 44, 0.95)");
  pg.addColorStop(1, "rgba(11, 15, 24, 0.95)");
  g.fillStyle = pg;
  g.strokeStyle = colorBorde;
  g.lineWidth = 2.8;
  g.beginPath();
  g.moveTo(-w / 2 + skew, -h / 2);
  g.lineTo(w / 2 + skew, -h / 2);
  g.lineTo(w / 2 - skew, h / 2);
  g.lineTo(-w / 2 - skew, h / 2);
  g.closePath();
  g.fill();
  g.stroke();

  // Contenido interno de la capa
  g.font = `700 20px "${PALETA.mono}"`;
  g.fillStyle = colorBorde;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(detalle, 0, 0);

  // Conector ortogonal izquierdo o derecho estilo Stripe
  if (etiquetaIzq) {
    g.strokeStyle = "rgba(255,255,255,0.75)";
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(-w / 2 - 12, 0); g.lineTo(-w / 2 - 58, 0); g.stroke();
    g.fillStyle = "#FFFFFF";
    g.beginPath(); g.arc(-w / 2 - 12, 0, 4, 0, Math.PI * 2); g.fill();
    g.font = `700 24px "${PALETA.sans}"`;
    g.textAlign = "right";
    g.fillText(etiquetaIzq, -w / 2 - 68, 0);
  }
  if (etiquetaDer) {
    g.strokeStyle = "rgba(255,255,255,0.75)";
    g.lineWidth = 2;
    g.beginPath(); g.moveTo(w / 2 + 12, 0); g.lineTo(w / 2 + 58, 0); g.stroke();
    g.fillStyle = "#FFFFFF";
    g.beginPath(); g.arc(w / 2 + 12, 0, 4, 0, Math.PI * 2); g.fill();
    g.font = `700 24px "${PALETA.sans}"`;
    g.textAlign = "left";
    g.fillText(etiquetaDer, w / 2 + 68, 0);
  }

  g.restore();
}

export function dibuja(g, t) {
  const tTres = v.t("tres");             // 10.40 s
  const tCapas = v.t("capas");           // 10.64 s
  const tInvisibles = v.t("invisibles"); // 11.04 s
  const tAgrandan = v.t("agrandan");     // 11.68 s
  const tSecreto = v.t("secreto");       // 12.40 s
  const tLetra = v.t("letra");           // 13.52 s

  const uExpande = suave(tramo(t, tAgrandan - 0.15, tSecreto + 0.55));
  const pulsoLetra = 0.5 + 0.5 * Math.sin((t - tLetra) * 6);

  fondoSpeedy(g, t, {
    luzColor: PALETA.ambarRgb,
    luzY: 1120,
    luzFuerza: 0.12 + 0.10 * uExpande,
  });

  // =========================================================================
  // 1. PILA ISOMÉTRICA DE 3 CAPAS (Arriba, y = 555..745, estilo Stripe Reel)
  // =========================================================================
  const uC1 = suave(tramo(t, 9.56, tTres + 0.15));
  const uC2 = suave(tramo(t, tTres - 0.05, tCapas + 0.20));
  const uC3 = suave(tramo(t, tCapas + 0.05, tInvisibles + 0.25));

  // Haces verticales conectando las 3 capas isométricas
  if (uC2 > 0.1) {
    g.save();
    g.strokeStyle = `rgba(245, 184, 61, ${0.45 * uC2})`;
    g.lineWidth = 2;
    g.setLineDash([6, 6]);
    for (const dx of [-110, 0, 110]) {
      g.beginPath(); g.moveTo(540 + dx, 555); g.lineTo(540 + dx, 715); g.stroke();
    }
    g.setLineDash([]);
    g.restore();
  }

  placaIsometrica(g, 540, 705, 340, 48, "#F5B83D", "", "3. Hitbox Resizer", "SCALE [A] × 2.45", uC3);
  placaIsometrica(g, 540, 630, 340, 48, "#2F7CF6", "2. Neural Engine", "", 'P("A" | "HOL") = 88%', uC2);
  placaIsometrica(g, 540, 555, 340, 48, "#22E39B", "", "1. Touch Grid", "SCAN 120 Hz · ΔC", uC1);

  // =========================================================================
  // 2. TECLADO SUPERIOR: "what you see" (Teclado iOS uniforme en 3D)
  // =========================================================================
  const yTopKb = 805;
  const wKb = 770, hKb = 258, xKb = (1080 - wKb) / 2;

  g.save();
  // Carcasa del teclado superior
  redondo(g, xKb, yTopKb, wKb, hKb, 24);
  const kg1 = g.createLinearGradient(0, yTopKb, 0, yTopKb + hKb);
  kg1.addColorStop(0, "#24272E");
  kg1.addColorStop(1, "#16181D");
  g.fillStyle = kg1;
  g.fill();
  g.strokeStyle = "rgba(255, 255, 255, 0.22)";
  g.lineWidth = 2;
  g.stroke();

  // Barra iMessage encima del teclado superior
  redondo(g, xKb + 54, yTopKb + 14, wKb - 72, 34, 17);
  g.fillStyle = "#101216";
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.14)";
  g.lineWidth = 1.5;
  g.stroke();

  // Botón '+' a la izquierda de iMessage
  g.fillStyle = "#2C303A";
  g.beginPath(); g.arc(xKb + 28, yTopKb + 31, 15, 0, Math.PI * 2); g.fill();
  g.fillStyle = "#FFFFFF";
  g.font = `700 20px "${PALETA.sans}"`;
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText("+", xKb + 28, yTopKb + 31);

  // Texto escribiéndose en iMessage: "Hol|"
  g.font = `600 19px "${PALETA.sans}"`;
  g.fillStyle = "#FFFFFF";
  g.textAlign = "left";
  g.fillText("Hol", xKb + 74, yTopKb + 32);
  // Cursor azul de iOS
  g.fillStyle = "#2F7CF6";
  g.fillRect(xKb + 108, yTopKb + 20, 2.5, 22);

  // Barra predictiva ("Hola" | "Hoy" | "Hora")
  g.font = `600 18px "${PALETA.sans}"`;
  g.textAlign = "center";
  g.fillStyle = "#FFFFFF";
  g.fillText('"Hola"', xKb + wKb * 0.22, yTopKb + 66);
  g.fillStyle = "rgba(255,255,255,0.65)";
  g.fillText("Hoy", xKb + wKb * 0.50, yTopKb + 66);
  g.fillText("Hora", xKb + wKb * 0.78, yTopKb + 66);

  // Teclas uniformes de "what you see"
  const dibujarFilaUniforme = (letras, yFila, margenX) => {
    const paso = (wKb - margenX * 2) / letras.length;
    const wTecla = paso - 8;
    const hTecla = 46;
    letras.forEach((L, i) => {
      const tx = xKb + margenX + i * paso + 4;
      redondo(g, tx, yFila, wTecla, hTecla, 8);
      g.fillStyle = "#4A4E58";
      g.fill();
      g.strokeStyle = "rgba(255,255,255,0.15)";
      g.lineWidth = 1;
      g.stroke();

      g.font = `700 22px "${PALETA.sans}"`;
      g.fillStyle = "#FFFFFF";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(L, tx + wTecla / 2, yFila + hTecla / 2 + 1);
    });
  };

  dibujarFilaUniforme(FILA1, yTopKb + 84, 16);
  dibujarFilaUniforme(FILA2, yTopKb + 138, 48);
  dibujarFilaUniforme(FILA3, yTopKb + 192, 118);
  g.restore();

  // Etiqueta "what you see" con línea ortogonal exacta a 09_reel_10M_keyboard_f2.png
  g.save();
  g.font = `800 32px "${PALETA.sans}"`;
  g.fillStyle = "#FFFFFF";
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.fillText("what you see", xKb + 6, yTopKb + hKb + 34);
  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 2.2;
  g.beginPath();
  g.moveTo(xKb + 225, yTopKb + hKb + 34);
  g.lineTo(540, yTopKb + hKb + 34);
  g.lineTo(540, yTopKb + hKb + 6);
  g.stroke();
  g.fillStyle = "#FFFFFF";
  g.beginPath(); g.arc(540, yTopKb + hKb + 6, 4.5, 0, Math.PI * 2); g.fill();
  g.restore();

  // =========================================================================
  // 3. TECLADO INFERIOR: "what you touch" (Zonas invisibles ámbar #F5B83D)
  // =========================================================================
  const yBotKb = 1132;
  const hBotKb = 258;

  g.save();
  redondo(g, xKb, yBotKb, wKb, hBotKb, 24);
  const kg2 = g.createLinearGradient(0, yBotKb, 0, yBotKb + hBotKb);
  kg2.addColorStop(0, "#1D1A14");
  kg2.addColorStop(1, "#12100C");
  g.fillStyle = kg2;
  g.fill();
  g.strokeStyle = "rgba(245, 184, 61, 0.38)";
  g.lineWidth = 2.5;
  g.stroke();

  // Pesos dinámicos de anchura para cada fila cuando uExpande -> 1 (tras escribir "Hol", la 'A' y 'O' crecen enorme)
  const pesosF1 = FILA1.map((L) => {
    if (L === "O") return mez(1, 2.15, uExpande);
    if (L === "I" || L === "P") return mez(1, 0.62, uExpande);
    if (L === "E") return mez(1, 1.45, uExpande);
    if (L === "Q" || L === "W") return mez(1, 0.72, uExpande);
    return 1;
  });
  const pesosF2 = FILA2.map((L) => {
    if (L === "A") return mez(1, 2.55 + 0.12 * pulsoLetra * uExpande, uExpande);
    if (L === "S" || L === "D") return mez(1, 0.56, uExpande);
    if (L === "F" || L === "G") return mez(1, 0.78, uExpande);
    return 0.92;
  });
  const pesosF3 = FILA3.map((L) => {
    if (L === "Z" || L === "X") return mez(1, 0.68, uExpande);
    return 1.05;
  });

  const dibujarFilaAmbar = (letras, pesos, yFila, hFila, margenX, letraDestacada = "") => {
    const suma = pesos.reduce((a, b) => a + b, 0);
    const anchoTotal = wKb - margenX * 2;
    let cursorX = xKb + margenX;

    letras.forEach((L, i) => {
      const wCelda = (pesos[i] / suma) * anchoTotal;
      const pad = 3;
      const rx = cursorX + pad;
      const rw = wCelda - pad * 2;
      const esDestacada = L === letraDestacada && uExpande > 0.15;

      // Expansión vertical extra para la tecla protagonista ('A')
      const extraY = esDestacada ? 12 * uExpande : 0;
      const ry = yFila - extraY / 2;
      const rh = hFila + extraY;

      g.save();
      const ag = g.createLinearGradient(rx, ry, rx, ry + rh);
      if (esDestacada) {
        ag.addColorStop(0, "#FFE484");
        ag.addColorStop(1, "#F5B83D");
        g.shadowColor = "rgba(255, 212, 92, 0.85)";
        g.shadowBlur = 24 * uExpande;
      } else {
        ag.addColorStop(0, "#E5AC42");
        ag.addColorStop(1, "#B88224");
      }
      g.fillStyle = ag;
      redondo(g, rx, ry, rw, rh, 8);
      g.fill();

      g.strokeStyle = esDestacada ? "#FFFFFF" : "rgba(255, 236, 175, 0.55)";
      g.lineWidth = esDestacada ? 3 : 1.5;
      g.stroke();
      g.shadowBlur = 0;

      g.font = `${esDestacada ? 800 : 700} ${esDestacada ? Math.round(22 + 10 * uExpande) : 20}px "${PALETA.sans}"`;
      g.fillStyle = "#181206";
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(L, rx + rw / 2, ry + rh / 2 + 1);
      g.restore();

      cursorX += wCelda;
    });
  };

  dibujarFilaAmbar(FILA1, pesosF1, yBotKb + 22, 64, 18, "O");
  dibujarFilaAmbar(FILA2, pesosF2, yBotKb + 94, 70, 32, "A");
  dibujarFilaAmbar(FILA3, pesosF3, yBotKb + 172, 64, 96, "");
  g.restore();

  // Etiqueta inferior "what you touch" + "Zones drawn visible..." (idéntica a 09_reel_10M_keyboard_f2.png)
  g.save();
  const yLblTouch = yBotKb + hBotKb + 42;
  g.font = `800 32px "${PALETA.sans}"`;
  g.fillStyle = "#FFFFFF";
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.fillText("what you touch", xKb + 6, yLblTouch);

  g.strokeStyle = "rgba(255,255,255,0.8)";
  g.lineWidth = 2.2;
  g.beginPath();
  g.moveTo(xKb + 258, yLblTouch);
  g.lineTo(540, yLblTouch);
  g.lineTo(540, yBotKb + hBotKb + 8);
  g.stroke();
  g.fillStyle = "#FFFFFF";
  g.beginPath(); g.arc(540, yBotKb + hBotKb + 8, 4.5, 0, Math.PI * 2); g.fill();

  g.font = `500 23px "${PALETA.sans}"`;
  g.fillStyle = "rgba(255, 255, 255, 0.58)";
  g.fillText("Zones drawn visible.", xKb + 6, yLblTouch + 42);
  g.fillText("On a real iPhone they are invisible.", xKb + 6, yLblTouch + 70);
  g.restore();

  // =========================================================================
  // 4. PERSONAJE / AVATAR DE @speedy_devv MIRANDO ARRIBA (Abajo a la derecha)
  // =========================================================================
  const uAvatar = suave(tramo(t, 9.60, 10.25));
  dibujarAvatarSpeedy(
    g,
    735,
    1810 + (1 - uAvatar) * 180,
    1.18,
    t,
    {
      miraArriba: 0.72,
      habla: t < 14.8 ? 0.8 : 0,
      mano: uExpande,
    }
  );

  acabadoSpeedy(g, { notaIzq: "", notaDer: "" });
}

// Plano 1 (0.00 s – 9.56 s): Corte transversal capacitivo + Rayos X de iones Na+/Cl- (Réplica exacta Reel 18.2M @speedy_devv)
import { v } from "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/motor/lib/voz-actual.js";
import {
  PALETA, acabadoSpeedy, azar, de, entra, fondoSpeedy,
  k, mez, pulso, punteroSpeedy, redondo, suave, tramo
} from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const ELECTRODOS = [105, 279, 453, 627, 801, 975];

// Posiciones de los iones Na+ y Cl- dentro del dedo (como en la miniatura de 18.2M de @speedy_devv)
const IONES = [
  { dx: -95, dy: -420, tipo: "Na+", fase: 0.2 },
  { dx: -15, dy: -460, tipo: "Cl-", fase: 1.1 },
  { dx: -110, dy: -330, tipo: "Na+", fase: 2.0 },
  { dx: -30, dy: -360, tipo: "Na+", fase: 3.1 },
  { dx: 45, dy: -380, tipo: "Cl-", fase: 0.7 },
  { dx: -85, dy: -245, tipo: "Cl-", fase: 1.8 },
  { dx: -5, dy: -265, tipo: "Na+", fase: 2.5 },
  { dx: 65, dy: -285, tipo: "Na+", fase: 4.0 },
  { dx: -55, dy: -165, tipo: "Na+", fase: 0.9 },
  { dx: 20, dy: -185, tipo: "Cl-", fase: 3.6 },
  { dx: 82, dy: -195, tipo: "Na+", fase: 1.4 },
  { dx: -25, dy: -95, tipo: "Na+", fase: 2.9 },
  { dx: 45, dy: -105, tipo: "Cl-", fase: 5.1 },
  { dx: 8, dy: -35, tipo: "Na+", fase: 0.4 },
];

export function dibuja(g, t) {
  const tToca = v.t("toca");             // 0.80 s
  const tPresionando = v.t("presionando"); // 2.48 s
  const tBoton = v.t("boton");           // 3.44 s
  const tPiel = v.t("piel");             // 4.56 s
  const tRoba = v.t("roba");             // 4.88 s
  const tElectrica = v.t("electrica");   // 6.28 s
  const tMarcar = v.t("marcar");         // 7.68 s
  const tExacto = v.t("exacto");         // 8.72 s

  // Contacto del dedo con el cristal
  const uContacto = suave(tramo(t, 0.0, tToca + 0.08));
  const contacto = suave(tramo(t, tToca - 0.05, tToca + 0.25));
  // Modo Rayos X iónico (Na+ / Cl-) en la frase 2
  const uRayosX = suave(tramo(t, tPiel - 0.12, tRoba + 0.35));
  const uCarga = suave(tramo(t, tRoba - 0.1, tElectrica + 0.35));
  const uPunto = suave(tramo(t, tMarcar - 0.08, tExacto + 0.15));

  fondoSpeedy(g, t, {
    luzColor: PALETA.ambarRgb,
    luzY: 1240,
    luzFuerza: 0.14 + 0.12 * uCarga,
  });

  const yCristal = 1265;
  const yElectrodos = 1462;

  // =========================================================================
  // 1. EL DEDO 3D / CORTE IÓNICO Na+ Cl- (Réplica exacta de @speedy_devv)
  // =========================================================================
  const fx = mez(420, 535, uContacto);
  const fy = mez(1055, yCristal - 4, uContacto);

  g.save();
  g.translate(fx, fy);
  g.rotate(-0.44); // ~ -25 grados, entrando desde arriba a la izquierda

  // Sombra exterior/halo del dedo al conducir electricidad
  if (uCarga > 0.01) {
    const hg = g.createRadialGradient(0, -140, 40, 0, -140, 340);
    hg.addColorStop(0, `rgba(${PALETA.ambarRgb}, ${0.28 * uCarga})`);
    hg.addColorStop(1, "rgba(245, 184, 61, 0)");
    g.fillStyle = hg;
    g.beginPath(); g.arc(0, -140, 340, 0, Math.PI * 2); g.fill();
  }

  // Camino de la silueta del dedo (extendido fuera de pantalla arriba-izquierda como en 03_reel_18M_f1.png)
  const trazarDedo = () => {
    g.beginPath();
    g.moveTo(-152, -1450);
    g.lineTo(-142, -110);
    g.bezierCurveTo(-142, 35, 142, 35, 142, -110);
    g.lineTo(152, -1450);
    g.closePath();
  };

  g.save();
  trazarDedo();
  g.clip();

  // Relleno 3D de piel realista (como en 03_reel_18M_f1.png)
  const pg = g.createLinearGradient(-148, 0, 148, 0);
  pg.addColorStop(0, "#8B6350");
  pg.addColorStop(0.22, "#C89D84");
  pg.addColorStop(0.58, "#E8C3AC");
  pg.addColorStop(0.85, "#D5AA90");
  pg.addColorStop(1, "#9E725C");
  g.fillStyle = pg;
  g.fillRect(-165, -1450, 330, 1510);

  // Sombra longitudinal suave
  const sg = g.createLinearGradient(0, -600, 0, 20);
  sg.addColorStop(0, "rgba(15, 10, 8, 0.55)");
  sg.addColorStop(0.35, "rgba(15, 10, 8, 0)");
  sg.addColorStop(1, "rgba(255, 220, 195, 0.18)");
  g.fillStyle = sg;
  g.fillRect(-165, -1450, 330, 1510);

  // Surcos de huella dactilar finos en la yema (03_reel_18M_f1.png)
  g.strokeStyle = `rgba(120, 82, 64, ${0.34 * (1 - 0.6 * uRayosX)})`;
  g.lineWidth = 2.2;
  for (let r = 1; r <= 14; r++) {
    g.beginPath();
    g.ellipse(0, -95 + r * 4, 138 - r * 5, 92 - r * 3, 0, 0.08 * Math.PI, 0.92 * Math.PI);
    g.stroke();
  }

  // Uña translúcida en el borde derecho del dedo
  g.fillStyle = `rgba(255, 240, 232, ${0.38 * (1 - 0.5 * uRayosX)})`;
  g.strokeStyle = `rgba(255, 255, 255, ${0.65 * (1 - 0.4 * uRayosX)})`;
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(118, -310);
  g.quadraticCurveTo(146, -200, 134, -85);
  g.quadraticCurveTo(102, -120, 106, -280);
  g.closePath();
  g.fill();
  g.stroke();

  // --- CAPA DE RAYOS X IÓNICA (Na+ / Cl- como en 02_reels_speedy_devv.png panel 3) ---
  if (uRayosX > 0.01) {
    g.save();
    g.globalAlpha = uRayosX;

    // Interior oscuro translúcido con borde de piel iluminado
    const xg = g.createLinearGradient(-130, 0, 130, 0);
    xg.addColorStop(0, "rgba(210, 175, 150, 0.85)");
    xg.addColorStop(0.12, "rgba(28, 34, 46, 0.92)");
    xg.addColorStop(0.5, "rgba(42, 48, 62, 0.88)");
    xg.addColorStop(0.88, "rgba(28, 34, 46, 0.92)");
    xg.addColorStop(1, "rgba(210, 175, 150, 0.85)");
    g.fillStyle = xg;
    g.fillRect(-165, -1450, 330, 1500);

    // Filamentos dorados conduciendo electricidad desde la punta hacia los iones
    g.strokeStyle = `rgba(255, 212, 96, ${0.45 + 0.35 * uCarga})`;
    g.lineWidth = 3;
    g.shadowColor = PALETA.ambarClaro;
    g.shadowBlur = 14;
    for (let c = -2; c <= 2; c++) {
      g.beginPath();
      g.moveTo(c * 24, 0);
      for (let y = 0; y >= -520; y -= 40) {
        const ond = Math.sin(y * 0.025 + t * 5 + c) * 18;
        g.lineTo(c * 32 + ond, y);
      }
      g.stroke();
    }
    g.shadowBlur = 0;

    // Esferas de iones Na+ (ámbar) y Cl- (azul acero)
    for (const ion of IONES) {
      const ox = ion.dx + Math.sin(t * 3.2 + ion.fase) * 6;
      const oy = ion.dy + Math.cos(t * 2.8 + ion.fase) * 6 + uCarga * 14;
      const esNa = ion.tipo === "Na+";
      const radIon = 26;

      // Halo del ion
      const ig = g.createRadialGradient(ox, oy, 2, ox, oy, radIon * 1.9);
      if (esNa) {
        ig.addColorStop(0, "rgba(255, 225, 120, 0.95)");
        ig.addColorStop(0.45, "rgba(245, 184, 61, 0.55)");
        ig.addColorStop(1, "rgba(245, 184, 61, 0)");
      } else {
        ig.addColorStop(0, "rgba(130, 185, 255, 0.9)");
        ig.addColorStop(0.45, "rgba(72, 135, 220, 0.48)");
        ig.addColorStop(1, "rgba(72, 135, 220, 0)");
      }
      g.fillStyle = ig;
      g.beginPath(); g.arc(ox, oy, radIon * 1.9, 0, Math.PI * 2); g.fill();

      // Núcleo del ion
      g.fillStyle = esNa ? "rgba(65, 52, 22, 0.85)" : "rgba(28, 44, 72, 0.85)";
      g.strokeStyle = esNa ? "#FFE07D" : "#8AB8FF";
      g.lineWidth = 2.5;
      g.beginPath(); g.arc(ox, oy, radIon, 0, Math.PI * 2); g.fill(); g.stroke();

      // Texto Na+ o Cl-
      g.fillStyle = "#FFFFFF";
      g.font = `700 19px "${PALETA.sans}"`;
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.fillText(ion.tipo, ox, oy + 1);
    }
    g.restore();
  }

  g.restore(); // fin clip dedo

  // Contorno luminoso de la silueta del dedo
  trazarDedo();
  g.strokeStyle = "rgba(255, 240, 228, 0.52)";
  g.lineWidth = 3.5;
  g.stroke();

  g.restore(); // fin transform dedo

  // =========================================================================
  // 2. CORTE TRANSVERSAL DE LA PANTALLA (Cristal + Arcos ITO + RGB + Lecturas)
  // =========================================================================
  // Fondo de la cámara capacitiva (yCristal a yElectrodos)
  const cg = g.createLinearGradient(0, yCristal, 0, yElectrodos + 30);
  cg.addColorStop(0, "rgba(38, 46, 62, 0.72)");
  cg.addColorStop(0.5, "rgba(20, 25, 36, 0.88)");
  cg.addColorStop(1, "rgba(12, 16, 24, 0.96)");
  g.fillStyle = cg;
  g.fillRect(0, yCristal, 1080, yElectrodos - yCristal + 30);

  // Arcos de campo eléctrico dorados entre electrodos (y deformándose hacia el dedo al tocar)
  g.save();
  for (let i = 0; i < ELECTRODOS.length - 1; i++) {
    const xA = ELECTRODOS[i];
    const xB = ELECTRODOS[i + 1];
    const xMid = (xA + xB) / 2;
    const distDedo = Math.abs(xMid - 540);
    const influDedo = contacto * Math.max(0, 1 - distDedo / 290);

    for (let nivel = 1; nivel <= 5; nivel++) {
      const frac = nivel / 5;
      const dx = (xB - xA) * 0.46 * (0.35 + 0.65 * frac);
      const x0 = xA + dx * 0.15;
      const x1 = xB - dx * 0.15;
      const hBase = 48 + nivel * 27;

      // Si el dedo está encima y roba carga, los arcos centrales se estiran hacia el dedo (yCristal)
      const hRobada = hBase + influDedo * (42 + uCarga * 55) * frac;
      const cxArco = mez(xMid, 540, influDedo * 0.48);
      const cyArco = yElectrodos - hRobada * 1.45;

      const alArco = (0.28 + 0.45 * (1 - frac * 0.5)) * (1 + influDedo * 0.45);
      g.strokeStyle = `rgba(255, 212, 92, ${Math.min(0.95, alArco)})`;
      g.lineWidth = 2.2 + influDedo * 1.2;
      g.shadowColor = "rgba(255, 200, 70, 0.75)";
      g.shadowBlur = influDedo > 0.1 ? 14 : 6;

      g.beginPath();
      g.moveTo(x0, yElectrodos - 4);
      g.quadraticCurveTo(cxArco, cyArco, x1, yElectrodos - 4);
      g.stroke();
    }
  }

  // Arcos laterales en los bordes izquierdo y derecho
  for (const [xBorde, dir] of [[ELECTRODOS[0], -1], [ELECTRODOS[5], 1]]) {
    for (let nivel = 1; nivel <= 4; nivel++) {
      const hBase = 50 + nivel * 26;
      g.strokeStyle = "rgba(255, 212, 92, 0.35)";
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(xBorde, yElectrodos - 4);
      g.quadraticCurveTo(xBorde + dir * 70, yElectrodos - hBase * 1.35, xBorde + dir * 130, yElectrodos - 4);
      g.stroke();
    }
  }
  g.restore();

  // Partículas de carga eléctrica subiendo del cristal al dedo cuando roba carga
  if (contacto > 0.1) {
    g.save();
    const nPart = 14;
    for (let p = 0; p < nPart; p++) {
      const prog = ((t * (1.2 + uCarga * 1.4) + p / nPart) % 1);
      const xOrig = 453 + (p % 2 === 0 ? -1 : 1) * (20 + (p * 17) % 85);
      const px = mez(xOrig, 538 + Math.sin(p * 2.1) * 32, prog);
      const py = mez(yElectrodos - 8, yCristal - 28 - uRayosX * 90, prog);
      const alP = Math.sin(prog * Math.PI) * (0.45 + 0.55 * uCarga);

      g.fillStyle = `rgba(255, 224, 115, ${alP})`;
      g.shadowColor = "#FFD460";
      g.shadowBlur = 12;
      g.beginPath();
      g.arc(px, py, 3.5 + uCarga * 2, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }

  // Electrodos ITO (pastillas blancas brillantes en yElectrodos)
  for (let i = 0; i < ELECTRODOS.length; i++) {
    const ex = ELECTRODOS[i];
    const activo = (i === 2 || i === 3) && contacto > 0.2;
    g.save();
    g.fillStyle = activo ? "#FFE38E" : "#E8EEF8";
    g.shadowColor = activo ? "#FFD25A" : "rgba(255,255,255,0.7)";
    g.shadowBlur = activo ? 20 : 10;
    redondo(g, ex - 22, yElectrodos - 8, 44, 14, 7);
    g.fill();
    g.restore();
  }

  // Capa superior de cristal templado (línea brillante en yCristal)
  const lgCristal = g.createLinearGradient(0, yCristal - 4, 0, yCristal + 18);
  lgCristal.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  lgCristal.addColorStop(0.25, "rgba(200, 225, 255, 0.35)");
  lgCristal.addColorStop(1, "rgba(200, 225, 255, 0.04)");
  g.fillStyle = lgCristal;
  g.fillRect(0, yCristal, 1080, 18);

  // Destello de contacto en el punto exacto donde toca el dedo
  if (contacto > 0.01) {
    const rg = g.createRadialGradient(540, yCristal + 2, 4, 540, yCristal + 2, 150);
    rg.addColorStop(0, `rgba(255, 235, 165, ${0.85 * contacto})`);
    rg.addColorStop(0.45, `rgba(245, 184, 61, ${0.35 * contacto})`);
    rg.addColorStop(1, "rgba(245, 184, 61, 0)");
    g.save();
    g.globalCompositeOperation = "lighter";
    g.fillStyle = rg;
    g.fillRect(380, yCristal - 60, 320, 120);
    g.restore();
  }

  // =========================================================================
  // 3. TIRA DE SUBPÍXELES OLED RGB (idéntica a 03_reel_18M_f1.png)
  // =========================================================================
  const yRgb = 1508;
  g.fillStyle = "#080B10";
  g.fillRect(0, yElectrodos + 18, 1080, 96);
  g.strokeStyle = "rgba(255,255,255,0.18)";
  g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, yElectrodos + 18); g.lineTo(1080, yElectrodos + 18); g.stroke();
  g.beginPath(); g.moveTo(0, yRgb + 56); g.lineTo(1080, yRgb + 56); g.stroke();

  const coloresRgb = [
    ["#FF3B30", "rgba(255, 59, 48, 0.65)"],
    ["#22E39B", "rgba(34, 227, 155, 0.65)"],
    ["#2F7CF6", "rgba(47, 124, 246, 0.65)"],
  ];
  g.save();
  for (let x = 14, idx = 0; x < 1068; x += 28, idx++) {
    const [hex, sombra] = coloresRgb[idx % 3];
    g.fillStyle = hex;
    g.shadowColor = sombra;
    g.shadowBlur = 10;
    redondo(g, x, yRgb, 18, 36, 6);
    g.fill();
  }
  g.restore();

  // =========================================================================
  // 4. FILA DE LECTURAS CAPACITIVAS EN VIVO (100  100  64  58  100  100)
  // =========================================================================
  const yNumeros = 1636;
  g.fillStyle = "#05070B";
  g.fillRect(0, yRgb + 56, 1080, 360);

  const caidaBase = contacto * 12 + uCarga * 28; // Hasta -40% en los electrodos centrales
  const caidas = [0, 0.22, 0.95, 1.05, 0.20, 0];

  for (let i = 0; i < ELECTRODOS.length; i++) {
    const ex = ELECTRODOS[i];
    const valor = Math.round(100 - caidaBase * caidas[i]);
    const esCentral = (i === 2 || i === 3) && contacto > 0.25;

    g.save();
    if (esCentral && uCarga > 0.15) {
      // Recuadro de resaltado técnico en los sensores que detectan el robo de carga
      redondo(g, ex - 64, yNumeros - 42, 128, 72, 14);
      g.fillStyle = `rgba(245, 184, 61, ${0.18 * uCarga})`;
      g.fill();
      g.strokeStyle = `rgba(255, 212, 92, ${0.75 * uCarga})`;
      g.lineWidth = 2.5;
      g.stroke();
    }

    g.font = `700 48px "${PALETA.mono}"`;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillStyle = esCentral ? (uCarga > 0.1 ? "#FFD460" : "#FFFFFF") : "rgba(255, 255, 255, 0.78)";
    if (esCentral) {
      g.shadowColor = "rgba(245, 184, 61, 0.65)";
      g.shadowBlur = 16;
    }
    g.fillText(String(valor), ex, yNumeros - 4);

    // Pequeña barra de nivel debajo de cada número
    const wBarra = 84;
    redondo(g, ex - wBarra / 2, yNumeros + 42, wBarra, 8, 4);
    g.fillStyle = "rgba(255,255,255,0.12)";
    g.fill();

    redondo(g, ex - wBarra / 2, yNumeros + 42, wBarra * (valor / 100), 8, 4);
    g.fillStyle = esCentral && uCarga > 0.1 ? "#F5B83D" : "#38BDF8";
    g.fill();
    g.restore();
  }

  // =========================================================================
  // 5. ANOTACIONES Y PUNTEROS ORTOGONALES DE @speedy_devv
  // =========================================================================
  // A) En Frase 1 ("no estás presionando ningún botón"): indicador de 0.00 mm de hundimiento
  const uNoBoton = suave(tramo(t, tPresionando - 0.15, tPresionando + 0.25)) * (1 - suave(tramo(t, tPiel - 0.2, tPiel + 0.15)));
  if (uNoBoton > 0.01) {
    g.save();
    g.globalAlpha = uNoBoton;
    // Caja punteada roja mostrando que el cristal es rígido (no hay interruptor mecánico)
    redondo(g, 370, yCristal - 56, 340, 52, 12);
    g.fillStyle = "rgba(255, 77, 77, 0.16)";
    g.fill();
    g.setLineDash([8, 6]);
    g.strokeStyle = "#FF4D4D";
    g.lineWidth = 2.5;
    g.stroke();
    g.setLineDash([]);

    g.font = `700 24px "${PALETA.mono}"`;
    g.fillStyle = "#FF8080";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText("✕ NO MECHANICAL BUTTON (0.0 mm)", 540, yCristal - 30);
    g.restore();
  }

  // Punteros ortogonales tipo 10_reel_system_f1.png (CHARGE, WIRES, GLASS) hacia los lados libres
  const pGlass = suave(tramo(t, 0.9, 1.35));
  punteroSpeedy(g, 82, yCristal + 6, 125, 1145, "GLASS", "Rigid tempered layer", pGlass);

  const pWires = suave(tramo(t, 1.5, 1.95));
  punteroSpeedy(g, 975, yElectrodos, 935, 1145, "ITO SENSORS", "Electric field grid", pWires, "auto", "#FFD460");

  // B) En Frase 2 ("marcar el punto exacto"): retícula de coordenada exacta X/Y
  if (uPunto > 0.01) {
    g.save();
    g.globalAlpha = uPunto;
    const rx = 540, ry = yCristal + 4;
    const radRet = 44 + 8 * Math.sin(t * 8);

    g.strokeStyle = "#22E39B";
    g.lineWidth = 3;
    g.shadowColor = "#22E39B";
    g.shadowBlur = 18;
    g.beginPath(); g.arc(rx, ry, radRet, 0, Math.PI * 2); g.stroke();

    // Cruz central
    g.beginPath();
    g.moveTo(rx - radRet - 14, ry); g.lineTo(rx + radRet + 14, ry);
    g.moveTo(rx, ry - radRet - 14); g.lineTo(rx, ry + radRet + 14);
    g.stroke();
    g.shadowBlur = 0;

    // Etiqueta de bloqueo de coordenada
    redondo(g, rx + 62, ry - 96, 330, 74, 14);
    g.fillStyle = "rgba(8, 13, 22, 0.92)";
    g.fill();
    g.strokeStyle = "#22E39B";
    g.lineWidth = 2.5;
    g.stroke();

    g.font = `700 24px "${PALETA.mono}"`;
    g.fillStyle = "#22E39B";
    g.textAlign = "left";
    g.fillText("EXACT TOUCH LOCKED", rx + 82, ry - 64);
    g.font = `500 21px "${PALETA.mono}"`;
    g.fillStyle = "#FFFFFF";
    g.fillText("X: 540.2 px · ΔC: -42%", rx + 82, ry - 36);
    g.restore();
  }

  acabadoSpeedy(g, {
    notaIzq: "Magnified illustration",
    notaDer: uRayosX > 0.2 ? "Ions drawn visible (Na+ / Cl-).\nConductive human tissue." : "",
  });
}

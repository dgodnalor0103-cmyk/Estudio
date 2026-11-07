// Plano 02 (Frase 2):
// «Por fuera los dos cables se ven iguales, pero por dentro uno viene vacío.»
// Mesa técnica clara de alto contraste: dos conectores USB-C grandes lado a lado.
// Primero pasa un haz comparador («iguales»), y en «dentro / vacío» se abren sus carcasas mostrando el microchip vs. el hueco vacío.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarConectorUsbC,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
} from "../mundo.js";

export const desde = (v) => v.frase(2).inicio - 0.04;

const { suave, tramo, entra, mez } = k;

function etiquetaCable(g, x, y, titulo, sub, colFondo, colBorde, colTexto) {
  g.save();
  redondo(g, x - 190, y - 54, 380, 108, 22);
  g.fillStyle = colFondo;
  g.fill();
  g.strokeStyle = colBorde;
  g.lineWidth = 3;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = colTexto;
  g.fillText(titulo, x, y - 16);
  g.font = "700 24px Figtree";
  g.fillStyle = "rgba(226, 232, 240, 0.86)";
  g.fillText(sub, x, y + 24);
  g.restore();
}

export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.inicio - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tIguales = f2.t("iguales");
  const tDentro = f2.t("dentro");
  const tVacio = f2.t("vacío");

  fondoMesaClara(g, tr, "fria");

  const cam = camino2D([
    [t0, [1.0, 540, 960]],
    [tIguales, [1.03, 540, 975]],
    [tVacio + 0.25, [1.12, 600, 1015]],
    [tCorte - 0.18, [1.12, 600, 1015]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uAbre = suave(tramo(tr, tDentro - 0.12, tVacio + 0.15));
  const uEntra = entra(tramo(tr, t0, t0 + 0.3));

  g.save();
  vista(g, Z, cx, cy);

  // Sombra sobre la mesa clara
  for (const px of [305, 775]) {
    g.fillStyle = "rgba(15, 23, 42, 0.14)";
    g.beginPath();
    g.ellipse(px, 1290, 130, 32, 0, 0, Math.PI * 2);
    g.fill();
  }

  // Conector izquierdo: Original con microchip E-Marker
  dibujarConectorUsbC(g, 305, 860 + (1 - uEntra) * 45, {
    tipo: "original",
    escala: 2.15,
    abierto: uAbre,
    largoCable: 420,
    t: tr,
  });

  // Conector derecho: Barato hueco por dentro
  dibujarConectorUsbC(g, 775, 860 + (1 - uEntra) * 45, {
    tipo: "barato",
    escala: 2.15,
    abierto: uAbre,
    calor: uAbre * 0.35,
    largoCable: 420,
    t: tr,
  });

  // Barra láser de comparación exterior durante «se ven iguales»
  const uScan = tramo(tr, t0 + 0.18, tIguales + 0.35);
  if (uScan > 0 && uScan < 1) {
    const sy = mez(830, 1280, suave(uScan));
    g.save();
    g.strokeStyle = "rgba(37, 99, 235, 0.85)";
    g.lineWidth = 5;
    g.beginPath();
    g.moveTo(95, sy);
    g.lineTo(985, sy);
    g.stroke();
    k.brillo(g, 305, sy, 120, "59, 130, 246", 0.5);
    k.brillo(g, 775, sy, 120, "59, 130, 246", 0.5);
    g.restore();
  }

  // Tarjetas superiores de identificación sobre cada cable
  etiquetaCable(
    g,
    305,
    690,
    "ORIGINAL",
    uAbre > 0.45 ? "Con microchip protector" : "Conector USB-C",
    "#0f172a",
    uAbre > 0.45 ? "#10b981" : "#475569",
    uAbre > 0.45 ? "#6ee7b7" : "#f8fafc"
  );

  etiquetaCable(
    g,
    775,
    690,
    "BARATO",
    uAbre > 0.45 ? "¡Hueco sin chip!" : "Conector USB-C",
    "#0f172a",
    uAbre > 0.45 ? "#ef4444" : "#475569",
    uAbre > 0.45 ? "#fca5a5" : "#f8fafc"
  );

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tVacio - 0.14, tVacio + 0.18));
  pildoraEstado(g, 540, 1705, "POR DENTRO VIENE VACÍO", "255, 86, 86", alPil, 44, true);

  capaSuperiorMarca(g, 0.68);
}

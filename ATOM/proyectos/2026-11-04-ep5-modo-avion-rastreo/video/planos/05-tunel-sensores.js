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
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(6).inicio - 0.04;
const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f6 = v.frase(6);
  const t0 = f6.inicio - 0.04;
  const tCorte = v.frase(7).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tGiroscopio = f6.t("giroscopio");
  const tPasos = f6.t("pasos");
  const tGiros = f6.t("giros");
  const tPiso = f6.t("piso");

  fondoMesaClara(g, tr, "calida");

  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tPasos, [1.04, 540, 1145]],
    [tPiso + 0.2, [1.06, 540, 1165]],
    [tCorte - 0.18, [1.06, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uProg = suave(tramo(tr, tGiroscopio - 0.2, tPiso + 0.2));
  const pasos = Math.round(mez(120, 348, uProg));
  const piso = Math.round(mez(1, 5, uProg));

  g.save();
  vista(g, Z, cx, cy);

  const cards = [
    { y: 600, col: "#38bdf8", tit: "1. ACELERÓMETRO INTERNO", val: `${pasos} PASOS CONTADOS`, sub: "Detecta cada zancada y velocidad" },
    { y: 945, col: "#fbbf24", tit: "2. GIROSCOPIO 3 EJES", val: "GIRO 90° A LA DERECHA", sub: "Mide cada vuelta en esquinas o túneles" },
    { y: 1290, col: "#22e39b", tit: "3. BARÓMETRO DE PRESIÓN", val: `SUBISTE AL PISO ${piso}`, sub: "Calcula la altura exacta sin internet" },
  ];

  cards.forEach((c) => {
    redondo(g, 88, c.y, 904, 305, 32);
    g.fillStyle = "#0f172a";
    g.fill();
    g.strokeStyle = c.col;
    g.lineWidth = 4.5;
    g.stroke();

    g.textAlign = "left";
    g.textBaseline = "middle";
    g.font = "800 26px Figtree";
    g.fillStyle = c.col;
    g.fillText(c.tit, 140, c.y + 68);

    g.font = "800 52px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText(c.val, 140, c.y + 155);

    g.font = "700 26px Figtree";
    g.fillStyle = "#94a3b8";
    g.fillText(c.sub, 140, c.y + 235);
  });

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tGiros - 0.1, tPiso + 0.15));
  pildoraEstado(g, 540, 1715, "TUS SENSORES INTERNOS CALCULAN PASOS, GIROS Y PISOS", "245, 158, 11", alPil, 32, true);

  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

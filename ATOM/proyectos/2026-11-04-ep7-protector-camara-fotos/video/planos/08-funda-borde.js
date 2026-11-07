import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(9).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f9 = v.frase(9);
  const t0 = f9.inicio - 0.04;
  const tCorte = v.frase(10).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tFunda = f9.t("funda");
  const tMilimetros = f9.t("milímetros");
  const tLuz = f9.t("luz");

  fondoMesaClara(g, tr, "menta");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tMilimetros, [1.05, 540, 1140]],
    [tCorte - 0.18, [1.05, 540, 1140]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 88, 610, 904, 440, 34);
  g.fillStyle = "#0d1b22";
  g.fill();
  g.strokeStyle = "#10b981";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("PASO 1 · QUITA LOS VIDRIOS Y LIMPIA EL LENTE", 135, 690);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Cristal de Zafiro Libre", 135, 795);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("✓ Recuperas el 100% de nitidez y enfoque láser al instante", 135, 885);

  redondo(g, 88, 1105, 904, 440, 34);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("PASO 2 · LA PROTECCIÓN QUE SÍ FUNCIONA", 135, 1185);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Funda con Borde Elevado (+2 mm)", 135, 1290);
  g.font = "800 30px Figtree";
  g.fillStyle = "#22e39b";
  g.fillText("🛡️ PROTEGE DE GOLPES SIN TOCAR LA LUZ DE LA CÁMARA", 135, 1390);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tFunda - 0.1, tLuz + 0.2));
  pildoraEstado(g, 540, 1715, "USA UNA FUNDA CON BORDE ELEVADO DE 2 MM SIN TAPAR EL LENTE", "16, 185, 129", alPil, 31, true);
  vineta(g, 0.3);
  capaSuperiorMarca(g, 0.68);
}

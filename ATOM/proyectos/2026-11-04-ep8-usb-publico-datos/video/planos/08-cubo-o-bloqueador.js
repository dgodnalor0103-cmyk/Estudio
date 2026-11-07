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
  const tCubo = f9.t("cubo");
  const tBloqueador = f9.t("bloqueador");
  const tCentro = f9.t("centro");

  fondoMesaClara(g, tr, "menta");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tBloqueador, [1.05, 540, 1140]],
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
  g.fillText("OPCIÓN 1 · ENCHUFE DE PARED NORMAL (AC)", 135, 690);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Usa tu Propio Cubo Cargador", 135, 795);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("✓ Del enchufe de pared normal solo sale electricidad pura", 135, 885);

  redondo(g, 88, 1105, 904, 440, 34);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("OPCIÓN 2 · BLOQUEADOR DE DATOS USB", 135, 1185);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Corta los 2 Pines del Centro", 135, 1290);
  g.font = "800 30px Figtree";
  g.fillStyle = "#22e39b";
  g.fillText("🔒 DEJA PASAR LA CARGA Y BLOQUEA EL 100% DE LOS DATOS", 135, 1390);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tCubo - 0.1, tCentro + 0.2));
  pildoraEstado(g, 540, 1715, "USA TU PROPIO CUBO DE PARED O UN BLOQUEADOR DE DATOS USB", "16, 185, 129", alPil, 31, true);
  vineta(g, 0.3);
  capaSuperiorMarca(g, 0.68);
}

import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(5).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tMesa = f5.t("mesa");
  const tSotano = f5.t("sótano");
  const tCorriendo = f5.t("corriendo");
  const tCuchara = f5.t("cuchara");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120c07");
  bg.addColorStop(0.55, "#26180e");
  bg.addColorStop(1, "#120b06");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.06, 540, 920]],
    [tMesa + 0.2, [1.06, 540, 920]],
    [tSotano, [1.06, 540, 1280]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Arriba: Mesa de tu cocina (RAM Real a la mano)
  redondo(g, 90, 610, 900, 410, 34);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = "#a7f3d0";
  g.fillText("MESA DE TU COCINA (RAM FÍSICA REAL)", 540, 690);
  g.font = "800 50px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("TODO A LA MANO EN 0.1 SEGUNDOS", 540, 815);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("Agarras cada utensilio sin moverte", 540, 920);

  // Abajo: Sótano con escaleras largas (RAM Virtual)
  redondo(g, 90, 1080, 900, 500, 34);
  g.fillStyle = "#27120b";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("SÓTANO OSCURO (RAM VIRTUAL EN DISCO)", 540, 1160);
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("BAJAR 20 ESCALONES POR CADA CUCHARA", 540, 1295);
  g.font = "800 30px Figtree";
  g.fillStyle = "#f87171";
  g.fillText("✕ Pierdes tiempo subiendo y bajando sin parar", 540, 1445);

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tCorriendo - 0.1, tCuchara + 0.15));
  pildoraEstado(g, 540, 1710, "ES COMO BAJAR AL SÓTANO CORRIENDO POR CADA CUCHARA", "251, 191, 36", alPil, 32);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

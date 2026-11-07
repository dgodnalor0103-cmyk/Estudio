import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(2).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.inicio - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tOcho = f2.t("ocho");
  const tBoton = f2.t("botón");
  const tTrampa = f2.t("trampa");
  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1080]],
    [tBoton, [1.04, 540, 1120]],
    [tTrampa + 0.15, [1.1, 540, 1200]],
    [tCorte - 0.18, [1.1, 540, 1200]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uTrampa = suave(tramo(tr, tBoton, tTrampa + 0.15));
  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 90, 610, 900, 420, 34);
  g.fillStyle = "#0e1726";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("LO QUE TE PROMETE LA CAJA", 540, 685);
  g.font = "800 84px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("+8 GB RAM GRATIS", 540, 810);
  g.font = "700 30px Figtree";
  g.fillStyle = "#34d399";
  g.fillText("«Actívalo con un botón en Ajustes»", 540, 930);

  redondo(g, 90, 1080, 900, 490, 34);
  g.fillStyle = "#2a0a0e";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4.5;
  g.stroke();
  k.brillo(g, 540, 1320, 500, "239, 68, 68", 0.25 + 0.45 * uTrampa);
  g.font = "800 34px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("LA TRAMPA REAL POR DENTRO", 540, 1175);
  g.font = "800 54px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("NO ES MEMORIA RAM REAL", 540, 1300);
  g.font = "700 32px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Te quita 8 GB de tu espacio de fotos y videos", 540, 1425);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tBoton - 0.1, tTrampa + 0.15));
  pildoraEstado(g, 540, 1715, "PROMETEN +8 GB GRATIS · PERO ES UN TRUCO CON TRAMPA", "239, 68, 68", alPil, 33, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

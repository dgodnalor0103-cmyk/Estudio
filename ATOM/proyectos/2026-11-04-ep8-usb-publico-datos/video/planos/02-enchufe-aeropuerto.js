import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(2).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.inicio - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tAeropuerto = f2.t("aeropuerto");
  const tHueco = f2.t("hueco");
  const tCargar = f2.t("cargar");
  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1080]],
    [tAeropuerto, [1.04, 540, 1120]],
    [tCargar + 0.15, [1.1, 540, 1200]],
    [tCorte - 0.18, [1.1, 540, 1200]],
  ]);
  const [Z, cx, cy] = cam(tr);

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
  g.fillText("LO QUE VES POR FUERA EN LA PARED", 540, 685);
  g.font = "800 68px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("CARGA GRATIS EN AEROPUERTO", 540, 810);
  g.font = "700 30px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("Una simple ranura USB lista para tu cable", 540, 930);

  redondo(g, 90, 1080, 900, 490, 34);
  g.fillStyle = "#2a0a0e";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 34px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("LO QUE ES EN REALIDAD", 540, 1175);
  g.font = "800 56px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("UN PUERTO DE DATOS COMPLETO", 540, 1305);
  g.font = "700 32px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("No es solo corriente: tiene acceso directo a tu memoria", 540, 1430);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tHueco - 0.1, tCargar + 0.15));
  pildoraEstado(g, 540, 1715, "PARECE UN SIMPLE ENCHUFE · PERO HACE MUCHO MÁS QUE CARGAR", "239, 68, 68", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

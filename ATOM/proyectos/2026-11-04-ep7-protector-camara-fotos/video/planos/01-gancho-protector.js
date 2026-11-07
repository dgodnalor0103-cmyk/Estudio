import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCamaraProtector, fondoMosaico, insigniaEpisodio, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = 0;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tVidrio = f1.t("vidrio");
  const tArruina = f1.t("arruina");
  const tNoche = f1.t("noche");
  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tArruina, [1.1, 540, 1130]],
    [tNoche + 0.2, [1.16, 540, 1185]],
    [tCorte - 0.18, [1.16, 540, 1185]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uDest = suave(tramo(tr, tVidrio, tNoche + 0.2));
  fondoMosaico(g, tr, -tr * 24, tr * 16, "245, 158, 11", 0.32);
  g.save();
  vista(g, Z, cx, cy);
  dibujarCamaraProtector(g, 540, 1165, 500, 880, { protectorPuesto: 1, destellos: 0.3 + 0.7 * uDest });
  g.restore();
  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tArruina - 0.35, tArruina + 0.1)));
  insigniaEpisodio(g, 540, 645, "MITOS DE TU CELULAR", "EP. 7", "", "#F59E0B", alIns, 0.92 + 0.08 * alIns);
  const alPil = entra(tramo(tr, tArruina - 0.1, tNoche + 0.15));
  pildoraEstado(g, 540, 1710, "EL PROTECTOR DE CÁMARA ARRUINA TUS FOTOS DE NOCHE", "239, 68, 68", alPil, 33);
  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

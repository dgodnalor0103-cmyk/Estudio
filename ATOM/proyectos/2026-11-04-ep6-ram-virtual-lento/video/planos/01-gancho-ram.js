import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularRamVirtual, fondoMosaico, insigniaEpisodio, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = 0;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tVirtual = f1.t("virtual");
  const tLento = f1.t("lento");
  const tMemoria = f1.t("memoria");
  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tLento, [1.1, 540, 1130]],
    [tMemoria + 0.2, [1.16, 540, 1185]],
    [tCorte - 0.18, [1.16, 540, 1185]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uDesgaste = suave(tramo(tr, tVirtual, tMemoria + 0.2));
  fondoMosaico(g, tr, -tr * 24, tr * 16, "239, 68, 68", 0.32);
  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularRamVirtual(g, 540, 1165, 500, 880, { ramPlusOn: 1, desgaste: 0.25 + 0.7 * uDesgaste, lento: true });
  g.restore();
  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tLento - 0.35, tLento + 0.1)));
  insigniaEpisodio(g, 540, 645, "MITOS DE TU CELULAR", "EP. 6", "", "#EF4444", alIns, 0.92 + 0.08 * alIns);
  const alPil = entra(tramo(tr, tLento - 0.1, tMemoria + 0.15));
  pildoraEstado(g, 540, 1710, "LA RAM VIRTUAL PUEDE FRENAR Y DESGASTAR TU CELULAR", "239, 68, 68", alPil, 33);
  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

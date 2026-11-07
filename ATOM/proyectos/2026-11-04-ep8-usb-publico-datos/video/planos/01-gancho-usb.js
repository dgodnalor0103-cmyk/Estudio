import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularUsbPublico, fondoMosaico, insigniaEpisodio, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = 0;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tPublico = f1.t("público");
  const tDatos = f1.t("datos");
  const tOculta = f1.t("oculta");
  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tDatos, [1.1, 540, 1130]],
    [tOculta + 0.2, [1.16, 540, 1185]],
    [tCorte - 0.18, [1.16, 540, 1185]],
  ]);
  const [Z, cx, cy] = cam(tr);
  const uCopia = suave(tramo(tr, tPublico, tOculta + 0.2));
  fondoMosaico(g, tr, -tr * 24, tr * 16, "239, 68, 68", 0.32);
  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularUsbPublico(g, 540, 1165, 500, 880, { robandoDatos: 1, progresoCopia: 0.2 + 0.75 * uCopia });
  g.restore();
  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tDatos - 0.35, tDatos + 0.1)));
  insigniaEpisodio(g, 540, 645, "MITOS DE TU CELULAR", "EP. 8", "", "#EF4444", alIns, 0.92 + 0.08 * alIns);
  const alPil = entra(tramo(tr, tDatos - 0.1, tOculta + 0.15));
  pildoraEstado(g, 540, 1710, "UN USB PÚBLICO PUEDE CONECTAR TUS DATOS A UNA PC OCULTA", "239, 68, 68", alPil, 32);
  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCamaraProtector, fondoMesaClara, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(8).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tAnillos = f8.t("anillos");
  const tCamara = f8.t("cámara");

  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tCamara + 0.15, [1.08, 540, 1165]],
    [tCorte - 0.18, [1.08, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCamaraProtector(g, 540, 1135, 480, 840, { protectorPuesto: 1, destellos: 0.9 });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tAnillos - 0.1, tCamara + 0.15));
  pildoraEstado(g, 540, 1715, "NUNCA PEGUES VIDRIOS NI ANILLOS SOBRE TUS LENTES", "239, 68, 68", alPil, 33, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

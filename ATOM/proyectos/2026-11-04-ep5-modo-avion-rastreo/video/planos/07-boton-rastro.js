import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularModoAvion,
  fondoMesaClara,
  pildoraEstado,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(8).inicio - 0.04;
const { tramo, entra } = k;

export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tRastro = f8.t("rastro");
  const tAlcanza = f8.t("alcanza");

  fondoMesaClara(g, tr, "fria");

  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tAlcanza + 0.15, [1.08, 540, 1165]],
    [tCorte - 0.18, [1.08, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularModoAvion(g, 540, 1135, 480, 840, {
    modoAvion: 1,
    progresoRuta: 1,
    mostrarRayosX: 1,
    alertaRastro: true,
    t: tr,
  });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tRastro - 0.1, tAlcanza + 0.15));
  pildoraEstado(g, 540, 1715, "EL BOTÓN DEL AVIÓN POR SÍ SOLO NO APAGA EL GPS", "239, 68, 68", alPil, 34, true);

  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

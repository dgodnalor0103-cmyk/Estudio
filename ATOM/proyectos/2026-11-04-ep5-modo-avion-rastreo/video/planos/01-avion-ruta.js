import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularModoAvion,
  fondoMosaico,
  insigniaEpisodio,
  pildoraEstado,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = 0;
const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tAvion = f1.t("avión");
  const tRegistrando = f1.t("registrando");
  const tCaminas = f1.t("caminas");

  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tRegistrando, [1.1, 540, 1130]],
    [tCaminas + 0.2, [1.16, 540, 1185]],
    [tCorte - 0.18, [1.16, 540, 1185]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uRuta = suave(tramo(tr, tAvion, tCaminas + 0.2));
  fondoMosaico(g, tr, -tr * 24, tr * 16, "245, 158, 11", 0.32);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularModoAvion(g, 540, 1165, 500, 880, {
    modoAvion: 1,
    progresoRuta: 0.25 + 0.75 * uRuta,
    mostrarRayosX: 1,
    alertaRastro: true,
    t: tr,
  });
  g.restore();

  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tRegistrando - 0.35, tRegistrando + 0.1)));
  insigniaEpisodio(g, 540, 645, "MITOS DE TU CELULAR", "EP. 5", "", "#F59E0B", alIns, 0.92 + 0.08 * alIns);

  const alPil = entra(tramo(tr, tRegistrando - 0.1, tCaminas + 0.15));
  pildoraEstado(g, 540, 1710, "MODO AVIÓN ACTIVO · PERO LA RUTA SIGUE GRABÁNDOSE", "239, 68, 68", alPil, 33);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

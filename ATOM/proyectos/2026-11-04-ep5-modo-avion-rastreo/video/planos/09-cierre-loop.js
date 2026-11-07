import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularModoAvion,
  fondoMosaico,
  insigniaEpisodio,
  pildoraEstado,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(10).inicio - 0.04;
const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f10 = v.frase(10);
  const f11 = v.frase(11);
  const t0 = f10.inicio - 0.04;
  const tFin = v.duracion;

  const tAmigo = f10.t("amigo");
  const tSeis = f11.t("seis");

  const uLoop = suave(tramo(t, tFin - 0.58, tFin - 0.04));

  const cam = camino2D([
    [t0, [1.18, 540, 1165]],
    [tAmigo + 0.5, [1.08, 540, 1060]],
    [f11.inicio, [1.02, 540, 980]],
    [tFin - 0.45, [1.0, 540, 960]],
    [tFin, [1.0, 540, 960]],
  ]);
  const [Z, cx, cy] = cam(t);

  const progPlano = tramo(t, t0, tFin);
  fondoMosaico(g, Math.sin(progPlano * Math.PI) * 2.4, -progPlano * 270, progPlano * 270, "245, 158, 11", 0.32);

  g.save();
  vista(g, Z, cx, cy);
  const uReset = suave(tramo(t, f11.inicio, tFin - 0.3));
  dibujarCelularModoAvion(g, 540, 1165, 500, 880, {
    modoAvion: 1,
    progresoRuta: 1 - 0.75 * uReset,
    mostrarRayosX: 1,
    alertaRastro: true,
    t,
  });
  g.restore();

  sinVista(g);
  const alShare = entra(tramo(t, t0 + 0.08, t0 + 0.32)) * (1 - suave(tramo(t, f11.inicio - 0.28, f11.inicio - 0.04)));
  pildoraEstado(g, 540, 1710, "ENVÍASELO AL AMIGO QUE USA EL MODO AVIÓN PARA OCULTARSE", "56, 189, 248", alShare, 31);

  const alNext = entra(tramo(t, f11.inicio, tSeis + 0.2)) * (1 - uLoop);
  insigniaEpisodio(g, 540, 655, "MAÑANA · MITOS DE TU CELULAR", "EP. 6", "LA TRAMPA DE LA RAM VIRTUAL", "#22E39B", alNext, 0.9 + 0.1 * alNext);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

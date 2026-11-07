import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, dibujarCelularRamVirtual, fondoMesaClara, pildoraEstado, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(8).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tFisica = f8.t("física");
  const tEstorba = f8.t("estorba");

  fondoMesaClara(g, tr, "fria");
  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tEstorba + 0.15, [1.08, 540, 1165]],
    [tCorte - 0.18, [1.08, 540, 1165]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  dibujarCelularRamVirtual(g, 540, 1135, 480, 840, { ramPlusOn: 1, desgaste: 0.85, lento: true });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tFisica - 0.1, tEstorba + 0.15));
  pildoraEstado(g, 540, 1715, "CON 6 U 8 GB DE RAM FÍSICA · LA RAM VIRTUAL SOLO ESTORBA", "239, 68, 68", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

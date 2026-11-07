// Plano 2 (8.04 s – 12.44 s): RUTA 1 (revivir con cinta adhesiva) + RUTA 2 (crear plano técnico NUEVO MOD) + Zelda Ocarina of Time Co-op + Deus Ex Mapa Co-op
import { dibujarBaseOriginal, aplicarOverlaysEspanol, mapearTramo } from "../mundo.js";

export const desde = "Repara";
export const entrada = "corte";

const TRAMOS = [
  [8.04, 9.32, 275, 322],
  [9.32, 10.62, 325, 366],
  [10.62, 11.35, 370, 456],
  [11.35, 12.50, 460, 532],
];

export function dibuja(g, t) {
  const fExact = mapearTramo(t, TRAMOS);
  dibujarBaseOriginal(g, fExact);
  aplicarOverlaysEspanol(g, fExact);
}

// Plano 3 (12.44 s – 22.08 s): Steam Unirse a la partida + Router Admin Sin abrir puertos/IP + 1,300+ Estrellas + Comentarios COOP y cierre
import { dibujarBaseOriginal, aplicarOverlaysEspanol, mapearTramo } from "../mundo.js";

export const desde = "tu#2";
export const entrada = "corte";

const TRAMOS = [
  [12.44, 14.15, 536, 600],
  [14.15, 16.38, 604, 668],
  [16.38, 18.52, 715, 802],
  [18.52, 20.85, 806, 926],
  [20.85, 22.10, 974, 1021],
];

export function dibuja(g, t) {
  const fExact = mapearTramo(t, TRAMOS);
  dibujarBaseOriginal(g, fExact);
  aplicarOverlaysEspanol(g, fExact);
}

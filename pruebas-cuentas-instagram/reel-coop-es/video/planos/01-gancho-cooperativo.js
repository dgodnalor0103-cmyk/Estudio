// Plano 1 (0.00 s – 8.04 s): Gancho idéntico del mando DualSense desintegrándose en partículas hacia 2 mandos Co-op + GitHub coop-anything + Directorio Co-op
import { dibujarBaseOriginal, aplicarOverlaysEspanol, mapearTramo } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

const TRAMOS = [
  [0.00, 1.05, 1, 28],
  [1.05, 2.35, 29, 55],
  [2.35, 3.72, 56, 92],
  [3.72, 6.00, 95, 177],
  [6.00, 6.55, 181, 210],
  [6.55, 8.10, 213, 270],
];

export function dibuja(g, t) {
  const fExact = mapearTramo(t, TRAMOS);
  dibujarBaseOriginal(g, fExact);
  aplicarOverlaysEspanol(g, fExact);
}

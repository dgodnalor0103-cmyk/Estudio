// Plano 1 (0.00 s – 29.60 s): Gancho 3D MagSafe + explosión 3D sobre lava + apertura de chasis + celda 3D de iones de litio
import { renderizarEscena3D, TRAMOS_PLANO_1 } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_1);
}

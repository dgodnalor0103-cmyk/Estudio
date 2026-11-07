// Plano 1 (0.00 s – 17.27 s): Gancho 3D de teclas bajo el pulgar + capas isométricas 3D ("lo que ves" vs "lo que tocas")
import { renderizarEscena3D, TRAMOS_PLANO_1 } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_1);
}

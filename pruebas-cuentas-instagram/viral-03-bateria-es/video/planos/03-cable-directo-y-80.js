// Plano 3 (65.22 s – 89.90 s): Bypass por cable directo AC en laptops modernas y límite del 80%
import { renderizarEscena3D, TRAMOS_PLANO_3 } from "../mundo.js";

export const desde = "Entonces";
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_3);
}

// Plano 3 (51.89 s – 78.57 s): Recálculo del diccionario, historia de 44px (2007), confirmación al levantar y objetivo móvil
import { renderizarEscena3D, TRAMOS_PLANO_3 } from "../mundo.js";

export const desde = "cuanto";
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_3);
}

// Plano 2 (29.60 s – 65.22 s): Iones atrapados en el ánodo, costra microscópica, calor (auto/cama) y extremos 100% vs 20-80%
import { renderizarEscena3D, TRAMOS_PLANO_2 } from "../mundo.js";

export const desde = "practica";
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_2);
}

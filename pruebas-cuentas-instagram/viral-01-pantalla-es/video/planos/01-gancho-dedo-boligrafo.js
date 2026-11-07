// Plano 1 (0.00 s – 17.77 s): Gancho 3D idéntico (Dedo vs Bolígrafo + Iones en Rayos X + Llamada en el frío con guantes)
import { renderizarEscena3D, TRAMOS_PLANO_1 } from "../mundo.js";

export const desde = 0;
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_1);
}

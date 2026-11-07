// Plano 2 (17.27 s – 51.89 s): Zonas invisibles 3D, apuesta matemática (96%) y expansión silenciosa del objetivo
import { renderizarEscena3D, TRAMOS_PLANO_2 } from "../mundo.js";

export const desde = "Detras";
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_2);
}

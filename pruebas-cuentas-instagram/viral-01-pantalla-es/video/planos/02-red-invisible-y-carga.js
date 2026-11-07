// Plano 2 (17.77 s – 52.71 s): Zoom 3D a la cuadrícula ITO de diamantes, cruce con carga, 120 escaneos/s, absorción Na+/Cl- y Multitouch 2 dedos
import { renderizarEscena3D, TRAMOS_PLANO_2 } from "../mundo.js";

export const desde = "Debajo";
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_2);
}

// Plano 3 (52.71 s – 84.50 s): Macro 3D de guante de lana, lluvia en pantalla, hilos conductores de plata y síntesis < 1 pF
import { renderizarEscena3D, TRAMOS_PLANO_3 } from "../mundo.js";

export const desde = "guante";
export const entrada = "corte";

export function dibuja(g, t) {
  renderizarEscena3D(g, t, TRAMOS_PLANO_3);
}

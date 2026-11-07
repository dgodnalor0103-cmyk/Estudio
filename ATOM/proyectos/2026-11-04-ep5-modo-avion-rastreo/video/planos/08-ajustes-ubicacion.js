import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarDedo,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(9).inicio - 0.04;
const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f9 = v.frase(9);
  const t0 = f9.inicio - 0.04;
  const tCorte = v.frase(10).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tApaga = f9.t("apaga");
  const tUbicacion = f9.t("Ubicación");
  const tActivar = f9.t("activar");

  fondoMesaClara(g, tr, "menta");

  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tUbicacion, [1.05, 540, 1140]],
    [tCorte - 0.18, [1.05, 540, 1140]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uOff = suave(tramo(tr, tApaga - 0.1, tUbicacion + 0.15));
  const uAvion = suave(tramo(tr, tActivar - 0.15, tActivar + 0.3));

  g.save();
  vista(g, Z, cx, cy);

  // Tarjeta 1: Ajustes > Ubicación -> OFF
  redondo(g, 88, 610, 904, 440, 34);
  g.fillStyle = "#0d1b22";
  g.fill();
  g.strokeStyle = "#10b981";
  g.lineWidth = 4.5;
  g.stroke();

  g.textAlign = "left";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("PASO 1 · ENTRA A AJUSTES DE PRIVACIDAD", 145, 690);

  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Ubicación (GPS)", 145, 795);

  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText(uOff > 0.5 ? "✓ Apagado de raíz (no escucha satélites)" : "Desactiva el interruptor general", 145, 885);

  // Switch de Ubicación pasando de verde a apagado seguro
  const swX = 815;
  const swY = 795;
  redondo(g, swX - 85, swY - 44, 170, 88, 44);
  g.fillStyle = uOff > 0.5 ? "#334155" : "#ef4444";
  g.fill();
  const knobX = mez(swX + 38, swX - 38, uOff);
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.arc(knobX, swY, 34, 0, Math.PI * 2);
  g.fill();

  // Tarjeta 2: Ahora sí activa Modo Avión
  redondo(g, 88, 1105, 904, 440, 34);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4.5;
  g.stroke();

  g.textAlign = "left";
  g.font = "800 28px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("PASO 2 · AHORA SÍ ACTIVA EL MODO AVIÓN", 145, 1185);

  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Modo Avión + Sin GPS", 145, 1290);

  g.font = "800 30px Figtree";
  g.fillStyle = "#22e39b";
  g.fillText("🔒 CERO ANTENAS Y CERO RASTREO DE RUTA", 145, 1390);

  // Dedo tocando el interruptor de Ubicación
  if (tr < tActivar) {
    dibujarDedo(g, swX, swY + 25, -0.38, Math.sin(uOff * Math.PI), 0.92);
  }

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tUbicacion - 0.1, tActivar + 0.2));
  pildoraEstado(g, 540, 1715, "APAGA UBICACIÓN EN AJUSTES ANTES DEL MODO AVIÓN", "16, 185, 129", alPil, 33, true);

  vineta(g, 0.3);
  capaSuperiorMarca(g, 0.68);
}

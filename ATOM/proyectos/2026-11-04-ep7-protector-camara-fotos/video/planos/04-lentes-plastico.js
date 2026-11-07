import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(5).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tRayado = f5.t("rayado");
  const tAnteojos = f5.t("anteojos");
  const tLimpiados = f5.t("limpiados");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120c07");
  bg.addColorStop(0.55, "#26180e");
  bg.addColorStop(1, "#120b06");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.04, 540, 1020]],
    [tAnteojos, [1.06, 540, 1180]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  redondo(g, 90, 610, 900, 410, 34);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = "#a7f3d0";
  g.fillText("ABAJO: ANTEOJOS CAROS RECIÉN LIMPIADOS", 540, 690);
  g.font = "800 50px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("CRISTAL ÓPTICO DE ALTA PRECISIÓN", 540, 820);

  redondo(g, 90, 1080, 900, 500, 34);
  g.fillStyle = "#27120b";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4.5;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("ENCIMA: LENTES DE SOL DE PLÁSTICO RAYADO", 540, 1165);
  g.font = "800 48px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("VES TODO SUCIO, OPACO Y CON REFLEJOS", 540, 1300);
  g.font = "800 30px Figtree";
  g.fillStyle = "#f87171";
  g.fillText("✕ La peor capa define la calidad final de tu foto", 540, 1445);

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tAnteojos - 0.1, tLimpiados + 0.15));
  pildoraEstado(g, 540, 1710, "ES COMO PONER PLÁSTICO RAYADO SOBRE ANTEOJOS CAROS", "251, 191, 36", alPil, 32);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(7).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tLaser = f7.t("láser");
  const tDoble = f7.t("doble");
  const tEnfocar = f7.t("enfocar");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#1f0910");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tDoble, [1.06, 540, 1120]],
    [tCorte - 0.18, [1.06, 540, 1120]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  redondo(g, 110, 620, 860, 430, 34);
  g.fillStyle = "#1a0a12";
  g.fill();
  g.strokeStyle = "#f43f5e";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#fda4af";
  g.fillText("SENSOR LÁSER LiDAR / AUTOFOCO INVISIBLE", 540, 700);
  g.font = "800 64px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("BLOQUEADO POR EL PEGAMENTO", 540, 835);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("El haz infrarrojo rebota contra el borde sucio del protector", 540, 955);

  redondo(g, 110, 1110, 860, 440, 34);
  g.fillStyle = "#091322";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("TIEMPO PARA ENFOCAR TU FOTO", 540, 1200);
  g.font = "800 84px Figtree";
  g.fillStyle = "#ef4444";
  g.fillText("2X MÁS LENTO", 540, 1340);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("La imagen pulsa y sale movida cuando tomas fotos rápidas", 540, 1465);
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tDoble - 0.1, tEnfocar + 0.15));
  pildoraEstado(g, 540, 1710, "EL PEGAMENTO TAPA EL LÁSER Y TARDA EL DOBLE EN ENFOCAR", "244, 63, 94", alPil, 31);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

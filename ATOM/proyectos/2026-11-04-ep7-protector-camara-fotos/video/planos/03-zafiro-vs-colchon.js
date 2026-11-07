import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(3).inicio - 0.04;
const { suave, tramo, entra } = k;
export function dibuja(g, t) {
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const t0 = f3.inicio - 0.04;
  const tCorte = v.frase(5).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tZafiro = f3.t("zafiro");
  const tReflejos = f3.t("reflejos");
  const tVidrio = f4.t("vidrio");
  const tColchon = f4.t("colchón");
  const tCristales = f4.t("cristales");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#0c182c");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.06, 360, 1140]],
    [tReflejos, [1.06, 380, 1140]],
    [tVidrio, [1.04, 680, 1130]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Izquierda (F3): Lente Original con Zafiro + 7 capas antirreflejo
  redondo(g, 65, 620, 445, 960, 32);
  g.fillStyle = "rgba(8, 30, 24, 0.95)";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("LENTE ORIGINAL DE FÁBRICA", 287, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#d1fae5";
  g.fillText("Cristal templado con Zafiro", 287, 735);

  redondo(g, 115, 820, 345, 320, 24);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 50px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("7 CAPAS NANO", 287, 930);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("✓ EVITAN REFLEJOS (99% LUZ)", 287, 1020);

  // Derecha (F4): Vidrio barato encima + colchón de aire encerrado
  redondo(g, 555, 620, 460, 960, 32);
  g.fillStyle = "rgba(32, 12, 16, 0.95)";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("CON PROTECTOR PEGADO", 785, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#fecdd3";
  g.fillText("Dos cristales + aire atrapado", 785, 735);

  redondo(g, 605, 820, 360, 320, 24);
  g.fillStyle = "#450a0a";
  g.fill();
  g.strokeStyle = "#f87171";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 42px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("COLCHÓN DE AIRE", 785, 930);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("✕ ATRAPA POLVO Y REBOTA LUZ", 785, 1020);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tZafiro - 0.1, tReflejos + 0.1)) * (1 - suave(tramo(tr, f4.inicio - 0.25, f4.inicio)));
  pildoraEstado(g, 540, 1710, "TU LENTE YA TRAE CRISTAL CON ZAFIRO Y 7 CAPAS ANTIRREFLEJO", "34, 227, 155", alP1, 30);
  const alP2 = entra(tramo(tr, tColchon - 0.1, tCristales + 0.2));
  pildoraEstado(g, 540, 1710, "EL PROTECTOR DEJA UN COLCHÓN DE AIRE ENTRE LOS DOS CRISTALES", "239, 68, 68", alP2, 30);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

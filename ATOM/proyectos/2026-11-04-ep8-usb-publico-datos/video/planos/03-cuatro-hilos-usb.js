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
  const tOrillas = f3.t("orillas");
  const tElectricidad = f3.t("electricidad");
  const tCentro = f4.t("centro");
  const tAutopista = f4.t("autopista");
  const tCelular = f4.t("celular");

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
    [tElectricidad, [1.06, 380, 1140]],
    [tCentro, [1.04, 680, 1130]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Izquierda (F3): 2 hilos de las orillas -> Electricidad (+5V y Tierra)
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
  g.fillText("2 HILOS DE LAS ORILLAS", 287, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#d1fae5";
  g.fillText("Pines 1 y 4 (+5V y Tierra)", 287, 735);

  redondo(g, 115, 820, 345, 320, 24);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 46px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("SOLO CORRIENTE", 287, 930);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("⚡ CARGAN TU BATERÍA", 287, 1020);

  // Derecha (F4): 2 hilos del centro -> Autopista de datos a tu memoria
  redondo(g, 555, 620, 460, 960, 32);
  g.fillStyle = "rgba(32, 12, 16, 0.95)";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("2 HILOS DEL CENTRO", 785, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#fecdd3";
  g.fillText("Pines 2 y 3 (Datos D+ y D-)", 785, 735);

  redondo(g, 605, 820, 360, 320, 24);
  g.fillStyle = "#450a0a";
  g.fill();
  g.strokeStyle = "#f87171";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 42px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("AUTOPISTA DE DATOS", 785, 930);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("⚠ DIRECTO A TU MEMORIA", 785, 1020);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tOrillas - 0.1, tElectricidad + 0.1)) * (1 - suave(tramo(tr, f4.inicio - 0.25, f4.inicio)));
  pildoraEstado(g, 540, 1710, "TU CABLE USB TIENE 4 HILOS: SOLO 2 LLEVAN ELECTRICIDAD", "34, 227, 155", alP1, 31);
  const alP2 = entra(tramo(tr, tAutopista - 0.1, tCelular + 0.2));
  pildoraEstado(g, 540, 1710, "LOS 2 HILOS DEL CENTRO SON UNA AUTOPISTA DE DATOS A TU MEMORIA", "239, 68, 68", alP2, 30);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

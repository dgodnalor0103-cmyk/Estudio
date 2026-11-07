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
  const tUltrarrapido = f3.t("ultrarrápido");
  const tInstante = f3.t("instante");
  const tVirtual = f4.t("virtual");
  const tQuince = f4.t("quince");
  const tLento = f4.t("lento");

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
    [tInstante, [1.06, 380, 1140]],
    [tVirtual, [1.04, 680, 1130]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Columna Izquierda (F3): RAM FÍSICA REAL (LPDDR5)
  redondo(g, 65, 620, 445, 960, 32);
  g.fillStyle = "rgba(8, 30, 24, 0.95)";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("RAM FÍSICA REAL", 287, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#d1fae5";
  g.fillText("Soldada junto al procesador", 287, 735);

  redondo(g, 125, 820, 325, 240, 24);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 54px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("64 GB/s", 287, 915);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("⚡ RESPUESTA AL INSTANTE", 287, 995);

  redondo(g, 125, 1140, 325, 360, 24);
  g.fillStyle = "#042f2e";
  g.fill();
  g.font = "800 32px Figtree";
  g.fillStyle = "#34d399";
  g.fillText("1X VELOCIDAD MÁXIMA", 287, 1320);

  // Columna Derecha (F4): RAM VIRTUAL (Almacenamiento de Fotos)
  redondo(g, 555, 620, 460, 960, 32);
  g.fillStyle = "rgba(32, 12, 16, 0.95)";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 30px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("RAM VIRTUAL PRESTADA", 785, 690);
  g.font = "700 22px Figtree";
  g.fillStyle = "#fecdd3";
  g.fillText("Chip donde guardas tus fotos", 785, 735);

  redondo(g, 620, 820, 330, 240, 24);
  g.fillStyle = "#450a0a";
  g.fill();
  g.strokeStyle = "#f87171";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 54px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("4 GB/s", 785, 915);
  g.font = "800 26px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("🐢 CUELLO DE BOTELLA", 785, 995);

  redondo(g, 620, 1140, 330, 360, 24);
  g.fillStyle = "#3b0712";
  g.fill();
  g.font = "800 44px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("15 VECES", 785, 1285);
  g.font = "800 34px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("MÁS LENTA", 785, 1355);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tUltrarrapido - 0.1, tInstante + 0.1)) * (1 - suave(tramo(tr, f4.inicio - 0.25, f4.inicio)));
  pildoraEstado(g, 540, 1710, "LA RAM REAL ESTÁ SOLDADA AL PROCESADOR Y ES ULTRARRÁPIDA", "34, 227, 155", alP1, 31);
  const alP2 = entra(tramo(tr, tQuince - 0.1, tLento + 0.2));
  pildoraEstado(g, 540, 1710, "LA RAM VIRTUAL USA EL CHIP DE TUS FOTOS: 15 VECES MÁS LENTO", "239, 68, 68", alP2, 31);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

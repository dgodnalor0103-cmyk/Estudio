import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(7).inicio - 0.04;
const { suave, tramo, entra, mez } = k;
export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tMiles = f7.t("miles");
  const tGastando = f7.t("gastando");
  const tAlmacenamiento = f7.t("almacenamiento");

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
    [tGastando, [1.06, 540, 1120]],
    [tCorte - 0.18, [1.06, 540, 1120]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uWear = suave(tramo(tr, tMiles - 0.2, tAlmacenamiento + 0.15));
  const escrituras = Math.round(mez(1200, 9850, uWear));
  const salud = Math.round(mez(98, 72, uWear));

  g.save();
  vista(g, Z, cx, cy);

  redondo(g, 110, 620, 860, 420, 34);
  g.fillStyle = "#1a0a12";
  g.fill();
  g.strokeStyle = "#f43f5e";
  g.lineWidth = 4.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#fda4af";
  g.fillText("ESCRITURAS POR MINUTO EN TU MEMORIA INTERNA", 540, 700);
  g.font = "800 92px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText(`${escrituras} / MIN`, 540, 835);
  g.font = "700 28px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("Roce eléctrico constante sobre las celdas donde guardas fotos", 540, 955);

  redondo(g, 110, 1100, 860, 460, 34);
  g.fillStyle = "#091322";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText(`VIDA ÚTIL DE TU ALMACENAMIENTO: ${salud}%`, 540, 1200);

  redondo(g, 190, 1290, 700, 56, 28);
  g.fillStyle = "#1e293b";
  g.fill();
  redondo(g, 190, 1290, 700 * (salud / 100), 56, 28);
  g.fillStyle = "#ef4444";
  g.fill();

  g.font = "800 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("⚠ Las celdas Flash tienen un límite fijo de escrituras", 540, 1445);

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tGastando - 0.1, tAlmacenamiento + 0.15));
  pildoraEstado(g, 540, 1710, "MILES DE ESCRITURAS POR MINUTO DESGASTAN TU MEMORIA", "244, 63, 94", alPil, 32);
  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

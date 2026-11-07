import * as k from "#kit";
import { v } from "#voz";
import { camino2D, capaSuperiorMarca, fondoMesaClara, pildoraEstado, redondo, relojPlano, sinVista, vista, vineta } from "../mundo.js";
export const desde = (v) => v.frase(6).inicio - 0.04;
const { tramo, entra } = k;
export function dibuja(g, t) {
  const f6 = v.frase(6);
  const t0 = f6.inicio - 0.04;
  const tCorte = v.frase(7).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);
  const tRebota = f6.t("rebota");
  const tFantasmas = f6.t("fantasmas");
  const tNeblina = f6.t("neblina");

  fondoMesaClara(g, tr, "calida");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tFantasmas, [1.05, 540, 1150]],
    [tCorte - 0.18, [1.05, 540, 1150]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  const cards = [
    { y: 600, col: "#38bdf8", tit: "1. ENTRA LA LUZ DE LAS FAROLAS", val: "REBOTE EN EL HUECO DE AIRE", sub: "El rayo choca entre el protector barato y el lente" },
    { y: 945, col: "#4ade80", tit: "2. EFECTO FANTASMA (GHOSTING)", val: "PUNTOS Y LUCES VERDES", sub: "Aparecen luces duplicadas flotando en el cielo oscuro" },
    { y: 1290, col: "#ef4444", tit: "3. DESTELLO DEL FLASH", val: "FOTO BLANCA CON NEBLINA", sub: "El flash se mete por el borde del vidrio y lava la foto" },
  ];
  cards.forEach((c) => {
    redondo(g, 88, c.y, 904, 305, 32);
    g.fillStyle = "#0f172a";
    g.fill();
    g.strokeStyle = c.col;
    g.lineWidth = 4.5;
    g.stroke();
    g.textAlign = "left";
    g.textBaseline = "middle";
    g.font = "800 26px Figtree";
    g.fillStyle = c.col;
    g.fillText(c.tit, 140, c.y + 68);
    g.font = "800 50px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText(c.val, 140, c.y + 155);
    g.font = "700 26px Figtree";
    g.fillStyle = "#94a3b8";
    g.fillText(c.sub, 140, c.y + 235);
  });
  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tFantasmas - 0.1, tNeblina + 0.15));
  pildoraEstado(g, 540, 1715, "LA LUZ REBOTA ADENTRO Y CREA FANTASMAS VERDES Y NEBLINA", "245, 158, 11", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

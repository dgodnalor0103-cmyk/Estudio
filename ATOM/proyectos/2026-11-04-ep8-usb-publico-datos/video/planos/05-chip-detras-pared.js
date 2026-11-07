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
  const tChip = f6.t("chip");
  const tPermiso = f6.t("permiso");
  const tDistraido = f6.t("distraído");

  fondoMesaClara(g, tr, "calida");
  const cam = camino2D([
    [t0, [1.0, 540, 1120]],
    [tPermiso, [1.05, 540, 1150]],
    [tCorte - 0.18, [1.05, 540, 1150]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);
  const cards = [
    { y: 600, col: "#38bdf8", tit: "1. PUERTO USB ALTERADO", val: "MINI-PC DETRÁS DE LA PARED", sub: "Un microchip oculto se hace pasar por computadora" },
    { y: 945, col: "#f59e0b", tit: "2. PROTOCOLO DE DATOS USB", val: "ENVÍA SOLICITUD DE ACCESO", sub: "Lanza una ventana de «¿Confiar en esta computadora?»" },
    { y: 1290, col: "#ef4444", tit: "3. MIENTRAS ESTÁS DISTRAÍDO", val: "UN TOQUE ABRE TU MEMORIA", sub: "O explota fallas en sistemas sin actualizar" },
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
  const alPil = entra(tramo(tr, tPermiso - 0.1, tDistraido + 0.15));
  pildoraEstado(g, 540, 1715, "UN CHIP OCULTO DETRÁS DE LA PARED PIDE ACCESO A TUS DATOS", "245, 158, 11", alPil, 32, true);
  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

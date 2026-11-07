import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(2).inicio - 0.04;
const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.inicio - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tInternet = f2.t("internet");
  const tChip = f2.t("chip");
  const tUbicacion = f2.t("ubicación");

  fondoMesaClara(g, tr, "fria");

  const cam = camino2D([
    [t0, [1.0, 540, 1080]],
    [tInternet, [1.02, 540, 1110]],
    [tUbicacion + 0.15, [1.1, 540, 1215]],
    [tCorte - 0.18, [1.1, 540, 1215]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const slideY = (1 - entra(tramo(tr, t0, t0 + 0.22))) * 34;
  const uChip = suave(tramo(tr, tChip - 0.35, tUbicacion + 0.1));

  g.save();
  vista(g, Z, cx, cy);
  g.translate(0, slideY);

  // Tarjeta superior: Llamadas e Internet APAGADOS
  redondo(g, 90, 600, 900, 410, 34);
  g.fillStyle = "#0e1726";
  g.fill();
  g.strokeStyle = "#475569";
  g.lineWidth = 4;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("LO QUE SÍ APAGA EL MODO AVIÓN", 540, 665);

  const items = [
    { x: 300, tit: "LLAMADAS", sub: "Antena celular OFF" },
    { x: 780, tit: "INTERNET", sub: "WiFi y Datos OFF" },
  ];
  for (const it of items) {
    redondo(g, it.x - 185, 725, 370, 230, 24);
    g.fillStyle = "#1e293b";
    g.fill();
    g.strokeStyle = "#64748b";
    g.lineWidth = 3;
    g.stroke();
    g.font = "800 38px Figtree";
    g.fillStyle = "#cbd5e1";
    g.fillText(it.tit, it.x, 800);
    g.font = "800 26px Figtree";
    g.fillStyle = "#f87171";
    g.fillText("✕ APAGADO", it.x, 885);
  }

  // Tarjeta inferior: Chip GPS de Ubicación ENCENDIDO
  redondo(g, 90, 1060, 900, 520, 34);
  g.fillStyle = "#061d17";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4.5;
  g.stroke();

  k.brillo(g, 540, 1320, 520, "34, 227, 155", 0.25 + 0.45 * uChip);

  redondo(g, 330, 1145, 420, 260, 26);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 4;
  g.stroke();

  g.font = "800 44px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("CHIP GPS", 540, 1235);
  g.font = "800 30px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("LECTOR DE UBICACIÓN", 540, 1300);

  g.font = "800 32px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("● SIGUE ENCENDIDO Y LEYENDO", 540, 1490);

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tChip - 0.1, tUbicacion + 0.15));
  pildoraEstado(g, 540, 1715, "APAGA TU INTERNET · PERO DEJA PRENDIDO EL CHIP GPS", "16, 185, 129", alPil, 33, true);

  vineta(g, 0.32);
  capaSuperiorMarca(g, 0.68);
}

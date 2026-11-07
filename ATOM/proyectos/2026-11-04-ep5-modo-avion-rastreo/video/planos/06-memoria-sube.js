import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(7).inicio - 0.04;
const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tGuarda = f7.t("guarda");
  const tSube = f7.t("sube");
  const tQuitas = f7.t("quitas");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#0d1a2f");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 1120, 880, "56, 189, 248", 0.25);
  g.restore();

  const cam = camino2D([
    [t0, [1.0, 540, 1140]],
    [tGuarda, [1.04, 540, 1160]],
    [tQuitas + 0.15, [1.06, 540, 1100]],
    [tCorte - 0.18, [1.06, 540, 1100]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uSube = suave(tramo(tr, tSube - 0.15, tQuitas + 0.25));

  g.save();
  vista(g, Z, cx, cy);

  // Arriba: Servidores / Nube recibiendo el paquete apenas quitas el Modo Avión
  redondo(g, 140, 620, 800, 290, 32);
  g.fillStyle = "#0c192c";
  g.fill();
  g.strokeStyle = uSube > 0.3 ? "#38bdf8" : "#334155";
  g.lineWidth = 4;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 32px Figtree";
  g.fillStyle = "#7dd3fc";
  g.fillText("SERVIDOR EN LA NUBE (AL QUITAR MODO AVIÓN)", 540, 700);
  g.font = "800 46px Figtree";
  g.fillStyle = uSube > 0.4 ? "#22e39b" : "#64748b";
  g.fillText(uSube > 0.4 ? "↑ HISTORIAL COMPLETO SINCRONIZADO" : "ESPERANDO CONEXIÓN...", 540, 805);

  // Haz de subida de datos
  if (uSube > 0.05) {
    const py = mez(1220, 860, uSube);
    k.brillo(g, 540, py, 240, "56, 189, 248", 0.8);
    redondo(g, 370, py - 38, 340, 76, 18);
    g.fillStyle = "#0284c7";
    g.fill();
    g.strokeStyle = "#e0f2fe";
    g.lineWidth = 3;
    g.stroke();
    g.font = "800 26px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText("RUTA_GUARDADA.LOG", 540, py + 1);
  }

  // Abajo: Chip de Memoria Interna con horas exactas
  redondo(g, 140, 1110, 800, 460, 34);
  g.fillStyle = "#091322";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();

  g.font = "800 30px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("MEMORIA INTERNA · CACHÉ DE UBICACIÓN", 540, 1185);

  const logs = [
    "14:10:02 · Lat 19.432 · Lon -99.133 (Guardado)",
    "14:25:40 · Lat 19.438 · Lon -99.141 (Guardado)",
    "14:42:15 · Lat 19.445 · Lon -99.149 (Guardado)",
  ];
  logs.forEach((l, i) => {
    redondo(g, 195, 1245 + i * 95, 690, 74, 16);
    g.fillStyle = "#111e34";
    g.fill();
    g.strokeStyle = "#fbbf24";
    g.lineWidth = 2;
    g.stroke();
    g.font = "700 25px Figtree";
    g.fillStyle = "#f8fafc";
    g.fillText(l, 540, 1282 + i * 95);
  });

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tSube - 0.1, tQuitas + 0.15));
  pildoraEstado(g, 540, 1710, "SE GUARDA EN MEMORIA Y SE SUBE AL QUITAR EL MODO AVIÓN", "56, 189, 248", alPil, 32);

  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

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

export const desde = (v) => v.frase(5).inicio - 0.04;
const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tBoca = f5.t("boca");
  const tOjos = f5.t("ojos");
  const tAnotando = f5.t("anotando");
  const tLibreta = f5.t("libreta");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120c07");
  bg.addColorStop(0.55, "#26180e");
  bg.addColorStop(1, "#120b06");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 1180, 900, "251, 191, 36", 0.24);
  g.restore();

  const cam = camino2D([
    [t0, [1.08, 360, 1150]],
    [tBoca + 0.2, [1.08, 380, 1150]],
    [tOjos, [1.08, 700, 1150]],
    [tCorte - 0.18, [1.0, 540, 1150]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uEscribe = suave(tramo(tr, tOjos - 0.1, tLibreta + 0.15));

  g.save();
  vista(g, Z, cx, cy);

  // IZQUIERDA: Boca tapada con cinta (No habla / No emite)
  redondo(g, 65, 680, 435, 840, 34);
  g.fillStyle = "#1c1917";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 4;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 30px Figtree";
  g.fillStyle = "#fde68a";
  g.fillText("BOCA CON CINTA", 282, 755);

  // Silueta de cabeza con ojos abiertos y cinta en la boca
  g.fillStyle = "#334155";
  g.beginPath();
  g.arc(282, 1060, 145, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = "#94a3b8";
  g.lineWidth = 4;
  g.stroke();

  // Ojos bien abiertos mirando a la derecha
  for (const ox of [230, 334]) {
    g.fillStyle = "#ffffff";
    g.beginPath(); g.arc(ox, 1015, 28, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#0ea5e9";
    g.beginPath(); g.arc(ox + 8, 1015, 13, 0, Math.PI * 2); g.fill();
  }

  // Cinta cruzada sobre la boca
  g.save();
  g.translate(282, 1120);
  g.rotate(-0.12);
  redondo(g, -95, -24, 190, 48, 10);
  g.fillStyle = "#f59e0b";
  g.fill();
  g.font = "800 22px Figtree";
  g.fillStyle = "#1c1917";
  g.fillText("SIN HABLAR", 0, 1);
  g.restore();

  g.font = "800 26px Figtree";
  g.fillStyle = "#cbd5e1";
  g.fillText("No emite sonido", 282, 1340);
  g.fillStyle = "#38bdf8";
  g.fillText("¡Pero sí ve todo!", 282, 1395);

  // DERECHA: Libreta abierta anotando cada calle
  redondo(g, 540, 680, 475, 840, 34);
  g.fillStyle = "#fef3c7";
  g.fill();
  g.strokeStyle = "#f59e0b";
  g.lineWidth = 5;
  g.stroke();

  g.font = "800 32px Figtree";
  g.fillStyle = "#78350f";
  g.fillText("LIBRETA DE CALLES", 777, 760);

  const calles = [
    "14:05 · Av. Reforma 240",
    "14:18 · Calle 12 Norte",
    "14:32 · Plaza Central",
    "14:47 · Café del Parque",
  ];
  const nLineas = Math.max(1, Math.ceil(uEscribe * calles.length));
  g.textAlign = "left";
  for (let i = 0; i < nLineas; i++) {
    const ly = 875 + i * 130;
    redondo(g, 585, ly - 42, 385, 88, 18);
    g.fillStyle = "#ffffff";
    g.fill();
    g.strokeStyle = "#10b981";
    g.lineWidth = 3;
    g.stroke();
    g.font = "800 27px Figtree";
    g.fillStyle = "#064e3b";
    g.fillText("✓ " + calles[i], 610, ly + 2);
  }

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tAnotando - 0.1, tLibreta + 0.15));
  pildoraEstado(g, 540, 1710, "NO HABLA HACIA AFUERA · PERO ANOTA CADA CALLE ADENTRO", "251, 191, 36", alPil, 32);

  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

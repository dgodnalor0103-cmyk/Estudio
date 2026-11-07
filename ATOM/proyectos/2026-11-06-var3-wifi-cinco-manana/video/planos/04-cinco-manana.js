// Plano 04 (Frase 5): «Peor aún: en iPhone, a las cinco de la mañana se reconecta solo mientras duermes.»
// Mesa de noche cálida-oscura con un reloj despertador digital corriendo desde las 11:45 PM hasta las 05:00 AM;
// al dar las 05:00 AM, el iPhone dormido se ilumina solo y reconecta su WiFi sin que nadie lo toque.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelular,
  dibujarOndasWifi,
  pildoraEstado,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = "Peor";

const { suave, tramo, entra, mez, redondo } = k;

function formatearMadrugada(progreso) {
  // De 23:45 (1425 min) a 29:00 (1740 min -> 05:00 AM)
  const minTot = Math.round(mez(23 * 60 + 45, 29 * 60, progreso));
  const h24 = Math.floor(minTot / 60) % 24;
  const m = minTot % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return {
    hora: `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
    ampm,
  };
}

export function dibuja(g, t) {
  const f5 = v.frase(5);
  const t0 = f5.inicio - 0.04;
  const tCorte = v.frase(6).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tCinco = f5.t("cinco");
  const tReconecta = f5.t("reconecta");

  const uReloj = suave(tramo(tr, t0 + 0.1, tCinco + 0.05));
  const uDespierta = entra(tramo(tr, tCinco + 0.04, tReconecta + 0.25));
  const esCinco = tr >= tCinco;

  // Fondo nocturno cálido-ámbar de dormitorio (contrasta de inmediato con el verde-azulado del plano 03)
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#120c10");
  bg.addColorStop(0.55, "#231512");
  bg.addColorStop(1, "#331d14");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.luzCalida(g, 540, 740, 560, 0.55 + 0.35 * uDespierta, esCinco ? "255, 170, 60" : "180, 110, 60");
  g.restore();

  const cam = camino2D([
    [t0, [0.98, 540, 980]],
    [tCinco, [1.04, 540, 1010]],
    [tReconecta + 0.35, [1.08, 540, 1060]],
    [tCorte - 0.18, [1.08, 540, 1060]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Superficie de madera de la mesa de noche al fondo
  redondo(g, 60, 820, 960, 980, 40);
  const mg = g.createLinearGradient(0, 820, 0, 1800);
  mg.addColorStop(0, "#3b2416");
  mg.addColorStop(1, "#1a0f09");
  g.fillStyle = mg;
  g.fill();
  g.strokeStyle = "rgba(255, 200, 140, 0.18)";
  g.lineWidth = 3;
  g.stroke();

  // Reloj despertador digital sobre la mesa (y: 715)
  const rx = 540, ry = 715, rw = 640, rh = 220;
  g.shadowColor = "rgba(0,0,0,0.65)";
  g.shadowBlur = 40;
  g.shadowOffsetY = 18;
  redondo(g, rx - rw / 2, ry - rh / 2, rw, rh, 36);
  g.fillStyle = "#0b0d13";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  g.strokeStyle = esCinco ? "rgba(255, 184, 48, 0.85)" : "rgba(255, 255, 255, 0.22)";
  g.lineWidth = 4;
  g.stroke();

  const { hora, ampm } = formatearMadrugada(uReloj);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = '800 118px "JetBrains Mono", Figtree';
  g.shadowColor = esCinco ? "rgba(255, 184, 48, 0.85)" : "rgba(255, 110, 70, 0.45)";
  g.shadowBlur = esCinco ? 30 : 14;
  g.fillStyle = esCinco ? "#ffb830" : "#ff8a65";
  g.fillText(hora, rx - 42, ry + 4);

  g.font = "800 42px Figtree";
  g.shadowBlur = 0;
  g.fillStyle = esCinco ? "#ffe099" : "rgba(255, 200, 180, 0.7)";
  g.fillText(ampm, rx + 215, ry + 18);

  // Ondas azules cuando el iPhone se reconecta solo a las 5:00 AM
  if (uDespierta > 0.02) {
    dibujarOndasWifi(g, 540, 1285, tr, "47, 124, 246", uDespierta * 0.95, 420, 4, 1.15);
  }

  // iPhone sobre la mesa: pasa de pantalla dormida oscura a encenderse solo a las 05:00 AM
  dibujarCelular(g, 540, 1285, 440, 760, {
    estadoWifi: "azul",
    transicionBlanco: 1 - uDespierta,
    rayosX: 0,
    antenaViva: 1,
    brilloPantalla: mez(0.18, 1.0, uDespierta),
    t: tr,
    modoPantalla: "dormido",
    horaTexto: hora,
  });

  g.restore();

  sinVista(g);
  const alPildora = entra(tramo(tr, tReconecta - 0.08, tReconecta + 0.25));
  pildoraEstado(g, 540, 1730, "05:00 AM · SE RECONECTA SOLO", "255, 184, 48", alPildora, 42);

  vineta(g, 0.56);
  capaSuperiorMarca(g, 0.68);
}

// Plano 03 (Frases 3 y 4):
// «El cable original trae un microchip que negocia el voltaje exacto con tu celular.»
// «Carga rápido hasta el 80 % y frena solo para no calentar la batería.»
// Un solo sitio azul profundo con viaje continuo de cámara: primero en el microchip del conector intercambiando
// pulsos con el celular (20 W OK), y luego subiendo a la pantalla donde la batería trepa a 80 % y activa su freno frío.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularCarga,
  dibujarConectorUsbC,
  insigniaEpisodio,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(3).inicio - 0.04;

const { suave, tramo, entra, mez } = k;

function fondoLaboratorioAzul(g, t) {
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050b16");
  bg.addColorStop(0.45, "#0b1d38");
  bg.addColorStop(1, "#061224");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  // Anillos de radar suave que respiran
  g.strokeStyle = "rgba(56, 189, 248, 0.12)";
  g.lineWidth = 2.5;
  for (const r of [240, 420, 600]) {
    g.beginPath();
    g.arc(540, 1180, r + Math.sin(t * 1.6) * 8, 0, Math.PI * 2);
    g.stroke();
  }
  k.brillo(g, 540, 1180, 920, "34, 211, 238", 0.18);
  g.restore();
}

export function dibuja(g, t) {
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const t0 = f3.inicio - 0.04;
  const tCorte = v.frase(5).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tMicrochip = f3.t("microchip");
  const tNegocia = f3.t("negocia");
  const tVoltaje = f3.t("voltaje");
  const tCarga = f4.t("Carga");
  const t80 = f4.t("80");
  const tFrena = f4.t("frena");

  fondoLaboratorioAzul(g, tr);

  // Viaje de cámara: arranca cerca del conector + chip de carga manteniendo la pantalla debajo de los subtítulos
  const cam = camino2D([
    [t0, [1.14, 540, 1215]],
    [tVoltaje, [1.16, 540, 1195]],
    [tCarga - 0.15, [1.14, 540, 1180]],
    [t80 + 0.15, [1.02, 540, 995]],
    [tFrena + 0.4, [1.05, 540, 985]],
    [tCorte - 0.18, [1.05, 540, 985]],
  ]);
  const [Z, cx, cy] = cam(tr);

  // Progreso de batería: sube de 26 % a 80 % en «Carga rápido hasta el 80 %», y de 80 % a 82 % muy suave al frenar
  const uRapido = suave(tramo(tr, tCarga - 0.1, t80 + 0.45));
  const uFreno = suave(tramo(tr, tFrena - 0.1, tFrena + 0.3));
  const pct = tr < tCarga - 0.1
    ? mez(22, 26, tramo(tr, t0, tCarga - 0.1))
    : uFreno > 0.05
    ? mez(80, 82, tramo(tr, tFrena, tCorte - 0.2))
    : mez(26, 80, uRapido);

  g.save();
  vista(g, Z, cx, cy);

  const info = dibujarCelularCarga(g, 540, 1055, 550, 960, {
    pct,
    modoCarga: uFreno > 0.3 ? "frenada" : "rapida",
    tempC: 31,
    rayosX: 1,
    calorPuerto: 0,
    t: tr,
  });

  // Conector original blanco abierto mostrando su microchip E-Marker
  const yPlug = info.puertoY - 10;
  dibujarConectorUsbC(g, 540, yPlug, {
    tipo: "original",
    escala: 1.32,
    abierto: 1,
    largoCable: 460,
    t: tr,
  });

  // Paquetes de negociación bidireccional entre el microchip del cable y el chip del celular (Frase 3)
  const alNegocia = entra(tramo(tr, tMicrochip - 0.2, tMicrochip + 0.2)) * (1 - suave(tramo(tr, tCarga + 0.2, t80)));
  if (alNegocia > 0.02) {
    g.save();
    g.globalAlpha = alNegocia;
    const yChipCable = yPlug + 155;
    const yChipCel = info.chipY;

    // Canal luminoso entre ambos chips
    g.strokeStyle = "rgba(56, 189, 248, 0.5)";
    g.lineWidth = 6;
    g.setLineDash([12, 10]);
    g.beginPath();
    g.moveTo(540, yChipCable);
    g.lineTo(540, yChipCel);
    g.stroke();
    g.setLineDash([]);

    // 4 esferas de datos subiendo y bajando
    for (let i = 0; i < 4; i++) {
      const ida = i % 2 === 0;
      const fase = ((tr * 1.7 + i * 0.25) % 1 + 1) % 1;
      const u = ida ? fase : 1 - fase;
      const py = mez(yChipCable, yChipCel, u);
      const px = 540 + (ida ? -22 : 22);
      k.brillo(g, px, py, 58, ida ? "56, 189, 248" : "34, 227, 155", 0.9);
    }

    // Tarjetas laterales de diálogo digital
    const uOk = entra(tramo(tr, tNegocia - 0.05, tVoltaje + 0.2));
    if (uOk > 0.02) {
      g.globalAlpha = alNegocia * uOk;
      redondo(g, 650, yPlug + 60, 290, 92, 20);
      g.fillStyle = "rgba(8, 25, 38, 0.94)";
      g.fill();
      g.strokeStyle = "#38bdf8";
      g.lineWidth = 3;
      g.stroke();
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.font = "800 30px Figtree";
      g.fillStyle = "#7dd3fc";
      g.fillText("9 V · 20 W OK", 795, yPlug + 106);
    }
    g.restore();
  }

  // Escudo esmeralda de freno automático al 80 % (Frase 4)
  if (uFreno > 0.02) {
    g.save();
    g.globalAlpha = uFreno;
    const esc = 0.86 + 0.14 * uFreno;
    g.translate(540, 1135);
    g.scale(esc, esc);
    redondo(g, -215, -54, 430, 108, 26);
    g.fillStyle = "rgba(6, 46, 34, 0.95)";
    g.fill();
    g.strokeStyle = "#22e39b";
    g.lineWidth = 4;
    g.stroke();

    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "800 36px Figtree";
    g.fillStyle = "#6ee7b7";
    g.fillText("✓ FRENO AL 80 %", 0, -12);
    g.font = "700 25px Figtree";
    g.fillStyle = "#d1fae5";
    g.fillText("Batería fría · 31 °C", 0, 26);
    g.restore();
  }

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tVoltaje - 0.1, tVoltaje + 0.2)) * (1 - suave(tramo(tr, tCarga - 0.25, tCarga - 0.02)));
  pildoraEstado(g, 540, 1705, "VOLTAJE NEGOCIADO AL MILÍMETRO", "56, 189, 248", alP1, 40);

  const alP2 = entra(tramo(tr, tFrena - 0.06, tFrena + 0.24));
  pildoraEstado(g, 540, 1705, "80 % → PASA A CARGA SUAVE", "34, 227, 155", alP2, 42);

  vineta(g, 0.5);
  capaSuperiorMarca(g, 0.62);
}

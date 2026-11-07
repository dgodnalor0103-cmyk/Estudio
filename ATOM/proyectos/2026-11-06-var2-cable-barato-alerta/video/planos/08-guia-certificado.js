// Plano 08 (Frase 9):
// «Para evitarlo, usa cables certificados y desconéctalo de inmediato si la punta se calienta.»
// Estudio claro ("menta") de alto contraste tras el plano nocturno:
// - Tarjeta 1 (presente desde Fotograma 1): Cable blanco trenzado certificado con microchip activo y check esmeralda.
// - Tarjeta 2 (entra en «desconéctalo»): Conector caliente que se desenchufa hacia abajo al instante cortando el riesgo.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarConectorUsbC,
  fondoMesaClara,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(9).inicio - 0.04;

const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f9 = v.frase(9);
  const t0 = f9.inicio - 0.04;
  const tCorte = v.frase(10).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tCertificados = f9.t("certificados");
  const tDesconectalo = f9.t("desconéctalo");
  const tCalienta = f9.t("calienta");

  fondoMesaClara(g, tr, "menta");

  const cam = camino2D([
    [t0, [1.0, 540, 1080]],
    [tDesconectalo, [1.02, 540, 1150]],
    [tCorte - 0.18, [1.05, 540, 1170]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const slide1 = (1 - entra(tramo(tr, t0, t0 + 0.22))) * 36;
  const uCard2 = entra(tramo(tr, tDesconectalo - 0.14, tDesconectalo + 0.24));
  const uDesenchufa = suave(tramo(tr, tDesconectalo + 0.08, tCalienta + 0.15));

  g.save();
  vista(g, Z, cx, cy);

  // ---------------- TARJETA 1: USA CABLES CERTIFICADOS ----------------
  g.save();
  g.translate(0, slide1);

  const c1X = 88;
  const c1Y = 615;
  const cW = 904;
  const cH = 445;

  g.shadowColor = "rgba(15, 45, 38, 0.22)";
  g.shadowBlur = 36;
  g.shadowOffsetY = 16;
  redondo(g, c1X, c1Y, cW, cH, 34);
  g.fillStyle = "#0d1b22";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  redondo(g, c1X, c1Y, cW, cH, 34);
  g.strokeStyle = "#10b981";
  g.lineWidth = 4.5;
  g.stroke();

  // Ilustración izquierda: conector blanco original con radiografía verde encendida
  g.save();
  redondo(g, c1X + 26, c1Y + 26, 250, cH - 52, 24);
  g.fillStyle = "#071318";
  g.fill();
  g.clip();
  dibujarConectorUsbC(g, c1X + 151, c1Y + 86, {
    tipo: "original",
    escala: 1.15,
    abierto: suave(tramo(tr, t0 + 0.1, tCertificados + 0.2)),
    t: tr,
  });
  g.restore();

  // Texto y sello de certificación a la derecha
  redondo(g, c1X + 310, c1Y + 54, 248, 54, 16);
  g.fillStyle = "rgba(16, 185, 129, 0.18)";
  g.fill();
  g.strokeStyle = "#34d399";
  g.lineWidth = 2.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 25px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("✓ REGLA 1 · SEGURO", c1X + 434, c1Y + 81);

  g.textAlign = "left";
  g.font = "800 44px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("Cable certificado", c1X + 310, c1Y + 168);

  g.font = "700 30px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("USB-IF / MFi con chip", c1X + 310, c1Y + 224);

  // Medidor verde frío animado
  const wOk = mez(180, 510, suave(tramo(tr, t0 + 0.15, tCertificados + 0.35)));
  redondo(g, c1X + 310, c1Y + 286, 510, 26, 13);
  g.fillStyle = "#1e293b";
  g.fill();
  redondo(g, c1X + 310, c1Y + 286, wOk, 26, 13);
  g.fillStyle = "#22e39b";
  g.fill();

  g.font = "800 26px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("VOLTAJE REGULADO · 31 °C FRÍO", c1X + 310, c1Y + 356);
  g.restore();

  // ---------------- TARJETA 2: DESCONÉCTALO SI LA PUNTA SE CALIENTA ----------------
  if (uCard2 > 0.01) {
    g.save();
    g.globalAlpha = uCard2;
    g.translate(0, (1 - uCard2) * 58);

    const c2X = 88;
    const c2Y = 1105;

    g.shadowColor = "rgba(15, 45, 38, 0.24)";
    g.shadowBlur = 36;
    g.shadowOffsetY = 16;
    redondo(g, c2X, c2Y, cW, cH, 34);
    g.fillStyle = "#161118";
    g.fill();
    g.shadowBlur = 0;
    g.shadowOffsetY = 0;

    redondo(g, c2X, c2Y, cW, cH, 34);
    g.strokeStyle = "#fb923c";
    g.lineWidth = 4.5;
    g.stroke();

    // Ventana izquierda: puerto superior y conector caliente desenchufándose hacia abajo
    g.save();
    redondo(g, c2X + 26, c2Y + 26, 250, cH - 52, 24);
    g.fillStyle = "#0e0a0e";
    g.fill();
    g.clip();

    // Borde inferior de celular arriba
    redondo(g, c2X + 60, c2Y + 12, 182, 74, 18);
    g.fillStyle = "#334155";
    g.fill();
    redondo(g, c2X + 120, c2Y + 70, 62, 14, 6);
    g.fillStyle = "#020617";
    g.fill();

    // Conector caliente bajando y enfriándose al desconectarse
    const yPlug = mez(c2Y + 78, c2Y + 215, uDesenchufa);
    dibujarConectorUsbC(g, c2X + 151, yPlug, {
      tipo: "barato",
      escala: 0.98,
      calor: 1 - uDesenchufa * 0.65,
      t: tr,
    });

    // Flecha verde de desconexión hacia abajo
    g.fillStyle = "#fbbf24";
    g.font = "800 38px Figtree";
    g.textAlign = "center";
    g.fillText("⬇", c2X + 151, c2Y + 152);
    g.restore();

    redondo(g, c2X + 310, c2Y + 54, 290, 54, 16);
    g.fillStyle = "rgba(251, 146, 60, 0.18)";
    g.fill();
    g.strokeStyle = "#fb923c";
    g.lineWidth = 2.5;
    g.stroke();

    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "800 25px Figtree";
    g.fillStyle = "#fdba74";
    g.fillText("⚠ REGLA 2 · AL INSTANTE", c2X + 455, c2Y + 81);

    g.textAlign = "left";
    g.font = "800 42px Figtree";
    g.fillStyle = "#ffffff";
    g.fillText("¿Punta caliente?", c2X + 310, c2Y + 168);

    g.font = "700 30px Figtree";
    g.fillStyle = "#fda4af";
    g.fillText("Desconéctalo de inmediato", c2X + 310, c2Y + 224);

    g.font = "800 26px Figtree";
    g.fillStyle = "#fde047";
    g.fillText("SALVAS EL CHIP Y LA BATERÍA", c2X + 310, c2Y + 332);
    g.restore();
  }

  g.restore();

  sinVista(g);
  const alPil = entra(tramo(tr, tCertificados - 0.1, tCertificados + 0.22));
  pildoraEstado(g, 540, 1715, "CABLE CERTIFICADO = CELULAR PROTEGIDO", "16, 185, 129", alPil, 38, true);

  vineta(g, 0.3);
  capaSuperiorMarca(g, 0.68);
}

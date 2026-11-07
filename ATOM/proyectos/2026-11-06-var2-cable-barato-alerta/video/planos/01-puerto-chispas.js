// Plano 01 (Frase 1):
// «¿Sabías que la carga rápida original no daña tu celular, pero un cable barato sí puede quemarlo por dentro?»
// Mosaico oscuro estilo Sovera, insignia MITOS DE TU CELULAR · EP. 2. El cable blanco original carga frío y estable;
// en «cable barato» entra el conector genérico negro, abre rayos X en el puerto inferior y lanza chispas térmicas.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularCarga,
  dibujarChispas,
  dibujarConectorUsbC,
  fondoMosaico,
  insigniaEpisodio,
  pildoraEstado,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = 0;

const { suave, tramo, entra } = k;

export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tOriginal = f1.t("original");
  const tPero = f1.t("pero");
  const tCable = f1.t("cable");
  const tBarato = f1.t("barato");
  const tQuemarlo = f1.t("quemarlo");

  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tPero, [1.02, 540, 990]],
    [tBarato, [1.1, 540, 1140]],
    [tQuemarlo + 0.35, [1.24, 540, 1280]],
    [tCorte - 0.18, [1.24, 540, 1280]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uCambio = suave(tramo(tr, tPero - 0.08, tBarato + 0.12));
  const uCalor = suave(tramo(tr, tBarato + 0.05, tQuemarlo + 0.28));
  const colLuz = k.mezRgb("47, 124, 246", "255, 88, 36", uCalor);
  fondoMosaico(g, tr, -tr * 24, tr * 16, colLuz, 0.32);

  g.save();
  vista(g, Z, cx, cy);

  const pct = uCalor > 0.1
    ? 76
    : k.mez(64, 76, suave(tramo(tr, 0.15, tPero)));
  const tempC = k.mez(31, 92, uCalor);

  const info = dibujarCelularCarga(g, 540, 1050, 550, 970, {
    pct,
    modoCarga: uCalor > 0.35 ? "peligro" : "rapida",
    tempC,
    rayosX: suave(tramo(tr, tBarato - 0.08, tQuemarlo + 0.15)),
    calorPuerto: uCalor,
    t: tr,
  });

  // Pulsos azules limpios subiendo por el cable original durante la primera mitad
  if (uCambio < 0.95) {
    const xOrig = k.mez(540, 160, uCambio);
    const yOrig = k.mez(info.puertoY - 12, info.puertoY + 120, uCambio);
    g.save();
    g.globalAlpha = 1 - uCambio;
    dibujarConectorUsbC(g, xOrig, yOrig, {
      tipo: "original",
      escala: 1.0,
      abierto: suave(tramo(tr, tOriginal - 0.1, tOriginal + 0.35)) * 0.85,
      t: tr,
    });
    for (let i = 0; i < 3; i++) {
      const fase = ((tr * 1.35 + i / 3) % 1 + 1) % 1;
      const py = yOrig + 320 - fase * 290;
      k.brillo(g, xOrig, py, 56, "56, 189, 248", (1 - uCambio) * 0.75);
    }
    g.restore();
  }

  // Entrada del cable barato en «pero un cable barato»
  if (uCambio > 0.02) {
    const xBar = k.mez(880, 540, uCambio);
    const yBar = k.mez(info.puertoY + 160, info.puertoY - 12, uCambio);
    dibujarConectorUsbC(g, xBar, yBar, {
      tipo: "barato",
      escala: 1.0,
      abierto: 0,
      calor: uCalor,
      t: tr,
    });
  }

  // Chispas eléctricas en el puerto cuando «sí puede quemarlo por dentro»
  if (uCalor > 0.15) {
    dibujarChispas(g, info.puertoX, info.puertoY - 8, tr, uCalor, 51, "255, 120, 35");
  }

  g.restore();

  sinVista(g);
  const alIns = entra(tramo(tr, 0, 0.22)) * (1 - suave(tramo(tr, tPero - 0.25, tPero + 0.2)));
  const escIns = 0.88 + 0.12 * entra(tramo(tr, 0, 0.26));
  insigniaEpisodio(g, 540, 645, "ALERTA EN TU CELULAR", "92 °C", "ORIGINAL VS. CABLE BARATO", "#ff5722", alIns, escIns);

  const alPil = entra(tramo(tr, tQuemarlo - 0.1, tQuemarlo + 0.22));
  pildoraEstado(g, 540, 1690, "⚠ PELIGRO EN EL PUERTO · 92 °C", "255, 82, 48", alPil, 42);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

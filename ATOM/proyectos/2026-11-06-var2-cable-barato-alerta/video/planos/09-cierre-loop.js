// Plano 09 (Frases 10 y 11):
// F10: «Envíaselo a ese amigo que siempre compra el cable más barato de la esquina.»
// F11: «Y mañana, episodio tres: dónde quedan de verdad las fotos que borras de tu celular.»
// Regresa al mosaico oscuro del Fotograma 0:
// - En F10 brilla el emblema de avión de papel con ondas azules de compartir.
// - En F11 entra la insignia `MAÑANA · EP. 3` con una vista previa animada de una foto borrada en papelera
//   que sigue intacta dentro del chip de memoria; en los últimos 0.5 s todo se pliega dejando el Fotograma 0 exacto.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularCarga,
  dibujarConectorUsbC,
  fondoMosaico,
  insigniaEpisodio,
  pildoraEstado,
  redondo,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(10).inicio - 0.04;

const { suave, tramo, entra, mez } = k;

function dibujarAvionCompartir(g, x, y, al, pulso) {
  if (al <= 0.01) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha = al;

  for (let i = 0; i < 2; i++) {
    const f = ((pulso + i * 0.5) % 1 + 1) % 1;
    g.strokeStyle = `rgba(56, 189, 248, ${(1 - f) * 0.6})`;
    g.lineWidth = 4;
    g.beginPath();
    g.arc(0, 0, 74 + f * 96, 0, Math.PI * 2);
    g.stroke();
  }

  g.shadowColor = "rgba(14, 165, 233, 0.55)";
  g.shadowBlur = 32;
  g.fillStyle = "#0f172a";
  g.beginPath();
  g.arc(0, 0, 76, 0, Math.PI * 2);
  g.fill();
  g.shadowBlur = 0;
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 4;
  g.stroke();

  // Ícono vectorial limpio de avión de papel (Share)
  g.fillStyle = "#e0f2fe";
  g.beginPath();
  g.moveTo(-34, 4);
  g.lineTo(34, -28);
  g.lineTo(8, 34);
  g.lineTo(-4, 10);
  g.closePath();
  g.fill();

  g.strokeStyle = "#0284c7";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(34, -28);
  g.lineTo(-4, 10);
  g.stroke();
  g.restore();
}

function dibujarAdelantoFotosChip(g, x, y, al, t) {
  if (al <= 0.01) return;
  g.save();
  g.translate(x, y);
  g.globalAlpha = al;

  // Tarjeta-chip translúcida mostrando una foto «BORRADA» que sigue encendida en silicio
  g.shadowColor = "rgba(0, 0, 0, 0.68)";
  g.shadowBlur = 36;
  redondo(g, -250, -105, 500, 210, 28);
  g.fillStyle = "rgba(9, 16, 28, 0.95)";
  g.fill();
  g.shadowBlur = 0;
  g.strokeStyle = "#22e39b";
  g.lineWidth = 3.5;
  g.stroke();

  // Mini foto luminosa a la izquierda
  redondo(g, -218, -72, 144, 144, 18);
  const fg = g.createLinearGradient(-218, -72, -74, 72);
  fg.addColorStop(0, "#38bdf8");
  fg.addColorStop(1, "#6366f1");
  g.fillStyle = fg;
  g.fill();

  // Sol y montañas en la foto
  g.fillStyle = "#fde047";
  g.beginPath();
  g.arc(-116, -34, 16, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#0f172a";
  g.beginPath();
  g.moveTo(-218, 54);
  g.lineTo(-170, -4);
  g.lineTo(-125, 42);
  g.lineTo(-96, 12);
  g.lineTo(-74, 54);
  g.lineTo(-74, 72);
  g.lineTo(-218, 72);
  g.closePath();
  g.fill();

  // Pulso verde de celdas NAND alrededor de la foto
  k.brillo(g, -146, 0, 140, "34, 227, 155", 0.45 + 0.25 * Math.sin(t * 7));

  g.textAlign = "left";
  g.textBaseline = "middle";
  g.font = "800 24px Figtree";
  g.fillStyle = "#fda4af";
  g.fillText("✕ PAPELERA VACÍA", -46, -38);

  g.font = "800 30px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("CHIP: FOTO INTACTA", -46, 10);

  g.font = "700 22px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("Celdas NAND sin sobrescribir", -46, 52);

  g.restore();
}

export function dibuja(g, t) {
  const f10 = v.frase(10);
  const f11 = v.frase(11);
  const t0 = f10.inicio - 0.04;
  const tFin = v.duracion;

  const tAmigo = f10.t("amigo");
  const tManana = f11.t("mañana");
  const tFotos = f11.t("fotos");

  // Loop suave al Fotograma 0 en los últimos 0.55 s (sin frenar antes para encajar exacto con t = 0)
  const uLoop = suave(tramo(t, tFin - 0.58, tFin - 0.04));

  // Viaje amplio de cámara desde el conector original hacia el encuadre general para mantener acción viva en 45-48 s
  const cam = camino2D([
    [t0, [1.32, 540, 1265]],
    [tAmigo + 0.4, [1.16, 540, 1110]],
    [tManana, [1.03, 540, 980]],
    [tFin - 0.45, [1.0, 540, 960]],
    [tFin, [1.0, 540, 960]],
  ]);
  const [Z, cx, cy] = cam(t);

  // Desplazamiento periódico exacto (1 baldosa de 270 px en X e Y) para loop invisible sin rebobinado brusco
  const progPlano = tramo(t, t0, tFin);
  const dxMos = -progPlano * 270;
  const dyMos = progPlano * 270;
  const tLuz = Math.sin(progPlano * Math.PI) * 2.4;
  fondoMosaico(g, tLuz, dxMos, dyMos, "47, 124, 246", 0.32);

  g.save();
  vista(g, Z, cx, cy);

  // El porcentaje sube con vida durante F10 y luego converge a 64 % (idéntico al Fotograma 0 de 01-puerto-chispas.js)
  const pctF10 = mez(56, 84, suave(tramo(t, t0, f11.inicio - 0.15)));
  const pct = t < tManana ? pctF10 : mez(84, 64, suave(tramo(t, tManana, tFin - 0.25)));
  const info = dibujarCelularCarga(g, 540, 1050, 550, 970, {
    pct,
    modoCarga: "rapida",
    tempC: 31,
    rayosX: 0,
    calorPuerto: 0,
    t: tLuz,
  });

  dibujarConectorUsbC(g, 540, info.puertoY - 12, {
    tipo: "original",
    escala: 1.0,
    abierto: 0,
    t: tLuz,
  });

  // Número entero de ciclos (14) para que en t = tFin la fase coincida exacta con t = 0 sin salto
  const nCiclos = Math.max(1, Math.round((tFin - t0) * 1.35));
  for (let i = 0; i < 3; i++) {
    const fase = ((progPlano * nCiclos + i / 3) % 1 + 1) % 1;
    const py = info.puertoY - 12 + 320 - fase * 290;
    k.brillo(g, 540, py, 56, "56, 189, 248", 0.75);
  }

  g.restore();

  sinVista(g);

  // Fase F10: Emblema de compartir + píldora de amigo
  const alShare = entra(tramo(t, t0 + 0.08, t0 + 0.32)) * (1 - suave(tramo(t, f11.inicio - 0.28, f11.inicio - 0.04)));
  dibujarAvionCompartir(g, 540, 650, alShare, (t - t0) * 0.9);
  pildoraEstado(g, 540, 1705, "ENVÍASELO A ESE AMIGO DEL CABLE BARATO", "56, 189, 248", alShare, 36);

  // Fase F11: Insignia `MAÑANA · EP. 3` + adelanto visual de la foto en el chip (se retiran antes de tFin)
  const alEp3 = entra(tramo(t, tManana - 0.08, tManana + 0.22)) * (1 - uLoop);
  const escEp3 = 0.9 + 0.1 * entra(tramo(t, tManana - 0.08, tManana + 0.26));
  insigniaEpisodio(
    g,
    540,
    665,
    "MAÑANA · MITOS DE TU CELULAR",
    "EP. 3",
    "TUS FOTOS BORRADAS SIGUEN EN EL CHIP",
    "#22E39B",
    alEp3,
    escEp3
  );

  const alChip = entra(tramo(t, tFotos - 0.28, tFotos + 0.15)) * (1 - uLoop);
  dibujarAdelantoFotosChip(g, 540, 1625, alChip, t);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

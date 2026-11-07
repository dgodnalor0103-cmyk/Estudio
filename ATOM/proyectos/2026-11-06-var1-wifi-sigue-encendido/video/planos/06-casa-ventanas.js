// Plano 06 (Frase 7): «Es como cerrar con llave tu puerta, pero dejar todas las ventanas abiertas.»
// Analogía física tangible estilo Sovera: fachada nocturna azul índigo de una casa de dos pisos.
// Abajo la puerta de roble se cierra con un candado de bronce macizo, pero arriba las 3 ventanas se abren de par en par
// dejando escapar conos de luz cálida y corrientes de datos.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarOndasWifi,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(7).inicio - 0.04;

const { suave, tramo, entra, mez } = k;

function dibujarCandado(g, x, y, cerrado, escala = 1) {
  g.save();
  g.translate(x, y);
  g.scale(escala, escala);

  // Arco de acero del candado (baja al cerrar con llave)
  const dyArco = mez(-24, 0, cerrado);
  g.save();
  g.translate(0, dyArco);
  g.strokeStyle = "#e2e8f0";
  g.lineWidth = 14;
  g.lineCap = "round";
  g.beginPath();
  g.arc(0, -34, 28, Math.PI, 0, false);
  g.lineTo(28, -8);
  g.moveTo(-28, -34);
  g.lineTo(-28, -2);
  g.stroke();
  g.restore();

  // Cuerpo de latón/bronce pulido
  g.shadowColor = "rgba(0, 0, 0, 0.6)";
  g.shadowBlur = 24;
  g.shadowOffsetY = 10;
  redondo(g, -46, -14, 92, 78, 18);
  k.metal(g, -46, 46, ["#926218", "#fde08d", "#d49b35", "#fff2c2", "#784d10"]);
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  // Ojo de la cerradura
  g.fillStyle = "#291a05";
  g.beginPath();
  g.arc(0, 18, 9, 0, Math.PI * 2);
  g.fill();
  g.beginPath();
  g.moveTo(-4, 20);
  g.lineTo(4, 20);
  g.lineTo(7, 42);
  g.lineTo(-7, 42);
  g.closePath();
  g.fill();

  if (cerrado > 0.85) {
    k.brillo(g, 24, -4, 55, "255, 230, 140", (cerrado - 0.85) * 3.5);
  }
  g.restore();
}

function dibujarVentanaPisoAlto(g, cx, cy, w, h, apertura, t, semilla) {
  // Cono cálido de luz que escapa hacia afuera cuando la ventana se abre
  if (apertura > 0.03) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const lg = g.createRadialGradient(cx, cy, 12, cx, cy - 50, 260);
    lg.addColorStop(0, `rgba(255, 214, 120, ${0.72 * apertura})`);
    lg.addColorStop(0.5, `rgba(255, 175, 75, ${0.28 * apertura})`);
    lg.addColorStop(1, "rgba(255, 150, 50, 0)");
    g.fillStyle = lg;
    g.beginPath();
    g.moveTo(cx - w / 2, cy + h / 2);
    g.lineTo(cx - w * 1.15, cy - h * 1.35);
    g.lineTo(cx + w * 1.15, cy - h * 1.35);
    g.lineTo(cx + w / 2, cy + h / 2);
    g.closePath();
    g.fill();
    g.restore();

    // Ondas de señal/datos saliendo libremente por la ventana abierta
    dibujarOndasWifi(g, cx, cy - 10, t + semilla * 0.3, "96, 185, 255", apertura * 0.72, 185, 3, 1.15);
  }

  // Marco exterior de piedra clara
  redondo(g, cx - w / 2 - 10, cy - h / 2 - 10, w + 20, h + 20, 10);
  g.fillStyle = "#3a4870";
  g.fill();

  // Interior iluminado cálido de la habitación superior
  redondo(g, cx - w / 2, cy - h / 2, w, h, 6);
  const ig = g.createLinearGradient(0, cy - h / 2, 0, cy + h / 2);
  ig.addColorStop(0, apertura > 0.05 ? "#ffe7a8" : "#151d33");
  ig.addColorStop(1, apertura > 0.05 ? "#f59e0b" : "#0e1424");
  g.fillStyle = ig;
  g.fill();

  // Cruceta clásica del marco de la ventana para que se lea nítida al abrirse
  g.fillStyle = apertura > 0.05 ? "#4a3219" : "#222e4d";
  g.fillRect(cx - 4, cy - h / 2, 8, h);
  g.fillRect(cx - w / 2, cy - 4, w, 8);

  // Hojas batientes (postigos de madera que se abren limpios hacia afuera sin cruzar la ventana)
  const skewY = 12 * apertura;

  // Hoja izquierda (bisagra en cx - w/2)
  g.fillStyle = "#1e2947";
  g.strokeStyle = "#526696";
  g.lineWidth = 3;
  const xIzq = cx - w / 2 + mez(w / 2 - 1, -w * 0.38, apertura);
  g.beginPath();
  g.moveTo(cx - w / 2, cy - h / 2);
  g.lineTo(xIzq, cy - h / 2 - skewY);
  g.lineTo(xIzq, cy + h / 2 + skewY);
  g.lineTo(cx - w / 2, cy + h / 2);
  g.closePath();
  g.fill();
  g.stroke();

  // Hoja derecha (bisagra en cx + w/2)
  const xDer = cx + w / 2 + mez(-(w / 2 - 1), w * 0.38, apertura);
  g.beginPath();
  g.moveTo(cx + w / 2, cy - h / 2);
  g.lineTo(xDer, cy - h / 2 - skewY);
  g.lineTo(xDer, cy + h / 2 + skewY);
  g.lineTo(cx + w / 2, cy + h / 2);
  g.closePath();
  g.fill();
  g.stroke();

  // Alféizar inferior
  redondo(g, cx - w / 2 - 16, cy + h / 2 + 4, w + 32, 16, 6);
  g.fillStyle = "#4d5f8c";
  g.fill();
}

export function dibuja(g, t) {
  const f7 = v.frase(7);
  const t0 = f7.inicio - 0.04;
  const tCorte = v.frase(8).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tCerrar = f7.t("cerrar");
  const tLlave = f7.t("llave");
  const tTodas = f7.t("todas");
  const tVentanas = f7.t("ventanas");
  const tAbiertas = f7.t("abiertas");

  // Cielo crepuscular azul-índigo intenso (contrasta fuerte con el verde cenital del plano 05)
  g.save();
  sinVista(g);
  const sky = g.createLinearGradient(0, 0, 0, 1920);
  sky.addColorStop(0, "#0c132b");
  sky.addColorStop(0.55, "#1b2957");
  sky.addColorStop(1, "#121a36");
  g.fillStyle = sky;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.16, 540, 1290]],
    [tLlave + 0.25, [1.14, 540, 1275]],
    [tVentanas + 0.15, [0.98, 540, 1090]],
    [tCorte - 0.18, [0.98, 540, 1090]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Jardín y vereda de entrada
  g.fillStyle = "#0e172e";
  g.fillRect(-150, 1610, 1380, 420);
  // Sendero de piedra hacia la puerta
  g.fillStyle = "#222f4f";
  g.beginPath();
  g.moveTo(430, 1615);
  g.lineTo(650, 1615);
  g.lineTo(760, 1960);
  g.lineTo(320, 1960);
  g.closePath();
  g.fill();

  // Fachada de la casa de dos pisos (x: 130..950, y: 740..1620)
  g.shadowColor = "rgba(0, 0, 0, 0.6)";
  g.shadowBlur = 45;
  g.shadowOffsetY = 20;
  redondo(g, 140, 750, 800, 870, 14);
  const fg = g.createLinearGradient(140, 750, 940, 1620);
  fg.addColorStop(0, "#2b3964");
  fg.addColorStop(1, "#1d2747");
  g.fillStyle = fg;
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  // Tejado inclinado con alero
  g.beginPath();
  g.moveTo(85, 765);
  g.lineTo(540, 565);
  g.lineTo(995, 765);
  g.closePath();
  const tg = g.createLinearGradient(0, 565, 0, 765);
  tg.addColorStop(0, "#1c223b");
  tg.addColorStop(1, "#0f1426");
  g.fillStyle = tg;
  g.fill();
  g.strokeStyle = "#485b8f";
  g.lineWidth = 6;
  g.stroke();

  // Cornisa divisoria entre planta baja y piso alto
  redondo(g, 126, 1140, 828, 24, 8);
  g.fillStyle = "#3c4e7d";
  g.fill();

  // Las 3 ventanas del piso alto (se abren de par en par en «todas las ventanas abiertas»)
  const uV1 = entra(tramo(tr, tTodas - 0.05, tVentanas + 0.12));
  const uV2 = entra(tramo(tr, tTodas + 0.08, tVentanas + 0.24));
  const uV3 = entra(tramo(tr, tTodas + 0.2, tAbiertas + 0.15));

  dibujarVentanaPisoAlto(g, 285, 955, 138, 195, uV1, tr, 1);
  dibujarVentanaPisoAlto(g, 540, 955, 148, 195, uV2, tr, 2);
  dibujarVentanaPisoAlto(g, 795, 955, 138, 195, uV3, tr, 3);

  // Puerta principal de madera maciza en la planta baja (x: 430..650, y: 1235..1615)
  redondo(g, 412, 1218, 256, 402, 18);
  g.fillStyle = "#45588a";
  g.fill();

  // Interior oscuro detrás de la puerta antes de cerrarse del todo
  g.fillStyle = "#0a0f1d";
  g.fillRect(428, 1234, 224, 382);

  const uPuerta = suave(tramo(tr, tCerrar - 0.14, tCerrar + 0.22));
  const anchoHoja = mez(135, 224, uPuerta);
  g.save();
  redondo(g, 428, 1234, anchoHoja, 382, 8);
  const madera = g.createLinearGradient(428, 1234, 428 + anchoHoja, 1616);
  madera.addColorStop(0, "#7c4a27");
  madera.addColorStop(0.5, "#5e351a");
  madera.addColorStop(1, "#3d210f");
  g.fillStyle = madera;
  g.fill();
  g.strokeStyle = "#996139";
  g.lineWidth = 3;
  g.stroke();

  // Cuarterones tallados de la puerta
  if (anchoHoja > 170) {
    g.strokeStyle = "rgba(35, 16, 6, 0.55)";
    g.lineWidth = 4;
    redondo(g, 456, 1268, anchoHoja - 56, 135, 6); g.stroke();
    redondo(g, 456, 1435, anchoHoja - 56, 140, 6); g.stroke();
  }
  g.restore();

  // Escalones de entrada
  redondo(g, 385, 1605, 310, 26, 8);
  g.fillStyle = "#394973";
  g.fill();

  // Candado dorado gigante que entra y cierra con llave en «con llave tu puerta»
  const uEntraCandado = entra(tramo(tr, tCerrar + 0.08, tLlave));
  const uCierraLlave = suave(tramo(tr, tLlave - 0.04, tLlave + 0.22));
  if (uEntraCandado > 0.01) {
    dibujarCandado(g, 540, 1425, uCierraLlave, 0.7 + 0.45 * uEntraCandado);
  }

  g.restore();

  sinVista(g);
  const alPildora = entra(tramo(tr, tAbiertas - 0.12, tAbiertas + 0.22));
  pildoraEstado(g, 540, 1735, "PUERTA CERRADA · VENTANAS ABIERTAS", "255, 196, 77", alPildora, 38);

  vineta(g, 0.56);
  capaSuperiorMarca(g, 0.66);
}

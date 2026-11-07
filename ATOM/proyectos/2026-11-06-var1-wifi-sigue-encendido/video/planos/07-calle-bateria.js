// Plano 07 (Frase 8): «En la calle, ese rastreo gasta batería y registra por qué tiendas pasaste.»
// Escena nocturna urbana en movimiento: el celular camina frente a 3 escaparates iluminados (CAFÉ, MODA, TECH).
// Arriba un medidor físico de batería cae en vivo de 88 % a 54 % mientras los routers comerciales registran cada paso.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelular,
  dibujarIconoWifi,
  dibujarOndasWifi,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(8).inicio - 0.04;

const { suave, tramo, entra, mez, mezColor } = k;

function dibujarTienda(g, x, yBase, nombre, colorToldo, colorNeon, detectada, horaPin) {
  const w = 350, h = 470;
  const x0 = x - w / 2;
  const y0 = yBase - h;

  g.save();
  // Fachada del local comercial
  redondo(g, x0, y0, w, h, 14);
  g.fillStyle = "#18142c";
  g.fill();
  g.strokeStyle = "rgba(255,255,255,0.14)";
  g.lineWidth = 3;
  g.stroke();

  // Escaparate iluminado de cristal
  const vx = x0 + 26, vy = y0 + 145, vw = w - 52, vh = 265;
  redondo(g, vx, vy, vw, vh, 12);
  const vg = g.createLinearGradient(0, vy, 0, vy + vh);
  vg.addColorStop(0, `rgba(${colorNeon}, 0.34)`);
  vg.addColorStop(1, "rgba(20, 16, 38, 0.92)");
  g.fillStyle = vg;
  g.fill();
  g.strokeStyle = `rgba(${colorNeon}, 0.55)`;
  g.lineWidth = 2.5;
  g.stroke();

  // Toldo rayado comercial
  g.beginPath();
  g.moveTo(x0 - 14, y0 + 85);
  g.lineTo(x0 + w + 14, y0 + 85);
  g.lineTo(x0 + w + 26, y0 + 150);
  g.lineTo(x0 - 26, y0 + 150);
  g.closePath();
  g.fillStyle = colorToldo;
  g.fill();

  // Letrero luminoso superior
  redondo(g, x0 + 34, y0 + 18, w - 68, 52, 12);
  g.fillStyle = "#0b0817";
  g.fill();
  g.strokeStyle = `rgb(${colorNeon})`;
  g.lineWidth = 3;
  g.stroke();

  g.font = "800 32px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.shadowColor = `rgba(${colorNeon}, 0.85)`;
  g.shadowBlur = 16;
  g.fillStyle = "#ffffff";
  g.fillText(nombre, x, y0 + 45);
  g.shadowBlur = 0;

  // Nodo WiFi comercial sobre la fachada
  const wx = x, wy = y0 - 28;
  g.beginPath();
  g.arc(wx, wy, 26, 0, Math.PI * 2);
  g.fillStyle = detectada > 0.1 ? `rgb(${colorNeon})` : "#262142";
  g.fill();
  dibujarIconoWifi(g, wx, wy, 18, detectada > 0.1 ? "#090612" : "#94a3b8", 0);

  // Etiqueta flotante de registro cuando pasas frente a la tienda
  if (detectada > 0.02) {
    g.save();
    g.translate(wx, wy - 66 * entra(detectada));
    g.globalAlpha = detectada;
    const txt = `REGISTRADO · ${horaPin}`;
    g.font = "800 24px Figtree";
    const tw = g.measureText(txt).width + 36;
    redondo(g, -tw / 2, -22, tw, 44, 14);
    g.fillStyle = "#ff3b5c";
    g.fill();
    g.fillStyle = "#ffffff";
    g.fillText(txt, 0, 1);
    g.restore();
  }

  g.restore();
  return { wx, wy };
}

function dibujarMedidorBateria(g, x, y, nivel) {
  // nivel: 0.88 -> 0.54
  const pct = Math.round(nivel * 100);
  const col = nivel > 0.74 ? "#22e39b" : nivel > 0.62 ? "#ffb830" : "#ff4757";

  g.save();
  g.translate(x, y);

  g.shadowColor = "rgba(0,0,0,0.65)";
  g.shadowBlur = 32;
  g.shadowOffsetY = 12;
  redondo(g, -330, -56, 660, 112, 30);
  g.fillStyle = "rgba(13, 11, 28, 0.92)";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  g.strokeStyle = "rgba(255,255,255,0.22)";
  g.lineWidth = 3;
  g.stroke();

  // Ícono físico de batería a la izquierda
  const bx = -282, by = -28, bw = 156, bh = 56;
  redondo(g, bx, by, bw, bh, 14);
  g.strokeStyle = "#e2e8f0";
  g.lineWidth = 4;
  g.stroke();
  redondo(g, bx + bw + 4, -12, 9, 24, 4);
  g.fillStyle = "#e2e8f0";
  g.fill();

  const fillW = Math.max(12, (bw - 14) * nivel);
  redondo(g, bx + 7, by + 7, fillW, bh - 14, 9);
  g.fillStyle = col;
  g.fill();

  // Porcentaje grande a la derecha
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.font = '800 50px "JetBrains Mono", Figtree';
  g.fillStyle = col;
  g.shadowColor = col;
  g.shadowBlur = 18;
  g.fillText(`${pct}%`, -92, 2);
  g.shadowBlur = 0;

  g.font = "800 32px Figtree";
  g.fillStyle = "rgba(235, 240, 255, 0.88)";
  g.fillText("BATERÍA", 42, 2);

  g.restore();
}

export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tRastreo = f8.t("rastreo");
  const tGasta = f8.t("gasta");
  const tRegistra = f8.t("registra");
  const tTiendas = f8.t("tiendas");

  // Fondo nocturno púrpura-urbano (contrasta con el índigo-madera de la casa del plano 06)
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#0b0718");
  bg.addColorStop(0.6, "#1a1133");
  bg.addColorStop(1, "#0d091c");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.0, 540, 1020]],
    [tCorte - 0.18, [1.03, 540, 1035]],
  ]);
  const [Z, cx, cy] = cam(tr);

  // Desplazamiento horizontal suave de la avenida comercial (frena limpio con tr)
  const avance = suave(tramo(tr, t0, tCorte - 0.18));
  const scrollX = -avance * 470;

  g.save();
  vista(g, Z, cx, cy);

  // Vereda y asfalto húmedo con reflejos de neón
  g.fillStyle = "#120e24";
  g.fillRect(-120, 1390, 1340, 560);
  g.fillStyle = "#262044";
  g.fillRect(-120, 1382, 1340, 16);

  // Las 3 tiendas pasando detrás mientras caminas por la calle
  const tiendas = [
    { x: 340 + scrollX, nombre: "CAFÉ", toldo: "#b45309", neon: "251, 191, 36", tPing: tRastreo + 0.15, hora: "18:12" },
    { x: 780 + scrollX, nombre: "MODA", toldo: "#be123c", neon: "244, 114, 182", tPing: tRegistra - 0.05, hora: "18:19" },
    { x: 1220 + scrollX, nombre: "TIENDA", toldo: "#1d4ed8", neon: "56, 189, 248", tPing: tTiendas - 0.15, hora: "18:27" },
  ];

  // Posición del celular caminando en primer plano (con leve paso humano)
  const paso = Math.sin((tr - t0) * 8.5) * 9 * (1 - tramo(tr, tCorte - 0.5, tCorte - 0.16));
  const telX = 330;
  const telY = 1425 + paso;

  for (const td of tiendas) {
    const uDet = entra(tramo(tr, td.tPing - 0.08, td.tPing + 0.25));
    const nodo = dibujarTienda(g, td.x, 1385, td.nombre, td.toldo, td.neon, uDet, td.hora);

    if (uDet > 0.02) {
      g.save();
      g.globalCompositeOperation = "lighter";
      g.strokeStyle = `rgba(255, 75, 110, ${0.72 * uDet})`;
      g.lineWidth = 5;
      g.setLineDash([14, 12]);
      g.lineDashOffset = -tr * 180;
      g.beginPath();
      g.moveTo(telX + 35, telY - 150);
      g.lineTo(nodo.wx, nodo.wy);
      g.stroke();
      g.restore();
    }
  }

  // Ondas de rastreo saliendo del celular en la calle
  const uOndas = entra(tramo(tr, tRastreo - 0.25, tRastreo + 0.2));
  dibujarOndasWifi(g, telX, telY - 40, tr, "255, 90, 120", 0.35 + 0.6 * uOndas, 340, 4, 1.2);

  // El celular en primer plano con la antena encendida gastando batería
  dibujarCelular(g, telX, telY, 290, 540, {
    estadoWifi: "azul",
    transicionBlanco: 1,
    rayosX: 0.92,
    antenaViva: 1,
    brilloPantalla: 0.85,
    t: tr,
    modoPantalla: "barra",
    horaTexto: "18:27",
  });

  g.restore();

  // Medidor de batería cayendo en vivo arriba de los escaparates
  sinVista(g);
  const uDrenaje = suave(tramo(tr, tGasta - 0.15, tTiendas + 0.35));
  const nivelBat = mez(0.88, 0.54, uDrenaje);
  dibujarMedidorBateria(g, 540, 648, nivelBat);

  const alPildora = entra(tramo(tr, tRegistra - 0.05, tTiendas + 0.2));
  pildoraEstado(g, 540, 1742, "RASTREO COMERCIAL + GASTO DE BATERÍA", "255, 90, 120", alPildora, 38);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.68);
}

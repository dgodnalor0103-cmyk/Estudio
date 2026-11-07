// Plano 02 (Frase 2): «Y esta noche, cuando apagues la luz, va a seguir buscando redes.»
// El cuarto cálido iluminado por la lámpara de noche; en «apagues la luz» se apaga de golpe a azul nocturno
// con un haz de luna por la ventana, la cámara se acerca a la mesa de noche y el celular dispara ondas buscando redes.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarOndasWifi,
  pildoraEstado,
  relojPlano,
  redondo,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = "esta";

const { suave, tramo, entra, mez, mezColor } = k;

export function dibuja(g, t) {
  const f2 = v.frase(2);
  const t0 = f2.t("esta") - 0.04;
  const tCorte = v.frase(3).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tApagues = f2.t("apagues");
  const tLuz = f2.t("luz");
  const tSeguir = f2.t("seguir");
  const tBuscando = f2.t("buscando");

  // 0 = cuarto iluminado cálido, 1 = luz apagada (noche azul profunda)
  const uNoche = suave(tramo(tr, tApagues + 0.06, tLuz + 0.14));

  const cam = camino2D([
    [t0, [1.0, 540, 980]],
    [tLuz + 0.1, [1.05, 560, 1020]],
    [tBuscando + 0.45, [1.34, 650, 1210]],
    [tCorte - 0.18, [1.34, 650, 1210]],
  ]);
  const [Z, cx, cy] = cam(tr);

  g.save();
  vista(g, Z, cx, cy);

  // Pared del cuarto (transición de crema cálido iluminado a azul medianoche)
  const paredSup = mezColor("#e8d4b7", "#0a1224", uNoche);
  const paredInf = mezColor("#c8ab86", "#111d36", uNoche);
  const pg = g.createLinearGradient(0, 260, 0, 1460);
  pg.addColorStop(0, paredSup);
  pg.addColorStop(1, paredInf);
  g.fillStyle = pg;
  g.fillRect(-200, 100, 1500, 1380);

  // Textura suave en la pared
  g.save();
  g.globalCompositeOperation = "multiply";
  g.globalAlpha = 0.16;
  g.drawImage(k.manchas, -120, 150, 1400, 1400);
  g.restore();

  // Suelo de madera del dormitorio
  const sueloSup = mezColor("#8c5e3c", "#0d1526", uNoche);
  const sueloInf = mezColor("#5c3a21", "#060a14", uNoche);
  const sg = g.createLinearGradient(0, 1440, 0, 2000);
  sg.addColorStop(0, sueloSup);
  sg.addColorStop(1, sueloInf);
  g.fillStyle = sg;
  g.fillRect(-200, 1440, 1500, 620);

  // Zócalo
  g.fillStyle = mezColor("#f5ead8", "#182642", uNoche);
  g.fillRect(-200, 1422, 1500, 22);

  // Ventana del cuarto arriba a la derecha con cielo nocturno y estrellas
  const wx = 660, wy = 560, ww = 310, wh = 430;
  k.redondo(g, wx - 16, wy - 16, ww + 32, wh + 32, 12);
  g.fillStyle = mezColor("#f7efe2", "#1c2b47", uNoche);
  g.fill();

  g.save();
  k.redondo(g, wx, wy, ww, wh, 6);
  g.clip();
  const sky = g.createLinearGradient(0, wy, 0, wy + wh);
  sky.addColorStop(0, "#050914");
  sky.addColorStop(1, "#132347");
  g.fillStyle = sky;
  g.fillRect(wx, wy, ww, wh);

  // Luna creciente y estrellitas en la ventana
  g.fillStyle = "#eef6ff";
  g.beginPath();
  g.arc(wx + 220, wy + 105, 36, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#091228";
  g.beginPath();
  g.arc(wx + 234, wy + 96, 32, 0, Math.PI * 2);
  g.fill();

  const az = k.azar(77);
  for (let i = 0; i < 18; i++) {
    const sx = wx + 20 + az() * (ww - 40);
    const sy = wy + 20 + az() * (wh - 60);
    const br = 0.4 + 0.6 * Math.sin(tr * 3 + i);
    g.fillStyle = `rgba(255,255,255,${br * 0.8})`;
    g.beginPath();
    g.arc(sx, sy, 1.8 + (i % 2), 0, Math.PI * 2);
    g.fill();
  }
  g.restore();

  // Cruceta de la ventana
  g.fillStyle = mezColor("#efe3d0", "#16233b", uNoche);
  g.fillRect(wx + ww / 2 - 7, wy, 14, wh);
  g.fillRect(wx, wy + wh / 2 - 7, ww, 14);

  // Cama a la izquierda (cabecera, almohada y cobija)
  k.redondo(g, -60, 1020, 520, 430, 24);
  g.fillStyle = mezColor("#6b442a", "#101829", uNoche);
  g.fill();
  // Almohada
  k.redondo(g, 30, 1110, 290, 95, 36);
  g.fillStyle = mezColor("#fbf7f0", "#223252", uNoche);
  g.fill();
  // Colchón y cobija
  k.redondo(g, -60, 1185, 540, 265, 28);
  g.fillStyle = mezColor("#3b6ea5", "#15284a", uNoche);
  g.fill();

  // Mesa de noche a la derecha-centro (x: 520..880, y: 1250..1520)
  const mx = 530, my = 1265, mw = 350, mh = 250;
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 32;
  g.shadowOffsetY = 14;
  k.redondo(g, mx, my, mw, mh, 16);
  g.fillStyle = mezColor("#7c4d2b", "#131c2e", uNoche);
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  // Tapa superior de madera
  k.redondo(g, mx - 14, my - 14, mw + 28, 28, 10);
  g.fillStyle = mezColor("#9c653d", "#1d2b45", uNoche);
  g.fill();
  // Cajón y tirador
  k.redondo(g, mx + 28, my + 42, mw - 56, 86, 10);
  g.strokeStyle = mezColor("#59351c", "#0a101d", uNoche);
  g.lineWidth = 4;
  g.stroke();
  g.beginPath();
  g.arc(mx + mw / 2, my + 85, 10, 0, Math.PI * 2);
  g.fillStyle = mezColor("#e0b354", "#485c7a", uNoche);
  g.fill();

  // Lámpara de noche sobre la izquierda de la mesa (x: 605, y: 1252)
  const lx = 605, ly = 1252;
  // Cono cálido de luz cuando está encendida
  if (uNoche < 0.99) {
    const alLampara = 1 - uNoche;
    g.save();
    g.globalCompositeOperation = "lighter";
    const lg = g.createRadialGradient(lx, ly - 125, 15, lx, ly - 40, 520);
    lg.addColorStop(0, `rgba(255, 210, 125, ${0.75 * alLampara})`);
    lg.addColorStop(0.45, `rgba(255, 180, 85, ${0.28 * alLampara})`);
    lg.addColorStop(1, "rgba(255, 160, 60, 0)");
    g.fillStyle = lg;
    g.fillRect(lx - 540, ly - 560, 1080, 1080);
    g.restore();
  }
  // Base y poste de la lámpara
  k.redondo(g, lx - 36, ly - 16, 72, 18, 8);
  g.fillStyle = mezColor("#d4a857", "#2c3a52", uNoche);
  g.fill();
  g.fillRect(lx - 6, ly - 110, 12, 96);
  // Pantalla de la lámpara
  g.beginPath();
  g.moveTo(lx - 44, ly - 190);
  g.lineTo(lx + 44, ly - 190);
  g.lineTo(lx + 68, ly - 98);
  g.lineTo(lx - 68, ly - 98);
  g.closePath();
  g.fillStyle = mezColor("#fff1cc", "#233047", uNoche);
  g.fill();

  // Haz diagonal de luz de luna entrando por la ventana cuando se apaga la lámpara (exactamente como Sovera 0:06!)
  if (uNoche > 0.02) {
    g.save();
    g.globalCompositeOperation = "lighter";
    const mg = g.createLinearGradient(wx + 160, wy + 180, 450, 1600);
    mg.addColorStop(0, `rgba(130, 185, 255, ${0.26 * uNoche})`);
    mg.addColorStop(0.65, `rgba(95, 155, 255, ${0.14 * uNoche})`);
    mg.addColorStop(1, "rgba(70, 130, 255, 0)");
    g.fillStyle = mg;
    g.beginPath();
    g.moveTo(wx, wy + wh);
    g.lineTo(wx + ww, wy + wh);
    g.lineTo(790, 1780);
    g.lineTo(260, 1780);
    g.closePath();
    g.fill();
    g.restore();
  }

  // El celular apoyado en perspectiva sobre la mesa de noche (x: 765, y: 1244)
  const px = 760, py = 1244;
  // Ondas WiFi fantasma saliendo del celular hacia la oscuridad del cuarto en «seguir buscando redes»
  const uOndas = entra(tramo(tr, tSeguir - 0.15, tBuscando + 0.25));
  if (uOndas > 0.01) {
    dibujarOndasWifi(g, px, py - 8, tr, "56, 152, 255", uOndas * 0.95, 420, 4, 1.1);
    k.brillo(g, px, py - 10, 150, "56, 152, 255", uOndas * (0.45 + 0.25 * Math.sin(tr * 8)));
  }

  // Cuerpo del celular en perspectiva sobre la mesa
  g.save();
  g.translate(px, py);
  // Grosor metálico
  g.fillStyle = "#5c6b82";
  g.beginPath();
  g.moveTo(-78, 4);
  g.lineTo(78, 4);
  g.lineTo(94, 20);
  g.lineTo(-64, 20);
  g.closePath();
  g.fill();
  // Pantalla inclinada
  g.fillStyle = uOndas > 0.1 ? "#16305c" : "#0b1324";
  g.strokeStyle = "#9fb3d1";
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(-78, 4);
  g.lineTo(-52, -24);
  g.lineTo(86, -24);
  g.lineTo(78, 4);
  g.closePath();
  g.fill();
  g.stroke();
  g.restore();

  g.restore(); // fin cámara

  sinVista(g);
  const alPildora = entra(tramo(tr, tBuscando - 0.1, tBuscando + 0.25));
  pildoraEstado(g, 540, 1650, "BUSCANDO REDES EN SILENCIO", "82, 168, 255", alPildora, 42);

  vineta(g, mez(0.38, 0.68, uNoche));
  capaSuperiorMarca(g, mez(0.76, 0.58, uNoche));
}

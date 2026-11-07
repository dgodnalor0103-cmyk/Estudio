// Plano 08 (Frases 9 y 10):
// «Para apagarlo de raíz, entra a Ajustes y desactiva WiFi hasta verlo tachado.»
// «Y en Android, apaga también la búsqueda de WiFi dentro de Ubicación.»
// Estudio luminoso azul-plata en la mitad inferior (con zona superior oscura para contraste total de subtítulos):
// Tarjeta física 1 (Ajustes > Wi-Fi) con dedo real apagando el interruptor maestro y tachando el ícono;
// luego entra Tarjeta física 2 (Android · Ubicación > Búsqueda de Wi-Fi) apagando el escaneo oculto a 0 %.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarDedo,
  dibujarIconoWifi,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(9).inicio - 0.04;

const { suave, tramo, entra, pulso, mez, mezColor } = k;

function dibujarInterruptor(g, x, y, encendido, colEncendido = "#22c55e", escala = 1) {
  // encendido: 1 = ON (derecha), 0 = OFF (izquierda)
  g.save();
  g.translate(x, y);
  g.scale(escala, escala);
  const w = 152, h = 86;
  redondo(g, -w / 2, -h / 2, w, h, h / 2);
  g.fillStyle = mezColor("#cbd5e1", colEncendido, encendido);
  g.fill();
  g.strokeStyle = "rgba(15, 23, 42, 0.14)";
  g.lineWidth = 2.5;
  g.stroke();

  const kx = mez(-w / 2 + h / 2 + 4, w / 2 - h / 2 - 4, encendido);
  g.shadowColor = "rgba(0, 0, 0, 0.28)";
  g.shadowBlur = 12;
  g.shadowOffsetY = 4;
  g.beginPath();
  g.arc(kx, 0, h / 2 - 8, 0, Math.PI * 2);
  g.fillStyle = "#ffffff";
  g.fill();
  g.restore();
}

function dibujarEngranaje(g, x, y, r, giro) {
  g.save();
  g.translate(x, y);
  g.rotate(giro);
  g.fillStyle = "#475569";
  for (let i = 0; i < 8; i++) {
    g.save();
    g.rotate((i * Math.PI) / 4);
    redondo(g, -7, -r - 7, 14, 16, 4);
    g.fill();
    g.restore();
  }
  g.beginPath();
  g.arc(0, 0, r, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#f8fafc";
  g.beginPath();
  g.arc(0, 0, r * 0.44, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

export function dibuja(g, t) {
  const f9 = v.frase(9);
  const f10 = v.frase(10);
  const t0 = f9.inicio - 0.04;
  const tCorte = v.frase(11).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tAjustes = f9.t("Ajustes");
  const tDesactiva = f9.t("desactiva");
  const tTachado = f9.t("tachado");

  const tAndroid = f10.t("Android");
  const tApaga2 = f10.t("apaga");
  const tUbicacion2 = f10.t("Ubicación");

  // Fondo limpio de estudio azul acero / plata (oscuro arriba para subtítulos perfectos, luminoso en la mesa de trabajo)
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#091220");
  bg.addColorStop(0.28, "#12243d");
  bg.addColorStop(0.55, "#23426b");
  bg.addColorStop(1, "#182f4f");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 1140, 680, "140, 200, 255", 0.34);
  g.restore();

  const cam = camino2D([
    [t0, [0.98, 540, 1010]],
    [tDesactiva + 0.2, [1.03, 540, 1020]],
    [tAndroid + 0.25, [1.0, 540, 1060]],
    [tCorte - 0.18, [1.0, 540, 1060]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uPaso2 = suave(tramo(tr, tAndroid - 0.15, tAndroid + 0.35));
  const uOff1 = suave(tramo(tr, tDesactiva + 0.05, tDesactiva + 0.35));
  const uTachado = entra(tramo(tr, tTachado - 0.18, tTachado + 0.18));
  const uOff2 = suave(tramo(tr, tApaga2 + 0.08, tApaga2 + 0.38));

  g.save();
  vista(g, Z, cx, cy);

  // ==================== TARJETA 1: AJUSTES > WI-FI (visible desde el fotograma 1 del plano) ====================
  const c1Y = mez(960, 775, uPaso2);
  const c1Esc = mez(1.0, 0.86, uPaso2);
  const uEntraC1 = entra(tramo(tr, t0, t0 + 0.28));

  g.save();
  g.translate(540, c1Y + (1 - uEntraC1) * 36);
  g.scale(c1Esc, c1Esc);
  g.globalAlpha = mez(1, 0.78, uPaso2);

  g.shadowColor = "rgba(4, 12, 28, 0.52)";
  g.shadowBlur = 46;
  g.shadowOffsetY = 20;
  redondo(g, -435, -195, 870, 390, 42);
  g.fillStyle = "#f8fafc";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  // Cabecera Ajustes
  dibujarEngranaje(g, -355, -118, 24, tr * 0.8);
  g.textAlign = "left";
  g.textBaseline = "middle";
  g.font = "800 34px Figtree";
  g.fillStyle = "#475569";
  g.fillText("Ajustes  ›  Conexiones", -305, -118);

  // Línea separadora
  g.fillStyle = "#e2e8f0";
  g.fillRect(-390, -68, 780, 3);

  // Ícono redondo Wi-Fi con su tachado rojo real en «tachado»
  const ix = -325, iy = 42;
  g.beginPath();
  g.arc(ix, iy, 62, 0, Math.PI * 2);
  g.fillStyle = mezColor("#2f7cf6", "#1e293b", uOff1);
  g.fill();
  dibujarIconoWifi(g, ix, iy, 44, "#ffffff", uTachado);

  // Texto principal de la fila
  g.font = "800 52px Figtree";
  g.fillStyle = "#0f172a";
  g.fillText("Wi-Fi", -230, 18);

  g.font = "700 30px Figtree";
  g.fillStyle = uOff1 > 0.5 ? "#10b981" : "#64748b";
  g.fillText(uOff1 > 0.5 ? "Apagado de raíz ✓" : "Antena encendida", -230, 74);

  // Interruptor maestro 1
  const sw1X = 310, sw1Y = 42;
  dibujarInterruptor(g, sw1X, sw1Y, 1 - uOff1, "#22c55e", 1.08);

  // Monitor inferior de antena física dentro de la tarjeta
  redondo(g, -390, 124, 780, 48, 14);
  g.fillStyle = uOff1 > 0.5 ? "#dcfce7" : "#fee2e2";
  g.fill();
  g.textAlign = "center";
  g.font = "800 25px Figtree";
  g.fillStyle = uOff1 > 0.5 ? "#15803d" : "#b91c1c";
  g.fillText(
    uOff1 > 0.5 ? "CHIP DE ANTENA: 0 mW (DESACTIVADO REAL)" : "CHIP DE ANTENA: ACTIVO EN 2.º PLANO",
    0,
    149
  );
  g.restore();

  // ==================== TARJETA 2: ANDROID · UBICACIÓN > BÚSQUEDA DE WIFI ====================
  if (uPaso2 > 0.01) {
    const c2Y = mez(1480, 1235, uPaso2);
    g.save();
    g.translate(540, c2Y);
    g.globalAlpha = uPaso2;

    g.shadowColor = "rgba(4, 12, 28, 0.56)";
    g.shadowBlur = 46;
    g.shadowOffsetY = 20;
    redondo(g, -435, -185, 870, 370, 42);
    g.fillStyle = "#f8fafc";
    g.fill();
    g.shadowBlur = 0;
    g.shadowOffsetY = 0;

    // Píldora verde Android + Ruta Ubicación
    redondo(g, -390, -146, 165, 46, 14);
    g.fillStyle = "#dcfce7";
    g.fill();
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "800 25px Figtree";
    g.fillStyle = "#15803d";
    g.fillText("ANDROID", -307, -122);

    g.textAlign = "left";
    g.font = "800 32px Figtree";
    g.fillStyle = "#475569";
    g.fillText("Ubicación  ›  Servicios", -202, -122);

    g.fillStyle = "#e2e8f0";
    g.fillRect(-390, -80, 780, 3);

    //Fila Búsqueda de Wi-Fi
    g.font = "800 44px Figtree";
    g.fillStyle = "#0f172a";
    g.fillText("Búsqueda de Wi-Fi", -385, 6);

    g.font = "700 28px Figtree";
    g.fillStyle = uOff2 > 0.5 ? "#10b981" : "#ef4444";
    g.fillText(
      uOff2 > 0.5 ? "Escaneo oculto bloqueado ✓" : "Escaneando redes aunque Wi-Fi esté apagado",
      -385,
      62
    );

    const sw2X = 310, sw2Y = 18;
    dibujarInterruptor(g, sw2X, sw2Y, 1 - uOff2, "#2f7cf6", 1.05);

    redondo(g, -390, 112, 780, 48, 14);
    g.fillStyle = uOff2 > 0.5 ? "#dcfce7" : "#fef3c7";
    g.fill();
    g.textAlign = "center";
    g.font = "800 25px Figtree";
    g.fillStyle = uOff2 > 0.5 ? "#15803d" : "#b45309";
    g.fillText(
      uOff2 > 0.5 ? "RASTREO DE UBICACIÓN POR WIFI: 0 %" : "RASTREO EN SEGUNDO PLANO: ACTIVO",
      0,
      137
    );

    g.restore();
  }

  // Dedo humano 1: apaga el interruptor de Ajustes > Wi-Fi en la Frase 9
  const uEntraD1 = entra(tramo(tr, tAjustes + 0.15, tDesactiva + 0.05));
  const uSaleD1 = suave(tramo(tr, tDesactiva + 0.42, tDesactiva + 0.95));
  if (uEntraD1 > 0.01 && uSaleD1 < 0.99) {
    const xObj = 540 + 310 - uOff1 * 48;
    const yObj = c1Y + 42;
    const dx = mez(1060, xObj, uEntraD1) + uSaleD1 * 420;
    const dy = mez(1380, yObj, uEntraD1) + uSaleD1 * 320;
    dibujarDedo(g, dx, dy, -0.35, pulso(tr, tDesactiva + 0.16, 0.18), 0.98);
  }

  // Dedo humano 2: apaga Búsqueda de Wi-Fi en Android en la Frase 10
  const uEntraD2 = entra(tramo(tr, tAndroid + 0.22, tApaga2 + 0.08));
  const uSaleD2 = suave(tramo(tr, tApaga2 + 0.45, tApaga2 + 1.0));
  if (uEntraD2 > 0.01 && uSaleD2 < 0.99) {
    const xObj2 = 540 + 310 - uOff2 * 46;
    const yObj2 = mez(1480, 1235, uPaso2) + 18;
    const dx = mez(1060, xObj2, uEntraD2) + uSaleD2 * 420;
    const dy = mez(1580, yObj2, uEntraD2) + uSaleD2 * 300;
    dibujarDedo(g, dx, dy, -0.35, pulso(tr, tApaga2 + 0.18, 0.18), 0.98);
  }

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tTachado - 0.1, tTachado + 0.2)) * (1 - uPaso2);
  pildoraEstado(g, 540, 1730, "PASO 1 · APAGADO REAL EN AJUSTES", "34, 227, 155", alP1, 40);

  const alP2 = entra(tramo(tr, tUbicacion2 - 0.35, tUbicacion2 + 0.15));
  pildoraEstado(g, 540, 1730, "0 % RASTREO · BATERÍA PROTEGIDA", "34, 227, 155", alP2, 40);

  vineta(g, 0.48);
  capaSuperiorMarca(g, 0.82);
}

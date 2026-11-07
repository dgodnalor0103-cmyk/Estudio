// Plano 03 (Frases 3 y 4):
// «Apple confirma que ese botón solo te desconecta del router, pero deja la antena encendida.»
// «Lo hace para que AirDrop, tu reloj y la ubicación sigan funcionando.»
// Mesa técnica luminosa de aluminio azul-acero (alto contraste con el cuarto oscuro anterior y el dormitorio siguiente):
// primero se corta el puente con el router, y luego AirDrop, el reloj y Ubicación orbitan vivos recibiendo paquetes de datos.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelular,
  dibujarOndasWifi,
  dibujarRouter,
  pildoraEstado,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = "Apple";

const { suave, tramo, entra, mez, redondo } = k;

function fondoMesaTecnica(g, t) {
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#0b1624");
  bg.addColorStop(0.27, "#1a314a");
  bg.addColorStop(0.55, "#3b6285");
  bg.addColorStop(0.85, "#4c789e");
  bg.addColorStop(1, "#2c4b69");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  // Superficie clara cepillada en la zona de trabajo (y: 560..1860) para contraste inmediato de plano
  redondo(g, 36, 560, 1008, 1275, 44);
  const surf = g.createLinearGradient(0, 560, 0, 1835);
  surf.addColorStop(0, "rgba(218, 234, 248, 0.24)");
  surf.addColorStop(0.5, "rgba(195, 220, 242, 0.30)");
  surf.addColorStop(1, "rgba(140, 178, 212, 0.18)");
  g.fillStyle = surf;
  g.fill();
  g.strokeStyle = "rgba(226, 240, 255, 0.28)";
  g.lineWidth = 3;
  g.stroke();

  // Anillos concéntricos técnicos suaves sobre la mesa
  g.strokeStyle = "rgba(255, 255, 255, 0.10)";
  g.lineWidth = 2;
  for (const r of [240, 390, 540]) {
    g.beginPath();
    g.arc(540, 1180, r + Math.sin(t * 1.4) * 6, 0, Math.PI * 2);
    g.stroke();
  }
  g.restore();
}

function dibujarTarjetaAirdrop(g, x, y, al, pulsoHaz, t) {
  if (al <= 0.01) return;
  g.save();
  g.translate(x, y);
  const esc = 0.78 + 0.22 * al;
  g.scale(esc, esc);
  g.globalAlpha = al;

  g.shadowColor = "rgba(0,0,0,0.5)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 12;
  redondo(g, -96, -96, 192, 192, 44);
  g.fillStyle = "#0e1a2e";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  g.strokeStyle = "#60a5fa";
  g.lineWidth = 4;
  g.stroke();

  for (const r of [24, 44, 64]) {
    g.beginPath();
    g.arc(0, -8, r, -Math.PI * 1.22, Math.PI * 0.22);
    g.strokeStyle = `rgba(96, 165, 250, ${0.55 + 0.45 * Math.sin(t * 7 - r * 0.08)})`;
    g.lineWidth = 6.5;
    g.lineCap = "round";
    g.stroke();
  }
  g.fillStyle = "#60a5fa";
  g.beginPath();
  g.moveTo(0, -6);
  g.lineTo(-26, 40);
  g.lineTo(26, 40);
  g.closePath();
  g.fill();

  g.font = "800 29px Figtree";
  g.textAlign = "center";
  g.fillStyle = "#ffffff";
  g.fillText("AirDrop", 0, 72);
  if (pulsoHaz > 0.05) k.brillo(g, 0, 0, 155, "96, 165, 250", pulsoHaz * 0.6);
  g.restore();
}

function dibujarRelojInteligente(g, x, y, al, pulsoHaz, t) {
  if (al <= 0.01) return;
  g.save();
  g.translate(x, y);
  const esc = 0.78 + 0.22 * al;
  g.scale(esc, esc);
  g.globalAlpha = al;

  redondo(g, -44, -134, 88, 268, 28);
  g.fillStyle = "#172133";
  g.fill();

  g.shadowColor = "rgba(0,0,0,0.55)";
  g.shadowBlur = 28;
  g.shadowOffsetY = 12;
  redondo(g, -76, -86, 152, 172, 38);
  k.metal(g, -76, 76, ["#4c5666", "#e2ebf7", "#6e7b8f", "#2f3744"]);
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  redondo(g, 74, -36, 12, 34, 5);
  g.fillStyle = "#dce5f2";
  g.fill();

  redondo(g, -65, -75, 130, 150, 30);
  g.fillStyle = "#060b14";
  g.fill();

  g.strokeStyle = "#22e39b";
  g.lineWidth = 10.5;
  g.lineCap = "round";
  g.beginPath();
  g.arc(0, -10, 36, -Math.PI / 2, -Math.PI / 2 + Math.PI * (1.35 + 0.35 * Math.sin(t * 5)));
  g.stroke();

  g.fillStyle = "#ffffff";
  g.font = "800 24px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText("SYNC", 0, -10);

  g.font = "800 27px Figtree";
  g.fillStyle = "#9ef7d4";
  g.fillText("Reloj", 0, 50);

  if (pulsoHaz > 0.05) k.brillo(g, 0, 0, 160, "34, 227, 155", pulsoHaz * 0.6);
  g.restore();
}

function dibujarPinUbicacion(g, x, y, al, pulsoHaz, t) {
  if (al <= 0.01) return;
  g.save();
  g.translate(x, y);
  const esc = 0.78 + 0.22 * al;
  g.scale(esc, esc);
  g.globalAlpha = al;

  const onda = (t * 1.6) % 1;
  g.strokeStyle = `rgba(255, 200, 70, ${(1 - onda) * 0.9})`;
  g.lineWidth = 5;
  g.beginPath();
  g.ellipse(0, 62, 28 + onda * 68, 12 + onda * 26, 0, 0, Math.PI * 2);
  g.stroke();

  g.shadowColor = "rgba(0,0,0,0.55)";
  g.shadowBlur = 24;
  g.shadowOffsetY = 10;
  g.beginPath();
  g.moveTo(0, 60);
  g.bezierCurveTo(-56, 4, -68, -26, -68, -54);
  g.arc(0, -54, 68, Math.PI, 0, false);
  g.bezierCurveTo(68, -26, 56, 4, 0, 60);
  g.closePath();
  const pg = g.createLinearGradient(-55, -110, 55, 40);
  pg.addColorStop(0, "#ff875c");
  pg.addColorStop(0.55, "#ff3b30");
  pg.addColorStop(1, "#9e1912");
  g.fillStyle = pg;
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  g.beginPath();
  g.arc(0, -54, 25, 0, Math.PI * 2);
  g.fillStyle = "#ffffff";
  g.fill();

  // Tarjeta de etiqueta oscura debajo para legibilidad total sobre fondo acero
  redondo(g, -82, 78, 164, 44, 14);
  g.fillStyle = "rgba(10, 18, 32, 0.88)";
  g.fill();
  g.font = "800 26px Figtree";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#ffd97d";
  g.fillText("Ubicación", 0, 100);

  if (pulsoHaz > 0.05) k.brillo(g, 0, -25, 165, "255, 120, 70", pulsoHaz * 0.6);
  g.restore();
}

export function dibuja(g, t) {
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const t0 = f3.inicio - 0.04;
  const tCorte = v.frase(5).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tDesconecta = f3.t("desconecta");
  const tAntena = f3.t("antena");
  const tAirdrop = f4.t("AirDrop");
  const tReloj = f4.t("reloj");
  const tUbicacion = f4.t("ubicación");
  const tFuncionando = f4.t("funcionando");

  fondoMesaTecnica(g, tr);

  // Cámara viva durante toda la Frase 4 acompañando a AirDrop -> Reloj -> Ubicación -> cierre conjunto
  const cam = camino2D([
    [t0, [1.0, 540, 1010]],
    [tDesconecta + 0.25, [1.02, 560, 1000]],
    [tAntena + 0.35, [1.08, 430, 1130]],
    [tAirdrop + 0.2, [1.04, 430, 960]],
    [tReloj + 0.2, [1.03, 540, 930]],
    [tUbicacion + 0.25, [1.04, 650, 960]],
    [tFuncionando + 0.55, [0.95, 540, 1055]],
    [tCorte - 0.18, [0.95, 540, 1055]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uCentrar = suave(tramo(tr, tAntena + 0.3, tAirdrop - 0.05));
  const telX = mez(315, 540, uCentrar);
  const telY = mez(1215, 1275, uCentrar);

  g.save();
  vista(g, Z, cx, cy);

  const alRouter = 1 - suave(tramo(tr, tAntena + 0.28, tAirdrop - 0.1));
  const rx = 805 + (1 - alRouter) * 180;
  const ry = 775;
  const uCorteRouter = suave(tramo(tr, tDesconecta - 0.05, tDesconecta + 0.25));

  if (alRouter > 0.01) {
    g.save();
    g.globalAlpha = alRouter;

    if (uCorteRouter < 0.98) {
      g.save();
      g.strokeStyle = `rgba(255, 255, 255, ${(1 - uCorteRouter) * 0.85})`;
      g.lineWidth = 8;
      g.setLineDash([18, 16]);
      g.lineDashOffset = -tr * 210;
      g.beginPath();
      g.moveTo(telX + 90, telY - 170);
      g.quadraticCurveTo(560, 840, rx - 95, ry + 20);
      g.stroke();
      g.restore();
    }

    const wChispa = tr - tDesconecta;
    if (wChispa > -0.05 && wChispa < 0.85) {
      const uC = Math.max(0, wChispa / 0.85);
      k.estallido(g, 575, 930, uC, "255, 70, 70", 0.85);
    }

    if (uCorteRouter > 0.2) {
      const alX = Math.min(1, (uCorteRouter - 0.2) * 1.6);
      g.save();
      g.globalAlpha *= alX;
      g.beginPath();
      g.arc(575, 921, 42, 0, Math.PI * 2);
      g.fillStyle = "#0f172a";
      g.fill();
      g.strokeStyle = "#ff4757";
      g.lineWidth = 9;
      g.lineCap = "round";
      g.beginPath();
      g.moveTo(555, 901); g.lineTo(595, 941);
      g.moveTo(595, 901); g.lineTo(555, 941);
      g.stroke();
      g.restore();
    }

    dibujarRouter(g, rx, ry, 0.95, tr, uCorteRouter < 0.5, "77, 163, 255");
    g.restore();
  }

  // Ondas intensas de la antena encendida del celular
  const uAntena = entra(tramo(tr, tAntena - 0.25, tAntena + 0.25));
  if (uAntena > 0.02) {
    dibujarOndasWifi(g, telX, telY + 135, tr, "34, 227, 155", uAntena * 0.95, 430, 4, 1.25);
  }

  // Los 3 accesorios orbitan suavemente y reciben cápsulas luminosas de datos en «sigan funcionando»
  const uAir = entra(tramo(tr, tAirdrop - 0.08, tAirdrop + 0.26));
  const uRel = entra(tramo(tr, tReloj - 0.08, tReloj + 0.26));
  const uUbi = entra(tramo(tr, tUbicacion - 0.08, tUbicacion + 0.26));

  const osc = Math.sin((tr - tAirdrop) * 2.4) * 26;
  const nodos = [
    { x: 195 + osc * 0.6, y: 760 - osc * 0.5, u: uAir, col: "96, 165, 250", hex: "#60a5fa", fase: 0 },
    { x: 540, y: 660 + osc * 0.65, u: uRel, col: "34, 227, 155", hex: "#22e39b", fase: 0.33 },
    { x: 885 - osc * 0.6, y: 760 + osc * 0.5, u: uUbi, col: "255, 130, 80", hex: "#ff7b54", fase: 0.66 },
  ];

  for (const n of nodos) {
    if (n.u > 0.02) {
      const ox = telX;
      const oy = telY - 110;
      const dx = mez(ox, n.x, n.u);
      const dy = mez(oy, n.y + 45, n.u);

      g.save();
      g.strokeStyle = `rgba(${n.col}, ${0.85 * n.u})`;
      g.lineWidth = 7;
      g.setLineDash([16, 14]);
      g.lineDashOffset = -tr * 240;
      g.beginPath();
      g.moveTo(ox, oy);
      g.lineTo(dx, dy);
      g.stroke();

      // Paquetes luminosos viajando a gran velocidad del celular al accesorio
      for (let p = 0; p < 2; p++) {
        const fp = ((tr * 1.45 + n.fase + p * 0.5) % 1 + 1) % 1;
        const px = mez(ox, dx, fp);
        const py = mez(oy, dy, fp);
        g.beginPath();
        g.arc(px, py, 12, 0, Math.PI * 2);
        g.fillStyle = "#ffffff";
        g.shadowColor = n.hex;
        g.shadowBlur = 20;
        g.fill();
      }
      g.restore();
    }
  }

  dibujarCelular(g, telX, telY, 450, 860, {
    estadoWifi: "azul",
    transicionBlanco: 1,
    rayosX: Math.max(0.45, uAntena),
    antenaViva: 1,
    brilloPantalla: 0.96,
    t: tr,
    modoPantalla: "barra",
    horaTexto: "11:15",
  });

  dibujarTarjetaAirdrop(g, nodos[0].x, nodos[0].y, uAir, k.pulso(tr, tAirdrop + 0.12, 0.25), tr);
  dibujarRelojInteligente(g, nodos[1].x, nodos[1].y, uRel, k.pulso(tr, tReloj + 0.12, 0.25), tr);
  dibujarPinUbicacion(g, nodos[2].x, nodos[2].y, uUbi, k.pulso(tr, tUbicacion + 0.12, 0.25), tr);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tDesconecta, tDesconecta + 0.22)) * (1 - suave(tramo(tr, tAntena - 0.2, tAntena)));
  pildoraEstado(g, 540, 1725, "SOLO SUELTA EL ROUTER", "255, 107, 129", alP1, 42);

  const alP2 = entra(tramo(tr, tAntena + 0.05, tAntena + 0.28));
  pildoraEstado(g, 540, 1725, "ANTENA ACTIVA EN 2.º PLANO", "34, 227, 155", alP2, 42);

  vineta(g, 0.45);
  capaSuperiorMarca(g, 0.82);
}

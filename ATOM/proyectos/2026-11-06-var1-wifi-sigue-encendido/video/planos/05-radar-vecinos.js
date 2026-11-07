// Plano 05 (Frase 6): «Y en Android, aunque lo apagues, Ubicación sigue escaneando las redes de tus vecinos.»
// Plano arquitectónico cenital iluminado tipo maqueta/blueprint claro en la zona inferior (contraste inmediato con el dormitorio
// oscuro de las 5:00 AM y la casa nocturna siguiente), con muros de concreto oscuro y radar esmeralda profundo atravesando paredes.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarIconoWifi,
  dibujarRouter,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(6).inicio - 0.04;

const { suave, tramo, entra, mez } = k;

function dibujarMuro(g, x, y, w, h) {
  g.save();
  g.shadowColor = "rgba(15, 35, 42, 0.35)";
  g.shadowBlur = 16;
  g.shadowOffsetY = 7;
  redondo(g, x, y, w, h, 6);
  g.fillStyle = "#1e343b";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;
  g.strokeStyle = "#486b75";
  g.lineWidth = 2;
  g.stroke();
  g.restore();
}

function dibujarEtiquetaCuarto(g, x, y, texto, activo = false) {
  g.save();
  g.font = "800 24px Figtree";
  const w = g.measureText(texto).width + 34;
  redondo(g, x - w / 2, y - 21, w, 42, 13);
  g.fillStyle = activo ? "#064e3b" : "#0f1f24";
  g.fill();
  g.strokeStyle = activo ? "#10b981" : "rgba(255, 255, 255, 0.25)";
  g.lineWidth = 2.5;
  g.stroke();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = activo ? "#6ee7b7" : "#e2f1f5";
  g.fillText(texto, x, y + 1);
  g.restore();
}

export function dibuja(g, t) {
  const f6 = v.frase(6);
  const t0 = f6.inicio - 0.04;
  const tCorte = v.frase(7).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tApagues = f6.t("apagues");
  const tUbicacion = f6.t("Ubicación");
  const tEscaneando = f6.t("escaneando");
  const tVecinos = f6.t("vecinos");

  // Mesa de plano arquitectónico clara debajo de y=530 y oscura arriba para contraste impecable de subtítulos
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#081417");
  bg.addColorStop(0.27, "#16353b");
  bg.addColorStop(0.45, "#6c989e");
  bg.addColorStop(1, "#4e777d");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  g.restore();

  const cam = camino2D([
    [t0, [1.12, 540, 1145]],
    [tApagues + 0.15, [1.10, 540, 1145]],
    [tEscaneando + 0.35, [0.96, 540, 1125]],
    [tCorte - 0.18, [0.96, 540, 1125]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uRadar = entra(tramo(tr, tUbicacion - 0.06, tUbicacion + 0.3));
  const angRadar = (tr - tUbicacion) * 3.0;

  g.save();
  vista(g, Z, cx, cy);

  // Base de maqueta arquitectónica clara
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 40;
  g.shadowOffsetY = 18;
  redondo(g, 48, 564, 984, 1114, 20);
  g.fillStyle = "#d5e5e8";
  g.fill();
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  // Retícula arquitectónica sobre los pisos
  g.strokeStyle = "rgba(25, 65, 75, 0.10)";
  g.lineWidth = 1.5;
  for (let x = 90; x < 1020; x += 55) {
    g.beginPath(); g.moveTo(x, 575); g.lineTo(x, 1665); g.stroke();
  }
  for (let y = 585; y < 1665; y += 55) {
    g.beginPath(); g.moveTo(60, y); g.lineTo(1020, y); g.stroke();
  }

  // Pisos diferenciados por departamento
  redondo(g, 74, 590, 450, 342, 12); g.fillStyle = "#c7dbe0"; g.fill();
  redondo(g, 112, 632, 140, 62, 14); g.fillStyle = "#9ab6be"; g.fill();

  redondo(g, 556, 590, 450, 342, 12); g.fillStyle = "#c7dbe0"; g.fill();
  redondo(g, 826, 632, 130, 65, 14); g.fillStyle = "#9ab6be"; g.fill();

  redondo(g, 74, 1390, 932, 260, 12); g.fillStyle = "#bfd5db"; g.fill();
  for (const mx of [210, 390, 560]) {
    g.beginPath(); g.arc(mx, 1525, 34, 0, Math.PI * 2);
    g.fillStyle = "#93b0b8"; g.fill();
  }

  // Tu cuarto al centro con alfombra cálida clara
  redondo(g, 244, 958, 592, 404, 14); g.fillStyle = "#e5f0f2"; g.fill();
  redondo(g, 355, 1025, 370, 265, 22); g.fillStyle = "#cbdEE3"; g.fill();

  // Muros de concreto oscuro entre departamentos
  dibujarMuro(g, 52, 568, 976, 22);
  dibujarMuro(g, 52, 1652, 976, 22);
  dibujarMuro(g, 52, 568, 22, 1106);
  dibujarMuro(g, 1006, 568, 22, 1106);
  dibujarMuro(g, 528, 568, 24, 375);
  dibujarMuro(g, 52, 936, 976, 22);
  dibujarMuro(g, 52, 1366, 976, 22);
  dibujarMuro(g, 222, 936, 22, 452);
  dibujarMuro(g, 836, 936, 22, 452);

  // Cono de radar 360° y anillos esmeralda oscuros/vibrantes (visibles sobre maqueta clara)
  const centroX = 540, centroY = 1158;
  if (uRadar > 0.01) {
    const rMax = 610 * uRadar;
    for (let i = 0; i < 4; i++) {
      const fase = ((tr * 0.95 + i / 4) % 1 + 1) % 1;
      const r = 36 + fase * rMax;
      const al = uRadar * (1 - fase * 0.78);
      g.strokeStyle = `rgba(5, 150, 105, ${al * 0.75})`;
      g.lineWidth = 6 * (1 - fase * 0.4);
      g.beginPath();
      g.arc(centroX, centroY, r, 0, Math.PI * 2);
      g.stroke();
    }

    for (let s = 0; s < 14; s++) {
      const a0 = angRadar - s * 0.055;
      const a1 = a0 + 0.06;
      const alSeg = (1 - s / 14) * 0.34 * uRadar;
      g.fillStyle = `rgba(16, 185, 129, ${alSeg})`;
      g.beginPath();
      g.moveTo(centroX, centroY);
      g.arc(centroX, centroY, rMax, a0, a1);
      g.closePath();
      g.fill();
    }
    g.strokeStyle = `rgba(4, 120, 87, ${0.95 * uRadar})`;
    g.lineWidth = 5.5;
    g.beginPath();
    g.moveTo(centroX, centroY);
    g.lineTo(centroX + Math.cos(angRadar) * rMax, centroY + Math.sin(angRadar) * rMax);
    g.stroke();
  }

  // Los 3 routers de los vecinos
  const vecinos = [
    { x: 275, y: 765, nombre: "VECINO 301 · Fibra_5G", tAct: tEscaneando + 0.05 },
    { x: 805, y: 765, nombre: "DEPTO 302 · Red_Casa", tAct: tEscaneando + 0.42 },
    { x: 785, y: 1520, nombre: "CAFETERÍA · WiFi_Local", tAct: tVecinos - 0.18 },
  ];

  for (const vc of vecinos) {
    const uV = entra(tramo(tr, vc.tAct - 0.08, vc.tAct + 0.24));
    if (uV > 0.02) {
      g.save();
      g.strokeStyle = `rgba(5, 150, 105, ${0.9 * uV})`;
      g.lineWidth = 6;
      g.setLineDash([14, 12]);
      g.lineDashOffset = tr * 170;
      g.beginPath();
      g.moveTo(vc.x, vc.y);
      g.lineTo(mez(vc.x, centroX, uV), mez(vc.y, centroY, uV));
      g.stroke();
      g.restore();
    }

    dibujarRouter(g, vc.x, vc.y, 0.56, tr, uV > 0.1, uV > 0.1 ? "34, 227, 155" : "100, 116, 139");
    dibujarEtiquetaCuarto(g, vc.x, vc.y - 102, vc.nombre, uV > 0.2);
  }

  // Celular Android protagonista en el centro
  const uApagado = suave(tramo(tr, tApagues - 0.12, tApagues + 0.16));
  g.save();
  g.translate(centroX, centroY);
  g.shadowColor = "rgba(0,0,0,0.45)";
  g.shadowBlur = 32;
  g.shadowOffsetY = 12;
  redondo(g, -115, -175, 230, 350, 36);
  k.metal(g, -115, 115, ["#4b5563", "#e2e8f0", "#64748b", "#1e293b"]);
  g.shadowBlur = 0;
  g.shadowOffsetY = 0;

  redondo(g, -103, -163, 206, 326, 28);
  g.fillStyle = "#09131a";
  g.fill();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 24px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("ANDROID", 0, -118);

  redondo(g, -84, -84, 168, 72, 18);
  g.fillStyle = uApagado > 0.5 ? "#16202a" : "#1d4ed8";
  g.fill();
  dibujarIconoWifi(g, -48, -48, 22, uApagado > 0.5 ? "#64748b" : "#ffffff", uApagado);
  g.font = "800 23px Figtree";
  g.fillStyle = uApagado > 0.5 ? "#94a3b8" : "#ffffff";
  g.fillText(uApagado > 0.5 ? "WiFi OFF" : "WiFi ON", 24, -48);

  redondo(g, -84, 8, 168, 92, 18);
  g.fillStyle = uRadar > 0.1 ? "rgba(16, 185, 129, 0.26)" : "#132028";
  g.fill();
  g.strokeStyle = uRadar > 0.1 ? "#22e39b" : "rgba(255,255,255,0.15)";
  g.lineWidth = 3;
  g.stroke();

  g.font = "800 22px Figtree";
  g.fillStyle = uRadar > 0.1 ? "#22e39b" : "#94a3b8";
  g.fillText("UBICACIÓN", 0, 38);
  g.font = "700 19px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText(uRadar > 0.1 ? "ESCANEANDO" : "EN ESPERA", 0, 72);
  g.restore();

  dibujarEtiquetaCuarto(g, 540, 995, "TU CUARTO", false);

  g.restore();

  sinVista(g);
  const alPildora = entra(tramo(tr, tVecinos - 0.15, tVecinos + 0.22));
  pildoraEstado(g, 540, 1748, "3 REDES VECINAS DETECTADAS", "34, 227, 155", alPildora, 42);

  vineta(g, 0.44);
  capaSuperiorMarca(g, 0.84);
}

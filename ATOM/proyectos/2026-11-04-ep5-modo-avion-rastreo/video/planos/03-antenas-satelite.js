import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(3).inicio - 0.04;
const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const t0 = f3.inicio - 0.04;
  const tCorte = v.frase(5).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tEmiten = f3.t("emiten");
  const tVuelo = f3.t("vuelo");
  const tGps = f4.t("GPS");
  const tEscucha = f4.t("escucha");
  const tSatelites = f4.t("satélites");

  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#050912");
  bg.addColorStop(0.55, "#0c182c");
  bg.addColorStop(1, "#060b16");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);
  k.brillo(g, 540, 1080, 900, "56, 189, 248", 0.24);
  g.restore();

  const cam = camino2D([
    [t0, [1.06, 360, 1140]],
    [tVuelo, [1.06, 380, 1140]],
    [tGps, [1.04, 680, 1130]],
    [tCorte - 0.18, [1.0, 540, 1130]],
  ]);
  const [Z, cx, cy] = cam(tr);

  const uSat = suave(tramo(tr, f4.inicio - 0.1, tEscucha + 0.2));

  g.save();
  vista(g, Z, cx, cy);

  // COLUMNA IZQUIERDA (F3): Antenas que emiten hacia el avión -> CORTADAS
  redondo(g, 65, 620, 445, 960, 32);
  g.fillStyle = "rgba(18, 24, 38, 0.94)";
  g.fill();
  g.strokeStyle = "#f87171";
  g.lineWidth = 3.5;
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "800 28px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("ANTENAS QUE EMITEN", 287, 685);
  g.font = "700 22px Figtree";
  g.fillStyle = "#94a3b8";
  g.fillText("(WiFi · 5G · Bluetooth)", 287, 725);

  // Avión arriba a la izquierda protegido por barrera roja
  redondo(g, 135, 790, 305, 130, 22);
  g.fillStyle = "#0f172a";
  g.fill();
  g.strokeStyle = "#38bdf8";
  g.lineWidth = 3;
  g.stroke();
  g.font = "800 32px Figtree";
  g.fillStyle = "#e0f2fe";
  g.fillText("✈ CABINA VUELO", 287, 855);

  // Barrera de corte de emisión
  redondo(g, 115, 1020, 345, 78, 18);
  g.fillStyle = "#450a0a";
  g.fill();
  g.strokeStyle = "#ef4444";
  g.lineWidth = 3.5;
  g.stroke();
  g.font = "800 26px Figtree";
  g.fillStyle = "#fca5a5";
  g.fillText("✕ EMISIÓN BLOQUEADA", 287, 1059);

  // Celular abajo izquierda sin emitir
  redondo(g, 187, 1220, 200, 300, 28);
  g.fillStyle = "#1e293b";
  g.fill();
  g.strokeStyle = "#64748b";
  g.lineWidth = 3;
  g.stroke();
  g.font = "800 25px Figtree";
  g.fillStyle = "#cbd5e1";
  g.fillText("0 ONDAS", 287, 1370);

  // COLUMNA DERECHA (F4): Satélites del cielo -> El GPS solo ESCUCHA en silencio
  redondo(g, 555, 620, 460, 960, 32);
  g.fillStyle = "rgba(8, 30, 28, 0.95)";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();

  g.font = "800 28px Figtree";
  g.fillStyle = "#6ee7b7";
  g.fillText("RECEPTOR GPS PASIVO", 785, 685);
  g.font = "700 22px Figtree";
  g.fillStyle = "#d1fae5";
  g.fillText("No emite nada · Solo escucha", 785, 725);

  // 2 Satélites arriba enviando pulsos hacia abajo
  for (let s = 0; s < 2; s++) {
    const sx = 685 + s * 200;
    const sy = 835;
    k.brillo(g, sx, sy, 130, "250, 204, 21", 0.55);
    redondo(g, sx - 55, sy - 26, 110, 52, 12);
    g.fillStyle = "#fbbf24";
    g.fill();
    g.font = "800 20px Figtree";
    g.fillStyle = "#0f172a";
    g.fillText("SATÉLITE", sx, sy + 1);

    // Ondas bajando hacia el celular
    if (uSat > 0.05) {
      for (let w = 0; w < 3; w++) {
        const fw = ((tr * 1.1 + w * 0.33) % 1 + 1) % 1;
        const wy = mez(sy + 45, 1210, fw);
        g.strokeStyle = `rgba(52, 211, 153, ${(1 - fw * 0.4) * uSat})`;
        g.lineWidth = 4;
        g.beginPath();
        g.arc(sx, wy, 28 + fw * 24, 0.2 * Math.PI, 0.8 * Math.PI);
        g.stroke();
      }
    }
  }

  // Celular abajo derecha recibiendo señal satelital en silencio
  redondo(g, 650, 1210, 270, 310, 30);
  g.fillStyle = "#064e3b";
  g.fill();
  g.strokeStyle = "#22e39b";
  g.lineWidth = 4;
  g.stroke();
  g.font = "800 30px Figtree";
  g.fillStyle = "#ffffff";
  g.fillText("SOLO ESCUCHA", 785, 1335);
  g.font = "800 24px Figtree";
  g.fillStyle = "#fde047";
  g.fillText("UBICACIÓN EXACTA ✓", 785, 1405);

  g.restore();

  sinVista(g);
  const alP1 = entra(tramo(tr, tEmiten - 0.1, tVuelo + 0.1)) * (1 - suave(tramo(tr, f4.inicio - 0.25, f4.inicio)));
  pildoraEstado(g, 540, 1710, "EL MODO AVIÓN SOLO APAGA LO QUE EMITE ONDAS", "248, 113, 113", alP1, 33);

  const alP2 = entra(tramo(tr, tEscucha - 0.1, tSatelites + 0.2));
  pildoraEstado(g, 540, 1710, "EL CHIP GPS NO EMITE NADA: SOLO ESCUCHA SATÉLITES", "34, 227, 155", alP2, 33);

  vineta(g, 0.52);
  capaSuperiorMarca(g, 0.62);
}

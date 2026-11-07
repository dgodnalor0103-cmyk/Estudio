// Plano 09 (Frases 11, 12 y 13 + Loop continuo perfecto con el Fotograma 0):
// «Porque si solo tocas arriba, esta noche tu antena vuelve a despertar.»
// «Envíaselo a ese amigo que lo apaga desde arriba para ahorrar batería.»
// «Y mañana, episodio dos: cómo un cable barato quema tu celular por dentro.»
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelular,
  dibujarDedo,
  dibujarOndasWifi,
  fondoMosaico,
  insigniaEpisodio,
  pildoraEstado,
  redondo,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(11).inicio - 0.04;

const { suave, tramo, entra, pulso, mez } = k;

function dibujarAvionCompartir(g, x, y, escala, al) {
  if (al <= 0.01) return;
  g.save();
  g.translate(x, y);
  g.scale(escala, escala);
  g.globalAlpha = al;

  g.shadowColor = "rgba(47, 124, 246, 0.65)";
  g.shadowBlur = 32;
  g.beginPath();
  g.arc(0, 0, 82, 0, Math.PI * 2);
  g.fillStyle = "rgba(16, 28, 52, 0.94)";
  g.fill();
  g.shadowBlur = 0;
  g.strokeStyle = "#4da3ff";
  g.lineWidth = 4;
  g.stroke();

  // Ícono limpio de avión de papel (Enviar a un amigo)
  g.fillStyle = "#ffffff";
  g.beginPath();
  g.moveTo(42, -32);
  g.lineTo(-42, 4);
  g.lineTo(-10, 16);
  g.lineTo(32, -20);
  g.lineTo(-2, 22);
  g.lineTo(12, 42);
  g.closePath();
  g.fill();
  g.restore();
}

function dibujarCableBaratoChispas(g, x, yPuerto, entrada, calor, t) {
  if (entrada <= 0.01) return;
  g.save();
  const y = mez(yPuerto + 220, yPuerto + 18, entrada);
  g.translate(x, y);

  // Resplandor térmico naranja/rojo en el puerto de carga («quema tu celular por dentro»)
  if (calor > 0.02) {
    k.brillo(g, 0, -18, 210, "255, 110, 30", calor * (0.65 + 0.25 * Math.sin(t * 18)));
    const faseChispa = ((t * 2.2) % 1 + 1) % 1;
    k.estallido(g, 0, -12, faseChispa, "255, 165, 50", calor * 0.75);
  }

  // Punta metálica USB-C genérica
  redondo(g, -18, -28, 36, 30, 6);
  k.metal(g, -18, 18, ["#64748b", "#e2e8f0", "#475569"]);

  // Cabezal plástico barato blanco amarillento sin blindaje
  redondo(g, -36, 0, 72, 86, 14);
  g.fillStyle = mez > 0 ? k.mezColor("#e2e8f0", "#ffb4a2", calor * 0.6) : "#e2e8f0";
  g.fill();
  g.strokeStyle = calor > 0.2 ? "#ff5722" : "#94a3b8";
  g.lineWidth = 3;
  g.stroke();

  // Cable pelado inferior
  g.strokeStyle = "#cbd5e1";
  g.lineWidth = 22;
  g.beginPath();
  g.moveTo(0, 86);
  g.quadraticCurveTo(8, 155, 0, 230);
  g.stroke();

  g.restore();
}

export function dibuja(g, t) {
  const f11 = v.frase(11);
  const f12 = v.frase(12);
  const f13 = v.frase(13);
  const t0 = f11.inicio - 0.04;
  const tFin = v.duracion;

  const tTocas = f11.t("tocas");
  const tDespertar = f11.t("despertar");
  const tEnviaselo = f12.t("Envíaselo");
  const tAhorrar = f12.t("ahorrar");
  const tManana = f13.t("mañana");
  const tCable = f13.t("cable");
  const tQuema = f13.t("quema");

  // Cámara regresa en los últimos segundos exactamente a [1.0, 540, 960] para empatar con el fotograma 0 del Plano 01
  const cam = camino2D([
    [t0, [1.06, 540, 1020]],
    [tDespertar + 0.25, [1.14, 540, 1130]],
    [tEnviaselo + 0.4, [1.0, 540, 960]],
    [tQuema + 0.2, [1.03, 540, 1015]],
    [tFin - 0.25, [1.0, 540, 960]],
    [tFin, [1.0, 540, 960]],
  ]);
  const [Z, cx, cy] = cam(t);

  // El desplazamiento del mosaico converge suavemente a (0, 0) en tFin para que el loop sea invisible
  const restaFin = Math.max(0, tFin - t);
  const uCalor = entra(tramo(t, tCable + 0.1, tQuema + 0.25)) * (1 - suave(tramo(t, tFin - 0.65, tFin - 0.12)));
  const uRayos = entra(tramo(t, tDespertar - 0.65, tDespertar + 0.15)) * (1 - suave(tramo(t, tEnviaselo - 0.05, tEnviaselo + 0.45)));

  let colLuz = k.mezRgb("47, 124, 246", "34, 227, 155", uRayos);
  colLuz = k.mezRgb(colLuz, "255, 120, 40", uCalor);

  fondoMosaico(g, restaFin, restaFin * 26, -restaFin * 18, colLuz, 0.32);

  g.save();
  vista(g, Z, cx, cy);

  // Estado del botón WiFi: toca a blanco en Frase 11 y regresa al azul original del Fotograma 0 en Frase 12
  const uBlanco = suave(tramo(t, tTocas - 0.08, tTocas + 0.2)) * (1 - suave(tramo(t, tEnviaselo + 0.1, tAhorrar)));

  // Ondas azules de fondo (empatando con las del Fotograma 0 al final) o verdes cuando despierta la antena en Frase 11
  if (uRayos > 0.02) {
    dibujarOndasWifi(g, 540, 1345, t, "34, 227, 155", uRayos * 0.92, 450, 4, 1.15);
  }
  const fuerzaAzul = (1 - uBlanco) * (1 - uCalor * 0.5) * 0.75;
  if (fuerzaAzul > 0.02) {
    dibujarOndasWifi(g, 540, 980, restaFin, "47, 124, 246", fuerzaAzul, 470, 4, 0.9);
  }

  // El mismo celular metálico 620x1180 en (540, 1155) que abre el video en el Fotograma 0
  const info = dibujarCelular(g, 540, 1155, 620, 1180, {
    estadoWifi: "azul",
    transicionBlanco: uBlanco,
    rayosX: uRayos,
    antenaViva: 1,
    brilloPantalla: 1,
    t,
    modoPantalla: "barra",
    horaTexto: "11:58",
  });

  // Dedo rápido en «si solo tocas arriba» (Frase 11)
  const uEntraDedo = entra(tramo(t, t0 + 0.2, tTocas));
  const uSaleDedo = suave(tramo(t, tTocas + 0.24, tTocas + 0.8));
  if (uEntraDedo > 0.01 && uSaleDedo < 0.99) {
    const dx = mez(1020, info.botonWifiX + 6, uEntraDedo) + uSaleDedo * 460;
    const dy = mez(1430, info.botonWifiY + 8, uEntraDedo) + uSaleDedo * 340;
    dibujarDedo(g, dx, dy, -0.45, pulso(t, tTocas + 0.05, 0.14), 1.04);
  }

  // Cable barato acercándose al puerto inferior y soltando chispas térmicas en el gancho del EP. 2 (se retira antes del loop)
  const uCable = entra(tramo(t, tCable - 0.15, tCable + 0.3)) * (1 - suave(tramo(t, tFin - 0.6, tFin - 0.1)));
  dibujarCableBaratoChispas(g, 540, 1155 + 590, uCable, uCalor, t);

  g.restore();

  sinVista(g);

  // Beat 1 (Frase 11): Píldora de advertencia nocturna (se apaga limpia antes de que entre la de compartir)
  const alP11 = entra(tramo(t, tDespertar - 0.3, tDespertar + 0.15)) * (1 - suave(tramo(t, tEnviaselo - 0.32, tEnviaselo - 0.06)));
  pildoraEstado(g, 540, 1675, "ESTA NOCHE VUELVE A DESPERTAR", "34, 227, 155", alP11, 40);

  // Beat 2 (Frase 12): Emblema de compartir «Envíaselo a ese amigo»
  const alComp = entra(tramo(t, tEnviaselo - 0.02, tEnviaselo + 0.28)) * (1 - suave(tramo(t, tManana - 0.32, tManana - 0.04)));
  if (alComp > 0.01) {
    dibujarOndasWifi(g, 540, 650, t, "77, 163, 255", alComp * 0.7, 260, 3, 1.1);
    dibujarAvionCompartir(g, 540, 650, 0.85 + 0.15 * alComp, alComp);
    pildoraEstado(g, 540, 1675, "ENVÍASELO A UN AMIGO", "77, 163, 255", alComp, 44);
  }

  // Beat 3 (Frase 13): Insignia Sovera «MAÑANA · EP. 2» exactamente en (540, 650), la misma coordenada de la insignia de apertura
  const alEp2 = entra(tramo(t, tManana + 0.05, tManana + 0.38)) * (1 - suave(tramo(t, tFin - 0.32, tFin - 0.04)));
  const escEp2 = 0.88 + 0.12 * entra(tramo(t, tManana + 0.05, tManana + 0.42));
  insigniaEpisodio(
    g,
    540,
    650,
    "MAÑANA",
    "EP. 2",
    "CABLE BARATO vs. TU CELULAR",
    "#ffb830",
    alEp2,
    escEp2
  );

  // En las últimas centésimas asoma la insignia del EP. 1 para que el salto 60.80 -> 0.00 sea continuo
  const alLoop = suave(tramo(t, tFin - 0.18, tFin));
  if (alLoop > 0.01) {
    insigniaEpisodio(g, 540, 650, "SECRETO DE TU CELULAR", "WIFI ON", "EL BOTÓN BLANCO ENGAÑA", "#22E39B", alLoop * 0.85, 0.88 + 0.12 * alLoop);
  }

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

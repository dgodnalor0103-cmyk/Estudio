// Plano 07 (Frase 8):
// «Por eso la punta quema al tocarla y tu celular solo carga cuando doblas el cable.»
// Dormitorio nocturno oscuro sobre mesa de madera caoba:
// 1) En «quema al tocarla», un dedo humano se acerca a la punta metálica incandescente del cable barato y retrocede.
// 2) En «solo carga cuando doblas el cable», el cordón se dobla de izquierda a derecha provocando falso contacto
//    y haciendo parpadear la carga en la pantalla del celular.
import * as k from "#kit";
import { v } from "#voz";
import {
  camino2D,
  capaSuperiorMarca,
  dibujarCelularCarga,
  dibujarConectorUsbC,
  dibujarDedo,
  pildoraEstado,
  redondo,
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = (v) => v.frase(8).inicio - 0.04;

const { suave, tramo, entra, mez } = k;

export function dibuja(g, t) {
  const f8 = v.frase(8);
  const t0 = f8.inicio - 0.04;
  const tCorte = v.frase(9).inicio - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tPunta = f8.t("punta");
  const tQuema = f8.t("quema");
  const tTocarla = f8.t("tocarla");
  const tCarga = f8.t("carga");
  const tDoblas = f8.t("doblas");

  // Fondo nocturno cálido de dormitorio con mesa de caoba oscura
  g.save();
  sinVista(g);
  const bg = g.createLinearGradient(0, 0, 0, 1920);
  bg.addColorStop(0, "#070912");
  bg.addColorStop(0.55, "#15121d");
  bg.addColorStop(1, "#1e1311");
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1920);

  // Tablero de mesa de noche de madera oscura abajo
  const mg = g.createLinearGradient(0, 1280, 0, 1920);
  mg.addColorStop(0, "#2d1a14");
  mg.addColorStop(1, "#140b08");
  g.fillStyle = mg;
  g.fillRect(0, 1280, 1080, 640);
  g.fillStyle = "rgba(255, 190, 140, 0.14)";
  g.fillRect(0, 1280, 1080, 4);

  k.brillo(g, 540, 1260, 760, "255, 96, 40", 0.24);
  g.restore();

  const cam = camino2D([
    [t0, [1.14, 540, 1260]],
    [tTocarla + 0.25, [1.12, 540, 1230]],
    [tDoblas, [1.02, 540, 1080]],
    [tCorte - 0.18, [1.02, 540, 1080]],
  ]);
  const [Z, cx, cy] = cam(tr);

  // Fase 1: el dedo se acerca a la punta ardiente y se retira de golpe al quemarse
  const uAcerca = suave(tramo(tr, tPunta - 0.15, tQuema + 0.06));
  const uRetira = suave(tramo(tr, tTocarla - 0.04, tTocarla + 0.34));
  const contacto = uAcerca * (1 - uRetira);

  // Fase 2: el cable se dobla ostensiblemente para lograr contacto intermitente
  const envDoblez = suave(tramo(tr, tCarga - 0.2, tDoblas - 0.05));
  const doblez = envDoblez * Math.sin((tr - tCarga) * 6.4) * 0.46;
  const haceContacto = envDoblez > 0.15 ? (doblez > 0.18 ? 1 : 0) : 0;

  const slideY = (1 - entra(tramo(tr, t0, t0 + 0.22))) * 32;

  g.save();
  vista(g, Z, cx, cy);
  g.translate(0, slideY);

  const info = dibujarCelularCarga(g, 540, 910, 500, 860, {
    pct: 43,
    modoCarga: "falso",
    tempC: 68,
    rayosX: 0,
    calorPuerto: 0.72,
    t: tr,
    parpadeoCarga: haceContacto,
  });

  // Conector barato ardiente enchufado abajo, con ángulo de falso contacto al doblar
  const yConector = info.puertoY - 10;
  g.save();
  g.translate(info.puertoX, yConector);
  g.rotate(doblez * 0.16);
  dibujarConectorUsbC(g, 0, 0, {
    tipo: "barato",
    escala: 1.05,
    abierto: 0,
    calor: 0.88,
    doblez,
    largoCable: 540,
    t: tr,
  });
  g.restore();

  // Ondas rojas de calor irradiando del cabezal ardiente
  for (let i = 0; i < 2; i++) {
    const fw = ((tr * 1.3 + i * 0.5) % 1 + 1) % 1;
    g.strokeStyle = `rgba(255, 110, 55, ${(1 - fw) * 0.55})`;
    g.lineWidth = 4;
    g.beginPath();
    g.arc(info.puertoX, yConector + 75, 55 + fw * 95, 0, Math.PI * 2);
    g.stroke();
  }

  // Flechas curvas indicando el gesto de doblar el cable en «cuando doblas el cable»
  if (envDoblez > 0.05) {
    g.save();
    g.globalAlpha = envDoblez;
    const xCableMid = info.puertoX + doblez * 165;
    const yCableMid = yConector + 340;
    redondo(g, xCableMid - 185, yCableMid - 36, 370, 72, 20);
    g.fillStyle = "rgba(15, 23, 42, 0.9)";
    g.fill();
    g.strokeStyle = haceContacto > 0.5 ? "#fbbf24" : "#64748b";
    g.lineWidth = 3;
    g.stroke();

    g.textAlign = "center";
    g.textBaseline = "middle";
    g.font = "800 28px Figtree";
    g.fillStyle = haceContacto > 0.5 ? "#fde047" : "#cbd5e1";
    g.fillText(haceContacto > 0.5 ? "✓ CARGA SOLO DOBLADO" : "↔ FALSO CONTACTO", xCableMid, yCableMid + 1);
    g.restore();
  }

  // Dedo humano entrando por la derecha, tocando la punta caliente y apartándose
  const alDedo = 1 - suave(tramo(tr, tCarga - 0.1, tCarga + 0.25));
  if (alDedo > 0.02) {
    g.save();
    g.globalAlpha = alDedo;
    const xDedo = mez(850, info.puertoX + 56, uAcerca) + uRetira * 240;
    const yDedo = mez(1500, yConector + 64, uAcerca) - uRetira * 90;
    dibujarDedo(g, xDedo, yDedo, -0.22 + uRetira * 0.25, contacto, 0.96, contacto);

    if (uRetira > 0.05) {
      g.textAlign = "left";
      g.font = "800 34px Figtree";
      g.fillStyle = "#ff7b6b";
      g.fillText("¡QUEMA! 68 °C", info.puertoX + 105, yConector + 40 - uRetira * 24);
    }
    g.restore();
  }

  g.restore();

  sinVista(g);
  const alPil1 = entra(tramo(tr, tQuema - 0.06, tQuema + 0.2)) * (1 - suave(tramo(tr, tDoblas - 0.34, tDoblas - 0.1)));
  pildoraEstado(g, 540, 1705, "PUNTA CALIENTE = PINES HACIENDO ARCO", "255, 107, 74", alPil1, 38);

  const alPil2 = entra(tramo(tr, tDoblas - 0.06, tDoblas + 0.22));
  pildoraEstado(g, 540, 1705, "CABLE FLOJO = PUERTO DAÑADO", "251, 191, 36", alPil2, 42);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

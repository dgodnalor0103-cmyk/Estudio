// Plano 01 (Frase 1): «¿Sabías que apagar el WiFi en la barra rápida de tu celular no lo apaga?»
// Mosaico oscuro estilo Sovera, insignia MITOS DE TU CELULAR · EP. 1, dedo real que toca el botón azul de WiFi
// (pasa a blanco engañoso) y ventana de rayos X que revela la antena interior encendida emitiendo ondas.
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
  relojPlano,
  sinVista,
  vista,
  vineta,
} from "../mundo.js";

export const desde = 0;

const { suave, tramo, entra, pulso } = k;

export function dibuja(g, t) {
  const f1 = v.frase(1);
  const tCorte = v.frase(2).t("esta") - 0.04;
  const tr = relojPlano(t, tCorte, 0.16, 0.24);

  const tApagar = f1.t("apagar");
  const tBarra = f1.t("barra");
  const tNo = f1.t("no");
  const tApaga = f1.t("apaga");

  // Cámara: arranca amplia mostrando insignia + celular, y en «no lo apaga» hace zoom hacia la antena interior
  const cam = camino2D([
    [0, [1.0, 540, 960]],
    [tBarra, [1.02, 540, 975]],
    [tNo - 0.1, [1.04, 540, 990]],
    [tApaga + 0.35, [1.22, 540, 1170]],
    [tCorte - 0.18, [1.22, 540, 1170]],
  ]);
  const [Z, cx, cy] = cam(tr);

  // Fondo de mosaico oscuro con deriva sutil y luz reactiva (azul al inicio, esmeralda al revelar la antena)
  const uRayos = suave(tramo(tr, tNo - 0.08, tApaga + 0.18));
  const colLuz = k.mezRgb("47, 124, 246", "34, 227, 155", uRayos);
  fondoMosaico(g, tr, -tr * 26, tr * 18, colLuz, 0.32);

  g.save();
  vista(g, Z, cx, cy);

  // Ondas azules iniciales detrás del celular antes de tocar el botón, y ondas verdes fantasma al abrir rayos X
  const uToque = suave(tramo(tr, tBarra - 0.05, tBarra + 0.18));
  if (uToque < 0.98) {
    dibujarOndasWifi(g, 540, 980, tr, "47, 124, 246", (1 - uToque) * 0.75, 470, 4, 0.9);
  }
  if (uRayos > 0.02) {
    dibujarOndasWifi(g, 540, 1345, tr, "34, 227, 155", uRayos * 0.95, 460, 4, 1.15);
  }

  // Celular realista en el centro-abajo
  const info = dibujarCelular(g, 540, 1155, 620, 1180, {
    estadoWifi: "azul",
    transicionBlanco: uToque,
    rayosX: uRayos,
    antenaViva: 1,
    brilloPantalla: 1,
    t: tr,
    modoPantalla: "barra",
    horaTexto: "11:58",
  });

  // Dedo humano que entra en «apagar», presiona el botón WiFi en «barra» y sale limpio
  const uEntraDedo = entra(tramo(tr, tApagar + 0.15, tBarra - 0.02));
  const uSaleDedo = suave(tramo(tr, tBarra + 0.25, tBarra + 0.85));
  if (uEntraDedo > 0.005 && uSaleDedo < 0.995) {
    const dx = k.mez(1040, info.botonWifiX + 6, uEntraDedo) + uSaleDedo * 480;
    const dy = k.mez(1460, info.botonWifiY + 8, uEntraDedo) + uSaleDedo * 360;
    const pres = pulso(tr, tBarra + 0.04, 0.14);
    dibujarDedo(g, dx, dy, -0.45, pres, 1.04);
  }

  g.restore();

  // Insignia de apertura estilo Sovera (0.0 s hasta que el dedo toca)
  sinVista(g);
  const alInsignia = (1 - suave(tramo(tr, tBarra + 0.05, tBarra + 0.55))) * entra(tramo(tr, 0, 0.22));
  const escInsignia = 0.88 + 0.12 * entra(tramo(tr, 0, 0.26));
  insigniaEpisodio(g, 540, 650, "SECRETO DE TU CELULAR", "WIFI ON", "EL BOTÓN BLANCO ENGAÑA", "#22E39B", alInsignia, escInsignia);

  // Píldora de revelación en «no lo apaga»
  const alPildora = entra(tramo(tr, tApaga - 0.06, tApaga + 0.24));
  pildoraEstado(g, 540, 1665, "⚠ ANTENA SIGUE ACTIVA 24/7", "34, 227, 155", alPildora, 44);

  vineta(g, 0.55);
  capaSuperiorMarca(g, 0.62);
}

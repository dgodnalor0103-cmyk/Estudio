export default function sonidos(v) {
  const e = [];
  const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5),
        f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);

  pon("clic", 0.14, { db: -12, que: "insignia EP. 7" });
  pon("desliza", f1.t("vidrio") + 0.06, { db: -12, que: "encuadre cámara con protector" });
  pon("aviso", f1.t("arruina") + 0.04, { db: -11, que: "destellos verdes" });
  pon("golpe", f1.t("noche") - 0.04, { db: -10.5, corta: f2.inicio - 0.14, que: "fotos de noche arruinadas" });

  pon("cuadro", f2.t("cuidar") + 0.04, { db: -11.5, que: "anillos baratos" });
  pon("aviso", f2.t("sabotean") + 0.04, { db: -10.5, corta: f3.inicio - 0.14, que: "sabotean óptica" });

  pon("desliza", f3.t("original") + 0.04, { db: -11.5, que: "lente original zafiro" });
  pon("cristal", f3.t("zafiro") + 0.04, { db: -11.5, que: "7 capas antirreflejo" });
  pon("timbre", f3.t("reflejos") + 0.04, { db: -11, que: "evitan reflejos" });
  pon("desliza", f4.t("vidrio") + 0.04, { db: -11.5, que: "protector encima" });
  pon("hueco", f4.t("colchón") + 0.04, { db: -11, corta: f5.inicio - 0.14, que: "colchón de aire" });

  pon("cuadro", f5.t("plástico") + 0.04, { db: -12, que: "lentes de plástico rayado" });
  pon("timbre", f5.t("limpiados") - 0.04, { db: -11, corta: f6.inicio - 0.14, que: "anteojos caros" });

  pon("desliza", f6.t("farolas") + 0.04, { db: -12, que: "3 tarjetas rebote de luz" });
  pon("pitido", f6.t("rebota") + 0.04, { db: -12, que: "rebote en hueco" });
  pon("aviso", f6.t("fantasmas") + 0.04, { db: -10.5, corta: f7.inicio - 0.14, que: "fantasmas verdes" });

  pon("aprieta", f7.t("pegamento") + 0.04, { db: -11.5, que: "borde de pegamento" });
  pon("pitido", f7.t("láser") + 0.04, { db: -11.5, que: "sensor láser tapado" });
  pon("golpe", f7.t("enfocar") - 0.04, { db: -10.5, corta: f8.inicio - 0.14, que: "doble en enfocar" });

  pon("aviso", f8.t("nunca") + 0.04, { db: -10.5, corta: f9.inicio - 0.14, que: "nunca pegues vidrios" });

  pon("desliza", f9.t("Quítalos") + 0.04, { db: -11.5, que: "quita vidrios" });
  pon("clic", f9.t("funda") + 0.04, { db: -11, que: "funda con borde elevado" });
  pon("timbre", f9.t("luz") - 0.04, { db: -10.5, corta: f10.inicio - 0.14, que: "sin tocar la luz" });

  pon("sube", f10.t("Envíaselo") + 0.1, { db: -11, que: "compartir con amigo" });
  pon("clic", f10.t("amigo") + 0.1, { db: -12, que: "píldora compartir" });
  pon("golpe", f11.t("ocho") - 0.04, { db: -10, que: "insignia EP. 8 mañana" });
  pon("timbre", f11.t("públicos") - 0.04, { db: -11, corta: v.duracion - 0.2, que: "adelanto USB públicos" });

  return e;
}

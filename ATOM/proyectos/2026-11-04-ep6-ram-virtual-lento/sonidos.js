export default function sonidos(v) {
  const e = [];
  const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5),
        f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);

  pon("clic", 0.14, { db: -12, que: "insignia EP. 6" });
  pon("desliza", f1.t("virtual") + 0.06, { db: -12, que: "encuadre RAM virtual" });
  pon("aviso", f1.t("lento") + 0.04, { db: -11, que: "alerta lentitud" });
  pon("golpe", f1.t("memoria") - 0.04, { db: -10.5, corta: f2.inicio - 0.14, que: "desgaste memoria" });

  pon("cuadro", f2.t("prometen") + 0.04, { db: -11.5, que: "tarjeta +8 GB gratis" });
  pon("clic", f2.t("botón") + 0.04, { db: -12, que: "botón engañoso" });
  pon("aviso", f2.t("trampa") - 0.04, { db: -10.5, corta: f3.inicio - 0.14, que: "truco con trampa" });

  pon("desliza", f3.t("real") + 0.04, { db: -11.5, que: "columna RAM real" });
  pon("cristal", f3.t("ultrarrápido") + 0.04, { db: -11.5, que: "brillo chip 64 GB/s" });
  pon("timbre", f3.t("instante") + 0.04, { db: -11, que: "respuesta al instante" });
  pon("desliza", f4.t("virtual") + 0.04, { db: -11.5, que: "columna RAM virtual" });
  pon("golpe", f4.t("quince") + 0.04, { db: -10.5, que: "15 veces más lento" });
  pon("aviso", f4.t("lento") - 0.04, { db: -11, corta: f5.inicio - 0.14, que: "chip lento" });

  pon("cuadro", f5.t("mesa") + 0.04, { db: -12, que: "mesa de cocina" });
  pon("desliza", f5.t("sótano") + 0.04, { db: -11.5, que: "baja al sótano" });
  pon("tic", f5.t("corriendo") + 0.04, { db: -12, que: "escalones corriendo" });
  pon("timbre", f5.t("cuchara") - 0.04, { db: -11, corta: f6.inicio - 0.14, que: "cada cuchara" });

  pon("desliza", f6.t("aplicaciones") + 0.04, { db: -12, que: "3 tarjetas procesador" });
  pon("pitido", f6.t("procesador") + 0.04, { db: -12, que: "procesador en pausa" });
  pon("aviso", f6.t("lento") - 0.04, { db: -10.5, corta: f7.inicio - 0.14, que: "esperando chip lento" });

  pon("tic", f7.t("miles") + 0.04, { db: -11.5, que: "contador escrituras" });
  pon("aprieta", f7.t("roce") + 0.04, { db: -11.5, que: "roce constante" });
  pon("golpe", f7.t("almacenamiento") - 0.04, { db: -10.5, corta: f8.inicio - 0.14, que: "desgaste vida útil" });

  pon("cuadro", f8.t("ocho") + 0.04, { db: -11.5, que: "6 u 8 GB físicos" });
  pon("aviso", f8.t("estorba") - 0.04, { db: -10.5, corta: f9.inicio - 0.14, que: "memoria prestada estorba" });

  pon("desliza", f9.t("Ajustes") + 0.04, { db: -11.5, que: "entra Ajustes RAM Plus" });
  pon("clic", f9.t("apágala") + 0.04, { db: -10, que: "dedo apaga RAM Plus" });
  pon("timbre", f9.t("reinicia") + 0.04, { db: -10.5, corta: f10.inicio - 0.14, que: "reinicia celular" });

  pon("sube", f10.t("Envíaselo") + 0.1, { db: -11, que: "compartir con amigo" });
  pon("clic", f10.t("amigo") + 0.1, { db: -12, que: "píldora compartir" });
  pon("golpe", f11.t("siete") - 0.04, { db: -10, que: "insignia EP. 7 mañana" });
  pon("timbre", f11.t("fotos") - 0.04, { db: -11, corta: v.duracion - 0.2, que: "adelanto protectores cámara" });

  return e;
}

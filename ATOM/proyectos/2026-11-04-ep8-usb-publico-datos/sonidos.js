export default function sonidos(v) {
  const e = [];
  const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });
  const f1 = v.frase(1), f2 = v.frase(2), f3 = v.frase(3), f4 = v.frase(4), f5 = v.frase(5),
        f6 = v.frase(6), f7 = v.frase(7), f8 = v.frase(8), f9 = v.frase(9), f10 = v.frase(10), f11 = v.frase(11);

  pon("clic", 0.14, { db: -12, que: "insignia EP. 8" });
  pon("desliza", f1.t("puerto") + 0.06, { db: -12, que: "encuadre celular USB público" });
  pon("aviso", f1.t("datos") + 0.04, { db: -11, que: "pines centrales activos" });
  pon("golpe", f1.t("oculta") - 0.04, { db: -10.5, corta: f2.inicio - 0.14, que: "computadora oculta" });

  pon("cuadro", f2.t("enchufe") + 0.04, { db: -11.5, que: "carga gratis aeropuerto" });
  pon("aviso", f2.t("hueco") + 0.04, { db: -10.5, corta: f3.inicio - 0.14, que: "hace más que cargar" });

  pon("desliza", f3.t("cuatro") + 0.04, { db: -11.5, que: "columna 2 hilos orillas" });
  pon("cristal", f3.t("orillas") + 0.04, { db: -11.5, que: "solo electricidad" });
  pon("timbre", f3.t("electricidad") + 0.04, { db: -11, que: "carga batería" });
  pon("desliza", f4.t("centro") + 0.04, { db: -11.5, que: "columna 2 hilos centro" });
  pon("aviso", f4.t("autopista") + 0.04, { db: -10.5, corta: f5.inicio - 0.14, que: "autopista de datos" });

  pon("cuadro", f5.t("manguera") + 0.04, { db: -12, que: "manguera tanque de agua" });
  pon("pitido", f5.t("micrófono") + 0.04, { db: -11, corta: f6.inicio - 0.14, que: "micrófono oculto" });

  pon("desliza", f6.t("alterado") + 0.04, { db: -12, que: "3 tarjetas chip oculto" });
  pon("pitido", f6.t("chip") + 0.04, { db: -12, que: "chip detrás de la pared" });
  pon("aviso", f6.t("permiso") + 0.04, { db: -10.5, corta: f7.inicio - 0.14, que: "pide permiso" });

  pon("clic", f7.t("Confiar") + 0.04, { db: -11, que: "toca confiar por error" });
  pon("golpe", f7.t("claves") - 0.04, { db: -10.5, corta: f8.inicio - 0.14, que: "copia fotos y claves" });

  pon("aviso", f8.t("nunca") + 0.04, { db: -10.5, corta: f9.inicio - 0.14, que: "nunca conectes directo" });

  pon("desliza", f9.t("cubo") + 0.04, { db: -11.5, que: "usa tu propio cubo" });
  pon("clic", f9.t("bloqueador") + 0.04, { db: -11, que: "bloqueador USB" });
  pon("timbre", f9.t("centro") - 0.04, { db: -10.5, corta: f10.inicio - 0.14, que: "corta pines del centro" });

  pon("sube", f10.t("Envíaselo") + 0.1, { db: -11, que: "compartir con amigo" });
  pon("clic", f10.t("amigo") + 0.1, { db: -12, que: "píldora compartir" });
  pon("golpe", f11.t("Mitos") - 0.04, { db: -10, que: "insignia serie completa" });
  pon("timbre", f11.t("Celular") - 0.04, { db: -11, corta: v.duracion - 0.2, que: "cierre serie" });

  return e;
}

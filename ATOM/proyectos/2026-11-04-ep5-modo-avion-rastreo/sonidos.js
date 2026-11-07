export default function sonidos(v) {
  const e = [];
  const pon = (sonido, t, o = {}) => e.push({ sonido, t, ...o });

  const f1 = v.frase(1);
  const f2 = v.frase(2);
  const f3 = v.frase(3);
  const f4 = v.frase(4);
  const f5 = v.frase(5);
  const f6 = v.frase(6);
  const f7 = v.frase(7);
  const f8 = v.frase(8);
  const f9 = v.frase(9);
  const f10 = v.frase(10);
  const f11 = v.frase(11);

  pon("clic", 0.14, { db: -12, que: "insignia EP. 5" });
  pon("desliza", f1.t("celular") + 0.06, { db: -12, que: "encuadre celular modo avión" });
  pon("pitido", f1.t("avión") + 0.06, { db: -11.5, lp: 4800, que: "activa modo avión" });
  pon("tic", f1.t("registrando") + 0.06, { db: -12, que: "traza puntos de ruta GPS" });
  pon("aviso", f1.t("caminas") - 0.04, { db: -10, corta: f2.inicio - 0.14, que: "alerta ruta grabándose" });

  pon("cuadro", f2.t("ícono") + 0.04, { db: -11.5, que: "tarjeta llamadas e internet" });
  pon("hueco", f2.t("llamadas") + 0.04, { db: -12, que: "apaga llamadas" });
  pon("clic", f2.t("internet") + 0.04, { db: -12, que: "apaga internet" });
  pon("sube", f2.t("chip") + 0.04, { db: -11, que: "baja al chip GPS activo" });
  pon("timbre", f2.t("ubicación") - 0.04, { db: -10.5, corta: f3.inicio - 0.14, que: "chip GPS leyendo ubicación" });

  pon("aire", f3.t("avión") + 0.06, { ancla: "empieza", db: -13.5, que: "panel antenas vs cabina" });
  pon("golpe", f3.t("corta") + 0.04, { db: -11, que: "bloquea emisión de ondas" });
  pon("tic", f3.t("cabina") + 0.06, { db: -13, que: "protege cabina de vuelo" });
  pon("desliza", f4.t("chip") + 0.04, { db: -11.5, que: "paneo a satélites GPS" });
  pon("cristal", f4.t("escucha") + 0.06, { db: -11.5, que: "ondas satelitales bajando" });
  pon("timbre", f4.t("satélites") + 0.04, { db: -11, corta: f5.inicio - 0.14, que: "recepción pasiva" });

  pon("cuadro", f5.t("taparte") + 0.04, { db: -12, que: "boca con cinta" });
  pon("aprieta", f5.t("cinta") + 0.04, { db: -11.5, que: "sella la boca" });
  pon("desliza", f5.t("ojos") + 0.04, { db: -11.5, que: "paneo a libreta abierta" });
  pon("tic", f5.t("anotando") + 0.04, { db: -12, que: "anota calles en libreta" });
  pon("timbre", f5.t("libreta") - 0.04, { db: -11, corta: f6.inicio - 0.14, que: "calles registradas" });

  pon("desliza", f6.t("túnel") + 0.04, { db: -12, que: "entran 3 módulos de sensores" });
  pon("pitido", f6.t("giroscopio") + 0.06, { db: -12, que: "activa giroscopio" });
  pon("tic", f6.t("pasos") + 0.04, { db: -11.5, que: "cuenta pasos" });
  pon("clic", f6.t("giros") + 0.04, { db: -12, que: "registra giro 90 grados" });
  pon("sube", f6.t("piso") + 0.04, { db: -11, corta: f7.inicio - 0.14, que: "barómetro marca piso" });

  pon("cuadro", f7.t("mapa") + 0.04, { db: -12, que: "memoria interna con horas" });
  pon("tic", f7.t("hora") + 0.06, { db: -12.5, que: "sello de hora exacta" });
  pon("sube", f7.t("sube") + 0.04, { db: -10.5, que: "paquete sube a la nube" });
  pon("timbre", f7.t("quitas") + 0.04, { db: -11, corta: f8.inicio - 0.14, que: "sincronización al quitar avión" });

  pon("aire", f8.t("verdad") + 0.04, { ancla: "empieza", db: -13.5, que: "celular dejando rastro" });
  pon("aviso", f8.t("rastro") + 0.04, { db: -10.5, que: "alerta rastro en mapa" });
  pon("golpe", f8.t("alcanza") - 0.04, { db: -10.5, corta: f9.inicio - 0.14, que: "el avión no alcanza" });

  pon("desliza", f9.t("Ajustes") + 0.04, { db: -11.5, que: "entra tarjeta Ajustes" });
  pon("clic", f9.t("apaga") + 0.04, { db: -10, que: "dedo apaga Ubicación" });
  pon("timbre", f9.t("Ubicación") + 0.04, { db: -10.5, que: "GPS apagado de raíz" });
  pon("pitido", f9.t("activar") + 0.04, { db: -11.5, corta: f10.inicio - 0.14, que: "modo avión sin rastro" });

  pon("sube", f10.t("Envíaselo") + 0.1, { db: -11, que: "compartir con amigo" });
  pon("clic", f10.t("amigo") + 0.1, { db: -12, que: "píldora compartir" });
  pon("tic", f10.t("invisible") - 0.06, { db: -12.5, que: "regreso encuadre" });
  pon("golpe", f11.t("seis") - 0.04, { db: -10, que: "insignia EP. 6 mañana" });
  pon("timbre", f11.t("lento") - 0.04, { db: -11, corta: v.duracion - 0.2, que: "adelanto RAM virtual" });

  return e;
}

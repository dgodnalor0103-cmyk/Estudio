// Efectos sonoros sincronizados para Viral 1 (Pantalla Táctil — 84.50 s completos, 18.2M vistas)
export default (v) => [
  // Plano 1: Dedo vs Bolígrafo + Electricidad del cuerpo + Llamada en el frío
  { t: 0.12, sonido: "desliza", db: -14, vel: 1.1, que: "Acercamiento del dedo al cristal" },
  { t: v.t("toque"), sonido: "toque", db: -11, vel: 1.0, que: "Toque suave del dedo en el cristal" },
  { t: v.t("dedo"), sonido: "cristal", db: -11, vel: 1.05, que: "Selección azul en dedo y absorción de campo" },
  { t: v.t("ignora"), sonido: "aire", db: -13, vel: 1.15, que: "Entrada del bolígrafo translúcido" },
  { t: v.t("boligrafo"), sonido: "golpe", db: -11, vel: 1.1, que: "Presión física del bolígrafo contra el vidrio" },
  { t: v.t("sintiendo"), sonido: "desliza", db: -13, vel: 1.1, que: "Entrada del presentador" },
  { t: v.t("presion"), sonido: "aviso", db: -13, vel: 1.05, que: "No siente presión (lectura sigue en 100)" },
  { t: v.t("detecta"), sonido: "cuadro", db: -12, vel: 1.0, que: "Rayos X revelan iones Na+ y Cl-" },
  { t: v.t("electricidad"), sonido: "timbre", db: -11, vel: 1.0, que: "Selección azul en electricidad" },
  { t: v.t("frio"), sonido: "aire", db: -12, vel: 0.95, que: "Viento frío a -4 °C" },
  { t: v.t("llamada"), sonido: "timbre", db: -12, vel: 1.15, que: "Llamada entrante 7:42" },
  { t: v.t("guantes"), sonido: "aviso", db: -11, vel: 1.05, que: "Deslizamiento fallido con guantes" },

  // Plano 2: Red invisible de diamantes a 120 Hz + Absorción de carga + Multitouch Zoom
  { t: v.t("Debajo") + 0.12, sonido: "cuadro", db: -12, vel: 1.05, que: "Apertura de la cuadrícula de diamantes ITO" },
  { t: v.t("cuadricula"), sonido: "clic", db: -11, vel: 1.0, que: "Selección azul en cuadrícula" },
  { t: v.t("cruza"), sonido: "toque", db: -12, vel: 1.1, que: "Encendido de nodos de cruce" },
  { t: v.t("carga"), sonido: "cristal", db: -11, vel: 1.05, que: "Selección azul en carga eléctrica" },
  { t: v.t("ciento"), sonido: "sube", db: -12, vel: 1.1, que: "Badge de 120 escaneos por segundo" },
  { t: v.t("segundo"), sonido: "tic", db: -12, vel: 1.15, que: "Pulso de frecuencia 120 Hz" },

  { t: v.t("agua"), sonido: "desliza", db: -13, vel: 1.05, que: "Acercamiento macro de iones Na+ y Cl-" },
  { t: v.t("conduce"), sonido: "enganche", db: -12, vel: 1.0, que: "Arco eléctrico salta hacia el dedo" },
  { t: v.t("cristal#2"), sonido: "toque", db: -11, vel: 1.0, que: "Yema absorbe < 1 pF sobre el cristal" },
  { t: v.t("exacta"), sonido: "golpe-hondo", db: -11, vel: 1.0, que: "Caída exacta en 81 · 62 · 84" },
  { t: v.t("aqui"), sonido: "timbre", db: -12, vel: 1.1, que: "Confirmación ¡Tocaron justo aquí!" },
  { t: v.t("dos"), sonido: "cuadro", db: -12, vel: 1.1, que: "Detección simultánea de Dedo 1 y Dedo 2" },
  { t: v.t("zoom"), sonido: "sube", db: -11, vel: 1.05, que: "Pinch-to-zoom multitáctil" },

  // Plano 3: Guante de lana vs Lluvia vs Guante táctil + Cierre
  { t: v.t("guante") + 0.12, sonido: "papel", db: -12, vel: 1.0, que: "Textura tejida del guante de lana" },
  { t: v.t("lana"), sonido: "clic", db: -11, vel: 1.0, que: "Selección azul en lana aislante" },
  { t: v.t("nadie"), sonido: "aviso", db: -11, vel: 1.0, que: "Lectura fija en 100 · Nadie tocó la pantalla" },
  { t: v.t("lluvia"), sonido: "cristal", db: -10, vel: 1.0, que: "Gotas de lluvia disparan múltiples cruces" },
  { t: v.t("gota"), sonido: "toque", db: -11, vel: 1.15, que: "Gota conductora sobre el vidrio" },
  { t: v.t("tactiles"), sonido: "desliza", db: -12, vel: 1.1, que: "Entrada del guante táctil con hilo de plata" },
  { t: v.t("conductores"), sonido: "enganche", db: -11, vel: 1.05, que: "Hilos conductores puentean la carga" },
  { t: v.t("nunca#2"), sonido: "golpe-hondo", db: -11, vel: 1.0, que: "Tarjeta resumen < 1 pF (100 -> 71)" },
  { t: v.t("mojadas"), sonido: "timbre", db: -11, vel: 1.05, que: "Cierre y llamada a compartir" },
];

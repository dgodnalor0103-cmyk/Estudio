// Efectos sonoros sincronizados para Viral 2 (Teclado Invisible — 78.57 s completos, 10.6M vistas)
export default (v) => [
  // Plano 1: Gancho 3D rasante + Retícula + Comparación dividida
  { t: 0.10, sonido: "desliza", db: -14, vel: 1.1, que: "Entrada del teclado 3D en perspectiva" },
  { t: v.t("pequena"), sonido: "toque", db: -11, vel: 1.0, que: "Pulgar desciende sobre la tecla e" },
  { t: v.t("dedo"), sonido: "clic", db: -12, vel: 1.1, que: "Globo emergente de la letra e" },
  { t: v.t("aciertas"), sonido: "toque", db: -12, vel: 1.15, que: "Acierto en la tecla e" },
  { t: v.t("siempre"), sonido: "cristal", db: -11, vel: 1.05, que: "Selección azul en siempre" },
  { t: v.t("posible"), sonido: "cuadro", db: -12, vel: 1.05, que: "Retícula táctil (+) descentrada" },
  { t: v.t("rapido"), sonido: "tic", db: -12, vel: 1.25, que: "Escritura rápida sin mirar" },
  { t: v.t("ves"), sonido: "desliza", db: -12, vel: 1.1, que: "Despliegue de comparación lo que ves vs lo que tocas" },
  { t: v.t("tocando"), sonido: "golpe-hondo", db: -11, vel: 1.0, que: "Encendido de zonas ámbar invisibles y selección en tocando" },
  { t: v.t("tamano"), sonido: "aprieta", db: -12, vel: 1.05, que: "Cambio de tamaño en secreto" },

  // Plano 2: Zonas invisibles J-K-L + Ejemplo H-O-L -> A (96%)
  { t: v.t("Detras") + 0.12, sonido: "cuadro", db: -12, vel: 1.05, que: "Zoom en teclas J K L" },
  { t: v.t("invisible"), sonido: "timbre", db: -11, vel: 1.0, que: "Selección azul en invisible" },
  { t: v.t("atrapa"), sonido: "enganche", db: -12, vel: 1.05, que: "Región de impacto captura el dedo" },
  { t: v.t("mensaje"), sonido: "clic", db: -11, vel: 1.1, que: "Apertura de barra de mensaje" },
  { t: v.t("teclear"), sonido: "tic", db: -12, vel: 1.2, que: "Tipeo de H, O y L" },
  { t: v.t("apuesta"), sonido: "sube", db: -12, vel: 1.1, que: "Apuesta matemática del diccionario" },
  { t: v.t("real"), sonido: "cristal", db: -11, vel: 1.0, que: "Comparación HOLA (real) vs HOLW (0%)" },
  { t: v.t("noventa"), sonido: "timbre", db: -11, vel: 1.05, que: "96% de probabilidad para la A" },
  { t: v.t("expande"), sonido: "aprieta", db: -11, vel: 1.0, que: "La zona de la A se expande +72% y comprime a las vecinas" },

  // Plano 3: Aterrizaje entre A y S + Recálculo + Origen 2007 + Truco Touch-Up + Cierre
  { t: v.t("pantalla#2") + 0.12, sonido: "desliza", db: -12, vel: 1.1, que: "Vista de teclas estáticas en pantalla" },
  { t: v.t("nada"), sonido: "tic", db: -12, vel: 1.15, que: "Ninguna tecla física se mueve" },
  { t: v.t("pulgar"), sonido: "toque", db: -11, vel: 1.0, que: "Pulgar aterriza desviado entre A y S" },
  { t: v.t("escribe"), sonido: "timbre", db: -11, vel: 1.1, que: "Captura exitosa de la letra A -> HOLA" },
  { t: v.t("recalcula"), sonido: "sube", db: -11, vel: 1.05, que: "Recálculo instantáneo de las 26 zonas" },
  { t: v.t("sistema#2"), sonido: "cuadro", db: -12, vel: 1.05, que: "Esquema del teléfono de 2007 (320 px vs 44 px)" },
  { t: v.t("cuarenta"), sonido: "clic", db: -12, vel: 1.1, que: "Cota de botón cómodo de 44 píxeles" },
  { t: v.t("truco"), sonido: "desliza", db: -12, vel: 1.1, que: "Segundo truco: confirmación al levantar" },
  { t: v.t("levantar"), sonido: "enganche", db: -11, vel: 1.05, que: "Confirmación touch-up al levantar el dedo" },
  { t: v.t("objetivo"), sonido: "cristal", db: -11, vel: 1.0, que: "Doble teclado en vivo moviendo el objetivo" },
  { t: v.t("culpa"), sonido: "timbre", db: -11, vel: 1.05, que: "Cierre y llamada a compartir" },
];

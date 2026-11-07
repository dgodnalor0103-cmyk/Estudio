// Pista de efectos sonoros sincronizada al milisegundo con los timestamps de voz (Estilo @speedy_devv)
export default (v) => [
  // Plano 1: Gancho DualSense -> Partículas -> 2 Mandos Co-op + GitHub + Directorio Co-op
  { t: 0.08, sonido: "tic", db: -14, vel: 1.2, que: "Insignia P1 UN JUGADOR" },
  { t: v.t("convierte"), sonido: "aire", db: -11, vel: 1.0, que: "Barrido de desintegración de partículas" },
  { t: v.t("juegos"), sonido: "aviso", db: -13, vel: 1.15, que: "Tachado rojo sobre UN" },
  { t: v.t("cooperativo"), sonido: "golpe-hondo", db: -11, vel: 1.0, que: "Reconstrucción en 2 mandos P1 y P2" },
  { t: v.t("cooperativo") + 0.08, sonido: "cristal", db: -12, vel: 1.05, que: "Selección azul en cooperativo" },

  { t: v.t("Es"), sonido: "desliza", db: -13, vel: 1.1, que: "Entrada de ventana GitHub coop-anything" },
  { t: v.t("gratis"), sonido: "clic", db: -11, vel: 1.0, que: "Selección azul en gratis + Licencia MIT" },
  { t: v.t("lee"), sonido: "toque", db: -13, vel: 1.2, que: "Selección de prompt para el agente" },
  { t: v.t("buscar"), sonido: "cuadro", db: -12, vel: 1.1, que: "Apertura del Directorio Co-op 297 proyectos" },
  { t: v.t("mod"), sonido: "enganche", db: -11, vel: 1.05, que: "Lupa enfoca Deus Ex" },

  // Plano 2: RUTA 1 (revivir con cinta) + RUTA 2 (plano técnico NUEVO MOD) + Zelda y Deus-Ex
  { t: v.t("Repara") + 0.12, sonido: "desliza", db: -13, vel: 1.1, que: "Entrada de RUTA 1 revivir" },
  { t: v.t("abandonado"), sonido: "aprieta", db: -12, vel: 1.0, que: "Cinta adhesiva repara el mod roto" },
  { t: v.t("crea"), sonido: "papel", db: -12, vel: 1.05, que: "Despliegue de plano técnico RUTA 2 crear" },
  { t: v.t("cero"), sonido: "golpe", db: -11, vel: 1.0, que: "Sello NUEVO MOD y selección azul en cero" },
  { t: v.t("Zelda"), sonido: "cuadro", db: -12, vel: 1.1, que: "Pantalla dividida Zelda Ocarina of Time P1 y P2" },
  { t: v.t("Deus-Ex"), sonido: "timbre", db: -12, vel: 1.05, que: "Mapa global de campaña completa Deus Ex" },

  // Plano 3: Steam Unirse + Router sin puertos ni IP + 1,300+ Estrellas + Comenta COOP
  { t: v.t("tu#2") + 0.12, sonido: "desliza", db: -13, vel: 1.1, que: "Ventana de Amigos en Steam" },
  { t: v.t("Steam"), sonido: "clic", db: -10, vel: 1.0, que: "Clic en Unirse y selección azul en Steam" },
  { t: v.t("abrir"), sonido: "cuadro", db: -13, vel: 1.05, que: "Panel del Router en modo claro" },
  { t: v.t("puertos"), sonido: "aviso", db: -12, vel: 1.0, que: "Tachado rojo de IP 203.0.113.42" },
  { t: v.t("IP"), sonido: "aviso", db: -12, vel: 1.1, que: "Tachado rojo de Reenvío de puertos" },

  { t: v.t("Sumo"), sonido: "desliza", db: -13, vel: 1.1, que: "Tarjeta de Historial de estrellas" },
  { t: v.t("estrellas"), sonido: "sube", db: -11, vel: 1.0, que: "Curva dorada sube a 1,300+ estrellas" },
  { t: v.t("comenta"), sonido: "cuadro", db: -13, vel: 1.1, que: "Ventana de Comentarios con teclado" },
  { t: v.t("COOP"), sonido: "toque", db: -10, vel: 1.0, que: "Escritura de COOP y selección azul" },
  { t: v.t("enlaces"), sonido: "cristal", db: -11, vel: 1.05, que: "Notificación DM con enlaces y cierre" },
];

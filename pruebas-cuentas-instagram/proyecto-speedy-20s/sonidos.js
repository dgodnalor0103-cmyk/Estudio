// Pista de efectos sonoros sincronizada al milisegundo con los timestamps de voz (Estilo @speedy_devv)
export default (v) => [
  // Plano 1: Contacto capacitivo y rayos X iónicos
  { t: 0.12, sonido: "desliza", db: -14, vel: 1.15, que: "Dedo bajando hacia el cristal" },
  { t: v.t("toca"), sonido: "toque", db: -10, vel: 1.0, que: "Contacto del dedo con el cristal" },
  { t: 1.05, sonido: "tic", db: -14, vel: 1.3, que: "Puntero GLASS" },
  { t: 1.65, sonido: "tic", db: -14, vel: 1.1, que: "Puntero ITO SENSORS" },
  { t: v.t("presionando"), sonido: "aviso", db: -13, vel: 1.1, que: "Caja roja: sin botón mecánico" },
  { t: v.t("boton"), sonido: "clic", db: -11, vel: 1.0, que: "Selección azul en 'botón'" },

  // Frase 2: Rayos X Na+/Cl- y robo de carga eléctrica
  { t: v.t("piel"), sonido: "aire", db: -13, vel: 1.05, que: "Transición a Rayos X iónico Na+/Cl-" },
  { t: v.t("roba"), sonido: "enganche", db: -12, vel: 1.1, que: "Arcos dorados se curvan hacia el dedo" },
  { t: v.t("electrica"), sonido: "cristal", db: -11, vel: 1.0, que: "Caída de capacitancia 100 -> 58" },
  { t: v.t("marcar"), sonido: "sube", db: -13, vel: 1.15, que: "Retícula verde de coordenada" },
  { t: v.t("exacto"), sonido: "timbre", db: -12, vel: 1.1, que: "Bloqueo de punto exacto" },

  // Plano 2: 3 capas isométricas + what you see vs what you touch
  { t: v.t("tres"), sonido: "cuadro", db: -13, vel: 1.1, que: "Capa isométrica 1 y 2" },
  { t: v.t("invisibles"), sonido: "cuadro", db: -12, vel: 0.95, que: "Capa isométrica 3" },
  { t: v.t("agrandan"), sonido: "aprieta", db: -11, vel: 1.0, que: "Zonas ámbar se expanden en vivo" },
  { t: v.t("secreto"), sonido: "clic", db: -10, vel: 1.05, que: "Selección azul en 'secreto'" },
  { t: v.t("letra"), sonido: "toque", db: -12, vel: 1.2, que: "Pulso en tecla A expandida" },

  // Plano 3: Zoom de precisión + Timeline a 60 FPS
  { t: v.t("aciertas"), sonido: "toque", db: -10, vel: 1.0, que: "Toque desviado capturado por hitbox A" },
  { t: v.t("palabra"), sonido: "timbre", db: -12, vel: 1.05, que: "Confirmación verde HITBOX [A]" },
  { t: v.t("corriendo"), sonido: "tic", db: -13, vel: 1.3, que: "Playhead 60 FPS avanzando" },
  { t: v.t("pantalla"), sonido: "cristal", db: -11, vel: 1.0, que: "Selección azul final en 'pantalla'" },
];

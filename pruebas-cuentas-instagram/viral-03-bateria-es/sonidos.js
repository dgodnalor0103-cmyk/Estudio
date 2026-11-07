// Efectos sonoros sincronizados para Viral 3 (Batería de Laptop — 89.90 s completos, 3.2M vistas)
export default (v) => [
  // Plano 1: Gancho MagSafe + Laptop agrietándose + Giro a Modo Claro + Celda de Litio
  { t: 0.15, sonido: "enganche", db: -11, vel: 1.05, que: "Acople magnético del cargador y encendido LED ámbar" },
  { t: v.t("enchufada"), sonido: "toque", db: -12, vel: 1.1, que: "Contacto de pines de carga" },
  { t: v.t("destruye"), sonido: "cruje", db: -10, vel: 1.0, que: "Chasis de aluminio agrietándose con fisuras ámbar" },
  { t: v.t("completamente"), sonido: "desliza", db: -12, vel: 1.15, que: "Cambio a Modo Claro" },
  { t: v.t("falso"), sonido: "aviso", db: -11, vel: 1.0, que: "Sello MITO FALSO y selección azul en falso" },

  { t: v.t("desgasta"), sonido: "cuadro", db: -12, vel: 1.05, que: "Apertura del corte transversal de la batería" },
  { t: v.t("dentro"), sonido: "clic", db: -12, vel: 1.1, que: "Selección azul en dentro" },
  { t: v.t("litio"), sonido: "cristal", db: -11, vel: 1.0, que: "Selección azul en litio e iones dorados Li+" },
  { t: v.t("anodo"), sonido: "tic", db: -13, vel: 1.2, que: "Salida desde el ánodo de cobre" },
  { t: v.t("electrones"), sonido: "sube", db: -12, vel: 1.05, que: "Electrones suben hacia la laptop" },
  { t: v.t("corriente"), sonido: "timbre", db: -12, vel: 1.05, que: "Selección azul en corriente eléctrica" },
  { t: v.t("agota"), sonido: "aviso", db: -12, vel: 1.0, que: "Batería agotada al llegar todos al cátodo" },
  { t: v.t("regresan"), sonido: "enganche", db: -11, vel: 1.05, que: "Al enchufarla todos regresan al inicio" },

  // Plano 2: Iones atrapados + Capacidad + Costra y Calor + Extremos vs 20-80%
  { t: v.t("practica") + 0.12, sonido: "cuadro", db: -12, vel: 1.05, que: "Vista de reacciones parásitas en el ánodo" },
  { t: v.t("atrapados"), sonido: "aprieta", db: -11, vel: 1.0, que: "Iones bloqueados en rojo en el ánodo" },
  { t: v.t("capacidad"), sonido: "golpe-hondo", db: -11, vel: 1.0, que: "Reducción de barra de capacidad máxima (100% -> 78%)" },
  { t: v.t("costra"), sonido: "cruje", db: -12, vel: 1.05, que: "Costra microscópica SEI frenando iones" },
  { t: v.t("calor"), sonido: "aviso", db: -11, vel: 1.0, que: "Entrada de cámara térmica infrarroja (> 39 °C)" },
  { t: v.t("ventiladores"), sonido: "aire", db: -12, vel: 0.95, que: "Alerta de ventiladores tapados en cama" },
  { t: v.t("extremos"), sonido: "golpe", db: -11, vel: 1.05, que: "Selección azul en extremos" },
  { t: v.t("apretados"), sonido: "aprieta", db: -11, vel: 1.0, que: "Iones comprimidos al 100% bajo alta tensión" },
  { t: v.t("ochenta"), sonido: "cristal", db: -11, vel: 1.0, que: "Zona cómoda del 20% al 80% sin estrés" },

  // Plano 3: Laptops modernas + Energía directa del cable + Límite del 80% + Cierre
  { t: v.t("enchufada#2") + 0.12, sonido: "cuadro", db: -12, vel: 1.05, que: "Esquema de gestión en laptops modernas" },
  { t: v.t("modernas"), sonido: "clic", db: -11, vel: 1.0, que: "Selección azul en modernas" },
  { t: v.t("desconecta"), sonido: "enganche", db: -11, vel: 1.05, que: "Aislamiento automático de la batería" },
  { t: v.t("cable"), sonido: "sube", db: -11, vel: 1.05, que: "Flujo verde de energía directa del cable AC" },
  { t: v.t("sistema"), sonido: "desliza", db: -12, vel: 1.1, que: "Giro a Modo Claro: Panel de Salud de Batería" },
  { t: v.t("limite"), sonido: "clic", db: -10, vel: 1.0, que: "Activación del interruptor de límite al 80%" },
  { t: v.t("estres"), sonido: "timbre", db: -11, vel: 1.05, que: "Gráfica verde estable al 80% todo el día y cierre" },
];

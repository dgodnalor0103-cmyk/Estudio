// Diseño sonoro sincronizado a cada acción física de MITOS DE TU CELULAR · EP. 1
// Todos los tiempos nacen de `v.frase(n).t(...)`, lejos de los cortes y sin huecos > 2 s.
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
  const f12 = v.frase(12);
  const f13 = v.frase(13);

  // ---------------- Plano 01 (0.00 - 4.56 s): Barra rápida + Rayos X ----------------
  pon("clic", 0.12, { db: -13, que: "se posa la insignia MITOS DE TU CELULAR · EP. 1" });
  pon("aire", f1.t("apagar") + 0.18, { ancla: "empieza", db: -13, vel: 0.9, que: "entra el dedo hacia la barra rápida" });
  pon("toque", f1.t("barra") + 0.04, { db: -9, que: "el dedo toca el botón azul de WiFi" });
  pon("aire", f1.t("celular") + 0.1, { ancla: "empieza", db: -14, vel: 0.78, que: "zoom hacia el interior del celular" });
  pon("desliza", f1.t("no") + 0.02, { db: -12, que: "se abre la ventana de rayos X sobre la placa" });
  pon("late", f1.t("apaga") + 0.06, { db: -10, que: "late el chip de la antena encendida" });
  pon("late", f1.t("apaga") + 0.66, { db: -14, vel: 1.06, corta: f2.t("esta") - 0.1, que: "segundo pulso de ondas verdes" });

  // ---------------- Plano 02 (4.56 - 8.44 s): Cuarto de noche ----------------
  pon("aire", f2.t("noche") + 0.1, { ancla: "empieza", db: -14, vel: 0.8, que: "paneo suave por el dormitorio iluminado" });
  pon("clic", f2.t("luz") - 0.04, { db: -9, vel: 0.92, que: "se apaga el interruptor de la lámpara de noche" });
  pon("late", f2.t("seguir") + 0.05, { db: -11, que: "el celular en la mesa dispara ondas en la oscuridad" });
  pon("pitido", f2.t("redes") + 0.08, { db: -14, lp: 4200, corta: f3.inicio - 0.1, que: "escaneo silencioso buscando redes" });

  // ---------------- Plano 03 (8.44 - 18.04 s): Router vs Antena + 3 accesorios ----------------
  pon("aire", f3.t("confirma") + 0.08, { ancla: "empieza", db: -14, vel: 0.85, que: "flujo de datos hacia el router" });
  pon("tic", f3.t("botón") + 0.24, { db: -15, que: "pulsos del enlace antes de desconectar" });
  pon("estallido", f3.t("desconecta") + 0.04, { db: -10, vel: 1.35, lp: 2400, que: "chispazo al cortar el puente con el router" });
  pon("clic", f3.t("router") + 0.15, { db: -13, que: "marca X roja de desconexión del router" });
  pon("late", f3.t("antena") + 0.04, { db: -10, que: "la antena interior late encendida en verde" });
  pon("aire", f3.t("encendida") + 0.52, { ancla: "empieza", db: -13, vel: 0.78, que: "el celular pasa al centro de la escena" });
  pon("clic", f4.t("AirDrop") + 0.06, { db: -11, vel: 1.05, que: "entra y se ilumina AirDrop" });
  pon("enganche", f4.t("reloj") + 0.06, { db: -11, que: "entra y sincroniza el reloj inteligente" });
  pon("pitido", f4.t("ubicación") + 0.06, { db: -12, lp: 4800, que: "se activa el pin GPS de ubicación" });
  pon("late", f4.t("funcionando") + 0.26, { db: -14, corta: f5.inicio - 0.1, que: "pulso conjunto de los 3 servicios" });

  // ---------------- Plano 04 (18.04 - 23.32 s): 05:00 AM en iPhone ----------------
  pon("tic", f5.t("Peor") + 0.35, { db: -14, vel: 1.0, que: "corre el reloj digital de madrugada" });
  pon("tic", f5.t("iPhone") + 0.05, { db: -14, vel: 1.08, que: "avanzan las horas hacia las 5 AM" });
  pon("aviso", f5.t("cinco") + 0.02, { db: -9, que: "dan las 05:00 AM y despierta la pantalla sola" });
  pon("clic", f5.t("reconecta") + 0.06, { db: -11, que: "notificación de WiFi reactivado solo" });
  pon("late", f5.t("duermes") + 0.04, { db: -13, corta: f6.inicio - 0.1, que: "ondas azules de reconexión mientras duermes" });

  // ---------------- Plano 05 (23.32 - 28.36 s): Radar Android y vecinos ----------------
  pon("aire", f6.t("Android") + 0.08, { ancla: "empieza", db: -14, vel: 0.85, que: "vista cenital del departamento" });
  pon("toque", f6.t("apagues") + 0.04, { db: -12, que: "tarjeta WiFi pasa a OFF en Android" });
  pon("sube", f6.t("Ubicación") + 0.04, { db: -12, vel: 0.9, que: "arranca el barrido de radar 360 de Ubicación" });
  pon("pitido", f6.t("escaneando") + 0.08, { db: -12, vel: 1.05, lp: 4800, que: "el radar detecta los routers 301 y 302" });
  pon("pitido", f6.t("vecinos") - 0.12, { db: -11, vel: 0.95, lp: 4600, corta: f7.inicio - 0.1, que: "detecta router de cafetería y marca 3 redes" });

  // ---------------- Plano 06 (28.36 - 32.68 s): Puerta con llave vs Ventanas abiertas ----------------
  pon("madera", f7.t("cerrar") + 0.04, { db: -10, que: "se cierra la puerta principal de roble" });
  pon("metal", f7.t("llave") + 0.08, { db: -9, vel: 1.08, que: "el candado de bronce encaja y cierra con llave" });
  pon("aire", f7.t("dejar") + 0.05, { ancla: "empieza", db: -13, vel: 0.78, que: "la cámara sube al segundo piso" });
  pon("cuadro", f7.t("ventanas") + 0.02, { db: -11, vel: 1.15, que: "se abren de golpe los postigos de las 3 ventanas" });
  pon("sube", f7.t("abiertas") + 0.22, { db: -13, vel: 0.95, corta: f8.inicio - 0.1, que: "escapan luz y señal por las ventanas abiertas" });

  // ---------------- Plano 07 (32.68 - 37.48 s): Calle, tiendas y batería ----------------
  pon("aire", f8.t("calle") + 0.08, { ancla: "empieza", db: -13, vel: 0.75, que: "recorrido urbano frente a las tiendas" });
  pon("pitido", f8.t("rastreo") + 0.16, { db: -13, lp: 4500, que: "router del Café detecta el paso del celular" });
  pon("tic", f8.t("batería") + 0.05, { db: -13, vel: 0.95, que: "cae el porcentaje del medidor de batería" });
  pon("clic", f8.t("registra") + 0.04, { db: -11, que: "etiqueta REGISTRADO sobre tienda de Moda" });
  pon("clic", f8.t("tiendas") + 0.02, { db: -11, vel: 1.08, que: "etiqueta REGISTRADO sobre tercera tienda" });
  pon("late", f8.t("pasaste") + 0.32, { db: -14, corta: f9.inicio - 0.1, que: "alerta de gasto de batería en rojo" });

  // ---------------- Plano 08 (37.48 - 46.92 s): Solución en Ajustes + Android Ubicación ----------------
  pon("aire", f9.t("apagarlo") + 0.06, { ancla: "empieza", db: -13, vel: 0.9, que: "entra la tarjeta limpia de Ajustes" });
  pon("enganche", f9.t("raíz") + 0.35, { db: -15, que: "gira el engranaje de Ajustes" });
  pon("aire", f9.t("Ajustes") + 0.18, { ancla: "empieza", db: -14, vel: 0.95, que: "entra el dedo hacia el interruptor maestro" });
  pon("toque", f9.t("desactiva") + 0.16, { db: -9, que: "el dedo apaga el interruptor verde de Wi-Fi" });
  pon("clic", f9.t("tachado") - 0.04, { db: -10, que: "se tacha en rojo el ícono de Wi-Fi (0 mW)" });
  pon("desliza", f10.t("Android") - 0.05, { db: -12, vel: 0.95, que: "sube la tarjeta Android · Ubicación" });
  pon("toque", f10.t("apaga") + 0.18, { db: -9, que: "el dedo apaga Búsqueda de Wi-Fi en Android" });
  pon("clic", f10.t("WiFi") + 0.1, { db: -12, que: "confirmación Escaneo oculto bloqueado" });
  pon("enganche", f10.t("Ubicación") + 0.12, { db: -13, corta: f11.inicio - 0.1, que: "píldora 0 % rastreo · batería protegida" });

  // ---------------- Plano 09 (46.92 - 60.80 s): Cierre, compartir, gancho EP. 2 y loop ----------------
  pon("toque", f11.t("tocas") + 0.04, { db: -10, que: "el dedo toca arriba en la barra rápida" });
  pon("desliza", f11.t("noche") + 0.06, { db: -13, que: "se abre rayos X nocturno" });
  pon("late", f11.t("despertar") + 0.02, { db: -10, que: "la antena vuelve a despertar en verde" });
  pon("sube", f12.t("Envíaselo") + 0.06, { db: -11, vel: 1.05, que: "emblema de avión de papel para compartir" });
  pon("clic", f12.t("arriba") + 0.04, { db: -13, que: "el botón WiFi vuelve a azul para el loop" });
  pon("aire", f12.t("batería") + 0.35, { ancla: "empieza", db: -14, vel: 0.85, que: "ondas azules de compartir" });
  pon("golpe", f13.t("mañana") + 0.12, { db: -10, que: "entra la insignia MAÑANA · EP. 2" });
  pon("clic", f13.t("dos") + 0.25, { db: -13, que: "etiqueta CABLE BARATO vs. TU CELULAR" });
  pon("enganche", f13.t("cable") + 0.05, { db: -11, que: "el conector barato se acerca al puerto inferior" });
  pon("estallido", f13.t("quema") + 0.04, { db: -10, vel: 1.4, lp: 2600, que: "chispazo térmico naranja en el puerto de carga" });
  pon("aire", f13.t("dentro") + 0.18, { ancla: "empieza", db: -13, vel: 0.85, que: "el cable se retira cerrando el loop hacia el inicio" });

  return e;
}

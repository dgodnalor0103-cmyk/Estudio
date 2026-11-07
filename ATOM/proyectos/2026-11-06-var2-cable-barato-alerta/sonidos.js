// Diseño sonoro sincronizado a cada acción física de MITOS DE TU CELULAR · EP. 2
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

  // ---------------- Plano 01 (0.00 - 6.16 s): Insignia EP. 2 + Cable barato y chispas ----------------
  pon("clic", 0.14, { db: -13, que: "se posa la insignia MITOS DE TU CELULAR · EP. 2" });
  pon("sube", 0.85, { db: -14, vel: 1.05, que: "flujo limpio de carga rápida original" });
  pon("desliza", f1.t("original") + 0.08, { db: -13, que: "radiografía verde del conector original" });
  pon("late", f1.t("original") + 1.05, { db: -15, que: "pulso estable de batería protegida" });
  pon("aire", f1.t("pero") + 0.04, { ancla: "empieza", db: -13, vel: 0.9, que: "sale el cable original y entra el barato" });
  pon("enganche", f1.t("barato") + 0.06, { db: -10, que: "encaja el conector genérico negro en el puerto" });
  pon("estallido", f1.t("quemarlo") + 0.04, { db: -9, vel: 1.38, lp: 2600, que: "chispazo térmico naranja en el puerto USB-C" });
  pon("late", f1.t("dentro") + 0.18, { db: -12, corta: f2.inicio - 0.14, que: "alerta de puerto en riesgo a 89 °C" });

  // ---------------- Plano 02 (6.16 - 10.60 s): Radiografía de los dos cables ----------------
  pon("aire", f2.t("fuera") + 0.08, { ancla: "empieza", db: -14, vel: 0.88, que: "se presentan ambos cables lado a lado" });
  pon("clic", f2.t("iguales") + 0.04, { db: -13, que: "comparación simétrica exterior" });
  pon("desliza", f2.t("dentro") + 0.04, { db: -11, vel: 0.95, que: "se abren las carcasas en radiografía" });
  pon("pitido", f2.t("dentro") + 0.55, { db: -13, lp: 4800, que: "brilla el microchip dorado E-Marker" });
  pon("hueco", f2.t("vacío") + 0.04, { db: -10, corta: f3.inicio - 0.14, que: "resuena la cápsula hueca sin chip del cable barato" });

  // ---------------- Plano 03 (10.60 - 19.88 s): Microchip negociando + Freno al 80 % ----------------
  pon("aire", f3.t("cable") + 0.08, { ancla: "empieza", db: -14, vel: 0.86, que: "encuadre sobre el banco de carga oficial" });
  pon("pitido", f3.t("microchip") + 0.05, { db: -12, lp: 5000, que: "despierta el microchip dorado del cable original" });
  pon("tic", f3.t("negocia") + 0.08, { db: -13, vel: 1.08, que: "paquete digital de negociación sube al celular" });
  pon("enganche", f3.t("voltaje") + 0.18, { db: -11, que: "confirmación 20 W USB-PD exactos" });
  pon("clic", f3.t("celular") + 0.14, { db: -13, que: "enlace bidireccional establecido" });
  pon("sube", f4.t("Carga") + 0.12, { db: -12, vel: 0.96, que: "la batería sube veloz hacia el 80 %" });
  pon("tic", f4.t("80") + 0.06, { db: -12, vel: 1.12, que: "marca el 80 % en pantalla" });
  pon("metal", f4.t("frena") + 0.04, { db: -10, vel: 1.1, que: "entra el escudo esmeralda y frena la corriente" });
  pon("late", f4.t("calentar") + 0.12, { db: -13, corta: f5.inicio - 0.14, que: "batería fría y regulada a 31 °C" });

  // ---------------- Plano 04 (19.88 - 24.44 s): Hilos de cobre finísimos incandescentes ----------------
  pon("desliza", f5.t("cambio") + 0.12, { db: -13, que: "entra macro de taller del cable barato pelado" });
  pon("hueco", f5.t("chip") - 0.04, { db: -11, que: "zócalo vacío donde falta el microchip" });
  pon("cruje", f5.t("hilos") + 0.06, { db: -12, vel: 1.15, que: "vibran los 3 hilos de cobre finísimos" });
  pon("sube", f5.t("cobre") + 0.04, { db: -11, vel: 1.18, que: "los hilos se ponen al rojo vivo por sobrecorriente" });
  pon("estallido", f5.t("finísimos") + 0.22, { db: -12, vel: 1.45, lp: 2800, corta: f6.inicio - 0.14, que: "chisporroteo térmico en el cobre delgado" });

  // ---------------- Plano 05 (24.44 - 30.04 s): Tubería de bronce y tubo finito que revienta ----------------
  pon("aire", f6.t("meter") - 0.08, { ancla: "empieza", db: -13, vel: 0.82, que: "caudal fuerte por la tubería maestra de bronce" });
  pon("sube", f6.t("agua") + 0.06, { db: -12, vel: 0.88, que: "torrente de agua empuja hacia el tubo angosto" });
  pon("aprieta", f6.t("tubo") + 0.12, { db: -11, que: "el tubo plástico finito empieza a hincharse" });
  pon("clic", f6.t("válvula") + 0.04, { db: -11, que: "sello rojo SIN VÁLVULA sobre la brida" });
  pon("cruje", f6.t("unión") - 0.04, { db: -11, vel: 1.1, que: "cruje la junta hinchada al límite" });
  pon("estallido", f6.t("revienta") + 0.02, { db: -8.5, vel: 1.15, que: "revienta la unión lanzando chorros y gotas" });

  // ---------------- Plano 06 (30.04 - 34.92 s): Pines carbonizados y chip de carga quemado ----------------
  pon("aire", f7.t("control") - 0.08, { ancla: "empieza", db: -14, vel: 0.9, que: "entra vista macro de la placa madre" });
  pon("sube", f7.t("corriente") + 0.14, { db: -12, vel: 1.15, que: "pulsos naranjas suben sin freno por las pistas" });
  pon("estallido", f7.t("pines") - 0.04, { db: -10, vel: 1.4, lp: 2500, que: "arcos eléctricos carbonizan los pines centrales" });
  pon("golpe", f7.t("quema") + 0.04, { db: -9.5, que: "sobrecarga golpea y agrieta el CHIP DE CARGA" });
  pon("cruje", f7.t("interior") - 0.06, { db: -12, vel: 1.2, corta: f8.inicio - 0.14, que: "cortocircuito y humo en el regulador interior" });

  // ---------------- Plano 07 (34.92 - 39.52 s): Punta que quema al tocarla + cable doblado ----------------
  pon("aire", f8.t("punta") - 0.12, { ancla: "empieza", db: -14, vel: 0.95, que: "el dedo se acerca a la punta metálica caliente" });
  pon("toque", f8.t("quema") + 0.04, { db: -9.5, que: "el dedo toca la punta ardiente a 68 °C" });
  pon("aire", f8.t("tocarla") + 0.04, { ancla: "empieza", db: -12, vel: 1.18, que: "el dedo se retira de golpe por el calor" });
  pon("tic", f8.t("carga") - 0.06, { db: -13, que: "parpadea la pantalla por falso contacto" });
  pon("aprieta", f8.t("doblas") + 0.02, { db: -11, vel: 1.05, corta: f9.inicio - 0.14, que: "el cable se dobla forzando el puerto dañado" });

  // ---------------- Plano 08 (39.52 - 44.76 s): Guía cable certificado + desconectar al instante ----------------
  pon("desliza", f9.t("evitarlo") + 0.04, { db: -12, que: "entra Tarjeta 1 de cable certificado" });
  pon("timbre", f9.t("certificados") + 0.08, { db: -11, lp: 5200, que: "sello verde de cable certificado con chip" });
  pon("desliza", f9.t("desconéctalo") - 0.04, { db: -12, vel: 1.04, que: "entra Tarjeta 2 de alerta térmica" });
  pon("enganche", f9.t("inmediato") + 0.04, { db: -10, vel: 0.92, que: "el conector caliente se desenchufa de inmediato" });
  pon("clic", f9.t("calienta") + 0.06, { db: -12, corta: f10.inicio - 0.14, que: "confirmación celular protegido" });

  // ---------------- Plano 09 (44.76 - 55.20 s): Compartir al amigo + Gancho EP. 3 + Loop ----------------
  pon("sube", f10.t("Envíaselo") + 0.12, { db: -11, vel: 1.05, que: "entra emblema de avión de papel para compartir" });
  pon("clic", f10.t("amigo") + 0.12, { db: -12, que: "ondas azules de enviar al amigo" });
  pon("tic", f10.t("cable") + 0.14, { db: -14, que: "pulso limpio de carga rápida original" });
  pon("aire", f10.t("esquina") + 0.12, { ancla: "empieza", db: -14, vel: 0.9, que: "transición suave hacia el anuncio de mañana" });
  pon("golpe", f11.t("mañana") + 0.12, { db: -10, que: "entra la insignia MAÑANA · EP. 3" });
  pon("clic", f11.t("tres") + 0.22, { db: -12, que: "subtítulo TUS FOTOS BORRADAS SIGUEN EN EL CHIP" });
  pon("pitido", f11.t("verdad") + 0.04, { db: -13, lp: 4800, que: "escaneo del chip de memoria NAND" });
  pon("desliza", f11.t("fotos") - 0.04, { db: -11, que: "aparece la tarjeta del chip con la foto intacta" });
  pon("late", f11.t("celular") + 0.12, { db: -13, que: "último pulso verde de la foto en el chip" });
  pon("aire", v.duracion - 0.65, { ancla: "empieza", db: -14, vel: 0.9, corta: v.duracion - 0.08, que: "se pliega la insignia cerrando el loop al Fotograma 0" });

  return e;
}

import fs from "node:fs";
import path from "node:path";

const ATOM = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM";

const episodios = [
  {
    slug: "2026-11-04-ep5-modo-avion-rastreo",
    pie: `Poner tu celular en Modo Avión NO impide que registre cada calle por donde caminas ✈️📍

El Modo Avión solo apaga las antenas que transmiten (WiFi, datos y Bluetooth), pero el chip GPS es un receptor pasivo que sigue escuchando satélites del cielo, y el barómetro junto al acelerómetro anotan cada paso, giro y piso que subes en la memoria interna. Envíaselo a ese amigo que activa el Modo Avión creyendo que así nadie sabe a dónde fue. ¿Tú también pensabas que el Modo Avión apagaba el GPS? 👇

#tecnologia #celular #trucoscelular #privacidad #curiosidades #puraprueba`,
    guion: {
      titulo: "Por qué el Modo Avión no apaga el rastreo de tu celular",
      idioma: "es",
      subtitulos: "arriba",
      voz: {
        id: "gWaDC0oXAheKoZfljzuI",
        modelo: "eleven_v4",
        estabilidad: 0.4,
        similitud: 0.8,
        estilo: 0,
        velocidad: 1.12,
      },
      frases: [
        {
          texto: "¿Sabías que poner tu celular en modo avión no impide que siga registrando por dónde caminas?",
          clave: "caminas",
          hook: true,
        },
        {
          texto: "El ícono del avión apaga tus llamadas y tu internet, pero no apaga el chip que lee tu ubicación.",
          clave: "ubicación",
          hook: true,
        },
        {
          texto: "El modo avión solo corta las antenas que emiten ondas para no interferir con la cabina del vuelo.",
          clave: "emiten",
        },
        {
          texto: "Pero el chip GPS de tu celular no emite nada: solo escucha en silencio los satélites del cielo.",
          clave: "escucha",
        },
        {
          texto: "Es como taparte la boca con cinta para no hablar, pero seguir con los ojos abiertos anotando cada calle en una libreta.",
          clave: "libreta",
        },
        {
          texto: "Además, aunque entres a un túnel, el giroscopio y el barómetro cuentan tus pasos, tus giros y qué piso subiste.",
          clave: "pasos",
        },
        {
          texto: "Todo ese mapa se guarda con hora exacta en la memoria interna y se sube apenas quitas el modo avión.",
          clave: "guarda",
        },
        {
          texto: "Por eso, si de verdad no quieres dejar rastro de tu ruta, el botón del avión no alcanza.",
          clave: "rastro",
        },
        {
          texto: "Entra primero a Ajustes y apaga el interruptor general de Ubicación antes de activar el modo avión.",
          clave: "Ubicación",
        },
        {
          texto: "Envíaselo a ese amigo que pone el modo avión creyendo que así su celular se vuelve invisible.",
          clave: "amigo",
        },
        {
          texto: "Y mañana, episodio seis: por qué activar la RAM virtual vuelve más lento tu celular.",
          clave: "lento",
        },
      ],
    },
  },
  {
    slug: "2026-11-04-ep6-ram-virtual-lento",
    pie: `Activar la «RAM Virtual» de tu celular NO lo hace más rápido: lo frena y desgasta su memoria 🐢📱

Esa función que promete regalarte 8 GB extra de RAM en realidad toma prestado espacio del chip donde guardas tus fotos y archivos, que es hasta 15 veces más lento que la RAM física real y sufre desgaste eléctrico con cada escritura. Envíaselo a ese amigo que activó toda la RAM virtual pensando que su celular iba a volar. ¿La tienes encendida o apagada en tu celular? 👇

#tecnologia #celular #android #rendimiento #mitos #puraprueba`,
    guion: {
      titulo: "La trampa de activar la RAM virtual en tu celular",
      idioma: "es",
      subtitulos: "arriba",
      voz: {
        id: "gWaDC0oXAheKoZfljzuI",
        modelo: "eleven_v4",
        estabilidad: 0.4,
        similitud: 0.8,
        estilo: 0,
        velocidad: 1.12,
      },
      frases: [
        {
          texto: "¿Sabías que activar la famosa RAM virtual de tu celular puede volverlo más lento y desgastar su memoria?",
          clave: "lento",
          hook: true,
        },
        {
          texto: "Las marcas te prometen ocho gigas extra gratis con un botón, pero es un truco con trampa.",
          clave: "trampa",
          hook: true,
        },
        {
          texto: "La memoria RAM real es un chip ultrarrápido soldado al procesador que responde al instante.",
          clave: "ultrarrápido",
        },
        {
          texto: "En cambio, la RAM virtual agarra un pedazo del chip donde guardas tus fotos, que es quince veces más lento.",
          clave: "quince",
        },
        {
          texto: "Es como quitar cosas de la mesa de tu cocina para guardarlas en el sótano y bajar corriendo por cada cuchara.",
          clave: "sótano",
        },
        {
          texto: "Cuando abres tus aplicaciones, el procesador pierde tiempo esperando datos que vienen del chip lento.",
          clave: "esperando",
        },
        {
          texto: "Y como la RAM escribe miles de veces por minuto, ese roce constante va gastando la vida útil de tu almacenamiento.",
          clave: "gastando",
        },
        {
          texto: "Si tu celular ya tiene seis u ocho gigas de RAM física, esa memoria prestada solo le estorba.",
          clave: "estorba",
        },
        {
          texto: "Entra a Ajustes, busca Extensión de memoria o RAM Plus, apágala y reinicia tu celular.",
          clave: "apágala",
        },
        {
          texto: "Envíaselo a ese amigo que subió la RAM virtual al máximo creyendo que su celular iba a volar.",
          clave: "amigo",
        },
        {
          texto: "Y mañana, episodio siete: por qué los vidrios en los lentes de tu cámara arruinan tus fotos.",
          clave: "cámara",
        },
      ],
    },
  },
  {
    slug: "2026-11-04-ep7-protector-camara-fotos",
    pie: `Ponerle vidrios protectores a las cámaras de tu celular ARRUINA tus fotos de noche y el enfoque 📸🚫

Los lentes originales de tu celular ya vienen cubiertos con cristal de zafiro antirreflejo; al pegarles una tapa de vidrio barato encima creas una cámara de aire que rebota los faros en manchas verdes y desvía el láser de enfoque. Envíaselo a ese amigo que le puso brillitos o vidrios gruesos a los lentes de su celular. ¿Tu celular tiene protector en la cámara ahora mismo? 👇

#tecnologia #camara #celular #fotografia #trucoscelular #puraprueba`,
    guion: {
      titulo: "Por qué el protector de cámara arruina las fotos de tu celular",
      idioma: "es",
      subtitulos: "arriba",
      voz: {
        id: "gWaDC0oXAheKoZfljzuI",
        modelo: "eleven_v4",
        estabilidad: 0.4,
        similitud: 0.8,
        estilo: 0,
        velocidad: 1.12,
      },
      frases: [
        {
          texto: "¿Sabías que pegarle protectores de vidrio a las cámaras de tu celular arruina tus fotos de noche?",
          clave: "arruina",
          hook: true,
        },
        {
          texto: "Te los venden para cuidar los lentes, pero esos anillos baratos sabotean toda la óptica de fábrica.",
          clave: "sabotean",
          hook: true,
        },
        {
          texto: "El lente original de tu celular ya trae cristal templado con zafiro y siete capas que evitan reflejos.",
          clave: "zafiro",
        },
        {
          texto: "Al pegarle un vidrio barato encima, dejas un colchón de aire encerrado entre los dos cristales.",
          clave: "aire",
        },
        {
          texto: "Es como ponerte unos lentes de sol de plástico rayado encima de unos anteojos caros recién limpiados.",
          clave: "plástico",
        },
        {
          texto: "De noche, la luz de las farolas rebota dentro de ese hueco y llena tus fotos de fantasmas verdes y neblina.",
          clave: "fantasmas",
        },
        {
          texto: "Además, el borde de pegamento tapa el sensor láser invisible y hace que tu cámara tarde el doble en enfocar.",
          clave: "láser",
        },
        {
          texto: "Por eso, nunca pegues vidrios ni anillos con brillos directamente sobre los lentes de tu cámara.",
          clave: "nunca",
        },
        {
          texto: "Quítalos hoy mismo y usa una funda con borde elevado de dos milímetros: protege igual sin tocar la luz.",
          clave: "funda",
        },
        {
          texto: "Envíaselo a ese amigo que se queja de que su celular toma fotos borrosas y lleva protector en la cámara.",
          clave: "amigo",
        },
        {
          texto: "Y mañana, episodio ocho: el peligro oculto dentro de los puertos USB públicos cuando cargas tu celular.",
          clave: "públicos",
        },
      ],
    },
  },
  {
    slug: "2026-11-04-ep8-usb-publico-datos",
    pie: `Enchufar tu cable directo a un puerto USB público ABRE la puerta de datos de tu celular 🔌⚠️

Un conector USB no solo lleva corriente: por dentro tiene 2 cables de energía en las orillas y 2 cables centrales de datos conectados directo a la memoria de tu celular. Si el puerto público fue alterado, puede leer archivos al instante. Envíaselo a ese amigo que viaja mucho y enchufa su celular en cualquier USB del aeropuerto. ¿Usas los puertos USB públicos o llevas tu propio cargador? 👇

#tecnologia #seguridad #celular #viajes #curiosidades #puraprueba`,
    guion: {
      titulo: "Por qué no debes cargar tu celular en puertos USB públicos",
      idioma: "es",
      subtitulos: "arriba",
      voz: {
        id: "gWaDC0oXAheKoZfljzuI",
        modelo: "eleven_v4",
        estabilidad: 0.4,
        similitud: 0.8,
        estilo: 0,
        velocidad: 1.12,
      },
      frases: [
        {
          texto: "¿Sabías que enchufar tu cable en un puerto USB público conecta tus datos privados a una computadora oculta?",
          clave: "oculta",
          hook: true,
        },
        {
          texto: "Parece un simple enchufe de corriente en el aeropuerto, pero por dentro ese hueco hace mucho más que cargar.",
          clave: "adentro",
          dicho: "Parece un simple enchufe de corriente en el aeropuerto, pero por adentro ese hueco hace mucho más que cargar.",
          hook: true,
        },
        {
          texto: "Si abres tu cable USB verás cuatro hilos metálicos: solo los dos de las orillas llevan electricidad.",
          clave: "cuatro",
        },
        {
          texto: "Los dos hilos del centro son una autopista de datos conectada directo a la memoria de tu celular.",
          clave: "autopista",
        },
        {
          texto: "Es como conectar una manguera para llenar tu tanque de agua que adentro trae escondido un micrófono a tu sala.",
          clave: "micrófono",
        },
        {
          texto: "En un puerto alterado, un chip escondido detrás de la pared pide permiso mientras estás distraído.",
          clave: "escondido",
        },
        {
          texto: "Si tocas Confiar por error o tu sistema es viejo, en segundos copia tus fotos y claves sin que lo notes.",
          clave: "claves",
        },
        {
          texto: "Por eso, nunca conectes tu cable directo a una ranura USB suelta en aeropuertos, hoteles o centros comerciales.",
          clave: "ranura",
        },
        {
          texto: "Usa siempre tu propio cubo de pared en el enchufe normal o pon un bloqueador USB que corta los dos pines del centro.",
          clave: "cubo",
        },
        {
          texto: "Envíaselo a ese amigo que viaja y enchufa su celular en el primer puerto USB libre que encuentra.",
          clave: "amigo",
        },
        {
          texto: "Y entra a mi perfil para ver todos los episodios de la serie Mitos de tu Celular.",
          clave: "perfil",
        },
      ],
    },
  },
];

for (const ep of episodios) {
  const dir = path.join(ATOM, "proyectos", ep.slug);
  fs.mkdirSync(path.join(dir, "video", "planos"), { recursive: true });
  fs.mkdirSync(path.join(dir, "voz"), { recursive: true });
  fs.mkdirSync(path.join(dir, "sonidos"), { recursive: true });
  fs.mkdirSync(path.join(dir, "revisar"), { recursive: true });
  fs.writeFileSync(path.join(dir, "guion.json"), JSON.stringify(ep.guion, null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(dir, "pie.txt"), ep.pie.trim() + "\n", "utf8");
  console.log("Creado proyecto:", ep.slug);
}

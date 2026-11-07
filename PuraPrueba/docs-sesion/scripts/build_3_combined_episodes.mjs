#!/usr/bin/env node
/**
 * Renderizador y Empaquetador Completo de los 3 Nuevos Episodios Combinados (PuraPrueba + ATOM 60fps + ElevenLabs v4):
 *  1. `chicken-wash-myth` -> `workspace/output/2026-11-03-full-visual-ep5-chicken-wash-atom/`
 *  2. `premium-gas-myth`  -> `workspace/output/2026-11-03-full-visual-ep6-premium-gas-atom/`
 *  3. `water-chug-myth`   -> `workspace/output/2026-11-03-full-visual-ep7-water-chug-atom/`
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ESTUDIO = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio";
const KF = path.join(ESTUDIO, "PuraPrueba");
const FV = path.join(KF, "engine/full-visual");
const PY = path.join(KF, "node_modules/.bin/python3");
const NODE = "/usr/local/bin/node";
const CHROME = path.join(
  KF,
  "node_modules/.remotion/chrome-headless-shell/mac-arm64/chrome-headless-shell-mac-arm64/chrome-headless-shell",
);

process.env.PATH = `${path.join(KF, "node_modules/.bin")}:/usr/local/bin:${process.env.PATH ?? ""}`;
process.env.CHROME = CHROME;

const bundlerMod = await import(pathToFileURL(path.join(KF, "node_modules/@remotion/bundler/dist/index.js")).href);
const rendererMod = await import(pathToFileURL(path.join(KF, "node_modules/@remotion/renderer/dist/index.js")).href);
const { bundle } = bundlerMod;
const { renderMedia, renderStill, selectComposition } = rendererMod;

const EPISODES = [
  {
    slug: "chicken-wash-myth",
    outFolder: "2026-11-03-full-visual-ep5-chicken-wash-atom",
    coverTitle: "Lavar el pollo crudo *CONTAMINA* tu cocina",
    coverBadge: "ALERTA 90 CM",
    coverAccent: "#FF1E56",
    stillsSec: [1.5, 4.2, 16.0, 29.5, 36.0, 44.5],
    seoCaption: `Lavar el pollo crudo en el fregadero NO elimina bacterias: las dispersa hasta 90 centímetros por toda tu cocina.

Estudios con cámaras ultravioleta del Departamento de Agricultura (USDA) demostraron que el chorro de agua rebota en la carne y lanza miles de microgotas invisibles cargadas de Campylobacter y Salmonella hacia tus platos limpios, la esponja y la tabla de picar.

El agua fría jamás despega las bacterias adheridas a la fibra muscular; lo único que destruye el 100% de los patógenos en segundos es cocinar el centro de la pieza a 74 °C (165 °F).

Guarda esta regla de cocina segura:
1. Pasa el pollo directo del empaque al sartén caliente.
2. Si necesitas secarlo, usa papel absorbente desechable.
3. Lava tus manos con agua y jabón durante 20 segundos.

Confiesa en los comentarios: ¿en tu casa todavía lavan el pollo crudo antes de cocinarlo?

#Salud #CocinaSegura #Ciencia #Mitos #PuraPrueba #HigieneAlimentaria #Curiosidades #SabiasQue`,
  },
  {
    slug: "premium-gas-myth",
    outFolder: "2026-11-03-full-visual-ep6-premium-gas-atom",
    coverTitle: "La gasolina Premium *NO DA* más potencia",
    coverBadge: "TIRAS 18% DINERO",
    coverAccent: "#FFB800",
    stillsSec: [1.8, 5.0, 17.5, 32.0, 39.5, 48.0],
    seoCaption: `Ponerle gasolina Premium a un auto normal NO limpia más el motor ni te da un solo caballo extra de potencia: tiras hasta un 18% de tu dinero.

Pruebas en dinamómetro de la Asociación Automovilística (AAA) comprobaron que un motor estándar diseñado para gasolina Regular (87 octanos) obtiene 0 caballos adicionales y 0 kilómetros extra por litro al usar Premium (95 o 98 octanos).

El número de octanaje no mide pureza ni energía térmica: solo indica cuánto resiste el combustible antes de explotar por presión en motores turbo de alta compresión. Además, por norma técnica, tanto la Regular como la Premium ya incluyen los mismos aditivos detergentes para proteger tus inyectores.

Guarda esta regla antes de ir a la estación:
1. Revisa la etiqueta en la tapa de tu tanque o manual.
2. Si dice Regular u 87 octanos, no pagues de más.
3. Usa Premium únicamente si el fabricante indica que es obligatorio.

Cuéntame en los comentarios: ¿qué gasolina le pones hoy a tu auto?

#Autos #Dinero #Ahorro #Motores #Mitos #PuraPrueba #Gasolina #ConsejosFinancieros`,
  },
  {
    slug: "water-chug-myth",
    outFolder: "2026-11-03-full-visual-ep7-water-chug-atom",
    coverTitle: "Beber 2L de agua de golpe *NO HIDRATA*",
    coverBadge: "PIERDES MINERALES",
    coverAccent: "#00F0FF",
    stillsSec: [1.5, 4.4, 15.5, 29.0, 37.0, 45.0],
    seoCaption: `Beber 2 litros de agua de golpe NO hidrata más tu cuerpo: este error apaga tu sed antes de tiempo y hace que pierdas minerales clave.

Estudios de fisiología e hidratación clínica demostraron que tragar medio litro o más en pocos segundos engaña a los barorreceptores de tu garganta y diluye de golpe el plasma sanguíneo.

Al detectar esa caída brusca de concentración, tu cerebro cree que tienes exceso de líquido, apaga la hormona antidiurética (ADH) y obliga a tus riñones a expulsar casi toda esa agua hacia la vejiga en menos de dos horas, arrastrando sodio y potasio fuera de tu cuerpo.

Guarda esta guía para hidratar tus células al 100%:
1. Toma sorbos constantes a lo largo del día.
2. Acompaña el agua con tus comidas para retenerla mejor.
3. Suma electrolitos y sales minerales cuando entrenes o sudes fuerte.

Cuéntame en los comentarios: ¿cuántos vasos de agua llevas hoy?

#Salud #Hidratacion #Agua #Energia #Ciencia #Mitos #PuraPrueba #Bienestar`,
  },
];

// 1. Copiar voice.mp3 y assets a public/<slug> para los 3 episodios antes de empaquetar
for (const ep of EPISODES) {
  const reelDir = path.join(FV, "reels", ep.slug);
  const pubDir = path.join(FV, "public", ep.slug);
  fs.mkdirSync(pubDir, { recursive: true });
  fs.copyFileSync(path.join(reelDir, "voice.mp3"), path.join(pubDir, "voice.mp3"));
  for (const f of fs.readdirSync(path.join(reelDir, "assets"))) {
    fs.copyFileSync(path.join(reelDir, "assets", f), path.join(pubDir, f));
  }
}

console.log("\n=== EMPAQUETANDO BUNDLE REMOTION COMPARTIDO ===");
const serveUrl = await bundle({
  entryPoint: path.join(FV, "src/index.ts"),
  publicDir: path.join(FV, "public"),
});
console.log("✓ Bundle listo:", serveUrl);

for (const ep of EPISODES) {
  const reelDir = path.join(FV, "reels", ep.slug);
  const outDir = path.join(KF, "workspace/output", ep.outFolder);
  const finalMp4 = path.join(outDir, `${ep.slug}.mp4`);
  if (fs.existsSync(finalMp4) && fs.existsSync(path.join(outDir, "cover.jpg")) && fs.existsSync(path.join(outDir, "caption.txt"))) {
    console.log(`\n✓ [${ep.slug}] Ya está renderizado y empaquetado en ${outDir}, saltando...`);
    continue;
  }
  fs.mkdirSync(outDir, { recursive: true });
  const stillsDir = path.join(reelDir, "stills");
  fs.mkdirSync(stillsDir, { recursive: true });

  const data = JSON.parse(fs.readFileSync(path.join(reelDir, "words.json"), "utf8"));
  const config = JSON.parse(fs.readFileSync(path.join(reelDir, "reel.json"), "utf8"));
  const inputProps = {
    slug: ep.slug,
    data,
    config,
    audio: `${ep.slug}/voice.mp3`,
    guides: false,
    noCaption: false,
  };

  console.log(`\n=== [${ep.slug}] SELECCIONANDO COMPOSICIÓN (${data.duration}s @ 60fps) ===`);
  const composition = await selectComposition({
    serveUrl,
    id: "FullVisual",
    inputProps,
    browserExecutable: CHROME,
  });

  // Renderizar 6 stills clave + 1 still con guides
  console.log(`[${ep.slug}] Renderizando stills de verificación...`);
  for (const s of ep.stillsSec) {
    const outStill = path.join(stillsDir, `t_${s.toFixed(2).padStart(6, "0")}.png`);
    await renderStill({
      serveUrl,
      composition,
      inputProps,
      browserExecutable: CHROME,
      frame: Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps)),
      output: outStill,
    });
  }
  const guidesProps = { ...inputProps, guides: true };
  await renderStill({
    serveUrl,
    composition,
    inputProps: guidesProps,
    browserExecutable: CHROME,
    frame: Math.round(ep.stillsSec[1] * composition.fps),
    output: path.join(stillsDir, `t_${ep.stillsSec[1].toFixed(2).padStart(6, "0")}_guides.png`),
  });

  // Renderizar MP4 1080x1920 @ 60fps
  const reelMp4 = path.join(reelDir, `${ep.slug}-es.mp4`);
  console.log(`[${ep.slug}] Renderizando video 1080x1920 @ 60fps -> ${reelMp4}`);
  await renderMedia({
    serveUrl,
    composition,
    inputProps,
    browserExecutable: CHROME,
    outputLocation: reelMp4,
    codec: "h264",
    imageFormat: "jpeg",
    jpegQuality: 92,
    crf: 17,
    pixelFormat: "yuv420p",
    x264Preset: "fast",
    onProgress: ({ progress }) => {
      if (Math.round(progress * 100) % 20 === 0) {
        process.stdout.write(`\r  [${ep.slug}] ${Math.round(progress * 100)}%`);
      }
    },
  });
  console.log(`\n✓ [${ep.slug}] Renderizado base completado.`);

  // Verificar check.py render
  execFileSync(PY, [path.join(FV, "scripts/check.py"), "render", ep.slug, reelMp4], { stdio: "inherit" });

  // Copiar a carpeta final y masterizar voz (-14 LUFS) + ~50 efectos Foley de estudio
  fs.copyFileSync(reelMp4, finalMp4);
  execFileSync(PY, [path.join(KF, "docs-sesion/scripts/mix_viral_sfx_new3.py"), ep.slug, finalMp4], {
    stdio: "inherit",
  });

  // Generar portada clickbait con puente/portada-mp4.mjs y copiar cover.jpg
  execFileSync(
    NODE,
    [
      path.join(ESTUDIO, "puente/portada-mp4.mjs"),
      "--video",
      finalMp4,
      "--titulo",
      ep.coverTitle,
      "--etiqueta",
      ep.coverBadge,
      "--estilo",
      "impacto",
      "--acento",
      ep.coverAccent,
    ],
    { stdio: "inherit" },
  );
  fs.copyFileSync(path.join(outDir, "portadas/portada-1.jpg"), path.join(outDir, "cover.jpg"));

  // Guardar caption.txt SEO multi-red
  fs.writeFileSync(path.join(outDir, "caption.txt"), ep.seoCaption.trim() + "\n", "utf8");
  console.log(`✓ [${ep.slug}] Paquete completo listo en: ${outDir}`);
}

console.log("\n=== LOS 3 NUEVOS EPISODIOS COMBINADOS ESTÁN 100% TERMINADOS ===");

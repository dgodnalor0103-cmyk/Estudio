// Regenera automáticamente en Windows o Mac las carpetas de fotogramas 30fps (1080x1920)
// a partir de los videos originales en analisis/*/original_1080.mp4 para re-renderizar sin subir 1.6 GB de PNGs crudos.
import { mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ffmpeg } from "../ATOM/motor/lib/comun.mjs";

const RAIZ_PRUEBAS = dirname(fileURLToPath(import.meta.url));

const TAREAS = [
  { orig: join(RAIZ_PRUEBAS, "analisis", "DeW3kuNM2v5", "original_1080.mp4"), dest: join(RAIZ_PRUEBAS, "analisis", "DeW3kuNM2v5", "frames_30fps"), fps: "30" },
  { orig: join(RAIZ_PRUEBAS, "analisis", "DeZ-ddqMWFE", "original_1080.mp4"), dest: join(RAIZ_PRUEBAS, "analisis", "DeZ-ddqMWFE", "frames_30fps"), fps: "30" },
  { orig: join(RAIZ_PRUEBAS, "analisis", "DecOLvTsuFH", "original_1080.mp4"), dest: join(RAIZ_PRUEBAS, "analisis", "DecOLvTsuFH", "frames_30fps"), fps: "30" },
  { orig: join(RAIZ_PRUEBAS, "analisis", "DfHpex7MbM2", "original_1080.mp4"), dest: join(RAIZ_PRUEBAS, "reel-coop-es", "assets", "frames_all"), fps: "30" },
];

for (const t of TAREAS) {
  if (!existsSync(t.orig)) continue;
  mkdirSync(t.dest, { recursive: true });
  console.log(`Extrayendo fotogramas (${t.fps} fps) de ${t.orig} -> ${t.dest}...`);
  ffmpeg(["-i", t.orig, "-r", t.fps, join(t.dest, "f_%04d.png")]);
}
console.log("✓ Todos los fotogramas 30fps han sido regenerados.");

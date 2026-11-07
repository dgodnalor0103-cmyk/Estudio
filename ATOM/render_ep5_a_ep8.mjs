import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ATOM_DIR = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM";
const NODE = "/usr/local/bin/node";
const env = {
  ...process.env,
  PATH: `/usr/local/bin:/opt/homebrew/bin:${process.env.PATH || "/usr/bin:/bin"}`,
};

const EPISODES = [
  {
    slug: "2026-11-04-ep5-modo-avion-rastreo",
    titulo: "EL MODO AVIÓN|NO APAGA EL GPS",
    etiqueta: "MITOS DE TU CELULAR · EP. 5",
  },
  {
    slug: "2026-11-04-ep6-ram-virtual-lento",
    titulo: "LA TRAMPA DE|LA RAM VIRTUAL",
    etiqueta: "MITOS DE TU CELULAR · EP. 6",
  },
  {
    slug: "2026-11-04-ep7-protector-camara-fotos",
    titulo: "NO PEGUES VIDRIOS|EN TU CÁMARA",
    etiqueta: "MITOS DE TU CELULAR · EP. 7",
  },
  {
    slug: "2026-11-04-ep8-usb-publico-datos",
    titulo: "PELIGRO EN LOS|USB PÚBLICOS",
    etiqueta: "MITOS DE TU CELULAR · EP. 8",
  },
];

for (const ep of EPISODES) {
  console.log(`\n==================== RENDERIZANDO ${ep.slug} ====================`);
  execFileSync(NODE, ["motor/sonido.mjs", ep.slug], { cwd: ATOM_DIR, env, stdio: "inherit" });
  execFileSync(NODE, ["motor/render.mjs", ep.slug], { cwd: ATOM_DIR, env, stdio: "inherit" });
  execFileSync(
    NODE,
    ["motor/portada.mjs", ep.slug, "--titulo", ep.titulo, "--etiqueta", ep.etiqueta],
    { cwd: ATOM_DIR, env, stdio: "inherit" }
  );

  const outDir = path.join(ATOM_DIR, "salida", ep.slug);
  const p1 = path.join(outDir, "portadas", "portada-1.jpg");
  if (fs.existsSync(p1)) {
    fs.copyFileSync(p1, path.join(outDir, "cover.jpg"));
    fs.copyFileSync(p1, path.join(outDir, "flyer.jpg"));
  }
}

console.log("\n✅ Los 4 nuevos episodios ATOM (EP. 5 a EP. 8) fueron renderizados a 60fps con portadas.");

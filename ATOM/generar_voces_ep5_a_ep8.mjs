import { execFileSync } from "node:child_process";

const ATOM = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM";
const env = { ...process.env, PATH: `/usr/local/bin:${process.env.PATH || "/usr/bin:/bin"}` };

const slugs = [
  "2026-11-04-ep5-modo-avion-rastreo",
  "2026-11-04-ep6-ram-virtual-lento",
  "2026-11-04-ep7-protector-camara-fotos",
  "2026-11-04-ep8-usb-publico-datos",
];

for (const s of slugs) {
  console.log(`\n=== GENERANDO VOZ ELEVENLABS v4 PARA ${s} ===`);
  execFileSync("/usr/local/bin/node", ["motor/voz.mjs", s], { cwd: ATOM, env, stdio: "inherit" });
}

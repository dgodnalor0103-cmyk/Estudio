import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const KF_ROOT = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba";
const ENV_PATH = path.join(KF_ROOT, ".env.local");
const PUBLISH_SCRIPT = path.join(KF_ROOT, "workspace/library/auto-publish/publish_reel.mjs");

function loadEnv() {
  const env = {};
  if (fs.existsSync(ENV_PATH)) {
    for (const line of fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

const env = loadEnv();
let pageToken = env.META_PAGE_ACCESS_TOKEN;
let pageId = env.META_PAGE_ID;

if (!pageToken) {
  console.error("Falta META_PAGE_ACCESS_TOKEN en .env.local.");
  process.exit(1);
}

// Auto-descubrimiento y canje obligatorio de User Access Token -> Page Access Token
{
  const accRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${encodeURIComponent(pageToken)}`
  );
  const accJson = await accRes.json();
  const pages = accJson?.data || [];
  const targetPage = pages.find((p) => p.id === pageId || /puraprueba/i.test(p.name || "")) || pages[0];
  if (targetPage?.id) {
    pageId = targetPage.id;
    if (targetPage.access_token) pageToken = targetPage.access_token;
    const igId = targetPage?.instagram_business_account?.id || env.META_IG_USER_ID || "";
    const lines = fs
      .readFileSync(ENV_PATH, "utf8")
      .split(/\r?\n/)
      .filter(
        (l) =>
          l &&
          !l.startsWith("META_PAGE_ID=") &&
          !l.startsWith("META_IG_USER_ID=") &&
          !l.startsWith("META_PAGE_ACCESS_TOKEN=")
      );
    lines.push(`META_PAGE_ID=${pageId}`);
    if (igId) lines.push(`META_IG_USER_ID=${igId}`);
    lines.push(`META_PAGE_ACCESS_TOKEN=${pageToken}`);
    fs.writeFileSync(ENV_PATH, lines.join("\n") + "\n", { mode: 0o600 });
    console.log(`✓ [Meta Page Token Activo]: Página="${targetPage.name}" (${pageId})${igId ? ` · IG=${igId}` : ""}`);
  } else if (!pageId) {
    const meRes = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${encodeURIComponent(pageToken)}`);
    const meJson = await meRes.json();
    if (meJson?.id) pageId = meJson.id;
  }
}

console.log(`Consultando Reels ya publicados en la Página de Facebook (${pageId})...`);
const existingTexts = [
  "dejar cargando tu celular toda la noche no",
  "cerrar todas las apps de tu celular no aho",
  "abrir el modo incógnito en tu celular no o",
  "meter tu celular mojado en arroz no salva ",
  "apagar el wifi en la barra rápida no apaga",
];
for (const endpoint of ["video_reels", "videos"]) {
  try {
    const r = await fetch(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}/${endpoint}?fields=id,description,created_time&limit=100&access_token=${encodeURIComponent(pageToken)}`
    );
    const j = await r.json();
    for (const item of j?.data || []) {
      if (item.description) existingTexts.push(String(item.description).toLowerCase());
    }
  } catch {}
}

console.log(`Videos detectados actualmente en Facebook: ${existingTexts.length}`);

// Los 9 episodios de tecnología publicados hasta ayer en IG/TikTok/YT:
const PUBLISHED_UP_TO_YESTERDAY = [
  "workspace/output/2026-10-31-full-visual-ep1-battery-atom",
  "workspace/output/2026-10-31-full-visual-ep2-closing-apps-atom",
  "workspace/output/2026-10-31-full-visual-ep3-incognito-atom",
  "workspace/output/2026-10-31-full-visual-ep4-rice-phone-atom",
  "../ATOM/salida/2026-10-31-ep1-wifi-barra-rapida",
  "../ATOM/salida/2026-10-31-ep2-cable-barato",
  "../ATOM/salida/2026-10-31-ep3-fotos-borradas",
  "../ATOM/salida/2026-10-31-ep4-camara-200mp",
  "../ATOM/salida/2026-11-04-ep5-modo-avion-rastreo",
];

for (const folder of PUBLISHED_UP_TO_YESTERDAY) {
  const absDir = path.resolve(KF_ROOT, folder);
  const capFile = path.join(absDir, "caption.txt");
  const firstLine = fs.existsSync(capFile)
    ? fs.readFileSync(capFile, "utf8").split(/\r?\n/)[0].trim().slice(0, 42).toLowerCase()
    : "";

  if (firstLine && existingTexts.some((t) => t.includes(firstLine))) {
    console.log(`✓ [Ya existe en Facebook]: ${folder} -> se omite para no duplicar.`);
    continue;
  }

  console.log(`\nSubiendo a Facebook Reels: ${folder}...`);
  execFileSync(
    process.execPath,
    [PUBLISH_SCRIPT, folder, "--provider", "meta-direct", "--platforms", "facebook"],
    { cwd: KF_ROOT, stdio: "inherit" }
  );
}

// Y dejar programados en Facebook Reels los 3 episodios de HOY (2026-11-05 19:00, 19:10, 19:20 -05:00)
const TODAY_SLOTS = [
  { folder: "../ATOM/salida/2026-11-04-ep6-ram-virtual-lento", iso: "2026-11-05T19:00:00-05:00" },
  { folder: "../ATOM/salida/2026-11-04-ep7-protector-camara-fotos", iso: "2026-11-05T19:10:00-05:00" },
  { folder: "../ATOM/salida/2026-11-04-ep8-usb-publico-datos", iso: "2026-11-05T19:20:00-05:00" },
];

for (const s of TODAY_SLOTS) {
  console.log(`\nProgramando en Facebook Reels para hoy (${s.iso}): ${s.folder}...`);
  execFileSync(
    process.execPath,
    [PUBLISH_SCRIPT, s.folder, "--provider", "meta-direct", "--platforms", "facebook", "--schedule", s.iso],
    { cwd: KF_ROOT, stdio: "inherit" }
  );
}

console.log("\n✅ Facebook Reels actualizado con todos los episodios faltantes y los 3 programados de hoy.");

#!/usr/bin/env node
/**
 * Programador de 3 videos diarios a las 4 redes sociales (Facebook, Instagram, TikTok y YouTube Shorts).
 *
 * Uso:
 *   node workspace/library/auto-publish/schedule_3_daily.mjs [--dry-run] [--day 1|2|3] [--start-date 2026-11-03] [--hour 19:00] [--interval-min 10] [--tz -05:00]
 */
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KF_ROOT = path.resolve(__dirname, "../../..");
const publishScript = path.join(__dirname, "publish_reel.mjs");

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const opt = (flag, def) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : def);

const hour = opt("--hour", "19:00");
const intervalMin = Number(opt("--interval-min", "10"));
const tz = opt("--tz", "-05:00");
const providerOpt = opt("--provider", "");
const platformsOpt = opt("--platforms", "facebook,instagram,tiktok,youtube");
const onlyToday = opt("--only-today", "") === "true";
const onlyDay = Number(opt("--day", "0"));

function todayYmd() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

const startDateStr = opt("--start-date", todayYmd());

// Nota:
// - Los 3 videos de prueba en Modo Claro (cafe-despertar, alarma-cinco-minutos, platos-mano-agua)
//   están excluidos por instrucción del creador.
// - Los videos ya publicados en Buffer (status === "sent": ep1-battery, ep2-closing-apps, ep3-incognito,
//   ep4-rice-phone, ep1-wifi-barra-rapida, ep2-cable-barato) también se excluyen de la cola para evitar duplicados.
const QUEUE = [
  // Tanda 1 (2026-11-04 7:00 PM): 3 episodios inéditos de MITOS DE TU CELULAR (Estilo ATOM 60fps)
  "../ATOM/salida/2026-10-31-ep3-fotos-borradas",
  "../ATOM/salida/2026-10-31-ep4-camara-200mp",
  "../ATOM/salida/2026-11-04-ep5-modo-avion-rastreo",
  // Tanda 2 (2026-11-05 7:00 PM): 3 nuevos episodios de MITOS DE TU CELULAR (Estilo ATOM 60fps + ElevenLabs v4)
  "../ATOM/salida/2026-11-04-ep6-ram-virtual-lento",
  "../ATOM/salida/2026-11-04-ep7-protector-camara-fotos",
  "../ATOM/salida/2026-11-04-ep8-usb-publico-datos",
];

function addDays(ymd, days) {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  const pad = (n) => String(n).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

function addMinutesToHour(hhmm, addMin) {
  const [hh, mm] = hhmm.split(":").map(Number);
  const total = hh * 60 + (mm || 0) + addMin;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(nh)}:${pad(nm)}`;
}

for (let i = 0; i < QUEUE.length; i++) {
  const dayOffset = Math.floor(i / 3);
  const dayNum = dayOffset + 1;
  if (onlyToday && dayNum !== 1) continue;
  if (onlyDay > 0 && dayNum !== onlyDay) continue;

  const slotInDay = i % 3;
  const datePart = addDays(startDateStr, dayOffset);
  const slotHour = addMinutesToHour(hour, slotInDay * intervalMin);
  const isoSchedule = `${datePart}T${slotHour}:00${tz}`;
  console.log(`\n========================================================`);
  console.log(`DÍA ${dayNum} · VIDEO ${slotInDay + 1}/3 -> Programado para: ${isoSchedule}`);
  console.log(`Carpeta: ${QUEUE[i]}`);
  console.log(`========================================================`);
  const cmdArgs = [publishScript, QUEUE[i], "--schedule", isoSchedule, "--platforms", platformsOpt];
  if (providerOpt) cmdArgs.push("--provider", providerOpt);
  if (dryRun) cmdArgs.push("--dry-run");
  execFileSync(process.execPath, cmdArgs, { cwd: KF_ROOT, stdio: "inherit" });
}

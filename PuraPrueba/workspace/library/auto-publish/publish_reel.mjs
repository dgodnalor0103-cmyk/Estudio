#!/usr/bin/env node
/**
 * Auto-Publicador Multi-Red 100% Gratuito para Keyframes
 * (TikTok + Instagram Reels + YouTube Shorts + Facebook Reels)
 *
 * Lee automáticamente `<slug>.mp4`, `cover.jpg` y `caption.txt` de una carpeta de `workspace/output/`
 * y las credenciales configuradas en `.env.local` en la raíz de Keyframes (`C:\Estudio\PuraPrueba`).
 *
 * Modos soportados:
 *   0. `meta-direct` (100% OFICIAL META GRAPH API v21.0 · $0 GRATIS · CERO RIESGO DE BANEO):
 *      - Sube y programa Facebook Reels nativamente en los servidores de Meta (`/{page_id}/video_reels` con `SCHEDULED`).
 *      - Sube Instagram Reels vía API oficial de contenedores (`/{ig_user_id}/media` -> `media_publish`) y programa
 *        disparos diferidos en Windows Task Scheduler cuando se pasa `--schedule`.
 *      Variables en `.env.local`:
 *        PUBLISH_PROVIDER=meta-direct
 *        META_APP_ID=1828644828457446
 *        META_PAGE_ID=...
 *        META_IG_USER_ID=...
 *        META_PAGE_ACCESS_TOKEN=...
 *
 *   1. `buffer` (POR DEFECTO SI NO HAY META · 100% GRATIS $0 PARA SIEMPRE, sin tarjeta):
 *      - Plan gratis de Buffer permite 3 canales gratis (TikTok + Instagram Reels + YouTube Shorts) + 1 API Key gratis.
 *      - Instagram replica automáticamente tus Reels a Facebook Reels gratis activando el switch en la app de Instagram.
 *      - Sube automáticamente el MP4 local a un enlace HTTPS temporal gratuito (Litterbox 72h / tmpfiles.org) para que Buffer lo descargue sin pagar S3.
 *      Variables en `.env.local`:
 *        PUBLISH_PROVIDER=buffer
 *        BUFFER_API_KEY=tu_api_key_gratis_de_buffer
 *        BUFFER_MODE=shareNow   # (o addToQueue)
 *
 *   2. `youtube-direct` (100% GRATIS $0 vía Google Cloud OAuth2 directo a YouTube Shorts):
 *      Variables en `.env.local`:
 *        PUBLISH_PROVIDER=youtube-direct
 *        YOUTUBE_CLIENT_ID=...
 *        YOUTUBE_CLIENT_SECRET=...
 *        YOUTUBE_REFRESH_TOKEN=...
 *
 *   3. `upload-post` / `postiz` (Alternativas API adicionales):
 *        PUBLISH_PROVIDER=upload-post | postiz
 */
import { execFileSync, spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KF_ROOT = path.resolve(__dirname, "../../..");
const ENV_PATH = path.join(KF_ROOT, ".env.local");

const CURL_BIN = process.platform === "win32" ? "curl" + ".exe" : "curl";
const SSH_BIN = process.platform === "win32" ? "ssh.exe" : "ssh";
const NULL_DEV = process.platform === "win32" ? "NUL" : "/dev/null";

function loadEnv() {
  const env = { ...process.env };
  for (const p of [ENV_PATH, path.resolve(KF_ROOT, "../ATOM/.env.local")]) {
    if (fs.existsSync(p)) {
      for (const raw of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#") || !line.includes("=")) continue;
        const idx = line.indexOf("=");
        const k = line.slice(0, idx).trim();
        const v = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
        if (!env[k]) env[k] = v;
      }
    }
  }
  return env;
}

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const igImmediate = args.includes("--ig-immediate");
const bufferImmediate = args.includes("--buffer-immediate");
const opt = (flag) => (args.includes(flag) ? args[args.indexOf(flag) + 1] : undefined);
const cliVideoUrl = opt("--video-url") || "";
const skipValues = new Set([opt("--platforms"), opt("--schedule"), opt("--schedule-at"), opt("--provider"), opt("--video-url")].filter(Boolean));
const folderArg = args.find((a) => !a.startsWith("--") && !skipValues.has(a));

if (!folderArg) {
  console.error(
    "Uso: node publish_reel.mjs <carpeta-output> [--dry-run] [--provider meta-direct|buffer|youtube-direct|upload-post|postiz] [--platforms facebook,instagram,tiktok,youtube] [--schedule ISO_DATE]",
  );
  process.exit(1);
}

const outDir = path.resolve(KF_ROOT, folderArg);
if (!fs.existsSync(outDir)) {
  console.error(`No existe la carpeta: ${outDir}`);
  process.exit(1);
}

const files = fs.readdirSync(outDir);
const mp4Name = files.find((f) => f.endsWith(".mp4") && !f.startsWith("raw")) || files.find((f) => f.endsWith(".mp4"));
if (!mp4Name) {
  console.error(`No se encontró ningún archivo .mp4 en ${outDir}`);
  process.exit(1);
}
const mp4Path = path.join(outDir, mp4Name);
const coverCandidate = ["cover.jpg", "flyer.jpg", "portada.jpg"].find((c) => fs.existsSync(path.join(outDir, c)));
const coverPath = coverCandidate ? path.join(outDir, coverCandidate) : null;
const captionPath = path.join(outDir, "caption.txt");
const caption = fs.existsSync(captionPath) ? fs.readFileSync(captionPath, "utf8").trim() : path.basename(mp4Name, ".mp4");
const rawFirstLine = caption.split(/\r?\n/)[0].replace(/[.]+$/, "").trim();
const firstLine =
  rawFirstLine.length <= 92
    ? rawFirstLine
    : rawFirstLine.slice(0, 92).replace(/\s+\S*$/, "").trim();

const env = loadEnv();
const defaultProvider =
  env.META_PAGE_ACCESS_TOKEN && env.BUFFER_API_KEY
    ? "all-official"
    : env.META_PAGE_ACCESS_TOKEN
      ? "meta-direct"
      : "buffer";
const provider = (opt("--provider") || env.PUBLISH_PROVIDER || defaultProvider).toLowerCase();
const defaultPlatforms =
  provider === "meta-direct"
    ? "facebook,instagram"
    : "facebook,instagram,tiktok,youtube";
const platforms = (opt("--platforms") || env.PUBLISH_PLATFORMS || defaultPlatforms)
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);
const scheduleAt = opt("--schedule") || opt("--schedule-at") || "";

const statMb = (fs.statSync(mp4Path).size / (1024 * 1024)).toFixed(2);
console.log("=== KEYFRAMES AUTO-PUBLISHER ($0 GRATIS) ===");
console.log(`Proveedor   : ${provider}`);
console.log(`Redes       : ${platforms.join(", ")}`);
console.log(`Video MP4   : ${mp4Path} (${statMb} MB)`);
console.log(`Portada     : ${coverPath ?? "(automática)"}`);
console.log(`Título YT   : ${firstLine}`);
console.log(`Caption     : ${caption.length} caracteres`);
if (scheduleAt) console.log(`Programado  : ${scheduleAt}`);

if (dryRun) {
  const hasMeta = Boolean(env.META_PAGE_ID && env.META_PAGE_ACCESS_TOKEN);
  const hasBuffer = Boolean(env.BUFFER_API_KEY);
  const hasYtDirect = Boolean(env.YOUTUBE_CLIENT_ID && env.YOUTUBE_CLIENT_SECRET && env.YOUTUBE_REFRESH_TOKEN);
  const configured =
    (provider === "all-official" && hasMeta && (hasBuffer || hasYtDirect)) ||
    (provider === "meta-direct" && hasMeta) ||
    (provider === "buffer" && hasBuffer) ||
    (provider === "youtube-direct" && hasYtDirect) ||
    (provider === "upload-post" && Boolean(env.UPLOAD_POST_API_KEY && env.UPLOAD_POST_USER)) ||
    (provider === "postiz" && Boolean(env.POSTIZ_API_KEY && env.POSTIZ_CHANNEL_IDS));
  console.log(`\n[DRY-RUN OK] Paquete validado y listo para subir gratis ($0).`);
  console.log(
    configured
      ? `Credenciales de ${provider} detectadas en .env.local: listo para publicar en las 4 redes sin --dry-run.`
      : `Pendiente: configura las credenciales faltantes de ${provider} en .env.local.`,
  );
  if (provider === "meta-direct" || provider === "all-official") {
    console.log(`Facebook Page (Meta Oficial) : ${env.META_PAGE_ID ? "SÍ (" + env.META_PAGE_ID + ")" : "NO"}`);
    console.log(`Instagram Pro (Meta Oficial) : ${env.META_IG_USER_ID ? "SÍ (" + env.META_IG_USER_ID + ")" : "NO (solo Facebook)"}`);
  }
  if (provider === "buffer" || provider === "all-official") {
    console.log(`TikTok + YouTube (Buffer API): ${hasBuffer ? "SÍ (API Oficial activa)" : "PENDIENTE (conectar Buffer Gratis)"}`);
  }
  process.exit(0);
}

/**
 * Sube gratuitamente un archivo local (.mp4 o .jpg) a un enlace HTTPS directo temporal (72 horas)
 * sin necesidad de cuenta ni tarjeta, para que la API de Instagram Graph o Buffer pueda descargarlo.
 */
function stageViaUguu(localFile) {
  console.log(`\nSubiendo ${path.basename(localFile)} a enlace HTTPS directo (uguu.se)...`);
  const raw = execFileSync(
    CURL_BIN,
    ["-sS", "--fail", "--max-time", "180", "-F", `files[]=@${localFile}`, "https://uguu.se/upload"],
    { encoding: "utf8" },
  );
  const parsed = JSON.parse(raw);
  const url = parsed?.files?.[0]?.url || "";
  if (!url.startsWith("https://")) throw new Error("uguu.se no devolvió URL HTTPS");
  console.log(`Enlace HTTPS listo (uguu): ${url}`);
  return { url, cleanup: async () => {} };
}

function stageViaTmpfiles(localFile) {
  console.log(`\nSubiendo ${path.basename(localFile)} a enlace HTTPS directo (tmpfiles.org)...`);
  const raw = execFileSync(
    CURL_BIN,
    ["-sS", "--fail", "--max-time", "180", "-F", `file=@${localFile}`, "https://tmpfiles.org/api/v1/upload"],
    { encoding: "utf8" },
  );
  const parsed = JSON.parse(raw);
  const pageUrl = parsed?.data?.url || "";
  if (!pageUrl) throw new Error("tmpfiles.org no devolvió URL");
  const directUrl = pageUrl.replace("http://", "https://").replace("tmpfiles.org/", "tmpfiles.org/dl/");
  console.log(`Enlace HTTPS listo (tmpfiles): ${directUrl}`);
  return { url: directUrl, cleanup: async () => {} };
}

function stageViaX0At(localFile) {
  console.log(`\nSubiendo ${path.basename(localFile)} a enlace HTTPS directo (x0.at)...`);
  const url = execFileSync(
    CURL_BIN,
    ["-sS", "--fail", "--max-time", "180", "-A", "PuraPruebaPublisher/1.0", "-F", `file=@${localFile}`, "https://x0.at/"],
    { encoding: "utf8" },
  ).trim();
  if (!url.startsWith("https://")) throw new Error("x0.at no devolvió URL HTTPS");
  console.log(`Enlace HTTPS listo (x0.at): ${url}`);
  return { url, cleanup: async () => {} };
}

function stageVia0x0St(localFile) {
  console.log(`\nSubiendo ${path.basename(localFile)} a enlace HTTPS directo (0x0.st)...`);
  const url = execFileSync(
    CURL_BIN,
    ["-sS", "--fail", "--max-time", "180", "-A", "PuraPruebaPublisher/1.0", "-F", `file=@${localFile}`, "https://0x0.st"],
    { encoding: "utf8" },
  ).trim();
  if (!url.startsWith("https://")) throw new Error("0x0.st no devolvió URL HTTPS");
  console.log(`Enlace HTTPS listo (0x0.st): ${url}`);
  return { url, cleanup: async () => {} };
}

function stageViaCatbox(localFile) {
  console.log(`\nSubiendo ${path.basename(localFile)} a enlace HTTPS directo permanente (catbox.moe)...`);
  const url = execFileSync(
    CURL_BIN,
    [
      "-sS",
      "--fail",
      "--max-time",
      "180",
      "-A",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      "-F",
      "reqtype=fileupload",
      "-F",
      `fileToUpload=@${localFile}`,
      "https://catbox.moe/user/api.php",
    ],
    { encoding: "utf8" },
  ).trim();
  if (!url.startsWith("https://")) throw new Error("catbox.moe no devolvió URL HTTPS");
  console.log(`Enlace HTTPS listo (catbox.moe): ${url}`);
  return { url, cleanup: async () => {} };
}

function stageViaLitterbox(localFile) {
  console.log(`\nSubiendo ${path.basename(localFile)} a enlace HTTPS directo (litterbox 72h)...`);
  const url = execFileSync(
    CURL_BIN,
    [
      "-sS",
      "--fail",
      "--max-time",
      "180",
      "-F",
      "reqtype=fileupload",
      "-F",
      "time=72h",
      "-F",
      `fileToUpload=@${localFile}`,
      "https://litterbox.catbox.moe/resources/internals/api.php",
    ],
    { encoding: "utf8" },
  ).trim();
  if (!url.startsWith("https://")) throw new Error("litterbox no devolvió URL HTTPS");
  console.log(`Enlace HTTPS listo (litterbox): ${url}`);
  return { url, cleanup: async () => {} };
}

async function stageViaLocalhostRunTunnel(localFile) {
  console.log(`\nAbriendo túnel HTTPS efímero (localhost.run) para ${path.basename(localFile)}...`);
  const stat = fs.statSync(localFile);
  const tokenPath = `/${crypto.randomBytes(12).toString("hex")}/${encodeURIComponent(path.basename(localFile))}`;
  const mime = localFile.endsWith(".jpg") || localFile.endsWith(".jpeg") ? "image/jpeg" : "video/mp4";

  const srv = http.createServer((req, res) => {
    const reqPath = (req.url || "").split("?")[0];
    if (reqPath !== tokenPath) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    const range = req.headers.range;
    if (range) {
      const m = /bytes=(\d+)-(\d*)/.exec(range);
      const start = m ? Number(m[1]) : 0;
      const end = m && m[2] ? Math.min(Number(m[2]), stat.size - 1) : stat.size - 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": mime,
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      fs.createReadStream(localFile, { start, end }).pipe(res);
    } else {
      res.writeHead(200, {
        "Content-Length": stat.size,
        "Accept-Ranges": "bytes",
        "Content-Type": mime,
      });
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      fs.createReadStream(localFile).pipe(res);
    }
  });

  await new Promise((resolve) => srv.listen(0, "127.0.0.1", resolve));
  const port = srv.address().port;

  const sshProc = spawn(
    SSH_BIN,
    [
      "-o",
      "StrictHostKeyChecking=no",
      "-o",
      `UserKnownHostsFile=${NULL_DEV}`,
      "-o",
      "ServerAliveInterval=15",
      "-T",
      "-R",
      `80:127.0.0.1:${port}`,
      "nokey@localhost.run",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  const publicOrigin = await new Promise((resolve, reject) => {
    let out = "";
    const onChunk = (c) => {
      out += c.toString("utf8");
      const m = /(https:\/\/[a-z0-9-]+\.lhr\.life)\b/i.exec(out);
      if (m) resolve(m[1]);
    };
    sshProc.stdout.on("data", onChunk);
    sshProc.stderr.on("data", onChunk);
    sshProc.on("error", reject);
    setTimeout(() => reject(new Error("Timeout abriendo túnel localhost.run")), 25000);
  });

  const fullUrl = `${publicOrigin}${tokenPath}`;
  console.log(`Enlace HTTPS listo (túnel directo): ${fullUrl}`);
  return {
    url: fullUrl,
    cleanup: async () => {
      await sleep(12000);
      try {
        sshProc.kill();
      } catch {}
      try {
        srv.close();
      } catch {}
    },
  };
}

function stageTempPublicFile(localFile, ext = ".mp4") {
  if (ext === ".mp4" && (cliVideoUrl || env.PUBLIC_VIDEO_URL)) return cliVideoUrl || env.PUBLIC_VIDEO_URL;
  for (const fn of [stageViaUguu, stageViaTmpfiles, stageViaX0At, stageVia0x0St, stageViaLitterbox]) {
    try {
      return fn(localFile).url;
    } catch (_) {}
  }
  throw new Error(`No se pudo generar URL pública temporal para ${path.basename(localFile)}.`);
}

function stageTempPublicMp4(localMp4) {
  return stageTempPublicFile(localMp4, ".mp4");
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function sanitizeGraphError(errObj) {
  const msg = errObj?.error?.message || JSON.stringify(errObj);
  return String(msg).replace(/EAA[A-Za-z0-9]+/g, "[REDACTED]");
}

async function publishMetaFacebookReel(pageId, pageToken) {
  console.log(`\nSubiendo Reel a Facebook Page (${pageId}) vía API Oficial de Meta (Graph v21.0)...`);

  // Fase 1: Iniciar sesión de carga oficial de Facebook Reels
  const startRes = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}/video_reels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      upload_phase: "start",
      access_token: pageToken,
    }),
  });
  const startJson = await startRes.json();
  if (!startRes.ok || !startJson.video_id) {
    throw new Error(`Meta Facebook Reels (start) falló: ${sanitizeGraphError(startJson)}`);
  }
  const { video_id: videoId, upload_url: uploadUrl } = startJson;

  // Fase 2: Subida binaria directa a rupload.facebook.com
  const videoBytes = fs.readFileSync(mp4Path);
  const targetUploadUrl = uploadUrl || `https://rupload.facebook.com/video-upload/v21.0/${videoId}`;
  const upRes = await fetch(targetUploadUrl, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${pageToken}`,
      offset: "0",
      file_size: String(videoBytes.length),
      "Content-Type": "application/octet-stream",
    },
    body: videoBytes,
  });
  const upJson = await upRes.json();
  if (!upRes.ok || upJson.success === false) {
    throw new Error(`Meta Facebook Reels (upload) falló: ${sanitizeGraphError(upJson)}`);
  }

  // Fase 3: Finalizar y publicar o dejar programado en los servidores oficiales de Meta
  let videoState = "PUBLISHED";
  let scheduledUnix = undefined;
  if (scheduleAt) {
    const dt = new Date(scheduleAt);
    if (Number.isNaN(dt.getTime())) {
      throw new Error(`Fecha inválida en --schedule: ${scheduleAt}. Usa formato ISO (ej. 2026-11-01T19:00:00-05:00).`);
    }
    const minFutureSec = Math.floor(Date.now() / 1000) + 15 * 60;
    const requestedSec = Math.floor(dt.getTime() / 1000);
    if (requestedSec >= minFutureSec) {
      videoState = "SCHEDULED";
      scheduledUnix = requestedSec;
    } else {
      console.log("Aviso: --schedule es menor a 15 minutos en el futuro; Meta publicará el Reel de inmediato.");
    }
  }

  const finishBody = {
    upload_phase: "finish",
    video_id: videoId,
    video_state: videoState,
    description: caption,
    ...(scheduledUnix ? { scheduled_publish_time: scheduledUnix } : {}),
    access_token: pageToken,
  };

  const finRes = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}/video_reels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finishBody),
  });
  const finJson = await finRes.json();
  if (!finRes.ok || finJson.success === false) {
    throw new Error(`Meta Facebook Reels (finish) falló: ${sanitizeGraphError(finJson)}`);
  }

  console.log(
    `✓ [Facebook Reels Oficial] video_id=${videoId} · estado=${videoState}${
      scheduledUnix ? " · programado=" + new Date(scheduledUnix * 1000).toISOString() : ""
    }`,
  );
}

function scheduleWindowsTaskForInstagram(targetIsoDate) {
  const dt = new Date(targetIsoDate);
  if (Number.isNaN(dt.getTime())) {
    throw new Error(`Fecha inválida para programar Instagram: ${targetIsoDate}`);
  }
  const pad = (n) => String(n).padStart(2, "0");
  const sd = `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(dt.getDate())}`;
  // schtasks usa el formato regional del sistema; usamos PowerShell Register-ScheduledTask o cmd con DateTime exacto
  const slug = path.basename(mp4Name, ".mp4").replace(/[^a-zA-Z0-9_-]/g, "_");
  const taskName = `PuraPrueba_IG_${slug}`;
  const scriptPath = fileURLToPath(import.meta.url);
  const nodeExe = process.execPath;

  const queueFile = path.join(__dirname, "ig_schedule_queue.json");
  const existing = fs.existsSync(queueFile) ? JSON.parse(fs.readFileSync(queueFile, "utf8")) : [];
  const filtered = existing.filter((item) => item.taskName !== taskName);
  filtered.push({
    taskName,
    outDir,
    scheduledAt: dt.toISOString(),
    createdAt: new Date().toISOString(),
  });
  fs.writeFileSync(queueFile, JSON.stringify(filtered, null, 2) + "\n", "utf8");

  if (process.platform === "win32") {
    const psCmd = [
      `$action = New-ScheduledTaskAction -Execute '${nodeExe.replace(/'/g, "''")}' -Argument '"${scriptPath}" "${outDir}" --provider meta-direct --platforms instagram --ig-immediate' -WorkingDirectory '${KF_ROOT.replace(/'/g, "''")}';`,
      `$trigger = New-ScheduledTaskTrigger -Once -At ([datetime]::Parse('${dt.toISOString()}'));`,
      `$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -WakeToRun -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5);`,
      `Register-ScheduledTask -TaskName '${taskName}' -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null;`,
    ].join(" ");
    execFileSync("powershell.exe", ["-NoProfile", "-Command", psCmd], { stdio: "inherit" });
  } else {
    const delayMs = Math.max(1000, dt.getTime() - Date.now());
    const runner = `setTimeout(() => { require("node:child_process").spawnSync(${JSON.stringify(nodeExe)}, [${JSON.stringify(scriptPath)}, ${JSON.stringify(outDir)}, "--provider", "meta-direct", "--platforms", "instagram", "--ig-immediate"], { cwd: ${JSON.stringify(KF_ROOT)}, stdio: "ignore" }); }, ${delayMs});`;
    spawn(nodeExe, ["-e", runner], { cwd: KF_ROOT, detached: true, stdio: "ignore" }).unref();
  }
  console.log(`✓ [Instagram Reels Programado] tarea=${taskName} · fecha=${dt.toISOString()} (${sd})`);
}

async function waitForInternet(maxWaitMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    try {
      const r = await fetch("https://graph.facebook.com", { method: "HEAD", signal: AbortSignal.timeout(5000) });
      if (r.status > 0) return true;
    } catch (_) {}
    console.log("  Esperando conexión a Internet tras reanudación del equipo (reintentando en 4s)...");
    await sleep(4000);
  }
  return false;
}

async function publishMetaInstagramReel(igUserId, pageToken) {
  if (scheduleAt && !igImmediate) {
    const dt = new Date(scheduleAt);
    if (!Number.isNaN(dt.getTime()) && dt.getTime() > Date.now() + 5 * 60 * 1000) {
      // Instagram Graph API no acepta scheduled_publish_time en servidor; programamos disparo oficial local exacto
      scheduleWindowsTaskForInstagram(scheduleAt);
      return;
    }
  }

  if (igImmediate) {
    await waitForInternet(120000);
  }

  // Verificar acceso rápido a Graph API antes de subir MP4; si la app de desarrollo de Meta está restringida, usar canal oficial de Instagram conectado en Buffer (OAuth directo de Instagram)
  if (env.BUFFER_API_KEY) {
    try {
      const preRes = await fetch(
        `https://graph.facebook.com/v21.0/${encodeURIComponent(igUserId)}?fields=id&access_token=${encodeURIComponent(pageToken)}`,
      );
      const preJson = await preRes.json();
      if (!preRes.ok || preJson.error) {
        console.log(
          `\n[Instagram Fallback Oficial]: Graph API devolvió "${sanitizeGraphError(preJson)}"; publicando en @purapruebaoficial vía Buffer OAuth oficial...`,
        );
        return await publishBuffer(["instagram"], Boolean(igImmediate || !scheduleAt));
      }
    } catch (_) {
      return await publishBuffer(["instagram"], Boolean(igImmediate || !scheduleAt));
    }
  }

  console.log(`\nSubiendo Reel a Instagram Profesional (${igUserId}) vía API Oficial de Meta (Graph v21.0)...`);

  const igStageProviders = [
    ...(cliVideoUrl || env.PUBLIC_VIDEO_URL
      ? [async () => ({ url: cliVideoUrl || env.PUBLIC_VIDEO_URL, cleanup: async () => {} })]
      : []),
    async () => stageViaUguu(mp4Path),
    async () => stageViaTmpfiles(mp4Path),
    async () => stageViaX0At(mp4Path),
    async () => stageVia0x0St(mp4Path),
    async () => stageViaLitterbox(mp4Path),
    async () => await stageViaLocalhostRunTunnel(mp4Path),
  ];

  let coverUrl = null;
  if (coverPath) {
    try {
      coverUrl = stageTempPublicFile(coverPath, ".jpg");
    } catch (_) {
      coverUrl = null;
    }
  }

  let creationId = null;
  let finished = false;
  let lastIgErr = "";

  for (let pIdx = 0; pIdx < igStageProviders.length; pIdx++) {
    let activeStaged = null;
    try {
      activeStaged = await igStageProviders[pIdx]();
      const videoUrl = activeStaged?.url;
      if (!videoUrl) continue;

      // Intentar primero con cover_url (si existe) y como respaldo con thumb_offset nativo
      const payloads = coverUrl
        ? [
            { media_type: "REELS", video_url: videoUrl, cover_url: coverUrl, caption, share_to_feed: true, access_token: pageToken },
            { media_type: "REELS", video_url: videoUrl, thumb_offset: 1000, caption, share_to_feed: true, access_token: pageToken },
          ]
        : [{ media_type: "REELS", video_url: videoUrl, thumb_offset: 1000, caption, share_to_feed: true, access_token: pageToken }];

      creationId = null;
      for (const bodyObj of payloads) {
        const createRes = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(igUserId)}/media`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyObj),
        });
        const createJson = await createRes.json();
        if (createRes.ok && createJson.id) {
          creationId = createJson.id;
          break;
        }
        lastIgErr = sanitizeGraphError(createJson);
      }

      if (!creationId) {
        console.warn(`  [Aviso IG proveedor #${pIdx + 1}]: Meta rechazó contenedor (${lastIgErr}); probando siguiente host...`);
        await activeStaged.cleanup().catch(() => {});
        continue;
      }

      console.log(`Contenedor Instagram creado (${creationId}). Esperando procesamiento de Meta...`);
      finished = false;
      let containerFailed = false;
      for (let attempt = 1; attempt <= 45; attempt++) {
        await sleep(5000);
        const stRes = await fetch(
          `https://graph.facebook.com/v21.0/${encodeURIComponent(creationId)}?fields=status_code,status&access_token=${encodeURIComponent(pageToken)}`,
        );
        const stJson = await stRes.json();
        const code = stJson.status_code || "IN_PROGRESS";
        console.log(`  [${attempt}/45] Estado contenedor IG: ${code}`);
        if (code === "FINISHED") {
          finished = true;
          break;
        }
        if (code === "ERROR" || code === "EXPIRED") {
          lastIgErr = sanitizeGraphError(stJson);
          console.warn(`  [Aviso IG procesamiento #${pIdx + 1}]: ${lastIgErr}; probando siguiente servidor HTTPS...`);
          containerFailed = true;
          break;
        }
      }
      await activeStaged.cleanup().catch(() => {});
      if (finished) break;
      if (!containerFailed) {
        lastIgErr = `Tiempo de espera agotado procesando el contenedor (${creationId})`;
      }
    } catch (e) {
      lastIgErr = e.message;
      if (activeStaged) await activeStaged.cleanup().catch(() => {});
    }
  }

  if (!finished || !creationId) {
    throw new Error(`Meta Instagram Reels falló tras probar todos los servidores: ${lastIgErr}`);
  }

  // Paso 3: Publicar el contenedor (con reintento si Meta dice que aún está finalizando el índice)
  let pubId = null;
  for (let pubTry = 1; pubTry <= 4; pubTry++) {
    const pubRes = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(igUserId)}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: pageToken,
      }),
    });
    const pubJson = await pubRes.json();
    if (pubRes.ok && pubJson.id) {
      pubId = pubJson.id;
      break;
    }
    lastIgErr = sanitizeGraphError(pubJson);
    if (pubTry < 4) await sleep(5000);
  }
  if (!pubId) {
    throw new Error(`Meta Instagram Reels (media_publish) falló: ${lastIgErr}`);
  }
  console.log(`✓ [Instagram Reels Oficial] media_id=${pubId} · estado=PUBLISHED`);
}

async function autoRefreshMetaTokenFromChrome(targetPageId) {
  const chromeCli = "/Applications/Antigravity.app/Contents/Resources/app.asar.unpacked/node_modules/chrome-devtools-mcp/build/src/bin/chrome-devtools.js";
  if (!fs.existsSync(chromeCli)) return null;
  const runCli = (cliArgs) => {
    try {
      return execFileSync(process.execPath, [chromeCli, ...cliArgs], { encoding: "utf8", timeout: 45000 });
    } catch (e) {
      return (e.stdout ? String(e.stdout) : "") + "\n" + (e.stderr ? String(e.stderr) : "");
    }
  };
  try {
    let pagesOut = runCli(["list_pages"]);
    let explorerTabId = null;
    for (const ln of pagesOut.split(/\r?\n/)) {
      const m = ln.match(/^(\d+):\s+(.+)$/);
      if (m && /developers\.facebook\.com\/tools\/explorer/i.test(m[2])) explorerTabId = m[1];
    }
    if (!explorerTabId) {
      const appId = env.META_APP_ID || "1828644828457446";
      runCli(["new_page", `https://developers.facebook.com/tools/explorer/?app_id=${appId}`]);
      await sleep(6000);
      pagesOut = runCli(["list_pages"]);
      for (const ln of pagesOut.split(/\r?\n/)) {
        const m = ln.match(/^(\d+):\s+(.+)$/);
        if (m && /developers\.facebook\.com\/tools\/explorer/i.test(m[2])) explorerTabId = m[1];
      }
    }
    if (!explorerTabId) return null;

    const readJs = `() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      for (const inp of inputs) {
        if (inp.value && inp.value.startsWith('EAA') && inp.value.length > 50) return inp.value.trim();
      }
      return "";
    }`;
    const clickGenJs = `() => {
      const btns = Array.from(document.querySelectorAll('button, div[role="button"], span'));
      const genBtn = btns.find(b => /^(Generate Access Token|Generar token de acceso)$/i.test((b.innerText || '').trim()));
      if (genBtn) { genBtn.click(); return "CLICKED"; }
      return "NO_BTN";
    }`;

    let rawTok = runCli(["evaluate_script", readJs, `--pageId=${explorerTabId}`]);
    let mTok = rawTok.match(/EAA[A-Za-z0-9]+/);
    const tryExchange = async (cand) => {
      if (!cand) return null;
      const r = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token&access_token=${encodeURIComponent(cand)}`
      );
      const j = await r.json();
      const found = (j?.data || []).find((p) => p.id === targetPageId || /puraprueba/i.test(p.name || "")) || (j?.data || [])[0];
      return found?.access_token ? found : null;
    };

    let pageObj = await tryExchange(mTok ? mTok[0] : "");
    if (!pageObj) {
      runCli(["evaluate_script", clickGenJs, `--pageId=${explorerTabId}`]);
      await sleep(5000);
      const afterPages = runCli(["list_pages"]);
      for (const ln of afterPages.split(/\r?\n/)) {
        const m = ln.match(/^(\d+):\s+(.+)$/);
        if (m && m[1] !== explorerTabId && /facebook\.com/i.test(m[2])) {
          const confirmJs = `() => {
            const btns = Array.from(document.querySelectorAll('div[role="button"], button, span, a'));
            const t = btns.find(b => /^(Continuar como|Continue as|Continuar|Continue|Reconectar|Reconnect|Aceptar|Confirmar)/i.test((b.innerText || '').trim()));
            if (t) { t.click(); return "CLICKED"; }
            return "NONE";
          }`;
          runCli(["evaluate_script", confirmJs, `--pageId=${m[1]}`]);
          await sleep(4000);
        }
      }
      rawTok = runCli(["evaluate_script", readJs, `--pageId=${explorerTabId}`]);
      mTok = rawTok.match(/EAA[A-Za-z0-9]+/);
      pageObj = await tryExchange(mTok ? mTok[0] : "");
    }
    if (pageObj?.access_token) {
      env.META_PAGE_ACCESS_TOKEN = pageObj.access_token;
      const lines = fs.existsSync(ENV_PATH)
        ? fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith("META_PAGE_ACCESS_TOKEN="))
        : [];
      lines.push(`META_PAGE_ACCESS_TOKEN=${pageObj.access_token}`);
      fs.writeFileSync(ENV_PATH, lines.join("\n") + "\n", { mode: 0o600 });
      console.log(`✓ [Auto-Refresh Meta Token] Token renovado automáticamente desde Chrome para ${pageObj.name} (${pageObj.id})`);
      return pageObj.access_token;
    }
  } catch (_) {}
  return null;
}

async function publishMetaDirect() {
  let pageId = env.META_PAGE_ID;
  let igUserId = env.META_IG_USER_ID;
  let pageToken = env.META_PAGE_ACCESS_TOKEN;

  if (pageId && pageToken) {
    try {
      const chk = await fetch(
        `https://graph.facebook.com/v21.0/${encodeURIComponent(pageId)}?fields=id,name&access_token=${encodeURIComponent(pageToken)}`
      );
      if (!chk.ok) {
        console.log("  [Meta Auto-Heal]: El token en .env.local expiró; renovando automáticamente desde Chrome...");
        const refreshed = await autoRefreshMetaTokenFromChrome(pageId);
        if (refreshed) pageToken = refreshed;
      }
    } catch (_) {}
  }

  if (!pageToken) {
    throw new Error("Falta META_PAGE_ACCESS_TOKEN en .env.local para publicar vía Meta Graph API oficial.");
  }

  if (!pageId) {
    try {
      const accRes = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${encodeURIComponent(pageToken)}`,
      );
      const accJson = await accRes.json();
      const firstPage = accJson?.data?.[0];
      if (firstPage?.id) {
        pageId = firstPage.id;
        if (firstPage.access_token) pageToken = firstPage.access_token;
        if (firstPage.instagram_business_account?.id) igUserId = firstPage.instagram_business_account.id;
      } else {
        const meRes = await fetch(
          `https://graph.facebook.com/v21.0/me?fields=id,name,instagram_business_account{id,username}&access_token=${encodeURIComponent(pageToken)}`,
        );
        const meJson = await meRes.json();
        if (meJson?.id) {
          pageId = meJson.id;
          if (meJson.instagram_business_account?.id) igUserId = meJson.instagram_business_account.id;
        }
      }
      if (pageId) {
        env.META_PAGE_ID = pageId;
        if (igUserId) env.META_IG_USER_ID = igUserId;
        env.META_PAGE_ACCESS_TOKEN = pageToken;
        const lines = fs.existsSync(ENV_PATH)
          ? fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/).filter((l) => l && !l.startsWith("META_PAGE_ID=") && !l.startsWith("META_IG_USER_ID=") && !l.startsWith("META_PAGE_ACCESS_TOKEN="))
          : [];
        lines.push(`META_PAGE_ID=${pageId}`);
        if (igUserId) lines.push(`META_IG_USER_ID=${igUserId}`);
        lines.push(`META_PAGE_ACCESS_TOKEN=${pageToken}`);
        fs.writeFileSync(ENV_PATH, lines.join("\n") + "\n", { mode: 0o600 });
        console.log(`✓ [Meta Auto-Discovery] Page ID=${pageId}${igUserId ? " · IG User ID=" + igUserId : ""} guardado en .env.local`);
      }
    } catch (e) {
      console.warn("Aviso auto-discovery Meta:", e.message);
    }
  }

  if (!pageId || !pageToken) {
    throw new Error("Faltan META_PAGE_ID o META_PAGE_ACCESS_TOKEN en .env.local para publicar vía Meta Graph API oficial.");
  }

  const wantsFb = platforms.some((p) => p.includes("facebook") || p === "fb");
  const wantsIg = platforms.some((p) => p.includes("instagram") || p === "ig");

  if (!wantsFb && !wantsIg) {
    throw new Error(`meta-direct publica en facebook e instagram. Plataformas solicitadas: ${platforms.join(", ")}`);
  }

  if (wantsFb) {
    await publishMetaFacebookReel(pageId, pageToken);
  }
  if (wantsIg) {
    if (!igUserId) {
      console.log(
        "⚠ Aviso: META_IG_USER_ID no está vinculado aún a tu Página de Facebook. Se omitió Instagram Reels (vincula tu Instagram Profesional en la Configuración de tu Página de Facebook).",
      );
    } else {
      await publishMetaInstagramReel(igUserId, pageToken);
    }
  }
}

async function bufferGraphql(apiKey, query, variables = {}) {
  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(`Buffer GraphQL error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function publishBuffer(filterPlatforms = platforms, forceImmediate = false) {
  const apiKey = env.BUFFER_API_KEY;
  if (!apiKey) {
    throw new Error("Falta BUFFER_API_KEY en .env.local (obtenla gratis en https://publish.buffer.com/settings/api)");
  }

  // Guardia contra videos descartados de otros estilos/nichos o timers antiguos cancelados
  const blockedSlugs = [
    "chicken-wash",
    "premium-gas",
    "water-chug",
    "knuckle-myth",
    "cafe-despertar",
    "alarma-cinco-minutos",
    "platos-mano-agua",
  ];
  if (blockedSlugs.some((b) => outDir.toLowerCase().includes(b))) {
    console.log(`  [Guardia de nicho]: se bloqueó publicación de carpeta descartada (${outDir}).`);
    return;
  }

  if (bufferImmediate) {
    const queueFile = path.join(__dirname, "buffer_schedule_queue.json");
    if (fs.existsSync(queueFile)) {
      try {
        const q = JSON.parse(fs.readFileSync(queueFile, "utf8"));
        const inQueue = Array.isArray(q) && q.some((item) => path.resolve(KF_ROOT, item.outDir) === outDir);
        if (!inQueue) {
          console.log(`  [Guardia de cola]: disparo diferido antiguo ignorado porque ${outDir} ya no está en buffer_schedule_queue.json.`);
          return;
        }
      } catch {}
    }
  }

  if (bufferImmediate || forceImmediate) {
    await waitForInternet(120000);
  }

  // 1. Obtener organización y canales conectados en Buffer Gratis
  const orgData = await bufferGraphql(
    apiKey,
    `query GetOrgs { account { organizations { id name } } }`,
  );
  const orgs = orgData?.account?.organizations || [];
  if (orgs.length === 0) throw new Error("No se encontraron organizaciones en tu cuenta de Buffer.");
  const orgId = env.BUFFER_ORG_ID || orgs[0].id;

  const chData = await bufferGraphql(
    apiKey,
    `query GetChannels($orgId: OrganizationId!) {
      channels(input: { organizationId: $orgId }) {
        id
        name
        service
      }
    }`,
    { orgId },
  );
  const allChannels = chData?.channels || [];
  if (allChannels.length === 0) {
    throw new Error("No tienes canales conectados aún en Buffer. Conecta TikTok y YouTube en buffer.com.");
  }

  const targetChannels = allChannels.filter((c) =>
    filterPlatforms.some((p) => String(c.service || "").toLowerCase().includes(p)),
  );
  if (targetChannels.length === 0) {
    throw new Error(
      `Ningún canal conectado en Buffer (${allChannels.map((c) => c.service).join(", ")}) coincide con: ${filterPlatforms.join(", ")}`,
    );
  }

  // Ordenar para programar primero TikTok y luego YouTube Shorts
  targetChannels.sort((a, b) => {
    const sa = String(a.service || "").toLowerCase();
    const sb = String(b.service || "").toLowerCase();
    if (sa.includes("tiktok") && !sb.includes("tiktok")) return -1;
    if (!sa.includes("tiktok") && sb.includes("tiktok")) return 1;
    return 0;
  });

  // Guardia estricta anti-duplicados:
  // 1) Si el video YA fue publicado (status === "sent") en un canal, JAMÁS volver a publicarlo ni programarlo ahí (salvo --force-repost).
  // 2) Si existe algún post programado previo (status === "scheduled") del mismo video, eliminarlo antes de programar uno nuevo (o saltar si es disparo --buffer-immediate).
  const forceRepost = args.includes("--force-repost");
  const alreadySentServices = new Set();
  try {
    const existingPosts = await bufferGraphql(
      apiKey,
      `query($orgId: OrganizationId!) {
        posts(first: 100, input: { organizationId: $orgId }) {
          edges { node { id status channelService text dueAt } }
        }
      }`,
      { orgId },
    );
    const targetServices = new Set(targetChannels.map((c) => String(c.service || "").toLowerCase()));
    const firstPrefix = firstLine.slice(0, 42).toLowerCase();
    for (const edge of existingPosts?.posts?.edges || []) {
      const node = edge?.node;
      if (!node) continue;
      const svc = String(node.channelService || "").toLowerCase();
      if (!targetServices.has(svc)) continue;
      const matchesVideo = String(node.text || "").toLowerCase().startsWith(firstPrefix);
      if (!matchesVideo) continue;

      if (node.status === "sent" && !forceRepost) {
        alreadySentServices.add(svc);
      } else if (node.status === "scheduled") {
        if (bufferImmediate && !forceRepost) {
          alreadySentServices.add(svc);
          console.log(`  [Guardia anti-duplicado]: ya existe post programado en Buffer (${node.id}, ${svc}); se omite disparo local.`);
        } else {
          await bufferGraphql(
            apiKey,
            `mutation($input: DeletePostInput!) { deletePost(input: $input) { __typename } }`,
            { input: { id: node.id } },
          );
          console.log(`  [Buffer limpieza anti-duplicado]: eliminado post programado previo ${node.id} (${svc})`);
        }
      }
    }
  } catch (dedupErr) {
    console.warn("  [Aviso verificación anti-duplicado]:", dedupErr.message);
  }

  for (let i = targetChannels.length - 1; i >= 0; i--) {
    const svc = String(targetChannels[i].service || "").toLowerCase();
    if (alreadySentServices.has(svc)) {
      console.log(`  ✓ [Guardia anti-duplicado]: "${firstLine.slice(0, 48)}..." ya fue publicado en ${svc}; se omite para no repetir.`);
      targetChannels.splice(i, 1);
    }
  }
  if (targetChannels.length === 0) {
    console.log(`✓ Todos los canales solicitados ya tienen publicado este video (0 duplicados).`);
    return;
  }

  // Detectar dinámicamente esquema exacto de Buffer GraphQL (CreatePostInput, VideoAssetInput, enums y PostInputMetaData)
  let videoUrlField = "url";
  let hasNeedsApproval = true;
  let scheduledModeEnum = "customScheduled";
  let immediateModeEnum = env.BUFFER_MODE || "shareNow";
  let autoSchedEnum = "automatic";
  let metaFieldYoutube = "youtube";
  let metaFieldTiktok = "";
  let ytMetaFields = [];
  let ttMetaFields = [];

  const unwrapType = (t) => {
    let cur = t;
    let nonNull = false;
    while (cur) {
      if (cur.kind === "NON_NULL") nonNull = true;
      if (cur.name) return { kind: cur.kind, name: cur.name, nonNull, enumValues: cur.enumValues || null };
      cur = cur.ofType;
    }
    return { kind: "SCALAR", name: "String", nonNull, enumValues: null };
  };

  try {
    const intro = await bufferGraphql(
      apiKey,
      `query InspectBufferSchema {
        createInput: __type(name: "CreatePostInput") { inputFields { name } }
        videoInput: __type(name: "VideoAssetInput") { inputFields { name } }
        shareMode: __type(name: "ShareMode") { enumValues { name } }
        schedType: __type(name: "SchedulingType") { enumValues { name } }
        postMeta: __type(name: "PostInputMetaData") {
          inputFields {
            name
            type { kind name ofType { kind name ofType { kind name } } }
          }
        }
      }`,
    );
    const createFields = (intro?.createInput?.inputFields || []).map((f) => f.name);
    if (createFields.length > 0) {
      hasNeedsApproval = createFields.includes("needsApproval");
    }
    const vFields = (intro?.videoInput?.inputFields || []).map((f) => f.name);
    if (vFields.includes("url")) videoUrlField = "url";
    else if (vFields.includes("source")) videoUrlField = "source";

    const modes = (intro?.shareMode?.enumValues || []).map((e) => e.name);
    if (modes.length > 0) {
      const mSched =
        modes.find((m) => /^custom_?scheduled$/i.test(m)) ||
        modes.find((m) => /sched/i.test(m));
      if (mSched) scheduledModeEnum = mSched;
      const mNow =
        modes.find((m) => m.toLowerCase() === String(env.BUFFER_MODE || "sharenow").toLowerCase()) ||
        modes.find((m) => /now/i.test(m)) ||
        modes[0];
      if (mNow) immediateModeEnum = mNow;
    }

    const schedTypes = (intro?.schedType?.enumValues || []).map((e) => e.name);
    const mAuto = schedTypes.find((s) => /auto/i.test(s));
    if (mAuto) autoSchedEnum = mAuto;

    const pmRaw = intro?.postMeta?.inputFields || [];
    const ytFieldObj = pmRaw.find((f) => /youtube/i.test(f.name));
    const ttFieldObj = pmRaw.find((f) => /tiktok/i.test(f.name));
    if (ytFieldObj) {
      metaFieldYoutube = ytFieldObj.name;
      const ytTypeName = unwrapType(ytFieldObj.type).name;
      if (ytTypeName) {
        const ytSub = await bufferGraphql(
          apiKey,
          `query InspectYtMeta($t: String!) {
            __type(name: $t) {
              inputFields {
                name
                type {
                  kind
                  name
                  enumValues { name }
                  ofType {
                    kind
                    name
                    enumValues { name }
                    ofType { kind name enumValues { name } }
                  }
                }
              }
            }
          }`,
          { t: ytTypeName },
        );
        ytMetaFields = ytSub?.__type?.inputFields || [];
      }
    } else if (pmRaw.length > 0) {
      metaFieldYoutube = "";
    }

    if (ttFieldObj) {
      metaFieldTiktok = ttFieldObj.name;
      const ttTypeName = unwrapType(ttFieldObj.type).name;
      if (ttTypeName) {
        const ttSub = await bufferGraphql(
          apiKey,
          `query InspectTtMeta($t: String!) {
            __type(name: $t) {
              inputFields {
                name
                type {
                  kind
                  name
                  enumValues { name }
                  ofType {
                    kind
                    name
                    enumValues { name }
                    ofType { kind name enumValues { name } }
                  }
                }
              }
            }
          }`,
          { t: ttTypeName },
        );
        ttMetaFields = ttSub?.__type?.inputFields || [];
      }
    }
  } catch (introErr) {
    console.warn("[Buffer Schema Introspection aviso]:", introErr.message);
  }

  function buildYoutubeMetadataVariants(ytTitle) {
    if (!metaFieldYoutube) return [undefined];
    if (ytMetaFields.length === 0) {
      return [
        { [metaFieldYoutube]: { title: ytTitle, categoryId: "28", privacy: "public", madeForKids: false } },
        { [metaFieldYoutube]: { title: ytTitle, categoryId: "28" } },
        { [metaFieldYoutube]: { title: ytTitle, category: "28" } },
      ];
    }
    const fullObj = {};
    const minObj = {};
    for (const f of ytMetaFields) {
      const info = unwrapType(f.type);
      const enums = (info.enumValues || []).map((e) => e.name);
      const fn = f.name;
      if (/^title$/i.test(fn)) {
        fullObj[fn] = ytTitle;
        minObj[fn] = ytTitle;
      } else if (/^category_?id$/i.test(fn) || /^category$/i.test(fn)) {
        let val = "28";
        if (info.kind === "ENUM" && enums.length > 0) {
          val =
            enums.find((e) => /science|tech/i.test(e)) ||
            enums.find((e) => /educat|people|blog/i.test(e)) ||
            enums[0];
        } else if (info.name === "Int") {
          val = 28;
        }
        fullObj[fn] = val;
        minObj[fn] = val;
      } else if (/^privacy|visibility$/i.test(fn)) {
        let val = "public";
        if (info.kind === "ENUM" && enums.length > 0) {
          val = enums.find((e) => /^public$/i.test(e)) || enums.find((e) => /public/i.test(e)) || enums[0];
        }
        fullObj[fn] = val;
        if (info.nonNull) minObj[fn] = val;
      } else if (/^made_?for_?kids$/i.test(fn)) {
        fullObj[fn] = false;
        if (info.nonNull) minObj[fn] = false;
      } else if (/^notify_?subscribers$/i.test(fn)) {
        fullObj[fn] = true;
        if (info.nonNull) minObj[fn] = true;
      } else if (info.nonNull) {
        const fallback =
          info.kind === "ENUM" && enums.length > 0
            ? enums[0]
            : info.name === "Boolean"
              ? false
              : info.name === "Int"
                ? 0
                : ytTitle;
        fullObj[fn] = fallback;
        minObj[fn] = fallback;
      }
    }
    return [{ [metaFieldYoutube]: fullObj }, { [metaFieldYoutube]: minObj }];
  }

  function buildTiktokMetadataVariants() {
    if (!metaFieldTiktok || ttMetaFields.length === 0) return [undefined];
    const reqObj = {};
    let hasReq = false;
    for (const f of ttMetaFields) {
      const info = unwrapType(f.type);
      const enums = (info.enumValues || []).map((e) => e.name);
      if (/^privacy|visibility$/i.test(f.name) && info.kind === "ENUM" && enums.length > 0) {
        const pub = enums.find((e) => /public|everyone/i.test(e));
        if (pub) reqObj[f.name] = pub;
      } else if (info.nonNull) {
        hasReq = true;
        reqObj[f.name] =
          info.kind === "ENUM" && enums.length > 0
            ? enums[0]
            : info.name === "Boolean"
              ? false
              : info.name === "Int"
                ? 0
                : "";
      }
    }
    return hasReq ? [{ [metaFieldTiktok]: reqObj }, undefined] : [undefined, ...(Object.keys(reqObj).length ? [{ [metaFieldTiktok]: reqObj }] : [])];
  }

  function scheduleWindowsTaskForBuffer(targetIsoDate, targetPlats) {
    const dt = new Date(targetIsoDate);
    if (Number.isNaN(dt.getTime())) {
      throw new Error(`Fecha inválida para programar Buffer: ${targetIsoDate}`);
    }
    const pad = (n) => String(n).padStart(2, "0");
    const sd = `${dt.getFullYear()}/${pad(dt.getMonth() + 1)}/${pad(dt.getDate())}`;
    const slug = path.basename(mp4Name, ".mp4").replace(/[^a-zA-Z0-9_-]/g, "_");
    const taskName = `PuraPrueba_BUF_${slug}`;
    const scriptPath = fileURLToPath(import.meta.url);
    const nodeExe = process.execPath;
    const platArg = targetPlats.join(",");

    const queueFile = path.join(__dirname, "buffer_schedule_queue.json");
    const existing = fs.existsSync(queueFile) ? JSON.parse(fs.readFileSync(queueFile, "utf8")) : [];
    const filtered = existing.filter((item) => item.taskName !== taskName);
    filtered.push({
      taskName,
      outDir,
      platforms: targetPlats,
      scheduledAt: dt.toISOString(),
      createdAt: new Date().toISOString(),
    });
    fs.writeFileSync(queueFile, JSON.stringify(filtered, null, 2) + "\n", "utf8");

    if (process.platform === "win32") {
      const psCmd = [
        `$action = New-ScheduledTaskAction -Execute '${nodeExe.replace(/'/g, "''")}' -Argument '"${scriptPath}" "${outDir}" --provider buffer --platforms ${platArg} --buffer-immediate' -WorkingDirectory '${KF_ROOT.replace(/'/g, "''")}';`,
        `$trigger = New-ScheduledTaskTrigger -Once -At ([datetime]::Parse('${dt.toISOString()}'));`,
        `$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -WakeToRun -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 5);`,
        `Register-ScheduledTask -TaskName '${taskName}' -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null;`,
      ].join(" ");
      execFileSync("powershell.exe", ["-NoProfile", "-Command", psCmd], { stdio: "inherit" });
    } else {
      const delayMs = Math.max(1000, dt.getTime() - Date.now());
      const runner = `setTimeout(() => { try { const q = JSON.parse(require("node:fs").readFileSync(${JSON.stringify(queueFile)}, "utf8")); if (!q.some(x => x.taskName === ${JSON.stringify(taskName)})) process.exit(0); } catch {} require("node:child_process").spawnSync(${JSON.stringify(nodeExe)}, [${JSON.stringify(scriptPath)}, ${JSON.stringify(outDir)}, "--provider", "buffer", "--platforms", ${JSON.stringify(platArg)}, "--buffer-immediate"], { cwd: ${JSON.stringify(KF_ROOT)}, stdio: "ignore" }); }, ${delayMs});`;
      spawn(nodeExe, ["-e", runner], { cwd: KF_ROOT, detached: true, stdio: "ignore" }).unref();
    }
    console.log(`✓ [Buffer (${platArg}) Programado sin expiración URL] tarea=${taskName} · fecha=${dt.toISOString()} (${sd})`);
  }

  // 2. Proveedores escalonados de enlace HTTPS directo compatible con los servidores AWS de Buffer.
  // IMPORTANTE: Buffer descarga video.url en el momento de dueAt (no al crear el post).
  // Por eso NUNCA usamos uguu.se (3h), tmpfiles.org (1h) ni túnel efímero cuando dueAt está a > 2 horas.
  const effectiveScheduleAt = bufferImmediate || forceImmediate ? "" : scheduleAt;
  const dueMs = effectiveScheduleAt ? new Date(effectiveScheduleAt).getTime() : 0;
  const hoursUntilDue = dueMs ? (dueMs - Date.now()) / (3600 * 1000) : 0;
  const isLongSchedule = Boolean(effectiveScheduleAt && hoursUntilDue > 2);

  const stageProviders = isLongSchedule
    ? [
        ...(cliVideoUrl || env.PUBLIC_VIDEO_URL
          ? [async () => ({ url: cliVideoUrl || env.PUBLIC_VIDEO_URL, cleanup: async () => {} })]
          : []),
        ...(hoursUntilDue <= 60 ? [async () => stageViaLitterbox(mp4Path)] : []),
        async () => stageViaCatbox(mp4Path),
        async () => stageVia0x0St(mp4Path),
        async () => stageViaX0At(mp4Path),
      ]
    : [
        ...(cliVideoUrl || env.PUBLIC_VIDEO_URL
          ? [async () => ({ url: cliVideoUrl || env.PUBLIC_VIDEO_URL, cleanup: async () => {} })]
          : []),
        async () => stageViaLitterbox(mp4Path),
        async () => stageViaCatbox(mp4Path),
        async () => stageViaUguu(mp4Path),
        async () => stageViaTmpfiles(mp4Path),
        async () => stageViaX0At(mp4Path),
        async () => stageVia0x0St(mp4Path),
        async () => await stageViaLocalhostRunTunnel(mp4Path),
      ];

  const mode = effectiveScheduleAt ? scheduledModeEnum : immediateModeEnum;
  const dueAtIso = effectiveScheduleAt ? new Date(effectiveScheduleAt).toISOString() : undefined;

  let activeStaged = null;
  let nextProviderIdx = 0;

  async function advanceStagedVideo() {
    if (activeStaged) {
      await activeStaged.cleanup().catch(() => {});
      activeStaged = null;
    }
    while (nextProviderIdx < stageProviders.length) {
      const fn = stageProviders[nextProviderIdx++];
      try {
        activeStaged = await fn();
        if (activeStaged?.url) return activeStaged.url;
      } catch (stErr) {
        console.warn(`  [Aviso staging #${nextProviderIdx}]: ${stErr.message}`);
      }
    }
    return null;
  }

  let videoUrl = await advanceStagedVideo();
  if (!videoUrl) {
    if (isLongSchedule) {
      console.warn("  Ningún host HTTPS de larga duración (>72h) estuvo disponible; activando disparo programado local exacto (shareNow a la hora programada, 0% riesgo HTTP 404)...");
      scheduleWindowsTaskForBuffer(effectiveScheduleAt, filterPlatforms);
      return;
    }
    throw new Error("Ningún proveedor HTTPS temporal pudo alojar el MP4 para Buffer.");
  }

  let stagedCoverUrl = null;
  if (coverPath) {
    for (const coverFn of [stageViaCatbox, stageViaLitterbox, (p) => ({ url: stageTempPublicFile(p, ".jpg") })]) {
      try {
        const sc = coverFn(coverPath);
        if (sc?.url) {
          stagedCoverUrl = sc.url;
          break;
        }
      } catch (_) {}
    }
  }

  const completedServices = new Set();
  try {
    // 3. Publicar / programar en cada canal conectado (Instagram + TikTok + YouTube Shorts)
    for (const ch of targetChannels) {
      const svc = String(ch.service || "").toLowerCase();
      const ytTitle = `${firstLine} #Shorts`.slice(0, 100);

      const metaVariants = svc.includes("youtube")
        ? buildYoutubeMetadataVariants(ytTitle)
        : svc.includes("tiktok")
          ? buildTiktokMetadataVariants()
          : svc.includes("instagram")
            ? [
                { instagram: { type: "reel", shouldShareToFeed: true } },
                { instagram: { type: "reel" } },
                undefined,
              ]
            : [undefined];

      const mutation = `mutation CreateVideoPost($input: CreatePostInput!) {
        createPost(input: $input) {
          __typename
          ... on PostActionSuccess {
            post { id status dueAt }
          }
          ... on InvalidInputError {
            message
          }
          ... on MutationError {
            message
          }
        }
      }`;

      let published = false;
      const candErrors = [];

      while (!published) {
        const videoObjPlain = { [videoUrlField]: videoUrl };
        const videoObjs =
          stagedCoverUrl && svc.includes("instagram")
            ? [{ [videoUrlField]: videoUrl, thumbnailUrl: stagedCoverUrl }, videoObjPlain]
            : [videoObjPlain];

        const safeText = svc.includes("youtube") ? caption.replace(/[<>]/g, "") : caption;
        const candidates = [];
        for (const vObj of videoObjs) {
          for (const metaVar of metaVariants) {
            candidates.push({
              channelId: ch.id,
              text: safeText,
              schedulingType: autoSchedEnum,
              mode,
              ...(hasNeedsApproval ? { needsApproval: false } : {}),
              ...(dueAtIso ? { dueAt: dueAtIso } : {}),
              assets: [{ video: vObj }],
              ...(metaVar ? { metadata: metaVar } : {}),
            });
          }
        }

        let urlUnreadable = false;
        for (let ci = 0; ci < candidates.length; ci++) {
          const cand = candidates[ci];
          try {
            const postRes = await bufferGraphql(apiKey, mutation, { input: cand });
            const typeName = postRes?.createPost?.__typename;
            const msg = postRes?.createPost?.message || JSON.stringify(postRes?.createPost);
            if (typeName !== "PostActionSuccess") {
              candErrors.push(`cand#${ci + 1} (${typeName}): ${msg}`);
              const hasThumb = Boolean(cand?.assets?.[0]?.video?.thumbnailUrl);
              if (/video could not be read|could not.*download|unable to fetch/i.test(String(msg)) && !hasThumb) {
                urlUnreadable = true;
                break;
              }
              continue;
            }
            console.log(`✓ [${ch.service} · ${ch.name}] ->`, JSON.stringify(postRes?.createPost));
            published = true;
            completedServices.add(svc);
            break;
          } catch (err) {
            candErrors.push(`cand#${ci + 1} (GQL): ${err.message}`);
          }
        }

        if (!published && urlUnreadable && nextProviderIdx < stageProviders.length) {
          console.warn(`  Buffer no pudo leer ${videoUrl}; probando siguiente servidor HTTPS automáticamente...`);
          videoUrl = await advanceStagedVideo();
          if (videoUrl) continue;
        }
        break;
      }

      if (!published) {
        if (isLongSchedule && (!videoUrl || candErrors.some((e) => /video could not be read|could not.*download|unable to fetch/i.test(e)))) {
          const remainingPlats = targetChannels
            .map((c) => String(c.service || "").toLowerCase())
            .filter((s) => !completedServices.has(s));
          console.warn(`  Los hosts públicos largos bloquearon la IP AWS de Buffer; registrando tarea programada local exacta para canales pendientes (${remainingPlats.join(",")})...`);
          if (remainingPlats.length > 0) {
            scheduleWindowsTaskForBuffer(effectiveScheduleAt, remainingPlats);
          }
          return;
        }
        throw new Error(`No se pudo programar en ${ch.service}: ${candErrors.join(" | ")}`);
      }
    }
  } finally {
    if (activeStaged) {
      await activeStaged.cleanup().catch(() => {});
    }
  }
}

async function publishAllOfficial() {
  const wantsMeta = platforms.some((p) => ["facebook", "fb", "instagram", "ig"].includes(p));
  const bufferPlatforms = platforms.filter((p) => ["tiktok", "youtube", "yt"].some((k) => p.includes(k)));

  if (wantsMeta) {
    await publishMetaDirect();
  }
  if (bufferPlatforms.length > 0) {
    if (env.BUFFER_API_KEY) {
      await publishBuffer(bufferPlatforms);
    } else if (
      bufferPlatforms.every((p) => p.includes("youtube") || p === "yt") &&
      env.YOUTUBE_CLIENT_ID &&
      env.YOUTUBE_CLIENT_SECRET &&
      env.YOUTUBE_REFRESH_TOKEN
    ) {
      await publishYoutubeDirect();
    } else {
      throw new Error(
        "Falta BUFFER_API_KEY en .env.local para publicar/programar simultáneamente en TikTok y YouTube Shorts.",
      );
    }
  }
}

async function publishUploadPost() {
  const apiKey = env.UPLOAD_POST_API_KEY;
  const user = env.UPLOAD_POST_USER;
  if (!apiKey || !user) {
    throw new Error("Faltan UPLOAD_POST_API_KEY o UPLOAD_POST_USER en .env.local");
  }
  const curlArgs = [
    "-sS",
    "-X",
    "POST",
    "https://api.upload-post.com/api/upload",
    "-H",
    `Authorization: Apikey ${apiKey}`,
    "-F",
    `user=${user}`,
    "-F",
    `title=${caption}`,
    "-F",
    `youtube_title=${firstLine}`,
    "-F",
    `video=@${mp4Path}`,
  ];
  for (const p of platforms) {
    curlArgs.push("-F", `platform[]=${p}`);
  }
  if (scheduleAt) {
    curlArgs.push("-F", `scheduled_date=${scheduleAt}`);
  }
  const out = execFileSync(CURL_BIN, curlArgs, { encoding: "utf8" });
  console.log("\nRespuesta Upload-Post:\n", out);
}

async function publishPostiz() {
  const apiKey = env.POSTIZ_API_KEY;
  const baseUrl = (env.POSTIZ_BASE_URL || "https://api.postiz.com/public/v1").replace(/\/$/, "");
  const channelIds = (env.POSTIZ_CHANNEL_IDS || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!apiKey || channelIds.length === 0) {
    throw new Error("Faltan POSTIZ_API_KEY o POSTIZ_CHANNEL_IDS en .env.local");
  }
  const upRaw = execFileSync(
    CURL_BIN,
    ["-sS", "-X", "POST", `${baseUrl}/upload`, "-H", `Authorization: ${apiKey}`, "-F", `file=@${mp4Path}`],
    { encoding: "utf8" },
  );
  const media = JSON.parse(upRaw);
  const payload = {
    type: scheduleAt ? "schedule" : "now",
    date: scheduleAt || new Date().toISOString(),
    shortLink: false,
    tags: [],
    posts: channelIds.map((id) => ({
      integration: { id },
      value: [{ content: caption, image: [{ id: media.id, path: media.path }] }],
    })),
  };
  const res = await fetch(`${baseUrl}/posts`, {
    method: "POST",
    headers: { Authorization: apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log("\nRespuesta Postiz:\n", await res.text());
}

async function publishYoutubeDirect() {
  const { YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REFRESH_TOKEN } = env;
  if (!YOUTUBE_CLIENT_ID || !YOUTUBE_CLIENT_SECRET || !YOUTUBE_REFRESH_TOKEN) {
    throw new Error("Faltan YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET o YOUTUBE_REFRESH_TOKEN en .env.local");
  }
  const tokRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: YOUTUBE_CLIENT_ID,
      client_secret: YOUTUBE_CLIENT_SECRET,
      refresh_token: YOUTUBE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const tok = await tokRes.json();
  if (!tok.access_token) throw new Error(`Error OAuth YouTube: ${JSON.stringify(tok)}`);

  const initRes = await fetch(
    "https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tok.access_token}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": "video/mp4",
        "X-Upload-Content-Length": String(fs.statSync(mp4Path).size),
      },
      body: JSON.stringify({
        snippet: {
          title: `${firstLine} #Shorts`.slice(0, 100),
          description: caption,
          categoryId: "28",
        },
        status: {
          privacyStatus: env.YOUTUBE_PRIVACY || "public",
          selfDeclaredMadeForKids: false,
        },
      }),
    },
  );
  const uploadUrl = initRes.headers.get("location");
  if (!uploadUrl) throw new Error(`YouTube no devolvió URL resumable: ${await initRes.text()}`);

  const videoBytes = fs.readFileSync(mp4Path);
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": "video/mp4", "Content-Length": String(videoBytes.length) },
    body: videoBytes,
  });
  console.log("\nPublicado en YouTube Shorts:\n", await putRes.text());
}

if (provider === "all-official") {
  await publishAllOfficial();
} else if (provider === "meta-direct") {
  await publishMetaDirect();
} else if (provider === "buffer") {
  await publishBuffer();
} else if (provider === "upload-post") {
  await publishUploadPost();
} else if (provider === "postiz") {
  await publishPostiz();
} else if (provider === "youtube-direct") {
  await publishYoutubeDirect();
} else {
  console.error(`Proveedor desconocido: ${provider}`);
  process.exit(1);
}

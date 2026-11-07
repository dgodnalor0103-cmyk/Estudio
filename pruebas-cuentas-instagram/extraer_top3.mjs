#!/usr/bin/env node
import { execFileSync, spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "/Users/rol.travel/.gemini/antigravity/scratch/pruebas-cuentas-instagram";
const FFMPEG_DIR = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/node_modules/@remotion/compositor-darwin-arm64";
const FFMPEG = join(FFMPEG_DIR, "ffmpeg");
const FFPROBE = join(FFMPEG_DIR, "ffprobe");

// Si se invoca sin --worker desde puente_red.mjs, lanzar en segundo plano y devolver inmediato
if (!process.argv.includes("--worker")) {
  const child = spawn(process.execPath, [process.argv[1], "--worker"], {
    cwd: ROOT,
    env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR },
    detached: true,
    stdio: "ignore",
  });
  child.unref();
  console.log("Extractor de top 3 virales lanzado en background PID=" + child.pid);
  process.exit(0);
}

const SHORTCODES = [
  { code: "DeW3kuNM2v5", nombre: "18.2M_touchscreen" },
  { code: "DeZ-ddqMWFE", nombre: "10.6M_keyboard" },
  { code: "DecOLvTsuFH", nombre: "3.2M_macbook_battery" },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

async function extraerUno(browser, { code, nombre }) {
  const outDir = join(ROOT, "analisis", code);
  mkdirSync(outDir, { recursive: true });
  const logLines = [];
  const log = (m) => {
    const line = `[${new Date().toISOString()}] [${code}] ${m}`;
    logLines.push(line);
    writeFileSync(join(outDir, "extraccion.log"), logLines.join("\n") + "\n");
  };

  log(`Iniciando extracción de ${code} (${nombre})...`);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1020 },
    deviceScaleFactor: 2,
    userAgent: UA,
  });
  const page = await context.newPage();
  const mp4Set = new Set();
  const textos = [];

  page.on("response", async (res) => {
    try {
      const u = res.url();
      const ct = (res.headers()["content-type"] || "").toLowerCase();
      if (u.includes(".mp4") || ct.includes("video/mp4") || ct.includes("audio/mp4")) {
        mp4Set.add(u);
      }
      if (ct.includes("json") || u.includes("graphql") || u.includes("api/v1/")) {
        const t = await res.text();
        if (t.includes(code) || t.includes("video_versions") || t.includes("video_url") || t.includes("dash_manifest")) {
          const des = t.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\u0026/g, "&").replace(/\\\//g, "/");
          for (const re of [
            /"video_url"\s*:\s*"(https:[^"]+)"/g,
            /"base_url"\s*:\s*"(https:[^"]+\.mp4[^"]*)"/g,
            /"url"\s*:\s*"(https:[^"]+\.mp4[^"]*)"/g,
          ]) {
            let m;
            while ((m = re.exec(des)) !== null) mp4Set.add(m[1]);
          }
        }
      }
    } catch {}
  });

  for (const [etiqueta, url] of [
    ["embed", `https://www.instagram.com/p/${code}/embed/captioned/`],
    ["post", `https://www.instagram.com/p/${code}/`],
  ]) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(3500);
    const txt = await page.evaluate(() => document.body?.innerText || "");
    textos.push(`--- ${etiqueta} ---\n${txt}`);

    try {
      await page.evaluate(() => {
        for (const sel of [".EmbedVideo", ".WatchOnInstagram", "video", "button", "[role='button']"]) {
          const el = document.querySelector(sel);
          if (el) el.click();
        }
        const v = document.querySelector("video");
        if (v) v.play().catch(() => {});
      });
      await page.waitForTimeout(2800);
    } catch {}

    const htmlAfter = await page.content();
    const des = htmlAfter.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    for (const re of [
      /"video_url"\s*:\s*"(https:[^"]+)"/g,
      /"base_url"\s*:\s*"(https:[^"]+\.mp4[^"]*)"/g,
      /src="(https:[^"]+\.mp4[^"]*)"/g,
    ]) {
      let m;
      while ((m = re.exec(des)) !== null) mp4Set.add(m[1]);
    }
  }

  writeFileSync(join(outDir, "texto_pagina.txt"), textos.join("\n\n"));
  await context.close();

  const limpios = new Set();
  const descargados = [];
  let idx = 0;

  for (const raw of mp4Set) {
    const clean = raw
      .replace(/\\u0026/g, "&")
      .replace(/\\\//g, "/")
      .replace(/&amp;/g, "&")
      .replace(/&bytestart=\d+/g, "")
      .replace(/&byteend=\d+/g, "");
    if (limpios.has(clean)) continue;
    limpios.add(clean);
    const dest = join(outDir, `dl_${idx++}.mp4`);
    try {
      const r = await fetch(clean, { headers: { "User-Agent": UA, Referer: "https://www.instagram.com/" } });
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      writeFileSync(dest, buf);
      const probe = execFileSync(
        FFPROBE,
        ["-v", "error", "-show_entries", "stream=codec_type,width,height,duration", "-of", "json", dest],
        { env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR }, encoding: "utf8" }
      );
      const info = JSON.parse(probe);
      const streams = info.streams || [];
      const tieneV = streams.some((s) => s.codec_type === "video");
      const tieneA = streams.some((s) => s.codec_type === "audio");
      const vs = streams.find((s) => s.codec_type === "video");
      descargados.push({
        path: dest,
        bytes: buf.length,
        tieneV,
        tieneA,
        width: vs ? vs.width : 0,
        height: vs ? vs.height : 0,
        duration: Number(streams[0]?.duration || 0),
      });
      log(`dl_${idx - 1}.mp4: ${buf.length}B (V=${tieneV} ${vs ? vs.width + "x" + vs.height : ""}, A=${tieneA}, dur=${streams[0]?.duration}s)`);
    } catch (e) {
      log(`Error dl_${idx - 1}: ${e.message}`);
    }
  }

  // Preferir la mayor resolución de video (1080x1920)
  const mejorV = descargados
    .filter((d) => d.tieneV)
    .sort((a, b) => b.width * b.height - a.width * a.height || b.bytes - a.bytes)[0];
  const mejorA = descargados.filter((d) => d.tieneA).sort((a, b) => b.bytes - a.bytes)[0];
  const finalMp4 = join(outDir, "original_1080.mp4");
  const hojaJpg = join(outDir, "hoja_contacto.jpg");

  if (mejorV) {
    if (mejorV.tieneA) {
      execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-i", mejorV.path, "-c", "copy", finalMp4], {
        env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR },
      });
    } else if (mejorA) {
      execFileSync(
        FFMPEG,
        ["-hide_banner", "-loglevel", "error", "-y", "-i", mejorV.path, "-i", mejorA.path, "-c:v", "copy", "-c:a", "aac", "-shortest", finalMp4],
        { env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR } }
      );
    } else {
      execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-i", mejorV.path, "-c", "copy", finalMp4], {
        env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR },
      });
    }
    execFileSync(
      FFMPEG,
      [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        finalMp4,
        "-vf",
        "fps=1.2,scale=270:480,drawtext=text='%{pts\\:hms}':x=8:y=8:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.7,tile=6x6",
        "-frames:v",
        "1",
        "-q:v",
        "2",
        hojaJpg,
      ],
      { env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR } }
    );
    log(`Consolidado ${finalMp4} (${mejorV.width}x${mejorV.height}, ${mejorV.duration}s) y ${hojaJpg}`);
  }
  writeFileSync(join(outDir, "LISTO.txt"), new Date().toISOString());
}

const { chromium } = await import("/Users/rol.travel/.gemini/antigravity/scratch/keyframes/node_modules/playwright/index.mjs");
const browser = await chromium.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--use-mock-keychain", "--password-store=basic", "--autoplay-policy=no-user-gesture-required"],
});

for (const item of SHORTCODES) {
  try {
    await extraerUno(browser, item);
  } catch (e) {
    writeFileSync(join(ROOT, "analisis", item.code, "ERROR.txt"), String(e?.stack || e));
  }
}

await browser.close();
writeFileSync(join(ROOT, "analisis", "TOP3_LISTOS.txt"), new Date().toISOString());

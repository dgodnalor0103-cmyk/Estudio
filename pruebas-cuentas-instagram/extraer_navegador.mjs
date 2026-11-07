#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = "/Users/rol.travel/.gemini/antigravity/scratch/pruebas-cuentas-instagram";
const SHORTCODE = "DfHpex7MbM2";
const TARGET_URL = `https://www.instagram.com/p/${SHORTCODE}/`;
const OUT_DIR = join(ROOT, "analisis", SHORTCODE);
const FRAMES_DIR = join(OUT_DIR, "frames");
const FFMPEG_DIR = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/node_modules/@remotion/compositor-darwin-arm64";
const FFMPEG = join(FFMPEG_DIR, "ffmpeg");
const FFPROBE = join(FFMPEG_DIR, "ffprobe");

mkdirSync(FRAMES_DIR, { recursive: true });

function log(m) {
  console.log(`[extraer_nav] ${m}`);
}

async function main() {
  const { chromium } = await import("/Users/rol.travel/.gemini/antigravity/scratch/keyframes/node_modules/playwright/index.mjs");
  const chromeBin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

  log(`Lanzando Playwright con executablePath=${chromeBin}...`);
  const browser = await chromium.launch({
    executablePath: chromeBin,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--use-mock-keychain",
      "--password-store=basic",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 1020 },
    deviceScaleFactor: 2,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  });

  const page = await context.newPage();
  const mp4Set = new Set();
  const jsonBodies = [];

  page.on("response", async (res) => {
    try {
      const u = res.url();
      const ct = (res.headers()["content-type"] || "").toLowerCase();
      if (u.includes(".mp4") || ct.includes("video/mp4") || ct.includes("audio/mp4")) {
        mp4Set.add(u);
      }
      if (ct.includes("json") || u.includes("graphql") || u.includes("api/v1/")) {
        const t = await res.text();
        if (t.includes(SHORTCODE) || t.includes("video_versions") || t.includes("video_url") || t.includes("dash_manifest")) {
          jsonBodies.push({ url: u, body: t });
        }
      }
    } catch {}
  });

  for (const [etiqueta, url] of [
    ["embed", `https://www.instagram.com/p/${SHORTCODE}/embed/captioned/`],
    ["post", TARGET_URL],
  ]) {
    log(`Abriendo ${etiqueta}: ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 }).catch((e) => log(`goto ${etiqueta} aviso: ${e.message}`));
    await page.waitForTimeout(4500);

    await page.screenshot({ path: join(OUT_DIR, `pw_${etiqueta}.png`) });
    const texto = await page.evaluate(() => document.body?.innerText || "");
    writeFileSync(join(OUT_DIR, `pw_${etiqueta}_texto.txt`), texto);
    const html = await page.content();
    writeFileSync(join(OUT_DIR, `pw_${etiqueta}.html`), html);

    // Hacer clic en el reproductor / botón de play si existe
    try {
      await page.evaluate(() => {
        for (const sel of [".EmbedVideo", ".WatchOnInstagram", "video", "button", "[role='button']", "a.ebV"]) {
          const el = document.querySelector(sel);
          if (el) el.click();
        }
        const v = document.querySelector("video");
        if (v) v.play().catch(() => {});
      });
      await page.waitForTimeout(3500);
      await page.screenshot({ path: join(OUT_DIR, `pw_${etiqueta}_play.png`) });
    } catch {}

    const perfUrls = await page.evaluate(() =>
      performance
        .getEntriesByType("resource")
        .map((r) => r.name)
        .filter((n) => n.includes(".mp4"))
    );
    for (const u of perfUrls) mp4Set.add(u);

    const htmlAfter = await page.content();
    const des = htmlAfter.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\u0026/g, "&").replace(/\\\//g, "/");
    for (const re of [/"video_url"\s*:\s*"(https:[^"]+)"/g, /"base_url"\s*:\s*"(https:[^"]+\.mp4[^"]*)"/g, /src="(https:[^"]+\.mp4[^"]*)"/g]) {
      let m;
      while ((m = re.exec(des)) !== null) {
        mp4Set.add(m[1]);
      }
    }

    const videoInfo = await page.evaluate(() => {
      const v = document.querySelector("video");
      if (!v) return null;
      return { duration: v.duration, width: v.videoWidth, height: v.videoHeight, src: v.currentSrc || v.src };
    });
    log(`Video en ${etiqueta}: ${JSON.stringify(videoInfo)}`);
    if (videoInfo && videoInfo.src && videoInfo.src.startsWith("http")) {
      mp4Set.add(videoInfo.src);
    }

    if (videoInfo && videoInfo.width > 0) {
      const dur = Number.isFinite(videoInfo.duration) && videoInfo.duration > 0 ? Math.min(30, videoInfo.duration) : 20;
      const puntos = [0, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 6.0, 8.0, 10.0, 12.0, 14.0, 16.0, 18.0, 20.0].filter((x) => x <= dur);
      for (const t of puntos) {
        await page.evaluate(async (sec) => {
          const v = document.querySelector("video");
          if (!v) return;
          v.pause();
          v.currentTime = sec;
          await new Promise((r) => {
            const fn = () => {
              v.removeEventListener("seeked", fn);
              r();
            };
            v.addEventListener("seeked", fn);
            setTimeout(r, 400);
          });
        }, t);
        await page.waitForTimeout(100);
        const el = await page.$("video");
        if (el) {
          await el.screenshot({ path: join(FRAMES_DIR, `vid_${etiqueta}_${String(t).padStart(4, "0").replace(".", "_")}.jpg`), type: "jpeg", quality: 90 });
        }
      }
    }
  }

  await browser.close();

  log(`Total URLs MP4 recolectadas: ${mp4Set.size}, jsonBodies: ${jsonBodies.length}`);
  if (jsonBodies.length > 0) {
    writeFileSync(join(OUT_DIR, "json_bodies.json"), JSON.stringify(jsonBodies, null, 2));
    for (const jb of jsonBodies) {
      const des = jb.body.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\u0026/g, "&").replace(/\\\//g, "/");
      for (const re of [/"video_url"\s*:\s*"(https:[^"]+)"/g, /"base_url"\s*:\s*"(https:[^"]+\.mp4[^"]*)"/g, /"url"\s*:\s*"(https:[^"]+\.mp4[^"]*)"/g]) {
        let m;
        while ((m = re.exec(des)) !== null) {
          mp4Set.add(m[1]);
        }
      }
    }
  }

  // Descargar todos los MP4 únicos quitando bytestart/byteend
  const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
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
    const dest = join(OUT_DIR, `dl_${idx++}.mp4`);
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
      log(`Descargado ${dest}: ${buf.length}B (V=${tieneV} ${vs ? vs.width + "x" + vs.height : ""}, A=${tieneA}, dur=${streams[0]?.duration}s)`);
    } catch (e) {
      log(`Aviso dl_${idx - 1}: ${e.message}`);
    }
  }

  const mejorV = descargados.filter((d) => d.tieneV).sort((a, b) => (b.tieneA ? 1 : 0) - (a.tieneA ? 1 : 0) || b.width * b.height - a.width * a.height || b.bytes - a.bytes)[0];
  const mejorA = descargados.filter((d) => d.tieneA).sort((a, b) => b.bytes - a.bytes)[0];
  const finalMp4 = join(OUT_DIR, "original.mp4");
  const finalWav = join(OUT_DIR, "original.wav");

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
    log(`original.mp4 consolidado.`);
    if (mejorV.tieneA || mejorA) {
      execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-i", finalMp4, "-vn", "-ac", "1", "-ar", "16000", finalWav], {
        env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR },
      });
      log(`original.wav extraído.`);
    }
    execFileSync(FFMPEG, ["-hide_banner", "-loglevel", "error", "-y", "-i", finalMp4, "-vf", "fps=2,scale=540:-1", "-q:v", "2", join(FRAMES_DIR, "frame_%03d.jpg")], {
      env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR },
    });
    log(`Fotogramas 2fps extraídos en ${FRAMES_DIR}`);
  }
}

await main();

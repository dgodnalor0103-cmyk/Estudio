#!/usr/bin/env node
// Demonio único permanente:
// 1) Sirve el visor comparativo en http://127.0.0.1:8900/
// 2) Vigila .cola/peticion.json para ejecutar voz.mjs (ElevenLabs v4) o scripts de red sin volver a pedir permisos.

import { spawnSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, resolve } from "node:path";

const PORT = 8900;
const ROOT = "/Users/rol.travel/.gemini/antigravity/scratch/pruebas-cuentas-instagram";
const COLA_DIR = join(ROOT, ".cola");
const FFMPEG_DIR = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/node_modules/@remotion/compositor-darwin-arm64";

process.env.PATH = `${FFMPEG_DIR}:/usr/local/bin:/opt/homebrew/bin:${process.env.PATH || "/usr/bin:/bin"}`;
process.env.DYLD_LIBRARY_PATH = FFMPEG_DIR;

mkdirSync(COLA_DIR, { recursive: true });

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wav": "audio/wav",
};

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  const relPath = url.pathname === "/" || url.pathname === "/index.html" ? "/comparador.html" : decodeURIComponent(url.pathname);
  const safePath = resolve(ROOT, "." + relPath);

  if (!safePath.startsWith(ROOT) || !existsSync(safePath) || statSync(safePath).isDirectory()) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const stat = statSync(safePath);
  const ext = extname(safePath).toLowerCase();
  const contentType = MIME[ext] || "application/octet-stream";

  if (req.headers.range && ext === ".mp4") {
    const parts = req.headers.range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": contentType,
    });
    createReadStream(safePath, { start, end }).pipe(res);
    return;
  }

  res.writeHead(200, {
    "Content-Length": stat.size,
    "Content-Type": contentType,
    "Accept-Ranges": "bytes",
  });
  createReadStream(safePath).pipe(res);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Visor y puente activos en http://127.0.0.1:${PORT}/`);
});

const reqFile = join(COLA_DIR, "peticion.json");
const resFile = join(COLA_DIR, "resultado.json");

setInterval(() => {
  if (!existsSync(reqFile)) return;
  let req;
  try {
    req = JSON.parse(readFileSync(reqFile, "utf8"));
    rmSync(reqFile, { force: true });
  } catch {
    return;
  }
  console.log(`[puente] Procesando petición: ${req.id || req.accion}`);
  try {
    if (req.accion === "voz") {
      const args = ["/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/motor/voz.mjs", req.proyecto];
      if (req.rehacer) args.push("--rehacer");
      const r = spawnSync("/usr/local/bin/node", args, {
        cwd: "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM",
        env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR },
        encoding: "utf8",
      });
      writeFileSync(
        resFile,
        JSON.stringify({ id: req.id || Date.now(), ok: r.status === 0, status: r.status, stdout: r.stdout || "", stderr: r.stderr || "" }, null, 2)
      );
    } else if (req.accion === "node" && req.script) {
      const r = spawnSync("/usr/local/bin/node", [req.script, ...(req.args || [])], {
        cwd: req.cwd || ROOT,
        env: { ...process.env, DYLD_LIBRARY_PATH: FFMPEG_DIR },
        encoding: "utf8",
      });
      writeFileSync(
        resFile,
        JSON.stringify({ id: req.id || Date.now(), ok: r.status === 0, status: r.status, stdout: r.stdout || "", stderr: r.stderr || "" }, null, 2)
      );
    }
  } catch (e) {
    writeFileSync(resFile, JSON.stringify({ id: req.id || Date.now(), ok: false, error: e.message }, null, 2));
  }
}, 400);

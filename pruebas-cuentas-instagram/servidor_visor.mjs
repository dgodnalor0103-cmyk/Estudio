#!/usr/bin/env node
import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const PORT = 8900;
const ROOT = "/Users/rol.travel/.gemini/antigravity/scratch/pruebas-cuentas-instagram";

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

const HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Análisis @speedy_devv + Video Réplica 60 FPS (ElevenLabs v4)</title>
  <style>
    :root {
      --bg: #080b11;
      --panel: #111622;
      --border: #232c3d;
      --blue: #2f7cf6;
      --amber: #f5b83d;
      --green: #22e39b;
      --text: #f3f6fc;
      --muted: #8b95a7;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: var(--bg);
      color: var(--text);
      line-height: 1.55;
      padding: 32px 24px 64px;
    }
    .wrap { max-width: 1280px; margin: 0 auto; }
    header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border);
      margin-bottom: 28px;
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 700;
      background: rgba(47, 124, 246, 0.18);
      border: 1px solid var(--blue);
      color: #8bb8ff;
    }
    h1 { margin: 8px 0 4px; font-size: 28px; }
    .sub { color: var(--muted); margin: 0; font-size: 15px; }
    .hero {
      display: grid;
      grid-template-columns: 400px 1fr;
      gap: 28px;
      align-items: start;
      margin-bottom: 40px;
    }
    @media (max-width: 900px) { .hero { grid-template-columns: 1fr; } }
    .player-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 16px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    video {
      width: 100%;
      aspect-ratio: 9 / 16;
      border-radius: 14px;
      background: #000;
      display: block;
    }
    .btn-row {
      display: flex;
      gap: 10px;
      margin-top: 12px;
    }
    .btn {
      flex: 1;
      text-align: center;
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 14px;
      text-decoration: none;
      color: #fff;
      background: var(--blue);
    }
    .btn.sec {
      background: #1c2436;
      border: 1px solid var(--border);
    }
    .analysis-card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 24px 28px;
    }
    h2 { margin-top: 0; color: var(--amber); font-size: 21px; }
    h3 { color: #9ec3ff; margin-top: 20px; margin-bottom: 8px; font-size: 17px; }
    ul { padding-left: 20px; margin: 8px 0; }
    li { margin-bottom: 6px; }
    code {
      background: rgba(255,255,255,0.08);
      padding: 2px 6px;
      border-radius: 5px;
      font-size: 13px;
    }
    .grid-title { font-size: 22px; margin: 36px 0 16px; }
    .shots {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 18px;
    }
    .shot {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
    }
    .shot img {
      width: 100%;
      display: block;
    }
    .shot-cap {
      padding: 10px 14px;
      font-size: 13px;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <div>
        <span class="badge">RÉPLICA EXACTA · 1080×1920 @ 60 FPS · ELEVENLABS V4</span>
        <h1>Estudio de Cuenta Viral: <code>@speedy_devv</code></h1>
        <p class="sub">Análisis de ingeniería visual, subtítulos con selección vectorial, corte capacitivo Na+/Cl-, zonas invisibles y timeline 60 fps.</p>
      </div>
    </header>

    <div class="hero">
      <div class="player-card">
        <video controls autoplay loop playsinline poster="/salida/prueba-speedy-devv-20s/cover.jpg" src="/salida/prueba-speedy-devv-20s/prueba-speedy-devv-20s.mp4"></video>
        <div class="btn-row">
          <a class="btn" href="/salida/prueba-speedy-devv-20s/prueba-speedy-devv-20s.mp4" target="_blank">Abrir MP4 Directo</a>
          <a class="btn sec" href="/salida/prueba-speedy-devv-20s/cover.jpg" target="_blank">Ver Cover JPG</a>
        </div>
      </div>

      <div class="analysis-card">
        <h2>ADN Visual y Narrativo de <code>@speedy_devv</code> (195K seg · Reels de 18.2M y 10.6M)</h2>
        <h3>1. Gancho Físico desde el Fotograma 0 (0–4 s)</h3>
        <ul>
          <li>Pregunta o paradoja cotidiana sobre un objeto que todos tocan a diario (pantalla táctil, teclado de iPhone, batería de MacBook, pagos en Stripe).</li>
          <li>Corte transversal (<em>Magnified illustration</em>) con materiales 3D (cristal templado, electrodos ITO, arcos de campo eléctrico dorados <code>#FFD25A</code>, subpíxeles OLED RGB y lecturas en vivo en <code>JetBrains Mono</code>).</li>
        </ul>
        <h3>2. Subtítulos Superiores con Selección Vectorial Azul (<code>#2F7CF6</code>)</h3>
        <ul>
          <li>Tipografía <code>Figtree Bold</code> arriba (<code>y: 318–450</code>), bloques cortos de 4–6 palabras con entrada desenfocada (<code>blur(8px) → 0px</code>) sincronizada a los timestamps de ElevenLabs.</li>
          <li>Palabra activa en blanco negrita (<code>#FFFFFF</code>), palabras ya pronunciadas en gris (<code>#7B818A</code>), y la palabra clave enmarcada por el recuadro azul de editor con dos tiradores circulares en las esquinas.</li>
        </ul>
        <h3>3. Comparación Dividida (<em>what you see</em> vs. <em>what you touch</em>) + Capas Isométricas</h3>
        <ul>
          <li>Pila isométrica 3D explicando la arquitectura oculta (<code>Touch Grid</code>, <code>Neural Engine</code>, <code>Hitbox Resizer</code>) con punteros ortogonales blancos terminados en punto (<code>───•</code>).</li>
          <li>Contraste directo entre la interfaz uniforme que ve el usuario y las zonas invisibles color ámbar (<code>#F5B83D</code>) que se expanden dinámicamente en tiempo real.</li>
        </ul>
        <h3>4. Avatar 2.5D + Línea de Tiempo de Ingeniería a 60 FPS</h3>
        <ul>
          <li>Avatar ilustrado de camiseta roja y gafas deportivas tornasoladas (verde-cian-naranja) en la esquina inferior derecha mirando hacia arriba al diagrama.</li>
          <li>Demostración de precisión con retícula táctil (<code>+</code>) y línea de tiempo técnica (<code>VOICE</code> + <code>WORDS</code> + <code>60 FRAMES PER SECOND</code>).</li>
        </ul>
      </div>
    </div>

    <h2 class="grid-title">Fotogramas en Alta Resolución del Video Producido (<code>1080×1920</code>)</h2>
    <div class="shots">
      <div class="shot">
        <img src="/proyecto-speedy-20s/revisar/en-6.5.jpg" alt="Plano 1: Corte Capacitivo e Iones Na+/Cl-" />
        <div class="shot-cap"><strong>Segundo 6.50 (Plano 1):</strong> Corte transversal capacitivo, iones <code>Na+</code>/<code>Cl-</code>, arcos dorados y caída de capacitancia <code>100 → 58</code>.</div>
      </div>
      <div class="shot">
        <img src="/proyecto-speedy-20s/revisar/en-12.8.jpg" alt="Plano 2: Capas Isométricas y What you see vs What you touch" />
        <div class="shot-cap"><strong>Segundo 12.80 (Plano 2):</strong> Pila isométrica 3D + comparación dividida <em>what you see</em> vs. <em>what you touch</em> + Avatar <code>@speedy_devv</code>.</div>
      </div>
      <div class="shot">
        <img src="/proyecto-speedy-20s/revisar/en-17.8.jpg" alt="Plano 3: Hitbox Invisible + Timeline 60 FPS" />
        <div class="shot-cap"><strong>Segundo 17.80 (Plano 3):</strong> Retícula táctil capturada por hitbox expandida <code>[A]</code> + Timeline <code>60 FRAMES PER SECOND</code>.</div>
      </div>
    </div>

    <h2 class="grid-title">Capturas Reales Extraídas de <code>@speedy_devv</code> en Instagram</h2>
    <div class="shots">
      <div class="shot"><img src="/analisis/02_reels_speedy_devv.png" /><div class="shot-cap">Reels fijados: 3.2M, 10.6M y 18.2M vistas</div></div>
      <div class="shot"><img src="/analisis/03_reel_18M_f1.png" /><div class="shot-cap">Reel 18.2M (0.5 s): Dedo + arcos dorados + RGB + 100 100 100</div></div>
      <div class="shot"><img src="/analisis/04_reel_18M_f2.png" /><div class="shot-cap">Reel 18.2M (5.5 s): Dedo conductor vs. bolígrafo aislante</div></div>
      <div class="shot"><img src="/analisis/06_reel_stripe_f1.png" /><div class="shot-cap">Reel Stripe (2.5 s): Pila isométrica 3D de 6 capas</div></div>
      <div class="shot"><img src="/analisis/08_reel_10M_keyboard.png" /><div class="shot-cap">Reel 10.6M (4.5 s): Retícula táctil '+' y Avatar abajo</div></div>
      <div class="shot"><img src="/analisis/09_reel_10M_keyboard_f2.png" /><div class="shot-cap">Reel 10.6M (12.0 s): "what you see" vs "what you touch"</div></div>
      <div class="shot"><img src="/analisis/11_reel_system_f2.png" /><div class="shot-cap">Reel Sistema (16.0 s): Pistas FRAMES, VOICE, WORDS a 60 FPS</div></div>
    </div>
  </div>
</body>
</html>`;

createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  if (url.pathname === "/" || url.pathname === "/index.html") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(HTML);
    return;
  }

  const safePath = resolve(ROOT, "." + decodeURIComponent(url.pathname));
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
  console.log(`Visor activo en http://127.0.0.1:${PORT}/`);
});

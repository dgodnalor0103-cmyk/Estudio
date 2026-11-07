import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const PORT = 8899;
const ATOM_OUT = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/ATOM/salida";

const EPISODES = [
  {
    id: "var1",
    badge: "🔥 VARIACIÓN VIRAL 1 · BASADO EN EL HIT DE 15.7K + 4.1K VISTAS",
    title: "Cuando apagas el WiFi en la barra rápida sigue encendido (Nuevo Hook + Insignia Esmeralda)",
    slug: "2026-11-06-var1-wifi-sigue-encendido",
    fbUrl: "https://www.tiktok.com/@purapruebaoficial/video/7704101909761756436",
    isVar: true,
  },
  {
    id: "var2",
    badge: "🔥 VARIACIÓN VIRAL 2 · BASADO EN EL HIT DE 12.7K + 1.8K VISTAS",
    title: "Tu cargador rápido no daña el celular, pero un cable barato lo quema a 92 °C (Nuevo Hook + Alerta Térmica)",
    slug: "2026-11-06-var2-cable-barato-alerta",
    fbUrl: "https://www.tiktok.com/@purapruebaoficial/video/7704104496137374996",
    isVar: true,
  },
  {
    id: "var3",
    badge: "🔥 VARIACIÓN VIRAL 3 · ÁNGULO 05:00 AM / BOTÓN BLANCO (HIT 15.7K)",
    title: "El secreto del botón blanco de WiFi y por qué despierta solo a las 05:00 AM",
    slug: "2026-11-06-var3-wifi-cinco-manana",
    fbUrl: "https://www.tiktok.com/@purapruebaoficial/video/7704101909761756436",
    isVar: true,
  },
  {
    id: "ep1",
    badge: "🏆 VIRAL #1 · 15.7K + 4.1K TIKTOK · 1.6K IG · 1.3K FB (22.7K TOTAL)",
    title: "EP. 1 · Apagar el WiFi en la barra rápida NO apaga la antena",
    slug: "2026-10-31-ep1-wifi-barra-rapida",
    fbUrl: "https://www.tiktok.com/@purapruebaoficial/video/7704101909761756436",
  },
  {
    id: "ep2",
    badge: "🏆 VIRAL #2 · 12.7K + 1.8K TIKTOK · 1.3K IG · 636 FB (16.4K TOTAL)",
    title: "EP. 2 · Cable barato de $3 y el chip Tristar / PMIC",
    slug: "2026-10-31-ep2-cable-barato",
    fbUrl: "https://www.facebook.com/reel/1543813437793265",
  },
  {
    id: "ep3",
    badge: "EP. 3 · PUBLICADO (1,196 VISTAS TIKTOK · 336 FB)",
    title: "EP. 3 · Fotos borradas: qué pasa en la memoria Flash NAND",
    slug: "2026-10-31-ep3-fotos-borradas",
    fbUrl: "https://www.facebook.com/reel/944315581882005",
  },
  {
    id: "ep4",
    badge: "EP. 4 · PUBLICADO (1,619 VISTAS TIKTOK · 383 FB)",
    title: "EP. 4 · El mito de las cámaras de 200 Megapíxeles",
    slug: "2026-10-31-ep4-camara-200mp",
    fbUrl: "https://www.facebook.com/reel/1014213628376742",
  },
  {
    id: "ep5",
    badge: "EP. 5 · PUBLICADO (1,061 VISTAS TIKTOK · 312 FB)",
    title: "EP. 5 · Modo Avión y el chip GPS pasivo de tu celular",
    slug: "2026-11-04-ep5-modo-avion-rastreo",
    fbUrl: "https://www.facebook.com/reel/1625040069097276",
  },
  {
    id: "ep6",
    badge: "EP. 6 · PUBLICADO EN FACEBOOK REELS",
    title: "EP. 6 · Por qué la «RAM Virtual» vuelve más lento tu celular",
    slug: "2026-11-04-ep6-ram-virtual-lento",
    fbUrl: "https://www.facebook.com/reel/1625324705986979",
  },
  {
    id: "ep7",
    badge: "EP. 7 · PUBLICADO EN FACEBOOK REELS",
    title: "EP. 7 · Protector de cristal sobre los lentes de la cámara",
    slug: "2026-11-04-ep7-protector-camara-fotos",
    fbUrl: "https://www.facebook.com/reel/1134610625624770",
  },
  {
    id: "ep8",
    badge: "EP. 8 · PUBLICADO EN FACEBOOK REELS",
    title: "EP. 8 · Puertos USB públicos y los pines de datos D+ / D-",
    slug: "2026-11-04-ep8-usb-publico-datos",
    fbUrl: "https://www.facebook.com/reel/2261934824668260",
  },
];

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

  if (url.pathname.startsWith("/media/")) {
    const parts = url.pathname.replace("/media/", "").split("/");
    const slug = parts[0];
    const file = parts[1];
    const ep = EPISODES.find((e) => e.slug === slug);
    if (!ep) {
      res.writeHead(404);
      return res.end("Not found");
    }
    let filePath = path.join(ATOM_OUT, ep.slug, file === "video.mp4" ? `${ep.slug}.mp4` : "cover.jpg");
    if (!fs.existsSync(filePath) && file !== "video.mp4") {
      filePath = path.join(ATOM_OUT, ep.slug, "portada.jpg");
    }
    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      return res.end("File not found");
    }
    const stat = fs.statSync(filePath);
    const contentType = file.endsWith(".mp4") ? "video/mp4" : "image/jpeg";

    const range = req.headers.range;
    if (range && file.endsWith(".mp4")) {
      const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
      const start = parseInt(startStr, 10);
      const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": contentType,
      });
      return fs.createReadStream(filePath, { start, end }).pipe(res);
    }

    res.writeHead(200, {
      "Content-Type": contentType,
      "Content-Length": stat.size,
      "Accept-Ranges": "bytes",
    });
    return fs.createReadStream(filePath).pipe(res);
  }

  const cardsHtml = EPISODES.map((ep) => {
    const badgeClass = ep.isVar ? "var" : "pub";
    return `
      <div class="card ${ep.isVar ? "card-var" : ""}">
        <div class="head">
          <span class="badge ${badgeClass}">${ep.badge}</span>
          <h3>${ep.title}</h3>
          <div class="links">
            <a href="/media/${ep.slug}/video.mp4" target="_blank">▶ Abrir MP4 pantalla completa</a>
            · <a href="${ep.fbUrl}" target="_blank">Ver video original en redes ↗</a>
          </div>
        </div>
        <video controls preload="metadata" playsinline poster="/media/${ep.slug}/cover.jpg" src="/media/${ep.slug}/video.mp4"></video>
      </div>
    `;
  }).join("\n");

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>PuraPrueba · Variaciones Virales y Galería en Mac (ATOM 60 fps)</title>
<style>
  body { margin: 0; padding: 24px; background: #090d16; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  h1 { margin: 0 0 6px 0; font-size: 22px; color: #38bdf8; }
  p.sub { margin: 0 0 20px 0; font-size: 14px; color: #94a3b8; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 18px; }
  .card { background: #111827; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden; display: flex; flex-direction: column; }
  .card-var { border: 2px solid #f59e0b; box-shadow: 0 0 24px rgba(245, 158, 11, 0.16); }
  .head { padding: 14px 16px; border-bottom: 1px solid #1e293b; }
  .badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 999px; margin-bottom: 6px; }
  .badge.pub { background: rgba(16, 185, 129, 0.16); color: #34d399; }
  .badge.var { background: rgba(245, 158, 11, 0.22); color: #fbbf24; }
  .card h3 { margin: 0 0 8px 0; font-size: 15px; line-height: 1.35; color: #f8fafc; }
  .links { font-size: 12px; }
  .links a { color: #38bdf8; text-decoration: none; font-weight: 600; }
  .links a:hover { text-decoration: underline; }
  video { width: 100%; aspect-ratio: 9 / 16; background: #000; display: block; }
</style>
</head>
<body>
  <h1>🎬 PuraPrueba · Variaciones Virales (>15K / >12K Vistas) + Galería en tu Mac</h1>
  <p class="sub">Las 3 nuevas variaciones virales aparecen primero con borde dorado, seguidas del catálogo completo en 60 fps.</p>
  <div class="grid">${cardsHtml}</div>
</body>
</html>`;

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Visor local activo en: http://127.0.0.1:${PORT}/`);
});

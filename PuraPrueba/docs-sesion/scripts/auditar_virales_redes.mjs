import fs from "node:fs";

const ENV_PATH = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/.env.local";

function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
  }
  return env;
}

function toBogotaDateStr(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (Number.isNaN(d.getTime())) return "";
  // Restar 5 horas para UTC-5
  const bogota = new Date(d.getTime() - 5 * 3600 * 1000);
  return bogota.toISOString().replace("T", " ").slice(0, 19) + " (-05:00)";
}

async function main() {
  const env = loadEnv(ENV_PATH);

  console.log("=== 1. PUBLICACIONES EN BUFFER (TIKTOK, INSTAGRAM, YOUTUBE) ===");
  const orgRes = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.BUFFER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: `query { account { organizations { id } } }` }),
  });
  const orgJson = await orgRes.json();
  const orgId = orgJson?.data?.account?.organizations?.[0]?.id;

  const pRes = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.BUFFER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query($orgId: OrganizationId!) {
        posts(first: 50, input: { organizationId: $orgId }) {
          edges { node { id status channelService dueAt createdAt text } }
        }
      }`,
      variables: { orgId },
    }),
  });
  const pJson = await pRes.json();
  const edges = pJson?.data?.posts?.edges || [];

  for (const e of edges) {
    const n = e.node;
    const localDue = toBogotaDateStr(n.dueAt || n.createdAt);
    if (localDue.startsWith("2026-11-06") || localDue.startsWith("2026-11-05")) {
      const title = String(n.text || "").split("\n")[0].slice(0, 65);
      console.log(`[${localDue}] [${n.channelService}] status=${n.status} id=${n.id} | "${title}"`);
    }
  }

  console.log("\n=== 2. PUBLICACIONES EN FACEBOOK REELS (META GRAPH API) ===");
  if (env.META_PAGE_ID && env.META_PAGE_ACCESS_TOKEN) {
    for (const ep of ["video_reels", "videos"]) {
      const fbRes = await fetch(
        `https://graph.facebook.com/v21.0/${encodeURIComponent(env.META_PAGE_ID)}/${ep}?fields=id,description,created_time,status&limit=25&access_token=${encodeURIComponent(env.META_PAGE_ACCESS_TOKEN)}`
      );
      const fbJson = await fbRes.json();
      console.log(`Endpoint /${ep}:`);
      for (const item of fbJson?.data || []) {
        const localCreated = toBogotaDateStr(item.created_time);
        if (localCreated.startsWith("2026-11-06") || localCreated.startsWith("2026-11-05")) {
          const desc = String(item.description || "").split("\n")[0].slice(0, 65);
          console.log(`  [${localCreated}] id=${item.id} | "${desc}"`);
        }
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

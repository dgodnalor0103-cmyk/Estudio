import fs from "node:fs";
import path from "node:path";

const envPath = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/.env.local";
const env = {};
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    if (!line || line.startsWith("#") || !line.includes("=")) continue;
    const i = line.indexOf("=");
    env[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^['"]|['"]$/g, "");
  }
}

const apiKey = env.BUFFER_API_KEY;
async function gql(query, variables = {}) {
  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

const orgs = await gql(`query { account { organizations { id name } } }`);
const orgId = orgs.data.account.organizations[0].id;

const postsRes = await gql(
  `query($orgId: OrganizationId!) {
    posts(first: 60, input: { organizationId: $orgId }) {
      edges {
        node {
          id
          status
          channelService
          dueAt
          sentAt
          createdAt
          externalLink
          error { message }
          text
        }
      }
    }
  }`,
  { orgId }
);

const edges = postsRes?.data?.posts?.edges || [];
console.log("=== ELIMINANDO POSTS PROGRAMADOS QUE NO SON DEL NICHO TECNOLOGÍA (POLLO, GASOLINA, AGUA) ===");
for (const e of edges) {
  const n = e.node;
  if (n.status === "scheduled") {
    const t = (n.text || "").toLowerCase();
    if (
      t.includes("lavar el pollo") ||
      t.includes("gasolina premium") ||
      t.includes("beber 2 litros de agua") ||
      t.includes("tronarte los dedos")
    ) {
      const del = await gql(
        `mutation($input: DeletePostInput!) { deletePost(input: $input) { __typename } }`,
        { input: { id: n.id } }
      );
      console.log(`Eliminado de Buffer: ${n.id} (${n.channelService}) -> ${(n.text || "").slice(0, 48)}`);
    }
  }
}

console.log("\n=== AUDITORÍA DETALLADA DE POSTS EN BUFFER ===");
for (const e of edges) {
  const n = e.node;
  const firstLine = (n.text || "").split("\n")[0].slice(0, 58);
  const errStr = n.error ? JSON.stringify(n.error) : "none";
  console.log(
    `[${n.status}] svc=${n.channelService} | dueAt=${n.dueAt} | sentAt=${n.sentAt || "-"} | link=${n.externalLink || "-"} | err=${errStr} | text=${firstLine}`
  );
}

console.log("\n=== ESTADO CREDENCIALES META / OTROS (SIN MOSTRAR CLAVES) ===");
console.log("HAS_META_PAGE_ID:", Boolean(env.META_PAGE_ID));
console.log("HAS_META_PAGE_ACCESS_TOKEN:", Boolean(env.META_PAGE_ACCESS_TOKEN));
console.log("HAS_YOUTUBE_REFRESH_TOKEN:", Boolean(env.YOUTUBE_REFRESH_TOKEN));
console.log("PUBLISH_PROVIDER:", env.PUBLISH_PROVIDER || "(default)");

import fs from "node:fs";
import { execFileSync } from "node:child_process";

const envText = fs.readFileSync("/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/.env.local", "utf8");
const keyMatch = envText.match(/BUFFER_API_KEY\s*=\s*([^\r\n]+)/);
const token = keyMatch ? keyMatch[1].trim().replace(/^["']|["']$/g, "") : "";

async function gql(query, variables = {}) {
  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

const orgData = await gql(`query { account { organizations { id } } }`);
const orgId = orgData?.data?.account?.organizations?.[0]?.id;

const postsData = await gql(`
  query GetPosts($orgId: OrganizationId!) {
    posts(input: { organizationId: $orgId, first: 100 }) {
      edges {
        node {
          id
          status
          dueAt
          text
        }
      }
    }
  }
`, { orgId });

const scheduled = (postsData?.data?.posts?.edges || [])
  .map((e) => e.node)
  .filter((n) => n.status === "scheduled");

console.log(`Limpiando ${scheduled.length} posts programados previos para reprogramar la cola limpia de 6 episodios ATOM...`);
for (const p of scheduled) {
  await gql(`
    mutation DeletePost($id: PostId!) {
      deletePost(input: { id: $id }) {
        ... on PostActionSuccess { post { id } }
        ... on MutationError { message }
      }
    }
  `, { id: p.id });
}

fs.writeFileSync(
  "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/workspace/library/auto-publish/buffer_schedule_queue.json",
  "[]\n"
);

console.log("Programando los 6 episodios de MITOS DE TU CELULAR (EP. 3 a EP. 8)...");
execFileSync(
  "/usr/local/bin/node",
  [
    "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/workspace/library/auto-publish/schedule_3_daily.mjs",
    "--start-date",
    "2026-11-04",
  ],
  {
    cwd: "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba",
    stdio: "inherit",
  }
);

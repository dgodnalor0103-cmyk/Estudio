import fs from "node:fs";

const envText = fs.readFileSync("/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/.env.local", "utf8");
const getVar = (name) => {
  const m = envText.match(new RegExp(`^${name}\\s*=\\s*([^\\r\\n]+)`, "m"));
  return m ? m[1].trim().replace(/^["']|["']$/g, "") : "";
};

const token = getVar("BUFFER_API_KEY");

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

const orgData = await gql(`query { account { organizations { id name } } }`);
const orgId = orgData?.data?.account?.organizations?.[0]?.id;

const chData = await gql(`
  query GetChannels($orgId: OrganizationId!) {
    channels(input: { organizationId: $orgId }) {
      id
      name
      service
    }
  }
`, { orgId });

const channels = chData?.data?.channels || [];

const postsData = await gql(`
  query GetPosts($orgId: OrganizationId!) {
    posts(input: { organizationId: $orgId, first: 100 }) {
      edges {
        node {
          id
          status
          dueAt
          sentAt
          createdAt
          channelService
          externalLink
          error { message }
          text
        }
      }
    }
  }
`, { orgId });

const allPosts = (postsData?.data?.posts?.edges || []).map((e) => e.node);

console.log(`Total posts devueltos por Buffer: ${allPosts.length}`);
for (const c of channels) {
  const svc = String(c.service || "").toLowerCase();
  const cPosts = allPosts.filter((p) => String(p.channelService || "").toLowerCase() === svc);
  const sent = cPosts.filter((p) => p.status === "sent");
  const scheduled = cPosts.filter((p) => p.status === "scheduled");
  const other = cPosts.filter((p) => p.status !== "sent" && p.status !== "scheduled");

  const uniqueTitles = new Map();
  for (const s of sent) {
    const title = (s.text || "").split("\n")[0].slice(0, 68);
    uniqueTitles.set(title, (uniqueTitles.get(title) || 0) + 1);
  }

  console.log(`\n======================================================`);
  console.log(`CANAL: ${c.service.toUpperCase()} (${c.name})`);
  console.log(`======================================================`);
  console.log(`Enviados (sent): ${sent.length} (${uniqueTitles.size} videos únicos)`);
  for (const [t, count] of uniqueTitles.entries()) {
    console.log(`  ✓ [${count}x] ${t}`);
  }
  console.log(`Programados (scheduled): ${scheduled.length}`);
  for (const sc of scheduled) {
    console.log(`  ⏳ [due=${sc.dueAt}] ${(sc.text || "").split("\n")[0].slice(0, 68)}`);
  }
  if (other.length > 0) {
    console.log(`Otros / Errores (${other.length}):`);
    for (const o of other) {
      console.log(`  ❌ [${o.status} · due=${o.dueAt} · err=${JSON.stringify(o.error)}] ${(o.text || "").split("\n")[0].slice(0, 68)}`);
    }
  }
}

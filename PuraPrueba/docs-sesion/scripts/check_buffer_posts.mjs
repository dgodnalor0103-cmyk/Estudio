#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ENV_PATH = "/Users/rol.travel/.gemini/antigravity/scratch/Estudio/PuraPrueba/.env.local";
const env = {};
if (fs.existsSync(ENV_PATH)) {
  for (const line of fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/)) {
    const idx = line.indexOf("=");
    if (idx > 0 && !line.trim().startsWith("#")) {
      env[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^['"]|['"]$/g, "");
    }
  }
}

const apiKey = env.BUFFER_API_KEY;

async function gql(query, variables = {}) {
  const res = await fetch("https://api.buffer.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  return await res.json();
}

const orgData = await gql(`query { account { organizations { id name } } }`);
const orgId = env.BUFFER_ORG_ID || orgData?.data?.account?.organizations?.[0]?.id;
console.log("ORG ID:", orgId);

// 1. Inspect Query.posts schema
const schemaRes = await gql(`
  query {
    __type(name: "Query") {
      fields {
        name
        args { name type { kind name ofType { kind name } } }
      }
    }
    postType: __type(name: "Post") {
      fields { name }
    }
    postsInput: __type(name: "PostsInput") {
      inputFields { name type { kind name ofType { kind name } } }
    }
  }
`);
console.log("=== SCHEMA QUERY FIELDS ===");
const queryFields = schemaRes?.data?.__type?.fields || [];
console.log(JSON.stringify(queryFields.filter((f) => /post|channel/i.test(f.name)), null, 2));
console.log("=== POST FIELDS ===");
console.log(JSON.stringify((schemaRes?.data?.postType?.fields || []).map((f) => f.name)));
console.log("=== POSTS INPUT ===");
console.log(JSON.stringify(schemaRes?.data?.postsInput?.inputFields || [], null, 2));

// 2. Fetch channels and posts
const chRes = await gql(
  `query($orgId: OrganizationId!) {
    channels(input: { organizationId: $orgId }) {
      id name service
    }
  }`,
  { orgId },
);
console.log("=== CHANNELS ===");
console.log(JSON.stringify(chRes?.data?.channels || chRes, null, 2));

const postsRes = await gql(
  `query($orgId: OrganizationId!) {
    posts(first: 50, input: { organizationId: $orgId }) {
      edges {
        node {
          id
          status
          dueAt
          createdAt
          text
          channelId
          channelService
        }
      }
    }
  }`,
  { orgId },
);
console.log("=== POSTS ===");
if (postsRes.errors) {
  console.log("POSTS ERROR:", JSON.stringify(postsRes.errors, null, 2));
} else {
  const edges = postsRes?.data?.posts?.edges || [];
  for (const e of edges) {
    const n = e.node;
    console.log(
      `[${n.status}] id=${n.id} | svc=${n.channelService} | ch=${n.channelId} | dueAt=${n.dueAt} | created=${n.createdAt} | text=${(n.text || "").slice(0, 55).replace(/\n/g, " ")}`,
    );
  }
}

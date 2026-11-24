import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const publicRoot = new URL("public/", root);

async function checkSyntax(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const url = new URL(entry.name, directory);
    if (entry.isDirectory()) await checkSyntax(new URL(`${entry.name}/`, directory));
    else if (entry.name.endsWith(".mjs")) execFileSync(process.execPath, ["--check", fileURLToPath(url)], { stdio: "pipe" });
  }
}

await checkSyntax(publicRoot);
const store = await mkdtemp(join(tmpdir(), "runbook-module-check-"));
const server = spawn(process.execPath, ["server.mjs"], {
  cwd: fileURLToPath(root),
  env: { ...process.env, RUNBOOK_DATA_DIR: store, RUNBOOK_PORT: "0" },
  stdio: ["ignore", "pipe", "pipe"]
});
const stopped = new Promise((resolve) => {
  server.once("exit", resolve);
  server.once("error", resolve);
});
let output = "";
server.stderr.on("data", (chunk) => { output += chunk; });

try {
  let timer;
  const origin = await new Promise((resolve, reject) => {
    timer = setTimeout(() => reject(new Error(`Local test server did not start. ${output}`)), 10_000);
    server.once("error", reject);
    server.once("exit", (code) => reject(new Error(`Local test server exited (${code}). ${output}`)));
    server.stdout.on("data", (chunk) => {
      output += chunk;
      const address = output.match(/Local: (http:\/\/127\.0\.0\.1:\d+)/);
      if (address) resolve(address[1]);
    });
  }).finally(() => clearTimeout(timer));

  const visited = new Set();
  async function checkModule(url) {
    if (visited.has(url.href)) return;
    visited.add(url.href);
    assert.equal(url.origin, origin, "Browser imports must stay local.");
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 200, `Module not served: ${url.pathname}`);
    assert.match(response.headers.get("content-type"), /^text\/javascript\b/, `Wrong module MIME: ${url.pathname}`);
    const source = await response.text();
    // Native static imports, including multiline import lists and side-effect imports.
    for (const match of source.matchAll(/^import\s+(?:[^;]*?\sfrom\s*)?["']([^"']+)["']/gm)) {
      assert.ok(match[1].startsWith("."), `Use relative module imports: ${match[1]}`);
      await checkModule(new URL(match[1], url));
    }
    // Linking feature modules catches missing named exports without starting the UI.
    if (url.pathname !== "/app.mjs") await import(new URL(`.${url.pathname}`, publicRoot));
  }

  await checkModule(new URL("/app.mjs", origin));
  const cursed = await fetch(new URL("/cursed", origin), { signal: AbortSignal.timeout(5000) });
  assert.equal(cursed.status, 200, "The Cursed checklist must open directly.");
  assert.match(cursed.headers.get("content-type"), /^text\/html\b/);
  assert.match(await cursed.text(), /<h1>Cursed ending<\/h1>/);
  console.log(`Verified ${visited.size} browser modules: syntax, linked imports, local HTTP URLs and JavaScript content types.`);
} finally {
  server.kill();
  await stopped;
  await rm(store, { recursive: true, force: true });
}

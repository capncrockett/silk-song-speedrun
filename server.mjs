import { createServer } from "node:http";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { validateRunData } from "./dist/model.mjs";

const root = fileURLToPath(new URL(".", import.meta.url));
const store = resolve(process.env.RUNBOOK_DATA_DIR || join(root, ".runbook"));
const runsFile = join(store, "runs.json");
const routeFile = join(root, "data", "route.json");
const seedFile = join(root, "data", "seed-runs.json");
const port = Number(process.env.RUNBOOK_PORT ?? 4173);
const maxBody = 1_000_000;

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("RUNBOOK_PORT must be a valid port number.");
}

const files = new Map([
  ["/", ["dist/index.html", "text/html; charset=utf-8"]],
  ["/index.html", ["dist/index.html", "text/html; charset=utf-8"]],
  ["/styles.css", ["dist/styles.css", "text/css; charset=utf-8"]],
  ["/app.mjs", ["dist/app.mjs", "text/javascript; charset=utf-8"]],
  ["/model.mjs", ["dist/model.mjs", "text/javascript; charset=utf-8"]],
  ["/assets/hornet-mask.png", ["hornet-mask-icon.png", "image/png"]],
  ["/assets/hornet.png", ["hornet.png", "image/png"]],
  ["/maps/overview.png", ["Recovered Garmond Maps/Complete Route Overview.png", "image/png"]],
  ["/maps/cauldron.jpg", ["Recovered Garmond Maps/Cauldron and Whispering Vaults.jpg", "image/jpeg"]],
  ["/maps/high-halls.jpg", ["Recovered Garmond Maps/High Halls.jpg", "image/jpeg"]],
  ["/docs/handoff.md", ["HANDOFF.md", "text/plain; charset=utf-8"]],
  ["/docs/run-2.md", ["Silksong - Current Run Tracker.md", "text/plain; charset=utf-8"]],
  ["/docs/map-credits.md", ["Recovered Garmond Maps/README.md", "text/plain; charset=utf-8"]],
  ["/docs/spools.md", ["Silksong - Spool Fragment Candidates.md", "text/plain; charset=utf-8"]]
]);

function respond(res, status, type, body) {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'self'"
  });
  res.end(body);
}

function json(res, status, value) {
  respond(res, status, "application/json; charset=utf-8", JSON.stringify(value));
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function readRuns() {
  let data;
  try {
    data = await readJson(runsFile);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    data = await readJson(seedFile);
  }
  validateRunData(data);
  return data;
}

function requestError(status, message) {
  return Object.assign(new Error(message), { status });
}

async function readRequest(req) {
  if (req.headers["content-type"]?.split(";")[0] !== "application/json") {
    throw requestError(415, "Expected JSON run data.");
  }
  if (Number(req.headers["content-length"]) > maxBody) {
    throw requestError(413, "Run data is too large to save.");
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBody) throw requestError(413, "Run data is too large to save.");
    chunks.push(chunk);
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    validateRunData(data);
    return data;
  } catch (error) {
    throw requestError(400, error.message);
  }
}

let writes = Promise.resolve();
function saveRuns(next) {
  const saving = writes.then(async () => {
    const previous = await readRuns();
    if (previous.revision !== next.revision) {
      throw requestError(409, "There is a newer save on disk. Reload the page before saving again.");
    }

    const updated = { ...next, revision: previous.revision + 1 };
    await mkdir(store, { recursive: true });
    const temporary = join(store, `runs-${randomUUID()}.tmp`);
    try {
      await writeFile(temporary, JSON.stringify(updated, null, 2) + "\n", { flag: "wx" });
      await rename(temporary, runsFile);
    } catch (error) {
      await unlink(temporary).catch(() => {});
      throw error;
    }
    return updated;
  });
  writes = saving.catch(() => {});
  return saving;
}

const server = createServer(async (req, res) => {
  try {
    const host = req.headers.host;
    const activePort = server.address().port;
    const hosts = [`127.0.0.1:${activePort}`, `localhost:${activePort}`];
    if (!hosts.includes(host) || (req.headers.origin && req.headers.origin !== `http://${host}`)) {
      throw requestError(403, "Open the tracker from its local address.");
    }

    const path = new URL(req.url, `http://${host}`).pathname;
    if (req.method === "GET" && path === "/api/route") return json(res, 200, await readJson(routeFile));
    if (req.method === "GET" && path === "/api/runs") return json(res, 200, await readRuns());
    if (req.method === "PUT" && path === "/api/runs") {
      return json(res, 200, await saveRuns(await readRequest(req)));
    }

    const file = files.get(path);
    if (req.method !== "GET" || !file) throw requestError(404, "Page not found.");
    respond(res, 200, file[1], await readFile(join(root, file[0])));
  } catch (error) {
    if (!error.status) console.error(error);
    json(res, error.status ?? 500, {
      error: error.status ? error.message : "Could not read or save the local runbook. Check the terminal."
    });
  }
});

server.on("error", (error) => {
  console.error(`Could not start the runbook: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Pharloom Runbook\nLocal: http://127.0.0.1:${server.address().port}\nRun saves: ${runsFile}`);
});

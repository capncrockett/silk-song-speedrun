import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { formatTime, listStops, parseTime, runSummary, shoppingSummary, validateRunData } from "../dist/model.mjs";

const root = new URL("../", import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));
const [route, seed] = await Promise.all([readJson("data/route.json"), readJson("data/seed-runs.json")]);

assert.equal(route.version, 1);
assert.ok(Number.isSafeInteger(route.targetSeconds) && route.targetSeconds > 0, "Route needs a time target.");
const stops = listStops(route);
assert.ok(stops.length > 0, "The route needs checkpoints.");
assert.equal(new Set(stops.map(({ id }) => id)).size, stops.length, "Checkpoint IDs must be unique.");
assert.equal(stops.at(-1).id, route.finishCheckpoint, "The finish must be the last route checkpoint.");
const prep = route.preparations.flatMap((group) => group.items.map(({ id }) => id));
assert.equal(new Set(prep).size, prep.length, "Preparation IDs must be unique.");
for (const pair of route.preparations.filter(({ id }) => id.startsWith("silk-"))) {
  assert.equal(pair.items.length, 2, "A Silk capacity pair needs two fragments.");
}

const activeSpools = route.preparations.filter((group) => group.id.startsWith("silk-"));
assert.equal(activeSpools.length, 3, "The selected route completes three spools.");
assert.deepEqual(activeSpools.flatMap((group) => group.items.map((item) => item.pin)),
  [478080, 478230, 477926, 478263, 478586, 478704], "Keep the selected six fragments in route order.");
assert.ok(route.preparations.some((group) => group.archived && group.items.some((item) => item.id === "spool-core")),
  "Keep the old lower Core pickup ID available to historical records.");

for (const stop of stops) {
  if (!stop.purchases) continue;
  assert.ok(Array.isArray(stop.purchases) && stop.purchases.length > 0);
  for (const item of stop.purchases) {
    assert.ok(typeof item.item === "string" && item.item.trim());
    assert.ok(Number.isSafeInteger(item.rosaries) && item.rosaries >= 0, "Shopping costs must be explicit nonnegative rosary amounts.");
    if (item.conditional !== undefined) assert.ok(typeof item.conditional === "string" && item.conditional.trim());
    if (item.materials !== undefined) assert.ok(typeof item.materials === "string" && item.materials.trim());
  }
}
const mortShopping = shoppingSummary(route, "drifters-cloak");
assert.equal(mortShopping.stop.id, "halfway-home");
assert.equal(mortShopping.minimum, 440, "Mort's purchases plus Greymoor Bellway need 440.");
assert.equal(mortShopping.maximum, 470, "The intact door adds 30.");
assert.equal(shoppingSummary(route, "forge-daughter").minimum, 290);
assert.equal(shoppingSummary(route, "clawline").minimum, 450);
assert.equal(shoppingSummary(route, "vaults-arena").minimum, 0, "The second Needle upgrade needs Pale Oil rather than rosaries.");
assert.equal(shoppingSummary(route, "gms"), null);
assert.equal(shoppingSummary(route, "legacy-far-fields-return"), null, "Historical-only checkpoints have no invented spending reminder.");

validateRunData(seed);
for (const run of seed.runs) {
  assert.ok(run.prep.every((id) => prep.includes(id)), "Seed pickups need matching preparation items.");
  for (const split of run.splits) {
    assert.ok(stops.some(({ id }) => id === split.checkpoint) || split.label, "A historical split needs a label.");
  }
}
try {
  validateRunData(await readJson(".runbook/runs.json"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

assert.deepEqual(parseTime("4:57"), { seconds: 17820, precision: "minute" });
assert.deepEqual(parseTime("4h 57m"), parseTime("4:57"));
assert.deepEqual(parseTime("4:57:32"), { seconds: 17852, precision: "second" });
assert.equal(parseTime("4:60"), null);
assert.equal(parseTime("4:57:60"), null);
assert.equal(formatTime(17820), "4:57");
assert.equal(formatTime(17852, "second"), "4:57:32");
const emptyRun = { splits: [], prep: [] };
assert.equal(runSummary(route, emptyRun).next.id, stops[0].id);
const finishedRun = { ...emptyRun, splits: [{ checkpoint: route.finishCheckpoint, seconds: 18005, precision: "second" }] };
assert.equal(runSummary(route, finishedRun).next, null);
assert.equal(runSummary(route, finishedRun).finish.seconds, 18005);
assert.equal(runSummary(route, emptyRun).underTarget, null, "An unfinished run cannot meet the goal yet.");
for (const [seconds, expected] of [[17999, true], [18000, false], [18001, false]]) {
  const run = { ...emptyRun, mode: "timed", splits: [{ checkpoint: route.finishCheckpoint, seconds, precision: "second" }] };
  assert.equal(runSummary(route, run).underTarget, expected, "Sub-five must be strictly below five hours.");
  assert.equal(runSummary(route, { ...run, mode: "scout" }).underTarget, null, "Practice stays separate from timed results.");
}
const imported = runSummary(route, seed.runs[0]);
assert.equal(imported.latest.seconds, 17820, "Keep the reported 4:57 split.");
assert.equal(imported.latest.precision, "minute");
assert.equal(imported.finish, null, "Run #2 is still in progress.");
assert.equal(imported.next.id, "gms");
assert.ok(seed.runs[0].splits.every((split) => split.label), "Snapshot historical labels before route edits.");

await Promise.all([
  "dist/index.html", "dist/styles.css", "hornet-mask-icon.png", "hornet.png", "HANDOFF.md",
  "Recovered Garmond Maps/Complete Route Overview.png",
  "Recovered Garmond Maps/Cauldron and Whispering Vaults.jpg",
  "Recovered Garmond Maps/High Halls.jpg"
].map((file) => access(new URL(file, root))));

console.log(`Verified ${stops.length} route checkpoints, local assets, run data, split timing, and purchase reminders.`);

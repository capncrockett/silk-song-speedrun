import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { changePickups, formatTime, listGuideStops, listStops, parseTime, pickupCategories, runSummary, shoppingSummary, validateRunData } from "../public/model.mjs";

const root = new URL("../", import.meta.url);
const readJson = async (path) => JSON.parse(await readFile(new URL(path, root), "utf8"));
const [route, seed, catalog, chatArchive] = await Promise.all([readJson("data/route.json"), readJson("data/seed-runs.json"), readJson("assets/maps/catalog.json"), readJson("docs/recovered-chats/manifest.json")]);

assert.equal(route.version, 1);
assert.ok(Number.isSafeInteger(route.targetSeconds) && route.targetSeconds > 0, "Route needs a time target.");
const stops = listStops(route);
assert.ok(stops.length > 0, "The route needs checkpoints.");
assert.equal(new Set(stops.map(({ id }) => id)).size, stops.length, "Checkpoint IDs must be unique.");
assert.equal(stops.at(-1).id, route.finishCheckpoint, "The finish must be the last route checkpoint.");
const guideStops = listGuideStops(route);
assert.equal(stops.length, 31, "Keep all original timing checkpoints.");
assert.equal(guideStops.length, 30, "Halfway Home and Moorwing share one reading page.");
const greymoorGuide = guideStops[4];
assert.equal(greymoorGuide.id, "moorwing", "The combined page records its final checkpoint by default.");
assert.deepEqual(greymoorGuide.checkpointIds, ["halfway-home", "moorwing"]);
assert.equal(guideStops[5].id, "cling-grip", "Next skips the combined member rather than showing it twice.");
assert.deepEqual(greymoorGuide.maps, ["greymoor", "moorwing-aid"]);
assert.equal(greymoorGuide.purchases.reduce((sum, item) => sum + item.rosaries, 0), 60);
assert.equal(greymoorGuide.guide.length,
  stops.find((stop) => stop.id === "halfway-home").guide.length + stops.find((stop) => stop.id === "moorwing").guide.length,
  "Combining pages must retain both parts of the walkthrough.");

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

const categoryIds = new Set((route.pickupCategories ?? []).map((category) => category.id));
assert.equal(categoryIds.size, (route.pickupCategories ?? []).length, "Pickup category IDs must be unique.");
for (const group of route.preparations) {
  if (group.category) assert.ok(categoryIds.has(group.category), "A grouped pickup needs category metadata.");
  for (const item of group.items) {
    assert.ok(item.title && item.detail && Number.isSafeInteger(item.pin), "Every drawer pickup needs a label, directions, and map pin.");
  }
}
assert.equal(route.preparations.find((group) => group.id === "masks").items.length, 8, "The route collects eight mask shards.");
const emptyCategories = pickupCategories(route);
const spoolCategory = emptyCategories.find((category) => category.id === "spools");
assert.equal(spoolCategory.items.length, 6, "All selected fragments share one category.");
assert.equal(spoolCategory.groups.length, 3, "Keep the three Silk pairs inside the category.");
assert.equal(emptyCategories.some((category) => category.archived), false);
const priorPickups = ["spool-greymoor", "spool-core", "unrelated-historical"];
const allSpools = changePickups(priorPickups, spoolCategory.items.map((item) => item.id), true);
assert.deepEqual(priorPickups, ["spool-greymoor", "spool-core", "unrelated-historical"], "Bulk checks must not mutate existing data.");
assert.equal(new Set(allSpools).size, allSpools.length);
assert.ok(pickupCategories(route, allSpools).find((category) => category.id === "spools").isComplete);
assert.ok(pickupCategories(route, allSpools).some((category) => category.archived), "Keep checked historical pickups visible.");
assert.deepEqual(changePickups(allSpools, spoolCategory.items.map((item) => item.id), false), ["spool-core", "unrelated-historical"], "Unchecking a category must preserve other categories and old records.");
const requiredPickups = emptyCategories.filter((category) => !category.optional && !category.archived).flatMap((category) => category.items.map((item) => item.id));
const completed = pickupCategories(route, requiredPickups);
assert.ok(completed.filter((category) => !category.optional && !category.archived).every((category) => category.isComplete));
assert.ok(completed.some((category) => category.optional && !category.isComplete), "Optional pickups do not block required completion.");

for (const stop of stops) {
  assert.ok(Array.isArray(stop.guide) && stop.guide.length >= 2, `Missing walkthrough directions: ${stop.id}`);
  assert.ok(stop.guide.every((text) => typeof text === "string" && text.trim()), "Guide directions must be readable text.");
  if (stop.guideTitle !== undefined) assert.ok(typeof stop.guideTitle === "string" && stop.guideTitle.trim());
  if (stop.optionalDetour) {
    assert.ok(stop.optionalDetour.title && stop.optionalDetour.detail);
    assert.ok(Array.isArray(stop.optionalDetour.steps) && stop.optionalDetour.steps.length > 0);
    assert.ok(stop.optionalDetour.steps.every((text) => typeof text === "string" && text.trim()));
    assert.ok(stop.optionalDetour.links.every((link) => Number.isSafeInteger(link.pin) || link.url));
  }
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
assert.equal(mortShopping.stop.id, "drifters-cloak");
assert.equal(mortShopping.minimum, 410, "Mort's entry, Belt and pouch belong to the Far Fields step.");
assert.equal(mortShopping.maximum, 410, "Greymoor Bellway is a separate purchase on the next step.");
assert.equal(shoppingSummary(route, "forge-daughter").minimum, 340, "Include two 25-rosary Loddie entries before the Forge Daughter purchases.");
assert.equal(shoppingSummary(route, "lace-1").minimum, 340, "Protect the mask shard and Bellway budget.");
assert.equal(shoppingSummary(route, "lace-1").maximum, 340, "The planned pickups cover Craftmetal; the Bone Bottom purchases are the mask shard and Bellway.");
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
assert.equal(imported.finish, null, "The starting import must retain its unfinished 4:57 snapshot.");
assert.equal(imported.next.id, "gms");
assert.ok(seed.runs[0].splits.every((split) => split.label), "Snapshot historical labels before route edits.");

const mapIds = new Set(catalog.images.map((image) => image.id));
assert.equal(mapIds.size, catalog.images.length, "Guide image IDs must be unique.");
assert.equal(new Set(catalog.images.map((image) => image.src)).size, catalog.images.length, "Local image URLs must be unique.");
for (const image of catalog.images) {
  assert.match(image.src, /^\/maps\/[a-z0-9-]+\.(jpg|png)$/, "Guide images need a local image URL.");
  assert.ok(image.file.startsWith("assets/maps/") && !image.file.includes(".."), "Keep guide assets inside their folder.");
  assert.ok(["image/jpeg", "image/png"].includes(image.mime));
  assert.ok(["map", "screenshot"].includes(image.kind) && typeof image.timedRoute === "boolean");
  assert.ok(image.title && image.note && (image.sourceUrl || image.creator), "Keep image labels and credits.");
  assert.ok(Number.isSafeInteger(image.width) && image.width > 0 && Number.isSafeInteger(image.height) && image.height > 0);
  const bytes = await readFile(new URL(image.file, root));
  assert.equal(bytes.length, image.bytes, `${image.file}: byte count changed.`);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), image.sha256, `${image.file}: original image changed.`);
  assert.equal(bytes.subarray(0, image.mime === "image/png" ? 8 : 3).toString("hex"),
    image.mime === "image/png" ? "89504e470d0a1a0a" : "ffd8ff", "Image format must match its MIME type.");
}
for (const section of route.sections) {
  for (const item of [section, ...section.stops]) {
    if (item.maps === undefined) continue;
    assert.ok(Array.isArray(item.maps));
    for (const id of item.maps) {
      assert.ok(mapIds.has(id), `Unknown guide image: ${id}`);
      assert.ok(catalog.images.find((image) => image.id === id).timedRoute, "Keep alternate-route screenshots out of timed checkpoints.");
    }
  }
}

const guideSections = route.guideSections ?? [];
assert.ok(guideSections.length > 0, "Retain the original guide sections and map keys.");
assert.equal(new Set(guideSections.map(({ id }) => id)).size, guideSections.length, "Guide section IDs must be unique.");
for (const section of guideSections) {
  assert.ok(section.title && Array.isArray(section.checkpoints) && section.checkpoints.length > 0 && Array.isArray(section.detours));
  assert.ok([...section.checkpoints, ...section.detours].every((item) => typeof item === "string" && item.trim()));
  assert.ok(Array.isArray(section.maps) && section.maps.length > 0 && Array.isArray(section.steps) && section.steps.length > 0);
  for (const id of section.maps) assert.ok(mapIds.has(id), "Guide sections need known reference images.");
  for (const id of section.steps) assert.ok(stops.some((stop) => stop.id === id), "Guide sections need known route checkpoints.");
}
const guideNumbers = [...new Set(guideSections.map((section) => section.guideNumber))].sort((a, b) => a - b);
assert.deepEqual(guideNumbers, Array.from({ length: 13 }, (_, index) => index + 1),
  "Keep the original guide's 13 travel sections represented.");
assert.equal(new Set(route.sections.map((section) => section.id)).size, route.sections.length,
  "Navigation groups need unique IDs, including return visits.");
for (const section of route.sections) {
  const reference = guideSections.find((item) => item.id === section.guideSection);
  assert.ok(reference, "Every navigation group needs its original guide section.");
  assert.equal(section.title, reference.title, "Use the full original guide title in navigation.");
  assert.equal(section.guideNumber, reference.guideNumber, "Return visits retain the original guide section number.");
  assert.ok(section.stops.length > 0 && section.maps.length > 0, "Every navigation group needs steps and a map reference.");
  if (section.missingMaps?.length) {
    assert.ok(section.mapNote, "Missing section maps need an explicit fallback notice.");
    for (const title of section.missingMaps) {
      assert.ok(catalog.missing.some((image) => image.title === title), "Missing-map labels must match the image catalog.");
    }
  }
}
for (const image of catalog.missing) {
  assert.ok(route.sections.some((section) => section.missingMaps?.includes(image.title)),
    "Keep every lost original map visible in its corresponding section.");
}
for (const section of route.sections) {
  for (const stop of section.stops) {
    const images = stop.maps ?? section.maps ?? [];
    assert.ok(images.length, "Each route step needs a reference image.");
    for (const image of images) {
      assert.ok(guideSections.some((reference) => reference.steps.includes(stop.id) && reference.maps.includes(image)),
        "Every image needs a guide section key for " + stop.id + ": " + image);
    }
  }
}

await Promise.all([
  "public/index.html", "public/styles.css", "assets/artwork/hornet-mask-icon.png", "assets/artwork/hornet.png", "assets/artwork/hornet.webp", "HANDOFF.md"
].map((file) => access(new URL(file, root))));

// Imported chats preserve legacy links and old mistakes verbatim. Validate their
// provenance/integrity here; only maintained project docs use active link checks.
assert.equal(chatArchive.version, 1);
assert.ok(Number.isSafeInteger(chatArchive.reportedChatCount) && chatArchive.reportedChatCount > 0);
assert.ok(chatArchive.identityNote && chatArchive.sources.length > 0);
const sourceIds = new Set(chatArchive.sources.map((source) => source.id));
assert.equal(sourceIds.size, chatArchive.sources.length, "Recovered source IDs must be unique.");
assert.equal(new Set(chatArchive.sources.map((source) => source.file)).size, chatArchive.sources.length, "Each extract needs its own preserved file.");
for (const source of chatArchive.sources) {
  assert.match(source.file, /^docs\/recovered-chats\/[a-z0-9-]+\.md$/, "Keep raw extracts in the source archive.");
  assert.ok(source.title && source.endpoint && source.received && source.origin?.originalFilename, "Keep source provenance and progression context.");
  assert.ok(["attachment", "workspace"].includes(source.origin.kind));
  if (source.origin.kind === "attachment") assert.ok(source.origin.attachmentId);
  assert.match(source.sha256, /^[a-f0-9]{64}$/);
  const bytes = await readFile(new URL(source.file, root));
  assert.equal(bytes.length, source.bytes, source.file + ": source byte count changed.");
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256, source.file + ": supplied extract changed.");
}
for (const group of chatArchive.overlapGroups) {
  assert.ok(group.status && group.reason && group.sources.length >= 2, "Explain overlaps without inventing chat identities.");
  assert.equal(new Set(group.sources).size, group.sources.length);
  assert.ok(group.sources.every((id) => sourceIds.has(id)), "Overlap groups need known sources.");
}

const documents = ["README.md", "AGENTS.md", "HANDOFF.md", "docs/history.md", "docs/map-credits.md", "docs/chat-recovery.md"];
for (const file of documents) {
  const source = new URL(file, root);
  const markdown = await readFile(source, "utf8");
  for (const match of markdown.matchAll(/!?\[[^\]]*\]\((?:<([^>]+)>|([^\s)]+))(?:\s+"[^"]*")?\)/g)) {
    const target = match[1] ?? match[2];
    if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) continue;
    const path = decodeURIComponent(target.split("#")[0]);
    await access(new URL(path, source)).catch(() => assert.fail(file + ": broken local link " + target));
  }
}

console.log(`Verified ${stops.length} route checkpoints, ${guideStops.length} guide pages, ${catalog.images.filter((image) => !image.custom).length} original guide images, ${catalog.images.filter((image) => image.custom).length} custom assets, map references and guide keys, documentation links, ${chatArchive.sources.length} recovered source hashes, run data, split timing, and purchase reminders.`);

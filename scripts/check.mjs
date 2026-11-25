import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { changeCursedProgress, changePickups, changeRosaryBudget, changeSplit, formatTime, listGuideStops, listRecordingStops, listStops, parseTime, pickupCategories, rosaryBudget, runSummary, shoppingSummary, validateRunData } from "../public/model.mjs";

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
assert.equal(stops.length, 32, "Keep the original timing IDs and the guide-only Last Judge page.");
assert.equal(guideStops.length, 22, "Lace 2 preparation and fight share one page alongside the earlier combined stops.");
assert.deepEqual(guideStops.slice(10, 14).map((stop) => stop.id),
  ["blasted-steps", "last-judge-fight", "act-2", "grand-bellway"], "The Choral Chambers bench belongs on step 13 after the fight.");
assert.equal(guideStops[11].recordSplit, false, "Defeating Last Judge does not add a separate split.");
assert.equal(guideStops[12].guideSplits[0].checkpoint, "act-2", "The bench keeps its original split ID.");
const greymoorGuide = guideStops[4];
assert.equal(greymoorGuide.id, "moorwing", "The combined page records its final checkpoint by default.");
assert.deepEqual(greymoorGuide.checkpointIds, ["halfway-home", "moorwing"]);
assert.equal(guideStops[5].id, "cling-grip", "Next skips the combined member rather than showing it twice.");
assert.deepEqual(greymoorGuide.maps, ["greymoor", "moorwing-aid"]);
assert.equal(greymoorGuide.purchases.reduce((sum, item) => sum + item.rosaries, 0), 60);
assert.equal(greymoorGuide.guide.length,
  stops.find((stop) => stop.id === "halfway-home").guide.length + stops.find((stop) => stop.id === "moorwing").guide.length,
  "Combining pages must retain both parts of the walkthrough.");

const timingStops = listRecordingStops(route);
assert.equal(timingStops.length, 24, "Exclude all retired splits from the current timing list.");
assert.equal(timingStops.some((stop) => stop.id === "widow-bench"), false);
assert.ok(timingStops.some((stop) => stop.id === "widow"));
assert.deepEqual(guideStops[6].checkpointIds, ["widow-bench", "widow"]);
assert.equal(guideStops[6].id, "widow");
assert.equal(guideStops[7].id, "atla");
assert.equal(timingStops.some((stop) => stop.id === "bellhart-return"), false);
assert.deepEqual(guideStops[9].checkpointIds, ["bellhart-return", "greymoor-bell"]);
assert.equal(guideStops[9].id, "greymoor-bell");
const beforeWidow = runSummary(route, { prep: [], splits: [
  { checkpoint: "cling-grip", seconds: 100, precision: "second", note: "" },
  { checkpoint: "widow-bench", seconds: 120, precision: "second", note: "", label: "Widow bench" }
] });
assert.equal(beforeWidow.next.id, "widow", "An old bench split must not count as defeating Widow.");
assert.equal(beforeWidow.count, 1);
assert.equal(beforeWidow.history.length, 2, "Historical bench times stay in the run history.");
assert.equal(beforeWidow.total, 24);

const prep = route.preparations.flatMap((group) => group.items.map(({ id }) => id));
assert.equal(new Set(prep).size, prep.length, "Preparation IDs must be unique.");
for (const pair of route.preparations.filter(({ id }) => id.startsWith("silk-"))) {
  assert.equal(pair.items.length, 2, "A Silk capacity pair needs two fragments.");
}

const activeSpools = route.preparations.filter((group) => group.id.startsWith("silk-"));
assert.equal(activeSpools.length, 4, "The selected route completes four spools.");
assert.deepEqual(activeSpools.flatMap((group) => group.items.map((item) => item.pin)),
  [478080, 478230, 477926, 478263, 478586, 478618, 479317, 478704], "Keep the selected eight fragments in route order.");
assert.ok(activeSpools.find((group) => group.id === "silk-d").items.some((item) => item.id === "spool-cauldron"),
  "Reuse the existing Underworks pickup ID in the fourth pair.");

const inlinePickupIds = [];
const activePickupIds = route.preparations.filter((group) => !group.archived)
  .flatMap((group) => group.items.map((item) => item.id));
function checkGuideAnnotations(instructions, pickups = [], references = []) {
  for (const item of pickups) {
    assert.ok(Number.isInteger(item.instruction) && item.instruction >= 1 && item.instruction <= instructions.length);
    assert.ok(activePickupIds.includes(item.id), "Inline checkboxes must use active drawer pickup IDs.");
    assert.ok(item.text && instructions[item.instruction - 1].split(item.text).length === 2,
      "Each inline checkbox must match one unambiguous item name.");
    inlinePickupIds.push(item.id);
  }
  for (const reference of references) {
    assert.ok(Number.isInteger(reference.instruction) && reference.instruction >= 1 && reference.instruction <= instructions.length);
    assert.ok(reference.title && /^https:\/\//.test(reference.url));
  }
}
for (const stop of stops) {
  checkGuideAnnotations(stop.guide, stop.guidePickups, stop.guideLinks);
  if (stop.optionalDetour) checkGuideAnnotations(stop.optionalDetour.steps, stop.optionalDetour.guidePickups, stop.optionalDetour.guideLinks);
}
assert.deepEqual([...inlinePickupIds].sort(), [...activePickupIds].sort(),
  "Every active drawer pickup gets one checkbox at its actual guide collection point.");
const guideSplitIds = [];
for (const stop of stops) {
  for (const point of stop.guideSplits ?? []) {
    assert.ok(Number.isInteger(point.instruction) && point.instruction >= 1 && point.instruction <= stop.guide.length);
    assert.ok(timingStops.some((item) => item.id === point.checkpoint), "Instruction split forms must target current checkpoints.");
    assert.ok(typeof point.when === "string" && point.when.trim(), "Every split needs a clear timing cue.");
    guideSplitIds.push(point.checkpoint);
  }
}
assert.deepEqual([...guideSplitIds].sort(), timingStops.map((stop) => stop.id).sort(),
  "Every current checkpoint needs exactly one form at its actual event, including events on neighboring pages.");
assert.deepEqual(guideStops.find((stop) => stop.id === "swift-step").guideSplits.map((point) => point.checkpoint), ["swift-step", "lace-1"]);
assert.deepEqual(greymoorGuide.guideSplits.map((point) => point.checkpoint), ["halfway-home", "moorwing"]);
assert.equal(greymoorGuide.guideSplits.find((point) => point.checkpoint === "moorwing").instruction,
  stops.find((stop) => stop.id === "halfway-home").guide.length + 4);
const songclaveGuide = guideStops[14];
assert.deepEqual(songclaveGuide.checkpointIds, ["songclave-bell", "dancers", "lower-core"], "The whole Songclave loop is on step 15.");
assert.deepEqual(songclaveGuide.guideSplits.map((point) => point.checkpoint), ["lower-core", "vaults-arena"]);
const lowerCoreBench = songclaveGuide.guideSplits.find((point) => point.checkpoint === "lower-core");
const lowerCoreArena = songclaveGuide.guidePickups.find((point) => point.id === "mask-lower-core");
assert.ok(lowerCoreBench.instruction < lowerCoreArena.instruction, "Take the Lower Core split before entering the arena.");
assert.match(songclaveGuide.guide[lowerCoreBench.instruction - 1], /^Head straight to the bench below the Dancers/);
const songclaveBench = songclaveGuide.guideSplits.find((point) => point.checkpoint === "vaults-arena");
const dicePickup = songclaveGuide.guidePickups.find((point) => point.id === "tool-dice");
assert.ok(dicePickup?.instruction > songclaveBench.instruction, "Get Dice after recording the Songclave bench split on step 15.");
assert.equal(timingStops[timingStops.findIndex((stop) => stop.id === "grand-bellway") + 1].id, "lower-core");
const songclaveHistory = seed.runs[0].splits.filter((split) =>
  ["grand-bellway", "songclave-bell", "dancers"].includes(split.checkpoint));
const beforeLowerCore = runSummary(route, { ...seed.runs[0], splits: songclaveHistory });
assert.equal(beforeLowerCore.next.id, "lower-core", "Saved Songclave and Dancers times do not affect the next split.");
assert.equal(beforeLowerCore.count, 1);
assert.equal(beforeLowerCore.history.length, 3);
assert.equal(guideStops[15].id, "trobbio", "The combined Vaults, Pale Oil and Trobbio trip follows the Songclave loop.");
assert.deepEqual(guideStops[15].checkpointIds, ["vaults-arena", "trobbio"]);
assert.equal(guideStops[16].id, "clawline", "Next goes from the combined Vaults/Trobbio trip to Whiteward and Clawline.");

const widowGuide = guideStops.find((stop) => stop.id === "widow");
assert.equal(widowGuide.guideLinks[0].instruction, 3, "The Widow link stays beside the fight tips after combining the bench setup.");
assert.equal(widowGuide.guidePickups.find((item) => item.id === "ability-needolin").instruction, 4);
assert.equal(timingStops.some((stop) => stop.id === "vaultkeeper"), false, "The melody split is historical only.");
assert.equal(guideStops[17].id, "roof-duel");
assert.deepEqual(guideStops[17].checkpointIds, ["vaultkeeper", "roof-duel"]);
assert.deepEqual(guideStops[17].guideSplits.map((point) => point.checkpoint), ["roof-duel"]);
assert.equal(guideStops[18].id, "conductor", "The combined High Halls page follows the melody/duel approach.");
assert.deepEqual(guideStops[18].checkpointIds, ["high-halls-bench", "forum", "conductor"]);
assert.deepEqual(guideStops[18].guideSplits.map((point) => point.checkpoint), ["high-halls-bench", "conductor"]);
assert.equal(timingStops.some((stop) => stop.id === "forum"), false, "The old Forum-only split is historical.");
assert.equal(guideStops[19].id, "architect", "Next goes straight from High Halls to the Architect’s Melody.");
const melodyGuide = stops.find((stop) => stop.id === "vaultkeeper");
assert.equal(melodyGuide.guidePickups.find((item) => item.id === "melody-vaultkeeper").instruction, 7,
  "Check the melody only when it is learned, not when its cylinder is found.");

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
assert.equal(spoolCategory.items.length, 8, "All selected fragments share one category.");
assert.equal(spoolCategory.groups.length, 4, "Keep the four Silk pairs inside the category.");
assert.equal(emptyCategories.some((category) => category.archived), false);
const priorPickups = ["spool-greymoor", "necklace-loddie", "unrelated-historical"];
const allSpools = changePickups(priorPickups, spoolCategory.items.map((item) => item.id), true);
assert.deepEqual(priorPickups, ["spool-greymoor", "necklace-loddie", "unrelated-historical"], "Bulk checks must not mutate existing data.");
assert.equal(new Set(allSpools).size, allSpools.length);
assert.ok(pickupCategories(route, allSpools).find((category) => category.id === "spools").isComplete);
assert.ok(pickupCategories(route, allSpools).some((category) => category.archived), "Keep checked historical pickups visible.");
assert.deepEqual(changePickups(allSpools, spoolCategory.items.map((item) => item.id), false), ["necklace-loddie", "unrelated-historical"], "Unchecking a category must preserve other categories and old records.");
const requiredPickups = emptyCategories.filter((category) => !category.optional && !category.archived).flatMap((category) => category.items.map((item) => item.id));
const completed = pickupCategories(route, requiredPickups);
assert.ok(completed.filter((category) => !category.optional && !category.archived).every((category) => category.isComplete));
assert.ok(completed.some((category) => category.optional && !category.isComplete), "Optional pickups do not block required completion.");

const purchaseIds = new Set();
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
    assert.ok(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.id) && !purchaseIds.has(item.id), "Purchase IDs must be stable and unique.");
    purchaseIds.add(item.id);
    if (item.pickupId) assert.ok(activePickupIds.includes(item.pickupId), "Purchased items share their existing pickup check.");
    assert.ok(typeof item.item === "string" && item.item.trim());
    assert.ok(Number.isSafeInteger(item.rosaries) && item.rosaries >= 0, "Shopping costs must be explicit nonnegative rosary amounts.");
    if (item.conditional !== undefined) assert.ok(typeof item.conditional === "string" && item.conditional.trim());
    if (item.materials !== undefined) assert.ok(typeof item.materials === "string" && item.materials.trim());
    if (item.optional !== undefined) assert.equal(typeof item.optional, "boolean");
  }
}
const mortShopping = shoppingSummary(route, "drifters-cloak");
assert.equal(mortShopping.stop.id, "drifters-cloak");
assert.equal(mortShopping.minimum, 410, "Mort's entry, Belt and pouch belong to the Far Fields step.");
assert.equal(mortShopping.maximum, 410, "Greymoor Bellway is a separate purchase on the next step.");
assert.equal(shoppingSummary(route, "forge-daughter").minimum, 315, "Include only the first 25-rosary Loddie round before the Forge Daughter purchases.");
assert.equal(shoppingSummary(route, "lace-1").minimum, 340, "Protect the mask shard and Bellway budget.");
assert.equal(shoppingSummary(route, "lace-1").maximum, 340, "The planned pickups cover Craftmetal; the Bone Bottom purchases are the mask shard and Bellway.");
assert.equal(shoppingSummary(route, "clawline").minimum, 450);
assert.equal(shoppingSummary(route, "vaults-arena").minimum, 0, "The second Needle upgrade needs Pale Oil rather than rosaries.");
assert.equal(shoppingSummary(route, "gms"), null);
assert.equal(shoppingSummary(route, "legacy-far-fields-return"), null, "Historical-only checkpoints have no invented spending reminder.");

const budgetFixture = { version: 1, revision: 0, runs: [
  { id: "budget-run", name: "Budget run", mode: "timed", notes: "Keep these notes", prep: ["spool-core"],
    splits: [{ checkpoint: "blasted-steps", seconds: 8400, precision: "minute", label: "Original bench label", note: "Keep this note" }] },
  { id: "budget-other", name: "Other run", mode: "scout", notes: "", prep: [], splits: [] }
] };
const budgetOriginal = structuredClone(budgetFixture);
const cursed = route.cursedGuide;
assert.deepEqual(cursed.stages.map(({ id }) => id), [
  "cursed-start", "cursed-faydown", "cursed-needle", "cursed-masks", "cursed-ready", "cursed-commit", "cursed-fight"
]);
const cursedSteps = cursed.stages.flatMap((stage) => stage.steps);
const cursedIds = cursedSteps.filter((step) => step.id).map((step) => step.id);
assert.equal(new Set(cursedIds).size, cursedIds.length, "Give each Cursed pickup or action one stable check.");
assert.equal(cursedIds.filter((id) => id.startsWith("cursed-shard-")).length, 8, "Count Mount Fay only once.");
const cursedReferences = cursedSteps.flatMap((step) => step.ref ? [step] : step.nearby ?? []);
for (const reference of cursedReferences) {
  assert.ok(cursedIds.includes(reference.ref), "Shared Cursed checkboxes must reference an existing item.");
}

const cursedCheck = changeCursedProgress(cursed, budgetFixture, "budget-run", { id: "cursed-shard-mount-fay", checked: true });
assert.deepEqual(cursedCheck.runs[0], { ...budgetOriginal.runs[0], cursed: { checks: ["cursed-shard-mount-fay"] } });
assert.deepEqual(cursedCheck.runs[1], budgetOriginal.runs[1], "Cursed checkmarks belong to the selected run.");
assert.deepEqual(budgetFixture, budgetOriginal, "Cursed edits must not mutate loaded data.");
cursedCheck.runs[0].cursed.futureField = "Keep an unknown field";
cursedCheck.runs[0].cursed.checks.push("future-check");
const cursedNotes = changeCursedProgress(cursed, cursedCheck, "budget-run", { notes: "First attempt" });
const cursedUndo = changeCursedProgress(cursed, cursedNotes, "budget-run", { id: "cursed-shard-mount-fay", checked: false });
assert.deepEqual(cursedUndo.runs[0].cursed, {
  checks: ["future-check"], notes: "First attempt", futureField: "Keep an unknown field"
});
assert.doesNotThrow(() => validateRunData(cursedUndo));
assert.throws(() => changeCursedProgress(cursed, cursedUndo, "budget-run", { id: "mask-pebb", checked: true }), /Cursed checklist item/);

assert.equal(rosaryBudget(route, budgetFixture.runs[0]).maximum, 2015);
assert.equal(rosaryBudget(route, budgetFixture.runs[0]).optionalTotal, 40);
const paidOptional = changeRosaryBudget(route, budgetFixture, "budget-run", { purchaseId: "bench-shellwood-arena", paid: true });
assert.equal(rosaryBudget(route, paidOptional.runs[0]).maximum, 2015, "Optional benches do not inflate the required budget.");
assert.equal(rosaryBudget(route, paidOptional.runs[0]).optionalTotal, 0);
assert.equal(shoppingSummary(route, "cling-grip").maximum, 0, "Shellwood bench spending is optional.");
assert.equal(rosaryBudget(route, budgetFixture.runs[0]).remaining.length, 16, "Free/material-only items are excluded from the rosary pool.");
const paidBellway = changeRosaryBudget(route, budgetFixture, "budget-run", { purchaseId: "bellway-blasted-steps", paid: true });
assert.equal(rosaryBudget(route, paidBellway.runs[0]).maximum, 1955);
assert.deepEqual(budgetFixture, budgetOriginal, "Budget edits must not mutate loaded data.");
assert.deepEqual(paidBellway.runs[1], budgetFixture.runs[1]);
assert.deepEqual(paidBellway.runs[0].splits, budgetFixture.runs[0].splits);
assert.deepEqual(paidBellway.runs[0].prep, budgetFixture.runs[0].prep, "Travel purchases must not mark pickups collected.");
assert.equal(paidBellway.runs[0].notes, budgetFixture.runs[0].notes);
assert.deepEqual(paidBellway.runs[0].rosaryBudget, { paid: ["bellway-blasted-steps"] }, "A purchase save needs no wallet field.");
const paidKit = changeRosaryBudget(route, paidBellway, "budget-run", { purchaseId: "kit-second", paid: true });
assert.ok(paidKit.runs[0].prep.includes("kit-second"));
assert.equal(rosaryBudget(route, paidKit.runs[0]).maximum, 1505);
const undoneKit = changeRosaryBudget(route, paidKit, "budget-run", { purchaseId: "kit-second", paid: false });
assert.equal(rosaryBudget(route, undoneKit.runs[0]).maximum, 1955);
assert.ok(undoneKit.runs[0].prep.includes("spool-core"), "Changing a purchase preserves historical pickup records.");
assert.equal(shoppingSummary(route, "blasted-steps", paidBellway.runs[0]).stop.id, "grand-bellway", "Paid stops drop out of the next spending reminder.");
const checkedItems = { ...budgetFixture.runs[0], prep: ["mask-pebb", "tool-weighted-belt", "kit-second"] };
assert.equal(rosaryBudget(route, checkedItems).maximum, 1105, "Existing pickup checks reduce the whole-run cost without new paid records.");
const legacyBudget = structuredClone(paidBellway);
legacyBudget.runs[0].rosaryBudget.wallet = 638;
const legacyChanged = changeRosaryBudget(route, legacyBudget, "budget-run", { purchaseId: "ventrica-high-halls", paid: true });
assert.equal(legacyChanged.runs[0].rosaryBudget.wallet, 638, "Retain stored legacy fields without using or editing them.");
assert.equal(Object.hasOwn(rosaryBudget(route, legacyChanged.runs[0]), "wallet"), false);
assert.equal(rosaryBudget(route, legacyChanged.runs[0]).maximum, 1875);
let allPaid = budgetFixture;
for (const purchase of rosaryBudget(route, budgetFixture.runs[0]).purchases) {
  allPaid = changeRosaryBudget(route, allPaid, "budget-run", { purchaseId: purchase.id, paid: true });
}
assert.equal(rosaryBudget(route, allPaid.runs[0]).maximum, 0);
assert.equal(rosaryBudget(route, allPaid.runs[0]).remaining.length, 0);
assert.throws(() => changeRosaryBudget(route, budgetFixture, "budget-run", { purchaseId: "not-planned", paid: true }), /planned rosary purchase/);
validateRunData(paidKit);
validateRunData(legacyChanged);
for (const rosaryBudget of [{ wallet: -1, paid: [] }, { wallet: 1.5, paid: [] }, { paid: ["duplicate", "duplicate"] }, { paid: "invalid" }]) {
  const invalid = structuredClone(budgetFixture);
  invalid.runs[0].rosaryBudget = rosaryBudget;
  assert.throws(() => validateRunData(invalid), /invalid rosary budget/);
}

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

const splitFixture = { version: 1, revision: 0, runs: [
  { id: "primary", name: "Primary", mode: "timed", notes: "Keep run notes", prep: ["bell-greymoor"],
    splits: [{ checkpoint: "blasted-steps", label: "Original bench label", seconds: 8400, precision: "minute", note: "Keep this split note" }] },
  { id: "other", name: "Other", mode: "scout", notes: "Other notes", prep: ["spool-core"], splits: [] }
] };
const originalFixture = structuredClone(splitFixture);
const editedSplit = changeSplit(route, splitFixture, "primary", { checkpoint: "blasted-steps", time: "2:20:17" });
assert.deepEqual(splitFixture, originalFixture, "A split edit must not mutate loaded data.");
assert.deepEqual(editedSplit.runs[1], splitFixture.runs[1], "Split saves must preserve the other runs.");
assert.deepEqual(editedSplit.runs[0].prep, splitFixture.runs[0].prep);
assert.equal(editedSplit.runs[0].notes, "Keep run notes");
assert.deepEqual(editedSplit.runs[0].splits[0], { checkpoint: "blasted-steps", label: "Original bench label", seconds: 8417, precision: "second", note: "Keep this split note" });
assert.throws(() => changeSplit(route, splitFixture, "primary", { checkpoint: "blasted-steps", time: "2:60" }), /Enter a time/);
assert.throws(() => changeSplit(route, splitFixture, "primary", { checkpoint: "widow-bench", time: "1:00" }), /historical split/);
assert.throws(() => changeSplit(route, splitFixture, "primary", { checkpoint: "gms", time: "2:00" }), /finish time/);
const finishedFixture = changeSplit(route, editedSplit, "primary", { checkpoint: "gms", time: "5:00:01" });
assert.throws(() => changeSplit(route, finishedFixture, "primary", { checkpoint: "blasted-steps", time: "5:01" }), /finish time/);
const historicalFixture = structuredClone(splitFixture);
historicalFixture.runs[0].splits.push({ checkpoint: "widow-bench", label: "Original historical bench", seconds: 5000, precision: "second", note: "Keep historical note" });
const editedHistorical = changeSplit(route, historicalFixture, "primary", { checkpoint: "widow-bench", time: "1:24:00" });
assert.equal(editedHistorical.runs[0].splits.at(-1).label, "Original historical bench");
assert.equal(editedHistorical.runs[0].splits.at(-1).note, "Keep historical note");

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
  assert.equal(section.title, reference.title, "Navigation titles must match their route map key, including custom return headings.");
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
  "public/index.html", "public/cursed.html", "public/styles.css", "assets/artwork/hornet-mask-icon.png", "assets/artwork/hornet.png", "assets/artwork/hornet.webp", "HANDOFF.md"
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

const documents = ["README.md", "AGENTS.md", "HANDOFF.md", "docs/architecture.md", "docs/history.md", "docs/map-credits.md", "docs/chat-recovery.md"];
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

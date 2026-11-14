// Startup and cross-feature coordination. See docs/architecture.md for ownership.
import { listGuideStops, listStops } from "./model.mjs";
import { getJson } from "./ui/api.mjs";
import { byId, status } from "./ui/dom.mjs";
import { createGuide } from "./ui/guide.mjs";
import { bindMapEvents, renderMaps } from "./ui/maps.mjs";
import { bindPickupEvents, renderPrep } from "./ui/pickups.mjs";
import { createRunLog } from "./ui/run-log.mjs";
import { guideStopById, selectedRun, state, stopById } from "./ui/state.mjs";

const guide = createGuide({ onNavigate: chooseCheckpoint });
const runLog = createRunLog({
  onSelectRun: selectRun,
  onNavigate: chooseCheckpoint,
  onSplitSaved: renderCheckpoint
});

function renderCheckpoint() {
  guide.render();
  runLog.renderEditor();
}

function chooseCheckpoint(id, focus = false) {
  if (state.saving) return;
  state.checkpoint = id;
  if (stopById(id)) {
    try { localStorage.setItem("pharloom-guide-step", id); } catch { /* Reading position is optional. */ }
  }
  status("split-status", "");
  renderCheckpoint();
  if (focus) guide.focusCurrentStep();
}

function selectRun(id) {
  if (state.saving) return;
  state.runId = id;
  const run = selectedRun();
  if (stopById(state.checkpoint)?.recordSplit === false &&
      !run.splits.some((split) => split.checkpoint === state.checkpoint)) {
    state.checkpoint = guideStopById(state.checkpoint)?.id ?? state.guideStops[0].id;
  }
  if (!stopById(state.checkpoint) && !run.splits.some((split) => split.checkpoint === state.checkpoint)) {
    let remembered;
    try { remembered = localStorage.getItem("pharloom-guide-step"); } catch { /* Start at the beginning. */ }
    state.checkpoint = guideStopById(remembered)?.id ?? state.guideStops[0].id;
  }
  try { localStorage.setItem("pharloom-run", id); } catch { /* Selection is optional browser state. */ }
  for (const id of ["split-status", "notes-status", "prep-status"]) status(id, "");
  runLog.render();
  guide.render();
  renderPrep(true);
}

async function start() {
  try {
    [state.route, state.data, state.maps] = await Promise.all([getJson("/api/route"), getJson("/api/runs"), getJson("/api/maps")]);
    state.stops = listStops(state.route);
    state.guideStops = listGuideStops(state.route);
    // Freeze the recorded label on the next save, before future route edits.
    for (const run of state.data.runs) {
      for (const split of run.splits) split.label ??= stopById(split.checkpoint)?.title ?? split.checkpoint;
    }
    let remembered;
    try { remembered = localStorage.getItem("pharloom-run"); } catch { /* Use the latest run. */ }
    const id = state.data.runs.find((run) => run.id === remembered)?.id ?? state.data.runs.at(-1).id;
    byId("route-label").textContent = state.route.routeLabel;
    selectRun(id);
    renderMaps();
    guide.bindEvents();
    runLog.bindEvents();
    bindPickupEvents();
    bindMapEvents();
    byId("tracker").hidden = false;
    byId("startup").hidden = true;
    byId("footer").hidden = false;
    byId("open-prep").hidden = false;
    byId("open-sections").hidden = false;
  } catch (error) {
    byId("startup").textContent = `Could not load the runbook. Open it from the local server address in the README. ${error.message}`;
  }
}

start();

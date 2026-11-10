import { formatTime, listStops, parseTime, runSummary, shoppingSummary } from "/model.mjs";

const byId = (id) => document.getElementById(id);
const state = {
  route: null,
  data: null,
  runId: null,
  checkpoint: null,
  stops: [],
  saving: false
};
const mapAssets = {
  cauldron: { src: "/maps/cauldron.jpg", alt: "Recovered map of the Cauldron, Vaults, and roof approach", width: 1012, height: 787 },
  "high-halls": { src: "/maps/high-halls.jpg", alt: "Recovered map of the High Halls path to Cogfly and the Forum", width: 706, height: 608 }
};

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function mapPin(pin) {
  return `https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=${pin}`;
}

function link(title, href, className) {
  const anchor = node("a", className, title);
  anchor.href = href;
  anchor.target = "_blank";
  anchor.rel = "noopener";
  return anchor;
}

function links(links = []) {
  return links.map((item) => link(item.title, item.pin ? mapPin(item.pin) : item.url));
}

function selectedRun(data = state.data) {
  return data.runs.find((run) => run.id === state.runId);
}

function stopById(id) {
  return state.stops.find((stop) => stop.id === id);
}

function splitLabel(split) {
  return split.label ?? stopById(split.checkpoint)?.title ?? split.checkpoint;
}

function status(id, message, isError = false) {
  const target = byId(id);
  target.textContent = message;
  target.classList.toggle("error", isError);
}

async function getJson(path, options) {
  const response = await fetch(path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "The local server did not respond successfully.");
  return data;
}

function setSaving(value) {
  state.saving = value;
  byId("run-select").disabled = value;
  byId("new-run").disabled = value;
  byId("save-indicator").textContent = value ? "Saving…" : "Local runbook";
  for (const control of document.querySelectorAll("[data-write], [data-prep], #split-form input, #split-form select, #split-form textarea, #run-notes, #new-run-name")) {
    control.disabled = value;
  }
}

async function save(next, statusId, success) {
  if (state.saving) return false;
  setSaving(true);
  status(statusId, "Saving…");
  try {
    state.data = await getJson("/api/runs", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next)
    });
    status(statusId, success);
    return true;
  } catch (error) {
    status(statusId, error.message, true);
    return false;
  } finally {
    setSaving(false);
  }
}

function renderRunPicker() {
  byId("run-select").replaceChildren(...state.data.runs.map((run) => {
    const option = node("option", "", run.mode === "scout" ? `${run.name} · scout` : run.name);
    option.value = run.id;
    return option;
  }));
  byId("run-select").value = state.runId;
}

function renderMetrics() {
  const run = selectedRun();
  const summary = runSummary(state.route, run);
  const latest = summary.latest;
  const goal = state.route.targetSeconds;
  const targetTime = formatTime(goal);
  byId("tracker-title").textContent = run.mode === "scout" ? "Off the clock." : summary.finish ? "A journey recorded." : latest ? "The final stretch." : "A fresh thread.";
  if (latest && !summary.finish && summary.next && state.stops.indexOf(stopById(summary.next.id)) < state.stops.length * .65 && run.mode !== "scout") {
    byId("tracker-title").textContent = "One split at a time.";
  }
  const badge = byId("session-badge");
  badge.dataset.mode = run.mode;
  badge.textContent = run.mode === "scout" ? "Scout practice" : summary.finish ? summary.underTarget ? "Finished · under 5h" : "Finished · goal missed" : "In progress";
  byId("latest-value").textContent = latest ? formatTime(latest.seconds, latest.precision) : "—";
  byId("latest-label").textContent = latest ? splitLabel(latest) : "Ready for the first split";
  byId("progress-value").textContent = `${summary.count} / ${summary.total}`;
  byId("progress-bar").max = summary.total;
  byId("progress-bar").value = summary.count;
  byId("progress-label").textContent = summary.finish ? "Finish recorded" : `${run.splits.length} splits saved · ${summary.next ? "finish pending" : "route complete"}`;

  const card = byId("budget-card");
  let title = "02 · Time to five hours";
  let value = targetTime;
  let description = "Before the first split";
  let tone = "normal";
  if (run.mode === "scout") {
    title = "Session type";
    value = "Scout";
    description = "Practice notes and splits";
  } else if (latest) {
    const comparison = summary.finish ?? latest;
    const difference = goal - comparison.seconds;
    value = formatTime(Math.abs(difference), comparison.precision);
    description = `At the recorded split · ${targetTime} cutoff`;
    if (summary.finish) {
      title = difference > 0 ? "Under target by" : difference < 0 ? "Over target by" : "At the cutoff";
      description = "Based on the recorded finish";
      tone = difference > 0 ? "success" : "over";
    } else if (difference <= 0) {
      title = difference === 0 ? "At the cutoff" : "Over target by";
      tone = "over";
    } else if (difference <= 600) {
      tone = "tight";
    }
  }
  card.dataset.tone = tone;
  byId("budget-title").textContent = title;
  byId("budget-value").textContent = value;
  byId("budget-label").textContent = description;
}

function renderCheckpointOptions() {
  const select = byId("checkpoint-select");
  select.replaceChildren();
  for (const section of state.route.sections) {
    const group = node("optgroup");
    group.label = section.title;
    for (const stop of section.stops) {
      const option = node("option", "", stop.title);
      option.value = stop.id;
      group.append(option);
    }
    select.append(group);
  }
  const legacy = selectedRun().splits.filter((split) => !stopById(split.checkpoint));
  if (legacy.length) {
    const group = node("optgroup");
    group.label = "Historical splits";
    for (const split of legacy) {
      const option = node("option", "", splitLabel(split));
      option.value = split.checkpoint;
      group.append(option);
    }
    select.append(group);
  }
}

function renderEditor() {
  const run = selectedRun();
  const stop = stopById(state.checkpoint);
  const saved = run.splits.find((split) => split.checkpoint === state.checkpoint);
  const next = runSummary(state.route, run).next;
  byId("checkpoint-select").value = state.checkpoint;
  byId("entry-kicker").textContent = saved ? "Recorded checkpoint" : next?.id === state.checkpoint ? "Next checkpoint" : "Checkpoint";
  byId("entry-title").textContent = stop?.title ?? splitLabel(saved);
  byId("entry-tip").textContent = stop?.tip ?? "This split was part of the original run.";
  const section = state.route.sections.find((section) => section.id === stop?.sectionId);
  const map = mapAssets[section?.map];
  byId("entry-links").replaceChildren(...links(stop?.links), ...(map ? [link("Reference map", map.src)] : []));
  byId("split-time").value = saved ? formatTime(saved.seconds, saved.precision) : "";
  byId("split-note").value = saved?.note ?? "";
  byId("save-split").textContent = saved ? "Update split →" : "Save split →";
  renderShopping();
  const comparison = byId("split-comparison");
  const reference = state.data.runs.find((item) => item.id === "run-2");
  const benchmark = reference?.splits.find((split) => split.checkpoint === state.checkpoint);
  comparison.replaceChildren();
  comparison.hidden = run.mode === "scout" || run.id === reference?.id || !benchmark;
  if (!comparison.hidden) {
    comparison.append(node("span", "", `${reference.name} at this stop · ${formatTime(benchmark.seconds, benchmark.precision)}`));
    if (saved) {
      const delta = saved.seconds - benchmark.seconds;
      const precision = [saved.precision, benchmark.precision].includes("second") ? "second" : "minute";
      const text = delta === 0 ? "Same recorded time" : `${formatTime(Math.abs(delta), precision)} ${delta < 0 ? "ahead" : "behind"}`;
      comparison.append(node("span", delta < 0 ? "ahead" : delta > 0 ? "behind" : "", text));
    }
  }
}

function renderShopping() {
  const summary = shoppingSummary(state.route, state.checkpoint);
  byId("shopping-reminder").hidden = !summary;
  if (!summary) return;
  const { stop, minimum, maximum } = summary;
  byId("shopping-stop").textContent = stop.title;
  byId("shopping-total").textContent = minimum === maximum
    ? minimum === 0 ? "No rosaries" : `${minimum} rosaries`
    : `${minimum}–${maximum} rosaries`;
  byId("shopping-items").replaceChildren(...stop.purchases.map((purchase) => {
    const item = node("li");
    const title = node("span", "", purchase.item);
    if (purchase.conditional) title.append(node("small", "", purchase.conditional));
    const costs = [];
    if (purchase.rosaries) costs.push(`${purchase.rosaries} rosaries`);
    if (purchase.materials) costs.push(purchase.materials);
    item.append(title, node("span", "shopping-cost", costs.join(" + ") || "Free"));
    return item;
  }));
  byId("shopping-note").textContent = stop.shoppingNote ?? "Planned spending at this stop; this reminder does not assume your current balance.";
}

function phaseSummary(section, count) {
  const summary = node("summary");
  summary.append(node("span", "phase-number", section.number), node("span", "phase-title", section.title));
  if (count) summary.append(node("span", "count", count));
  return summary;
}

function renderCheckpointList(reset = false) {
  const container = byId("checkpoint-list");
  const expanded = reset ? [] : [...container.querySelectorAll("details[open]")].map((item) => item.dataset.phase);
  const run = selectedRun();
  const saved = new Map(run.splits.map((split) => [split.checkpoint, split]));
  const next = runSummary(state.route, run).next;
  container.replaceChildren();
  for (const section of state.route.sections) {
    const phase = node("details", "phase");
    phase.dataset.phase = section.id;
    phase.open = expanded.includes(section.id) || section.stops.some((stop) => stop.id === state.checkpoint);
    const count = section.stops.filter((stop) => saved.has(stop.id)).length;
    phase.dataset.complete = String(count === section.stops.length);
    phase.dataset.current = String(section.stops.some((stop) => stop.id === next?.id));
    phase.addEventListener("toggle", updatePhaseToggle);
    phase.append(phaseSummary(section, `${count}/${section.stops.length}`));
    phase.append(node("p", "phase-context", section.summary));
    const list = node("ol", "checkpoint-list");
    for (const stop of section.stops) {
      const split = saved.get(stop.id);
      const row = node("button", "checkpoint-row");
      row.type = "button";
      row.classList.toggle("logged", Boolean(split));
      row.classList.toggle("next", stop.id === next?.id);
      row.setAttribute("aria-pressed", String(stop.id === state.checkpoint));
      const dot = node("span", "checkpoint-dot");
      dot.setAttribute("aria-hidden", "true");
      const time = split ? formatTime(split.seconds, split.precision) : stop.id === next?.id ? "Next" : "—";
      row.append(dot, node("span", "", stop.title), node("span", split ? "checkpoint-time" : "checkpoint-time empty", time));
      row.addEventListener("click", () => chooseCheckpoint(stop.id, true));
      const item = node("li");
      item.append(row);
      list.append(item);
    }
    phase.append(list);
    container.append(phase);
  }
  updatePhaseToggle();
}

function updatePhaseToggle() {
  const phases = [...byId("checkpoint-list").querySelectorAll("details")];
  byId("toggle-phases").textContent = phases.every((phase) => phase.open) ? "Collapse all" : "Expand all";
}

function chooseCheckpoint(id, focus = false) {
  if (state.saving) return;
  state.checkpoint = id;
  status("split-status", "");
  renderEditor();
  renderCheckpointList();
  if (focus) byId("split-time").focus();
}

function renderHistory() {
  const history = runSummary(state.route, selectedRun()).history;
  byId("history-count").textContent = `${history.length} recorded`;
  const list = byId("split-history");
  list.replaceChildren();
  for (const split of [...history].reverse()) {
    const item = node("li");
    const details = node("div");
    const title = node("button", "subtle-link", splitLabel(split));
    title.type = "button";
    title.addEventListener("click", () => chooseCheckpoint(split.checkpoint, true));
    details.append(title);
    if (split.note) details.append(node("p", "note", split.note));
    item.append(node("time", "", formatTime(split.seconds, split.precision)), details);
    list.append(item);
  }
  if (!history.length) list.append(node("li", "", "No splits recorded yet."));
}

function renderPrep() {
  const run = selectedRun();
  byId("prep-run").textContent = `Pickups recorded for ${run.name}.`;
  const items = state.route.preparations.flatMap((group) => group.items);
  const pickedUp = items.filter((item) => run.prep.includes(item.id)).length;
  byId("prep-count").textContent = `${pickedUp} / ${items.length} pickups`;
  const grid = byId("prep-grid");
  grid.replaceChildren();
  for (const group of state.route.preparations) {
    const card = node("article", "prep-card");
    const header = node("div", "panel-heading");
    const count = group.items.filter((item) => run.prep.includes(item.id)).length;
    const isComplete = count === group.items.length;
    card.dataset.complete = String(isComplete);
    header.append(
      node("h3", "", group.title),
      node("span", isComplete ? "count done" : "count", isComplete ? group.complete : `${count} / ${group.items.length}`)
    );
    card.append(header, node("p", "section-description", group.detail));
    const list = node("ul", "prep-items");
    for (const item of group.items) {
      const row = node("li", "prep-item");
      const label = node("label");
      const checkbox = node("input");
      checkbox.type = "checkbox";
      checkbox.checked = run.prep.includes(item.id);
      checkbox.dataset.prep = item.id;
      const copy = node("span", "", item.title);
      copy.append(node("small", "", item.detail));
      label.append(checkbox, copy);
      row.append(label);
      if (item.pin) {
        const pin = link("Map", mapPin(item.pin), "subtle-link");
        pin.setAttribute("aria-label", `Map for ${item.title}`);
        row.append(pin);
      }
      checkbox.addEventListener("change", async () => {
        const data = structuredClone(state.data);
        const edited = selectedRun(data);
        edited.prep = checkbox.checked ? [...edited.prep, item.id] : edited.prep.filter((id) => id !== item.id);
        if (await save(data, "prep-status", "Pickup checklist saved.")) {
          renderPrep();
          grid.querySelector(`[data-prep="${item.id}"]`)?.focus();
        } else {
          checkbox.checked = selectedRun().prep.includes(item.id);
        }
      });
      list.append(row);
    }
    card.append(list);
    grid.append(card);
  }
}

function selectRun(id) {
  if (state.saving) return;
  state.runId = id;
  const run = selectedRun();
  const summary = runSummary(state.route, run);
  state.checkpoint = summary.next?.id ?? summary.finish?.checkpoint ?? state.stops[0].id;
  try { localStorage.setItem("pharloom-run", id); } catch { /* Selection is optional browser state. */ }
  for (const id of ["split-status", "notes-status", "prep-status"]) status(id, "");
  byId("run-notes").value = run.notes;
  byId("run-notes-title").textContent = run.mode === "scout" ? "Scout observations" : "Run notes";
  byId("run-notes-panel").open = run.mode === "scout";
  byId("run-notes").placeholder = run.mode === "scout" ? "Record attempts, runbacks, loadout, and what to try next." : "Anything to remember for the final run.";
  byId("notes-label").textContent = run.name;
  renderRunPicker();
  renderMetrics();
  renderCheckpointOptions();
  renderEditor();
  renderCheckpointList(true);
  renderHistory();
  renderPrep();
}

function nextRunName() {
  const numbers = state.data.runs.map((run) => Number(run.name.match(/^Run #(\d+)$/)?.[1] ?? 0));
  return `Run #${Math.max(2, ...numbers) + 1}`;
}

function bindEvents() {
  document.querySelector(".skip-link").addEventListener("click", (event) => {
    event.preventDefault();
    byId("main-content").focus();
  });
  byId("run-select").addEventListener("change", (event) => selectRun(event.target.value));
  byId("checkpoint-select").addEventListener("change", (event) => chooseCheckpoint(event.target.value));
  byId("split-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const time = parseTime(byId("split-time").value);
    if (!time) {
      status("split-status", "Enter a time like 4:57 or 4:57:32.", true);
      byId("split-time").focus();
      return;
    }

    const id = state.checkpoint;
    const data = structuredClone(state.data);
    const run = selectedRun(data);
    const previous = run.splits.find((split) => split.checkpoint === id);
    const finish = run.splits.find((split) => split.checkpoint === state.route.finishCheckpoint);
    const others = run.splits.filter((split) => split.checkpoint !== id);
    const beforeOtherSplits = id === state.route.finishCheckpoint && others.some((split) => split.seconds > time.seconds);
    const afterFinish = id !== state.route.finishCheckpoint && finish && time.seconds > finish.seconds;
    if (beforeOtherSplits || afterFinish) {
      status("split-status", "The finish time must be at or after the other recorded splits.", true);
      return;
    }

    const wasNext = runSummary(state.route, run).next?.id === id;
    const label = previous?.label ?? stopById(id)?.title ?? id;
    run.splits = [...others, { checkpoint: id, label, ...time, note: byId("split-note").value.trim() }];
    if (await save(data, "split-status", `Saved ${formatTime(time.seconds, time.precision)} · ${label}`)) {
      const next = runSummary(state.route, selectedRun()).next;
      if (wasNext && next) state.checkpoint = next.id;
      renderMetrics();
      renderEditor();
      renderCheckpointList();
      renderHistory();
    }
  });

  byId("notes-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = structuredClone(state.data);
    selectedRun(data).notes = byId("run-notes").value.trim();
    await save(data, "notes-status", "Run notes saved.");
  });

  const dialog = byId("new-run-dialog");
  const nameField = byId("new-run-name");
  function openSession() {
    if (state.saving) return;
    nameField.value = nextRunName();
    status("new-run-status", "");
    dialog.showModal();
    nameField.select();
  }
  byId("new-run").addEventListener("click", openSession);
  byId("open-maps").addEventListener("click", () => { byId("maps").open = true; });
  dialog.addEventListener("cancel", (event) => { if (state.saving) event.preventDefault(); });
  byId("toggle-phases").addEventListener("click", () => {
    const phases = [...byId("checkpoint-list").querySelectorAll("details")];
    const open = !phases.every((phase) => phase.open);
    for (const phase of phases) phase.open = open;
    updatePhaseToggle();
  });
  byId("split-form").addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (!state.saving) byId("split-form").requestSubmit();
    }
  });
  byId("cancel-run").addEventListener("click", () => dialog.close());
  byId("new-run-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = nameField.value.trim();
    if (!name || state.data.runs.some((run) => run.name.toLowerCase() === name.toLowerCase())) {
      status("new-run-status", "Use a distinct name for this session.", true);
      return;
    }
    const run = { id: crypto.randomUUID(), name, mode: "timed", notes: "", splits: [], prep: [] };
    const data = structuredClone(state.data);
    data.runs.push(run);
    if (await save(data, "new-run-status", "Run created.")) {
      dialog.close();
      selectRun(run.id);
      window.location.hash = "tracker";
      byId("split-time").focus();
    }
  });

  byId("download-runs").addEventListener("click", () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" }));
    const anchor = node("a");
    anchor.href = url;
    anchor.download = "pharloom-runs.json";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
}

async function start() {
  try {
    [state.route, state.data] = await Promise.all([getJson("/api/route"), getJson("/api/runs")]);
    state.stops = listStops(state.route);
    // Freeze the recorded label on the next save, before future route edits.
    for (const run of state.data.runs) {
      for (const split of run.splits) split.label ??= stopById(split.checkpoint)?.title ?? split.checkpoint;
    }
    let remembered;
    try { remembered = localStorage.getItem("pharloom-run"); } catch { /* Use the latest run. */ }
    const id = state.data.runs.find((run) => run.id === remembered)?.id ?? state.data.runs.at(-1).id;
    byId("route-label").textContent = state.route.routeLabel;
    selectRun(id);
    bindEvents();
    byId("tracker").hidden = false;
    byId("startup").hidden = true;
    byId("footer").hidden = false;
    byId("session-bar").hidden = false;
  } catch (error) {
    byId("startup").textContent = `Could not load the runbook. Open it from the local server address in the README. ${error.message}`;
  }
}

start();

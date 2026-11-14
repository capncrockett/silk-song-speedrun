import { changePickups, formatTime, listGuideStops, listStops, parseTime, pickupCategories, runSummary, shoppingSummary } from "/model.mjs";

const byId = (id) => document.getElementById(id);
const state = {
  route: null,
  data: null,
  maps: null,
  runId: null,
  checkpoint: null,
  activeMap: null,
  activeSection: null,
  stops: [],
  guideStops: [],
  saving: false
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

function guideStopById(id) {
  return state.guideStops.find((stop) => stop.checkpointIds.includes(id));
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
  if (!response.ok) throw Object.assign(new Error(data.error ?? "The local server did not respond successfully."), { status: response.status });
  return data;
}

function setSaving(value) {
  state.saving = value;
  byId("run-select").disabled = value;
  byId("new-run").disabled = value;
  byId("save-indicator").textContent = value ? "Saving…" : "Local runbook";
  for (const control of document.querySelectorAll("[data-write], [data-prep], [data-prep-group], #split-form input, #split-form select, #split-form textarea, #run-notes, #new-run-name")) {
    control.disabled = value;
  }
}

async function save(next, statusId, success, rebase) {
  if (state.saving) return false;
  setSaving(true);
  status(statusId, "Saving…");
  let saved = false;
  try {
    let pending = next;
    for (let attempt = 0; ; attempt++) {
      try {
        state.data = await getJson("/api/runs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(pending)
        });
        break;
      } catch (error) {
        if (error.status !== 409 || !rebase || attempt >= 2) throw error;
        pending = rebase(await getJson("/api/runs"));
      }
    }
    saved = true;
    status(statusId, success);
    return true;
  } catch (error) {
    status(statusId, error.message, true);
    return false;
  } finally {
    setSaving(false);
    if (!saved) byId("save-indicator").textContent = "Not saved";
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
  let title = "Time to five hours";
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
    group.label = section.visit ? `${section.title} · ${section.visit}` : section.title;
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

function renderMaps() {
  const images = state.maps.images.filter((image) => image.timedRoute);
  const mapCount = images.filter((image) => image.kind === "map").length;
  byId("map-count").textContent = `${mapCount} maps · ${images.length - mapCount} screenshots`;
  byId("map-gallery").replaceChildren(...images.map((image) => {
    const card = link("", image.src, "atlas-card");
    const preview = node("img");
    preview.src = image.src;
    preview.alt = "";
    preview.loading = "lazy";
    preview.width = image.width;
    preview.height = image.height;
    const caption = node("span");
    caption.append(node("small", "", image.custom ? image.draft ? "CUSTOM ROUTE DRAFT" : "SUPPLIED SCREENSHOT" : image.kind === "map" ? "GUIDE REFERENCE MAP" : "GUIDE SCREENSHOT"));
    const title = node("strong", "", image.title);
    const arrow = node("b", "", "↗");
    arrow.setAttribute("aria-hidden", "true");
    title.append(arrow);
    caption.append(title, node("p", "atlas-note", image.note));
    card.append(preview, caption);
    return card;
  }));
  byId("map-gaps").textContent = `Missing original guide maps: ${state.maps.missing.map((image) => image.title + (image.replacement ? " (replacement available)" : "")).join("; ")}. Checkpoint notes and map pins cover these stops. The guide does not mark spool fragments.`;
}

function stepTitle(stop) {
  return stop.guideTitle ?? stop.title;
}

function renderGuideMapKeys(image) {
  const container = byId("guide-map-keys");
  const checkpointIds = guideStopById(state.checkpoint)?.checkpointIds ?? [state.checkpoint];
  const sections = (state.route.guideSections ?? []).filter((section) =>
    section.steps.some((id) => checkpointIds.includes(id)) && section.maps.includes(image?.id)
  );
  container.hidden = sections.length === 0;
  container.replaceChildren(...sections.map((section) => {
    const block = node("section", "guide-map-key");
    const currentSection = state.route.sections.find((item) => item.id === stopById(state.checkpoint)?.sectionId);
    block.append(node("p", "eyebrow", "Garmond guide · map key"), node("h3", "", section.title === currentSection?.title ? "Map key" : section.title));
    block.append(node("p", "map-key-intro", image?.keyIntro ?? "Numbers match the original map. Yellow lines mark map branches: take planned stops, use optional stops as needed, and skip branches labeled Skip. Follow the numbered walkthrough below."));
    if (section.note) block.append(node("p", "map-key-note", section.note));
    const columns = node("div", "map-key-columns");
    for (const [title, items] of [["Guide checkpoints", section.checkpoints], [section.detoursTitle ?? "Map branches", section.detours]]) {
      if (!items.length) continue;
      const group = node("div", "map-key-group");
      const list = node("ul", "map-key-list");
      list.replaceChildren(...items.map((item) => node("li", "", item)));
      group.append(node("h4", "", title), list);
      columns.append(group);
    }
    block.append(columns, link("Open Tay Bravo’s original guide", state.maps.guide, "subtle-link map-key-source"));
    return block;
  }));
}

function renderGuideMap() {
  const image = state.maps.images.find((image) => image.id === state.activeMap);
  byId("guide-map-panel").hidden = !image;
  const stop = guideStopById(state.checkpoint) ?? stopById(state.checkpoint);
  const section = state.route.sections.find((item) => item.id === stop?.sectionId);
  const gap = stop?.mapNote ?? section?.mapNote ?? (image?.id === "overview" ? "The detailed area map is still missing. Use the written directions and map pins here; the overview shows the broader route." : "");
  byId("guide-map-gap").hidden = !gap;
  byId("guide-map-gap").textContent = gap;
  renderGuideMapKeys(image);
  if (!image) return;
  for (const tab of byId("guide-map-tabs").children) {
    const selected = tab.dataset.map === image.id;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  const panel = byId("guide-map-panel");
  if (byId("guide-map-tabs").children.length > 1) {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `map-tab-${image.id}`);
  } else {
    panel.removeAttribute("role");
    panel.setAttribute("aria-labelledby", "guide-map-title");
  }
  byId("guide-map-image").src = image.src;
  byId("guide-map-image").alt = image.title;
  byId("guide-map-image").width = image.width;
  byId("guide-map-image").height = image.height;
  byId("guide-map-title").textContent = image.title;
  byId("guide-map-note").textContent = image.note;
  byId("open-current-map").setAttribute("aria-label", `Enlarge ${image.title}`);
}

function renderEditor() {
  const run = selectedRun();
  const stop = guideStopById(state.checkpoint) ?? stopById(state.checkpoint);
  const saved = run.splits.find((split) => split.checkpoint === state.checkpoint);
  const section = state.route.sections.find((section) => section.id === stop?.sectionId);
  const index = state.guideStops.findIndex((item) => item.id === stop?.id);
  byId("checkpoint-select").value = state.checkpoint;
  byId("entry-kicker").textContent = section ? `Garmond guide · section ${section.guideNumber}${section.visit ? " · " + section.visit : ""}` : "Historical step";
  byId("entry-title").textContent = section?.title ?? (saved ? splitLabel(saved) : "Choose a route step");
  byId("entry-step-title").textContent = stop ? stepTitle(stop) : "";
  byId("guide-position").textContent = index >= 0 ? `Step ${index + 1} of ${state.guideStops.length}` : "Earlier route";
  byId("previous-step").disabled = index <= 0;
  byId("next-step").disabled = index < 0 || index === state.guideStops.length - 1;
  const nextStop = state.guideStops[index + 1];
  byId("guide-next-label").textContent = stop && nextStop ? `Up next · ${stepTitle(nextStop)}` : stop ? "The end of your route." : "This step belongs to an earlier route version.";
  byId("guide-directions").replaceChildren(...(stop?.guide ?? ["This historical split is preserved in the run log."]).map((text) => node("li", "", text)));
  byId("entry-links").replaceChildren(...links(stop?.links));
  const maps = (stop?.maps ?? section?.maps ?? []).map((id) => state.maps.images.find((image) => image.id === id));
  if (state.activeSection !== section?.id || !maps.some((image) => image.id === state.activeMap)) state.activeMap = maps[0]?.id ?? null;
  state.activeSection = section?.id ?? null;
  byId("guide-map-tabs").replaceChildren(...(maps.length > 1 ? maps : []).map((image) => {
    const tab = node("button", "map-tab", image.title);
    tab.type = "button";
    tab.id = `map-tab-${image.id}`;
    tab.dataset.map = image.id;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "guide-map-panel");
    tab.addEventListener("click", () => { state.activeMap = image.id; renderGuideMap(); });
    return tab;
  }));
  renderGuideMap();
  byId("split-time").value = saved ? formatTime(saved.seconds, saved.precision) : "";
  byId("split-note").value = saved?.note ?? "";
  byId("save-split").textContent = saved ? "Update split →" : "Save split →";
  const detour = stop?.optionalDetour;
  byId("optional-detour").hidden = !detour;
  byId("detour-title").textContent = detour?.title ?? "";
  byId("detour-detail").textContent = detour?.detail ?? "";
  byId("detour-steps").replaceChildren(...(detour?.steps ?? []).map((text) => node("li", "", text)));
  byId("detour-links").replaceChildren(...links(detour?.links));
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
  const firstCheckpoint = guideStopById(state.checkpoint)?.checkpointIds[0] ?? state.checkpoint;
  const summary = shoppingSummary(state.route, firstCheckpoint);
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

function renderSectionNavigation() {
  const container = byId("section-list");
  const current = state.route.sections.find((section) => section.id === stopById(state.checkpoint)?.sectionId);
  const groups = new Map();
  for (const section of state.route.sections) {
    if (!groups.has(section.guideNumber)) groups.set(section.guideNumber, { title: section.title, steps: [] });
    groups.get(section.guideNumber).steps.push(...state.guideStops.filter((stop) => stop.sectionId === section.id).map((stop) => ({ stop, visit: section.visit })));
  }
  const rows = [];
  for (const [number, group] of groups) {
    const item = node("li");
    item.dataset.sectionNumber = number;
    if (group.steps.length === 1) {
      const anchor = node("a", "section-link", group.title);
      anchor.href = "#guide-step";
      if (current?.guideNumber === number) anchor.setAttribute("aria-current", "location");
      anchor.addEventListener("click", (event) => {
        event.preventDefault();
        chooseCheckpoint(group.steps[0].stop.id, true);
      });
      item.append(anchor);
    } else {
      const details = node("details", "section-group");
      details.open = current?.guideNumber === number;
      const summary = node("summary", "section-link");
      summary.append(node("span", "section-label", group.title));
      if (details.open) summary.setAttribute("aria-current", "location");
      const steps = node("ol", "section-steps");
      for (const { stop, visit } of group.steps) {
        const button = node("button", "section-step", visit ? visit + " · " + stepTitle(stop) : stepTitle(stop));
        button.type = "button";
        button.dataset.checkpoint = stop.id;
        if (stop.checkpointIds.includes(state.checkpoint)) button.setAttribute("aria-current", "step");
        button.addEventListener("click", () => chooseCheckpoint(stop.id, true));
        const row = node("li");
        row.append(button);
        steps.append(row);
      }
      details.append(summary, steps);
      item.append(details);
    }
    rows.push(item);
  }
  container.replaceChildren(...rows);
  byId("route-section-count").textContent = String(rows.length);
}

let sectionCloseTimer;
let afterSectionClose;

function closeSectionDrawer(afterClose) {
  const drawer = byId("section-drawer");
  if (!drawer.open) {
    afterClose?.();
    return;
  }
  if (afterClose) afterSectionClose = afterClose;
  if (drawer.dataset.closing) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawer.close();
    return;
  }
  drawer.dataset.closing = "true";
  sectionCloseTimer = window.setTimeout(() => drawer.close(), 220);
}

function chooseCheckpoint(id, focus = false) {
  if (state.saving) return;
  state.checkpoint = id;
  if (stopById(id)) {
    try { localStorage.setItem("pharloom-guide-step", id); } catch { /* Reading position is optional. */ }
  }
  status("split-status", "");
  renderEditor();
  renderSectionNavigation();
  if (focus) closeSectionDrawer(() => {
    byId("entry-title").focus({ preventScroll: true });
    byId("guide-step").scrollIntoView({ block: "start" });
  });
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
    title.addEventListener("click", () => {
      chooseCheckpoint(split.checkpoint);
      byId("split-time").focus();
    });
    details.append(title);
    if (split.note) details.append(node("p", "note", split.note));
    item.append(node("time", "", formatTime(split.seconds, split.precision)), details);
    list.append(item);
  }
  if (!history.length) list.append(node("li", "", "No splits recorded yet."));
}

async function savePickups(ids, checked, categoryId, itemId) {
  if (state.saving) return;
  const runId = state.runId;
  const applyPickups = (data) => {
    const run = data.runs.find((item) => item.id === runId);
    if (!run) throw new Error("This run is no longer in the saved runbook.");
    run.prep = changePickups(run.prep, ids, checked);
    return data;
  };
  const data = applyPickups(structuredClone(state.data));
  await save(data, "prep-status", "Pickup checklist saved.", applyPickups);
  renderPrep();
  if (!byId("prep-drawer").open || byId("prep-drawer").dataset.closing) return;
  const grid = byId("prep-grid");
  const category = grid.querySelector(`[data-prep-category="${categoryId}"]`);
  const expanded = category?.querySelector("details")?.open;
  const control = itemId && expanded
    ? grid.querySelector(`[data-prep="${itemId}"]`)
    : grid.querySelector(`[data-prep-group="${categoryId}"]`);
  (control ?? byId("close-prep")).focus({ preventScroll: true });
}

function pickupProgress(category, picked) {
  const count = `${category.count}/${category.items.length}`;
  if (category.id === "spools") {
    const pairs = category.groups.filter((group) => group.items.every((item) => picked.has(item.id))).length;
    return `${count} fragments · ${pairs}/3 spools · +${pairs} Silk`;
  }
  if (category.id === "masks") {
    const masks = Math.floor(category.count / 4);
    return `${count} shards · +${masks} ${masks === 1 ? "mask" : "masks"}`;
  }
  const prefix = category.optional ? "Optional · " : category.archived ? "Earlier record · " : "";
  return `${prefix}${count}${category.isComplete ? ` · ${category.complete}` : " collected"}`;
}

function renderPrep(reset = false) {
  const run = selectedRun();
  const picked = new Set(run.prep);
  const categories = pickupCategories(state.route, run.prep);
  const planned = categories.filter((category) => !category.optional && !category.archived);
  const total = planned.reduce((sum, category) => sum + category.items.length, 0);
  const count = planned.reduce((sum, category) => sum + category.count, 0);
  byId("prep-run").textContent = `Pickups recorded for ${run.name}.`;
  byId("prep-count").textContent = `${count} of ${total} planned pickups recorded`;
  byId("prep-toggle-count").textContent = `${count}/${total}`;
  byId("open-prep").setAttribute("aria-label", `Open pickup checklist: ${count} of ${total} planned pickups recorded for ${run.name}`);
  const grid = byId("prep-grid");
  const previous = reset ? new Map() : new Map([...grid.children].map((card) => [card.dataset.prepCategory, {
    open: card.querySelector("details").open,
    complete: card.dataset.complete === "true"
  }]));
  grid.replaceChildren();
  for (const category of categories) {
    const card = node("article", "prep-category");
    card.dataset.prepCategory = category.id;
    card.dataset.complete = String(category.isComplete);
    const checkbox = node("input", "prep-group-checkbox");
    checkbox.type = "checkbox";
    checkbox.checked = category.isComplete;
    checkbox.indeterminate = category.count > 0 && !category.isComplete;
    checkbox.dataset.prepGroup = category.id;
    checkbox.setAttribute("aria-labelledby", `prep-category-title-${category.id}`);
    checkbox.setAttribute("aria-describedby", `prep-category-progress-${category.id}`);
    checkbox.title = `Mark all ${category.title.toLowerCase()} collected`;
    checkbox.addEventListener("change", () => savePickups(category.items.map((item) => item.id), checkbox.checked, category.id));
    const details = node("details", "prep-accordion");
    const before = previous.get(category.id);
    details.open = Boolean(before?.open && !(category.isComplete && !before.complete));
    const summary = node("summary");
    const heading = node("span", "prep-category-heading");
    const title = node("strong", "", category.title);
    title.id = `prep-category-title-${category.id}`;
    const progress = node("small", "", pickupProgress(category, picked));
    progress.id = `prep-category-progress-${category.id}`;
    heading.append(title, progress);
    summary.append(heading);
    details.append(summary);
    const body = node("div", "prep-category-body");
    body.append(node("p", "section-description", category.detail));
    for (const group of category.groups) {
      if (category.groups.length > 1) {
        const pairCount = group.items.filter((item) => picked.has(item.id)).length;
        const header = node("div", "panel-heading prep-pair-heading");
        header.append(node("h3", "", group.title), node("span", "count", pairCount === group.items.length ? group.complete : `${pairCount}/${group.items.length}`));
        body.append(header, node("p", "section-description", group.detail));
      }
      const list = node("ul", "prep-items");
      for (const item of group.items) {
        const row = node("li", "prep-item");
        const label = node("label");
        const input = node("input");
        input.type = "checkbox";
        input.checked = picked.has(item.id);
        input.dataset.prep = item.id;
        const copy = node("span", "", item.title);
        copy.append(node("small", "", item.detail));
        label.append(input, copy);
        row.append(label);
        if (item.pin) {
          const pin = link("Map", mapPin(item.pin), "subtle-link");
          pin.setAttribute("aria-label", `Map for ${item.title}`);
          row.append(pin);
        }
        input.addEventListener("change", () => savePickups([item.id], input.checked, category.id, item.id));
        list.append(row);
      }
      body.append(list);
    }
    details.append(body);
    card.append(checkbox, details);
    grid.append(card);
  }
}

function selectRun(id) {
  if (state.saving) return;
  state.runId = id;
  const run = selectedRun();
  if (!stopById(state.checkpoint) && !run.splits.some((split) => split.checkpoint === state.checkpoint)) {
    let remembered;
    try { remembered = localStorage.getItem("pharloom-guide-step"); } catch { /* Start at the beginning. */ }
    state.checkpoint = guideStopById(remembered)?.id ?? state.guideStops[0].id;
  }
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
  renderSectionNavigation();
  renderHistory();
  renderPrep(true);
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

    const label = previous?.label ?? stopById(id)?.title ?? id;
    run.splits = [...others, { checkpoint: id, label, ...time, note: byId("split-note").value.trim() }];
    if (await save(data, "split-status", `Saved ${formatTime(time.seconds, time.precision)} · ${label}`)) {
      renderMetrics();
      renderEditor();
      renderSectionNavigation();
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
  const sectionDrawer = byId("section-drawer");
  byId("open-sections").addEventListener("click", () => {
    renderSectionNavigation();
    sectionDrawer.showModal();
    byId("open-sections").setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("sections-open");
    const currentStep = sectionDrawer.querySelector('.section-step[aria-current="step"]')
      ?? sectionDrawer.querySelector('.section-link[aria-current="location"]');
    currentStep?.scrollIntoView({ block: "nearest" });
  });
  byId("close-sections").addEventListener("click", () => closeSectionDrawer());
  sectionDrawer.addEventListener("cancel", (event) => { event.preventDefault(); closeSectionDrawer(); });
  sectionDrawer.addEventListener("click", (event) => {
    if (event.target !== sectionDrawer) return;
    const bounds = sectionDrawer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeSectionDrawer();
  });
  sectionDrawer.addEventListener("animationend", (event) => {
    if (event.target === sectionDrawer && sectionDrawer.dataset.closing) sectionDrawer.close();
  });
  sectionDrawer.addEventListener("close", () => {
    window.clearTimeout(sectionCloseTimer);
    delete sectionDrawer.dataset.closing;
    byId("open-sections").setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("sections-open");
    const afterClose = afterSectionClose;
    afterSectionClose = null;
    afterClose?.();
  });
  const prepDrawer = byId("prep-drawer");
  let prepCloseTimer;
  function closePrep() {
    if (!prepDrawer.open || prepDrawer.dataset.closing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prepDrawer.close();
      return;
    }
    prepDrawer.dataset.closing = "true";
    prepCloseTimer = window.setTimeout(() => prepDrawer.close(), 220);
  }
  byId("open-prep").addEventListener("click", () => {
    status("prep-status", "");
    prepDrawer.showModal();
    byId("open-prep").setAttribute("aria-expanded", "true");
    document.documentElement.classList.add("prep-open");
  });
  byId("close-prep").addEventListener("click", closePrep);
  prepDrawer.addEventListener("cancel", (event) => { event.preventDefault(); closePrep(); });
  prepDrawer.addEventListener("click", (event) => {
    if (event.target !== prepDrawer) return;
    const bounds = prepDrawer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePrep();
  });
  prepDrawer.addEventListener("animationend", (event) => {
    if (event.target === prepDrawer && prepDrawer.dataset.closing) prepDrawer.close();
  });
  prepDrawer.addEventListener("close", () => {
    window.clearTimeout(prepCloseTimer);
    delete prepDrawer.dataset.closing;
    byId("open-prep").setAttribute("aria-expanded", "false");
    document.documentElement.classList.remove("prep-open");
  });
  byId("open-maps").addEventListener("click", (event) => {
    event.preventDefault();
    byId("maps").open = true;
    closeSectionDrawer(() => {
      byId("maps").querySelector("summary").focus({ preventScroll: true });
      byId("maps").scrollIntoView({ block: "start" });
    });
  });
  for (const [id, delta] of [["previous-step", -1], ["next-step", 1]]) {
    byId(id).addEventListener("click", () => {
      const current = guideStopById(state.checkpoint);
      const index = state.guideStops.findIndex((stop) => stop.id === current?.id);
      const next = state.guideStops[index + delta];
      if (index >= 0 && next) chooseCheckpoint(next.id, true);
    });
  }
  byId("log-this-step").addEventListener("click", () => {
    byId("run-tools").open = true;
    byId("split-time").focus();
  });
  byId("guide-map-tabs").addEventListener("keydown", (event) => {
    const tabs = [...byId("guide-map-tabs").children];
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    const target = { ArrowLeft: (index - 1 + tabs.length) % tabs.length, ArrowRight: (index + 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    tabs[target].click();
    tabs[target].focus();
  });
  byId("open-current-map").addEventListener("click", () => {
    const image = state.maps.images.find((image) => image.id === state.activeMap);
    if (!image) return;
    byId("map-viewer-title").textContent = image.title;
    byId("map-viewer-image").src = image.src;
    byId("map-viewer-image").alt = image.title;
    byId("map-viewport").dataset.zoom = "fit";
    byId("map-zoom").textContent = "Actual size";
    byId("map-zoom").setAttribute("aria-pressed", "false");
    byId("map-viewer").showModal();
    byId("map-viewport").scrollTo(0, 0);
  });
  byId("map-zoom").addEventListener("click", () => {
    const actual = byId("map-viewport").dataset.zoom !== "actual";
    byId("map-viewport").dataset.zoom = actual ? "actual" : "fit";
    byId("map-zoom").textContent = actual ? "Fit map" : "Actual size";
    byId("map-zoom").setAttribute("aria-pressed", String(actual));
  });
  byId("close-map").addEventListener("click", () => byId("map-viewer").close());
  dialog.addEventListener("cancel", (event) => { if (state.saving) event.preventDefault(); });
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
      chooseCheckpoint(state.guideStops[0].id, true);
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
    bindEvents();
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

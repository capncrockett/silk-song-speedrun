import { changeCursedProgress } from "../model.mjs";
import { save } from "./api.mjs";
import { byId, links, node, status } from "./dom.mjs";
import { selectedRun, state } from "./state.mjs";

function syncChecks() {
  const checked = new Set(selectedRun().cursed?.checks);
  for (const stage of byId("cursed-stages").children) {
    const inputs = [...stage.querySelectorAll("[data-cursed-check]")];
    for (const input of inputs) input.checked = checked.has(input.dataset.cursedCheck);
    stage.querySelector(".count").textContent = `${inputs.filter((input) => input.checked).length}/${inputs.length}`;
  }
  const shards = byId("cursed-stages").querySelectorAll('[data-cursed-check^="cursed-shard-"]:checked').length;
  byId("cursed-shard-count").textContent = `${shards} of 8 additional shards confirmed`;
}

function showRun(id) {
  state.runId = id;
  const run = selectedRun();
  byId("run-select").value = id;
  const picked = new Set(run.prep);
  const shards = state.route.preparations.find((group) => group.id === "masks").items
    .filter((item) => picked.has(item.id)).length;
  const needle = picked.has("needle-second") ? "Needle upgrade #2" : picked.has("needle-first") ? "Needle upgrade #1" : "";
  byId("cursed-baseline").textContent = `Speedrun record for ${run.name} · ${shards} mask shards${needle ? ` · ${needle}` : ""}. Verify in the game inventory.`;
  byId("cursed-notes").value = run.cursed?.notes ?? "";
  for (const message of byId("cursed-page").querySelectorAll(".form-status")) status(message.id, "");
  syncChecks();
}

async function saveProgress(change, statusId, message) {
  if (state.saving) return;
  try {
    const next = changeCursedProgress(state.route.cursedGuide, state.data, state.runId, change);
    await save(next, statusId, message);
  } catch (error) {
    status(statusId, error.message, true);
  }
}

function renderTask(step, statusId) {
  const row = node("li");
  const label = node("label");
  const input = node("input");
  input.type = "checkbox";
  input.dataset.cursedCheck = step.id;
  input.dataset.write = "";
  input.addEventListener("change", async () => {
    const restoreFocus = document.activeElement === input;
    row.append(byId(statusId));
    await saveProgress({ id: step.id, checked: input.checked }, statusId, "Checklist saved.");
    syncChecks();
    if (restoreFocus && document.activeElement === document.body) input.focus({ preventScroll: true });
  });
  label.append(input, node("span", "", step.title));
  row.append(label);
  if (step.detail) {
    const detail = node("p", "cursed-detail", step.detail);
    detail.id = `${step.id}-detail`;
    input.setAttribute("aria-describedby", detail.id);
    row.append(detail);
  }
  return row;
}

function renderStage(stage, index) {
  const details = node("details", "panel collapsible cursed-stage");
  details.id = stage.id;
  details.open = index === 0;
  const summary = node("summary");
  summary.append(node("span", "", stage.title), node("span", "count"));
  const body = node("div", "cursed-stage-body");
  if (stage.note) body.append(node("p", "cursed-note", stage.note));
  if (stage.id === "cursed-masks") {
    const count = node("p", "cursed-goal");
    count.id = "cursed-shard-count";
    body.append(count);
  }
  const message = node("p", "form-status");
  message.id = `${stage.id}-status`;
  message.setAttribute("role", "status");
  const tasks = node("ul", "cursed-tasks");
  tasks.append(...stage.steps.map((step) => renderTask(step, message.id)));
  const references = node("div", "links");
  references.append(...links(stage.links));
  body.append(tasks, message, references);
  details.append(summary, body);
  return details;
}

export function initCursed() {
  const plan = state.route.cursedGuide;
  byId("cursed-intro").textContent = plan.intro;
  byId("cursed-goal").textContent = plan.goal;
  byId("cursed-stages").replaceChildren(...plan.stages.map(renderStage));

  const picker = byId("run-select");
  picker.replaceChildren(...state.data.runs.map((run) => {
    const option = node("option", "", run.name);
    option.value = run.id;
    return option;
  }));
  const url = new URL(location.href);
  const available = (id) => state.data.runs.some((run) => run.id === id);
  const requested = url.searchParams.get("run");
  const defaultId = available(plan.defaultRunId) ? plan.defaultRunId : state.data.runs.at(-1).id;
  showRun(available(requested) ? requested : defaultId);
  picker.addEventListener("change", () => {
    const id = picker.value;
    url.searchParams.set("run", id);
    history.replaceState(null, "", url);
    showRun(id);
  });
  byId("cursed-notes-form").addEventListener("submit", (event) => {
    event.preventDefault();
    saveProgress({ notes: byId("cursed-notes").value }, "cursed-notes-status", "Attempt notes saved.");
  });
  byId("cursed-page").hidden = false;
}

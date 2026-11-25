import { changeCursedProgress } from "../model.mjs";
import { save } from "./api.mjs";
import { byId, links, node, status } from "./dom.mjs";
import { selectedRun, state } from "./state.mjs";

function syncChecks() {
  const checked = new Set(selectedRun().cursed?.checks);
  for (const stage of byId("cursed-stages").children) {
    const inputs = [...stage.querySelectorAll("[data-cursed-check]")];
    for (const input of inputs) input.checked = checked.has(input.dataset.cursedCheck);
    const ids = new Set(inputs.map((input) => input.dataset.cursedCheck));
    stage.querySelector(".count").textContent = `${[...ids].filter((id) => checked.has(id)).length}/${ids.size}`;
  }
  const shards = new Set([...byId("cursed-stages").querySelectorAll('[data-cursed-check^="cursed-shard-"]:checked')]
    .map((input) => input.dataset.cursedCheck));
  byId("cursed-shard-count").textContent = `${shards.size} of 8 additional shards confirmed`;
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

function renderTask(step, statusId, contextId) {
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
    detail.id = `${contextId}-detail`;
    input.setAttribute("aria-describedby", detail.id);
    row.append(detail);
  }
  return row;
}

function renderStage(stage, index, tasksById) {
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
  const resolveTask = (step) => ({ ...tasksById.get(step.ref), ...step });
  tasks.append(...stage.steps.map((step) => {
    const contextId = `${stage.id}-${step.id ?? step.ref}`;
    const row = renderTask(resolveTask(step), message.id, contextId);
    if (step.nearby?.length) {
      const nearby = node("ul", "cursed-tasks cursed-nearby");
      nearby.append(...step.nearby.map((reference) =>
        renderTask(resolveTask(reference), message.id, `${contextId}-${reference.ref}`)
      ));
      row.append(nearby);
    }
    return row;
  }));
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
  const tasksById = new Map(plan.stages.flatMap((stage) => stage.steps)
    .filter((step) => step.id).map((step) => [step.id, step]));
  byId("cursed-stages").replaceChildren(...plan.stages.map((stage, index) => renderStage(stage, index, tasksById)));

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

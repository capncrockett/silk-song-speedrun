import { formatTime, runSummary } from "../model.mjs";
import { save } from "./api.mjs";
import { saveSplit } from "./splits.mjs";
import { byId, node, status } from "./dom.mjs";
import { selectedRun, splitLabel, state, stopById } from "./state.mjs";

// App callbacks connect run selection and split editing to the guide.
export function createRunLog({ onSelectRun, onNavigate, onSplitSaved }) {
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
      for (const stop of section.stops.filter((item) => item.recordSplit !== false)) {
        const option = node("option", "", stop.title);
        option.value = stop.id;
        group.append(option);
      }
      select.append(group);
    }
    const legacy = selectedRun().splits.filter((split) => !stopById(split.checkpoint) || stopById(split.checkpoint).recordSplit === false);
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
    const saved = run.splits.find((split) => split.checkpoint === state.checkpoint);
    const select = byId("checkpoint-select");
    select.querySelector('option[value=""]')?.remove();
    select.value = state.checkpoint;
    if (!select.value) {
      const placeholder = node("option", "", "Choose a checkpoint");
      placeholder.value = "";
      placeholder.disabled = true;
      select.prepend(placeholder);
      select.value = "";
    }
    byId("split-fields").hidden = !select.value;
    byId("split-time").value = saved ? formatTime(saved.seconds, saved.precision) : "";
    byId("split-note").value = saved?.note ?? "";
    byId("save-split").textContent = saved ? "Update split →" : "Save split →";
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
        onNavigate(split.checkpoint);
        byId("split-time").focus();
      });
      details.append(title);
      if (split.note) details.append(node("p", "note", split.note));
      item.append(node("time", "", formatTime(split.seconds, split.precision)), details);
      list.append(item);
    }
    if (!history.length) list.append(node("li", "", "No splits recorded yet."));
  }

  function nextRunName() {
    const numbers = state.data.runs.map((run) => Number(run.name.match(/^Run #(\d+)$/)?.[1] ?? 0));
    return `Run #${Math.max(2, ...numbers) + 1}`;
  }

  function render() {
    const run = selectedRun();
    byId("run-notes").value = run.notes;
    byId("run-notes-title").textContent = run.mode === "scout" ? "Scout observations" : "Run notes";
    byId("run-notes-panel").open = run.mode === "scout";
    byId("run-notes").placeholder = run.mode === "scout" ? "Record attempts, runbacks, loadout, and what to try next." : "Anything to remember for the final run.";
    byId("notes-label").textContent = run.name;
    renderRunPicker();
    renderMetrics();
    renderCheckpointOptions();
    renderEditor();
    renderHistory();
  }

  function refreshSplits(checkpoint) {
    renderMetrics();
    renderHistory();
    if (checkpoint === state.checkpoint) renderEditor();
  }

  function bindEvents() {
    byId("run-select").addEventListener("change", (event) => onSelectRun(event.target.value));
    byId("checkpoint-select").addEventListener("change", (event) => onNavigate(event.target.value));
    byId("split-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!byId("checkpoint-select").value) return;
      const id = state.checkpoint;
      if (await saveSplit({ checkpoint: id, time: byId("split-time").value, note: byId("split-note").value, statusId: "split-status" })) {
        refreshSplits(id);
        onSplitSaved(id);
      } else if (!state.saving) byId("split-time").focus();
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
    byId("log-this-step").addEventListener("click", () => {
      byId("run-tools").open = true;
      const control = byId("checkpoint-select").value ? byId("split-time") : byId("checkpoint-select");
      control.focus();
    });
    dialog.addEventListener("cancel", (event) => { if (state.saving) event.preventDefault(); });
    byId("split-form").addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (!state.saving && byId("checkpoint-select").value) byId("split-form").requestSubmit();
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
        onSelectRun(run.id);
        onNavigate(state.guideStops[0].id, true);
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

  return { render, renderEditor, refreshSplits, bindEvents };
}

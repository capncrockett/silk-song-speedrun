import { changeSplit, formatTime } from "../model.mjs";
import { save } from "./api.mjs";
import { node, status } from "./dom.mjs";
import { selectedRun, state, stopById } from "./state.mjs";

// Both editors use this revision-protected path. Split saves never rebase stale run snapshots.
export async function saveSplit({ checkpoint, time, note, statusId }) {
  if (state.saving) return false;
  let next;
  try {
    next = changeSplit(state.route, state.data, state.runId, { checkpoint, time, note });
  } catch (error) {
    status(statusId, error.message, true);
    return false;
  }
  const split = selectedRun(next).splits.find((item) => item.checkpoint === checkpoint);
  return save(next, statusId, `Saved ${formatTime(split.seconds, split.precision)} · ${split.label}`);
}

export function createInlineSplits({ onSaved }) {
  const controls = new Map();

  function sync(checkpoint) {
    const run = selectedRun();
    for (const [id, control] of controls) {
      if (checkpoint && id !== checkpoint) continue;
      const split = run.splits.find((item) => item.checkpoint === id);
      control.input.value = split ? formatTime(split.seconds, split.precision) : "";
      control.button.textContent = split ? "Update split" : "Save split";
      control.record.textContent = `${run.name} · ${split ? `Saved ${formatTime(split.seconds, split.precision)}` : "No time recorded"}`;
      status(control.statusId, split ? `Saved ${formatTime(split.seconds, split.precision)} · ${split.label}` : "");
    }
  }

  function render({ checkpoint, when }) {
    const stop = stopById(checkpoint);
    if (!stop || stop.recordSplit === false) return null;
    const form = node("form", "inline-split");
    form.dataset.inlineSplit = checkpoint;
    form.setAttribute("aria-label", `Record split: ${stop.title}`);
    form.append(node("p", "eyebrow", "Record a split here"), node("h4", "", stop.title));
    const cue = node("p", "inline-split-point", when);
    cue.id = `inline-split-point-${checkpoint}`;
    const record = node("p", "inline-split-record");
    const row = node("div", "inline-split-controls");
    const field = node("div", "inline-split-field");
    const label = node("label", "", "In-game time");
    const input = node("input");
    input.id = `inline-split-time-${checkpoint}`;
    input.type = "text";
    input.placeholder = "0:00:00";
    input.maxLength = 20;
    input.autocomplete = "off";
    input.spellcheck = false;
    input.required = true;
    input.disabled = state.saving;
    input.dataset.splitInput = checkpoint;
    input.setAttribute("aria-describedby", `${cue.id} inline-split-help-${checkpoint}`);
    label.htmlFor = input.id;
    field.append(label, input);
    const button = node("button", "button secondary");
    button.type = "submit";
    button.dataset.write = "";
    button.disabled = state.saving;
    row.append(field, button);
    const help = node("p", "field-help", "Hours : minutes, or hours : minutes : seconds. Existing split notes are kept.");
    help.id = `inline-split-help-${checkpoint}`;
    const message = node("p", "form-status");
    message.id = `inline-split-status-${checkpoint}`;
    message.setAttribute("role", "status");
    form.append(cue, record, row, help, message);
    controls.set(checkpoint, { input, button, record, statusId: message.id });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (state.saving) return;
      if (await saveSplit({ checkpoint, time: input.value, statusId: message.id })) onSaved(checkpoint);
      input.focus({ preventScroll: true });
    });
    form.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (!state.saving) form.requestSubmit();
      }
    });
    // Initial render does not announce an old time as a new save.
    const split = selectedRun().splits.find((item) => item.checkpoint === checkpoint);
    input.value = split ? formatTime(split.seconds, split.precision) : "";
    button.textContent = split ? "Update split" : "Save split";
    record.textContent = `${selectedRun().name} · ${split ? `Saved ${formatTime(split.seconds, split.precision)}` : "No time recorded"}`;
    return form;
  }

  return { render, sync, reset: () => controls.clear() };
}

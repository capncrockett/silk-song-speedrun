import { byId, status } from "./dom.mjs";
import { state } from "./state.mjs";

export async function getJson(path, options) {
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
  for (const control of document.querySelectorAll("[data-write], [data-prep], [data-prep-group], [data-guide-pickup], [data-split-input], #rosary-wallet, #split-form input, #split-form select, #split-form textarea, #run-notes, #new-run-name")) {
    control.disabled = value;
  }
}

// Only a successful response replaces state.data. Pickup callers supply a narrow rebase.
export async function save(next, statusId, success, rebase) {
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

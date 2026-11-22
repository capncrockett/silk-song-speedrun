import { changePickups, pickupCategories } from "../model.mjs";
import { save } from "./api.mjs";
import { byId, link, mapPin, node, status } from "./dom.mjs";
import { createDrawer } from "./drawers.mjs";
import { selectedRun, state } from "./state.mjs";

let onSaved = () => {};

function syncGuidePickups() {
  const picked = new Set(selectedRun().prep);
  for (const input of document.querySelectorAll("[data-guide-pickup]")) {
    input.checked = picked.has(input.dataset.guidePickup);
    input.disabled = state.saving;
    input.closest("label").classList.toggle("is-collected", input.checked);
  }
}

// Capture the run before saving; reapply only the requested pickup IDs on conflict.
export async function savePickups(ids, checked, categoryId, itemId, statusId = "prep-status") {
  if (state.saving) return;
  const runId = state.runId;
  const applyPickups = (data) => {
    const run = data.runs.find((item) => item.id === runId);
    if (!run) throw new Error("This run is no longer in the saved runbook.");
    run.prep = changePickups(run.prep, ids, checked);
    return data;
  };
  const data = applyPickups(structuredClone(state.data));
  const saved = await save(data, statusId, "Pickup checklist saved.", applyPickups);
  renderPrep();
  if (saved) onSaved();
  if (statusId !== "prep-status" && !byId("prep-drawer").open) {
    document.querySelector(`[data-guide-pickup="${itemId}"]`)?.focus({ preventScroll: true });
  }
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
    return `${count} fragments · ${pairs}/${category.groups.length} spools · +${pairs} Silk`;
  }
  if (category.id === "masks") {
    const masks = Math.floor(category.count / 4);
    return `${count} shards · +${masks} ${masks === 1 ? "mask" : "masks"}`;
  }
  const prefix = category.optional ? "Optional · " : category.archived ? "Earlier record · " : "";
  return `${prefix}${count}${category.isComplete ? ` · ${category.complete}` : " collected"}`;
}

export function renderPrep(reset = false) {
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
  syncGuidePickups();
}

export function bindPickupEvents({ onSaved: afterSave } = {}) {
  onSaved = afterSave ?? (() => {});
  createDrawer({
    id: "prep-drawer",
    openId: "open-prep",
    closeId: "close-prep",
    pageClass: "prep-open",
    beforeOpen: () => status("prep-status", "")
  });
}

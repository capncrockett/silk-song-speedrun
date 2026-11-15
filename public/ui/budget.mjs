import { changeRosaryBudget, isPurchasePaid, rosaryBudget, shoppingSummary } from "../model.mjs";
import { save } from "./api.mjs";
import { byId, node, status } from "./dom.mjs";
import { guideStopById, selectedRun, state } from "./state.mjs";

export function createBudget({ onPurchaseSaved }) {
  function formatRange(minimum, maximum) {
    const min = minimum.toLocaleString("en-US");
    return minimum === maximum ? min : `${min}–${maximum.toLocaleString("en-US")}`;
  }

  async function saveChange(change, statusId) {
    if (state.saving) return false;
    let next;
    try {
      next = changeRosaryBudget(state.route, state.data, state.runId, change);
    } catch (error) {
      status(statusId, error.message, true);
      return false;
    }
    return save(next, statusId, "Purchase checklist saved.");
  }

  function purchaseCheckbox(purchase, statusId) {
    const input = node("input");
    input.type = "checkbox";
    input.checked = isPurchasePaid(purchase, selectedRun());
    input.disabled = state.saving;
    input.dataset.purchase = purchase.id;
    input.dataset.write = "";
    input.setAttribute("aria-label", `Mark ${purchase.item} paid`);
    input.addEventListener("change", async () => {
      const paid = input.checked;
      if (await saveChange({ purchaseId: purchase.id, paid }, statusId)) onPurchaseSaved();
      render();
      const replacement = document.querySelector(`#${statusId === "shopping-status" ? "shopping-items" : "rosary-purchases"} [data-purchase="${purchase.id}"]`);
      const fallback = statusId === "shopping-status"
        ? byId("shopping-reminder").hidden ? byId("log-this-step") : byId("shopping-reminder").querySelector("summary")
        : byId("close-prep");
      (replacement ?? fallback).focus({ preventScroll: true });
    });
    return input;
  }

  function purchaseRow(purchase, statusId, showStop = false) {
    const row = node("li");
    const label = node("label", "purchase-label");
    const title = node("span", "", purchase.item);
    if (showStop) title.append(node("small", "", purchase.stopTitle));
    if (purchase.optional) title.append(node("small", "", "Optional bench"));
    if (purchase.conditional) title.append(node("small", "", purchase.conditional));
    if (purchase.rosaries > 0) label.append(purchaseCheckbox(purchase, statusId));
    label.append(title);
    row.classList.toggle("is-paid", isPurchasePaid(purchase, selectedRun()));
    const costs = [];
    if (purchase.rosaries) costs.push(`${purchase.rosaries.toLocaleString("en-US")} rosaries`);
    if (purchase.materials) costs.push(purchase.materials);
    row.append(label, node("span", "shopping-cost", costs.join(" + ") || "Free"));
    return row;
  }

  function renderShopping(checkpoint) {
    const summary = shoppingSummary(state.route, checkpoint, selectedRun());
    byId("shopping-reminder").hidden = !summary;
    if (!summary) return;
    const { stop, minimum, maximum } = summary;
    byId("shopping-stop").textContent = stop.guideTitle ?? stop.title;
    const optional = stop.purchases.filter((purchase) => purchase.optional).reduce((sum, purchase) => sum + purchase.rosaries, 0);
    byId("shopping-total").textContent = maximum === 0
      ? optional > 0 ? `${optional.toLocaleString("en-US")} rosaries · optional` : "No rosaries"
      : `${formatRange(minimum, maximum)} rosaries`;
    byId("shopping-items").replaceChildren(...stop.purchases.map((purchase) => purchaseRow(purchase, "shopping-status")));
    byId("shopping-note").textContent = stop.shoppingNote ?? "Planned purchases at this stop. Check a purchase when paid.";
  }

  function render() {
    const guide = guideStopById(state.checkpoint);
    const checkpoint = guide?.checkpointIds[0] ?? state.checkpoint;
    const run = selectedRun();
    const budget = rosaryBudget(state.route, run);
    renderShopping(checkpoint);
    byId("rosary-total").textContent = `${formatRange(budget.minimum, budget.maximum)} rosaries`;
    byId("rosary-scope").textContent = `${budget.remaining.length} required ${budget.remaining.length === 1 ? "purchase" : "purchases"} left for this run`;
    byId("rosary-optional").textContent = budget.optionalTotal > 0 ? `Optional benches: ${budget.optionalTotal.toLocaleString("en-US")} rosaries extra` : "";
    byId("rosary-purchases").replaceChildren(...budget.purchases.map((purchase) => purchaseRow(purchase, "rosary-purchase-status", true)));
    byId("rosary-plan-count").textContent = `${budget.purchases.filter((purchase) => purchase.paid).length}/${budget.purchases.length} paid`;
    byId("rosary-plan").hidden = budget.purchases.length === 0;
  }

  return { render };
}

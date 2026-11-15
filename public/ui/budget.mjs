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
    return save(next, statusId, Object.hasOwn(change, "wallet") ? "Wallet saved." : "Purchase checklist saved.");
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
      const fallback = statusId === "shopping-status" && !byId("shopping-reminder").hidden
        ? byId("shopping-reminder") : byId("rosary-budget");
      (replacement ?? fallback.querySelector("summary")).focus({ preventScroll: true });
    });
    return input;
  }

  function purchaseRow(purchase, statusId, showStop = false) {
    const row = node("li");
    const label = node("label", "purchase-label");
    const title = node("span", "", purchase.item);
    if (showStop) title.append(node("small", "", purchase.stopTitle));
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
    byId("shopping-total").textContent = maximum === 0 ? "No rosaries" : `${formatRange(minimum, maximum)} rosaries`;
    byId("shopping-items").replaceChildren(...stop.purchases.map((purchase) => purchaseRow(purchase, "shopping-status")));
    byId("shopping-note").textContent = stop.shoppingNote ?? "Planned purchases at this stop. Check a purchase when paid.";
  }

  function render({ resetWallet = false } = {}) {
    const guide = guideStopById(state.checkpoint);
    const checkpoint = guide?.checkpointIds[0] ?? state.checkpoint;
    const run = selectedRun();
    const budget = rosaryBudget(state.route, run, checkpoint);
    byId("rosary-budget").hidden = !budget;
    renderShopping(checkpoint);
    if (!budget) return;
    const step = state.guideStops.findIndex((stop) => stop.id === guide?.id) + 1;
    byId("rosary-total").textContent = `${formatRange(budget.minimum, budget.maximum)} rosaries left`;
    byId("rosary-scope").textContent = `${run.name} · ${budget.remaining.length} ${budget.remaining.length === 1 ? "purchase" : "purchases"} left from step ${step} to the finish`;
    const wallet = byId("rosary-wallet");
    if (resetWallet || wallet.dataset.run !== run.id) {
      wallet.value = budget.wallet ?? "";
      wallet.dataset.run = run.id;
      status("rosary-wallet-status", "");
      status("rosary-purchase-status", "");
      status("shopping-status", "");
    }
    byId("rosary-wallet-saved").textContent = budget.wallet === null
      ? "No wallet balance saved."
      : `Saved wallet: ${budget.wallet.toLocaleString("en-US")} rosaries.`;
    const coverage = byId("rosary-coverage");
    coverage.dataset.tone = budget.shortfall ? "short" : "covered";
    coverage.textContent = budget.wallet === null ? "Enter your current wallet to see how much more you need."
      : budget.shortfall > 0 ? `Need ${budget.shortfall.toLocaleString("en-US")} more rosaries.`
      : `Remaining purchases covered · ${budget.surplus.toLocaleString("en-US")} rosaries to spare.`;
    byId("rosary-purchases").replaceChildren(...budget.purchases.map((purchase) => purchaseRow(purchase, "rosary-purchase-status", true)));
    byId("rosary-plan-count").textContent = `${budget.purchases.filter((purchase) => purchase.paid).length}/${budget.purchases.length} paid`;
    byId("rosary-plan").hidden = budget.purchases.length === 0;
  }

  function bindEvents() {
    byId("rosary-wallet-form").addEventListener("submit", async (event) => {
      event.preventDefault();
      if (await saveChange({ wallet: byId("rosary-wallet").value }, "rosary-wallet-status")) render();
      byId("rosary-wallet").focus({ preventScroll: true });
    });
  }

  return { render, bindEvents };
}

import { pickupCategories, shoppingSummary } from "../model.mjs";
import { byId, link, links, node, status } from "./dom.mjs";
import { createDrawer } from "./drawers.mjs";
import { renderStepMaps } from "./maps.mjs";
import { savePickups } from "./pickups.mjs";
import { guideStopById, selectedRun, splitLabel, state, stepTitle, stopById } from "./state.mjs";

// Navigation is coordinated by app.mjs so the guide never imports the run log.
export function createGuide({ onNavigate }) {
  let sectionDrawer;

  function renderGuideInstructions(containerId, instructions, pickups = [], references = []) {
    const picked = new Set(selectedRun().prep);
    const metadata = new Map(pickupCategories(state.route, selectedRun().prep).flatMap((category) =>
      category.items.map((item) => [item.id, { ...item, categoryId: category.id }])
    ));
    const statusId = containerId === "detour-steps" ? "detour-pickup-status" : "guide-pickup-status";
    byId(containerId).replaceChildren(...instructions.map((text, index) => {
      const row = node("li");
      const annotations = pickups.filter((item) => item.instruction === index + 1)
        .map((item) => ({ ...item, start: text.indexOf(item.text) }))
        .filter((item) => item.start >= 0 && metadata.has(item.id))
        .sort((a, b) => a.start - b.start);
      let offset = 0;
      for (const annotation of annotations) {
        if (annotation.start < offset) continue;
        row.append(document.createTextNode(text.slice(offset, annotation.start)));
        const item = metadata.get(annotation.id);
        const label = node("label", "guide-pickup");
        label.classList.toggle("is-collected", picked.has(item.id));
        const input = node("input");
        input.type = "checkbox";
        input.checked = picked.has(item.id);
        input.disabled = state.saving;
        input.dataset.guidePickup = item.id;
        input.setAttribute("aria-label", `Mark ${item.title} collected`);
        input.setAttribute("aria-describedby", "prep-run");
        input.title = item.detail;
        input.addEventListener("change", () =>
          savePickups([item.id], input.checked, item.categoryId, item.id, statusId)
        );
        label.append(input, node("span", "", annotation.text));
        row.append(label);
        offset = annotation.start + annotation.text.length;
      }
      row.append(document.createTextNode(text.slice(offset)));
      for (const reference of references.filter((item) => item.instruction === index + 1)) {
        const line = node("p", "guide-reference");
        line.append(link(reference.title, reference.url, "subtle-link"));
        row.append(line);
      }
      return row;
    }));
    status(statusId, "");
  }

  function renderGuide() {
    const run = selectedRun();
    const stop = guideStopById(state.checkpoint) ?? stopById(state.checkpoint);
    const saved = run.splits.find((split) => split.checkpoint === state.checkpoint);
    const section = state.route.sections.find((section) => section.id === stop?.sectionId);
    const index = state.guideStops.findIndex((item) => item.id === stop?.id);
    byId("entry-kicker").textContent = section ? `Garmond guide · section ${section.guideNumber}${section.visit ? " · " + section.visit : ""}` : "Historical step";
    byId("entry-title").textContent = section?.title ?? (saved ? splitLabel(saved) : "Choose a route step");
    byId("entry-step-title").textContent = stop ? stepTitle(stop) : "";
    byId("guide-position").textContent = index >= 0 ? `Step ${index + 1} of ${state.guideStops.length}` : "Earlier route";
    byId("previous-step").disabled = index <= 0;
    byId("next-step").disabled = index < 0 || index === state.guideStops.length - 1;
    const nextStop = state.guideStops[index + 1];
    byId("guide-next-label").textContent = stop && nextStop ? `Up next · ${stepTitle(nextStop)}` : stop ? "The end of your route." : "This step belongs to an earlier route version.";
    renderGuideInstructions("guide-directions", stop?.guide ?? ["This historical split is preserved in the run log."], stop?.guidePickups, stop?.guideLinks);
    byId("entry-links").replaceChildren(...links(stop?.links));
    renderStepMaps(stop, section);
    const detour = stop?.optionalDetour;
    byId("optional-detour").hidden = !detour;
    byId("detour-title").textContent = detour?.title ?? "";
    byId("detour-detail").textContent = detour?.detail ?? "";
    renderGuideInstructions("detour-steps", detour?.steps ?? [], detour?.guidePickups, detour?.guideLinks);
    byId("detour-links").replaceChildren(...links(detour?.links));
    renderShopping();
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
          onNavigate(group.steps[0].stop.id, true);
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
          button.addEventListener("click", () => onNavigate(stop.id, true));
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

  function bindEvents() {
    sectionDrawer = createDrawer({
      id: "section-drawer",
      openId: "open-sections",
      closeId: "close-sections",
      pageClass: "sections-open",
      beforeOpen: renderSectionNavigation,
      afterOpen: () => {
        const drawer = byId("section-drawer");
        const currentStep = drawer.querySelector('.section-step[aria-current="step"]')
          ?? drawer.querySelector('.section-link[aria-current="location"]');
        currentStep?.scrollIntoView({ block: "nearest" });
      }
    });
    document.querySelector(".skip-link").addEventListener("click", (event) => {
      event.preventDefault();
      byId("main-content").focus();
    });
    byId("open-maps").addEventListener("click", (event) => {
      event.preventDefault();
      byId("maps").open = true;
      sectionDrawer.close(() => {
        byId("maps").querySelector("summary").focus({ preventScroll: true });
        byId("maps").scrollIntoView({ block: "start" });
      });
    });
    for (const [id, delta] of [["previous-step", -1], ["next-step", 1]]) {
      byId(id).addEventListener("click", () => {
        const current = guideStopById(state.checkpoint);
        const index = state.guideStops.findIndex((stop) => stop.id === current?.id);
        const next = state.guideStops[index + delta];
        if (index >= 0 && next) onNavigate(next.id, true);
      });
    }
  }

  function render() {
    renderGuide();
    renderSectionNavigation();
  }

  function focusCurrentStep() {
    sectionDrawer.close(() => {
      byId("entry-title").focus({ preventScroll: true });
      byId("guide-step").scrollIntoView({ block: "start" });
    });
  }

  return { render, bindEvents, focusCurrentStep };
}

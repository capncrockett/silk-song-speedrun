import { pickupCategories } from "../model.mjs";
import { byId, link, links, node, status } from "./dom.mjs";
import { createDrawer } from "./drawers.mjs";
import { renderStepMaps } from "./maps.mjs";
import { savePickups } from "./pickups.mjs";
import { createInlineSplits } from "./splits.mjs";
import { guideStopById, selectedRun, splitLabel, state, stepTitle, stopById } from "./state.mjs";

// Navigation is coordinated by app.mjs so the guide never imports the run log.
export function createGuide({ onNavigate, onSplitSaved }) {
  const inlineSplits = createInlineSplits({ onSaved: onSplitSaved });
  let sectionDrawer;

  function renderGuideInstructions(containerId, instructions, pickups = [], references = [], splitPoints = []) {
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
      for (const point of splitPoints.filter((item) => item.instruction === index + 1)) {
        const control = inlineSplits.render(point);
        if (control) row.append(control);
      }
      return row;
    }));
    status(statusId, "");
  }

  function renderCursedPreparation() {
    const plan = state.route.cursedGuide;
    byId("cursed-preparation").hidden = !plan;
    if (!plan) return;
    byId("cursed-preparation-title").firstElementChild.textContent = plan.title;
    byId("cursed-intro").textContent = plan.intro;
    byId("cursed-goal").textContent = plan.goal;
    byId("cursed-limits").textContent = plan.limits;
    const focusRun = state.data.runs.find((run) => run.id === plan.runId);
    if (focusRun) {
      const picked = new Set(focusRun.prep);
      const shards = state.route.preparations.find((group) => group.id === "masks").items
        .filter((item) => picked.has(item.id)).length;
      const needle = picked.has("needle-second") ? "Needle Upgrade #2 recorded" : picked.has("needle-first") ? "Needle Upgrade #1 recorded" : "check Needle upgrades";
      byId("cursed-baseline").textContent = `${focusRun.name} starting record: ${shards} mask shards (${5 + Math.floor(shards / 4)} masks) and ${needle}. Check the inventory for any later upgrades before repeating a pickup.`;
    } else {
      byId("cursed-baseline").textContent = "Check the preparation file’s actual masks, Needle and abilities before repeating pickups.";
    }
    const stages = byId("cursed-stages");
    const opened = new Map([...stages.children].map((stage) => [stage.dataset.cursedStage, stage.open]));
    stages.replaceChildren(...plan.stages.map((stage, index) => {
      const details = node("details", "cursed-stage");
      details.dataset.cursedStage = stage.id;
      details.open = opened.get(stage.id) ?? index === 0;
      details.append(node("summary", "", stage.title));
      const list = node("ol");
      list.append(...stage.steps.map((text) => node("li", "", text)));
      const references = node("div", "links");
      references.append(...links(stage.links));
      details.append(list, references);
      return details;
    }));
  }

  function renderGuide() {
    inlineSplits.reset();
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
    const hasContinuation = stop?.id === state.route.finishCheckpoint && Boolean(state.route.cursedGuide);
    byId("continue-cursed").hidden = !hasContinuation;
    byId("guide-next-label").textContent = stop && nextStop ? `Up next · ${stepTitle(nextStop)}` : hasContinuation ? "Timed route complete · untimed preparation below" : stop ? "The end of your route." : "This step belongs to an earlier route version.";
    renderCursedPreparation();
    renderGuideInstructions("guide-directions", stop?.guide ?? ["This historical split is preserved in the run log."], stop?.guidePickups, stop?.guideLinks, stop?.guideSplits);
    byId("entry-links").replaceChildren(...links(stop?.links));
    renderStepMaps(stop, section);
    const detour = stop?.optionalDetour;
    byId("optional-detour").hidden = !detour;
    byId("detour-title").textContent = detour?.title ?? "";
    byId("detour-detail").textContent = detour?.detail ?? "";
    renderGuideInstructions("detour-steps", detour?.steps ?? [], detour?.guidePickups, detour?.guideLinks);
    byId("detour-links").replaceChildren(...links(detour?.links));
  }

  function renderSectionNavigation() {
    const container = byId("section-list");
    const current = state.route.sections.find((section) => section.id === stopById(state.checkpoint)?.sectionId);
    const groups = new Map();
    for (const section of state.route.sections) {
      if (!groups.has(section.guideNumber)) groups.set(section.guideNumber, { title: section.title, steps: [] });
      const group = groups.get(section.guideNumber);
      group.steps.push(...state.guideStops.filter((stop) => stop.sectionId === section.id).map((stop) => ({
        stop,
        visit: section.visit,
        title: section.title === group.title ? null : section.title
      })));
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
        for (const { stop, visit, title } of group.steps) {
          const button = node("button", "section-step", title ?? (visit ? visit + " · " + stepTitle(stop) : stepTitle(stop)));
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
    byId("continue-cursed").addEventListener("click", (event) => {
      event.preventDefault();
      byId("cursed-preparation").open = true;
      byId("cursed-preparation-title").focus({ preventScroll: true });
      byId("cursed-preparation").scrollIntoView({ block: "start" });
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

  return { render, bindEvents, focusCurrentStep, syncSplits: inlineSplits.sync };
}

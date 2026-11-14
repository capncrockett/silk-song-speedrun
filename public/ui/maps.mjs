import { byId, link, node } from "./dom.mjs";
import { guideStopById, state, stopById } from "./state.mjs";

export function renderMaps() {
  const images = state.maps.images.filter((image) => image.timedRoute);
  const mapCount = images.filter((image) => image.kind === "map").length;
  byId("map-count").textContent = `${mapCount} maps · ${images.length - mapCount} screenshots`;
  byId("map-gallery").replaceChildren(...images.map((image) => {
    const card = link("", image.src, "atlas-card");
    const preview = node("img");
    preview.src = image.src;
    preview.alt = "";
    preview.loading = "lazy";
    preview.width = image.width;
    preview.height = image.height;
    const caption = node("span");
    caption.append(node("small", "", image.custom ? image.draft ? "CUSTOM ROUTE DRAFT" : "SUPPLIED SCREENSHOT" : image.kind === "map" ? "GUIDE REFERENCE MAP" : "GUIDE SCREENSHOT"));
    const title = node("strong", "", image.title);
    const arrow = node("b", "", "↗");
    arrow.setAttribute("aria-hidden", "true");
    title.append(arrow);
    caption.append(title, node("p", "atlas-note", image.note));
    card.append(preview, caption);
    return card;
  }));
  byId("map-gaps").textContent = `Missing original guide maps: ${state.maps.missing.map((image) => image.title + (image.replacement ? " (replacement available)" : "")).join("; ")}. Checkpoint notes and map pins cover these stops. The guide does not mark spool fragments.`;
}

function renderGuideMapKeys(image) {
  const container = byId("guide-map-keys");
  const checkpointIds = guideStopById(state.checkpoint)?.checkpointIds ?? [state.checkpoint];
  const sections = (state.route.guideSections ?? []).filter((section) =>
    section.steps.some((id) => checkpointIds.includes(id)) && section.maps.includes(image?.id)
  );
  container.hidden = sections.length === 0;
  container.replaceChildren(...sections.map((section) => {
    const block = node("section", "guide-map-key");
    const currentSection = state.route.sections.find((item) => item.id === stopById(state.checkpoint)?.sectionId);
    block.append(node("p", "eyebrow", "Garmond guide · map key"), node("h3", "", section.title === currentSection?.title ? "Map key" : section.title));
    block.append(node("p", "map-key-intro", image?.keyIntro ?? "Numbers match the original map. Yellow lines mark map branches: take planned stops, use optional stops as needed, and skip branches labeled Skip. Follow the numbered walkthrough below."));
    if (section.note) block.append(node("p", "map-key-note", section.note));
    const columns = node("div", "map-key-columns");
    for (const [title, items] of [["Guide checkpoints", section.checkpoints], [section.detoursTitle ?? "Map branches", section.detours]]) {
      if (!items.length) continue;
      const group = node("div", "map-key-group");
      const list = node("ul", "map-key-list");
      list.replaceChildren(...items.map((item) => node("li", "", item)));
      group.append(node("h4", "", title), list);
      columns.append(group);
    }
    block.append(columns, link("Open Tay Bravo’s original guide", state.maps.guide, "subtle-link map-key-source"));
    return block;
  }));
}

function renderGuideMap() {
  const image = state.maps.images.find((image) => image.id === state.activeMap);
  byId("guide-map-panel").hidden = !image;
  const stop = guideStopById(state.checkpoint) ?? stopById(state.checkpoint);
  const section = state.route.sections.find((item) => item.id === stop?.sectionId);
  const gap = stop?.mapNote ?? section?.mapNote ?? (image?.id === "overview" ? "The detailed area map is still missing. Use the written directions and map pins here; the overview shows the broader route." : "");
  byId("guide-map-gap").hidden = !gap;
  byId("guide-map-gap").textContent = gap;
  renderGuideMapKeys(image);
  if (!image) return;
  for (const tab of byId("guide-map-tabs").children) {
    const selected = tab.dataset.map === image.id;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
  const panel = byId("guide-map-panel");
  if (byId("guide-map-tabs").children.length > 1) {
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `map-tab-${image.id}`);
  } else {
    panel.removeAttribute("role");
    panel.setAttribute("aria-labelledby", "guide-map-title");
  }
  byId("guide-map-image").src = image.src;
  byId("guide-map-image").alt = image.title;
  byId("guide-map-image").width = image.width;
  byId("guide-map-image").height = image.height;
  byId("guide-map-title").textContent = image.title;
  byId("guide-map-note").textContent = image.note;
  byId("open-current-map").setAttribute("aria-label", `Enlarge ${image.title}`);
}

export function renderStepMaps(stop, section) {
  const maps = (stop?.maps ?? section?.maps ?? []).map((id) => state.maps.images.find((image) => image.id === id));
  if (state.activeSection !== section?.id || !maps.some((image) => image.id === state.activeMap)) state.activeMap = maps[0]?.id ?? null;
  state.activeSection = section?.id ?? null;
  byId("guide-map-tabs").replaceChildren(...(maps.length > 1 ? maps : []).map((image) => {
    const tab = node("button", "map-tab", image.title);
    tab.type = "button";
    tab.id = `map-tab-${image.id}`;
    tab.dataset.map = image.id;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-controls", "guide-map-panel");
    tab.addEventListener("click", () => { state.activeMap = image.id; renderGuideMap(); });
    return tab;
  }));
  renderGuideMap();
}

export function bindMapEvents() {
  byId("guide-map-tabs").addEventListener("keydown", (event) => {
    const tabs = [...byId("guide-map-tabs").children];
    const index = tabs.indexOf(document.activeElement);
    if (index < 0) return;
    const target = { ArrowLeft: (index - 1 + tabs.length) % tabs.length, ArrowRight: (index + 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    tabs[target].click();
    tabs[target].focus();
  });
  byId("open-current-map").addEventListener("click", () => {
    const image = state.maps.images.find((image) => image.id === state.activeMap);
    if (!image) return;
    byId("map-viewer-title").textContent = image.title;
    byId("map-viewer-image").src = image.src;
    byId("map-viewer-image").alt = image.title;
    byId("map-viewport").dataset.zoom = "fit";
    byId("map-zoom").textContent = "Actual size";
    byId("map-zoom").setAttribute("aria-pressed", "false");
    byId("map-viewer").showModal();
    byId("map-viewport").scrollTo(0, 0);
  });
  byId("map-zoom").addEventListener("click", () => {
    const actual = byId("map-viewport").dataset.zoom !== "actual";
    byId("map-viewport").dataset.zoom = actual ? "actual" : "fit";
    byId("map-zoom").textContent = actual ? "Fit map" : "Actual size";
    byId("map-zoom").setAttribute("aria-pressed", String(actual));
  });
  byId("close-map").addEventListener("click", () => byId("map-viewer").close());
}

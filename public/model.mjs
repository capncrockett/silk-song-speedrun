const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SECONDS = 999 * 3600 + 3599;

export function parseTime(input) {
  const text = input.trim();
  const clock = text.match(/^(\d{1,3}):(\d{1,2})(?::(\d{1,2}))?$/);
  const words = text.match(/^(\d{1,3})\s*h(?:\s*(\d{1,2})\s*m)?(?:\s*(\d{1,2})\s*s)?$/i);
  const match = clock ?? words;
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  if (minutes > 59 || seconds > 59) return null;
  return {
    seconds: hours * 3600 + minutes * 60 + seconds,
    precision: match[3] === undefined ? "minute" : "second"
  };
}

export function formatTime(total, precision = "minute") {
  const hours = Math.floor(total / 3600);
  const minutes = String(Math.floor(total / 60) % 60).padStart(2, "0");
  const seconds = String(total % 60).padStart(2, "0");
  return precision === "second" ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`;
}

export function listStops(route) {
  return route.sections.flatMap((section) =>
    section.stops.map((stop) => ({ ...stop, sectionId: section.id }))
  );
}

export function listGuideStops(route) {
  const stops = listStops(route);
  const groups = new Map();
  for (const stop of stops) {
    const id = stop.guideStep ?? stop.id;
    if (!groups.has(id)) groups.set(id, []);
    groups.get(id).push(stop);
  }
  return [...groups].map(([id, members]) => {
    const primary = members.find((stop) => stop.id === id);
    const first = stops.indexOf(members[0]);
    if (!primary || members.some((stop, index) =>
      stop.sectionId !== primary.sectionId || stops[first + index]?.id !== stop.id
    ) || primary !== members.at(-1)) {
      throw new Error("A combined guide page must end at its checkpoint and stay within one consecutive section.");
    }
    const checkpointIds = members.map((stop) => stop.id);
    if (members.length === 1) return { ...primary, checkpointIds };
    return {
      ...primary,
      checkpointIds,
      guide: members.flatMap((stop) => stop.guide),
      maps: [...new Set(members.flatMap((stop) => stop.maps ??
        route.sections.find((section) => section.id === stop.sectionId).maps))],
      links: members.flatMap((stop) => stop.links ?? []),
      purchases: members.flatMap((stop) => stop.purchases ?? []),
      shoppingNote: members.find((stop) => stop.purchases?.length)?.shoppingNote,
      tip: members.map((stop) => stop.tip).filter(Boolean).join(" ")
    };
  });
}

export function pickupCategories(route, picked = []) {
  const collected = new Set(picked);
  const categories = new Map();
  for (const group of route.preparations) {
    if (group.archived && !group.items.some((item) => collected.has(item.id))) continue;
    const id = group.category ?? group.id;
    if (!categories.has(id)) {
      const metadata = route.pickupCategories?.find((category) => category.id === id) ?? group;
      categories.set(id, { ...metadata, id, groups: [], items: [] });
    }
    const category = categories.get(id);
    category.groups.push(group);
    category.items.push(...group.items);
  }
  return [...categories.values()].map((category) => {
    const count = category.items.filter((item) => collected.has(item.id)).length;
    return { ...category, count, isComplete: count === category.items.length };
  });
}

export function changePickups(picked, ids, checked) {
  const changed = new Set(ids);
  return checked ? [...new Set([...picked, ...ids])] : picked.filter((id) => !changed.has(id));
}

export function shoppingSummary(route, checkpoint) {
  const stops = listStops(route);
  const index = stops.findIndex((stop) => stop.id === checkpoint);
  if (index < 0) return null;
  const stop = stops.slice(index).find((stop) => stop.purchases?.length);
  if (!stop) return null;
  return {
    stop,
    minimum: stop.purchases.filter((item) => !item.conditional).reduce((sum, item) => sum + item.rosaries, 0),
    maximum: stop.purchases.reduce((sum, item) => sum + item.rosaries, 0)
  };
}

export function runSummary(route, run) {
  const stops = listStops(route);
  const recorded = new Set(run.splits.map((split) => split.checkpoint));
  const history = [...run.splits].sort((a, b) => a.seconds - b.seconds);
  const finish = run.splits.find((split) => split.checkpoint === route.finishCheckpoint);
  const furthest = stops.findLastIndex((stop) => recorded.has(stop.id));
  return {
    latest: history.at(-1) ?? null,
    finish: finish ?? null,
    underTarget: run.mode === "scout" || !finish ? null : finish.seconds < route.targetSeconds,
    next: finish ? null : stops[furthest + 1] ?? null,
    count: stops.filter((stop) => recorded.has(stop.id)).length,
    total: stops.length,
    history
  };
}

export function validateRunData(data) {
  if (data?.version !== 1 || !Number.isSafeInteger(data.revision) || data.revision < 0 ||
      !Array.isArray(data.runs) || data.runs.length < 1) {
    throw new Error("Run data needs a version, revision, and at least one run.");
  }

  const runIds = new Set();
  for (const run of data.runs) {
    if (!run || typeof run.id !== "string" || !ID.test(run.id) || runIds.has(run.id) ||
        typeof run.name !== "string" || !run.name.trim() || run.name.length > 60 ||
        !["timed", "scout"].includes(run.mode) || typeof run.notes !== "string" ||
        run.notes.length > 20_000 || !Array.isArray(run.prep) || !Array.isArray(run.splits)) {
      throw new Error("A run has invalid details.");
    }
    runIds.add(run.id);
    if (run.prep.some((id) => typeof id !== "string" || !ID.test(id)) ||
        new Set(run.prep).size !== run.prep.length) {
      throw new Error("A run has invalid preparation items.");
    }

    const splitIds = new Set();
    for (const split of run.splits) {
      if (!split || typeof split.checkpoint !== "string" || !ID.test(split.checkpoint) ||
          splitIds.has(split.checkpoint) || !Number.isSafeInteger(split.seconds) ||
          split.seconds < 0 || split.seconds > MAX_SECONDS ||
          !["minute", "second"].includes(split.precision) ||
          (split.precision === "minute" && split.seconds % 60 !== 0) ||
          typeof split.note !== "string" || split.note.length > 4000 ||
          (split.label !== undefined && (typeof split.label !== "string" || split.label.length > 160))) {
        throw new Error("A split has an invalid time, note, or checkpoint.");
      }
      splitIds.add(split.checkpoint);
    }
  }
}

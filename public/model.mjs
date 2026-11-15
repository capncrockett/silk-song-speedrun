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

// Shared by the instruction forms and the Run log. Omitted notes retain their saved value.
export function changeSplit(route, data, runId, { checkpoint, time: value, note }) {
  const time = parseTime(value);
  if (!time) throw new Error("Enter a time like 4:57 or 4:57:32.");
  const next = structuredClone(data);
  const run = next.runs.find((item) => item.id === runId);
  if (!run) throw new Error("This run is no longer in the saved runbook.");
  const stop = listStops(route).find((item) => item.id === checkpoint);
  const previous = run.splits.find((split) => split.checkpoint === checkpoint);
  if ((!stop || stop.recordSplit === false) && !previous) {
    throw new Error("This checkpoint is only available for editing an existing historical split.");
  }
  const finish = run.splits.find((split) => split.checkpoint === route.finishCheckpoint);
  const others = run.splits.filter((split) => split.checkpoint !== checkpoint);
  if ((checkpoint === route.finishCheckpoint && others.some((split) => split.seconds > time.seconds)) ||
      (checkpoint !== route.finishCheckpoint && finish && time.seconds > finish.seconds)) {
    throw new Error("The finish time must be at or after the other recorded splits.");
  }
  run.splits = [...others, {
    checkpoint,
    label: previous?.label ?? stop?.title ?? checkpoint,
    ...time,
    note: note === undefined ? previous?.note ?? "" : note.trim()
  }];
  return next;
}

export function listStops(route) {
  return route.sections.flatMap((section) =>
    section.stops.map((stop) => ({ ...stop, sectionId: section.id }))
  );
}

export function listRecordingStops(route) {
  return listStops(route).filter((stop) => stop.recordSplit !== false);
}

function mergeGuideAnnotations(members, field) {
  let offset = 0;
  return members.flatMap((stop) => {
    const annotations = (stop[field] ?? []).map((item) => ({
      ...item, instruction: item.instruction + offset
    }));
    offset += stop.guide.length;
    return annotations;
  });
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
      guidePickups: mergeGuideAnnotations(members, "guidePickups"),
      guideLinks: mergeGuideAnnotations(members, "guideLinks"),
      guideSplits: mergeGuideAnnotations(members, "guideSplits"),
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

export function isPurchasePaid(purchase, run) {
  return purchase.pickupId
    ? run.prep.includes(purchase.pickupId)
    : (run.rosaryBudget?.paid ?? []).includes(purchase.id);
}

// Reading position scopes a spending forecast; it never marks a purchase paid.
export function rosaryBudget(route, run, checkpoint) {
  const stops = listStops(route);
  const index = stops.findIndex((stop) => stop.id === checkpoint);
  if (index < 0) return null;
  const purchases = stops.slice(index).flatMap((stop) => (stop.purchases ?? [])
    .filter((purchase) => purchase.rosaries > 0)
    .map((purchase) => ({ ...purchase, checkpoint: stop.id, stopTitle: stop.guideTitle ?? stop.title,
      paid: isPurchasePaid(purchase, run) })));
  const remaining = purchases.filter((purchase) => !purchase.paid);
  const minimum = remaining.filter((purchase) => !purchase.conditional).reduce((sum, purchase) => sum + purchase.rosaries, 0);
  const maximum = remaining.reduce((sum, purchase) => sum + purchase.rosaries, 0);
  const wallet = run.rosaryBudget?.wallet ?? null;
  return { purchases, remaining, minimum, maximum, wallet,
    shortfall: wallet === null ? null : Math.max(0, maximum - wallet),
    surplus: wallet === null ? null : Math.max(0, wallet - maximum) };
}

export function changeRosaryBudget(route, data, runId, change) {
  const next = structuredClone(data);
  const run = next.runs.find((item) => item.id === runId);
  if (!run) throw new Error("This run is no longer in the saved runbook.");
  if (Object.hasOwn(change, "wallet")) {
    const value = change.wallet.trim();
    const wallet = value === "" ? null : Number(value);
    if (wallet !== null && (!/^\d+$/.test(value) || !Number.isSafeInteger(wallet))) {
      throw new Error("Enter a whole rosary amount of zero or more, or clear the field.");
    }
    run.rosaryBudget = { ...run.rosaryBudget, wallet, paid: run.rosaryBudget?.paid ?? [] };
  } else {
    const purchase = listStops(route).flatMap((stop) => stop.purchases ?? [])
      .find((item) => item.id === change.purchaseId);
    if (!purchase || purchase.rosaries <= 0 || typeof change.paid !== "boolean") {
      throw new Error("Choose a planned rosary purchase.");
    }
    if (purchase.pickupId) run.prep = changePickups(run.prep, [purchase.pickupId], change.paid);
    else run.rosaryBudget = { ...run.rosaryBudget, wallet: run.rosaryBudget?.wallet ?? null,
      paid: changePickups(run.rosaryBudget?.paid ?? [], [purchase.id], change.paid) };
  }
  return next;
}

export function shoppingSummary(route, checkpoint, run) {
  const stops = listStops(route);
  const index = stops.findIndex((stop) => stop.id === checkpoint);
  if (index < 0) return null;
  const stop = stops.slice(index).map((stop) => ({ ...stop,
    purchases: (stop.purchases ?? []).filter((purchase) => !run || !isPurchasePaid(purchase, run))
  })).find((stop) => stop.purchases.length);
  if (!stop) return null;
  return {
    stop,
    minimum: stop.purchases.filter((item) => !item.conditional).reduce((sum, item) => sum + item.rosaries, 0),
    maximum: stop.purchases.reduce((sum, item) => sum + item.rosaries, 0)
  };
}

export function runSummary(route, run) {
  const stops = listRecordingStops(route);
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
    if (run.rosaryBudget !== undefined) {
      const budget = run.rosaryBudget;
      if (!budget || (budget.wallet !== null && (!Number.isSafeInteger(budget.wallet) || budget.wallet < 0)) ||
          !Array.isArray(budget.paid) || budget.paid.some((id) => typeof id !== "string" || !ID.test(id)) ||
          new Set(budget.paid).size !== budget.paid.length) {
        throw new Error("A run has an invalid rosary budget.");
      }
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

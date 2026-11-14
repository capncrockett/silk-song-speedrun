// One browser state shared by the features; persisted domain rules live in ../model.mjs.
export const state = {
  route: null,
  data: null,
  maps: null,
  runId: null,
  checkpoint: null,
  activeMap: null,
  activeSection: null,
  stops: [],
  guideStops: [],
  saving: false
};

export function selectedRun(data = state.data) {
  return data.runs.find((run) => run.id === state.runId);
}

export function stopById(id) {
  return state.stops.find((stop) => stop.id === id);
}

export function guideStopById(id) {
  return state.guideStops.find((stop) => stop.checkpointIds.includes(id));
}

export function splitLabel(split) {
  return split.label ?? stopById(split.checkpoint)?.title ?? split.checkpoint;
}

export function stepTitle(stop) {
  return stop.guideTitle ?? stop.title;
}

# Pharloom Runbook

A local Silksong run tracker for one route: Hunter Crest, all five bells, Last Judge, Garmond & Zaza for High Halls, then the Act 2 ending. Run #2 is already in the tracker through the **4:57 Lace 2 clear**.

## Open the tracker

With Node.js 20 or newer, run this from the repository:

```sh
npm start
```

Open [the local tracker](http://127.0.0.1:4173). The server prints the address as well. No packages need to be installed.

- **Tracker** logs the in-game clock at each checkpoint. Use `4:57` or `4:57:32`, with an optional note. Select a logged checkpoint to correct it.
- **New run** starts a separate timed run or scout session. Run #2 stays available in the picker.
- **My route** contains the single route, map pins, the recovered maps, and per-run checklists for spool pairs and the two upgrade targets.
- **Handoff** lists the scout tests and lets you copy the full Codex brief.

Splits, notes, and checked pickups save to `.runbook/runs.json`. The **Download run data** button makes a backup. Git ignores this save directory. Copy it as well if you move the tracker to another folder or Mac.

## Update with Codex

Open this folder as a project and ask Codex to read [HANDOFF.md](./HANDOFF.md). The running route lives in [data/route.json](./data/route.json). Changes to its notes, maps, and checklist items appear after a refresh. Keep existing checkpoint IDs when rewriting a label or moving a checkpoint.

- [Starting Run #2 data](./data/seed-runs.json) is used until the first local save.
- [Original run log](./Silksong%20-%20Current%20Run%20Tracker.md) and [project notes](./Silksong%20-%20Project%20Handoff.md) are the history behind the tracker.
- [Recovered maps](./Recovered%20Garmond%20Maps/README.md) preserve the three original images and their credits.

Run `npm run check` to check the route data, saved-time format, and app syntax.

# Pharloom Runbook

A local Silksong run tracker for one route: Hunter Crest, all five bells, Last Judge, Garmond & Zaza for High Halls, then the Act 2 ending. Run #2 is already in the tracker through the **4:57 Lace 2 clear**.

## Open the tracker

With Node.js 20 or newer, run this from the repository:

```sh
npm start
```

Open [the local tracker](http://127.0.0.1:4173). The server prints the address as well. No packages need to be installed.

- **Run tracker** logs the in-game clock at each checkpoint. Use `4:57` or `4:57:32`, with an optional note. Select a recorded checkpoint to correct it; Command+Enter (Control+Enter on Windows/Linux) saves the split. The five-hour budget is measured at the latest recorded split. There is no running timer.
- **New session** starts a blank timed run or separate scout session. The session picker works from every view. Run #2 stays available, and new timed runs show its recorded time at matching checkpoints for comparison.
- **The route** contains the one timed path, exact map pins, and the three recovered reference maps with credits.
- **Preparation** keeps pickups for the selected session. A completed spool pair adds one Silk capacity; one half adds none. Pouch and damage upgrades are counted independently, and the second Crafting Kit counts once regardless of source.
- **Scout queue** lists the open tests, links to the research, and lets you copy the full Codex brief or start a practice session. Scout observations open automatically in that session's notes and remain separate from timed runs.

A run stays in progress until a Grand Mother Silk finish split is saved. The goal is strictly below `5:00:00`; exactly five hours does not meet it. Run #2's 26 reported splits and their precision are preserved, including its historical backtrack. The finish remains blank.

Splits, notes, and checked pickups save to `.runbook/runs.json`. The **Download run data** button makes a backup. Git ignores this save directory. Copy it as well if you move the tracker to another folder or Mac.

## Update with Codex

Open this folder as a project and ask Codex to read [HANDOFF.md](./HANDOFF.md). The running route lives in [data/route.json](./data/route.json). Changes to its notes, maps, and checklist items appear after a refresh. Keep existing checkpoint IDs when rewriting a label or moving a checkpoint.

- [Starting Run #2 data](./data/seed-runs.json) is used until the first local save.
- [Original run log](./Silksong%20-%20Current%20Run%20Tracker.md) and [project notes](./Silksong%20-%20Project%20Handoff.md) are the history behind the tracker.
- [Recovered maps](./Recovered%20Garmond%20Maps/README.md) preserve the three original images and their credits.

The server listens only on your Mac. To use another port, run `RUNBOOK_PORT=4174 npm start`. For an isolated test save, set `RUNBOOK_DATA_DIR` to a different directory before starting. Neither setting requires installing anything.

Run `npm run check` to check the route data, historical splits, five-hour boundary, saved-time format, local assets, and app syntax.

# Pharloom Runbook

A local Silksong run tracker for one route: Hunter Crest, all five bells, Last Judge, Garmond & Zaza for High Halls, then the Act 2 ending. Run #2 is already in the tracker through the **4:57 Lace 2 clear**.

## Open the tracker

With Node.js 20 or newer, run this from the repository:

```sh
npm start
```

Open [the local tracker](http://127.0.0.1:4173). The server prints the address as well. No packages need to be installed.

The app is one screen for the final timed attempt:

- Pick a checkpoint in **Along the way** to see its route reminders, exact map pins, and split entry together. Use `4:57` or `4:57:32`; Command+Enter (Control+Enter on Windows/Linux) saves. Select a recorded checkpoint to correct it.
- **Upcoming purchases** shows the next planned spending stop at or after the selected checkpoint. Expand it for item costs, materials, and conditional fees. It is a shopping reminder, not a wallet tracker; it makes no claims about historical purchases.
- **Prepare final run** creates a blank timed run. Run #2 stays in the picker and provides checkpoint comparisons. Existing scout records remain separate and accessible.
- **Pickups & upgrades**, **Reference maps**, **Split history**, and **Run notes** expand inline when needed. The six selected fragments form three pairs for +3 Silk capacity; the pouch and damage targets remain independent. Previously recorded pickups from older route versions remain visible when checked.
- **Route decisions & research** opens the handoff. Open questions and alternative loadouts live there while the chosen route stays in the tracker.

The five-hour budget is measured at the latest recorded split. There is no running timer.

A run stays in progress until a Grand Mother Silk finish split is saved. The goal is strictly below `5:00:00`; exactly five hours does not meet it. Run #2's 26 reported splits and their precision are preserved, including its historical backtrack. The finish remains blank.

Splits, notes, and checked pickups save to `.runbook/runs.json`. The **Export run data** button makes a backup. Git ignores this save directory. Copy it as well if you move the tracker to another folder or Mac.

## Update with Codex

Open this folder as a project and ask Codex to read [HANDOFF.md](./HANDOFF.md). The running route lives in [data/route.json](./data/route.json). Changes to its notes, maps, and checklist items appear after a refresh. Keep existing checkpoint IDs when rewriting a label or moving a checkpoint.

- [Starting Run #2 data](./data/seed-runs.json) is used until the first local save.
- [Original run log](./Silksong%20-%20Current%20Run%20Tracker.md) and [project notes](./Silksong%20-%20Project%20Handoff.md) are the history behind the tracker.
- [Recovered maps](./Recovered%20Garmond%20Maps/README.md) preserve the three original images and their credits.

The server listens only on your Mac. To use another port, run `RUNBOOK_PORT=4174 npm start`. For an isolated test save, set `RUNBOOK_DATA_DIR` to a different directory before starting. Neither setting requires installing anything.

Run `npm run check` to check the route data, historical splits, five-hour boundary, saved-time format, local assets, and app syntax.

## Artwork

The header icon and browser icon use the supplied [Hornet mask](./hornet-mask-icon.png). The tracker header uses the supplied [Hornet PNG](./hornet.png); [the WebP alternate](./hornet.webp) is retained with the original assets. These local files are served directly, with no external image service.

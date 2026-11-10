# Pharloom Runbook

A local Silksong walkthrough for one chosen route: Hunter Crest, all five bells, Last Judge, Garmond & Zaza for High Halls, then the Act 2 ending. The active local run log now records **Run #2 finished at 5:26:16**, with GMS defeated on attempt six. The starting import retains the original **4:57 Lace 2** snapshot.

## Open the guide

With Node.js 20 or newer, run this from the repository:

```sh
npm start
```

Open [the local guide](http://127.0.0.1:4173). The server prints the address as well. No packages need to be installed.

The main screen is a guide for the final run:

- **Route contents** selects any of the 31 steps across seven sections. **Previous** and **Next** move through the walkthrough without recording anything. Your reading position is remembered in this browser, independently of the selected run; the first visit starts at Silkspear.
- Each step shows its **map screenshots inline** and **numbered written directions**. When a step has multiple references, use the image tabs. Click an image to enlarge it, switch between fit and actual size, and scroll around. Close the viewer or press Escape to return.
- **Prepare for Lace 2** includes a closed optional Fractured Mask detour: rest at Cogwork Core bench 478428, take the late pickup without resting en route, then quit-return to Core to equip it. Keep Mirror if skipping the trip.
- **Upcoming purchases** starts open and shows the next planned spending stop, rosary costs, materials, and conditional fees. The amounts are spending reminders; they do not assume your current wallet balance.
- **Expand all** and **Collapse all** control the seven route sections. On narrow screens, open **Route contents** to choose a step. The fixed **Pickups** button opens a checklist drawer from any step, with the selected run and collected count shown inside. It slides in from the right; close it with **Close**, Escape, or the backdrop. The saved checklist is shared across the route for that run. All planned pickups are grouped in accordions: spools, mask shards, pouches, kits, abilities, Needle/Hunter upgrades, tools, key/melodies, and materials/lockets. The large heading checkbox marks or clears the whole category and shows a partial state when only some are recorded. Checking the final item closes the category automatically; its completion stays visible while closed. Optional Mask/restock items have their own category and do not block the planned total. Existing checkmarks are preserved; newly listed items start unrecorded. **All reference maps** opens the complete relevant gallery.
- **Run log** is closed by default. Open it to choose a timed or scout session, prepare the final run, record or correct splits, read history, save notes, or export data. Times accept `4:57` or `4:57:32`; Command+Enter (Control+Enter on Windows/Linux) saves a split. Saving and switching sessions keep your place in the guide. **Record a split for this step** opens the log at the current step.
- **Route decisions & research** opens the handoff, where alternatives remain archived.

The five-hour budget is measured at the latest recorded split. There is no running timer.

A run stays in progress until a Grand Mother Silk finish split is saved. The goal is strictly below `5:00:00`; exactly five hours does not meet it. The starting import preserves Run #2’s original 26 splits through Lace 2 at 4:57. The active save adds the later 5:06 Mask/restock endpoint and the **5:26:16 finish**, preserving all original splits and their precision.

Splits, notes, and checked pickups save to `.runbook/runs.json`. The **Export run data** button makes a backup. Git ignores this save directory. Copy it as well if you move the runbook to another folder or Mac.

## Update with Codex

Open this folder as a project and ask Codex to read [HANDOFF.md](./HANDOFF.md). The running route lives in [data/route.json](./data/route.json). Each step’s `guide` array supplies the numbered directions; `guideTitle` optionally supplies its reading title while historical split labels stay intact. Changes to its directions, maps, and checklist items appear after a refresh. Keep existing checkpoint IDs when rewriting a label or moving a checkpoint.

- [Starting Run #2 data](./data/seed-runs.json) is used until the first local save.
- [Original run log](./Silksong%20-%20Current%20Run%20Tracker.md) and [project notes](./Silksong%20-%20Project%20Handoff.md) are the history behind the tracker.
- [Recovered maps](./Recovered%20Garmond%20Maps/README.md) preserve 19 original guide images and their credits. Checkpoints link to the relevant maps; guide-only alternatives stay archived. See the catalog instructions there to add your own screenshots.

The server listens only on your Mac. To use another port, run `RUNBOOK_PORT=4174 npm start`. For an isolated test save, set `RUNBOOK_DATA_DIR` to a different directory before starting. Neither setting requires installing anything.

Run `npm run check` to check the route data, historical splits, five-hour boundary, saved-time format, local assets, and app syntax.

## Artwork

The header icon and browser icon use the supplied [Hornet mask](./hornet-mask-icon.png). The guide header uses the supplied [Hornet PNG](./hornet.png); [the WebP alternate](./hornet.webp) is retained with the original assets. These local files are served directly, with no external image service.

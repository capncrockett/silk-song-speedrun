# Code map

The app uses native JavaScript modules, a local Node server, and JSON files.
There is no package installation or build step. Start it with `npm start`.
Read [HANDOFF.md](../HANDOFF.md) for route decisions and current run context.

## Find the right file

| Change | File |
|---|---|
| Walkthrough copy, map selection, pickups, purchases | [data/route.json](../data/route.json) |
| Startup, run selection, reading position, cross-feature refreshes | [public/app.mjs](../public/app.mjs) |
| Guide headings, instructions, inline pickup placement, sections | [guide.mjs](../public/ui/guide.mjs) |
| Map gallery, keys, tabs, enlarged viewer and zoom | [maps.mjs](../public/ui/maps.mjs) |
| Pickup saving, drawer, counts, category completion, inline synchronization | [pickups.mjs](../public/ui/pickups.mjs) |
| Pinned Pickups rosary total, paid purchases and next-stop shopping | [budget.mjs](../public/ui/budget.mjs) |
| Inline timing forms and shared revision-protected split saving | [splits.mjs](../public/ui/splits.mjs) |
| Run picker, metrics, split editor/history, notes, creation, export | [run-log.mjs](../public/ui/run-log.mjs) |
| Shared browser state and selectors | [state.mjs](../public/ui/state.mjs) |
| Fetching, save requests, saving lock and failure indicators | [api.mjs](../public/ui/api.mjs) |
| Drawer animation, Escape, backdrop and after-close callbacks | [drawers.mjs](../public/ui/drawers.mjs) |
| Small DOM helpers | [dom.mjs](../public/ui/dom.mjs) |
| Pure timing, route, pickup and validation rules | [public/model.mjs](../public/model.mjs) |
| Page structure and styling | [index.html](../public/index.html), [styles.css](../public/styles.css) |
| HTTP endpoints, served-file allowlist and disk saves | [server.mjs](../server.mjs) |
| Data, model, asset and documentation checks | [scripts/check.mjs](../scripts/check.mjs) |
| Browser module syntax, imports and HTTP serving checks | [scripts/check-modules.mjs](../scripts/check-modules.mjs) |

Keep a change in its feature module when possible. Put shared domain rules in
`model.mjs`, independent of the DOM and browser state. Put cross-feature
coordination in `app.mjs`. Use the existing modules before creating another layer.

## State and rendering

`state.mjs` holds the loaded route, runs and map catalog, plus the selected run,
reading position, active map and saving flag. Switching runs preserves reading
position and never implies collected pickups.

The Sections drawer groups by `guideNumber`. When a return visit has a different
section title, its step button uses that custom title; the parent group retains
the first-pass title. Guide headings and split-picker groups use each visit’s
section title.

`app.mjs` creates the guide and run log with explicit callbacks. Navigation
updates the selected checkpoint, renders the guide and split editor, then moves
focus when requested. Run selection renders the run log, guide and pickups.
A saved split refreshes metrics/history and synchronizes its visible timing form.
Pickup saves refresh their drawer and synchronize the existing inline controls,
preserving form edits and focus.

Feature modules bind persistent controls once during startup. Controls created
during rendering receive listeners when created. Keep imports flowing toward
shared helpers and the model; use app callbacks for coordination between features.
Avoid circular imports, global event buses and a second state store. Feature and
shared modules should be safe to import without a DOM; access the page inside
functions. The app entry point starts the browser UI.

## Saving

Make edits to a copy of loaded run data and save through `api.mjs`. Replace
`state.data` only after a successful response. Preserve the saving lock and
visible failure messages.

Pickup conflict retries reapply only the clicked pickup IDs to the latest data
for the run captured when the edit began. Other edits retain revision conflict
protection. Do not retry a whole stale run snapshot automatically.

Instruction timing points live in `data/route.json` as `guideSplits` with an
instruction number, target checkpoint ID and timing cue. `model.mjs` merges
these annotations across combined pages. A point can target a checkpoint whose
reading page is elsewhere when chapter boundaries moved the actual event.
Every current checkpoint has one point; historical-only IDs get no new forms.

`ui/splits.mjs` builds inline time forms and shares `saveSplit` with the Run log.
Pure `changeSplit` in `model.mjs` validates time, finish ordering and historical
edits while preserving prior labels and omitted notes. Both editors use the
existing API revision check without stale-snapshot retries. `app.mjs` connects
successful inline saves to Run log metrics/history and the matching visible
form. Updates target that checkpoint only, preserving other inline drafts and
reading position. Pickup saves do not rebuild the forms. Run selection and
navigation rebuild them for the selected run and guide page.

The server owns disk persistence and revision checks. `.runbook/runs.json` is
the active save; `data/seed-runs.json` is only the initial import. Keep stable
checkpoint and pickup IDs, historical labels, and reported time precision.

Purchase metadata in `data/route.json` has stable IDs and optional `pickupId` links
to existing shop pickups. Pure `rosaryBudget(route, run)` totals every unpaid
required rosary purchase for the whole run, independently of reading position.
Purchases with `optional: true` stay in the checklist but contribute only to
`optionalTotal`, shown separately; the Shellwood arena bench is optional.
`shoppingSummary` still scopes the next-stop reminder to the current page and
retains free/material-only items. `changeRosaryBudget` changes paid checks on a
copied run; `validateRunData` accepts optional per-run `rosaryBudget: { paid }`.
Legacy wallet fields are retained and accepted but unused. The UI has no wallet
entry, balance or shortfall. Retries/restocks are excluded from planned costs.

`ui/budget.mjs` owns the fixed rosary summary in the Pickups drawer, its purchase
checklist in the scrollable body, and next-stop shopping in the guide. Keeping
the summary outside `.prep-drawer-body` pins it while categories scroll. It uses
the existing revision-protected save path without stale-snapshot retries. The
app connects purchased pickup changes to `renderPrep`; pickup saves call back
to refresh the total and purchase list. Updates preserve instruction drafts,
reading position and the drawer’s expanded categories. Run selection displays
that run’s paid checks and total.

## Verify a change

Run `npm run check`. It validates data and assets, checks all browser module
syntax, imports feature modules, and starts an isolated local server to verify
the browser's module URLs and JavaScript content types. It does not save runs.

For UI changes, also exercise the affected interaction in a browser. For tests
that save, start a separate server with `RUNBOOK_DATA_DIR` pointing to a temporary
directory and `RUNBOOK_PORT=0` for an available port. Never use the active save.

For budget changes, verify whole-run arithmetic, pinned placement while scrolling,
paid checks and pickup synchronization in both directions, navigation independence,
run isolation, draft retention, failures/conflicts and save/reload. Use isolated data.

For split-form changes, verify inline and Run log edits, second precision, retained notes/labels, cross-page targets, finish validation, stale-tab conflicts, failed writes and draft/focus retention.

For changes crossing modules, check navigation, run switching, inline/drawer
pickup synchronization and the affected save path. Preserve keyboard focus,
Escape/backdrop closing, and reduced-motion behavior. Test pickup conflicts
with two tabs; test write failures without leaving unconfirmed checkmarks.

When adding a browser module, use relative imports and add its URL to the
`server.mjs` allowlist. Keep this code map current when ownership changes.

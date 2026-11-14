# Working on Pharloom Runbook

- Read [HANDOFF.md](./HANDOFF.md) for the user's route, Run #2 status, and open scout questions.
- Keep the app local and dependency-free. Maintain one timed route and keep research alternatives in the handoff.
- Edit `data/route.json` for route copy and map pins. Keep checkpoint and preparation IDs stable so recorded runs still match.
- Treat `.runbook/runs.json` as the active save after it exists. Use `data/seed-runs.json` for the starting import. Preserve reported times and separate scout from timed results.
- Keep browser source in `public/`, original images and their catalog in `assets/`, and map credits and historical notes in `docs/`. Update the current handoff for new decisions; treat `docs/history.md` as archival.
- For code changes, use [docs/architecture.md](./docs/architecture.md) to find the owning module. Keep `public/app.mjs` focused on startup and cross-feature callbacks; put behavior in the relevant `public/ui/` module and pure domain rules in `public/model.mjs`.
- Preserve one shared browser state and the existing revision-safe save path. Use explicit callbacks for cross-feature updates, and keep the code map current when ownership changes.
- Verify affected browser interactions after UI changes. Use an isolated `RUNBOOK_DATA_DIR` for tests that write; never test against the active save.
- Run `npm run check` after changes.

# Working on Pharloom Runbook

- Read [HANDOFF.md](./HANDOFF.md) for the user's route, Run #2 status, and open scout questions.
- Keep the app local and dependency-free. Maintain one timed route and keep research alternatives in the handoff.
- Edit `data/route.json` for route copy and map pins. Keep checkpoint and preparation IDs stable so recorded runs still match.
- Treat `.runbook/runs.json` as the active save after it exists. Use `data/seed-runs.json` for the starting import. Preserve reported times and separate scout from timed results.
- Keep browser source in `public/`, original images and their catalog in `assets/`, and map credits and historical notes in `docs/`. Update the current handoff for new decisions; treat `docs/history.md` as archival.
- Run `npm run check` after changes.

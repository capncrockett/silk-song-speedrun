# Recovering the route discussions

Joseph reports that the route was developed across roughly five or six ChatGPT conversations. A recovered summary is a source snapshot; its final paragraph is not automatically the latest route decision. The current [handoff](../HANDOFF.md) and active run file remain authoritative for later decisions and recorded clocks.

## Prompt for each earlier chat

Ask each chat to extract its own discussion, across all sections it covered:

```text
Extract our customized Silksong 5-hour route knowledge from THIS conversation, organized by original Garmond guide section.

Include concrete navigation clarifications, pickups, benches/shortcuts, purchases, loadouts, fight tips, experiments, accepted/rejected choices and their reasons, and corrections to earlier advice. Preserve enough navigation detail to follow the route.

Separate:
- My actual observations/results, with the run number or scout file when known.
- Plans I accepted.
- Your suggestions or inferences.
- Unresolved details at the END of THIS chat.

Keep times exactly as I reported them, including original precision. Distinguish collected/equipped items from planned or unconfirmed ones. For important decisions, include a short supporting quote from me if available.

Label this chat’s timeframe or progression endpoint if known; later chats may supersede its pending items. Do not research, fill gaps from the published guide, infer patch changes, or invent missing details. Say unreported when necessary. End with anything the next chat must verify.
```

Paste or attach each response here. Keep its chat title or rough order if available. It is fine if a response overlaps an earlier one; compare the evidence instead of merging claims by majority.

## Recovered sources

| Source | Received | Coverage and state |
|---|---|---|
| [Shellwood to Widow](./recovered-chats/shellwood-widow.md) | November 10, 2026 | Original chat date unknown. Snapshot reaches Widow/Needolin on Run #2; some pending items were completed later. Preserved verbatim. |

## Shellwood reconciliation

The recovered summary adds the arena/Z climb, recommended 40-rosary bench, lift-bottom right shortcut, lower versus upper right exits, and the Gahlia room’s top-right exit. These details are now in the live walkthrough, using Joseph’s unmarked screenshot and the normal Sister Splinter fight.

- **Mask history versus fresh-run plan:** The recovered summary reports the Shellwood shard was only 3/4 because Far Fields had been missed, leaving five masks for Widow. Existing later notes confirm Atla completed six masks, then the missed Far Fields shard was recovered before the Judge route. Run #3 still collects Far Fields on its first pass and targets six masks at Shellwood. A missed-shard recovery is conditional guidance, not a new Run #3 pickup report.
- **Phacia experiment:** The summary reports that the first lure/pogo worked and the second glide/pogo was unreliable. It does not establish a Switch 2 patch or identify a separate scout-file result. Keep this as recovered experiment history; the timed route fights Sister Splinter. Existing Run #2 data records two deaths on that leg without isolating an exact boss-attempt count.
- **Original time precision:** The summary formats Cling Grip, the Widow bench and Widow as 1:21:00, 1:25:00 and 1:36:00. The existing run stores 1:21, 1:25 and 1:36 at minute precision. Preserve those original clocks and precision; add no splits or seconds.
- **Superseded pending items:** The summary leaves Needle Upgrade #1 pending and calls the Cling Grip Bell #3 bypass untested. Later [archived notes](./history.md) explicitly record the first upgrade and the successful above/right Halfway Home, top-right transition, northeast Bell #3 route with Craw Lake skipped. Preserve those later confirmations and the selected bypass.
- **Recommendations remain recommendations:** The 40-rosary bench and lift-door opening are route instructions, not newly confirmed historical purchases/actions. Widow dodge/bell advice comes from the guide; a specific personally successful Sister Splinter attack strategy was not recorded. Save-and-quit after the mask shard was suggested by the guide but not confirmed used; it is not added to the selected path.

## Rules for the next recovered chat

1. Save the supplied text verbatim in docs/recovered-chats/ before editing the route. Record the source’s title, received date, and known progression endpoint; leave the original chat date unknown if absent.
2. Reconcile accepted decisions and confirmed results with the active handoff, run file, and later records. Keep dated/superseded statements in the source; do not silently turn old unknowns into current unknowns.
3. Add concrete missing navigation to data/route.json. Keep alternatives and experimental techniques in the handoff. Keep checkpoint and pickup IDs stable.
4. Do not infer pickups, equipment, attempts, durations, or timing precision from a summary. Preserve .runbook/runs.json and data/seed-runs.json unless Joseph explicitly supplies a record correction to apply.
5. Link the new source and reconciliation from the handoff and this index. Add its Markdown file to the documentation link checks, run npm run check, and commit the coherent update.

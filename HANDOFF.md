# Pharloom Runbook — current handoff

Updated November 23, 2026. The local app is implemented. Joseph finished **Run #4 at 3:27:17** and is preparing **Run #3** for the cursed attempt. This file holds current route decisions, research alternatives, and open scout questions; [README.md](./README.md) covers use and maintenance. The [source archive](./docs/history.md) preserves older notes without serving as a second live handoff.

## Working contract

- Keep one timed route in [data/route.json](./data/route.json), with stable checkpoint and preparation IDs. Historical labels and reported precision survive route edits. The Cursed ending preparation belongs on its own untimed checklist page/view for a chosen existing game file. The current embedded `cursedGuide` is source material for that page, not the intended home inside the main speedrun guide.
- Treat `.runbook/runs.json` as the active save. [data/seed-runs.json](./data/seed-runs.json) remains the original 26-split import ending at **4:57**, with three recorded pickups and no finish. Never replace an existing save with the seed or infer pickups from route progress.
- Keep timed and scout results separate. Use the manual in-game clock, retain idle time and detours, and finish only when a `gms` split is reported. Sub-five is strictly below `5:00:00`.
- Keep the app local and dependency-free. The route keeps 31 original checkpoint IDs and a guide-only Last Judge stop. The 24 current timing points appear across 22 guide pages grouped under the Garmond guide’s 13 sections. The section title is the main heading and the checkpoint is a subtitle. Inline maps, numbered directions, and Previous/Next are the main experience. Guide position starts at Silkspear and persists independently of run selection and split entry.
- Keep the Run log closed by default. The persistent Pickups drawer shares the selected run's checks across all steps; category checkboxes support partial/all states, the last check closes its accordion, and optional items do not block the main total. Retain the five-bell Grand Gate category, four spool pairs, eight-shard mask category, historical checked items, Escape/backdrop closing, reduced-motion support, and inline reference gallery.
- Keep the Garmond guide’s section names, numbered checkpoints, and detours visible with the relevant map screenshot, with custom headings for the Greymoor return, Shellwood/Last Judge, and the Songclave approach and return. Bell numbers follow our pickup order; map checkpoint and detour numbers retain their source numbering. These guide references do not add timed splits. Clearly label missing original maps and distinguish guide options from the selected path. In skip instructions, cite the original G&Z Detour or Checkpoint number inline with a short item name. Keep the wording concise and never invent numbers for unmarked pickups.
- Never show bare MapGenie location IDs in live guide copy, tips, timing cues, map keys or checklist text. Use descriptive landmark names; provide actual MapGenie pin links where useful, including contextual `guideLinks` beside directions. Keep numeric `pin` metadata and existing checkpoint/pickup IDs stable. The source map’s checkpoint and detour numbers remain useful navigation labels.
- Write the timed walkthrough and purchases for collecting every planned pickup in order. Keep old recovery options for missed items in research. Conditional shop entry fees, retries and actual supply needs still apply. The selected Mask trip follows Conductor’s Melody and returns to High Halls bench.
- Discuss unresolved route choices **one question or pickup at a time**. Keep alternatives here; update the route only when a choice changes. Run `npm run check` after changes and commit coherent work.

## Next task · separate Cursed ending checklist page

**Latest direction · November 23:** Joseph wants a handoff for a **separate, lightweight Cursed ending page/view**, continuing an existing save file. In his case that is **Run #3**, the file he used as his practical scout: he normally tried sections there first and it was substantially behind Run #4. He likes the researched checklist and wants to reuse it. The new work is to move/reuse that content on its own page, rather than append it to the main speedrun guide. No new map collection, map drawing, detailed route project or speedrun-style walkthrough is needed.

**This handoff is documentation only. The page separation is the next implementation task.** The existing prototype is still embedded below the main guide; do not tell Joseph it has already been moved.

### Scope and experience

- Provide a clearly separate **Cursed ending** page/view in the same local, dependency-free app, with its own address or navigation entry. A simple link between the two views is enough; keep Cursed stages out of the speedrun’s page numbering, maps, split forms and pickup totals.
- Reuse the existing seven-stage preparation content and source links, reducing it to a practical checklist where useful. Joseph approves the substance and presentation; rebuild only what is needed for its new home and progress controls.
- The page continues a **chosen existing save**, rather than representing a new timed run. Default to Run #3 for Joseph, but allow another existing file to be chosen. Show which file the checklist belongs to.
- Support ordinary checkboxes for useful upgrades, ingredients, remaining mask shards, final readiness, applying the curse and the ending result. Keep the layout simple. There is no overall clock, sub-five goal, split schedule or requirement to build all the maps/routes again.
- Reuse the existing research rather than start over. The preparation goal remains nine masks, Hivesteel Needle/upgrade #3, Faydown Cloak and Needle Strike; become cursed only after finishing preparation, then go to GMS. Detailed research and sources remain under the November 22 entry below.

### Current implementation to move

The last implementation is commit **`7727d1f`**. It added a read-only seven-stage accordion and source links; it does **not** yet persist Cursed checklist checks.

| Existing piece | Location / next action |
|---|---|
| All researched content and sources | `data/route.json` → `cursedGuide`; reuse/move as the single source for the new page. Preserve the seven existing stage IDs. |
| Hardcoded current file | `cursedGuide.runId` = `8b149d0d-b52c-46c6-b5b9-85370bbb766d`; replace the fixed binding with an existing-file selector defaulting to Run #3. |
| Embedded rendering and binding | `public/ui/guide.mjs` → `renderCursedPreparation()` and the `continue-cursed` click listener; extract responsibility to the separate page’s owning module. Keep shared state/save helpers rather than inventing a second persistence path. |
| Main-guide markup | `public/index.html` → `#cursed-preparation`, its child IDs, and `#continue-cursed` in the GMS footer; remove the embedded checklist when the new page is ready. A normal navigation link to the separate page may remain. |
| Styles | The final Cursed preparation block in `public/styles.css`; reuse or move the styles instead of leaving unused rules. |
| Server / module ownership | `server.mjs` owns the local route/file allowlist and API. Register any new page, module or data endpoint there, and update `docs/architecture.md` and the relevant checks. |

A small local page such as `/cursed` is a suitable implementation; the exact URL and module/file split are routine implementation choices. Extracting the content to something like `data/cursed.json` is reasonable, but retain one maintained copy. “Clone the checklist” means reuse the approved content and layout, **not** copy Run #4’s run data or replace Run #3 with a different save.

### Save identity and progress rules

- **Run #3:** `8b149d0d-b52c-46c6-b5b9-85370bbb766d`. Joseph calls it the scout file because of how he used it. The app currently stores `mode: "timed"`; preserve that historical record rather than reclassify it. Its last saved split is the historical **Lace 2 defeated at 4:21**, minute precision, with note **“2 try”**. Joseph says the game file is sitting at GMS. No Cursed setup or clear is yet reported.
- **Run #4:** `3d07f68a-a46d-467e-880b-8e6886e39035`. Completed at **3:27:17**, second precision, GMS note **“2nd try!”**; keep the finish and its **24/24** current split display intact.
- Store new Cursed progress separately from the chosen run’s historical `splits`, speedrun `prep` and paid purchases. A per-run continuation object with stable checklist IDs, notes and its own result is a reasonable shape. Keep it in the existing revision-protected save flow; do not use an uncoordinated second save file or browser-only checklist storage.
- New Cursed-specific checks start unconfirmed unless the user already reported that exact item. Existing Run #3 pickup checks may provide a labeled starting record. They do not automatically prove new goals such as double jump, Needle Strike, the eight extra shards or curse completion. In particular, the existing eight shard records imply seven masks only if the game inventory agrees.
- Changing the selected source file must load that file’s own Cursed progress; it must not duplicate checkmarks between files. Existing runs without the optional continuation field must still load/save unchanged.
- Recording **Twisted Child earned** or attempt notes belongs to the untimed continuation. Do not overwrite Run #3’s old `gms`/Lace history or Run #4’s finish to represent the cursed result. Do not fabricate a new time.

### Checklist content to carry across

Retain the existing dependency order, with one check per actual pickup/action rather than marking whole paragraphs complete:

1. Confirm the source file is still in Act 2; check the Terminus shortcut and return travel, start Great Taste, and rescue Jubilana if needed.
2. Collect Faydown Cloak and the Mount Fay shard; count that shard once in the eight-extra-shard goal.
3. Learn/check Needle Strike; collect Mossberry Stew, Vintage Nectar, Crustnut, Pickled Muckmaggot and Courier’s Rasher; turn them in for Pale Oil and obtain Hivesteel Needle.
4. Track the eight additional shards individually: Jubilana, Mount Fay, Far Fields Skull Cave, Savage Beastfly wish, east Bilewater, northeast Slab, east Wisp Thicket and west Blasted Steps. Keep prerequisite notes/links from the existing content.
5. Confirm nine masks, Needle #3, double jump, Needle Strike and the return to Terminus. Extra Silk, pouches and Crafting Kits are exploration aids rather than cursed-fight targets.
6. Hold the Twisted Bud until ready, complete Rite of the Pollip, then apply the curse through Rite of Rebirth. Keep the Act 3 / Infestation Operation restriction visible beside this commitment.
7. Return to GMS, track any attempt notes and the Cursed-ending result without a time target.

The content currently contains useful reference links; keep them available. No new artwork, annotated maps, full map gallery or room-by-room route is needed for this task.

### Completion checks for the next implementation

Verify with **Playwright**, using an isolated `RUNBOOK_DATA_DIR`: the separate page opens directly and reloads; Run #3 is the default source; selecting another file isolates checks; checks save/reload with stable IDs; old run fields and unknown data survive saves; revision conflicts do not silently replace another file’s progress; desktop/mobile layout works. Confirm that the main guide no longer renders the Cursed accordion, still has 22 pages / 24 timing points, and Run #4 still shows 3:27:17 and 24/24. Run `npm run check` and commit the finished change. Never exercise write tests on the active save.

## Current run

- **Run #4 finished at 3:27:17 — sub-five achieved.** Joseph confirms the finish on Run #4. The active save already records `gms` at **12,437 seconds**, second precision, with note **“2nd try!”**; keep it unchanged. This is **1:32:43 under five hours**, and **1:58:59 faster than Run #2’s 5:26:16**. Its preceding `lace-2` split is **3:22**, labeled **Terminus bench / runback shortcut**, with note **“1 attempt!”**. Do not infer a full ending loadout, Mask activation count or additional pickup checks.
- **Run #3 selected for the separate Cursed checklist.** Joseph says he has two game files sitting at GMS and will continue Run #3, his practical scout/first-attempt file, for this ending. Its stored historical mode remains timed. Preserve its old results and keep the new untimed checklist/result separate; see the next-task handoff above. No curse application or cursed clear was reported.

- **Run #4, Clawline / Cauldron clear at 2:43; second kit checked.** Joseph returned to Grand Bellway and farmed after being short of rosaries at the Architect. The active save records the 2:43 split at minute precision and has `kit-second` checked. The farming duration, amount earned and remaining balance were not supplied. Preserve the save; no new melody pickup, roof gate opening or duel result was reported.

- **Run #4, Trobbio defeated at 2:29.** The active save records this at minute precision under checkpoint `trobbio`; Joseph confirms he quit to menu to read the clock. At that earlier report, his next leg was back up and over Trobbio’s stage to take his lift down. The corrected plan below clocks only after opening the left shortcut door; do not reinterpret the already-saved 2:29 as that later event. Keep its time and historical label unchanged. Earlier splits include Lower Core 2:09, Songclave/Vaults return 2:20, Grand Bellway 2:02 and Choral Chambers 1:57. The Blasted Steps Craftmetal check was previously open; confirm its current saved state before spending it on Cogfly.
- **Run #4, post-Widow rosaries sufficient.** Joseph reports **638 rosaries** from Scrounge sales and pickups along the route, especially lower Bellhart. He rejects Loddie’s second round as unnecessary. Keep the first-round pouch only; this report does not confirm a new pickup, purchase, split, exact location, or the individual relics sold.
- **Run #4, Straight Pin missed.** Joseph did not collect Straight Pin on the first Deep Docks trip, then found the existing first-pass instruction. Keep that instruction unchanged and leave pickup ID `tool-straight-pin` unchecked until he reports collecting it. Recover pin **477899**, above Grindle’s old cell in the Marrow prison, during the already planned post-Widow Loddie visit. This is a Run #4 recovery, not a change to the selected first-pass route. [Straight Pin location](https://hollowknight.wiki/w/Straight_Pin) · [Loddie’s prison location](https://hollowknight.wiki/w/Loddie)
- **Run #4, first Mort visit completed.** Joseph confirms Pilgrim’s Rest entry, Weighted Belt and Mort’s Tool Pouch are already done; the Belt and pouch are already checked in the active save. Place these directions and their 410-rosary spending reminder at the end of Section 4, Far Fields. Section 5 starts at Halfway Home with only the 60-rosary Greymoor Bellway reminder. This report does not confirm the Greymoor Bellway purchase.
- **Run #2 finished at 5:26:16**, with Grand Mother Silk defeated on the **sixth attempt**. Preserve second precision. The official finish is 26:16 beyond the five-hour cutoff and retains all idle time and detours. The earlier 5:06 Marrow restock/Mask endpoint and 4:57 Lace 2 clear are unchanged. This is the completed timed file; the scout’s earlier GMS clear remains a separate result.
- **Lace 2 was the bigger bottleneck for this player.** The winning blue tools were Injector Band and Claw Mirror. The yellow tools were Weighted Belt and Magnetite Dice. Belt felt useful. The approach was to wait for Lace, punish her recovery, and preserve Silk for Bind. The user found Straight Pin openings but did not rely on the red tools and reported no Cogfly use for the win. Treat the exact attempt count and which attempts used pins as unreported.
- **The 4:20–4:57 interval includes travel.** The user detoured to eastern Greymoor, picked up spool 478263, and went to Pilgrim's Rest for Weighted Belt. Craw Lake balloons were present on that late file with the arena uncleared. Keep this as one verified spool pickup. It is not evidence for the earlier movement kit or the Thread Storm branch.
- **High Halls was also hard.** The timed Forum clear at **4:11** took three attempts, with G&Z, Straight Pin, Cogfly, Claw Mirror, Injector Band, and Dice. The scout took about eight attempts. Scout aid and loadout were not specified. The 3:52–4:11 interval also includes the Dice detour.
- **Keep the official clock.** The **3:34** Vaultkeeper's Melody split already includes about ten minutes idle at a bench. The **3:45** split is the Cogwork Core bench after the G&Z duel. The **3:52** split is High Halls bench with Cogfly equipped. The user called the **4:20** split Checkpoint 1 before scouting Lace. Preserve the reported labels and times. Individual late melody pickups, bench locations, and scout Lace outcomes should only be recorded when supplied.

The 5:06-to-finish interval is **20:16**, including return travel/preparation and attempts. Six attempts does not mean six deaths. Fractured Mask saved Joseph during the attempts; its exact activation count and the complete ending loadout were not reported. For GMS, phase 1 was straightforward; stay on one side in phases 2/3, watch and avoid knives, and save Silk for healing.

## Selected rerun route

Build the main view around this itinerary. The route is Hunter, all five bells, Last Judge through Blasted Steps, then G&Z at the Forum and the Act 2 ending. Retain established skips for the Mist/Phantom branch, Mount Fay, Wanderer/Reaper, Craw Lake Arena, Thread Storm, Threefold Pin, and Cogwork Wheel. Turn uncertain choices into scout questions while the timed path stays direct.

1. **Bone Bottom and Deep Docks.** Clear the Marrow arena and collect/equip Shard Pendant for early Shell Shards. Get Silkspear, the Mosshome Frayed Rosary String and Choral Commandment, and activate the Mosshome return lift. Continue through Bell Beast, Marrow bell, Straight Pin, Swift Step, and Lace 1. Ring Deep Docks bell, open Deep Docks Bellway for 40, then take the Bell Beast to the Marrow and farm to 710 rosaries before the Wormways and Pebb loop. Collect Bone Bottom spool 478080 through the trapdoor and trapped lift passage during that loop. Pebb costs 300. These are planned steps, independent of unreported Run #2 purchases. Skip maps, Quill and Compass unless a map is needed to navigate.
2. **First Far Fields and Greymoor pass.** Skip both the Warding Bell bronze-pipe detour and the adjoining flying-bomber Craftmetal room that Joseph explicitly rejected. The normal two-pickup budget remains Marrow for Magma Bell and Blasted Steps for Cogfly. From the tall room, take the lowest right exit past Fourth Chorus to the Seamstress. Collect the hidden 60-rosary string near the Seamstress, get Drifter's Cloak and the shard above her, then defeat Fourth Chorus on the return. Buy Weighted Belt and the Tool Pouch on the first Pilgrim's Rest visit. The two items cost 380 rosaries, plus the planned 30-rosary first-entry fee. Break the gear from the inside. Open Greymoor Bellway for the later return. Exhaust Garmond's first Greymoor dialogue, then use the Halfway Home / Moorwing route. Accept Moorwing aid if offered; after one guide encounter/reload check, continue solo if absent.
3. **Shellwood, Widow, and post-Widow loop.** Sister Splinter for Cling Grip, Widow shortcut and Needolin, Bellhart bell and first Needle upgrade. Visit Eva for Hunter's evolution, collect the Atla Rune Harp on the mask branch, and take the mask shard. Take the Atla spool to complete the first pair with the earlier Bone Bottom pickup. Return to Bone Bottom and take its Bellway to Bellhart; sell the Rune Harp to Scrounge for 210 rosaries and the Choral Commandment for 180 if still carried. Return to Loddie after Widow for the first-round pouch only; skip the second-round necklace. On the Forge Daughter visit, get the damage kit for 180 and Magma Bell for 110 plus one Craftmetal, and collect the selected Deep Docks spool 477926 via the burning-floor room and far lever. The target is six masks before Judge and seven by late Act 2. Use the checkpoint spending reminders; the post-Widow loop no longer depends on Loddie’s second reward.
4. **Bell #4 and Last Judge.** Travel from Deep Docks Bellway directly to Greymoor and rest at Halfway Home to set the quit-return point. Climb above and right of Halfway Home, use the top-right transition, and go northeast. Keep this bypass. This trip is the planned window for the Greymoor spool, completing the second pair with Deep Docks. Do not sit at the bell’s bench or any other bench during the trip. After the bell and spool, Quit to Menu and Continue back at Halfway Home, then take Greymoor Bellway to Shellwood Bellway. Arrive at the already-open Shellwood Bellway, ring Shellwood’s bell, then continue to Blasted Steps for the locket and Bellway. Use Needolin at the Grand Gate and fight Last Judge. After reaching Choral Chambers, use the return shortcut to climb the Grand Gate balancing-platform puzzle for spool 478586. The route skips Mist and Phantom.
5. **Songclave and Vaults.** Open Grand Bellway travel and the First Shrine bell. Take White Key, beat the Cogwork Dancers and rest at the bench below them to anchor the spool quit-return. Clear the lower Core arena and collect its mask shard, take yellow 3 for lower Cogwork Core spool 478618, and quit-return without resting elsewhere. This completes the third pair with Grand Gate. Then open the middle and yellow 4 Upper Cogwork shortcuts, return to the bench below the Dancers, and continue through the spinning-wheel room to the Whispering Vaults arena. Clear the arena and return to Songclave for the split. Take the Ventrica to Grand Bellway and the Bell Beast to Blasted Steps for free Dice. Return the same way to Songclave. Then get the planned mask shard and Pale Oil for Needle Upgrade #2 in Bellhart before Trobbio.
6. **Trobbio, Cauldron, and roof.** Defeat Trobbio, collect Claw Mirror, run back up and over his stage, then take the lift down and open the left shortcut door. Only then quit to menu to clock the time and Continue, or press on. Go west through Choral Chambers and take the White Key lift into Whiteward. Collect spool 479317 beneath the lift before the fireplace climb for Injector Band, then continue to Clawline. Use Magma Bell through Cauldron and buy Twelfth Architect's 450-rosary Crafting Kit after Clawline. Collect eastern Underworks spool 478704 behind the small lava room’s left wall on this Cauldron pass to complete pair D with Whiteward: +4 total Silk capacity. Collect Vaultkeeper's Melody, run the box and wind puzzle, and open the far-left roof gate 480502. Leave and return through that gate for the duel. The earlier Greymoor conversation qualified on scout. The timed run got G&Z aid without a separately reported Choral Chambers encounter. Exhaust post-duel dialogue and accept their help at the Forum door inside High Halls.
7. **Forum and endgame.** Get Cogfly for one Craftmetal on the High Halls descent. The Forum target is two pouch upgrades, two damage upgrades, Straight Pin + Cogfly, and G&Z. Collect Conductor's Melody, then rest at High Halls bench 478415 to anchor the Forge Daughter restock and Hunter’s March Fractured Mask trip. Use High Halls Ventrica → Grand Bellway → Deep Docks for Forge Daughter, then travel to the Marrow for Hunter’s March. Rest nowhere else; collect Mask, quit-return to High Halls and equip it instead of Mirror. Continue to upper Core for Architect's Melody. Ascend to Lace and keep the patient, heal-first approach. Rest at Terminus if needed, open the final shortcut and record the `lace-2` time at the end of step 21. Record the actual finish only after Grand Mother Silk on step 22.

[Original Garmond Route](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696) · [Recovered maps and credits](./docs/map-credits.md) · [Roof gate](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=480502) · [Forum aid](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=481022)

## Decisions and research

### Run #3 · untimed Act 2 preparation for Twisted Child · November 22

Joseph shifts the next focus to Run #3’s **cursed GMS attempt**, with no time target. Research and implement the useful Act 2 preparation first; get cursed only when Hornet is ready and then return directly to GMS. The finished Run #4 time stays **3:27:17**. Run #3 remains an existing timed record with its own later untimed continuation; do not rename it, copy another run’s pickups or overwrite a prior split to reflect a new cursed attempt.

**Starting evidence:** Run #3’s active checklist has all eight selected mask shards checked (seven permanent masks if the inventory agrees), `needle-first` and `needle-second`, Clawline, two pouches and two Crafting Kits. It also has four completed spool pairs checked. Faydown Cloak and Needle Strike were not recorded. Do not infer either is missing solely from absent tracking; check the actual inventory. No new pickup, quest completion, curse application or cursed fight result was reported.

**Research result and selected targets:**

| Preparation | Target and reason |
|---|---|
| Permanent health | **Nine masks / sixteen shards**, the ordinary Act 2 maximum. Run #3’s record leaves eight additional shards. The last four and tenth mask require Act 3. |
| Needle | **Hivesteel Needle, upgrade #3.** Use the second Act 2 Pale Oil from Great Taste of Pharloom and **450 rosaries** at Plinney. Pale Steel / upgrade #4 uses the Act 3 flea-festival Oil and is outside this attempt. |
| Movement | **Faydown Cloak from Mount Fay.** Get it before the remaining exploration; double jump also helps the GMS fight. Normal Clawline access is already available. |
| Charged attack | **Needle Strike from Pinstress’s training in Blasted Steps.** This does not require the later Pinstress boss fight. It remains available with Cursed Crest, whose spinning strike can be extended with ATTACK taps. |
| Silk / pouches / kits / slots | **No further cursed-fight target.** The curse caps Silk at three, disables Bind healing, all Silk Skills and all tools including Fractured Mask and Vesticrest tools. Extra spools, Silk Hearts, pouch capacity, Crafting Kits and slot upgrades can help earlier exploration but do not strengthen cursed GMS. Keep the existing two pouches/kits unless a preparation encounter calls for more. |

**Proposed order:** check the Act 2 file and Terminus shortcut → start the food wish and rescue Jubilana → climb Mount Fay, take double jump and its shard → complete Great Taste and take Needle #3, learning Needle Strike on the Sands of Karak trip → clean up the remaining shards while still able to heal/use tools → confirm equipment and transport → get cursed → GMS. This is a practical dependency order, not a timed or proven shortest collection route. It reverses the speedrun’s Mount Fay skip only for this accepted untimed continuation.

**Eight additional mask shards:** Songclave/Jubilana (**750 rosaries**, after The Wandering Merchant); southwest Mount Fay west of the bench (double jump); Far Fields Skull Cave lava gauntlet (Clawline); Savage Beastfly wish reward; east Bilewater Slubberlug hallway; northeast Slab challenge (Key of Apostate + double jump); east Wisp Thicket (double jump); west Blasted Steps challenge (Clawline + double jump). Count Mount Fay once, even when visiting it in the cloak stage. The Beastfly reward requires the first Hunter’s March/Chapel of the Beast kill, then the Bellhart wish and second fight at Fourth Chorus’s old arena; return the Horn Fragment to Bellhart. The Slab key is in Putrified Ducts west of Huntress’s home, not in Sinner’s Road. These replace no existing shard IDs or checked states.

**Great Taste / Oil details:** promise the wish from Mergwin in the Choral Chambers dining hall. Obtain Mossberry Stew from the Mosshome Druid after Berry Picking; Vintage Nectar from Creige’s Halfway Home cellar for **480 rosaries**, with an arena; Crustnut in Sands of Karak past Great Conchflies and Pinstress; Pickled Muckmaggot from Lugoli in Sinner’s Road with double jump; and Courier’s Rasher after My Missing Courier + My Missing Brother. Rehearse Bellhart → Shellwood → Blasted Steps → Grand Gate → Choral Chambers before accepting the delivery, clear enemies without a later bench rest, and deliver on foot. The Rasher has its own freshness timer: hits shorten it, rather than every hit automatically failing the delivery. No fast travel during delivery. After all five, take the Oil plus 450 to Plinney. Reserve **1,680 rosaries** for Nectar + Needle #3 + Jubilana’s shard, with other costs extra and no assumed wallet balance.

**Cursed finish setup:** collect the Twisted Bud via the hidden eastern Whispering Vaults/Bilewater entry during cleanup, but keep it. Possession alone does not apply the curse. Finish Rite of the Pollip before turning it in to Greyroot for Rite of Rebirth. Open/check Shellwood Bellway and the Terminus return before the hand-in; the demonstrated route exits the Chapel of the Witch up into Shellwood, takes Shellwood Bellway → Grand Bellway → Ventrica → Terminus, then rests for full health and the retry point. No new Terminus station purchase is needed: its Cradle access is opened by removing the rubble. Do not enter Act 3 via Snared Silk or complete Yarnaby’s Infestation Operation before the cursed win. The permanent upgrades and movement remain useful; tools and healing through Bind do not. Plasmium Phial is an optional Mount Fay aid, not a supported cursed-fight healing plan. No force-close manipulation is proposed.

**Existing prototype · placement superseded November 23:** `data/route.json` has a sourced `cursedGuide` for Run #3, currently rendered after the main guide as **Cursed preparation · Run #3**, with a **Continue to cursed preparation** link on the GMS page. Its seven stages include linked maps/walkthroughs, upgrade limits, the eight shards, food dependencies, inventory/return checks and the cursed fight. It reads Run #3’s shared saved state for a starting-record summary; it has no collection checkboxes or timing forms, and never saves or infers new progress. The original 22 guide pages, 24 timing points, preparation IDs, costs, run checks and finish times stay intact. Research alternatives remain here; no new assets or dependencies were added. Joseph’s November 23 direction moves this approved content to a separate checklist page/view; the embedded placement is not the desired final design. See the next-task handoff above.

Sources checked November 22: [Cursed Crest](https://hollowknight.wiki/w/Cursed_Crest), [Act-specific mask shards](https://hollowknight.wiki/w/Mask_Shard_%28Silksong%29), [Pale Oil and current upgrade costs](https://hollowknight.wiki/w/Pale_Oil), [Faydown Cloak](https://hollowknight.wiki/w/Faydown_Cloak), [Needle Strike](https://hollowknight.wiki/w/Needle_Strike), [Savage Beastfly wish](https://hollowknight.wiki/w/Savage_Beastfly_%28Wish%29), [Slab Keys](https://hollowknight.wiki/w/Slab_Keys), [Great Taste walkthrough](https://www.nintendolife.com/guides/hollow-knight-silksong-the-great-taste-of-pharloom-quest-all-ingredients-best-couriers-rasher-route), [IGN ingredient walkthrough](https://www.youtube.com/watch?v=f5qOAK57vL4), [Terminus](https://hollowknight.wiki/w/The_Cradle#Terminus), [demonstrated Twisted% return](https://speedpastes.org/qP3ya9KQ), [cursed setup and fight video](https://www.youtube.com/watch?v=HTSdXeLting). Prefer the current 450-rosary Hivesteel cost over old launch guides saying 500. The wiki’s user-draft food page incorrectly describes damage as an automatic Rasher failure; the demonstrated delivery guides show the timer penalty.

### Retire the redundant pre-Lace timing point · November 22

Run #4 displayed **24 / 25** despite its finish because the earlier step merge retained the separate `checkpoint-1` timing point before Lace. Run #4 has every other current split, including the finish; this was the only missing point. Joseph questions the extra total after moving the step’s timing to Terminus. Retire `checkpoint-1` with `recordSplit: false` and remove its inline form. Keep its preparation directions on the combined **Lace 2 & Terminus** page and keep existing historical records editable under their original ID, labels and precision. Step 21’s single time entry is now at the final Terminus bench/runback-shortcut instruction.

There are **24 current timing points across 22 guide pages**, so Run #4 now shows **24 / 24**. This corrects the route definition without inventing a missing time, modifying the recorded finish, changing pickup checks or removing past records. The active save and seed remain unchanged.

### End step 21 at Terminus and time the runback shortcut · November 22

Joseph moves the former first Grand Mother Silk instruction to the **last instruction of step 21**, after the Lace 2 fight: head right and up to Terminus, rest if needed, take the final approach room’s bottom-right exit and drop to open the runback shortcut, then repair Fractured Mask at the bench if using it. Keep the `lace-2` timing form immediately after that instruction. Its current title is **Terminus bench / runback shortcut**, and the combined page subtitle is **Lace 2 & Terminus**. Clock this arrival/preparation after the shortcut and any rest or repair, before the GMS approach.

Step 22 now starts with the optional Shell Shard rock supply stop and then the GMS fight directions. Move its existing finish form from instruction 7 to instruction 6 so it still follows the win. Preserve all checkpoint/preparation IDs, historical split labels, reported times, notes and checks. In particular, Run #2’s 4:57 Lace clear remains that historical event; do not reinterpret it as reaching Terminus. The later pre-Lace retirement leaves 22 guide pages and 24 timing points. No new travel, bench rest, shortcut opening, repair or time was reported.

### Combine Lace 2 preparation and fight · November 22

Joseph combines reading steps **21 and 22** into **step 21: Lace 2 preparation & fight**. Set `checkpoint-1.guideStep: "lace-2"` and retain `lace-2` as the combined page’s ID. Keep all preparation and fight directions in order, the Cradle map, and the `lace-2` timing form at the later-corrected Terminus bench/runback-shortcut instruction after the win. The separate pre-elevator `checkpoint-1` form is now historical-only. Architect’s Melody stays step 20; Grand Mother Silk becomes step 22. After the later pre-Lace retirement, there are **22 guide pages and 24 current timing points**.

Preserve all checkpoint/preparation IDs, saved times, historical labels, notes and checks. This is a reading-page merge, with no new pickup or fight result reported.

### Fractured Mask and Forge Daughter after Conductor’s Melody · November 22

Joseph moves the pickup trip immediately after **“Collect Conductor’s Melody after the Forum.”** Use his [High Halls bench](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478415) as the quit-return point. Rest there after learning the melody, take High Halls Ventrica to Grand Bellway and the Bell Beast to Deep Docks for Forge Daughter’s shard bundles as needed, then take the Bell Beast to the Marrow for the scouted Hunter’s March approach. Do not rest at Forge Daughter, Marrow, Hunter’s March or any intervening bench. Collect the free Mask at Mottled Skarr’s corpse, skip the rosary and bench-trap diversions, then **Quit to Menu / Save and Quit → Continue** back at High Halls. Replace Mirror with Mask there; keep Injector Band and Belt + Dice, then continue to upper Core and Architect’s Melody.

This is the selected route, superseding the optional Lace 2 departure and Cogwork Core bench 478428 anchor. Keep the Conductor split immediately after learning the melody, before this trip; add no new timing point. Move the existing `stock-shard-bundles` and `tool-fractured-mask` inline checks onto the post-melody directions, and move Mask into the required Tools category. Supplies remain conditional. Keep all checkpoint/preparation IDs and every saved time, label and check. This is a plan change; no new pickup, restock, bench rest, location or split was reported.

**Saved return map:** Joseph’s [Bellhart → Loddie → Deep Docks screenshot](./assets/maps/Bellhart%20to%20Loddie%20and%20Deep%20Docks%20return.png) exists and is now also shown on the High Halls page. White 2 marks Forge Daughter; this later trip approaches from Deep Docks Bellway along the green line. The red Bellhart approach and earlier detours belong to the post-Widow loop. No separate Hunter’s March / Fractured Mask map was found in the project, the recovered-map folder or nearby supplied image files. Keep that coverage limit explicit and use the existing descriptive MapGenie pins for the March approach.

### Architect puzzle row orientation · November 22

Joseph asks for explicit row orientation; “first row” alone is ambiguous. For the initial-state lever counts, read rows **top to bottom**, with the four levers in each row **left to right**: top 1–3–3–3; second from top 2–0–0–3; third from top 0–1–1–1; bottom 1–1–0–2. Label the top and bottom rows directly in the walkthrough and tip. Keep the existing hit counts, moved-lever alignment reminder, instruction count and melody pickup/split placement unchanged.

Verified against [Tay Bravo’s puzzle directions](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696), which explicitly identify the top and bottom rows. This clarifies the instructions, without recording a new puzzle result or pickup.

### One High Halls page through Conductor’s Melody · November 22

Joseph first combines the Forum clear and Conductor’s Melody timing, then asks to merge former reading steps **19, 20 and 21** into **step 19: High Halls, Forum & Conductor’s Melody**. Point both `high-halls-bench` and `forum` at `guideStep: "conductor"`. Keep every direction, map, purchase and pickup check in its existing order. The next page is Architect’s Melody, now step 20.

Keep the pre-Forum `high-halls-bench` timing form at the bench/loadout instruction. Retire only the separate Forum-clear timing point with `forum.recordSplit: false` and remove that inline form. The single combined Forum/melody split uses `conductor`, after acquiring Conductor’s Melody and before returning to upper Core. Its current title is **Forum cleared / Conductor’s Melody**. That merge left 23 guide pages and 25 timing points; the later Lace 2 merge reduces the current page count to 22.

Preserve all checkpoint/preparation IDs, saved times, labels, precision, notes and checks. Old Forum-only times remain editable in Historical splits and do not count as learning the melody. Do not merge, relabel or overwrite historical Forum and Conductor records, or infer a new fight clear/pickup/time from this presentation request.

### Combine melody and roof duel; time the High Halls approach · November 22

Joseph merges former reading steps 18 and 19 into **step 18: Vaultkeeper’s Melody, roof duel & High Halls approach**. Use `vaultkeeper.guideStep: "roof-duel"`. Retire the standalone `vaultkeeper` timing point with `recordSplit: false` and remove its inline time form; keep the melody pickup check at the instruction where the Vaultkeeper teaches it. Existing saved melody times remain editable in Historical splits under their original IDs, labels and precision.

Keep the `roof-duel` checkpoint ID, but its current title and timing cue are now **Choral Chambers bench before High Halls**. After winning the duel and exhausting dialogue, head to Joseph’s [bench before High Halls](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478397) and clock the time just before entering. MapGenie identifies it as a free Choral Chambers bench. Put a descriptive pin link beside that instruction. The bench rest stays optional. The old Cogwork Core bench is no longer this split location. The later November 22 pickup decision also moves the Mask trip’s return anchor to High Halls bench.

After the later High Halls and Lace 2 merges, there are 22 guide pages and 24 current timing points after retiring the pre-Lace split. Preserve every checkpoint/pickup ID, saved time, historical label and check. In particular, Run #2’s melody time and its post-duel Cogwork Core time keep their original meaning; this route edit does not relabel them as new bench arrivals. No new pickup, duel result, time or bench rest was reported.

### Descriptive MapGenie links, no bare pin IDs · November 22

Joseph says MapGenie references must be real clickable links or omitted; the raw number is not helpful. Removed bare pin numbers throughout the live route’s directions, tips, keys, timing cues, pickup text and research cards. Keep landmark names and the existing pin links. Put a descriptive MapGenie link directly beneath the roof-door instruction and retain the door link on the following duel page. Preserve numeric pin metadata, route/checkpoint/preparation IDs, saved results, source map numbering and historical notes. This is a presentation correction, not a route change or reported pickup.

### Identify the outdoor roof shortcut · November 22

Joseph found the raw gate ID and directional shorthand unclear. Pin **480502** is the locked shortcut door at the far-left end of the outdoor rooftop above Whispering Vaults, near the Garmond and Zaza duel area. After the Clawline/wind route brings Hornet back under open sky, head left along the roof and open the door from its right/eastern side, then go through it. MapGenie states the locked door is invisible from the west. Keep that map ID in its link, not in the numbered directions. Describe the visible landmark and approach in plain language.

This opens the return entrance for the roof duel. Keep the selected sequence: open the door and leave, return to the Vaultkeeper to learn the melody, then re-enter the roof through the door for G&Z. The arena ceiling shortcut back to Songclave is a separate opening; do not make that distinction the main navigation instruction.

[Roof shortcut door](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=480502) · [Garmond and Zaza encounter conditions](https://hollowknight.wiki/w/Garmond_and_Zaza). Door access was rechecked against the public map data on November 22.

### Fourth spool pair: Whiteward and eastern Underworks · November 22

Joseph selects **Whiteward 479317 + eastern Underworks 478704** as pair D. Keep the earlier three pairs, including Grand Gate + lower Core and the numbered 3-before-4 detour order. This brings the planned total to **eight fragments, four completed spools, +4 Silk capacity**. It supersedes the six-fragment limit and Cauldron skip from November 20. This is a route decision, not confirmation of a new pickup or time.

On step 17, put Whiteward’s pickup **between the White Key lift and the fireplace climb**. Pin 479317 is beneath that lift: reach its lever, call the lift from the top landing, drop back into the shaft, shelter beside the lever while the lift passes, then descend below its normal stop. The White Key is already planned. After Clawline and Architect’s kit, take the shaft east of the Cauldron and break the small lava room’s left wall from the east for 478704. These are the lift and wall pickups, not the Sherma or central Underworks arena rewards. Joseph considers both easy; no new detour timing was supplied.

Reuse `spool-cauldron` for the eastern fragment; add distinct ID `spool-whiteward`. Keep every existing checkpoint and pickup ID, saved time and checked state. Whiteward starts unrecorded; do not infer it or Cauldron from earlier route progress. The drawer must count all four pairs and show +4 only when all eight are checked.

[Whiteward pin](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479317) · [Eastern Underworks pin](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478704) · [Spool access and mechanics](https://hollowknight.wiki/w/Spool_Fragment). Pin descriptions were verified against MapGenie’s public map data on November 22.

### Trobbio clock on menu quit · November 22

Joseph corrected the exact sequence: **Claw Mirror pickup → run back up and over Trobbio’s stage → take his lift down and open the left shortcut door → Quit to Menu / Save and Quit → clock the time → Continue → west through Choral Chambers**. The quit remains optional if pressing on. Name the current timing point **Trobbio lift shortcut**, retaining checkpoint ID `trobbio`, and put its form after the quit/clock instruction at the end of combined step 16. Step 17 now starts west through Choral Chambers for Whiteward. Remove the old ride-back-up/Grand Bellway return instruction. Do not put the menu quit or timing form before the lift and door.

Joseph’s Run #4 menu-clock result is already saved as **2:29**, at minute precision. Preserve that time, its saved historical label, every earlier result and all pickup checks. Changing the current route title must not rewrite old Grand Bellway bench labels or reinterpret Run #2’s timing. His already-reported 2:29 menu quit preceded the planned lift trip; the new sequence is a route correction, not a new timed result. This supersedes both the earlier bench-based form and the quit-before-lift wording.

### Combine Vaults and Trobbio · November 22

Joseph combines former reading steps 16 and 17 into **step 16: Vaults, Pale Oil, Needle #2 & Trobbio**. Keep the directions in their existing order through Claw Mirror and Trobbio’s lift. Reuse the combined-page mechanism: `vaults-arena` points to `guideStep: "trobbio"`. Both checkpoint IDs, pickup/purchase IDs, map references and saved results remain intact. The Vaults arena timing form stays at the Songclave bench on step 15; the later November 22 correction places the Trobbio form at the optional menu-clock instruction at the end of step 16, before the Whiteward/Clawline page on step 17. The later melody/duel, High Halls and Lace 2 merges and the pre-Lace retirement bring the current totals to 22 guide pages and 24 timing points. Do not add a duplicate page or move those timing events to fit the combined reading page.

### Third spool in lower Cogwork Core · November 20

Joseph replaces eastern Underworks **478704** with lower Cogwork Core **478618** as fragment #6. Joseph corrected the sequence: the numbered detours are ordered, so take yellow **3** on step 15 after the lower Core arena and **before yellow 4**. Rest at the bench below the Dancers on first arrival, collect the mask shard and fragment without resting elsewhere, then **Quit to Menu / Save and Quit → Continue** back at that bench. Follow orange down again, open the middle and yellow **4** Upper Cogwork shortcuts, and return to the bench. Only then follow orange through the spinning-wheel room toward Whispering Vaults. Yellow 3 branches off at the bottom of the shaft before the wheel room; do not send the player through the wheel to reach it. Grand Gate + lower Core completes pair C early, before the Vaults arena, Needle #2 and Trobbio.

The November 22 fourth-pair decision adds Whiteward + eastern Underworks after these first six. Keep lower Core `spool-core` active for the early third pair and eastern Underworks `spool-cauldron` active in pair D. Preserve all saved checks and times. This is route planning, not a reported pickup, split or timed detour measurement. The November 9 selection, November 19 lower Core skip, and November 20 Cauldron skip are superseded.

### Songclave approach and return loop · November 19

Use the earlier approach map on step 14, **Combined Route to Songclave**. Merge the Songclave pickups, Cogwork Dancers and the lower Cogwork/Vaults return into step 15. The later Vaults mask and Pale Oil trip starts on step 16.

Go from **Grand Bellway bench → Lower Cogwork Core bench** for timing. After defeating the Dancers, take the split on first reaching the bench below them, before the lower Core arena and Upper Cogwork shortcut. Run #2’s saved Lower Core time was taken on returning to that bench after the arena and shortcut. Retire the standalone Songclave bell and Dancers timing points while keeping both events in the walkthrough and their saved times in Historical splits. Record the later Vaults arena split at the Songclave bench.

After the Songclave bench split at the end of step 15, take the Ventrica to Grand Bellway, switch to the Bell Beast for Blasted Steps and get the free Magnetite Dice from Lumble. Take the same connections back to Songclave for step 16. Joseph wants Dice as soon as the route reaches a Ventrica after the Dancers. This supersedes the earlier combined Needle #2 and Dice trip. Step 16 takes Pale Oil to Bellhart for the Needle upgrade.

Joseph’s screenshot shows red west from Songclave to the Dancers, then orange through lower Cogwork and the Whispering Vaults arena and back to Songclave. Yellow 3 is the lower Core spool branch, selected as the sixth fragment to finish the third pair early; November 22 adds a later fourth pair. Yellow 4 is Tay Bravo’s Upper Cogwork shortcut, which this route opens. [Songclave loop map](./assets/maps/Songclave%20to%20Cogwork%20and%20Vaults%20return.png)

### Choral Chambers bench on step 13 · November 18

Keep Blasted Steps on step 11 and give the Last Judge fight its own page on step 12. Joseph reports that quitting to menu right after beating Last Judge sends you back to the Blasted Steps bench. Continue through the upper-right shortcut to the Choral Chambers bench on step 13 and clock the existing `act-2` split before the Grand Gate spool detour. Grand Bellway follows on step 14. The fight page is guide-only. The bench rest is optional and the split measures arrival at the bench.

### Rosary total pinned in Pickups · November 15

Joseph rejects entering his wallet balance. Put **Rosaries still needed** at the top of the Pickups slide-out, outside its scrollable body, and keep the purchase list in that body. Remove the guide-page budget card and all wallet/shortfall controls. The total covers **every unpaid purchase for the selected run**, independent of reading position. Buying/checking a matching shop pickup or an independent purchase lowers it; undoing the check restores its cost. Show the remaining purchase count too. Do not infer earlier tolls or unlocks from navigation, split times or bell shrine checks.

The purchase list retains 17 entries costing 2,055 rosaries before checks, but the required pool is now **2,015 rosaries / 16 purchases**, plus the optional 40-rosary Shellwood bench. Keep stable purchase/pickup IDs, shared shop checks, per-run paid records and next-stop shopping reminders. New paid saves use `rosaryBudget: { paid }`; retain any existing legacy wallet field unchanged but ignore it in the UI and total. Preserve all saved times, labels, precision, notes, historical checks and seed data. Retries/restocks remain extra. This supersedes the November 14 wallet and per-page forecast design below.

Verified with `npm run check` and isolated Playwright: whole-run totals independent of navigation, no wallet controls, existing paid checks, shop/inline/category synchronization, optional bench exclusion and undo, next-stop payments, reloads and timed/scout isolation. Save failures and stale tabs retain confirmed checks; narrow pickup retries preserve newer fee records. Save locks, zero remaining costs, split-draft/data preservation, pinned desktop/mobile scrolling at 390 px and 320 px, Escape/backdrop closing and overflow checks pass. Active save and seed unchanged. Restarted the local server on port 4173 with the updated purchase-data validation.

### Benches optional except quit-return anchors · November 15

Joseph says **all benches are optional unless strategically used for quit-to-menu stunts**. Exclude the 40-rosary Shellwood arena bench from the required pool; label it optional in the route, purchase checklist and next-stop reminder. Other bench stops/rests are optional for healing, tool changes or repairs. Bench split locations remain timing landmarks without requiring a rest; retain every historical timing ID and label.

Keep explicit rests at Halfway Home before the Greymoor bell/spool quit-return, at the bench below the Dancers before the lower Core spool quit-return, and at Cogwork Core 478428 before the optional Mask quit-return. If using the Forum Quit to Menu / Continue fallback, first rest at High Halls bench to anchor that return. Preserve all no-intervening-bench instructions on these trips. Bellway/Ventrica purchases remain required travel unlocks, distinct from optional bench spending.

### Running rosary budget · November 14

Superseded by the November 15 Pickups drawer decision above.

Joseph wants a running pool of remaining rosary purchases and chose **remaining purchases plus wallet shortfall**. Show unpaid planned costs and purchase count from the current reading page through the finish. The current route totals **2,055 rosaries / 17 rosary purchases** before any checks; Shellwood/Blasted Steps onward totals **830 rosaries / 6 purchases** before any checks. These are spending forecasts, not reports about his current inventory or location. Navigating never marks costs paid. Earlier steps are explicitly excluded from the forecast; retries and restocks are extra, and material-only/free upgrades stay in the next-stop reminder.

Give each route purchase a stable ID. Shop items with `pickupId` share the existing pickup check in both directions; fees, benches and travel unlocks have independent paid checks. Do not equate a bell shrine check with buying a Bellway. Loddie’s entry is separate from earning his pouch. Save optional `rosaryBudget: { wallet, paid }` on each run through the existing revision-safe path, preserving legacy saves without this field. The wallet starts unknown, not zero; the older 638-rosary report is not imported as a current balance. It is a manually updated current-wallet snapshot: paid checks may record older purchases, so they do not debit or credit it. Make that behavior explicit beside the field and compute shortfall/surplus from the saved amount.

Budget and pickup updates synchronize through explicit callbacks without rebuilding the guide or replacing split/wallet drafts. Run changes reset the displayed wallet to that run. Preserve all existing checkpoint/pickup IDs, times, labels, notes, historical checks and seed data.

Verified with `npm run check` and isolated Playwright: route totals, unknown/zero/blank wallets, shortfall/surplus, per-run saves and reloads, paid/undone purchases, both directions of pickup synchronization, forecast navigation without writes, combined-page scope, zero remaining costs and material-only reminders. Failures and stale tabs retain drafts and confirmed checks; save locks and server validation pass. Existing split interactions, labels, precision, notes, historical checks and desktop/mobile layouts pass. Active save and seed unchanged. Restarted the local server on port 4173 to register the budget module.

### Shellwood / Last Judge map and instruction split logging · November 14

Joseph supplied Screenshot 2026-11-14 at 10.49.29 PM.png for step 11. Preserve its original bytes as [Shellwood Blasted Steps and Last Judge route.png](./assets/maps/Shellwood%20Blasted%20Steps%20and%20Last%20Judge%20route.png), catalog ID `shellwood-blasted-steps-last-judge`. Use it for the Shellwood/Blasted Steps and Last Judge/Grand Gate pages. Rename their section and key **Shellwood, Blasted Steps, Last Judge**. Green climbs from Shellwood through Blasted Steps; cyan continues toward Last Judge and the Grand Gate shortcut. Yellow **1** is the Memory Locket and **2** the Grand Gate spool. Keep the earlier unmarked supplied map archived; retain the missing original map record with the new replacement.

Add time-entry forms directly at the actual timing instructions for all **24 current timing points**, with `guideSplits` metadata and explicit timing cues. Some events are on a neighboring reading page: Lace 1 is captured on the Swift Step page at victory, the Vaults arena at the Songclave bench at the end of the lower Core page, and the Trobbio time at the optional menu-clock instruction at the end of step 16 (updated November 22). Halfway Home and Moorwing keep separate timing forms on their combined page. Bench splits explicitly name the bench; Widow is after Needolin and before ringing the bell. Greymoor’s split remains at bell #4 without sitting there, and its HH quit-return sequence is unchanged.

Inline forms save manual in-game times through the same revision-protected API as the Run log. Reuse pure split validation, preserve existing split labels and notes when only a time is entered, show failed saves, retain focus and unrelated drafts, and refresh metrics/history without changing reading position. The Run log still edits notes and historical splits. Keep all checkpoint/pickup IDs, reported precision and saved records; do not create new split IDs or infer pickups from a saved time. Update [the code map](./docs/architecture.md) when changing this ownership.

Verified with `npm run check` and isolated Playwright: original screenshot bytes and updated title/key, all 29 timing points across 28 pages, inline save/reload and Run log synchronization, retained labels/notes/precision, focus and reading position, unrelated drafts, keyboard entry, save locking, invalid/finish-time validation, failed writes, stale-tab protection, run isolation, finish state and historical editing. Desktop/mobile layouts, map viewer and replacement gallery pass. Active save and seed unchanged. Restarted the local server on port 4173 to register the new split module and image.

### Pickup-order bells and Greymoor return title · November 14

Joseph wants step 10 headed **Return to Greymoor, Bell #4** rather than the first-pass Garmond/Moorwing title. Use that title for the return section, map key and sidebar visit entry. Keep the first-pass Greymoor title and the existing thirteen sidebar groups.

Number the bells in the selected collection order: **1 Marrow, 2 Deep Docks, 3 Bellhart, 4 Greymoor, 5 Shellwood**. Apply this order to the pickup labels and ringing directions; remove the old Greymoor Bell #3 wording from the live route and supplied-map caption. Source checkpoint and yellow-detour numbers remain separate. Preserve all checkpoint/pickup IDs and checked states; never rewrite recorded split labels or times. The HH bench / no bell-bench rest / spool / quit-return sequence stays intact.

Verified with `npm run check` and isolated Playwright: custom heading/sidebar/map labels, all five pickup-order labels and ringing directions, retained checkmarks, historical split labels/times preserved through pickup saves, original first-pass title/map, thirteen sidebar groups, and desktop/mobile navigation. Active save and seed unchanged.

### Halfway Home quit-return for step 10 · November 14

After travelling from Deep Docks Bellway to Greymoor, **sit at Halfway Home** to set the quit-return point. Ring the Greymoor bell, **do not sit at its bench**, collect the planned yellow Detour 1 spool, then **Quit to Menu / Save and Quit → Continue** back at Halfway Home. Do not rest at another bench during the trip. From Halfway Home, go to Greymoor Bellway and travel to Shellwood Bellway for its bell and Blasted Steps.

Remove the obsolete Craw Lake / Thread Storm / Three-fold Pin and Ragpelt skip wording from step 10 and its supplied-map key; those branches are not on this map. Keep the actual yellow spool Detour 1 and keep settled exclusions in research. Preserve both pickup checks, all IDs, map bytes, historical times and active-save contents. This is Joseph’s route instruction, not a new recorded pickup or split.

### Greymoor return screenshot and bell checklist · November 14

Joseph supplied Screenshot 2026-11-14 at 12.01.20 PM.png for **step 10**, the combined Greymoor return. Preserve the original PNG bytes as [Greymoor bell and spool return.png](./assets/maps/Greymoor%20bell%20and%20spool%20return.png), catalog ID `greymoor-bell-spool-return`. Red follows the upper Halfway Home route to the bell; yellow **Detour 1** climbs to the Greymoor spool. Rest at Halfway Home before heading out, avoid other benches, then quit-return there after the bell and spool before taking Greymoor Bellway → Shellwood Bellway. The original Greymoor/Moorwing maps stay on the first pass; a separate return key uses Joseph’s labels without reusing the original locket Detour 1.

Add a **Bells · Grand Gate** pickup category for the five bell shrines, with stable new IDs `bell-marrow`, `bell-deep-docks`, `bell-bellhart`, `bell-greymoor`, and `bell-shellwood`. Each has an inline checkbox at the actual ringing instruction and a bell-shrine bench pin, rather than a Bellway-station pin. The existing drawer, per-run save and category completion behavior applies. Add the final five-bell checklist reminder before Last Judge. First Shrine in Songclave is separate from these five Grand Gate bells.

All new bell checks start **unrecorded**; Joseph will confirm them manually. Do not infer ringing from unlocked Bellways, route progress, splits, a completed historical run, or the new screenshot. In particular, the report that Shellwood Bellway is open is not a report that its bell is rung. Preserve all existing checkpoint/pickup IDs, active-save contents and seed. Bell pins verified against the [public map data](https://mapgenie.io/api/v1/maps/812/data).

Verified with `npm run check` and isolated Playwright: exact screenshot bytes, step-10 map/key and retained first-pass map, five initially unrecorded bells, all inline ringing points, drawer synchronization, save/reload, partial/all states and category completion, run isolation, existing prep/splits/notes preservation, desktop/mobile layout and viewer zoom/Escape. Active save and seed unchanged. Restarted the local server on port 4173 to register the new image.

### Deep Docks → Greymoor → Shellwood · November 14

Joseph confirms **Shellwood’s bell is not rung, while Shellwood Bellway is already open**. After Greymoor’s bell and spool, travel from Greymoor Bellway to Shellwood Bellway and ring Shellwood’s bell before continuing to Blasted Steps. Greymoor is Bell #4 in the selected pickup order; Shellwood’s bell is #5 and still remains on this file. [Required Bellshrines](https://hollowknight.wiki/w/Bellshrine)

At the end of the Loddie / Forge Daughter page (reading step 9), take Deep Docks Bellway **directly to Greymoor**. There is no post-shopping Bellhart stop. From Greymoor Bellway, rest at Halfway Home, then head to upper Halfway Home, ring **Bell #4** without sitting at its bench, and collect **Greymoor spool 478263** to complete pair B. Quit to Menu and Continue back at Halfway Home, then take **Greymoor Bellway → Shellwood Bellway** for the next leg.

Retain historical checkpoint ID `bellhart-return`, its original title, and all recorded times. Mark it `recordSplit: false` and merge its corrected Greymoor arrival directions into `greymoor-bell` using `guideStep`. The route retains 31 checkpoint IDs and now has **29 current timing checkpoints / 28 reading pages**. A remembered old Bellhart reading position resolves to the combined Greymoor page. Keep the post-Atla Bone Bottom → Bellhart relic sale before Loddie. Preserve the active save and every pickup ID.

Verified with `npm run check` and isolated Playwright: step 9 → combined Greymoor step 10 → Shellwood bell step 11, Previous/Next and sidebar navigation, remembered historical reading position, and historical Bellhart split editing with labels, times, precision and other run contents preserved. Active save and seed unchanged.

### Bellhart sale immediately after Atla · November 14

End the Atla / Eva page (reading step 8 of 28) with **Bone Bottom Bellway → Bellhart → Scrounge**. Sell the Rune Harp for **210 rosaries**, and the Choral Commandment for **180** if it was not sold earlier. This happens before the Lower Bellhart / Loddie / Forge Daughter loop. The obsolete post-shopping Bellhart stop is removed; the Harp sale stays on the post-Atla return. Keep the original guide section numbering, checkpoint/pickup IDs and recorded runs unchanged; this is route guidance, not a newly reported sale.

### Loddie first round only · November 14

Joseph reports **638 rosaries** from Scrounge sales and route pickups, highlighting the lower Bellhart zone, and rejects the second Loddie round. Keep yellow Detour 1 for **15 targets and the Tool Pouch**, at **25 rosaries per attempt**. Skip the 25-target round and its necklace. The loop budget is now **315 minimum**: entry 25 + kit 180 + Magma Bell 110, plus 25 per retry and one Craftmetal. The easy-rosary detour remains conditional on actual shop funding.

Move pickup ID `necklace-loddie` into the archived Earlier pickup record and remove its live inline check; keep historical checked necklaces and all other IDs intact. Do not edit the active save or infer collection of the pouch or any relic from the wallet report. The first Mort visit and the 710-rosary pre-Pebb budget are earlier decisions and remain unchanged. The prior second-round necklace plan is superseded; retain it only as historical research.

### Supplied Bellhart → Deep Docks return map · November 14

Joseph added Screenshot 2026-11-14 at 11.09.42 AM.png for Bellhart → Loddie → mask shard → Forge Daughter → Deep Docks Bellway. Preserve its original bytes as [Bellhart to Loddie and Deep Docks return.png](./assets/maps/Bellhart%20to%20Loddie%20and%20Deep%20Docks%20return.png), catalog ID `bellhart-deep-docks-return`. Use it on `forge-daughter` in place of the first-pass Deep Docks fallback.

The red approach goes through Lower Bellhart to white **1: mask shard** and **2: Forge Daughter bench**. Joseph’s yellow detours are **1: Loddie**, **2: Spool Fragment**, **3: easy rosaries**; green returns to the already-open Deep Docks Bellway for travel directly to Greymoor. Keep the rosary stop conditional on shop funding. These are Joseph’s map labels, separate from the original G&Z detour numbering. The map key identifies their source. Preserve existing pickup/checkpoint IDs, spending, run data and the post-Atla Harp sale reminder. The missing original image remains cataloged with this replacement.

Verified with `npm run check` and isolated Playwright on desktop/mobile: exact original image bytes, custom key label and all three detours, six inline pickup controls, viewer zoom/Escape, adjacent-page navigation and gallery inclusion. Active save and seed unchanged. Restarted the local server on port 4173 to register the new image.

### Atla Rune Harp income · November 14

Joseph selected [Atla Rune Harp 478231](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478231) as an easy money pickup during the existing post-Widow visit. From the right side of the lift shaft, enter the right-hand room and climb to its upper-left ledge for the Harp. Then drop to that room’s lower-right breakable-wall passage for the planned mask shard. Keep the separate upper Marrowmaw spool branch.

Add pickup ID `harp-atla` to Materials & lockets and its inline checkbox at collection. After Atla, take Bone Bottom Bellway to Bellhart and sell it to Scrounge for **210 rosaries**, before the Loddie/Forge Daughter loop. Sell the Choral Commandment for **180** if it is still carried. The earlier post-Widow Commandment sale happens before Atla, so it cannot include this Harp. This later income does not reduce the 710-rosary pre-Pebb farm target or fund the earlier Mort visit. It is a route decision, not a report of collection or sale; preserve active saves and existing IDs.

[Harp location and current sale value](https://hollowknight.wiki/w/Rune_Harp) · [Harp-to-mask navigation](https://intoindiegames.com/walkthroughs/hollow-knight-silksong-walkthrough-weavenest-atla/). Older guides list 110; Patch 1 raised the Harp’s value to 210. The original G&Z map does not assign this pickup a number.

Verified with `npm run check` and isolated Playwright: collection placement, map link, checkbox save/reload, drawer synchronization, unchecking, and the Bellhart sale reminder. Active save and seed unchanged.

### Frontend module ownership · November 14

Joseph wants the code organized so an AI agent can find behavior, make decisions,
and verify changes quickly. Keep vanilla JavaScript and Node with no dependencies
or build step. `public/app.mjs` now coordinates startup, run selection, navigation,
and explicit feature callbacks. `public/ui/` separates guide, maps, pickups, run
log, shared state, API saves, DOM helpers and drawer behavior. The pure model
stays in `public/model.mjs`. Use the [code map](./docs/architecture.md) for task
ownership, state/save rules and validation. Preserve the current route, IDs,
historical records, and active save while changing code structure.

Verified with `npm run check` (including module syntax/import/HTTP checks) and an
isolated browser run through all 29 pages, pickup conflict retries and failed
writes, drawer focus/category states, historical splits, map tabs/zoom, notes,
export/reload and mobile reduced motion. The active save was unchanged.

### Widow picture link and inline pickup checks · November 14

Joseph finds Widow the first substantial boss challenge on this run and wants the G&Z guide’s helpful fight picture close to the tips. Add a quick guide link beside the Widow fight-advice instruction, with a text fragment for Checkpoint 4: Widow. Keep the selected unmarked Shellwood map.

Place checkboxes directly beside pickup names at their actual collection instructions, using the existing drawer IDs and selected run’s `prep`. Drawer and inline changes use the same conflict-safe save and update each other; preserve category completion, counts, historical checks and keyboard focus. Include optional Mask/restock checks within the optional detour. A melody checkbox belongs at learning the melody rather than collecting its cylinder. No new pickup IDs or inferred collections. The `guidePickups` and `guideLinks` instruction numbers must follow moved or combined directions.

### Combined Widow setup, fight and timing · November 13

Joseph wants the bench setup and Widow victory combined for both reading and split timing. The shortcut, rest, boss fight, Needolin and Bellhart follow-up now share **Widow / Needolin**, step 7 of 28. Record the one current split after defeating Widow and acquiring Needolin, before the bell/upgrade follow-up. The Bellhart purchase reminder stays on that combined page.

Keep `widow-bench` as a retained ID with `guideStep: "widow"` and `recordSplit: false`. New split choices and progress totals use 29 current checkpoints, also excluding the obsolete Bellhart shopping return. Existing bench times, notes and labels remain editable under Historical splits and never count as a Widow victory. Keep the original saved runs and seed unchanged. The Halfway Home and Moorwing timing points remain separate as before.

### Combined Halfway Home / Moorwing page · November 13

Joseph asked to combine reading steps 5 and 6. They now form **Halfway Home & Moorwing**, step 5 of 28, with the Greymoor map and Moorwing aid screenshot, all directions in order, and the 60-rosary Bellway reminder. Next goes directly to Shellwood. Keep the later Greymoor return separate.

Retain all 31 checkpoint IDs and historical labels: `halfway-home` points at the `moorwing` reading page through `guideStep`, while both remain individually selectable for recording and editing splits. A remembered Halfway Home reading position opens the combined page. The normal combined page defaults to recording Moorwing; selecting an old Halfway Home split still edits that original split. Preserve all saved pickups and run data.

### Later chapter boundary audit · November 13

Joseph requested the same cleanup as the Mort/Far Fields correction throughout the remaining guide. Put the Whispering Vaults arena and ceiling shortcut at the end of Section 9, with G&Z Checkpoint 6. Section 10 starts back at Songclave for the shard, Pale Oil, Needle #2 and Trobbio. The November 19 decision moves Dice to the end of Section 9. Remove the overview selector and Section 9 key association from that Section 10 step and keep the missing combined-map notice on Section 9.

The November 22 correction makes Section 10’s Trobbio step end with Claw Mirror, the stage crossing, lift descent, left shortcut door and menu-clock check. Section 11 starts west through Choral Chambers for Whiteward / Injector Band and arrival at Twelfth Architect. Move the matching pins with those instructions and remove the Cauldron tab/key from Trobbio. Keep the relevant Moorwing aid and roof-duel screenshots. The other later purchase lists were already in their proper chapters; their costs stay unchanged. Move Forge Daughter’s supply reminder before buying the kit and Magma Bell. Preserve all 31 checkpoint IDs, historical titles, pickup records and map numbering.

### Pickup saves from stale tabs · November 13

Joseph reported pickup checks not sticking. An isolated Playwright test reproduced a stale-tab failure: another tab’s save advances the revision, the pickup PUT receives 409, and the checkbox reverts. Ordinary save/reload persisted correctly. Pickup changes now reload the latest save on conflict and reapply only the clicked pickup IDs for the captured run, with at most two retries. Preserve other runs, splits, notes, and unrelated checks; leave the existing conflict protection for other edits. Failed saves show **Not saved** in the header as well as the drawer error. Verified with isolated Playwright: ordinary reload, stale-tab check and uncheck, preservation of other runs and splits, and a simulated failed write. Test only with a temporary copy of the save; never infer missing pickups from route progress or copy them between runs without a player report.

### Skip instructions and G&Z map references · November 13

Joseph wants skips tied directly to the original G&Z map labels. Far Fields uses **Detour 1 (Warding Bell)** and **Detour 2 (flying-bomber Craftmetal)**. Apply the same short inline references to other numbered skips: Deep Docks Detour 2, Greymoor Detour 3 and Detour 4 / Checkpoints 3–4, Shellwood Checkpoint 2, Atla Checkpoint 1, Judge Detours 1 and 3, Cauldron Detours 1 and 2, and High Halls Detour 1. The Vaults side arena is a note before Checkpoint 2 (Pale Oil), not a numbered detour. Spool branches are unmarked on the original maps; retain their existing pins and directions. Source numbering was checked against the original guide, with Far Fields and Greymoor labels also checked on the recovered map images. Supplied replacement screenshots still have no original guide numbers drawn on them.

### Early rosary farm and Mort timing · November 13

Joseph calls his farming circuit the **little Sharka loop**, near Shakra’s Marrow bench, and reports **25 rosaries per circle in about 25 seconds**. Return to the bench and rest to reset. This works out to about 60 rosaries per minute; 400 additional rosaries takes 16 circles, or about 6:40 at the reported pace. Use the player’s approximate timing for budgeting, not as a new run split. Keep the live farm instruction brief: wallet target, loop rate, then the next destination; leave budget calculations here and omit the irrelevant broken-door branch from that instruction. The earlier 8-rosary report covered the two-enemy reset.

Farm immediately after paying the **40-rosary Deep Docks Bellway** toll and travelling to the Marrow, before Wormways, Pebb, or the Bone Bottom spool. The wallet target is **710 rosaries**: Pebb’s shard 300 + Belt 160 + pouch 220 + Mort’s first-entry fee 30 + Greymoor Bellway 60 − the planned Seamstress string 60. Pebb has not been paid at the farm; buying his shard leaves 410, and consuming the later string brings that to the 470 needed for Mort and Greymoor. Subtract the actual wallet to find the farming shortfall. From zero, 29 circles yield 725 in about 12:05. Keep both Mort items on the first visit and Far Fields Bellway skipped. Other bench tolls are outside this purchase budget. This is a route plan, not a report of purchases or current holdings.

### Fixed pickup plan · November 11

Joseph clarified that the guide is followed with all planned pickups collected. Pebb supplies the 300-rosary mask shard only; the Bone Bottom spending reminder is 340 including Deep Docks Bellway. Marrow Craftmetal funds Magma Bell and Blasted Steps Craftmetal funds Cogfly. The four early mask shards complete six masks at Shellwood.

Old recovery research remains in the imported sources: Pebb's 60-rosary Craftmetal, the Cauldron Craftmetal puzzle with its Undercrank ambush, and the optional ceiling locket below Trobbio's lift. These are outside the timed walkthrough and purchase reminders. The current on-path pickups cover the selected tools and Hunter slots.

### Recovered chats · seven extracts, six reported conversations

Joseph reports **six original chats**. We have preserved **seven extracts**: the earlier Shellwood source, three new attachments and three files moved verbatim from the project root. The [source index and reconciliation](./docs/chat-recovery.md) list every version; the [manifest](./docs/recovered-chats/manifest.json) records origins, byte counts, hashes, endpoints and possible overlaps. None is a byte-identical duplicate. The focused/full Widow accounts and two Lace 2 accounts may be alternate extracts of the same chats; no original IDs prove the mapping. Retain all versions without counting repeated handoff text as independent evidence.

**Corrections restored from the sources:** skip the explicitly rejected flying-bomber Craftmetal room. The current route collects Marrow Craftmetal for Magma Bell and Blasted Steps Craftmetal for Cogfly; the old Pebb backup proposal is superseded. Moorwing aid is optional: the early timed account confirms exhausted Greymoor dialogue but describes an empty aid spot after returning from a death. Do not mandate help or a deliberate death; the later roof/Forum objective remains selected. Mort's paid Memory Locket/farming suggestion was rejected; retain the on-path free lockets.

**Navigation recovered:** Far Fields currents/mask puzzle; Shellwood's Z approach, recommended 40-rosary bench, right shortcut and lower/upper right exits; separate Atla mask/spool branches; Deep Docks spool lever return; Songclave's rotating-wheel exit; lower Core shortcuts; Vaults hidden shard/Oil route and permanent-spawn arena skip; Whiteward fireplace/Injector route; Cauldron's higher-left Clawline exit; box/wind route to the roof; Forum reload fallback; Terminus runback. These are guide/planned directions unless a player result was explicitly reported. Keep Joseph's unmarked Shellwood screenshot and normal Sister Splinter fight.

**Timing qualifications:** 0:14 is arrival at Shakra's bench after Silkspear; 1:03 is back at Halfway Home after Moorwing; 1:21 Cling Grip was an estimate. Preserve the original labels, all reported clocks and minute precision. The old five-mask/3-of-4 Shellwood state belongs to the missed Far Fields shard; Run #3 plans the first-pass pickup and six masks at Shellwood. The first Phacia lure/pogo worked and the second was unreliable; no Switch 2 patch was established. Preserve the two deaths on the leg without inventing a boss-attempt count.

Early pending Needle #1, Bell #4, roof duel, Forum and finish states are superseded by later results. Keep the selected eight spool fragments, Architect's 450-rosary second kit, first-pass Mort purchases and the selected post-Conductor Fractured Mask trip. The November 19 decision moves Dice ahead of the Needle #2 trip. No run save, seed, historical pickup check or screenshot changed.

**Research only:** the Beast Crest discussion explicitly said “i'm not saying rewrite the guide.” Flintslate + Belt and an early Hunter's March/Savage Beastfly detour were explored, not adopted. The successful aggressive Trobbio rematch recollection was on the separate 100% file. Hunter remains selected. Old hallway checks around Citadel Spa/High Halls stay a fallback if roof gate/re-entry checks fail, not a mandatory blind search.

**Menu preference:** normal Save and Quit is accepted; force-close manipulation was explicitly rejected. Use the ordinary menu for the selected High Halls-anchor Mask return after Conductor’s Melody.

### Original section navigation · updated November 12

A fixed Sections button opens a left-side modal drawer, closed by default, with one entry for each of the original guide’s 13 travel-section titles. The guide uses the freed content width on desktop and mobile. A section with one walkthrough chunk opens directly. A section with multiple chunks expands to its useful step buttons, such as Shellwood mask/Cling Grip and the combined Widow / Needolin page. Highlight the current section and step; open the current multi-part section. Keep descriptive paragraphs and global Expand all / Collapse all controls out of the sidebar. Close the drawer with Close, Escape, a backdrop click, or a selected section/chunk. Preserve keyboard focus restoration and reduced-motion support. The Pickups drawer stays on the right. Joseph approved this distinction on November 12 after clarifying that only redundant single-chunk nesting felt odd.

Greymoor’s **Return after Widow** remains in the walkthrough because Bell #4 is delayed. Include it as a labeled step under the same Greymoor sidebar entry. The run-log picker lists current timing checkpoints and keeps recorded older points editable. The route groups its visits under 13 original sections. Use the original titles in the main heading, split picker groups and map keys except where Joseph has requested custom titles.

Every group has its corresponding original map, a labeled custom replacement, or an explicit missing-map notice with a named fallback. The Atla/Deep Docks chapter has its original Atla map and Joseph’s supplied Bellhart/Deep Docks return map; the unavailable original return image remains cataloged. Keep Upper Cogwork and Cradle as maps within the final original chapter. Long chapter titles wrap; the current checkpoint stays visible as a subtitle. Preserve the exact order and IDs of all 31 route checkpoints, all pickup IDs, the independent remembered guide step, and the recorded run files.

### Swift Step → Lace runback · November 12

Learning Swift Step sets the save/respawn point at the Weaver spire at the top of Deep Docks. After that pickup, skip the toll bench and go directly to Lace 1. A death or normal Save and Quit returns to that spire until another bench rest changes the respawn point. Keep the Deep Docks Bellway purchase on the subsequent Bone Bottom loop.

[Silksong save points · Deep Docks](https://hollowknight.wiki/w/Save_Data_%28Silksong%29/Save_Points#Deep_Docks)

### Opening section boundaries · clarified November 11

**Greymoor map scope · November 13:** Halfway Home & G&Z uses only the Greymoor map, with no map-selector row. Mort’s directions, link and purchase list belong to the end of the preceding Far Fields step. Keep the Far Fields image and its map key on the preceding Drifter’s Cloak step. The separate Moorwing aid screenshot remains available on the Moorwing step.

The first three chapters each use their own map. Chapter 1 covers Silkspear, Bell Beast and the Marrow bell. Chapter 2 uses only the Deep Docks map for Straight Pin, Marrow Craftmetal, Swift Step, Lace 1 and the Deep Docks bell. Chapter 3 uses only the Bone Bottom/Wormways map for the loop after Lace 1.

Remove the old cross-chapter map tabs and source-key associations from these steps. Guide subtitles follow those chapter boundaries. Show a single map directly, with no map-selector button row; selectors appear only when a step has multiple reference images. Preserve all 31 checkpoint IDs and historical split labels; the opening IDs still refer to their original split events. The Bone Bottom spending reminder remains 340 for Pebb's mask shard and Deep Docks Bellway.

### Shellwood map · supplied screenshot selected November 10

Joseph chose to use his [unmarked Shellwood/Bellhart screenshot](./assets/maps/Shellwood%20and%20Bellhart%20base.png) with the condensed Garmond directions. Use this screenshot as the only map for the Shellwood/Cling Grip, Widow shortcut, and Widow checkpoints. Its original bytes remain intact.

Keep the normal **Sister Splinter fight** before Cling Grip. The current written directions are the chosen condensed route; retain them. Explain that the screenshot has no route line or checkpoint numbers drawn on it. The original Steam section map remains missing, with this supplied screenshot recorded as its replacement.

The [annotation experiment](./assets/maps/Shellwood%20and%20Widow%20route%20draft.png), its [prompts](./docs/shellwood-map-prompts.md), and the original Cling Grip skip screenshot are archived and excluded from the timed guide/gallery. Do not retry the overlay unless Joseph asks.

### Last Judge map · supplied screenshot selected November 11

Joseph supplied the [Shellwood → Last Judge → Grand Gate screenshot](./assets/maps/Shellwood%20to%20Last%20Judge%20and%20Grand%20Gate.png) to fill this missing-map section. Preserve its original 2346 × 1582 PNG bytes. Use it for both Blasted Steps and Last Judge / Grand Gate checkpoints, replacing the overview fallback.

The screenshot shows map pins with no drawn route or Garmond checkpoint numbers. Retain the written checkpoint/detour key, Choral Chambers bench directions and selected Grand Gate spool climb. The original Steam image remains unavailable in the catalog, now with this replacement linked. No route, checkpoint IDs, pickup IDs or recorded results change.

### Songclave approach map · supplied screenshot selected November 11

Joseph added the [Grand Gate → Grand Bellway → Songclave route](./assets/maps/Grand%20Gate%20to%20Grand%20Bellway%20and%20Songclave.png), renamed from Screenshot 2026-11-11 at 12.35.53 AM.png with the original 2394 × 1234 PNG bytes preserved. Its red line shows the path from Grand Gate through Choral Chambers to Grand Bellway and up toward Songclave.

Use it for the Grand Bellway approach on step 14. The November 19 loop screenshot covers Songclave, the Dancers, lower Core and the Vaults arena return. The selected route uses the Greymoor conversation, roof duel and Forum offer for G&Z. No separate Choral Chambers encounter was reported on the successful scout or timed file.

### Guide consolidation · November 10

The Garmond guide’s section names, maps and checkpoint/detour numbers are retained as navigation references. Its text is condensed into the chosen route’s directions and map keys; the itinerary above takes precedence over the author’s alternate route and loadouts. Label settled exclusions as decided to skip in map keys and route-choice statuses; use direct Skip instructions in the walkthrough. Keep conditional supply stops conditional; the selected Mask trip now follows Conductor’s Melody. Collect Shard Pendant and the Mosshome rosary/commandment/lift pickups on the opening path. The Beastfly arena shortcut stays skipped so the normal arena path reaches Pendant. The selected Bone Bottom spool remains on the loop after Lace 1, using its trapdoor and lift passage. Avoid the ambiguous phrase reference only in the live guide.

Planned resources include the Marrow Craftmetal and Greymoor Bellway locket **478035**; the distinct Faydown ledge locket **478039 stays skipped**. Both Needle Upgrade #2 and free Dice come before Trobbio. Dice moved to the end of step 15 in the November 19 decision. After collecting the Vaultkeeper’s melody cylinder, return to the Vaultkeeper to learn the melody before the roof duel; collecting the cylinder alone is not the completed melody. Keep the eight selected spool fragments, Architect’s second kit, Hunter loadout and established skips. Checkpoint and preparation IDs and recorded results remain unchanged.

[Original guide text](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696) · [In-game melody dialogue](https://hollowknight.wiki/w/Module:TabbedDialogue/Silksong/en.json)

### Spools in pairs · updated November 22

**Selected: eight fragments, four completed spools, +4 Silk capacity.** None of these pickups adds an arena. Joseph explicitly closed this choice and wants to move on; do not reopen the alternatives unless he asks.

Pairs are displayed in the planned collection order:

1. Bone Bottom **478080** + Atla **478230**.
2. Deep Docks **477926** + Greymoor **478263**.
3. Grand Gate **478586** + lower Cogwork Core **478618**.
4. Whiteward **479317** + eastern Underworks **478704**.

These are planning/checklist pairs, not unique item matches. Existing pickup IDs and historical checked state remain intact. Lower Core `spool-core` and eastern Underworks `spool-cauldron` are active. New Whiteward `spool-whiteward` starts unrecorded.

| Pin | Verified access and route cost | Current planning |
|---|---|---|
| Deep Docks **477926** | No extra movement requirement listed. Cross the burning-floor room southwest of Forge Daughter, hit the far lever, and return over its platforms. No dedicated arena. | **Selected** on the Forge Daughter visit; pair with Greymoor. |
| Greymoor **478263** | The only Greymoor Spool Fragment in the map/list. Cling Grip is the listed requirement. Climb the upper passage and use the balloons; no double-jump or Craw Lake arena clear is listed. | **Selected**, completing the second pair with Deep Docks. Run #2's personally confirmed pickup remains the late one. |
| Lower Cogwork Core **478618** | Yellow 3 on Joseph’s loop map. Rest at the bench below the Dancers first; collect the fragment without another bench rest and quit-return there. | **Selected** as #6, completing the third pair with Grand Gate before the Vaults arena. Joseph considers the branch easy; no detour timing was reported. |
| Whiteward **479317** | Under the White Key lift. Call it from the top, shelter beside the shaft lever while it passes, then descend below its normal stop. | **Selected** before the fireplace climb, starting pair D. |
| Eastern Underworks **478704** | Descend the shaft east of the Cauldron and break wall **480018 from the east** into the small burning-floor room. It is distinct from the central arena reward. | **Selected** on the Cauldron pass after Clawline, completing pair D with Whiteward. |
| Grand Gate **478586** | At the top of the platforming puzzle. Strike the underside of the balancing platforms to reposition them. No double-jump requirement listed. | **Selected** in early Act 2; pair with lower Cogwork Core. |
| Bone Bottom **478080** | No ability or rosary cost, but it is a trapped side passage after trapdoor 477865 and lift lever 478344. | **Selected** on the early Bone Bottom loop; pair with Atla. No rosary cost. |
| Atla **478230** | Needolin opens Atla; Cling Grip reaches the upper passage above breakable wall 479063. Includes Marrowmaws. No double-jump or Moss Mothers fight is required for this spool. | **Selected** during the Eva visit; completes the first pair with Bone Bottom. |

**Arena distinction:** **479347** is the separate central Underworks gauntlet rewarding **478931**, the spool we already skip. Its waves include the Undercrank that smashes through the floor. Do not conflate that central arena with the small room for **478704**.

Central Underworks **478931** and double-jump High Halls **478909** stay skipped. Do not rename preparation IDs: keep `spool-core` for lower Core, reuse `spool-cauldron` for the selected eastern fragment, and use `spool-whiteward` for 479317.

[Archived spool comparison](./docs/history.md#spool-candidate-comparison) · [Spool location requirements](https://hollowknight.wiki/w/Spool_Fragment) · [Underworks and Cauldron arenas](https://hollowknight.wiki/w/Underworks) · [MapGenie public map data](https://mapgenie.io/api/v1/maps/812/data)

### Forum prep

- **Tool Pouch 2/4.** Keep Loddie's Marrow reward and buy Mort's for 220 on the first pass. Both together give 6 Cogflies and 18 Straight Pins. The Run #2 record confirms Loddie's pouch. For the rerun, the documented unlock is after Widow. Keep only Loddie’s first round; Joseph’s post-Widow income report makes the second-round necklace unnecessary. Budget Mort and early travel separately before that point.
- **Crafting Kit 2/4 · settled.** Keep Forge Daughter's 180-rosary upgrade and buy Twelfth Architect's kit for **450 rosaries after Clawline**. Joseph reports that earning rosaries by the Choral Chambers stage is not a problem. Skip Crawbug Clearing and the 25-Ragpelt farm. Retain preparation ID `kit-second`, now pointing at Architect kit 478728. The two upgrades take Cogflies to 7 damage per hit.
- **Hunter slots and resources · sufficient by player report.** Hunter tool slots means the sockets unlocked with Memory Lockets. Use the existing on-path pickups to fill Hunter; no separate slot-hunting task is needed. Joseph believes both the timed and scout files had one locket left over, and reports both have an extra Craftmetal. Treat the locket count as his recollection, superseding the older zero-locket snapshot in the imported project notes. This is not a new timed split or a newly acquired item. Keep one Craftmetal each for Magma Bell and Cogfly. **Correction:** Halfway Home locket 478039 requires Faydown Cloak, so remove it from the no-double-jump itinerary; Blasted Steps and the wind-route pickups remain. Do not add a replacement detour on the assumption that slots are short.

[Tool Pouch and Crafting Kit](https://hollowknight.wiki/w/Crafting_Kit) · [Loddie](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478251) · [Ragpelt farm](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478208) · [Twelfth Architect](https://hollowknight.wiki/w/Twelfth_Architect) · [Cogfly damage](https://hollowknight.wiki/w/Cogflies)

### Upcoming spending reminders

Joseph wants the cash needed for upcoming purchases shown at checkpoints, rather than an assumed starting wallet or locked early earning plan. `data/route.json` now stores purchase lists per spending stop; the tracker shows the next such stop at or after the selected checkpoint. Conditional fees are itemized separately. These are route plans, not assertions about historical purchases or the player's current balance. Recommended bench tolls in the walkthrough belong in the purchase reminders; other unlisted bench tolls are not included.

| Spending stop | Rosaries | Items / additional materials |
|---|---:|---|
| Lace 1 / Bone Bottom loop | **340** | Deep Docks Bellway 40 first, then Pebb shard 300. After paying the Bellway, farm to 710 before Pebb; this also reserves the later Mort / Greymoor budget. |
| Far Fields / first Mort visit | **410** | Entry 30 + Belt 160 + pouch 220. Collect the planned Seamstress string (60) before Mort; retain 60 for Greymoor. |
| Halfway Home / Greymoor | **60** | Greymoor Bellway. Mort’s spending belongs to the preceding Far Fields page. |
| Shellwood / Cling Grip approach | **40** | Recommended bench immediately after the Shellwood arena, before the elevator. |
| Widow / Bellhart | 60 | Bellhart Bellway 60; Needle Upgrade #1 is free |
| Loddie / Forge Daughter | **315 minimum** | First Loddie entry 25 + kit 180 + Magma Bell 110; +25 per retry and 1 Craftmetal. Skip the second-round necklace. |
| Blasted Steps | 60 | Bellway |
| Grand Bellway | **160** | Bell Beast 80 + Ventrica 80 |
| Songclave | 80 | Ventrica; take the White Key from the corpse |
| Vaults / Bellhart upgrade return | 0 | Needle Upgrade #2 requires 1 Pale Oil, no rosaries |
| Clawline / Twelfth Architect | **450** | Second Crafting Kit |
| High Halls | 80 | Ventrica; Cogfly additionally needs 1 Craftmetal |

Prices were checked against the public MapGenie pin descriptions and the existing guide. Keep the distinction between free Needle Upgrade #2 and the later paid upgrades; this route only plans the first two. [MapGenie weapon upgrades](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=480827) · [Architect kit](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478728) · [Garmond Route travel costs](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696)

### Route exclusion audit · Run #3, November 10

Joseph corrected the Shard Pendant exclusion: it is helpful for having enough Shell Shards early. Restore it as a planned pickup and equip it for early travel. The later Belt + Dice boss loadout is not a reason to omit an early supply tool. The earlier hard skip was an assistant inference, not a recorded user decision.

Audited all 31 walkthrough steps and every map-key exclusion against the source guide, current route decisions, and archived notes:

- **Restored opening resources:** Mosshome Frayed Rosary String, Choral Commandment, and return lift were also changed from guide options to hard skips without a recorded reason. Collect them. Sell the Commandment to Scrounge in Bellhart after Widow for 180 rosaries. Keep the selected Bone Bottom spool after Lace 1.
- **Fixed pickup plan · clarified November 11:** Collect Marrow Craftmetal for Magma Bell and Blasted Steps Craftmetal for Cogfly. Skip Pebb’s Craftmetal purchase, the flying-bomber room and the Cauldron Craftmetal puzzle. Collect the planned Greymoor Bellway, Blasted Steps and wind-route lockets; skip the locket below Trobbio’s lift. The walkthrough follows every planned pickup and carries no extra purchases or detours for hypothetical missed items.
- **Moorwing aid · corrected by recovered chat:** Exhaust the first Greymoor conversation and accept aid if offered. The encounter/reload check is guide advice; the historical timed account found them absent. Continue solo if they remain absent. Do not instruct a deliberate death or require Moorwing aid for the later roof/Forum plan.
- **Missing supply reminders:** Restored the hidden 60-rosary string near the Seamstress, Scrounge relic sale, nearby Forge Daughter rosary pickup, Songclave Grand Reed income, optional 220-rosary roof necklace/spare-cylinder turn-in, and final right-wall Shell Shard rock. These are supply instructions, not claims about current holdings or timed savings.
- **Missing spending · updated November 14:** Loddie charges 25 per attempt. The selected route now takes one successful pouch round, for 25 plus retries, and skips the second-round necklace. Combined Loddie/Forge Daughter outlay is at least 315. The prior two-round plan is superseded by Joseph’s 638-rosary income report.
- **Recorded choices retained:** Warding Bell was explicitly rejected during the November 9 support-tool discussion because interrupted Binds were not the reported problem; its exclusion is documented, unlike Pendant’s. Hunter over Wanderer/Reaper, Last Judge over Mist/Phantom, the ordinary Sister Splinter route, no Mount Fay, no Craw Lake/Thread Storm/Three-fold Pin, no Sting Shard/Cogwork Wheel/Delver’s Drill, the eight selected spool fragments, Architect’s second kit instead of Ragpelt farming, and the post-Conductor Fractured Mask trip all have recorded route reasons. Greymoor ledge locket 478039 needs Faydown Cloak; planned Bellway locket 478035 is a different pickup. The successful roof/Forum aid route supports avoiding an additional blind Choral Chambers search.

Keep checkpoint and existing pickup IDs stable. New Pendant/string/Commandment checks start unrecorded on every run. Do not infer that historical runs acquired them. Never turn a guide option into a firm exclusion solely because it is absent from the ending loadout; record its travel, supply or survival role and the evidence for the choice here.

[Source guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696) · [Pendant effect](https://hollowknight.wiki/w/Shard_Pendant) · [Commandment sale](https://hollowknight.wiki/w/Choral_Commandment) · [Public map data](https://mapgenie.io/api/v1/maps/812/data)

## Later reminder · map screenshots

Joseph asked to return to these after focusing on the run:

- Deep Docks return is covered by the November 14 supplied map; the earlier screenshot reminder is resolved.
- Songclave to Dancers, lower Core, Whispering Vaults arena and back to Songclave is covered by the November 19 loop screenshot.

Bring this up when map work resumes; no scheduled notification was requested.

## Scout questions and settled decisions

### Thread Storm without Craw Lake Arena

**Yes, there is a documented later bypass.** The Bass% route picks it up by climbing from the Far Fields side after obtaining Clawline and Faydown Cloak. That route documents the later setup. An earlier Thread Storm pickup with the Cling Grip Bell #4 route is unverified. The ordinary pickup uses the Craw Lake arena lever and balloon climb. Keep the arena and Thread Storm skipped for this rerun unless the user later validates an earlier route they want to use.

[Documented later bypass](https://speedpastes.org/kXQvcbMl) · [Standard Craw Lake pickup](https://hollowknight.wiki/w/Enemy_Gauntlets_%28Silksong%29/Greymoor_3) · [Thread Storm pin](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478061)

### Blue tool choice · Fractured Mask after Conductor’s Melody

**Current plan · updated November 22:** Keep Mirror + Injector Band through the Forum. Immediately after Conductor’s Melody, take the selected Forge Daughter and Fractured Mask trip using **High Halls bench 478415** as the quit-return anchor, with no intervening rests. Equip Mask instead of Mirror on returning, then continue to Architect’s Melody and the ending. Injector Band, Weighted Belt, and Magnetite Dice remain the planned supporting tools. Joseph’s scout GMS win confirms a clear with Mask and no Mirror; the other scout equipment, number of attempts, Mask activations, and final clock were not reported. Do not claim the Mask triggered during the win or invent a finish split.

**Player report:** Joseph can find safe healing openings and was not usually interrupted. Patient one- or two-hit punishes limit Silk income. A Lace hit commonly costs two masks, disrupts his rhythm, and can lead to a second hit for four masks lost in total. These observations motivated the comparison. Mirror was the November 9 baseline; the November 10 scout result led to the optional late Mask pickup.

| Tool | Current decision | Relevant mechanics and route cost |
|---|---|---|
| **Druid's Eye** | Decided to skip after the final Mirror decision. | Base Eye produces one strand per two damage triggers while Silk is below capacity. Some attacks produce two triggers; do not assume every two-mask attack does. Three Mossberries unlock the base version. Four more Mossberries upgrade and replace the base Eye (seven berries total); Joseph rejected the upgraded Eyes after learning that the final berry normally requires the Mount Fay detour. Keep this upgrade off the timed route; the base Eye was also left out when Joseph chose Mirror. |
| **Weavelight** | Decided to skip after the final Mirror decision. | Raises the passive regeneration ceiling by one strand and speeds refill below that ceiling. It does not keep adding Silk above the ceiling. This route skips the Unravelled, so before Lace 2 Bell Beast supplies one Silk Heart: Weavelight would raise passive refill from one strand to two. Requires the Moss Mothers fight and ceiling pickup at Atla. |
| **Fractured Mask** | **Selected after Conductor’s Melody.** Scout GMS clear confirmed with Mask and no Mirror. Use the late-game kit and High Halls 478415 quit-return, then replace Mirror for the ending. | Prevents one lethal injury and leaves one mask; a separate follow-up can still kill. Repairs for free at a bench. Buy from Mottled Skarr in Hunter's March for 260, or collect free near his corpse after any of Dancers, First Shrine bell, or Clawline, followed by resting at a bench outside Hunter's March. The merchant is beyond a trapped tunnel requiring Swift Step. The later timed-file trial included Forge Daughter’s 10 shard bundles and Mask acquisition, ending at Marrow bench at 5:06, reported as about ten minutes. That used a Marrow rest; it does not time the current High Halls-anchor variant. This is one-fight death insurance; recovery still needs Silk for Bind. |
| **Warding Bell** | **Rejected by Joseph.** | Protecting a Bind from damage does not address the reported Silk shortage; interrupted Binds were not the usual problem. Do not add its pickup to the timed route. |
| **Multibinder** | **Decided to skip.** Its 880-rosary cost was a concern during the comparison. | Correction to the earlier framing: My Missing Courier is a rescue of Tipp in northern Bone Bottom after Widow, including two Caranids, followed by shopping in Bellhart. It does not require the later brother/delivery quest chain. The detour has not been timed, and the 880-rosary purchase remains an obstacle. |

**Druid's Eyes upgrade rejected November 9:** The seven berries are two in Moss Grotto, three around Bone Bottom, one at Atla, and one in the Memorium. Using the two Grotto berries plus the berry below Moss Druid for the base Eye leaves two Bone Bottom berries, the Atla berry, and the Memorium berry for the upgrade. Normal Memorium access requires Faydown Cloak from Mount Fay, which this timed route skips. Joseph said to scrap the upgrade after this requirement was explained; do not add Mount Fay or the seven-berry collection to this run. No bypass has been validated for this run. Upgrading doubles the return from one to two strands per two damage triggers. [Berry locations](https://hollowknight.wiki/w/Mossberries) · [Memorium access](https://hollowknight.wiki/w/Memorium)

The selected ending uses Mask + Injector Band. The earlier Mirror-only continuation remains a recovery option if the pickup is missed. Do not retroactively change Run #2’s historical Mirror loadout, pickups, or times.

[Mirror](https://hollowknight.wiki/w/Claw_Mirror) · [Fractured Mask](https://hollowknight.wiki/w/Fractured_Mask) · [Mottled Skarr location and death conditions](https://hollowknight.wiki/w/Mottled_Skarr) · [Base Druid's Eye and upgraded Eyes](https://hollowknight.wiki/w/Druid%27s_Eye) · [Weavelight](https://hollowknight.wiki/w/Weavelight) · [Silk Heart regeneration and sources](https://hollowknight.wiki/w/Silk_Heart) · [My Missing Courier](https://hollowknight.wiki/w/My_Missing_Courier) · [Multibinder](https://hollowknight.wiki/w/Multibinder)

### Hunter’s March / Fractured Mask scout · November 10

Joseph reconsidered the prior Fractured Mask rejection after sleeping on it. This is a **scout**, using the scout file’s cumulative clock; it is separate from Run #2 and from the final timed route.

| Scout clock | Reported event |
|---:|---|
| **12:56** | Start at the [Marrow bench 477887](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477887), heading into Hunter’s March for Fractured Mask. |
| **13:06** | **Fractured Mask already collected**; reached the [trapped Hunter’s March bench 476886](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=476886), having disabled its trap. |

The displayed times differ by **10 minutes**. Preserve Joseph’s separate **roughly 12-minute estimate** as reported; do not rewrite either endpoint to match it. This interval includes rosary sightseeing and re-learning an area he had not played recently. Joseph confirmed that **Fractured Mask was already collected by 13:06**. The measured interval therefore includes the pickup and arrival at the de-trapped bench. Deaths/retries and an exact earlier pickup timestamp were not reported. Joseph subsequently reported that walking back takes roughly as long as the approach, without supplying another clock reading. For a future attempt, use the quit-to-menu return below rather than a second walking leg.

- **Observed route:** the entrance [Skarrgard 477962](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477962), then another [arena 479337](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=479337). The bench trap is disabled via the secret room on its left and [lever 478293](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478293).
- **Rosary stops reported:** [chest 477994](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477994), behind [breakable wall 477995](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477995); [pickup 477997](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=477997); and [secret room 478009](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478009) under the Hunter’s March entrance. The supplied 478009 URL had a trailing period; use the normalized pin. No rosary total was supplied. The upward Bellhart route was unavailable on this approach.
- **Player’s equipment assessment:** Drifter’s Cloak’s float made the platforming easier. Joseph initially named at least one Needle upgrade, an extra mask, and the Atla upgrade as desirable; his stronger concluding assessment was that an early push without the scout’s **two Needle upgrades, seven masks, and extra Silk** would be difficult. Keep the stronger setup as the basis for evaluating a late visit. “Atla upgrade” was his wording; the route already includes Eva’s Hunter evolution. Do not infer an exact scout Silk count or a new pickup checklist state.
- **Merchant / cost:** Joseph found Mottled Skarr dead, collected Fractured Mask for free, and confirmed it was in hand by the 13:06 bench time. [Fractured Mask 478607](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478607) is sold for 260 while he lives, or left by the corpse. His death can be triggered by First Shrine’s bell, Dancers, or Clawline, followed by a bench rest outside Hunter’s March; Act 3 is not required. This makes a visit after Needle Upgrade #2 and seven masks a candidate window, not a locked insertion point.
- **Current exit · updated November 22:** after Conductor’s Melody, rest at **High Halls bench 478415**, then visit Forge Daughter for supplies and Hunter’s March for Mask. Rest nowhere else, including Forge Daughter, Marrow and Hunter’s March. Rush the scouted approach, collect the free Mask and use **Quit to Menu / Save and Quit → Continue** back at High Halls to equip it. Skip the rosary and bench-trap diversions. This supersedes both the earlier Marrow anchor and the later optional Lace 2 / Core-anchor proposal. The historical 12:56–13:06 scout still began at Marrow.
- **Remaining cost:** the full trip from High Halls through Forge Daughter to the Mask, plus the quit/reload. This route variant has no separate measured duration. The earlier ten-minute interval starts at Marrow and does not include the Citadel-to-Marrow travel. Walking back was reported to take about the same time again, which the quit-return avoids. Quit-to-menu keeps the save and leaves the respawn point unchanged; resting on a different bench changes that return point. [Save points](https://hollowknight.wiki/w/Save_Data_%28Silksong%29/Save_Points) · [Bench behavior](https://hollowknight.wiki/w/Bench_%28Silksong%29).
- **Scout GMS outcome:** Joseph has now cleared Grand Mother Silk with **Fractured Mask on and Claw Mirror off** and considers the Mask likely to save him more often. No final clock, attempts, or activation count reported. This is the scout result, not a Run #2 finish. The selected High Halls-based pickup trip remains untimed; Joseph is confident in rushing Hunter’s March with the late-game kit. Fractured Mask prevents one lethal injury and repairs at a bench; it does not add Silk income.

Pin descriptions were checked against [MapGenie’s public map data](https://mapgenie.io/api/v1/maps/812/data) on November 10. Mechanics and the merchant’s death conditions were rechecked against [Fractured Mask](https://hollowknight.wiki/w/Fractured_Mask) and [Mottled Skarr](https://hollowknight.wiki/w/Mottled_Skarr).

### Timed-file restock and Fractured Mask trial · November 10

Joseph then used the **speedrun file (Run #2)** for the trip: Forge Daughter → buy **10 shard bundles** → the Marrow → rest at Marrow bench → Hunter’s March → Fractured Mask → **Marrow bench at 5:06**. He used **Cogfly, Straight Pin, and Mirror** along the approach and considers the **about ten-minute detour manageable if time allows**. The restock is part of that reported estimate, not an extra ten-minute charge.

- The active save records the 5:06 endpoint at minute precision, with a historical-only checkpoint ID. Preserve the 4:57 Lace 2 split. That detour report preceded the later 5:26:16 finish. Do not move the timed-file trial onto the scout file.
- The exact departure time, bundle rosary cost, and return method were not separately supplied; do not invent them. Mask is acquired on the timed file now, but no new equipped ending loadout was reported.
- This trial **rested at Marrow**, so it does not demonstrate the current no-intermediate-rest High Halls return. For the selected post-Conductor trip, rest at High Halls first and avoid all later bench rests, including Forge Daughter and Marrow. Buy supplies as needed; the trial bought ten bundles. The full High Halls-based trip is not a separately measured benchmark.
- The November 22 decision moves this trip after Conductor’s Melody with a High Halls quit-return. The older optional Lace 2 / Core-anchor variant is superseded. Use the reported ~10 minutes only as context for the earlier Marrow-rest trial, not an exact duration for the new route.

### Lace consistency and money

- Scout Lace 2 as a dedicated fight. Time actual attempts and runbacks separately from optional detours. Practice waiting for committed attacks and healing in recovery. Try safe Straight Pin windows while preserving Silk.
- Grand Mother Silk is now cleared on attempt six at 5:26:16. Use the learned patience and one-side positioning for the rerun; no individual attempt duration has been isolated.
- Check early rosaries for Pebb, Mort, and the first Bellways. Greymoor and Blasted Steps Bellway openings are useful for later returns. Keep the G&Z aid route and protected Needle/Forge Daughter budget. The paid second kit is settled; keep its 450-rosary target visible before Clawline.
- Map recovery on 2026-11-09 preserved the three existing maps and added 16 original guide images. The gallery shows the selected maps and screenshots; Mist and Sister Splinter skip alternatives remain archived. The separate Vaults shard/Pale Oil map is recovered. Shellwood/Widow, the Deep Docks return (shard/Forge Daughter), Last Judge/Choral Chambers, and combined Songclave/lower Core/Vaults arena maps have empty image URLs in the original guide. Joseph’s supplied screenshots now replace Shellwood/Widow and the Last Judge/Grand Gate overview fallback. The supplied red route now covers the Grand Gate/Grand Bellway/Songclave approach. Joseph’s November 14 annotated map now covers the Deep Docks return. Joseph’s November 19 loop screenshot covers the Dancers, lower Core and Vaults arena return. The guide does not mark spool fragments; custom screenshots can supplement the eight selected pins.

## Local references

- The supplied original artwork is in [assets/artwork](./assets/artwork/): the mask PNG serves the header/favicon/touch icon, the transparent Hornet PNG serves the desktop guide title, and the WebP remains an alternate. Preserve their bytes.
- Original guide images and their source URLs, dimensions, byte counts, and hashes live in [assets/maps/catalog.json](./assets/maps/catalog.json). Preserve credits in [docs/map-credits.md](./docs/map-credits.md). The selected route has its own spool pickups and tool choices.
- Edit checkpoint `guide` arrays and optional `guideTitle` in `data/route.json` for written directions. Section/checkpoint `maps` arrays select catalog IDs. Add replacement screenshots using the [map instructions](./docs/map-credits.md#adding-a-local-screenshot); keep exact waypoint pins where maps are missing.
- MapGenie's public Pharloom data was previously available at `https://mapgenie.io/api/v1/maps/812/data`. Old `/tmp/` caches are temporary; do not treat them as repository assets.

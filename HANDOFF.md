# Pharloom Runbook — Codex handoff

Updated November 10, 2026. This brief is for the Codex agent building Joseph's personal Hollow Knight: Silksong route and run tracker. Joseph will create the new repository. Start implementation in the project he opens for that work. Repository setup belongs to Joseph.

## Current scope · November 10

Joseph plans **one more timed run**. **The app is predominantly a guide**, per his latest correction: large inline map screenshots, numbered written directions, and Previous/Next navigation are the main experience. The 31 stable checkpoints also serve as guide steps. Guide position starts at Silkspear and is remembered separately from the selected run; switching sessions or saving a split must not move it. Split entry, metrics, history, session creation, and notes live in a closed-by-default Run log. The persistent Pickups button opens a right-side checklist drawer from any guide step; its saved checks belong to the selected run and are shared across the route. It closes with Close, Escape, or the backdrop and respects reduced motion. The full reference gallery expands inline. This guide-first direction supersedes the earlier tracker-led layout. Keep open research and alternative builds in this handoff. Existing historical timed and scout records remain intact. Commit coherent changes as work proceeds. Discuss unresolved route choices one question or pickup at a time; Joseph asked to avoid bundled planning questions.

Run #2’s Grand Mother Silk fight remains unfinished. Its latest report is **Marrow bench at 5:06** after the Forge Daughter restock and Fractured Mask pickup; the earlier Lace 2 clear stays **4:57**. No final time has been supplied. **Optional Fractured Mask at Lace 2 · November 10:** The scout has now beaten Grand Mother Silk with Fractured Mask equipped and no Claw Mirror. Joseph wants the pickup as an optional late backtrack once at Lace 2, using the fully upgraded kit to rush Hunter’s March. Set **Cogwork Core bench 478428** as the last rested bench, rest nowhere on the trip, collect the free Mask, and quit-return to Core to equip it. This supersedes the earlier Marrow return anchor. If the option is skipped, keep Mirror + Injector Band; if taken, Mask replaces Mirror while the other planned tools remain. No scout finish time was supplied. On the timed file Joseph then tested the restock-and-Mask trip, reporting about ten minutes and a Marrow bench endpoint at 5:06; the Core-anchor version is the future plan. Other rejected blue-tool alternatives remain archived. The second kit is settled on Twelfth Architect for 450 rosaries after Clawline; Joseph reports that earning rosaries in the Citadel is straightforward. The six-fragment plan is **locked by Joseph**: Bone Bottom 478080 + Atla 478230, Deep Docks 477926 + Greymoor 478263, and Grand Gate 478586 + eastern Underworks 478704. These complete three spools for +3 Silk capacity. Joseph is comfortable with the platforming; none adds a dedicated spool arena. Checkpoints now show upcoming spending amounts. Hunter slot capacity is not an open concern: Joseph recalls a spare locket on each file and reports an extra Craftmetal on each.

## Local artwork · November 9

Joseph supplied `hornet-mask-icon.png`, `hornet.png`, and `hornet.webp` in the repository root. Use these provided images for the app identity and artwork. The mask PNG is used in the header, favicon, and touch icon; the clean transparent `hornet.png` is used beside the desktop guide title. Keep the originals intact. `hornet.webp` is retained as the supplied alternate. The earlier hand-drawn SVG placeholder has been removed.

## Original implementation brief

A small local browser app for one player. It should replace the need to cross-reference the branching Steam guide during a run. Show Joseph's chosen route in order and make it quick to record what actually happened.

- **Tracker.** Start a named timed run or scout session. Pick a checkpoint, enter the displayed in-game time, optionally add a note, and save. Support editing a mistaken split and returning to any past run. Keep scout observations separate. Show the last split, progress, the next checkpoint, and time to the five-hour mark **at the recorded split**. Use the manual in-game clock. Accept hours and minutes and optionally seconds. Preserve the reported precision. Only mark a run finished once a final time is recorded. The sub-five condition is strictly under 5:00.
- **My route.** Present one main path using the itinerary below. Keep route steps, map pins, prep, and boss reminders easy to find during play. Use the recovered local maps when helpful. Put alternative builds and unsettled options in the scout queue.
- **Prep.** Track spool halves by pair and show the Silk gain only when both are checked. Track the Tool Pouch and Crafting Kit independently. The rerun goal is 2/4 of each. The second damage upgrade has two candidate sources and counts once for that target.
- **Scout queue.** Carry forward the questions and tests in this handoff. Let Joseph update the route and questions with Codex without rewriting the tracker. Keep the exact route and stable checkpoint IDs in one editable data file or similarly simple source.
- **Local saves.** Persist runs across browser reloads and restarts, and provide a simple way to back them up or export them. Prefer a format Codex can read, such as JSON. Keep historical splits intact when the future route is edited. Document how to start it locally and where saves live.

Use a minimal stack appropriate for the new project. A small HTML/CSS/JS app and a local Node server are sufficient if saving to disk. Keep setup, navigation, and configuration light. There is one user and one route. The target is a local browser workflow with no hosted service or account setup.

The first usable version should open Run #2 at **4:57**, allow a new blank rerun, save and reload an edited split, retain separate scout notes, show a complete spool pair correctly, and link to the available maps and the research brief.

## Current run and what changed

- **Run #2 is still in progress.** Latest clock: **5:06 at Marrow bench**, after visiting Forge Daughter for 10 shard bundles and collecting Fractured Mask. This trip used Cogfly, Straight Pin, and Mirror; Joseph estimated about ten minutes. It is a later continuation of Run #2, not a scout result. Lace 2 was defeated at **4:57**. There were three displayed minutes to 5:00 at that split. The user plans to finish Grand Mother Silk to rehearse the ending. Record the actual final time once reported. The final time and achievement result are pending.
- **Lace 2 was the bigger bottleneck for this player.** The winning blue tools were Injector Band and Claw Mirror. The yellow tools were Weighted Belt and Magnetite Dice. Belt felt useful. The approach was to wait for Lace, punish her recovery, and preserve Silk for Bind. The user found Straight Pin openings but did not rely on the red tools and reported no Cogfly use for the win. Treat the exact attempt count and which attempts used pins as unreported.
- **The 4:20–4:57 interval includes travel.** The user detoured to eastern Greymoor, picked up spool 478263, and went to Pilgrim's Rest for Weighted Belt. Craw Lake balloons were present on that late file with the arena uncleared. Keep this as one verified spool pickup. It is not evidence for the earlier movement kit or the Thread Storm branch.
- **High Halls was also hard.** The timed Forum clear at **4:11** took three attempts, with G&Z, Straight Pin, Cogfly, Claw Mirror, Injector Band, and Dice. The scout took about eight attempts. Scout aid and loadout were not specified. The 3:52–4:11 interval also includes the Dice detour.
- **Keep the official clock.** The **3:34** Vaultkeeper's Melody split already includes about ten minutes idle at a bench. The **3:45** split is the Cogwork Core bench after the G&Z duel. The **3:52** split is High Halls bench with Cogfly equipped. The user called the **4:20** split Checkpoint 1 before scouting Lace. Preserve the reported labels and times. Individual late melody pickups, bench locations, and scout Lace outcomes should only be recorded when supplied.

[Original Run #2 log](</Users/josephdavey/Documents/ChatGPT/Silk Song/Silksong - Current Run Tracker.md>) · [Detailed project history](</Users/josephdavey/Documents/ChatGPT/Silk Song/Silksong - Project Handoff.md>)

### Run #2 splits to import

These are cumulative times as reported. Seed them as historical data. Bellhart after the Far Fields backtrack is a Run #2-only stop. Leave unreported checkpoints blank, including the finish.

| Time | Checkpoint |
|---:|---|
| 0:14 | Silk Spear |
| 0:29 | Swift Step |
| 0:32 | Lace 1 defeated |
| 0:49 | Drifter's Cloak |
| 0:54 | Halfway Home |
| 1:03 | Moorwing defeated |
| 1:21 | Cling Grip |
| 1:25 | Widow bench |
| 1:36 | Widow / Needolin |
| 2:01 | Forge Daughter bench |
| 2:04 | Bellhart after Forge Daughter |
| 2:10 | Bellhart after the missed Far Fields shard backtrack |
| 2:21 | Blasted Steps bench |
| 2:29 | Last Judge / Choral Chambers bench |
| 2:33 | Grand Bellway bench |
| 2:35 | Songclave bell |
| 2:41 | Cogwork Dancers defeated |
| 2:49 | Lower Cogwork Core complete / back at bench |
| 3:04 | Songclave bench after Whispering Vaults arena |
| 3:18 | Grand Bellway bench after Trobbio |
| 3:34 | Vaultkeeper's Melody, including about 10 minutes idle |
| 3:45 | Cogwork Core bench 478428 after winning the G&Z duel |
| 3:52 | High Halls bench 478415 with Cogfly equipped |
| 4:11 | High Halls Forum clear |
| 4:20 | Checkpoint 1, as reported before scouting Lace 2 |
| 4:57 | Lace 2 defeated |

Run #2's confirmed prep checkmarks are the Greymoor fragment, Loddie's pouch, and Forge Daughter's kit. The other prep items are planned or unreported. Preserve the user-supplied record of the late Belt purchase and Greymoor spool pickup as notes within the Lace segment.

## Rerun route

Build the main view around this itinerary. The route is Hunter, all five bells, Last Judge through Blasted Steps, then G&Z at the Forum and the Act 2 ending. Retain established skips for the Mist/Phantom branch, Mount Fay, Wanderer/Reaper, Craw Lake Arena, Thread Storm, Threefold Pin, and Cogwork Wheel. Turn uncertain choices into scout questions while the timed path stays direct.

1. **Bone Bottom and Deep Docks.** Silkspear, Bell Beast, Marrow bell, Straight Pin, Swift Step, and Lace 1. Ring Deep Docks bell. The current planned mask route takes Wormways and Pebb on the Bone Bottom loop. Collect Bone Bottom spool 478080 through the trapdoor and trapped lift passage during that loop. Pebb costs 300. This is a planned route step from the reference, independent of unreported Run #2 purchases.
2. **First Far Fields and Greymoor pass.** Take the shard above the Seamstress before leaving with Drifter's Cloak. Buy Weighted Belt and the Tool Pouch on the first Pilgrim's Rest visit. Total is 380 rosaries, plus 30 if the door gear is intact. Break the gear from the inside. Open Greymoor Bellway for the later return. Exhaust Garmond's first Greymoor dialogue, then use the Halfway Home / Moorwing route.
3. **Shellwood, Widow, and post-Widow loop.** Sister Splinter for Cling Grip, Widow shortcut and Needolin, Bellhart bell and first Needle upgrade. Visit Eva for Hunter's evolution and take the Atla mask shard. Take the Atla spool to complete the first pair with the earlier Bone Bottom pickup. Return to Loddie after Widow for both target-practice rewards. On the Forge Daughter visit, get the damage kit for 180 and Magma Bell for 110 plus one Craftmetal, and collect the selected Deep Docks spool 477926 via the burning-floor room and far lever. The target is six masks before Judge and seven by late Act 2. Use the checkpoint spending reminders for the upcoming shop and travel costs; Joseph is not sure the early earnings will cover everything.
4. **Bell #3 and Last Judge.** Climb above and right of Halfway Home, use the top-right transition, and go northeast. Keep this bypass. This trip is the planned window for the Greymoor spool, completing the second pair with Deep Docks. Skip the Ragpelt farm; the second damage kit is now bought later. Ring the fifth bell through Shellwood/Blasted Steps, take the locket, and open Blasted Steps Bellway. Use Needolin at the Grand Gate and fight Last Judge. After reaching Choral Chambers, use the return shortcut to climb the Grand Gate balancing-platform puzzle for spool 478586. The route skips Mist and Phantom.
5. **Songclave and Vaults.** Open Grand Bellway travel and the First Shrine bell. Take White Key, beat the Cogwork Dancers, clear lower Core, and open the top-right shortcut. Clear the Whispering Vaults arena. Get the planned mask shards and Pale Oil for Needle Upgrade #2. Pair the Bellhart upgrade trip with a Blasted Steps Bellway stop for free Dice after Dancers, before the Forum. This combines two planned travel stops. Exact savings have not been timed.
6. **Trobbio, Cauldron, and roof.** Defeat Trobbio and open his lift shortcut. Get Injector Band in Whiteward, then Clawline. Use Magma Bell through Cauldron and buy Twelfth Architect's 450-rosary Crafting Kit after Clawline. Collect eastern Underworks spool 478704 behind the small lava room's wall to complete the third pair with Grand Gate. Collect Vaultkeeper's Melody, run the box and wind puzzle, and open the far-left roof gate 480502. Leave and return through that gate for the duel. The earlier Greymoor conversation qualified on scout. The timed run got G&Z aid without a separately reported Choral Chambers encounter. Exhaust post-duel dialogue and accept their help at the Forum door inside High Halls.
7. **Forum and endgame.** Get Cogfly for one Craftmetal on the High Halls descent. The Forum target is two pouch upgrades, two damage upgrades, Straight Pin + Cogfly, and G&Z. Collect Conductor's Melody and Architect's Melody. At Lace 2, optionally rush Hunter’s March for Fractured Mask using Cogwork Core bench 478428 as the quit-return anchor, with no rests en route; equip it instead of Mirror on returning. Otherwise continue with Mirror. Ascend to Lace and keep the patient, heal-first approach. Rest at Terminus, open the final shortcut, and record the actual finish after Grand Mother Silk.

[Original Garmond Route](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696) · [Recovered maps and credits](./Recovered%20Garmond%20Maps/README.md) · [Roof gate](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=480502) · [Forum aid](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=481022)

### Wayfinding for the route view

MapGenie links take the form `https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=PIN`. Use these resolved pins as links where they make a checkpoint easier to navigate.

| Leg | Pins |
|---|---|
| Marrow / Deep Docks | Silkspear 477871, Straight Pin 477899, Lace 1 476915, Wormways mask shard 478091, Pebb's mask shard 477840 |
| Far Fields / Greymoor | Drifter's Cloak 477971, Seamstress mask shard 477975, Mort 477946, Greymoor Bellway 478037, first G&Z conversation 478152, Halfway Home locket 478039, Moorwing 478453 |
| Shellwood / Bellhart / Atla | Shellwood shard 478177, Cling Grip 478189, Widow 478138, Crawbug Clearing 478208, Eva 478228, Atla mask shard 478233, Loddie 478251 |
| Forge / Judge | Deep Docks mask shard 477901, Forge Daughter 476912, nearby rosaries 477921, Blasted Steps Bellway 478308, locket 478502, Lumble 478519, Last Judge 478545 |
| Songclave / Vaults | White Key 478599, Cogwork Dancers 478606, lower Core mask shard 478615, Vaults mask shard 478671, Pale Oil 478668, Trobbio 478690 |
| Whiteward / Cauldron / roof | Whiteward elevator 478590, Injector Band 479182, Clawline 478714, Twelfth Architect 478723, Vaultkeeper's Melody 478611, wind-route locket 478676, roof gate 480502, roof duel 479361, Cogwork Core bench 478428 |
| High Halls / ending | Cogfly 478903, High Halls bench 478415, G&Z aid 481022, Forum 479420, Conductor's Melody 478609, Architect's Melody 478610, Lace 2 479088, Grand Mother Silk 479099 |

For Architect's Melody, use the guide's hit counts from the initial state. Left to right, rows from top to bottom are **1–3–3–3 / 2–0–0–3 / 0–1–1–1 / 1–1–0–2**. If a lever has already been moved, use the pillar alignment. [Puzzle reference](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696)

## Decisions to carry forward

### Spools in pairs · locked November 9

**Locked: six selected fragments, three completed spools, +3 Silk capacity.** None of these pickups adds an arena. Joseph explicitly closed this choice and wants to move on; do not reopen the alternatives unless he asks.

Pairs are displayed in the planned collection order:

1. Bone Bottom **478080** + Atla **478230**.
2. Deep Docks **477926** + Greymoor **478263**.
3. Grand Gate **478586** + eastern Underworks **478704**.

These are planning/checklist pairs, not unique item matches. Existing pickup IDs and historical checked state remain intact. Lower Core `spool-core` is retained as an archived item, shown only on runs where it was already checked; it is excluded from the final six-fragment itinerary.

| Pin | Verified access and route cost | Current planning |
|---|---|---|
| Deep Docks **477926** | No extra movement requirement listed. Cross the burning-floor room southwest of Forge Daughter, hit the far lever, and return over its platforms. No dedicated arena. | **Selected** on the Forge Daughter visit; pair with Greymoor. |
| Greymoor **478263** | The only Greymoor Spool Fragment in the map/list. Cling Grip is the listed requirement. Climb the upper passage and use the balloons; no double-jump or Craw Lake arena clear is listed. | **Selected**, completing the second pair with Deep Docks. Run #2's personally confirmed pickup remains the late one. |
| Eastern Underworks **478704** | Descend the shaft east of the Cauldron and break wall **480018 from the east** into the small burning-floor room. It is distinct from the central arena reward. | **Selected**, completing the third pair with Grand Gate. |
| Grand Gate **478586** | At the top of the platforming puzzle. Strike the underside of the balancing platforms to reposition them. No double-jump requirement listed. | **Selected** in early Act 2; pair with eastern Underworks. |
| Bone Bottom **478080** | No ability or rosary cost, but it is a trapped side passage after trapdoor 477865 and lift lever 478344. | **Selected** on the early Bone Bottom loop; pair with Atla. No rosary cost. |
| Atla **478230** | Needolin opens Atla; Cling Grip reaches the upper passage above breakable wall 479063. Includes Marrowmaws. No double-jump or Moss Mothers fight is required for this spool. | **Selected** during the Eva visit; completes the first pair with Bone Bottom. |

**Arena distinction:** **479347** is the separate central Underworks gauntlet rewarding **478931**, the spool we already skip. Its waves include the Undercrank that smashes through the floor. Do not conflate that central arena with the small room for **478704**.

Lower Core **478618** is now skipped in favour of the selected six. Keep the double-jump High Halls spool **478909** skipped. Do not rename existing preparation IDs if the final pair changes: add a distinct ID for any newly tracked pickup and retain old IDs for historical records.

[Local spool comparison](./Silksong%20-%20Spool%20Fragment%20Candidates.md) · [Spool location requirements](https://hollowknight.wiki/w/Spool_Fragment) · [Underworks and Cauldron arenas](https://hollowknight.wiki/w/Underworks) · [MapGenie public map data](https://mapgenie.io/api/v1/maps/812/data)

### Forum prep

- **Tool Pouch 2/4.** Keep Loddie's Marrow reward and buy Mort's for 220 on the first pass. Both together give 6 Cogflies and 18 Straight Pins. The Run #2 record confirms Loddie's pouch. For the rerun, the documented unlock is after Widow, so the second-round 220-rosary necklace arrives too late to fund the first Mort stop. Budget Mort and early travel before the run.
- **Crafting Kit 2/4 · settled.** Keep Forge Daughter's 180-rosary upgrade and buy Twelfth Architect's kit for **450 rosaries after Clawline**. Joseph reports that earning rosaries by the Choral Chambers stage is not a problem. Skip Crawbug Clearing and the 25-Ragpelt farm. Retain preparation ID `kit-second`, now pointing at Architect kit 478728. The two upgrades take Cogflies to 7 damage per hit.
- **Hunter slots and resources · sufficient by player report.** Hunter tool slots means the sockets unlocked with Memory Lockets. Use the existing on-path pickups to fill Hunter; no separate slot-hunting task is needed. Joseph believes both the timed and scout files had one locket left over, and reports both have an extra Craftmetal. Treat the locket count as his recollection, superseding the older zero-locket snapshot in the imported project notes. This is not a new timed split or a newly acquired item. Keep one Craftmetal each for Magma Bell and Cogfly. **Correction:** Halfway Home locket 478039 requires Faydown Cloak, so remove it from the no-double-jump itinerary; Blasted Steps and the wind-route pickups remain. Do not add a replacement detour on the assumption that slots are short.

[Tool Pouch and Crafting Kit](https://hollowknight.wiki/w/Crafting_Kit) · [Loddie](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478251) · [Ragpelt farm](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478208) · [Twelfth Architect](https://hollowknight.wiki/w/Twelfth_Architect) · [Cogfly damage](https://hollowknight.wiki/w/Cogflies)

### Upcoming spending reminders

Joseph wants the cash needed for upcoming purchases shown at checkpoints, rather than an assumed starting wallet or locked early earning plan. `data/route.json` now stores purchase lists per spending stop; the tracker shows the next such stop at or after the selected checkpoint. Conditional fees are itemized separately. These are route plans, not assertions about historical purchases or the player's current balance. Bench tolls outside these listed purchases are not included.

| Spending stop | Rosaries | Items / additional materials |
|---|---:|---|
| Lace 1 / Bone Bottom loop | 340 | Pebb shard 300 + Deep Docks Bellway 40 |
| First Halfway Home / Greymoor pass | **440–470** | Belt 160 + pouch 220 + Greymoor Bellway 60; +30 if the Pilgrim's Rest door gear is intact |
| Widow / Bellhart | 60 | Bellhart Bellway 60; Needle Upgrade #1 is free |
| Forge Daughter | **290** | Kit 180 + Magma Bell 110; also 1 Craftmetal |
| Blasted Steps | 60 | Bellway |
| Grand Bellway | **160** | Bell Beast 80 + Ventrica 80 |
| Songclave | 80 | Ventrica; take the White Key from the corpse |
| Vaults / Bellhart upgrade return | 0 | Needle Upgrade #2 requires 1 Pale Oil, no rosaries |
| Clawline / Twelfth Architect | **450** | Second Crafting Kit |
| High Halls | 80 | Ventrica; Cogfly additionally needs 1 Craftmetal |

Prices were checked against the public MapGenie pin descriptions and the existing guide. Keep the distinction between free Needle Upgrade #2 and the later paid upgrades; this route only plans the first two. [MapGenie weapon upgrades](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=480827) · [Architect kit](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478728) · [Garmond Route travel costs](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696)

## Scout questions and settled decisions

### Thread Storm without Craw Lake Arena

**Yes, there is a documented later bypass.** The Bass% route picks it up by climbing from the Far Fields side after obtaining Clawline and Faydown Cloak. That route documents the later setup. An earlier Thread Storm pickup with the Cling Grip Bell #3 route is unverified. The ordinary pickup uses the Craw Lake arena lever and balloon climb. Keep the arena and Thread Storm skipped for this rerun unless the user later validates an earlier route they want to use.

[Documented later bypass](https://speedpastes.org/kXQvcbMl) · [Standard Craw Lake pickup](https://hollowknight.wiki/w/Enemy_Gauntlets_%28Silksong%29/Greymoor_3) · [Thread Storm pin](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478061)

### Blue tool choice · optional Fractured Mask at Lace 2

**Current plan:** Keep Mirror + Injector Band through the existing route. At the Lace 2 checkpoint, optionally take Fractured Mask using a quit-return to **Cogwork Core bench 478428**. Mask replaces Mirror for the ending if collected; otherwise continue with Mirror. Injector Band, Weighted Belt, and Magnetite Dice remain the planned supporting tools. Joseph’s scout GMS win confirms a clear with Mask and no Mirror; the other scout equipment, number of attempts, Mask activations, and final clock were not reported. Do not claim the Mask triggered during the win or invent a finish split.

**Player report:** Joseph can find safe healing openings and was not usually interrupted. Patient one- or two-hit punishes limit Silk income. A Lace hit commonly costs two masks, disrupts his rhythm, and can lead to a second hit for four masks lost in total. These observations motivated the comparison. Mirror was the November 9 baseline; the November 10 scout result led to the optional late Mask pickup.

| Tool | Current decision | Relevant mechanics and route cost |
|---|---|---|
| **Druid's Eye** | Considered for expected hits; not selected after the final Mirror decision. | Base Eye produces one strand per two damage triggers while Silk is below capacity. Some attacks produce two triggers; do not assume every two-mask attack does. Three Mossberries unlock the base version. Four more Mossberries upgrade and replace the base Eye (seven berries total); Joseph rejected the upgraded Eyes after learning that the final berry normally requires the Mount Fay detour. Keep this upgrade off the timed route; the base Eye was also left out when Joseph chose Mirror. |
| **Weavelight** | Considered for patient play; not selected after the final Mirror decision. | Raises the passive regeneration ceiling by one strand and speeds refill below that ceiling. It does not keep adding Silk above the ceiling. This route skips the Unravelled, so before Lace 2 Bell Beast supplies one Silk Heart: Weavelight would raise passive refill from one strand to two. Requires the Moss Mothers fight and ceiling pickup at Atla. |
| **Fractured Mask** | **Optional at Lace 2.** Scout GMS clear confirmed with Mask and no Mirror. Use the late-game kit and Cogwork Core 478428 quit-return; skip if continuing directly with Mirror. | Prevents one lethal injury and leaves one mask; a separate follow-up can still kill. Repairs for free at a bench. Buy from Mottled Skarr in Hunter's March for 260, or collect free near his corpse after any of Dancers, First Shrine bell, or Clawline, followed by resting at a bench outside Hunter's March. The merchant is beyond a trapped tunnel requiring Swift Step. The later timed-file trial included Forge Daughter’s 10 shard bundles and Mask acquisition, ending at Marrow bench at 5:06, reported as about ten minutes. That used a Marrow rest; the planned Core-anchor variant remains distinct. This is one-fight death insurance; recovery still needs Silk for Bind. |
| **Warding Bell** | **Rejected by Joseph.** | Protecting a Bind from damage does not address the reported Silk shortage; interrupted Binds were not the usual problem. Do not add its pickup to the timed route. |
| **Multibinder** | **Not selected.** Its 880-rosary cost was a concern during the comparison. | Correction to the earlier framing: My Missing Courier is a rescue of Tipp in northern Bone Bottom after Widow, including two Caranids, followed by shopping in Bellhart. It does not require the later brother/delivery quest chain. The detour has not been timed, and the 880-rosary purchase remains an obstacle. |

**Druid's Eyes upgrade rejected November 9:** The seven berries are two in Moss Grotto, three around Bone Bottom, one at Atla, and one in the Memorium. Using the two Grotto berries plus the berry below Moss Druid for the base Eye leaves two Bone Bottom berries, the Atla berry, and the Memorium berry for the upgrade. Normal Memorium access requires Faydown Cloak from Mount Fay, which this timed route skips. Joseph said to scrap the upgrade after this requirement was explained; do not add Mount Fay or the seven-berry collection to this run. No bypass has been validated for this run. Upgrading doubles the return from one to two strands per two damage triggers. [Berry locations](https://hollowknight.wiki/w/Mossberries) · [Memorium access](https://hollowknight.wiki/w/Memorium)

The ending uses Mask + Injector Band if the optional pickup is taken, otherwise Mirror + Injector Band. Do not retroactively change Run #2’s historical Mirror loadout, pickups, or times.

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
- **Current optional exit · updated by Joseph:** once at Lace 2, choose whether to take the pickup. Before leaving, rest at **Cogwork Core bench 478428**. Travel out to Hunter’s March without resting anywhere else, including the Marrow and Hunter’s March benches. Rush the scouted approach and skip the rosary diversions; collect the free Mask, use **Quit to Menu / Save and Quit**, then Continue back at Core to equip it. Skip the bench trap-disabling detour. This supersedes the earlier Marrow return anchor; the historical 12:56–13:06 scout still began at Marrow and is not a Core-based timing.
- **Remaining cost:** the full trip from Cogwork Core out to the Mask, plus the quit/reload. The earlier ten-minute interval starts at Marrow and does not include the Citadel-to-Marrow travel. Walking back was reported to take about the same time again, which the quit-return avoids. Quit-to-menu keeps the save and leaves the respawn point unchanged; resting on a different bench changes that return point. [Save points](https://hollowknight.wiki/w/Save_Data_%28Silksong%29/Save_Points) · [Bench behavior](https://hollowknight.wiki/w/Bench_%28Silksong%29).
- **Scout GMS outcome:** Joseph has now cleared Grand Mother Silk with **Fractured Mask on and Claw Mirror off** and considers the Mask likely to save him more often. No final clock, attempts, or activation count reported. This is the scout result, not a Run #2 finish. The Core-based pickup trip remains untimed and optional; Joseph is confident in rushing Hunter’s March with the late-game kit. Fractured Mask prevents one lethal injury and repairs at a bench; it does not add Silk income.

Pin descriptions were checked against [MapGenie’s public map data](https://mapgenie.io/api/v1/maps/812/data) on November 10. Mechanics and the merchant’s death conditions were rechecked against [Fractured Mask](https://hollowknight.wiki/w/Fractured_Mask) and [Mottled Skarr](https://hollowknight.wiki/w/Mottled_Skarr).

### Timed-file restock and Fractured Mask trial · November 10

Joseph then used the **speedrun file (Run #2)** for the trip: Forge Daughter → buy **10 shard bundles** → the Marrow → rest at Marrow bench → Hunter’s March → Fractured Mask → **Marrow bench at 5:06**. He used **Cogfly, Straight Pin, and Mirror** along the approach and considers the **about ten-minute detour manageable if time allows**. The restock is part of that reported estimate, not an extra ten-minute charge.

- Record the 5:06 endpoint at minute precision, with a historical-only checkpoint ID. Preserve the 4:57 Lace 2 split. Do not create a GMS finish or move this trial onto the scout file.
- The exact departure time, bundle rosary cost, and return method were not separately supplied; do not invent them. Mask is acquired on the timed file now, but no new equipped ending loadout was reported.
- This trial **rested at Marrow**, so it does not demonstrate the no-intermediate-rest Core return. For the future optional trip, rest at Core first and avoid all later bench rests, including Forge Daughter and Marrow. Add the shop stop if supplies are useful; the trial bought ten bundles. The full Core-based trip is not a separately measured benchmark.
- Keep the pickup optional at Lace 2, conditioned on time left for the detour and the final fights. Use the reported ~10 minutes as a practical reference, not an invented exact duration.

### Lace consistency and money

- Scout Lace 2 as a dedicated fight. Time actual attempts and runbacks separately from optional detours. Practice waiting for committed attacks and healing in recovery. Try safe Straight Pin windows while preserving Silk.
- Rehearse Grand Mother Silk and record the Run #2 finish, even if the five-hour goal is missed. Use the observed fight time to plan a realistic Lace split.
- Check early rosaries for Pebb, Mort, and the first Bellways. Greymoor and Blasted Steps Bellway openings are useful for later returns. Keep the G&Z aid route and protected Needle/Forge Daughter budget. The paid second kit is settled; keep its 450-rosary target visible before Clawline.
- Map recovery on 2026-11-09 preserved the three existing maps and added 16 original guide images. The gallery shows 12 maps and 3 relevant screenshots; Mist and Sister Splinter skip alternatives remain archived. The separate Vaults shard/Pale Oil map is recovered. Shellwood/Widow, the Deep Docks return (shard/Forge Daughter), Last Judge/Choral Chambers, and combined Songclave/lower Core/Vaults arena maps have empty image URLs in the current guide. Use checkpoint pins until Joseph supplies replacements. The guide does not mark spool fragments; custom screenshots can supplement the six locked pins.

## Local artwork and guide references

The supplied `hornet.png` and `hornet-mask-icon.png` provide the app artwork. The guide images live in [Recovered Garmond Maps](./Recovered%20Garmond%20Maps/README.md), with source URLs and hashes in its `catalog.json`. Preserve original credits and label annotated images as reference maps. The selected route follows the itinerary above, including its own spool pickups and tool choices. Each checkpoint’s `guide` array holds the numbered instructions and optional `guideTitle` holds a reading title; retain historical split labels and IDs.

Map selection belongs in section/checkpoint `maps` arrays in `data/route.json`. Missing originals are listed in the catalog and the gallery. A local screenshot can be added there without changing checkpoint IDs or run data. Exact waypoint pins continue to cover the gaps. MapGenie’s public Pharloom data was previously available at `https://mapgenie.io/api/v1/maps/812/data`; the cached `/tmp/silksong-mapgenie-data.json` is temporary.

## Ongoing use with Codex

After the new project is open, read this brief and the older source notes, then build the local tracker there. Put short launch and data-editing instructions in that project's README. When Joseph provides a new split or scout result, record it in the correct run at the precision he reports. Keep decisions in one editable route source. If a scout result changes the selected path, update the main itinerary and retain the decision in the notes. Preserve historical labels and times even when a stop is removed from the future route.

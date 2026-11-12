# Pharloom Runbook — current handoff

Updated November 12, 2026. The local app is implemented. Joseph reports starting **Run #3**. This file holds current route decisions, research alternatives, and open scout questions; [README.md](./README.md) covers use and maintenance. The [source archive](./docs/history.md) preserves older notes without serving as a second live handoff.

## Working contract

- Keep one timed route in [data/route.json](./data/route.json), with stable checkpoint and preparation IDs. Historical labels and reported precision survive route edits.
- Treat `.runbook/runs.json` as the active save. [data/seed-runs.json](./data/seed-runs.json) remains the original 26-split import ending at **4:57**, with three recorded pickups and no finish. Never replace an existing save with the seed or infer pickups from route progress.
- Keep timed and scout results separate. Use the manual in-game clock, retain idle time and detours, and finish only when a `gms` split is reported. Sub-five is strictly below `5:00:00`.
- Keep the app local and dependency-free. The 31 checkpoints are guide steps, grouped under the original Garmond guide’s 13 full section titles, with a labeled return to Greymoor after Widow. The original section title is the main page heading; the selected checkpoint is a subtitle. Inline maps, numbered directions, and Previous/Next are the main experience. Guide position starts at Silkspear and persists independently of run selection and split entry.
- Keep the Run log closed by default. The persistent Pickups drawer shares the selected run's checks across all steps; category checkboxes support partial/all states, the last check closes its accordion, and optional items do not block the main total. Retain the three spool pairs, eight-shard mask category, historical checked items, Escape/backdrop closing, reduced-motion support, and inline reference gallery.
- Keep the Garmond guide’s section names, numbered checkpoints, and detours visible with the relevant map screenshot. These guide references do not add timed splits. Clearly label missing original maps and distinguish guide options from the selected path.
- Write the timed walkthrough and purchases for collecting every planned pickup in order. Keep old recovery options for missed items in research. Conditional shop entry fees, retries, actual supply needs and the chosen optional Mask trip still apply.
- Discuss unresolved route choices **one question or pickup at a time**. Keep alternatives here; update the route only when a choice changes. Run `npm run check` after changes and commit coherent work.

## Current run

- **Run #2 finished at 5:26:16**, with Grand Mother Silk defeated on the **sixth attempt**. Preserve second precision. The official finish is 26:16 beyond the five-hour cutoff and retains all idle time and detours. The earlier 5:06 Marrow restock/Mask endpoint and 4:57 Lace 2 clear are unchanged. This is the completed timed file; the scout’s earlier GMS clear remains a separate result.
- **Lace 2 was the bigger bottleneck for this player.** The winning blue tools were Injector Band and Claw Mirror. The yellow tools were Weighted Belt and Magnetite Dice. Belt felt useful. The approach was to wait for Lace, punish her recovery, and preserve Silk for Bind. The user found Straight Pin openings but did not rely on the red tools and reported no Cogfly use for the win. Treat the exact attempt count and which attempts used pins as unreported.
- **The 4:20–4:57 interval includes travel.** The user detoured to eastern Greymoor, picked up spool 478263, and went to Pilgrim's Rest for Weighted Belt. Craw Lake balloons were present on that late file with the arena uncleared. Keep this as one verified spool pickup. It is not evidence for the earlier movement kit or the Thread Storm branch.
- **High Halls was also hard.** The timed Forum clear at **4:11** took three attempts, with G&Z, Straight Pin, Cogfly, Claw Mirror, Injector Band, and Dice. The scout took about eight attempts. Scout aid and loadout were not specified. The 3:52–4:11 interval also includes the Dice detour.
- **Keep the official clock.** The **3:34** Vaultkeeper's Melody split already includes about ten minutes idle at a bench. The **3:45** split is the Cogwork Core bench after the G&Z duel. The **3:52** split is High Halls bench with Cogfly equipped. The user called the **4:20** split Checkpoint 1 before scouting Lace. Preserve the reported labels and times. Individual late melody pickups, bench locations, and scout Lace outcomes should only be recorded when supplied.

The 5:06-to-finish interval is **20:16**, including return travel/preparation and attempts. Six attempts does not mean six deaths. Fractured Mask saved Joseph during the attempts; its exact activation count and the complete ending loadout were not reported. For GMS, phase 1 was straightforward; stay on one side in phases 2/3, watch and avoid knives, and save Silk for healing.

## Selected rerun route

Build the main view around this itinerary. The route is Hunter, all five bells, Last Judge through Blasted Steps, then G&Z at the Forum and the Act 2 ending. Retain established skips for the Mist/Phantom branch, Mount Fay, Wanderer/Reaper, Craw Lake Arena, Thread Storm, Threefold Pin, and Cogwork Wheel. Turn uncertain choices into scout questions while the timed path stays direct.

1. **Bone Bottom and Deep Docks.** Clear the Marrow arena and collect/equip Shard Pendant for early Shell Shards. Get Silkspear, the Mosshome Frayed Rosary String and Choral Commandment, and activate the Mosshome return lift. Continue through Bell Beast, Marrow bell, Straight Pin, Swift Step, and Lace 1. Ring Deep Docks bell. The current planned mask route takes Wormways and Pebb on the Bone Bottom loop. Collect Bone Bottom spool 478080 through the trapdoor and trapped lift passage during that loop. Pebb costs 300. These are planned steps, independent of unreported Run #2 purchases. Skip maps, Quill and Compass unless a map is needed to navigate.
2. **First Far Fields and Greymoor pass.** Skip both the Warding Bell bronze-pipe detour and the adjoining flying-bomber Craftmetal room that Joseph explicitly rejected. The normal two-pickup budget remains Marrow for Magma Bell and Blasted Steps for Cogfly. From the tall room, take the lowest right exit past Fourth Chorus to the Seamstress. Get Drifter's Cloak and the shard above her, then defeat Fourth Chorus on the return. Buy Weighted Belt and the Tool Pouch on the first Pilgrim's Rest visit. Total is 380 rosaries, plus 30 if the door gear is intact. Break the gear from the inside. Open Greymoor Bellway for the later return. Exhaust Garmond's first Greymoor dialogue, then use the Halfway Home / Moorwing route. Accept Moorwing aid if offered; after one guide encounter/reload check, continue solo if absent.
3. **Shellwood, Widow, and post-Widow loop.** Sister Splinter for Cling Grip, Widow shortcut and Needolin, Bellhart bell and first Needle upgrade. Visit Eva for Hunter's evolution and take the Atla mask shard. Take the Atla spool to complete the first pair with the earlier Bone Bottom pickup. Return to Loddie after Widow for both target-practice rewards. On the Forge Daughter visit, get the damage kit for 180 and Magma Bell for 110 plus one Craftmetal, and collect the selected Deep Docks spool 477926 via the burning-floor room and far lever. The target is six masks before Judge and seven by late Act 2. Use the checkpoint spending reminders for the upcoming shop and travel costs; Joseph is not sure the early earnings will cover everything.
4. **Bell #3 and Last Judge.** Climb above and right of Halfway Home, use the top-right transition, and go northeast. Keep this bypass. This trip is the planned window for the Greymoor spool, completing the second pair with Deep Docks. Skip the Ragpelt farm; the second damage kit is now bought later. Ring the fifth bell through Shellwood/Blasted Steps, take the locket, and open Blasted Steps Bellway. Use Needolin at the Grand Gate and fight Last Judge. After reaching Choral Chambers, use the return shortcut to climb the Grand Gate balancing-platform puzzle for spool 478586. The route skips Mist and Phantom.
5. **Songclave and Vaults.** Open Grand Bellway travel and the First Shrine bell. Take White Key, beat the Cogwork Dancers, clear lower Core, and open the top-right shortcut. Clear the Whispering Vaults arena. Get the planned mask shards and Pale Oil for Needle Upgrade #2. Pair the Bellhart upgrade trip with a Blasted Steps Bellway stop for free Dice after Dancers, before the Forum. This combines two planned travel stops. Exact savings have not been timed.
6. **Trobbio, Cauldron, and roof.** Defeat Trobbio and open his lift shortcut. Get Injector Band in Whiteward, then Clawline. Use Magma Bell through Cauldron and buy Twelfth Architect's 450-rosary Crafting Kit after Clawline. Collect eastern Underworks spool 478704 behind the small lava room's wall to complete the third pair with Grand Gate. Collect Vaultkeeper's Melody, run the box and wind puzzle, and open the far-left roof gate 480502. Leave and return through that gate for the duel. The earlier Greymoor conversation qualified on scout. The timed run got G&Z aid without a separately reported Choral Chambers encounter. Exhaust post-duel dialogue and accept their help at the Forum door inside High Halls.
7. **Forum and endgame.** Get Cogfly for one Craftmetal on the High Halls descent. The Forum target is two pouch upgrades, two damage upgrades, Straight Pin + Cogfly, and G&Z. Collect Conductor's Melody and Architect's Melody. At Lace 2, optionally rush Hunter’s March for Fractured Mask using Cogwork Core bench 478428 as the quit-return anchor, with no rests en route; equip it instead of Mirror on returning. Otherwise continue with Mirror. Ascend to Lace and keep the patient, heal-first approach. Rest at Terminus, open the final shortcut, and record the actual finish after Grand Mother Silk.

[Original Garmond Route](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696) · [Recovered maps and credits](./docs/map-credits.md) · [Roof gate](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=480502) · [Forum aid](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=481022)

## Decisions and research

### Fixed pickup plan · November 11

Joseph clarified that the guide is followed with all planned pickups collected. Pebb supplies the 300-rosary mask shard only; the Bone Bottom spending reminder is 340 including Deep Docks Bellway. Marrow Craftmetal funds Magma Bell and Blasted Steps Craftmetal funds Cogfly. The four early mask shards complete six masks at Shellwood.

Old recovery research remains in the imported sources: Pebb's 60-rosary Craftmetal, the Cauldron Craftmetal puzzle with its Undercrank ambush, and the optional ceiling locket below Trobbio's lift. These are outside the timed walkthrough and purchase reminders. The current on-path pickups cover the selected tools and Hunter slots.

### Recovered chats · seven extracts, six reported conversations

Joseph reports **six original chats**. We have preserved **seven extracts**: the earlier Shellwood source, three new attachments and three files moved verbatim from the project root. The [source index and reconciliation](./docs/chat-recovery.md) list every version; the [manifest](./docs/recovered-chats/manifest.json) records origins, byte counts, hashes, endpoints and possible overlaps. None is a byte-identical duplicate. The focused/full Widow accounts and two Lace 2 accounts may be alternate extracts of the same chats; no original IDs prove the mapping. Retain all versions without counting repeated handoff text as independent evidence.

**Corrections restored from the sources:** skip the explicitly rejected flying-bomber Craftmetal room. The current route collects Marrow Craftmetal for Magma Bell and Blasted Steps Craftmetal for Cogfly; the old Pebb backup proposal is superseded. Moorwing aid is optional: the early timed account confirms exhausted Greymoor dialogue but describes an empty aid spot after returning from a death. Do not mandate help or a deliberate death; the later roof/Forum objective remains selected. Mort's paid Memory Locket/farming suggestion was rejected; retain the on-path free lockets.

**Navigation recovered:** Far Fields currents/mask puzzle; Shellwood's Z approach, recommended 40-rosary bench, right shortcut and lower/upper right exits; separate Atla mask/spool branches; Deep Docks spool lever return; Songclave's rotating-wheel exit; lower Core shortcuts; Vaults hidden shard/Oil route and permanent-spawn arena skip; Whiteward fireplace/Injector route; Cauldron's higher-left Clawline exit; box/wind route to the roof; Forum reload fallback; Terminus runback. These are guide/planned directions unless a player result was explicitly reported. Keep Joseph's unmarked Shellwood screenshot and normal Sister Splinter fight.

**Timing qualifications:** 0:14 is arrival at Shakra's bench after Silkspear; 1:03 is back at Halfway Home after Moorwing; 1:21 Cling Grip was an estimate. Preserve the original labels, all reported clocks and minute precision. The old five-mask/3-of-4 Shellwood state belongs to the missed Far Fields shard; Run #3 plans the first-pass pickup and six masks at Shellwood. The first Phacia lure/pogo worked and the second was unreliable; no Switch 2 patch was established. Preserve the two deaths on the leg without inventing a boss-attempt count.

Early pending Needle #1, Bell #3, roof duel, Forum and finish states are superseded by later results. Keep the locked six spool fragments, Architect's 450-rosary second kit, first-pass Mort purchases, combined Needle #2/Dice trip and optional late Fractured Mask. No run save, seed, historical pickup check or screenshot changed.

**Research only:** the Beast Crest discussion explicitly said “i'm not saying rewrite the guide.” Flintslate + Belt and an early Hunter's March/Savage Beastfly detour were explored, not adopted. The successful aggressive Trobbio rematch recollection was on the separate 100% file. Hunter remains selected. Old hallway checks around Citadel Spa/High Halls stay a fallback if roof gate/re-entry checks fail, not a mandatory blind search.

**Menu preference:** normal Save and Quit is accepted; force-close manipulation was explicitly rejected. Use the ordinary menu for the selected optional Core-anchor Mask return.

### Original section navigation · updated November 12

The Guide sections sidebar has one entry for each of the original guide’s 13 travel-section titles. A section with one walkthrough chunk opens directly. A section with multiple chunks expands to its useful step buttons, such as Shellwood mask/Cling Grip, the Widow shortcut and Widow. Highlight the current section and step; open the current multi-part section. Keep descriptive paragraphs and global Expand all / Collapse all controls out of the sidebar. The overall section list can close on narrow screens. Joseph approved this distinction on November 12 after clarifying that only redundant single-chunk nesting felt odd.

Greymoor’s **Return after Widow** remains in the walkthrough because Bell #3 is delayed. Include it as a labeled step under the same Greymoor sidebar entry; Previous/Next and the run-log picker still reach all 31 steps. The route retains 14 internal visit groups and 13 original sections. Use the original titles in the main heading, split picker groups and map keys.

Every group has its corresponding original map, a labeled custom replacement, or an explicit missing-map notice with a named fallback. The Atla/Deep Docks chapter has its available Atla map and the missing return-map notice. Keep Upper Cogwork and Cradle as maps within the final original chapter. Long chapter titles wrap; the current checkpoint stays visible as a subtitle. Preserve the exact order and IDs of all 31 route checkpoints, all pickup IDs, the independent remembered guide step, and the recorded run files.

### Opening section boundaries · clarified November 11

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

Use it for the Grand Bellway and Songclave/White Key steps. The Dancers, lower Core and Vaults arena are outside the crop; retain their existing references and missing-detail notices. This is a partial replacement for the combined original chapter map. The red line does not add a G&Z search loop or alter the selected route.

### Guide consolidation · November 10

The Garmond guide’s section names, maps and checkpoint/detour numbers are retained as navigation references. Its text is condensed into the chosen route’s directions and map keys; the itinerary above takes precedence over the author’s alternate route and loadouts. Label settled exclusions as decided to skip in map keys and route-choice statuses; use direct Skip instructions in the walkthrough. Keep conditional supply stops conditional and the late Mask trip optional. Collect Shard Pendant and the Mosshome rosary/commandment/lift pickups on the opening path. The Beastfly arena shortcut stays skipped so the normal arena path reaches Pendant. The selected Bone Bottom spool remains on the loop after Lace 1, using its trapdoor and lift passage. Avoid the ambiguous phrase reference only in the live guide.

Planned resources include the Marrow Craftmetal and Greymoor Bellway locket **478035**; the distinct Faydown ledge locket **478039 stays skipped**. Needle Upgrade #2 and free Dice remain on the combined return before Trobbio. After collecting the Vaultkeeper’s melody cylinder, return to the Vaultkeeper to learn the melody before the roof duel; collecting the cylinder alone is not the completed melody. Keep the six locked spool fragments, Architect’s second kit, Hunter loadout and established skips. Checkpoint and preparation IDs and recorded results remain unchanged.

[Original guide text](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696) · [In-game melody dialogue](https://hollowknight.wiki/w/Module:TabbedDialogue/Silksong/en.json)

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

[Archived spool comparison](./docs/history.md#spool-candidate-comparison) · [Spool location requirements](https://hollowknight.wiki/w/Spool_Fragment) · [Underworks and Cauldron arenas](https://hollowknight.wiki/w/Underworks) · [MapGenie public map data](https://mapgenie.io/api/v1/maps/812/data)

### Forum prep

- **Tool Pouch 2/4.** Keep Loddie's Marrow reward and buy Mort's for 220 on the first pass. Both together give 6 Cogflies and 18 Straight Pins. The Run #2 record confirms Loddie's pouch. For the rerun, the documented unlock is after Widow, so the second-round 220-rosary necklace arrives too late to fund the first Mort stop. Budget Mort and early travel before the run.
- **Crafting Kit 2/4 · settled.** Keep Forge Daughter's 180-rosary upgrade and buy Twelfth Architect's kit for **450 rosaries after Clawline**. Joseph reports that earning rosaries by the Choral Chambers stage is not a problem. Skip Crawbug Clearing and the 25-Ragpelt farm. Retain preparation ID `kit-second`, now pointing at Architect kit 478728. The two upgrades take Cogflies to 7 damage per hit.
- **Hunter slots and resources · sufficient by player report.** Hunter tool slots means the sockets unlocked with Memory Lockets. Use the existing on-path pickups to fill Hunter; no separate slot-hunting task is needed. Joseph believes both the timed and scout files had one locket left over, and reports both have an extra Craftmetal. Treat the locket count as his recollection, superseding the older zero-locket snapshot in the imported project notes. This is not a new timed split or a newly acquired item. Keep one Craftmetal each for Magma Bell and Cogfly. **Correction:** Halfway Home locket 478039 requires Faydown Cloak, so remove it from the no-double-jump itinerary; Blasted Steps and the wind-route pickups remain. Do not add a replacement detour on the assumption that slots are short.

[Tool Pouch and Crafting Kit](https://hollowknight.wiki/w/Crafting_Kit) · [Loddie](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478251) · [Ragpelt farm](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478208) · [Twelfth Architect](https://hollowknight.wiki/w/Twelfth_Architect) · [Cogfly damage](https://hollowknight.wiki/w/Cogflies)

### Upcoming spending reminders

Joseph wants the cash needed for upcoming purchases shown at checkpoints, rather than an assumed starting wallet or locked early earning plan. `data/route.json` now stores purchase lists per spending stop; the tracker shows the next such stop at or after the selected checkpoint. Conditional fees are itemized separately. These are route plans, not assertions about historical purchases or the player's current balance. Bench tolls outside these listed purchases are not included.

| Spending stop | Rosaries | Items / additional materials |
|---|---:|---|
| Lace 1 / Bone Bottom loop | **340** | Pebb mask shard 300 + Deep Docks Bellway 40 |
| First Halfway Home / Greymoor pass | **440–470** | Belt 160 + pouch 220 + Greymoor Bellway 60; +30 if the Pilgrim's Rest door gear is intact |
| Widow / Bellhart | 60 | Bellhart Bellway 60; Needle Upgrade #1 is free |
| Loddie / Forge Daughter | **340 minimum** | Two Loddie entries 50 + kit 180 + Magma Bell 110; +25 per retry and 1 Craftmetal. Loddie’s second reward is a 220-rosary necklace. |
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
- **Missing spending:** Loddie charges 25 per attempt. Two successful rounds require at least 50 in entry fees, plus 25 per retry. Combined Loddie/Forge Daughter outlay is at least 340, before applying the earned 220-rosary necklace. Do not treat that later reward as funding Mort’s first visit.
- **Recorded choices retained:** Warding Bell was explicitly rejected during the November 9 support-tool discussion because interrupted Binds were not the reported problem; its exclusion is documented, unlike Pendant’s. Hunter over Wanderer/Reaper, Last Judge over Mist/Phantom, the ordinary Sister Splinter route, no Mount Fay, no Craw Lake/Thread Storm/Three-fold Pin, no Sting Shard/Cogwork Wheel/Delver’s Drill, the six locked spool fragments, Architect’s second kit instead of Ragpelt farming, and optional late Fractured Mask all have recorded route reasons. Greymoor ledge locket 478039 needs Faydown Cloak; planned Bellway locket 478035 is a different pickup. The successful roof/Forum aid route supports avoiding an additional blind Choral Chambers search.

Keep checkpoint and existing pickup IDs stable. New Pendant/string/Commandment checks start unrecorded on every run. Do not infer that historical runs acquired them. Never turn a guide option into a firm exclusion solely because it is absent from the ending loadout; record its travel, supply or survival role and the evidence for the choice here.

[Source guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696) · [Pendant effect](https://hollowknight.wiki/w/Shard_Pendant) · [Commandment sale](https://hollowknight.wiki/w/Choral_Commandment) · [Public map data](https://mapgenie.io/api/v1/maps/812/data)

## Later reminder · map screenshots

Joseph asked to return to these after focusing on the run:

- Deep Docks return: post-Widow Marrow/Loddie, the mask-shard arena and Forge Daughter.
- Songclave onward: Cogwork Dancers, lower Core mask/shortcuts, Whispering Vaults arena and the shortcut back to Songclave. The supplied red map already covers the approach.

Bring this up when map work resumes; no scheduled notification was requested.

## Scout questions and settled decisions

### Thread Storm without Craw Lake Arena

**Yes, there is a documented later bypass.** The Bass% route picks it up by climbing from the Far Fields side after obtaining Clawline and Faydown Cloak. That route documents the later setup. An earlier Thread Storm pickup with the Cling Grip Bell #3 route is unverified. The ordinary pickup uses the Craw Lake arena lever and balloon climb. Keep the arena and Thread Storm skipped for this rerun unless the user later validates an earlier route they want to use.

[Documented later bypass](https://speedpastes.org/kXQvcbMl) · [Standard Craw Lake pickup](https://hollowknight.wiki/w/Enemy_Gauntlets_%28Silksong%29/Greymoor_3) · [Thread Storm pin](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478061)

### Blue tool choice · optional Fractured Mask at Lace 2

**Current plan:** Keep Mirror + Injector Band through the existing route. At the Lace 2 checkpoint, optionally take Fractured Mask using a quit-return to **Cogwork Core bench 478428**. Mask replaces Mirror for the ending if collected; otherwise continue with Mirror. Injector Band, Weighted Belt, and Magnetite Dice remain the planned supporting tools. Joseph’s scout GMS win confirms a clear with Mask and no Mirror; the other scout equipment, number of attempts, Mask activations, and final clock were not reported. Do not claim the Mask triggered during the win or invent a finish split.

**Player report:** Joseph can find safe healing openings and was not usually interrupted. Patient one- or two-hit punishes limit Silk income. A Lace hit commonly costs two masks, disrupts his rhythm, and can lead to a second hit for four masks lost in total. These observations motivated the comparison. Mirror was the November 9 baseline; the November 10 scout result led to the optional late Mask pickup.

| Tool | Current decision | Relevant mechanics and route cost |
|---|---|---|
| **Druid's Eye** | Decided to skip after the final Mirror decision. | Base Eye produces one strand per two damage triggers while Silk is below capacity. Some attacks produce two triggers; do not assume every two-mask attack does. Three Mossberries unlock the base version. Four more Mossberries upgrade and replace the base Eye (seven berries total); Joseph rejected the upgraded Eyes after learning that the final berry normally requires the Mount Fay detour. Keep this upgrade off the timed route; the base Eye was also left out when Joseph chose Mirror. |
| **Weavelight** | Decided to skip after the final Mirror decision. | Raises the passive regeneration ceiling by one strand and speeds refill below that ceiling. It does not keep adding Silk above the ceiling. This route skips the Unravelled, so before Lace 2 Bell Beast supplies one Silk Heart: Weavelight would raise passive refill from one strand to two. Requires the Moss Mothers fight and ceiling pickup at Atla. |
| **Fractured Mask** | **Optional at Lace 2.** Scout GMS clear confirmed with Mask and no Mirror. Use the late-game kit and Cogwork Core 478428 quit-return; skip if continuing directly with Mirror. | Prevents one lethal injury and leaves one mask; a separate follow-up can still kill. Repairs for free at a bench. Buy from Mottled Skarr in Hunter's March for 260, or collect free near his corpse after any of Dancers, First Shrine bell, or Clawline, followed by resting at a bench outside Hunter's March. The merchant is beyond a trapped tunnel requiring Swift Step. The later timed-file trial included Forge Daughter’s 10 shard bundles and Mask acquisition, ending at Marrow bench at 5:06, reported as about ten minutes. That used a Marrow rest; the planned Core-anchor variant remains distinct. This is one-fight death insurance; recovery still needs Silk for Bind. |
| **Warding Bell** | **Rejected by Joseph.** | Protecting a Bind from damage does not address the reported Silk shortage; interrupted Binds were not the usual problem. Do not add its pickup to the timed route. |
| **Multibinder** | **Decided to skip.** Its 880-rosary cost was a concern during the comparison. | Correction to the earlier framing: My Missing Courier is a rescue of Tipp in northern Bone Bottom after Widow, including two Caranids, followed by shopping in Bellhart. It does not require the later brother/delivery quest chain. The detour has not been timed, and the 880-rosary purchase remains an obstacle. |

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

- The active save records the 5:06 endpoint at minute precision, with a historical-only checkpoint ID. Preserve the 4:57 Lace 2 split. That detour report preceded the later 5:26:16 finish. Do not move the timed-file trial onto the scout file.
- The exact departure time, bundle rosary cost, and return method were not separately supplied; do not invent them. Mask is acquired on the timed file now, but no new equipped ending loadout was reported.
- This trial **rested at Marrow**, so it does not demonstrate the no-intermediate-rest Core return. For the future optional trip, rest at Core first and avoid all later bench rests, including Forge Daughter and Marrow. Add the shop stop if supplies are useful; the trial bought ten bundles. The full Core-based trip is not a separately measured benchmark.
- Keep the pickup optional at Lace 2, conditioned on time left for the detour and the final fights. Use the reported ~10 minutes as a practical reference, not an invented exact duration.

### Lace consistency and money

- Scout Lace 2 as a dedicated fight. Time actual attempts and runbacks separately from optional detours. Practice waiting for committed attacks and healing in recovery. Try safe Straight Pin windows while preserving Silk.
- Grand Mother Silk is now cleared on attempt six at 5:26:16. Use the learned patience and one-side positioning for the rerun; no individual attempt duration has been isolated.
- Check early rosaries for Pebb, Mort, and the first Bellways. Greymoor and Blasted Steps Bellway openings are useful for later returns. Keep the G&Z aid route and protected Needle/Forge Daughter budget. The paid second kit is settled; keep its 450-rosary target visible before Clawline.
- Map recovery on 2026-11-09 preserved the three existing maps and added 16 original guide images. The gallery shows 13 maps and 4 relevant screenshots; Mist and Sister Splinter skip alternatives remain archived. The separate Vaults shard/Pale Oil map is recovered. Shellwood/Widow, the Deep Docks return (shard/Forge Daughter), Last Judge/Choral Chambers, and combined Songclave/lower Core/Vaults arena maps have empty image URLs in the original guide. Joseph’s supplied screenshots now replace Shellwood/Widow and the Last Judge/Grand Gate overview fallback. The supplied red route now covers the Grand Gate/Grand Bellway/Songclave approach. The Deep Docks return, Dancers, lower Core and Vaults arena still use existing references and checkpoint pins. The guide does not mark spool fragments; custom screenshots can supplement the six locked pins.

## Local references

- The supplied original artwork is in [assets/artwork](./assets/artwork/): the mask PNG serves the header/favicon/touch icon, the transparent Hornet PNG serves the desktop guide title, and the WebP remains an alternate. Preserve their bytes.
- Original guide images and their source URLs, dimensions, byte counts, and hashes live in [assets/maps/catalog.json](./assets/maps/catalog.json). Preserve credits in [docs/map-credits.md](./docs/map-credits.md). The selected route has its own spool pickups and tool choices.
- Edit checkpoint `guide` arrays and optional `guideTitle` in `data/route.json` for written directions. Section/checkpoint `maps` arrays select catalog IDs. Add replacement screenshots using the [map instructions](./docs/map-credits.md#adding-a-local-screenshot); keep exact waypoint pins where maps are missing.
- MapGenie's public Pharloom data was previously available at `https://mapgenie.io/api/v1/maps/812/data`. Old `/tmp/` caches are temporary; do not treat them as repository assets.

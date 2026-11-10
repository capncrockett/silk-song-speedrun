# Pharloom Runbook — Codex handoff

Updated November 9, 2026. This brief is for the Codex agent building Joseph's personal Hollow Knight: Silksong route and run tracker. Joseph will create the new repository. Start implementation in the project he opens for that work. Repository setup belongs to Joseph.

## Current scope · November 9

Joseph plans **one more timed run**. The app is now one run screen: checkpoint selection also shows route reminders and map pins; prep, recovered maps, history, and notes expand inline. Keep open research and alternative builds in this handoff. Existing historical timed and scout records remain intact. Commit coherent changes as work proceeds.

Run #2's Grand Mother Silk fight is still unfinished, confirmed by Joseph. No final time has been supplied. Joseph wants to **discuss Claw Mirror alternatives before choosing**. Warding Bell and the seven-berry Druid's Eyes upgrade are rejected; base Druid's Eye and Weavelight remain on the shortlist. Fractured Mask is also rejected: Joseph considers the Hunter's March approach, entrance arena, and deep backtrack unsuitable for this run. Multibinder is disfavoured because of its 880-rosary cost. Keep the current loadout selected until a decision is made. The spool pair and second-kit questions below are also still open.

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

- **Run #2 is still in progress.** Lace 2 was defeated at **4:57**. There were three displayed minutes to 5:00 at that split. The user plans to finish Grand Mother Silk to rehearse the ending. Record the actual final time once reported. The final time and achievement result are pending.
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

1. **Bone Bottom and Deep Docks.** Silkspear, Bell Beast, Marrow bell, Straight Pin, Swift Step, and Lace 1. Ring Deep Docks bell. The current planned mask route takes Wormways and Pebb on the Bone Bottom loop. Pebb costs 300. This is a planned route step from the reference, independent of unreported Run #2 purchases.
2. **First Far Fields and Greymoor pass.** Take the shard above the Seamstress before leaving with Drifter's Cloak. Buy Weighted Belt and the Tool Pouch on the first Pilgrim's Rest visit. Total is 380 rosaries, plus 30 if the door gear is intact. Break the gear from the inside. Open Greymoor Bellway for the later return. Exhaust Garmond's first Greymoor dialogue, then use the Halfway Home / Moorwing route.
3. **Shellwood, Widow, and post-Widow loop.** Sister Splinter for Cling Grip, Widow shortcut and Needolin, Bellhart bell and first Needle upgrade. Visit Eva for Hunter's evolution and take the Atla mask shard. Take the Atla spool only as part of the planned Atla + Greymoor pair. Return to Loddie after Widow for both target-practice rewards. On the Forge Daughter visit, get the damage kit for 180 and Magma Bell for 110 plus one Craftmetal. The target is six masks before Judge and seven by late Act 2. Verify the planned early mask shopping and the unreported shards before treating the rerun budget as locked.
4. **Bell #3 and Last Judge.** Climb above and right of Halfway Home, use the top-right transition, and go northeast. Keep this bypass. This trip is also the proposed window for the Greymoor spool and the second damage kit. Ring the fifth bell through Shellwood/Blasted Steps, take the locket, and open Blasted Steps Bellway. Use Needolin at the Grand Gate and fight Last Judge. The route skips Mist and Phantom.
5. **Songclave and Vaults.** Open Grand Bellway travel and the First Shrine bell. Take White Key, beat the Cogwork Dancers, clear lower Core, and open the top-right shortcut. Clear the Whispering Vaults arena. Get the planned mask shards and Pale Oil for Needle Upgrade #2. Pair the Bellhart upgrade trip with a Blasted Steps Bellway stop for free Dice after Dancers, before the Forum. This combines two planned travel stops. Exact savings have not been timed.
6. **Trobbio, Cauldron, and roof.** Defeat Trobbio and open his lift shortcut. Get Injector Band in Whiteward, then Clawline. Use Magma Bell through Cauldron. Collect Vaultkeeper's Melody, run the box and wind puzzle, and open the far-left roof gate 480502. Leave and return through that gate for the duel. The earlier Greymoor conversation qualified on scout. The timed run got G&Z aid without a separately reported Choral Chambers encounter. Exhaust post-duel dialogue and accept their help at the Forum door inside High Halls.
7. **Forum and endgame.** Get Cogfly for one Craftmetal on the High Halls descent. The Forum target is two pouch upgrades, two damage upgrades, Straight Pin + Cogfly, and G&Z. Collect Conductor's Melody and Architect's Melody, ascend to Lace, and keep the patient, heal-first approach. Rest at Terminus, open the final shortcut, and record the actual finish after Grand Mother Silk.

[Original Garmond Route](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696) · [Recovered maps and credits](</Users/josephdavey/Documents/ChatGPT/Silk Song/Recovered Garmond Maps/README.md>) · [Roof gate](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=480502) · [Forum aid](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=481022)

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

### Spools in pairs

Each completed pair adds one strand of Silk capacity. Route both halves before taking either. The app tracks the halves separately and shows the capacity gain when both are checked.

| Pair | Pickups | What to scout |
|---|---|---|
| A · planned | Atla 478230 + Greymoor 478263 | Atla during Eva. Verify the Greymoor balloon approach with the earlier Cling Grip kit and the arena uncleared. Run #2 only confirms the late Greymoor pickup. |
| B · candidate | Lower Cogwork 478618 + eastern Underworks 478704 | Time the lower Core branch and the eastern Cauldron shaft as one decision. Only add either to the timed itinerary once both are routed. |
| Spare candidate | Bone Bottom 478080 + Deep Docks 477926 | Only compare if a planned pair is impractical. Both add side rooms. |

Keep the separate Underworks arena 478931 and double-jump High Halls spool 478909 off the current itinerary. Total Silk upgrades on Run #2 are unconfirmed.

[All eight pins and route notes](</Users/josephdavey/Documents/ChatGPT/Silk Song/Silksong - Spool Fragment Candidates.md>) · [Spool mechanic](https://hollowknight.wiki/w/Spool_Fragment)

### Forum prep

- **Tool Pouch 2/4.** Keep Loddie's Marrow reward and buy Mort's for 220 on the first pass. Both together give 6 Cogflies and 18 Straight Pins. The Run #2 record confirms Loddie's pouch. For the rerun, the documented unlock is after Widow, so the second-round 220-rosary necklace arrives too late to fund the first Mort stop. Budget Mort and early travel before the run.
- **Crafting Kit 2/4.** Keep Forge Daughter's 180-rosary upgrade. Scout the preferred second kit by taking Crawbug Clearing in Bellhart after Widow, then farming 25 Ragpelts from the two respawning roof Craws at Halfway Home on the Bell #3 trip. Turn them in to Creige. Time the whole loop. If it is slow, plan 450 rosaries for Twelfth Architect after Clawline and time any earning shortfall. Either second upgrade takes Cogflies from 5 to 7 damage per hit.
- **Slots and resource plan.** Set aside Craftmetal for Magma Bell and Cogfly. The pre-Judge free Craftmetal is insurance if the rest of the route supplies both. Pair lockets with actual tools. Check the required Hunter slots on scout before allocating them. The Halfway Home, Blasted Steps, and wind-route lockets are convenient planned pickups. Run #2's exact locket allocation is unreported.

[Tool Pouch and Crafting Kit](https://hollowknight.wiki/w/Crafting_Kit) · [Loddie](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478251) · [Ragpelt farm](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478208) · [Twelfth Architect](https://hollowknight.wiki/w/Twelfth_Architect) · [Cogfly damage](https://hollowknight.wiki/w/Cogflies)

## Open scout questions

### Thread Storm without Craw Lake Arena

**Yes, there is a documented later bypass.** The Bass% route picks it up by climbing from the Far Fields side after obtaining Clawline and Faydown Cloak. That route documents the later setup. An earlier Thread Storm pickup with the Cling Grip Bell #3 route is unverified. The ordinary pickup uses the Craw Lake arena lever and balloon climb. Keep the arena and Thread Storm skipped for this rerun unless the user later validates an earlier route they want to use.

[Documented later bypass](https://speedpastes.org/kXQvcbMl) · [Standard Craw Lake pickup](https://hollowknight.wiki/w/Enemy_Gauntlets_%28Silksong%29/Greymoor_3) · [Thread Storm pin](https://mapgenie.io/hollow-knight-silksong/maps/pharloom?locationIds=478061)

### Replace Claw Mirror? · narrowed November 9

**Player report:** Joseph can find safe healing openings and was not usually interrupted. Patient one- or two-hit punishes limit Silk income. A Lace hit commonly costs two masks, disrupts his rhythm, and can lead to a second hit for four masks lost in total. The comparison should therefore measure access to the next Bind after a mistake. Keep Injector Band and Weighted Belt fixed.

| Tool | Current decision | Relevant mechanics and route cost |
|---|---|---|
| **Druid's Eye** | Shortlisted; Joseph thinks it may be the best fit because he expects to take hits. Not selected yet. | Base Eye produces one strand per two damage triggers while Silk is below capacity. Some attacks produce two triggers; do not assume every two-mask attack does. Three Mossberries unlock the base version. Four more Mossberries upgrade and replace the base Eye (seven berries total); Joseph rejected the upgraded Eyes after learning that the final berry normally requires the Mount Fay detour. Keep this upgrade off the timed route; the base Eye remains under discussion. |
| **Weavelight** | Still worth considering for patient play. Not selected yet. | Raises the passive regeneration ceiling by one strand and speeds refill below that ceiling. It does not keep adding Silk above the ceiling. This route skips the Unravelled, so before Lace 2 Bell Beast supplies one Silk Heart: Weavelight would raise passive refill from one strand to two. Requires the Moss Mothers fight and ceiling pickup at Atla. |
| **Fractured Mask** | **Rejected by Joseph.** The Hunter's March approach, entrance arena, and deep backtrack outweigh the benefit. Do not add an early purchase or late corpse pickup. | Prevents one lethal injury and leaves one mask; a separate follow-up can still kill. Repairs for free at a bench. Buy from Mottled Skarr in Hunter's March for 260, or collect free near his corpse after any of Dancers, First Shrine bell, or Clawline, followed by resting at a bench outside Hunter's March. The merchant is beyond a trapped tunnel requiring Swift Step. Late pickup adds travel and trap risk; it has not been timed. This is one-fight death insurance; recovery still needs Silk for Bind. |
| **Warding Bell** | **Rejected by Joseph.** | Protecting a Bind from damage does not address the reported Silk shortage; interrupted Binds were not the usual problem. Do not add its pickup to the timed route. |
| **Multibinder** | **Disfavoured for this run's budget.** Joseph would only reconsider if acquisition is quick enough to justify it. | Correction to the earlier framing: My Missing Courier is a rescue of Tipp in northern Bone Bottom after Widow, including two Caranids, followed by shopping in Bellhart. It does not require the later brother/delivery quest chain. The detour has not been timed, and the 880-rosary purchase remains an obstacle. |

**Druid's Eyes upgrade rejected November 9:** The seven berries are two in Moss Grotto, three around Bone Bottom, one at Atla, and one in the Memorium. Using the two Grotto berries plus the berry below Moss Druid for the base Eye leaves two Bone Bottom berries, the Atla berry, and the Memorium berry for the upgrade. Normal Memorium access requires Faydown Cloak from Mount Fay, which this timed route skips. Joseph said to scrap the upgrade after this requirement was explained; do not add Mount Fay or the seven-berry collection to this run. No bypass has been validated for this run. Upgrading doubles the return from one to two strands per two damage triggers. [Berry locations](https://hollowknight.wiki/w/Mossberries) · [Memorium access](https://hollowknight.wiki/w/Memorium)

The main route still uses the known Mirror + Injector setup until a swap is chosen. Do not record these preferences as completed pickups or scout results. Compare the real acquisition cost and healing contribution of base Druid's Eye and Weavelight. Fractured Mask is no longer a candidate. No pickup or loadout swap is selected.

[Mirror](https://hollowknight.wiki/w/Claw_Mirror) · [Fractured Mask](https://hollowknight.wiki/w/Fractured_Mask) · [Mottled Skarr location and death conditions](https://hollowknight.wiki/w/Mottled_Skarr) · [Base Druid's Eye and upgraded Eyes](https://hollowknight.wiki/w/Druid%27s_Eye) · [Weavelight](https://hollowknight.wiki/w/Weavelight) · [Silk Heart regeneration and sources](https://hollowknight.wiki/w/Silk_Heart) · [My Missing Courier](https://hollowknight.wiki/w/My_Missing_Courier) · [Multibinder](https://hollowknight.wiki/w/Multibinder)

### Lace consistency and money

- Scout Lace 2 as a dedicated fight. Time actual attempts and runbacks separately from optional detours. Practice waiting for committed attacks and healing in recovery. Try safe Straight Pin windows while preserving Silk.
- Rehearse Grand Mother Silk and record the Run #2 finish, even if the five-hour goal is missed. Use the observed fight time to plan a realistic Lace split.
- Check early rosaries for Pebb, Mort, and the first Bellways. Greymoor and Blasted Steps Bellway openings are useful for later returns. Keep the G&Z aid route and protected Needle/Forge Daughter budget. Scout the free kit against the paid kit before committing to either source.
- Recover missing screenshots only if they help a route step. The three saved maps are present and linked. The original combined Songclave/lower Core/Vaults arena image and the separate Vaults shard/Pale Oil image remain missing. Use the exact pins in the interim.

## Assets available in the old workspace

The new project can reuse these source files. Keep the original credits and label the annotated images as reference maps. The simplified route itself should follow the itinerary above.

- [Complete route overview](</Users/josephdavey/Documents/ChatGPT/Silk Song/Recovered Garmond Maps/Complete Route Overview.png>)
- [Cauldron, Clawline, Vaults, and roof approach](</Users/josephdavey/Documents/ChatGPT/Silk Song/Recovered Garmond Maps/Cauldron and Whispering Vaults.jpg>)
- [High Halls, Cogfly, and Forum](</Users/josephdavey/Documents/ChatGPT/Silk Song/Recovered Garmond Maps/High Halls.jpg>)
- [Original URLs and credits](</Users/josephdavey/Documents/ChatGPT/Silk Song/Recovered Garmond Maps/README.md>)

The original Steam guide is a reference for gaps. The combined Songclave/lower Core/Vaults arena map and separate Vaults mask shard/Pale Oil map are missing. The waypoint pins above cover key stops. If an exact pin needs checking, MapGenie's public Pharloom data was previously available at `https://mapgenie.io/api/v1/maps/812/data`. The cached copy at `/tmp/silksong-mapgenie-data.json` is temporary.

## Ongoing use with Codex

After the new project is open, read this brief and the older source notes, then build the local tracker there. Put short launch and data-editing instructions in that project's README. When Joseph provides a new split or scout result, record it in the correct run at the precision he reports. Keep decisions in one editable route source. If a scout result changes the selected path, update the main itinerary and retain the decision in the notes. Preserve historical labels and times even when a stop is removed from the future route.

# Shellwood route map drawing prompts

Created November 10, 2026 with the built-in `image_gen` tool. Final selected output: `assets/maps/Shellwood and Widow route draft.png`. Source screenshot: `assets/maps/Shellwood and Bellhart base.png` (renamed, original bytes preserved).

This is a room-level custom draft, not the lost Steam guide map or an in-game-tested route trace. The path uses the selected Sister Splinter fight and the existing five checkpoint map-key numbers. Review the precise upper Shellwood/Gahlia and bench-shortcut connections in game before treating the trace as verified.

Route references: [Garmond guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3577460696), [public MapGenie pin data](https://mapgenie.io/api/v1/maps/812/data), [normal Shellwood traversal](https://gamefaqs.gamespot.com/pc/258631-hollow-knight-silksong/faqs/82149/shellwood).

## Initial annotation

```text
Use case: precise-object-edit.
Edit target: the supplied 2880 x 1080 MapGenie screenshot of Shellwood and Bellhart.
Create an accurate, readable room-level walking-route annotation ON THIS EXACT SCREENSHOT. Preserve the screenshot's original aspect ratio, all room silhouettes, corridors, boundaries, icons, map labels, and positions. Do not redraw or reinterpret the map. Only add route polylines, small arrowheads, numbered circular checkpoint labels, and a compact legend in empty black space. Keep the entire screenshot visible, uncropped. This is a utility map for a timed game run, so topology matters much more than decoration.

The selected route fights Sister Splinter. DO NOT draw the Phacia pogo / Sister Splinter skip. No Mount Fay, no extra sidequests, no route to the far western edge. Use three contrasting colors for chronological legs, thin black outlines under colored strokes, round joins, and small directional arrows. Overlay strokes about 6-8 px at the source 2880px width. Keep original pins visible by curving around them if necessary. Lines connect rooms schematically; they do not represent exact jump trajectories.

Coordinates below are in the ORIGINAL 2880 x 1080 screenshot, top-left origin. They locate the intended corridors and verified checkpoint pins. Route lines must stay within the existing colored room interiors and use actual narrow connecting passages, never shortcut straight through black space or walls. Trace the room interior between the waypoints, adapting within the corridor rather than forcing a straight diagonal through a wall.

LEG A, CYAN: Bellhart to the sixth-mask shard.
Start at Bellhart's lower bench near (2499,975), go west through the existing lower horizontal passage into Shellwood's large eastern room, around (2100,955). Inside this tall room follow a schematic ascending Z from its lower left around (1695,930), across to (1945,865), back up-left to the arena at (1733,772). Continue to the bench above it at (1733,696). Go left to the lift marked (1560,710), then down through the lift shaft to the lower connecting hallway around (1575,935). At its bottom, briefly open the return shortcut to Bellhart at (1668,960), indicated as a short YELLOW DASHED side spur with two-way arrows. Then continue WEST along the lower hallway to the tall white-flower platforming shaft around (1015,915). Climb that shaft to its LOWER of two right exits at approximately (1085,635). Follow the long narrow rightward dead-end platforming room to the breakable vines at (1488,623) and the mask shard at (1519,623). Add checkpoint circle 1 precisely there, with a short nearby label "1 Mask shard · 6 masks".

LEG B, ORANGE: Mask shard to Sister Splinter and Cling Grip, using the normal upper loop.
Return left along the same mask-shard corridor with a small offset so the outbound cyan line remains readable, to (1085,635). Climb to the shaft's UPPER right exit around (1125,555), entering the bottom of the large shrine room. Go RIGHT along the existing lower corridor around (1335,520), through the adjoining rooms to the tower at about (1730,520). Ascend this tower, passing the upper elevator at (1789,485), and take the existing rightward platforming loop through the broad upper room around (2040,465), then up to the long upper passage around (2080,385). Follow that existing upper passage LEFT into Sister Splinter's arena at (1478,388). Add checkpoint circle 2 next to the existing red boss pin, label "2 Sister Splinter". Continue left through the connecting room, use the western Gahlia room and its upper-right exit to reach the Cling Grip shrine at (1230,339). Add checkpoint circle 3 near the existing purple ability pin, label "3 Cling Grip". Do NOT draw a direct vertical shortcut from the shrine-room bottom to its top; the orange path must visibly use the full eastern loop and the Sister Splinter fight.

LEG C, MAGENTA: Cling Grip to Widow and the Bellhart upgrade.
After Cling Grip, go back RIGHT through the upper Shellwood corridor, past the Sister Splinter arena area, through the Cling-Grip wall passages around (2156,386), and into upper Bellhart around (2413,384). Follow the actual right-hand building passage down the vertical pit around (2450,510) to (2450,610). Before dropping into Widow, open the western breakable-wall runback at (2426,607): show a YELLOW DASHED two-way branch going west along the existing lower corridor around (2282,631), (1935,620), (1816,593), returning to the Shellwood bench (1733,696). Label this branch "Open shortcut + rest" in nearby empty space.
Resume the magenta route at the pit and descend through the lower existing passage into Widow at (2493,731). Add checkpoint circle 4 beside the red boss pin, label "4 Widow + Needolin". Continue right to the bell/bench area, then along the existing rightward corridor to the exit lift at (2766,743). Follow the far-right elevator shaft DOWN to the Bellhart lower passage near (2765,975), head left to Bellhart, and use the town's existing platforms to Pinmaster Plinney's workshop at (2552,869). Add checkpoint circle 5 at that workshop and label "5 Needle upgrade #1".

Small legend in EMPTY BLACK space near upper left-center, approximately x=460..1080, y=50..220:
"Shellwood → Widow"
"Cyan: mask shard"
"Orange: Sister Splinter + Cling Grip"
"Magenta: Widow + Bellhart"
"Dashed yellow: open shortcuts"
Use clean small sans-serif lettering with dark translucent label backgrounds. Make the route readable at full size without covering existing map geometry. No decorative art, no new rooms, no new map symbols except numbered checkpoints, no duplicated labels, no invented paths. Preserve original screenshot details as closely as possible.
```

## Route and arrow corrections

```text
Edit image 1, the existing annotated 2048 x 768 Shellwood map. Image 2 is the untouched source screenshot for preserving the underlying map geometry. Keep the same 2048 x 768 framing, existing original map, and compact legend. Correct ONLY the route overlay. The first draft has backward arrows, disconnected route segments, and a misplaced Needle checkpoint. Make each colored leg a continuous connected path with correct arrow direction.

Use these 2048 x 768 coordinates, not the original screenshot's larger coordinate system. Original map landmarks are: first Shellwood arena (1232,549), bench above it (1232,495), lower lift (1109,505), mask shard (1080,443), Sister Splinter (1051,276), Cling Grip (875,241), Widow (1773,520), Needle workshop (1815,618).

CYAN must read from Bellhart to the arena, bench, lift, and then mask shard:
Start at Bellhart lower bench (1777,693). Head LEFT along the bottom passage into the large eastern Shellwood room, climb a schematic Z to the red arena pin (1232,549), then go UP to the bench (1232,495). Arrowheads between arena and bench must point UP, not down. From the bench go LEFT to the lift (1109,505), DOWN its shaft to (1114,665), LEFT along the bottom hallway to (725,665), UP the flower shaft to (725,455), then RIGHT along the narrow mask corridor to checkpoint 1 at (1080,443). ALL cyan arrowheads in the mask corridor must point RIGHT towards 1. Remove backward cyan arrowheads in that corridor. Do not use the return direction for cyan.

ORANGE must start at checkpoint 1 and return LEFT along the mask corridor, 12px above the cyan line, then go up to the UPPER right exit near (790,400). Connect the orange path RIGHT across the existing lower corridor through (960,375), (1130,365), (1197,368). Then continue UP the tower at (1230,360), pass the elevator around (1272,345), go RIGHT through the broad upper room to (1415,338) and (1475,330), go UP to (1475,265), then go LEFT along the existing upper passage to Sister Splinter at (1051,276). Arrowheads along this upper east-to-west boss approach must point LEFT towards checkpoint 2.
IMPORTANT: join the currently disconnected orange tower/upper-loop segments into this single continuous route. Use room interiors; do not draw through black space.
After checkpoint 2, continue LEFT into the shrine chamber around (920,265), down-left within that room to (815,285), then LEFT into the western Gahlia room around (750,285), UP to that room's upper-right exit around (760,250), and RIGHT to Cling Grip at (875,241). Put checkpoint 3 beside that purple pin. This short western detour is AFTER the boss. Remove the obsolete orange dangling route that currently descends all the way to (630,380) and dead-ends near (685,400). Do not show a direct bottom-to-top skip of the shrine chamber. No Sister Splinter skip.

MAGENTA must visibly START at checkpoint 3 (875,241). It then goes RIGHT through the upper passage via (925,280), (1050,283), (1238,280), (1470,278), (1640,275), to (1740,275), and DOWN the existing eastern pit to (1740,445), then into Widow at (1773,520). Use a 12px offset from orange where they overlap, so both directions remain clear. Add the missing magenta connection from 3 to the rest of the existing magenta route; do not leave its start at the far upper-right platform loop.
From Widow go RIGHT through the existing corridor to the far-right lift at (1967,528), DOWN to (1967,693), LEFT to Bellhart at (1777,693), then UP along the town platforms to the actual workshop at (1815,618). FINISH THE LINE AT (1815,618). Move checkpoint circle 5 to precisely that workshop location. It is currently wrongly placed far left at (1694,589); remove that misplaced circle. Place its text label in nearby empty black space, with a thin leader if needed: "5 Needle upgrade #1".

Keep the YELLOW DASHED shortcut branches: lower lift to Bellhart gate, and upper Bellhart pit westward back to the Shellwood bench. Complete the western endpoint of the long dashed shortcut all the way to the bench (1232,495), rather than leaving it disconnected at (1197,430). Use two-way arrowheads on shortcut branches. The solid cyan/orange/magenta routes have one-way arrowheads in the sequence described above.

Keep the original source screenshot intact. Preserve pins, contours, text and relative positions. No new map rooms. Labels 1,2,3,4,5 exactly once each, with marker 2 beside Sister Splinter and marker 4 beside Widow. Retain concise labels and the original legend. Utility route map, not artwork.
```

## Connection corrections

```text
Correct ONLY these three defects in this annotated Shellwood map. Preserve every other pixel, legend, label, route segment and all underlying map geometry. Keep 2048x768 size.

1. REMOVE the entire orphan orange path on the LEFT, which currently runs through black space from approximately (660,395) left to (630,395), up to (630,280), right to (730,280), up to (730,214), then right to Cling Grip. Restore the original map pixels there using image 2, the untouched source. That path is not a valid room connection.
REPLACE it with a SHORT CONNECTED orange path going FROM Sister Splinter checkpoint 2 TO Cling Grip checkpoint 3, using the existing room interiors:
start at (1045,275), travel LEFT to (942,275), then LEFT-UP into the shrine chamber at (915,240), descend slightly LEFT within the chamber to (822,281), go LEFT through the opening into the Gahlia room at (785,283), continue LEFT to (751,283), UP to (751,239), then RIGHT above the small square map hole via (810,239), ending at Cling Grip (872,240). Adapt these waypoints narrowly to existing open passage interiors. Arrowheads point from 2 toward 3. Do not join this orange path to the orange bottom-of-shrine route before the Sister Splinter fight. This is the POST-BOSS path. Do not draw any direct climb from the shrine bottom; no skip.

2. The CYAN Z climb in the large lower-right Shellwood room has backward arrowheads. The cyan route comes FROM Bellhart along the bottom, moves into the large room near (1100,684), follows its existing zigzag UP to the arena (1231,548), then UP to the bench (1232,495), then LEFT to the lift (1109,505). Reverse the cyan arrowheads on the whole zigzag so they point UPWARD toward the arena and bench, not downward toward Bellhart. At the bench branch, cyan should bend LEFT directly to the lift. Remove the current cyan upward spur at (1198,456) that wrongly joins the orange/yellow routes. The CYAN lift shaft at x1113 should still point DOWN, and the mask corridor should still point RIGHT. No other cyan changes.

3. Move the small magenta checkpoint 5 circle from (1775,617) to (1815,618), the actual workshop within the brown Bellhart building. Connect the magenta town path to end there. The separate text box may stay nearby to the left, but remove the redundant large 5 circle beside that text box; its text should simply read "Needle upgrade #1". Only ONE magenta numbered 5 circle should exist on the whole image.

Leave all other map details, route legs, checkpoint numbers and colors unchanged. Utility map annotation, not a redesign.
```

## Final Sister Splinter connection correction

```text
Make ONE small route-line correction to this 2048x768 annotated map. Preserve everything else exactly.

The orange POST-Sister-Splinter route incorrectly begins on the upper shelf at (1055,212), underneath the text label. The actual Sister Splinter boss location is the RED BOSS PIN with its tip at (1050,275). The orange route must continue from that red boss pin, not from the text label.

Erase ONLY the wrong orange horizontal segment from (1057,212) LEFT to (940,212) and its diagonal down-left continuation to (898,244), restoring the original map in that small area. Image 2 is the untouched source for those pixels.
Replace that erased segment with an orange line starting at the RED BOSS PIN TIP (1050,275), traveling LEFT along the SAME existing lower horizontal room corridor to (930,275), then UP-LEFT to (898,244), where it joins the existing orange path into the western Gahlia room and around to Cling Grip. The arrowheads on the new segment point LEFT from (1050,275) to (930,275), then UP-LEFT towards (898,244).
Do not erase or alter the magenta eastbound route 12px above it. Do not move checkpoint labels. Do not change the already correct long orange approach coming from the right and ending at that same red Sister Splinter pin. The resulting orange route should be visibly continuous: bottom mask corridor -> full eastern platform loop -> red Sister Splinter pin -> continue LEFT from that pin -> western Gahlia room -> Cling Grip.

Do not add any orange line to the upper shelf at y212 beside checkpoint text 2. Do not connect route lines to text labels. All line connections are to map rooms and the actual red boss pin. Keep all original map contours and pins unchanged.
```

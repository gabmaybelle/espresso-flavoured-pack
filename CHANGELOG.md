# Changelog

## 0.5.2

Our own mods move to their newest versions. Nothing else in the pack changes.

- **Pocket List 0.2.0:** a new release with the same checklist, now also made for NeoForge.
- **Nightfall Clock 0.3.1:** the clock reads the sun the way the sky does.
- **Spawn Gazebo 1.2.0:** now also made for NeoForge; on Fabric it works as before, and worlds you already have keep their gazebo. Espresso Flavoured Core 0.4.0 still works with it.
- Updating an install with the pack's own scripts moves the older copies of these mods out of `mods/` (into `old-pack-files/`), so two copies never load together.

## 0.5.1

- **Our own five mods are now downloaded from their GitHub releases**, each pinned by version and file hash, instead of being packed inside the pack file. The pack file is about 10 KB instead of 1.4 MB, and every launcher that imports `.mrpack` files, Modrinth included, can take it. The mods themselves are the same as in 0.5.0, except that Pocket List carries its new pinned-checklist icon.

## 0.5.0

- **The café is back.** Espresso Flavoured Core 0.4.0 returns as the pack's café: coffee you grow and brew, mugs you shape and dye, baristas and village cafés, Bean Coins and eight café charms. It no longer does any of Cozy Core's jobs, so the two sit side by side. With it come longer days (20 minutes of daylight, 10 of night), slightly tougher nights, healing only when you've eaten, Drowsy after three days away from your home bed, roomier bundles and the block merchant. Each can be switched off in its settings (Mod Menu).
- **Keep your hotbar when you die.** Cozy Core 0.3.0's new rule: your hotbar, armour and off-hand stay with you, and Universal Graves keeps the rest where you fell.
- **Trinkets Updated is back**, so café charms go in their own slots (right-click one to wear it) instead of the off-hand, and stay with you when you die.
- Worlds from 0.4.0 carry over: the café's coffee bushes and village cafés only appear in land you haven't explored yet.

## 0.4.0

- **Cozy Core takes over from Espresso Flavoured Core.** What builders felt stays and gets simpler: builds stay built (creepers and ghasts still hurt but break nothing, endermen leave blocks alone, fire never eats a block), no phantoms, cheap wood in the stonecutter, re-dyeing and builder trades, each as an ordinary game rule you can switch in the Game Rules screen. New: the **Hearth Lantern**, a lantern with four amethyst shards around it that keeps monsters from spawning within 32 blocks. Gone with Core: the café, Bean Coins, the charms, longer days, the keep-your-hotbar rule and the wellbeing effects; Universal Graves keeps everything where you fell. Worlds from 0.3.0 don't carry over; start a new one.
- **Spawn Gazebo** is its own mod in the pack now (it used to ride inside Core), with its own starter chest.
- **Trinkets Updated** removed: nothing in the pack uses it any more.

## 0.3.0

- **Espresso Flavoured Core 0.3.0** (the mod is now called Core, with the mod ID `espresso_flavoured`): Bean Coins, café charms, the spawn gazebo, and the rest of its changelog. Worlds from 0.2.0 don't carry over; start a new one.
- **Trinkets Updated**, for the café charms' slots.
- **Nightfall Clock**, our own clock and dusk warning, now that Core no longer draws its own. It sits just above the hotbar; its position and 12- or 24-hour time are in its settings.
- **Shaders on from the first launch:** MakeUp UltraFast is switched on the first time the pack runs. **Complementary Reimagined** is there as an optional, richer shader for stronger PCs.
- **Fresh Animations is optional**; Entity Model Features and Entity Texture Features, which it needs, are always installed, so ticking it at install is all it takes.
- **Your settings stay yours:** the pack's starting settings (the shader, Mod Menu, FallingTree) are put in place only the first time, through Your Options Shall Be Respected, so updates never reset what you've changed.
- **Crouch to fell a tree** with FallingTree; a normal swing takes one log, so a stray click never brings down a log build.
- **Pocket List**, our own little checklist: press K, add what you're gathering (or pin a recipe from JEI), and watch it tick itself off as you collect. It sits bottom-right, out of the minimap's corner, and lives only on your game, never on a server.
- Added since 0.2.0: Continuity, BetterGrassify, Falling Leaves, Particle Rain, AmbientSounds, Towns and Towers, Visuality, Zoomify, FallingTree, Chunky, Nemo's Inventory Sorting and Durability Tooltip. Mod Menu counts only the mods themselves, not their libraries.
- Every mod's version is pinned in `pack.lock.json`, so the same pack version always builds the same pack.
- Distant Horizons was tried and dropped: its far water met the real water as a visible rectangle under Complementary.
- Servers: `install-server.js` installs just what a server needs, and running either installer again after an update swaps in the new versions, moving anything the pack no longer has into `old-pack-files/`, so two versions of a mod never end up side by side.

## 0.2.0

- Espresso Flavoured 0.2.0 (the café update).
- Server flags: everything a server-side mod depends on is marked server-required, and `install-server.js` sets up a server folder.

## 0.1.0

- The first pack: Espresso Flavoured 0.1.0 with Terralith, graves, maps and compasses, Beautify and Rechiseled, JEI and Jade, the performance set, Iris with MakeUp UltraFast, and the pack builder.

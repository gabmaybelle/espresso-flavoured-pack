# Changelog

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

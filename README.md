# Espresso Flavoured

*A shot of espresso for your survival world: less stress, less grind, more building.*

This is the modpack around the [Espresso Flavoured Core mod](https://github.com/gabmaybelle/espresso-flavoured): a cozy, builder-friendly survival setup for Minecraft 26.3 on Fabric. It's meant to run well on an ordinary PC, with a light shader on from the start so things look lovely straight away.

## What's inside

- **Espresso Flavoured Core:** a safe home, builds that stay built, longer days, keep-your-hotbar deaths, and a whole little café (coffee you grow and brew, mugs, a barista, and more).
- **Graves:** Universal Graves keeps everything else safe where you fell.
- **The world:** Terralith (with Lithostitched) and Towns and Towers, for more variety and more building blocks within reach.
- **Finding your way:** Nature's Compass, Explorer's Compass, and Xaero's World Map and Minimap.
- **A smoother start:** Chunky. In a new world, run `/chunky radius 500` and then `/chunky start`, and it builds the land around you ahead of time, so exploring near home has no world-generation hiccups.
- **Decorating:** Beautify, Rechiseled, and Continuity for connected glass and bookshelves.
- **Atmosphere:** Falling Leaves, Particle Rain, Visuality, AmbientSounds and BetterGrassify, plus, if you'd like it, the Fresh Animations resource pack so mobs blink, look around and move more naturally. Entity Model Features and Entity Texture Features, which it needs, are always installed, so you only have to tick Fresh Animations when you install, then switch it on under Options > Resource Packs.
- **Quality of life:** [Nightfall Clock](https://github.com/gabmaybelle/nightfall-clock) (the day and time just above your hotbar, read from the sun so it stays right on the longer days, and "The sun's getting real low" at 6 PM), [Pocket List](https://github.com/gabmaybelle/pocket-list) (press K for a little checklist of what you're gathering; it sits bottom-right, counts as you collect, and can pin recipes from JEI), JEI, Jade, Durability Tooltip (how much life a tool has left, when you hover it), Nemo's Inventory Sorting (a sort button on chests and your inventory), Zoomify (hold C to zoom, scroll to zoom further), FallingTree, Trinkets Updated (slots for Espresso's café charms: right-click a charm to wear it), Mouse Tweaks, Controlling, Searchables and Mod Menu (set to count only the mods themselves, not the libraries and parts bundled inside them).
- **Your settings stay yours:** the pack's starting settings (the shader, Mod Menu, FallingTree) are only put in place the first time, thanks to Your Options Shall Be Respected, so an update never resets anything you've changed. FallingTree fells a whole tree only when you crouch while chopping its trunk; a normal swing takes one log, so a stray click never brings down a log build. (With the Ember Glove on, a normal swing gives charcoal and a crouching one fells the tree for logs.)
- **Performance:** Sodium, Lithium, FerriteCore, ModernFix, ImmediatelyFast, Entity Culling and Dynamic FPS, plus Iris with the MakeUp UltraFast shader, which is on from the first launch (it's a very light shader; switch it off under Options > Video Settings > Shader Packs if your PC struggles).
- **Optional, for stronger PCs:** **Complementary Reimagined**, a richer shader with soft shadows and clouds. Tick it when you install, then pick it under Options > Video Settings > Shader Packs; MakeUp UltraFast stays the light default.

## Playing it

Grab the `.mrpack` and import it into the Modrinth app (or Prism Launcher, ATLauncher or CurseForge). You'll need Minecraft 26.3; the launcher sorts out Fabric for you. A few parts are still in beta for 26.3 (JEI, Visuality and Fresh Animations), as many mods are this early in a version.

**Give it 4 GB of memory.** Launchers often start at 2 GB, which is just enough to get going but leaves little room: once you're exploring, the game keeps about 1 to 1.8 GB in use, so at 2 GB it's nearly full and stutters more as your world grows. In the Modrinth app it's under the instance's settings, then Java and memory. 3 GB is the least we'd use; a PC with 8 GB of RAM or more is comfortable.

**What to expect:** on a budget gaming laptop (Core i5-13420H, RTX 3050 laptop GPU, 16 GB) at 1080p with the MakeUp shader and the default render distance of 12, it runs at about 50 to 90 FPS while exploring new land, and a little lower just after a new world opens while the land around spawn is still being built. Most of the work there is generating Terralith's land, so your processor matters more than your graphics card; pre-generating with Chunky smooths it out. On integrated graphics, turn the shader off or the render distance down.

## Running a server

Every player needs the pack, and the server needs the server-side mods. The easy way: most server hosts can install a `.mrpack` for you (look for a Modrinth or "import modpack" option). They read the pack's list and skip the mods that only belong on players' computers.

If you'd rather set up a server folder yourself, `node install-server.js <folder>` from this repository does the same, with exactly the mods a server needs (add `--with-optional` for the optional performance ones). It needs [Node.js](https://nodejs.org/). Run it again after a pack update and it swaps in the new versions, moving anything the pack no longer has into `old-pack-files/` (nothing is deleted, and mods you added yourself are left alone).

A few things to know:

- **The server's settings win.** Espresso's settings (safe home radius, longer days, tools per bundle and so on) come from the server's `config/espresso_flavoured.properties`, and players' bundles follow the server's "Tools per Bundle".
- **Keep everyone on the same version.** Update the server and every player to the same pack version together, so their Espresso Flavoured matches. Like a player's game, the server keeps its own settings through updates: the pack's defaults only fill in files it doesn't have yet.
- **Before you invite anyone:** new 26.3 servers have the whitelist turned on, and Terralith makes new chunks slow to generate, so pre-generating your world helps a lot (Chunky is in the pack for that).

## Building it yourself

`node build-pack.js` reads `pack.json`, takes every mod (and what each one needs) from Modrinth at the exact version pinned in `pack.lock.json`, and writes the `.mrpack` to `dist/`, so the same pack version always builds the same pack. `node build-pack.js --outdated` lists mods with a newer 26.3 build, and `--update` takes them, rewrites the lock and lists what changed. `install-test.js` installs it into a test folder, and `scan-mixins.js` lists any mods that change the same parts of the game as Espresso Flavoured.

## Credits and licences

Every mod in the pack belongs to its own authors and keeps its own licence; the pack downloads them from Modrinth rather than including them. The MakeUp UltraFast shader is by javiergcim (LGPL-3.0), and Complementary Reimagined is by EminGT (under its own licence).

This repository (the pack list and the scripts) is shared under [CC BY-NC-SA 4.0](LICENSE). Espresso Flavoured was put together by Gabby with help from Claude, an AI assistant.

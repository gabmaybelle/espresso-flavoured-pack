# Espresso Flavoured

*A shot of espresso for your survival world: less stress, less grind, more building.*

A cozy, builder-friendly survival modpack for Minecraft 26.3 on Fabric. Your builds stay safe, decorating is easier, there's a café to run, and the world looks lovely from the first launch. It's made to run well on an ordinary PC.

## Getting started

1. Download the `.mrpack` and import it into the Modrinth app, Prism Launcher, ATLauncher or CurseForge. The launcher sets up Minecraft 26.3 and Fabric for you.
2. **Give it 4 GB of memory** (3 GB at the least). Launchers often start at 2 GB, which stutters once you explore. In the Modrinth app it's in the instance's settings, under Java and memory.
3. In a new world, run `/chunky radius 500` and then `/chunky start`. It builds the land around you ahead of time, so exploring near home runs smoothly.

## What's inside

**Building**
- [Cozy Core](https://github.com/gabmaybelle/cozy-core): creepers can't break your builds, endermen leave blocks alone, fire never burns a block, no phantoms, and you keep your hotbar when you die. Its Hearth Lantern keeps monsters from spawning near your build site. Wood goes in the stonecutter at cheap rates, and you can re-dye blocks.
- Beautify and Rechiseled for more to build with, and Continuity for connected glass.
- FallingTree: crouch while chopping a trunk to fell the whole tree. A normal swing takes one log, so log builds are safe.

**The café**
- [Espresso Flavoured Core](https://github.com/gabmaybelle/espresso-flavoured): coffee you grow and brew, mugs you shape and dye, baristas, Bean Coins and café charms you wear in their own slots (Trinkets Updated). Days are longer, and three days away from your home bed makes you Drowsy until you sleep there; coffee holds it off.

**Starting out**
- [Spawn Gazebo](https://github.com/gabmaybelle/spawn-gazebo): you start in a little gazebo with a starter chest.
- Universal Graves: when you die, everything you didn't keep (your hotbar, armour and worn charms stay with you) waits in a grave where you fell.

**The world**
- Terralith and Towns and Towers, for more varied land and villages.
- Nature's Compass, Explorer's Compass, and Xaero's World Map and Minimap, for finding your way.

**Handy extras**
- [Nightfall Clock](https://github.com/gabmaybelle/nightfall-clock): the day and time above your hotbar.
- [Pocket List](https://github.com/gabmaybelle/pocket-list): press K for a checklist of what you're gathering.
- JEI for recipes, Jade for what you're looking at, Zoomify (hold C), inventory sorting, durability on hover, and Mod Menu.

**Looks and speed**
- A light shader (MakeUp UltraFast) is on from the start. On a stronger PC you can pick Complementary Reimagined instead, under Options > Video Settings > Shader Packs. On integrated graphics, switch shaders off.
- Falling leaves, rain particles, ambient sounds and nicer grass. Fresh Animations is an optional extra you can tick when you install.
- Sodium, Lithium and other performance mods keep it running smoothly.

Your own settings are never reset by an update: the pack's starting settings only apply the first time.

## Running a server

Most server hosts can install a `.mrpack` for you; look for a Modrinth or "import modpack" option. To set up a server folder yourself, run `node install-server.js <folder>` from this repository (it needs [Node.js](https://nodejs.org/)).

- Keep the server and every player on the same pack version.
- Cozy Core's rules are game rules saved with the world: set them with `/gamerule cozy_core:...`.
- Pre-generate the world with Chunky before inviting people, since new land is slow to generate. New 26.3 servers have the whitelist on.

## Upgrading

From 0.4.0, worlds carry over; the café appears in land you haven't explored yet. From 0.3.0, start a fresh instance, since those worlds don't carry over.

## Building it yourself

`node build-pack.js` builds the `.mrpack` into `dist/` from the exact versions pinned in `pack.lock.json`. `--outdated` lists newer mod builds and `--update` takes them. `install-test.js` installs the pack into a test folder, and `scan-mixins.js` lists mods that change the same parts of the game as ours.

## Credits and licences

Every mod in the pack belongs to its own authors and keeps its own licence; the pack downloads them from Modrinth rather than including them. The MakeUp UltraFast shader is by javiergcim (LGPL-3.0), and Complementary Reimagined is by EminGT (under its own licence).

This repository (the pack list and the scripts) is shared under [CC BY-NC-SA 4.0](LICENSE). Espresso Flavoured was put together by Gabby with help from Claude, an AI assistant.

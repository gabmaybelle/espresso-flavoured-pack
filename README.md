# Espresso Flavoured (the pack)

*A shot of espresso for your survival world: less stress, less grind, more building.*

This is the modpack around the [Espresso Flavoured mod](https://github.com/gabmaybelle/espresso-flavoured): a cozy, builder-friendly survival setup for Minecraft 26.3 on Fabric. It's meant to run well on an ordinary PC, with a light shader you can switch on when you want things to look lovely.

## What's inside

- **Espresso Flavoured:** a safe home, builds that stay built, longer days, keep-your-hotbar deaths, and a whole little café (coffee you grow and brew, mugs, a barista, and more).
- **Graves:** Universal Graves keeps everything else safe where you fell.
- **The world:** Terralith (with Lithostitched) and Towns and Towers, for more variety and more building blocks within reach.
- **Finding your way:** Nature's Compass, Explorer's Compass, and Xaero's World Map and Minimap.
- **Decorating:** Beautify, Rechiseled, and Continuity for connected glass and bookshelves.
- **Atmosphere:** Falling Leaves, Particle Rain, Visuality, AmbientSounds and BetterGrassify, plus the Fresh Animations resource pack (with Entity Model Features and Entity Texture Features) so mobs blink, look around and move more naturally. Switch it on under Options > Resource Packs.
- **Quality of life:** JEI, Jade, Mouse Tweaks, Controlling, Searchables and Mod Menu.
- **Performance:** Sodium, Lithium, FerriteCore, ModernFix, ImmediatelyFast, Entity Culling and Dynamic FPS, plus Iris with the MakeUp UltraFast shader.

## Playing it

Grab the `.mrpack` and import it into the Modrinth app (or Prism Launcher, ATLauncher or CurseForge). You'll need Minecraft 26.3; the launcher sorts out Fabric for you.

## Running a server

Every player needs the pack, and the server needs the server-side mods. `node install-server.js <folder>` sets up a Fabric 26.3 server folder with exactly the mods a server needs (add `--with-optional` for the optional performance ones). Two things to know: new 26.3 servers have the whitelist turned on, and Terralith makes new chunks slow to generate, so pre-generating your world helps a lot.

## Building it yourself

`node build-pack.js` reads `pack.json`, finds the newest 26.3 Fabric build of every mod (and what each one needs) on Modrinth, and writes the `.mrpack` to `dist/`. `install-test.js` installs it into a test folder, and `scan-mixins.js` lists any mods that change the same parts of the game as Espresso Flavoured.

## Credits and licences

Every mod in the pack belongs to its own authors and keeps its own licence; the pack downloads them from Modrinth rather than including them. The MakeUp UltraFast shader is by javiergcim (LGPL-3.0).

This repository (the pack list and the scripts) is shared under [CC BY-NC-SA 4.0](LICENSE). Espresso Flavoured was put together by Gabby with help from Claude, an AI assistant.

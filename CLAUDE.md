# Espresso Flavoured (the modpack)

The Modrinth modpack around Cozy Core and Espresso Flavoured Core (with Spawn Gazebo, Nightfall Clock and Pocket List), for
Minecraft 26.3 on Fabric. This repo is
the pack list and the scripts that build the `.mrpack`; the mods themselves are downloaded from
Modrinth. See README.md.

`PROGRESS.md` says what's done, what's broken and what's next, with a row per session: read
it first, and add this session's row before ending.

## Layout

- `pack.json`: the mods, shaders and resource packs, and which are optional or needed on a
  server; `retired` names our own former jars (by name up to the version) that the installers move
  out of `mods/`; `ownMods` lists our own mods (Cozy Core, Espresso Flavoured Core, Spawn Gazebo,
  Pocket List, Nightfall Clock) by GitHub repo, release tag and jar name, with `side` "client" for
  the two that stay off servers. `pack.lock.json`: the exact version of every one, plus each own
  mod's download link, hashes and size.
- `overrides/`: files every install gets: first-run settings under `overrides/config/yosbr/`. No
  jars are kept in this repo. (Espresso Flavoured Core also carries a Spawn Gazebo inside it; keep
  the two versions equal.)
- `build-pack.js`, `install-test.js`, `install-server.js` (both built on `pack-files.js`: the zip
  reader, the downloads with their manifest, the overrides), `scan-mixins.js`, `zip.js`.

## Build and test

- `node build-pack.js`: builds `dist/<name>-<version>.mrpack` from the lock. `--outdated` lists
  newer builds; `--update` takes them and rewrites the lock.
- `node install-test.js test-instance`: installs the pack like a launcher would, for a test game.
- CI builds the pack from the lock on every push and checks every mod is pinned and our own
  mods are listed with working release links. It can't play the pack: test a change by installing it and opening a new world.

## Gotchas

- **Our own mods come from GitHub releases.** To update one: release it from a clean, committed
  `main` of its repo, change its `tag` and `asset` in `pack.json`'s `ownMods`, run
  `node build-pack.js` (it downloads and hashes the jar) and commit the lock. Current: cozy-core
  v0.3.0, espresso-flavoured-core v0.4.0, spawn-gazebo v1.1.1, pocket-list v0.1.0,
  nightfall-clock v0.2.1. Deleting or renaming a release breaks the build, and CI checks every link.
- The default shader is switched on by file name in `overrides/config/yosbr/config/iris.properties`;
  `build-pack.js` stops if an update renames it.
- Licence: this repo is CC BY-NC-SA 4.0. Every mod keeps its own licence.

## Gabby's mods: who does what (the same in every repo)

One job per mod, decided 2026-10-15, so nothing is done twice and each repo tells the same story:

- **Cozy Core** (cozy-core): the builder rules, each an ordinary game rule: builds stay built (mob
  explosions, endermen, fire), no phantoms, keep your hotbar on death, the Hearth Lantern, cheap
  wood in the stonecutter, re-dyeing and builder trades. Fabric and NeoForge jars, plus a plain
  data pack of the recipes.
- **Espresso Flavoured Core** (espresso-flavoured): the café: coffee you grow and brew, mugs,
  baristas, Bean Coins, the café charms, and Drowsy (coffee's reason to exist). Longer days stay a
  Core setting for now. The survival rules Cozy Core now covers left Core in 0.4.0 (its PLAN-0.4.0.md).
- **Spawn Gazebo** (spawn-gazebo): the gazebo at the world spawn and its starter chest.
- **Nightfall Clock** (nightfall-clock): the clock above the hotbar and the dusk warning.
- **Pocket List** (pocket-list): the gathering checklist.
- **Not Now, Shield** (not-now-shield): the shield drawn lower in first person; on 26.x also
  tools that change blocks while a shield is in the off-hand.
- **Beyond the Dragon** (beyond-the-dragon): the end-game after the Ender Dragon: ruins at the
  edge of the End, a dragon that comes back harder, and the aphelite metal.
- **Forgemark** (forgemark): tempering the tools, weapons and armour you already have, from any
  mod, for a small capped quality bonus.
- **Espresso Flavoured** (espresso-flavoured-pack): the modpack that puts them together. Since
  pack 0.5.0 (2026-10-15) it carries all five: Cozy Core, Espresso Flavoured Core (back as the café
  once it stopped doing Cozy Core's jobs), Spawn Gazebo, Nightfall Clock and Pocket List.
- **Cozy Core Pack** (cozy-core-pack): the builder-friendly modpack around Cozy Core, with Spawn
  Gazebo, Nightfall Clock, Pocket List and Not Now, Shield.

A new feature goes in the mod whose job it is. If none fits, ask Gabby before adding it anywhere.

## Working on Gabby's mods (the same in every repo)

Gabby makes these mods with help from Claude. Several Claude sessions work on them: one on her
computer and others in the cloud. These rules keep their work fitting together.

**One session per repo at a time.**
- A cloud session works on a `claude/...` branch and never pushes to `main`. Gabby's local
  session reviews the branch, runs its tests and merges it as one commit.
- Start from the latest `main` (`git pull`), and say in the branch's last commit or a short note
  what is finished and what isn't.

**Commits are made one at a time, by hand.** Never commit or push from a chained script. Run
the test, read its result (and the screenshot, for anything visual), then commit that one
branch, then push it. A cherry-pick that conflicts stops the work until it is resolved by hand.
A worldgen or balance change is tested on every terrain in the branch's matrix before it goes
to any other branch. (Learned on Beyond the Dragon, 2026-10-14, when scripted chains committed
a conflicted cherry-pick, put one branch's files on another, and sent an untested ore change to
all three branches.) For a Gradle game test use a game watcher that reports a verdict (in the world, error screen, crashed or hung),
not a wait loop.

**Commits.**
- Author and committer are always `gabmaybelle <211247938+gabmaybelle@users.noreply.github.com>`:
  `git -c user.name=gabmaybelle -c user.email=211247938+gabmaybelle@users.noreply.github.com commit ...`.
  Never a personal email, and never `Claude <noreply@anthropic.com>` as the author. Claude goes in
  a `Co-Authored-By:` line at the end of the message.
- Ask Gabby before committing or pushing when she's around. Finish the build and the tests first.
- Commit messages say what changed for players, in plain sentences.

**Privacy.** These repos are public. Don't add personal email addresses, real names other than
"Gabby", or anything about her other private projects and modpacks: not in code, docs, commits
or test names. Check the diff for these before every push.

**Tests.**
- `./gradlew build` and `./gradlew runClientGameTest` (where the repo has one) must pass before
  a commit. The game test opens a real game window for a minute or two.
- A new or changed check should fail with the feature switched off: run it that way once, then
  put the code back. A check that compares against the setting it tests proves nothing.
- A data change (worldgen, loot, a template, a pack's mod list) gets the same proof: run the part
  of the test that sees it, and quote the numbers in the progress row.
- On Linux without a screen, run game tests under `xvfb-run -a`. 26.3 also needs
  `SDL_VIDEO_FORCE_EGL=1` with `libegl1 libegl-mesa0` installed, or the game hangs at startup.

**Writing.**
- README and CHANGELOG are for players: plain, friendly, no jargon. New player-facing changes
  go in the CHANGELOG's newest section.
- Keep the credit line: "made by Gabby with help from Claude, an AI assistant".
- Gabby publishes on Modrinth herself. Don't upload anything there.

**Minecraft.** Fabric on Minecraft 26.3 (Mojang names; Loom 1.18.4, Java 25). Vanilla names
changed a lot in 26.x: check the merged jar rather than older docs (for example `iron_chain`,
`pink_petals[flower_amount=N]`, timelines instead of `time query daytime`).

# Espresso Flavoured (the modpack)

The Modrinth modpack around Espresso Flavoured Core, for Minecraft 26.3 on Fabric. This repo is
the pack list and the scripts that build the `.mrpack`; the mods themselves are downloaded from
Modrinth. See README.md.

## Layout

- `pack.json`: the mods, shaders and resource packs, and which are optional or needed on a
  server. `pack.lock.json`: the exact version of every one.
- `overrides/`: files every install gets: our own Core jar in `overrides/mods/`, and first-run
  settings under `overrides/config/yosbr/`. `client-overrides/`: players' games only (the
  Pocket List jar).
- `build-pack.js`, `install-test.js`, `install-server.js` (both built on `pack-files.js`: the zip
  reader, the downloads with their manifest, the overrides), `scan-mixins.js`, `zip.js`.

## Build and test

- `node build-pack.js`: builds `dist/<name>-<version>.mrpack` from the lock. `--outdated` lists
  newer builds; `--update` takes them and rewrites the lock.
- `node install-test.js test-instance`: installs the pack like a launcher would, for a test game.
- CI builds the pack from the lock on every push and checks every mod is pinned and our own
  jars are inside. It can't play the pack: test a change by installing it and opening a new world.

## Gotchas

- **The jars in `overrides/mods/` and `client-overrides/mods/` are built from the mods' own
  repos.** Build them from a clean, committed `main` of that repo and say which commit in the
  commit message.
- The default shader is switched on by file name in `overrides/config/yosbr/config/iris.properties`;
  `build-pack.js` stops if an update renames it.
- Licence: this repo is CC BY-NC-SA 4.0. Every mod keeps its own licence.

## Working on Gabby's mods (the same in every repo)

Gabby makes these mods with help from Claude. Several Claude sessions work on them: one on her
computer and others in the cloud. These rules keep their work fitting together.

**One session per repo at a time.**
- A cloud session works on a `claude/...` branch and never pushes to `main`. Gabby's local
  session reviews the branch, runs its tests and merges it as one commit.
- Start from the latest `main` (`git pull`), and say in the branch's last commit or a short note
  what is finished and what isn't.

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

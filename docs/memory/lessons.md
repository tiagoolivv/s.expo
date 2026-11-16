# Lessons

Things that failed in a non-obvious way. Symptom first, because that is what you will be searching for. Newest first.

## macOS `python3` is 3.9; the quality tools need 3.11+
*2026-11-16* · **Symptom:** `quality: Python 3.11+ is required`. **Cause:** crapper/dryer/mutator use 3.11 syntax and tree-sitter wheels. **Fix:** `brew install python@3.12`; `scripts/quality.sh` finds it on its own.

## A gate hook that greps the raw command blocks text, not actions
*2026-11-16* · **Symptom:** the guard blocked a `git commit` whose *message* mentioned `--no-verify`, and an `echo` of a JSON event containing `git push --force origin main`. **Cause:** PreToolUse sees the whole shell string, quotes and heredoc bodies included. **Fix:** the rules match `executableText(command)`, which drops heredoc bodies and quoted strings; both cases are pinned in `pnpm test:hooks`.

## Nothing done with `GITHUB_TOKEN` triggers another workflow
**Symptom:** the release PR opens with no checks, or the tag lands and no release appears, or the release publishes and no EAS build starts. **Cause:** GitHub suppresses workflow triggers from the automatic token. **Fix:** every step that starts the next one uses `secrets.GH_TOKEN` (fine-grained PAT: Contents + Pull requests, read/write).

## A release that pushes to `main` leaves an orphan tag
**Symptom:** `GH013: Repository rule violations` for `main`, while `[new tag] vX.Y.Z` succeeded. **Cause:** `git push --follow-tags` is atomic per ref; the ruleset rejects the branch and not the tag. **Fix:** releases go through a pull request; `tag-release.yml` tags after the merge.

## An import resolving does not mean the package is declared
**Symptom:** a build breaks after an unrelated dependency change. **Cause:** `.npmrc` sets `node-linker=hoisted`, so transitive packages resolve from the root — `@react-navigation/native` worked for months undeclared. **Fix:** declare every package you import.

## A green `tsc` is not a green bundle
**Symptom:** type-check passes; Metro rejects the import. **Cause:** since SDK 56 the bundler rejects `@react-navigation/*` in app code. **Fix:** import from `expo-router/react-navigation`; verify with a bundle, not only `tsc`.

## Ignored generated files hide CI type errors
**Symptom:** `pnpm type-check` green locally, five errors in CI. **Cause:** `expo-env.d.ts` and `.expo/` exist locally and are git-ignored. **Fix:** move them aside and type-check again before pushing a change to types or `tsconfig.json` (`docs/workflow.md` §5).

## `expo prebuild` fails one run in four on Linux
**Symptom:** `Could not find MIME for Buffer <null>`. **Cause:** a race in `app-icon-badge` reading an icon it is still writing (`jimp-compact@0.16.1`). **Fix:** both CI call sites retry three times. macOS has not shown it.

## Single-file Jest runs can hang after passing
**Cause:** open handles from MMKV / i18n. **Fix:** `--forceExit` on single-file runs; the full `pnpm test` exits on its own.

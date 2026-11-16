---
name: s-expo-release
description: Cut an s-expo release through the GitHub Actions chain — New App Version opens chore/release-vX.Y.Z, merging it tags, publishes the GitHub release and starts the EAS QA build. Use when asked to "release", "cut a version", "bump the version", "publish v0.x", "new release", or when a release step silently did nothing. Production EAS builds and store submissions are out of scope — always a human decision.
---

# Release

Reference: [`docs/ci/workflows.md#release`](../../../docs/ci/workflows.md#release). The chain has one human step (merging the bump PR); every other link is a workflow triggered by the previous one.

## Preconditions
- Everything to ship is merged to `main` and its gates are green: `gh run list --branch main --limit 5`.
- `GH_TOKEN` secret exists (fine-grained PAT, Contents + Pull requests read/write). Without it each link "succeeds" and the next never fires.

## Steps
1. Pick the bump: `patch` fixes only · `minor` new capability · `major` breaking. Say which and why.
2. Start it: `gh workflow run new-app-version.yml -f release-type=<patch|minor|major>`.
3. Wait for the run, then find the PR: `gh pr list --head chore/release-v<X.Y.Z>`. Only `package.json` changes.
4. Its checks must be green. **Merging is the user's call** — ask before `gh pr merge <n> --merge`.
5. Verify each link fired, in order:
   - `gh run list --workflow tag-release.yml --limit 1` → tag `vX.Y.Z` pushed
   - `gh run list --workflow new-github-release.yml --limit 1` → `gh release view vX.Y.Z`
   - `gh run list --workflow eas-build-qa.yml --limit 1` → EAS preview build started
6. Append the release to `docs/memory/log.md`.

## When a link does not fire
It is almost always the token: the step ran with `GITHUB_TOKEN`, which never triggers another workflow. Check the step passes `secrets.GH_TOKEN`. See `docs/memory/lessons.md`.

## Never
- Push a version bump or tag straight to `main` — the ruleset rejects the branch and keeps the tag, leaving an orphan.
- Run `eas build --profile production` or `eas submit` (the gate hook blocks both).

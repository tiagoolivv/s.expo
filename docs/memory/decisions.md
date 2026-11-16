# Decisions

Choices that someone could reasonably undo, with the reason, so they are undone on purpose or not at all. Newest first. Format: context · decision · why · revisit if.

## Five required checks on main
*2026-11-16*
**Decision:** the `Protect Main Branch` ruleset requires `Lint TS (eslint, prettier)`, `Type Check (tsc)`, `Tests (jest)`, `Quality (CRAP + duplication)` and `Harness (hooks + harness-score)` to pass before a merge. `Expo Doctor` stays off the list because it is path-filtered.
**Why:** a gate that can be ignored drifts; the thresholds only hold if a pull request cannot land below them.
**Trap:** renaming one of these jobs changes its check name — update the ruleset in the same change, or every PR blocks waiting for a check that no longer exists.

## Keep react-native-edge-to-edge for now
*2026-11-16*
**Context:** React Native Directory now marks `react-native-edge-to-edge` unmaintained, which fails `expo-doctor`. It provides `SystemBars` in `focus-aware-status-bar.tsx` and a config plugin in `app.config.ts`.
**Decision:** exclude it from `expo.doctor.reactNativeDirectoryCheck` instead of replacing it in a dependency-patch PR.
**Why:** replacing it changes status-bar behaviour on device, which needs its own change verified on iOS and Android.
**Revisit if:** the next SDK upgrade — move `SystemBars` to Expo's own edge-to-edge API and drop the package.

## Agent harness in the repository
*2026-11-16*
**Context:** work happens in short conversations, often switching between AI tools and models when one hits its usage limit. Context re-explained in chat is lost each time.
**Decision:** keep the whole harness in the repo, tool-neutral — `AGENTS.md` as the entry point, skills/agents/rules/hooks under `.agents/`, memory in `docs/memory/`. Tool folders (`.claude/`, `.github/prompts/`) are adapters that only link or point there. Agents name a tier (`deep`/`standard`), never a vendor model; only adapters map tiers to models. Built from [revfactory/harness](https://github.com/revfactory/harness), renamed `s-expo-*`.
**Why:** a clone carries the context; any model can read Markdown.
**Revisit if:** a tool-neutral standard for agents/hooks appears that all the tools read. No `GEMINI.md`: Gemini is not used here (removed 2026-11-16).

## ub-mode quality gates
*2026-11-16*
**Context:** lint, types and tests say code is not broken; they do not say it is easy to change.
**Decision:** adopt [unclebob/ub-mode](https://github.com/unclebob/ub-mode) as the `s-expo-mode` skill and vendor its tools (crapper, dryer, mutator) in `tools/`, with thresholds CRAP < 10 and duplication < 0.8.
**Why:** deterministic numbers an agent can be held to, instead of "looks clean".
**Revisit if:** the tools gain a JS-native release (drop the Python dependency) or the thresholds block honest code repeatedly.

## Measure the harness with harness-score
*2026-11-16*
**Decision:** [paladini/harness-score](https://github.com/paladini/harness-score) (`pnpm harness:score`) in CI, version pinned. `SNS-04` (formatter) is switched off in `.harness-score.json` because ESLint Stylistic is the formatter and the scanner only recognises Prettier/Biome-style tools.
**Revisit if:** harness-score learns to detect ESLint Stylistic — then remove the override.

## ESLint Stylistic is the formatter
**Decision:** `@antfu/eslint-config` lints and formats; there is no Prettier. **Why:** one tool, one config, no conflicting rules. The editor and the edit hook both run `eslint --fix`.

## Uniwind, not NativeWind
**Decision:** Tailwind 4 through Uniwind; theme tokens live in `src/global.css` under `@theme`. **Why:** Tailwind 4 support and a Metro transformer instead of a Babel plugin. **Trap:** `className` only works on components imported from `react-native`; wrap others with `withUniwind`.

## Every CI job on ubuntu-latest
**Why:** macOS runners bill ten times as much on a private repository, and `macOS-latest` is arm64, where `api-level: 29` has no emulator image.

## Maestro labels stay in English
**Decision:** the `accessibilityLabel`s in `preferences-bar.tsx` are hardcoded English. **Why:** the Maestro flows read them to infer the current theme and language; translating them breaks `language.yaml` and `theme.yaml`.

## Releases go through a pull request
**Decision:** New App Version opens `chore/release-vX.Y.Z`; merging it tags, publishes and builds. **Why:** the ruleset on `main` requires a pull request with no bypass — see [lessons](./lessons.md#a-release-that-pushes-to-main-leaves-an-orphan-tag).

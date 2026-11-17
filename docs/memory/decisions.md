# Decisions

Choices that someone could reasonably undo, with the reason, so they are undone on purpose or not at all. Newest first. Format: context · decision · why · revisit if.

## Expo's AI tooling: plugin yes, agentic workflows not yet
*2026-11-17*
**Context:** Expo ships an official agent plugin (skills + MCP), toolkits for driving a running app (agent-device, Argent) and cloud agentic workflows (Agentic CI, Issue to PR, Bug triage, QA Swarm).
**Decision:** enable the Expo plugin in the Claude adapter (it replaces `.mcp.json`) and document it for Codex and others; the project's `s-expo-*` skills and `AGENTS.md` win over Expo's generic skills. Document agent-device as an optional, uncommitted CLI. Decline Argent (MCP-only, copies its own skills into the repo) and the agentic workflows (paid Expo plan, EAS Workflows, agent key readable in an EAS environment, per-run cost).
**Why:** take current Expo knowledge without a second harness or a bill for a one-screen template.
**Revisit if:** an app built from this template has real user flows, or Expo Simulators reach the free plan — start with Agentic CI.

## Security fixes for transitive packages go through pnpm.overrides
*2026-11-16*
**Context:** 140 open Dependabot alerts, almost all in dev/build tooling (Expo CLI, Metro, ESLint, Jest) that pins its own dependencies, so Dependabot reports `security_update_not_possible` and opens no PR. Only `axios` and `zod` ship in the app.
**Decision:** bump direct dependencies (`axios` 1.21.1, `zod` 4.6.7). For transitive ones, `pnpm.overrides` in `package.json` pins the **newest version within the same major** (same `0.minor` for 0.x packages) — never across a major, which would break the tool that pins it.
**Why:** same-major patches are semver-compatible; check-all, quality, expo-doctor and both bundles stayed green.
**Left open on purpose** (no fix in the installed major): `minimatch` 8/9/10 (fixed only in 11), `uuid` 7/8, `zod` 3 (pulled by a tool), `file-type` 16, `decode-uri-component` 0.2. They close when the parents move.
**Revisit:** at every Expo SDK upgrade — drop overrides the new versions no longer need (`pnpm why <pkg>`), since an override left behind can hold a package back.

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

# Glossary

Terms with a specific meaning in this repository. Add one when code gives a concept a name; keep each to a line or two.

| Term | Meaning here |
| --- | --- |
| **feature** | a folder under `src/features/<name>/` owning one domain: `<name>-screen.tsx`, optional `components/`, `api.ts`, `use-<name>-store.tsx`. Deletable with one `rm -rf`. |
| **route** | a file in `src/app/`. Always a one-line re-export of a feature screen; Expo Router builds the URL tree from these. |
| **design system** | `src/components/ui/` — the only place that wraps React Native primitives. Features import from `@/components/ui`. |
| **preferences** | the theme (`light`/`dark`/`system`) and language (`en-US`/`pt-BR`) pair the start screen toggles; persisted in MMKV. |
| **toggle decision** | the pure next-value logic in `toggle-preferences.ts`, tested without rendering — the house example of extracting a decision. |
| **check-all** | `pnpm check-all`: lint, type-check, translation lint, Jest and the hook tests. The local mirror of the CI merge gates. |
| **quality gates** | the second layer after check-all: CRAP (crapper), duplication (dryer), mutation (mutator), from `tools/`. |
| **CRAP** | Change Risk Anti-Patterns score, `CC² × (1 − coverage)³ + CC`. Kept under 10 per function. |
| **harness** | everything around the model that steers and checks it: `AGENTS.md`, the skills, agents, rules and hooks in `.agents/`, `docs/memory/`, and the gates. Tool folders such as `.claude/` are only adapters. |
| **orchestrator** | the `s-expo-dev` skill — runs a change through plan → build → gates → review → memory. |
| **tier** | the kind of model an agent needs — `deep` (design, code, review) or `standard` (procedural). Each tool maps it to its own models; see "Model tiers" in `AGENTS.md`. |
| **adapter** | tool-specific wiring (`CLAUDE.md`, `.claude/`, `.github/prompts/`) that only links or points into `.agents/`. |
| **`_workspace/`** | git-ignored folder where harness phases leave their artifacts (`{phase}_{agent}_{artifact}.md`). |
| **release chain** | New App Version → release PR → Tag Release → New GitHub Release → EAS QA build. See `s-expo-release`. |

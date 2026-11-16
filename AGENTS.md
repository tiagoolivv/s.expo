# AGENTS.md — s-expo

Instructions for any AI coding agent (Claude Code, Codex, Gemini, Cursor, Copilot, OpenCode, …) and any model. This file is the single entry point: `CLAUDE.md` and `GEMINI.md` only import it. Everything an agent needs to work here without a long chat is in this repository.

`s-expo` is an Expo template for responsive multi-platform apps (phone/tablet, iOS/Android). Derived from the Obytes React Native starter v9.0.0, then trimmed to a single start screen with no authentication.

## Start every session here

1. Read this file, then [`docs/memory/README.md`](docs/memory/README.md) — decisions, lessons and terms that are not obvious from the code.
2. Read [`docs/workflow.md`](docs/workflow.md) before changing anything. It is the development loop.
3. Pick the skill for the task (table below) and follow it. Skills are plain Markdown in `.claude/skills/<name>/SKILL.md` (also at `.agents/skills/`); any model can read and follow one, with or without a skill loader.
4. Rules scoped to the files you touch are in `.claude/rules/` — read the ones whose `paths:` match.
5. End by recording anything a future session needs in `docs/memory/` (`s-expo-memory` skill).

## Stack

- **Expo SDK 57** / React Native 0.86.2 / React 19.2.3 — custom dev client, Expo Go is not supported
- **Expo Router 57** — file-based routing, typed routes. Import navigation APIs from `expo-router/react-navigation`, never from `@react-navigation/*`: since SDK 56 the bundler rejects those imports in application code
- **Uniwind + Tailwind CSS 4** — `className` on RN components; theme lives in `src/global.css` under `@theme`. This project does **not** use NativeWind
- **TanStack Query 5** + axios — server state (`src/lib/api`)
- **Zustand 5** — client state
- **react-native-mmkv 4** — local storage
- **i18next** — `en-US` is the default language, `pt-BR` is the alternative
- **Jest + React Testing Library** — unit tests; **Maestro** — E2E
- **ESLint** (`@antfu/eslint-config`) — lints *and* formats via ESLint Stylistic. There is no Prettier
- **TypeScript 6**, strict. `compilerOptions.types` names `jest` explicitly — TS 6 no longer auto-includes `@types/*`
- **pnpm** — enforced by `only-allow`
- **Quality tools** — crapper, dryer, mutator (Python 3.11+), vendored in `tools/`

## Structure

```
src/
├─ app/            # Expo Router routes — one-line re-exports, no logic
│  ├─ _layout.tsx  # single Stack, providers
│  └─ index.tsx    # the only screen
├─ features/home/  # the start screen: title, description, theme + language toggles
├─ components/ui/  # design system
├─ lib/            # api, i18n, storage, hooks, utils, test-utils
└─ translations/   # en-us.json, pt-br.json
.claude/           # agent harness: agents/, skills/, rules/, hooks/, settings.json
docs/              # human + agent documentation; docs/memory/ is project memory
tools/             # vendored quality tools (do not edit)
```

A feature folder contains: `<name>-screen.tsx`, optional `components/`, optional `api.ts`, optional `use-<name>-store.tsx`, and tests beside the files they cover.

## Rules

- **Dependency direction** is `app/ → features/ → components/ui/ → lib/`. Never import leftwards. A feature never imports another feature — shared code moves up into `lib/` or `components/ui/`.
- **No barrel exports inside features** (`index.ts` re-exports break Fast Refresh). Import the file directly: `@/features/home/home-screen`.
- **Imports**: absolute `@/…` across folders, relative `./…` within the same feature.
- **Routes are re-exports**: `export { HomeScreen as default } from '@/features/home/home-screen';` — logic lives in the feature.
- **TDD**: write the failing test first, see it fail, then the implementation. Tests sit next to the file under test.
- **Quality**: every function CRAP < 10, no duplication >= 0.8, no surviving mutants in the code you changed (`s-expo-mode`).
- **Styling** is Tailwind classes via `className`. Add design tokens to `@theme` in `src/global.css`, never as inline hex.
- **User-facing strings** go through `translate('key')` and must exist in every file under `src/translations/`. `en-us.json` is the reference locale.
- **Never edit `ios/` or `android/`** — they are generated. Use Expo config plugins in `app.config.ts`.
- **Declare every package you import**, even when `node-linker=hoisted` makes a transitive one resolve.
- **Never report a check as passing unless you ran it** — a green `tsc` on code the bundler rejects proves nothing.
- **Git**: branch from `main` (`feat/…`, `fix/…`, `chore/…`, `docs/…`, `refactor/…`, `test/…`, `ci/…`). Conventional Commits, enforced by commitlint. Changes reach `main` only through a pull request. Never `--no-verify`.

## Commands

```bash
pnpm start / ios / android    # run
pnpm lint / type-check / test # individual gates
pnpm test:hooks               # harness hook rules (node --test)
pnpm check-all                # all merge gates + translation lint + hook tests
pnpm quality                  # CRAP (with coverage) + duplication over src/
pnpm quality:mutate <file>    # mutation testing for the files you changed
pnpm harness:score            # harness maturity (harness-score)
pnpm e2e-test                 # maestro
./node_modules/.bin/jest <path> --forceExit   # one test file while iterating
```

## Agent harness

Built with [revfactory/harness](https://github.com/revfactory/harness) and [unclebob/ub-mode](https://github.com/unclebob/ub-mode); full description in [`docs/harness.md`](docs/harness.md).

**Trigger:** any code change (feature, fix, refactor) goes through the `s-expo-dev` skill. Quick questions and one-line edits can be answered directly, still under `s-expo-mode`.

| Skill | Use for |
| --- | --- |
| `s-expo-dev` | orchestrates a change: plan → test-first build → gates → review → memory → commit |
| `s-expo-mode` | the engineering discipline every code edit follows (adapted ub-mode) |
| `s-expo-quality-gates` | running and reading check-all, crapper, dryer, mutator |
| `s-expo-new-feature` | scaffolding a feature folder the project way |
| `s-expo-release` | cutting a release through the GitHub Actions chain |
| `s-expo-upgrade-sdk` | moving to the next Expo SDK |
| `s-expo-maestro-flow` | writing or fixing an E2E flow |
| `s-expo-memory` | reading and writing `docs/memory/` |
| `s-expo-harness` | auditing or extending the harness itself |
| `s-expo-evolve` | turning repeated corrections into harness changes |

| Agent (`.claude/agents/`) | Role | Model |
| --- | --- | --- |
| `s-expo-planner` | read-only: classify, map files, first failing test, units | opus |
| `s-expo-builder` | writes code test-first under `s-expo-mode` | opus |
| `s-expo-quality` | runs gates, reports numbers, never edits | sonnet |
| `s-expo-reviewer` | read-only diff review: correctness, conventions, gates | opus |
| `s-expo-docs-keeper` | updates `docs/memory/` and stale docs | sonnet |

Hooks (`.claude/settings.json`, Claude Code; Codex reads the same events): a **gate** blocks force-pushing `main`, `--no-verify`, recursive deletes of root/home/project, production EAS builds and submissions, and edits to `ios/`, `android/`, real `.env` files, the lockfile, generated `.d.ts` and `tools/`; a **feedback** hook runs `eslint --fix` on every edited file. Agents without hooks must follow the same rules by hand.

**Harness change history:**

| Date | Change | Target | Reason |
| --- | --- | --- | --- |
| 2026-11-16 | Harness built: 5 agents, 10 skills, 7 scoped rules, gate + lint hooks, `docs/memory/`, quality tools, harness-score in CI | all | keep full project context in the repo for short, multi-model sessions |

## Known rough edges

- Running Jest on a single file can hang after the tests pass (open handles from MMKV/i18n). Pass `--forceExit` for single-file runs; the full `pnpm test` run exits on its own.
- `uniwind-types.d.ts` is regenerated by Uniwind on every Metro run and is ESLint-ignored on purpose — formatting it only fights the generator.
- `app.config.ts` carries a real `EXPO_ACCOUNT_OWNER` and `EAS_PROJECT_ID` (`@tiagoolivv/s-expo`). `eas init` cannot write them itself — a dynamic config is read-only to the CLI, so it prints the id and stops.
- EAS runs no tests: `maestro_test` is a paid job type and there is no `.eas/` directory. E2E lives in `e2e-android.yml` on GitHub Actions.
- EAS Build cannot see local `.env` files. `EXPO_PUBLIC_API_URL` is set per environment with `eas env:set`, and `prebuild` aborts without it.
- **`expo prebuild` fails intermittently on Linux** — about one run in four — with `Could not find MIME for Buffer <null>`, a race inside `app-icon-badge`. Both CI call sites retry three times. macOS has never shown it.
- Every CI job runs on `ubuntu-latest`. Never introduce a macOS runner: it bills ten times as much on a private repository, and `macOS-latest` is arm64, where `api-level: 29` has no emulator image.
- The `accessibilityLabel` strings in `preferences-bar.tsx` stay hardcoded in English. The Maestro flows read them to work out the current theme and language.
- `@tanstack/react-form`, `@tanstack/zod-form-adapter` and `react-query-kit` are installed but currently unused; they are the intended libraries for forms and query hooks. `docs/reference/removed-patterns.md` holds the working code that used them.
- The quality tools need Python 3.11+; macOS ships 3.9 as `python3`. `brew install python@3.12` — `scripts/quality.sh` finds it.

## Documentation

- Seeding a new project from this template: [`docs/guides/start-a-new-project.md`](docs/guides/start-a-new-project.md).
- Worked example of a change: [`docs/guides/add-a-feature.md`](docs/guides/add-a-feature.md). Index of everything else: [`docs/README.md`](docs/README.md).
- MCP servers worth having (the Expo one especially — SDK breaking changes are not in any model's training data): [`docs/ai-tooling.md`](docs/ai-tooling.md).

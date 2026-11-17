# Work log

One entry per change that went through the harness, newest first: date · type · what · why. Detail lives in the commits and the pull request; this is the index a new session skims.

- **2026-11-17** · chore(deps) · Expo SDK 58 (RN 0.88.1, React 19.3.0, Jest 30): navigation imports moved to `expo-router`, test wrapper removed, `web.output: 'single'`, Uniwind 1.13.2, MMKV 4.3.2 + Nitro 0.35, `@types/jest` exclusion dropped; RNTL 14 left for its own change.
- **2026-11-17** · ci · explicit `permissions:` on test, e2e-android, e2e-android-eas-build, eas-build-qa and eas-build-prod (closes 7 CodeQL `missing-workflow-permissions` alerts); `test.yml` gets `pull-requests: write`, so the coverage comment posts instead of failing with 403; the e2e APK URL input reaches `wget` through `env`, not shell interpolation.
- **2026-11-16** · fix(deps) · `axios` 1.21.1, `zod` 4.6.7, and 29 same-major `pnpm.overrides` for vulnerable tooling packages · Dependabot could not patch transitive dependencies on its own.
- **2026-11-16** · release · **v0.2.0** (minor) · tool-neutral harness and five required checks; tag, GitHub release and EAS QA build fired from the PR merge.
- **2026-11-16** · refactor · harness moved to `.agents/` with `.claude/` as a per-item link adapter; agents name a tier (`deep`/`standard`) instead of a model; `GEMINI.md` removed · work the same in any tool and survive model changes.
- **2026-11-16** · docs(ci) · `main` ruleset requires Lint TS, Type Check, Tests, Quality and Harness · a gate that can be skipped drifts.
- **2026-11-16** · fix · gate hook judges each command of a shell chain on its own · it blocked a commit + push + `gh pr create --base main` chain as a force-push.
- **2026-11-16** · release · **v0.1.0** (minor) · agent harness, quality tools, lib fixes, SDK 57 patches.
- **2026-11-16** · chore · aligned SDK 57 patch versions (`expo` 57.0.33, `react-native` 0.86.3, …) and excluded the now-unmaintained `react-native-edge-to-edge` from expo-doctor · Expo Doctor failed on every PR touching `package.json`, the release PR included.
- **2026-11-16** · chore · added the agent harness: `AGENTS.md`, `s-expo-*` agents, skills, scoped rules, gate and lint hooks, `docs/memory/`, vendored crapper/dryer/mutator, harness-score in CI · so every session and every model starts with the project's context and quality bar.

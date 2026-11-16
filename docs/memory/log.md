# Work log

One entry per change that went through the harness, newest first: date · type · what · why. Detail lives in the commits and the pull request; this is the index a new session skims.

- **2026-11-16** · release · **v0.2.0** (minor) · tool-neutral harness and five required checks; tag, GitHub release and EAS QA build fired from the PR merge.
- **2026-11-16** · refactor · harness moved to `.agents/` with `.claude/` as a per-item link adapter; agents name a tier (`deep`/`standard`) instead of a model; `GEMINI.md` removed · work the same in any tool and survive model changes.
- **2026-11-16** · docs(ci) · `main` ruleset requires Lint TS, Type Check, Tests, Quality and Harness · a gate that can be skipped drifts.
- **2026-11-16** · fix · gate hook judges each command of a shell chain on its own · it blocked a commit + push + `gh pr create --base main` chain as a force-push.
- **2026-11-16** · release · **v0.1.0** (minor) · agent harness, quality tools, lib fixes, SDK 57 patches.
- **2026-11-16** · chore · aligned SDK 57 patch versions (`expo` 57.0.33, `react-native` 0.86.3, …) and excluded the now-unmaintained `react-native-edge-to-edge` from expo-doctor · Expo Doctor failed on every PR touching `package.json`, the release PR included.
- **2026-11-16** · chore · added the agent harness: `AGENTS.md`, `s-expo-*` agents, skills, scoped rules, gate and lint hooks, `docs/memory/`, vendored crapper/dryer/mutator, harness-score in CI · so every session and every model starts with the project's context and quality bar.

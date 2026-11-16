# Work log

One entry per change that went through the harness, newest first: date · type · what · why. Detail lives in the commits and the pull request; this is the index a new session skims.

- **2026-11-16** · chore · aligned SDK 57 patch versions (`expo` 57.0.33, `react-native` 0.86.3, …) and excluded the now-unmaintained `react-native-edge-to-edge` from expo-doctor · Expo Doctor failed on every PR touching `package.json`, the release PR included.
- **2026-11-16** · chore · added the agent harness: `AGENTS.md`, `s-expo-*` agents, skills, scoped rules, gate and lint hooks, `docs/memory/`, vendored crapper/dryer/mutator, harness-score in CI · so every session and every model starts with the project's context and quality bar.

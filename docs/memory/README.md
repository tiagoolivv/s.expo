# Project memory

What a new session — any person, any AI tool, any model — should know before touching this repository, and did not learn from `AGENTS.md`. Committed so it travels with the code. How to read and write it: [`.agents/skills/s-expo-memory/SKILL.md`](../../.agents/skills/s-expo-memory/SKILL.md).

| File | What is in it |
| --- | --- |
| [glossary.md](./glossary.md) | terms this codebase uses with a specific meaning |
| [decisions.md](./decisions.md) | choices that could be undone, and why they were made |
| [lessons.md](./lessons.md) | non-obvious failures and their fixes |
| [log.md](./log.md) | one line per change, newest first |

## Read before starting

- **Uniwind, not NativeWind.** Most Tailwind-for-RN advice online is NativeWind and is wrong here — [decision](./decisions.md#uniwind-not-nativewind).
- **ESLint is also the formatter.** No Prettier; the edit hook runs `eslint --fix` — [decision](./decisions.md#eslint-stylistic-is-the-formatter).
- **Quality gates go beyond CI.** CRAP < 10, duplication < 0.8, no surviving mutants — run with `pnpm quality` and `pnpm quality:mutate <file>` — [decision](./decisions.md#ub-mode-quality-gates).
- **Changes reach `main` only through a pull request**, releases included — [lesson](./lessons.md#a-release-that-pushes-to-main-leaves-an-orphan-tag).
- **`GITHUB_TOKEN` never triggers another workflow** — the release chain needs `GH_TOKEN` — [lesson](./lessons.md#nothing-done-with-github_token-triggers-another-workflow).
- **The agent harness** (agents, skills, rules, hooks) is described in [docs/harness.md](../harness.md); change it with the `s-expo-harness` / `s-expo-evolve` skills.

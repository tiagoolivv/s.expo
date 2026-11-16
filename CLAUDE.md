@AGENTS.md

# Claude Code adapter

`AGENTS.md` (imported above) holds everything, for every tool. This file only says how Claude Code loads it.

- `.claude/skills`, `.claude/agents` and `.claude/rules` are links into `.agents/`, so skills load from their descriptions or by name (`/s-expo-dev`), agents run as subagents (`subagent_type: "s-expo-planner"`), and rules load for files matching their `paths:`.
- An agent's `tier` maps to its `model:` field: `deep` → `inherit` (the session model), `standard` → `sonnet`. If a model alias stops resolving, change that one word to `inherit`.
- `.claude/settings.json` wires the hooks in `.agents/hooks/`. A gate block reads `s-expo guard: blocked. <reason>` — take the supported path it names. The lint hook may report ESLint errors after an edit; fix them before moving on.
- Per-user auto memory is for personal preferences. Facts about this project go to `docs/memory/`, where every tool reads them.

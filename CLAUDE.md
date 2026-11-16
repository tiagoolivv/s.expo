@AGENTS.md

# Claude Code specifics

Everything about the project is in `AGENTS.md` (imported above) so every tool reads the same instructions. Only what is particular to Claude Code lives here.

- **Skills** in `.claude/skills/` load on their own from their descriptions, or by name (`/s-expo-dev`, `/s-expo-mode`, …).
- **Subagents** in `.claude/agents/` are called with `subagent_type: "s-expo-planner"` etc. The `s-expo-dev` skill says when.
- **Rules** in `.claude/rules/` load automatically for files matching their `paths:`.
- **Hooks** in `.claude/settings.json`: the gate hook may block a command or edit with `s-expo guard: blocked. <reason>` — take the supported path it names instead of working around it. The lint hook may report ESLint errors after an edit; fix them before moving on.
- Your per-user auto memory is for personal preferences. Facts about this project go to `docs/memory/` so other tools and models see them too.

---
name: s-expo-harness
description: Audit, extend or redesign s-expo's agent harness — the agents in .agents/agents, skills in .agents/skills, scoped rules in .agents/rules, hooks in .agents/hooks and their tool adapters, AGENTS.md and docs/memory — and measure it with harness-score. Use when asked to "add an agent", "create a skill", "add a rule", "add a hook", "audit the harness", "harness score", "sync agents and skills", "is the harness up to date", or to build a new team for a new kind of work. For feeding back lessons from using the harness, use s-expo-evolve.
---

# s-expo-harness — the harness factory

Adapted from [revfactory/harness](https://github.com/revfactory/harness) v2 (Apache-2.0), rewritten in English for this project and trimmed to what a solo, multi-model workflow needs. Our harness is described for humans in [`docs/harness.md`](../../../docs/harness.md).

## Principles
1. **Agents say who, skills say how.** An agent file (`.agents/agents/s-expo-*.md`) is a role: tools, model, inputs, outputs. A skill (`.agents/skills/s-expo-*/SKILL.md`) is a procedure. Do not mix them.
2. **Pick the execution mode from the shape of the work**, not team size: deterministic list or loop → a scripted workflow; specialists that must keep context and negotiate → persistent named agents; results only → one-shot subagents. `s-expo-dev` uses one-shot subagents. See [references/execution-modes.md](references/execution-modes.md).
3. **Pick a tier per agent from the work**, not its importance: `deep` for design, code and cross-checking; `standard` for procedural runs and structured writing. Never name a vendor's model in an agent — tools map tiers to their own models (see "Model tiers" in `AGENTS.md`); the Claude Code mapping lives in the `model:` field only. Leave a one-line comment with the reason.
4. **Everything portable.** The harness lives in `.agents/` as plain Markdown any model can read; `AGENTS.md` is the entry point. Tool folders (`.claude/`, `.github/prompts/`) are thin adapters that link or point into `.agents/` — never put content only there.
5. **`AGENTS.md` holds the trigger and change history only** for the harness — the details live in the skills.
6. **Name everything `s-expo-*`**, kebab-case, so it is clear what belongs to this project.

## Phase 0 — audit (always first)
1. List `.agents/agents/`, `.agents/skills/`, `.agents/rules/`, `.agents/hooks/`, the adapters (`CLAUDE.md`, `.claude/settings.json` and links, `.github/prompts/`).
2. Compare with the harness table in `AGENTS.md` and `docs/harness.md`. Any agent or skill missing from either, or listed but missing on disk, is drift.
3. `pnpm harness:score` — record the level and score; list failed checks.
4. `pnpm test:hooks` — hook rules still hold.
5. Decide the path: **extend** (add an agent/skill/rule), **maintain** (fix drift), or **redesign** (change the team). Tell the user the plan before writing.

## Adding an agent
- Check for overlap first: if an existing `s-expo-*` agent covers 70% of the role, extend it instead.
- Frontmatter: `name`, `description` (what + when to delegate), `tools` (read-only roles get no Edit/Write), `tier` with a reason comment, the Claude `model:` mapping of that tier, `skills` it should preload.
- Body: role, inputs, output artifact (`_workspace/{phase}_{agent}_{artifact}.md`), rules, error handling, a five-line report.
- Link it for Claude Code: `ln -s ../../.agents/agents/<name>.md .claude/agents/<name>.md` (same pattern for skills and rules). `pnpm test:hooks` fails until the link exists.
- Wire it into the orchestrator (`s-expo-dev` or a new one) and into the tables in `AGENTS.md` and `docs/harness.md`.

## Adding a skill
- Check for overlap with existing skills first.
- `description` is the trigger: what it does, when to use it with real phrasings (including follow-ups like "redo", "only the X part"), and when **not** to. 40+ characters, "Use when …".
- Body under 500 lines; explain *why* behind each rule; link to `docs/` instead of copying it (two copies drift). Long material goes to `references/`.
- Repeated deterministic work goes to a script (`scripts/` or the skill's own `scripts/`).
- Add a `.github/prompts/s-expo-<name>.prompt.md` entry point when it is something a human triggers on purpose.
- Writing guide: [references/skill-writing.md](references/skill-writing.md).

## Adding a rule
`.agents/rules/s-expo-<area>.md` with `paths:` frontmatter globs so it only loads for matching files. One area per file, under 60 lines, non-negotiables only — procedures belong in skills.

## Adding a hook
Logic in a pure module with `node --test` tests under `.agents/hooks/`; a thin stdin wrapper; registration in each tool adapter that supports hooks (today `.claude/settings.json`), plus the rule in the Guardrails list of `AGENTS.md` for tools without hooks. A gate hook (PreToolUse) blocks with exit 2 and a reason; a feedback hook (PostToolUse) reports with exit 2. Hooks must fail open on bad input.

## Verify (every change)
- Frontmatter has `name` and `description`; names referenced across files match.
- `pnpm test:hooks`, `pnpm lint`, `pnpm harness:score` (no regression).
- Trigger check for a new or changed skill: write 3 requests that should load it and 3 near-misses that should not, and confirm the descriptions separate them.
- Add a row to the harness change history in `AGENTS.md`.

## Never
- Create `.claude/commands/` (skills are invocable directly; human entry points go to `.github/prompts/`).
- Name a vendor model in an agent, or pin every agent to the top model.
- Duplicate a convention from `docs/` into a skill body.

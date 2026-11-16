# The agent harness

An AI coding agent is a model plus a **harness**: the context, procedures, guardrails and sensors around it. The model is rented and changes — you switch tools when one hits a usage limit. The harness lives in this repository, so every clone, tool and model gets the same one.

The goal is short conversations. Anything you would otherwise re-explain in chat is written down here once.

```mermaid
flowchart LR
    A["AGENTS.md<br/>entry point"] --> M["docs/memory/<br/>decisions · lessons · glossary · log"]
    A --> S["skills<br/>.claude/skills/s-expo-*"]
    A --> R["rules<br/>.claude/rules/ (path-scoped)"]
    S --> AG["agents<br/>.claude/agents/s-expo-*"]
    AG --> H{{"hooks<br/>gate · lint-on-edit"}}
    AG --> G["gates<br/>check-all · CRAP · dry · mutation"]
    G --> HS["harness-score<br/>L4 in CI"]
```

## Layers

| Layer | Where | What it does | Read by |
| --- | --- | --- | --- |
| Entry point | `AGENTS.md` | stack, structure, rules, commands, the skill/agent tables, harness change history | every tool; `CLAUDE.md` and `GEMINI.md` import it |
| Memory | `docs/memory/` | decisions with reasons, non-obvious failures, domain terms, a work log | any agent at session start (`s-expo-memory`) |
| Skills | `.claude/skills/s-expo-*/SKILL.md` (also `.agents/skills/`) | procedures: how to do a kind of work | loaded on demand by Claude Code, Codex, OpenCode…; plain Markdown for the rest |
| Agents | `.claude/agents/s-expo-*.md` | roles: who does a phase, with which tools and model | Claude Code subagents; a role prompt for any other model |
| Rules | `.claude/rules/s-expo-*.md` | non-negotiables, loaded only for files matching `paths:` | Claude Code automatically; others via `AGENTS.md` |
| Hooks | `.claude/hooks/`, `.claude/settings.json` | a gate that blocks irreversible or guardrail-skipping actions; `eslint --fix` after each edit | Claude Code (and tools that read the same events) |
| Entry prompts | `.github/prompts/s-expo-*.prompt.md` | one-click entry points into the main skills | GitHub Copilot, VS Code |
| Gates | `pnpm check-all`, `pnpm quality`, `pnpm quality:mutate` | deterministic answers to "is it right?" | agents and CI |
| Measurement | `pnpm harness:score`, `harness.yml` | the harness's own maturity, gated at L4 | CI |
| MCP | `.mcp.json` | the Expo MCP server, for SDK docs no model was trained on | Claude Code (asks once to approve) |

## How a change flows

The `s-expo-dev` skill runs a change as a pipeline with a producer–reviewer loop, one subagent per phase:

| Phase | Agent | Writes |
| --- | --- | --- |
| 0 context | main thread | reads memory, classifies the change, branches |
| 1 plan | `s-expo-planner` (opus, read-only) | `_workspace/01_planner_plan.md` |
| 2 build | `s-expo-builder` (opus) | code + `_workspace/02_builder_log.md` |
| 3 gates | `s-expo-quality` (sonnet, read-only) | `_workspace/03_quality_report.md` |
| 4 review | `s-expo-reviewer` (opus, read-only) | `_workspace/04_reviewer_findings.md` |
| 5 record | `s-expo-docs-keeper` (sonnet) | `docs/memory/*` |
| 6 commit | main thread | Conventional Commits, PR on request |

Build ↔ review loops at most twice. `_workspace/` is git-ignored and kept after a run, so "continue" or "fix the findings" resumes instead of restarting.

Models are chosen per role — opus where judgment matters, sonnet where the work is procedural — not pinned to the top tier everywhere.

## Using it from different tools

| Tool | What happens |
| --- | --- |
| Claude Code | reads `CLAUDE.md` → `AGENTS.md`; skills, subagents, path rules, hooks and `.mcp.json` all work natively |
| Codex CLI | reads `AGENTS.md`; skills from `.agents/skills/`; run the `s-expo-dev` phases yourself |
| Gemini CLI | reads `GEMINI.md` → `AGENTS.md`; open the skill file the table names |
| Cursor / Windsurf / Cline | read `AGENTS.md`; point the agent at the skill file for the task |
| GitHub Copilot | reads `AGENTS.md`; `.github/prompts/` gives `/s-expo-dev`, `/s-expo-review`, `/s-expo-quality`, `/s-expo-release`, `/s-expo-evolve` |

Without hooks, the gate rules still apply — they are listed in `AGENTS.md` — but nothing enforces them mechanically. The CI gates catch what slips through.

A good opening message in any tool is one line: *"Follow AGENTS.md. Task: …"*.

## The quality layer

Lint, types and tests say the code is not broken. The quality layer, from [unclebob/ub-mode](https://github.com/unclebob/ub-mode), says it is easy to change:

| Tool | Measures | Threshold | Command |
| --- | --- | --- | --- |
| crapper | CRAP = CC² × (1 − coverage)³ + CC, per function | < 10 | `pnpm quality:crap` |
| dryer | structural similarity between functions | < 0.8 | `pnpm quality:dry` |
| mutator | whether tests notice a changed operator | no survivors | `pnpm quality:mutate <file>` |

They are Python 3.11+ tools vendored verbatim in `tools/` (see [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md)); `scripts/quality.sh` finds a suitable Python, builds a virtualenv per tool on first use, and turns each threshold into an exit code. Reports land in `.metrics/` (git-ignored).

When the layer was introduced it found five functions over CRAP 10, one duplicated pair and three surviving mutants in `src/lib/` — two of them dead code. All were fixed test-first in the same change.

## Measuring the harness

[harness-score](https://github.com/paladini/harness-score) scans the repository — files only, no LLM, no network — and rates it L0–L4 across context, skills, hooks, sensors, CI and hygiene. `pnpm harness:score` runs it locally; `harness.yml` fails a pull request that drops the repository below L4.

| | Before | After |
| --- | --- | --- |
| Level | L0 · Unharnessed | L4 · Self-correcting |
| Score | 51 / 105 | 105 / 105 |

`.harness-score.json` switches off one check, `SNS-04` (formatter configured): the scanner recognises Prettier and Biome, not ESLint Stylistic, which is this project's formatter. Adding Prettier only to satisfy it would contradict the project's own rule. Remove the override if the scanner learns to detect ESLint Stylistic.

## Changing the harness

- **Add or change** an agent, skill, rule or hook → `s-expo-harness` skill. It audits first, checks for overlap, and verifies with hook tests, lint and harness-score.
- **Feed back** a correction you had to make by hand → `s-expo-evolve`. It generalises the correction into a principle and records it in the change history in `AGENTS.md`.
- Every name is `s-expo-*`. `pnpm rename` leaves those names alone when this template seeds another app (it only matches `s-expo` as a whole word), so the harness keeps working; rename them deliberately with `s-expo-harness` if you want your own prefix. Keep the details in the skills; `AGENTS.md` carries only the tables, the trigger and the change history.

## Credits

The method comes from [revfactory/harness](https://github.com/revfactory/harness) (Apache-2.0), the engineering discipline from [unclebob/ub-mode](https://github.com/unclebob/ub-mode) (MIT), the quality tools from [unclebob/crapper](https://github.com/unclebob/crapper), [dryer](https://github.com/unclebob/dryer) and [mutator](https://github.com/unclebob/mutator) (0BSD), and the measurement from [paladini/harness-score](https://github.com/paladini/harness-score) (MIT). Everything here is adapted and renamed for this project; the originals are linked in [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md).

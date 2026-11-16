---
name: s-expo-evolve
description: Evolve s-expo's harness from experience — collect what went wrong or was repeated while using the agents and skills, generalise it into a principle, apply it to the right agent, skill, rule or hook, and record the change history. Use when asked "evolve the harness", "retrospective", "the agent keeps doing X", "apply this feedback to the harness", "lessons learned", or when the same correction has been given twice. Adding brand-new agents or redesigning the team belongs to s-expo-harness.
---

# s-expo-evolve

Adapted from revfactory/harness v2 `evolve` (Apache-2.0). The harness is not a fixed artifact: every correction you had to give by hand is a defect in it. This skill turns those corrections into durable changes so the next session — on any model — starts better.

## Phase 1 — collect the delta
1. Read `AGENTS.md` (harness change history), `.agents/agents/`, `.agents/skills/`, `.agents/rules/`.
2. `git log --oneline -- .agents .claude AGENTS.md docs/memory` — what changed since the harness was built, and why.
3. If `_workspace/` exists, check the last run left the artifacts the orchestrator promises, in the format the skills ask for. Missing artifacts mean a phase was skipped.
4. Ask the user what to improve — unless they already said. Without feedback, still propose changes when you see:
   - the same correction twice;
   - an agent failing or retrying for the same cause;
   - work done by hand that the orchestrator should have handled (its description probably does not trigger).

## Phase 2 — map feedback to its target

| Feedback type | Change |
| --- | --- |
| output quality | the skill the agent follows |
| role missing or overlapping | the agent file (new agent → s-expo-harness) |
| wrong order of work | the orchestrator (`s-expo-dev`) |
| skill not loading | the skill `description` |
| a rule broken repeatedly | a `.agents/rules/` file, or a gate hook if it must be impossible |
| something learned about the project, not the harness | `docs/memory/` (s-expo-memory) |
| too slow / too many tokens | orchestrator scale, model choice |

## Phase 3 — generalise, then apply
- Find *why* it happened and fix that, not the single instance. "The summary was long" → the skill has no length guidance → add a principle with its reason.
- Write the reason next to the change.
- One change at a time; verify each before the next.
- If a change reverses an earlier one in the history, show both to the user and find the rule that satisfies both.
- Keep the language of the file you edit (this harness is English).

## Phase 4 — record and verify
1. Add a row to the harness change history in `AGENTS.md`: date, change, target, reason.
2. Frontmatter valid, cross-references match, `pnpm test:hooks` and `pnpm lint` green.
3. Changed a description? Run 3 should-trigger and 3 near-miss phrasings past it.
4. `pnpm harness:score` — no regression.

## Phase 5 — report
The delta found, what changed and the principle behind it, feedback deliberately not applied and why, what should improve next run.

# Execution modes and team patterns

Condensed from revfactory/harness v2 (`references/execution-modes.md`, `team-patterns.md`), Apache-2.0.

## Three modes

| Mode | Primitive | Fits when |
| --- | --- | --- |
| Scripted workflow | a deterministic script calling agents (`pipeline`, `parallel`, schemas) | the list of items, the checks and the loop limits can be written as code; dozens of calls; structured results |
| Persistent agents | named agents + messages + a shared task list | specialists must keep context across turns, negotiate, or edit the same artifact iteratively |
| One-shot subagents | one `Agent` call per task, parallel in one message | no agent needs to talk to another; only the result matters |

Decide in that order. Mixed modes are fine — label the mode on each phase of the orchestrator.

## Six team patterns

| Pattern | Shape | Use |
| --- | --- | --- |
| Pipeline | A → B → C | each step needs the previous output (`s-expo-dev`) |
| Fan-out / fan-in | split → N parallel → merge | independent perspectives on one input (e.g. review by security / performance / conventions) |
| Expert pool | router → one specialist | input type decides the specialist |
| Producer–reviewer | build ↔ review, max 2–3 loops | objective acceptance criteria exist (`s-expo-builder` ↔ `s-expo-reviewer`) |
| Supervisor | lead reassigns work as it progresses | work volume is only known at run time |
| Hierarchical | lead → leads → workers, max two levels | the problem splits naturally into sub-problems |

## Quality patterns

- **Adversarial verification** — N independent verifiers per finding; keep it only when a majority confirms with evidence.
- **Judge panel** — N independent drafts, judged in parallel, best one refined.
- **Loop until dry** — keep searching until K consecutive rounds find nothing new.
- **Completeness critic** — a final agent that only looks for what is missing.

## Scale

Small (< 10 tasks): 2–3 agents. Medium (10–20): 3–5. Large: a supervisor plus 3–5 workers. Every extra agent is coordination cost — start small.

## Errors

Retry once; then continue without the result and say so. Do not retry rate-limit, auth or permission failures. Never invent an agent's judgment to fill a gap. Keep conflicting results with their source.

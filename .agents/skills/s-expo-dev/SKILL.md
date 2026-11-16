---
name: s-expo-dev
description: Orchestrates any code change in s-expo end to end — classify, plan, test-first build, quality gates, review, record memory, commit — using the s-expo-planner, s-expo-builder, s-expo-quality, s-expo-reviewer and s-expo-docs-keeper agents. Use when asked to implement a feature, fix a bug, refactor, "build X", "add a screen", "change the app", and for follow-ups like "redo the review", "rerun the gates", "continue where we stopped", "fix what the reviewer found". Skip it for one-line edits, questions, docs-only or CI-only changes — do those inline with s-expo-mode.
---

# s-expo-dev — the change orchestrator

Harness pattern: **pipeline with a producer–reviewer loop** (from [revfactory/harness](https://github.com/revfactory/harness)). Execution mode: **sub-agent delegation** — each phase is one agent call that returns a result and writes its artifact to `_workspace/`. No agent needs to talk to another, so nothing heavier is justified.

```
0 context → 1 plan → 2 build (TDD) → 3 gates → 4 review ─┐
                         ▲                                │ findings (max 2 loops)
                         └────────────────────────────────┘
                                   → 5 record memory → 6 commit / PR
```

## Phase 0 — context (main thread)

1. Read `docs/memory/README.md` and the entries it points to that touch this area.
2. Check `_workspace/`:
   - absent → fresh run.
   - present and the request continues it ("continue", "fix the findings") → resume at the first phase whose artifact is missing or stale.
   - present but the request is new → move it to `_workspace_<YYYYMMDD-HHMM>/` and start fresh.
3. Classify the change with `docs/workflow.md` §1 (`feat|fix|refactor|test|chore|docs|ci`). More than one type → split it, one branch each.
4. Make sure you are on a branch named `<type>/<kebab-description>` cut from an up-to-date `main`.

## Phase 1 — plan · `s-expo-planner`

Input: the request, the type, relevant memory. Output: `_workspace/01_planner_plan.md` — files to touch, the first failing test, the units in order, risks. The main thread shows the plan to the user when the change is a `feat` or touches more than one layer; otherwise proceed.

## Phase 2 — build · `s-expo-builder`

Input: the plan. One call per unit, in order. Each unit: failing test → seen failing → smallest code → green → refactor. Output: code + `_workspace/02_builder_log.md` (what, why, the test that proved it).

## Phase 3 — gates · `s-expo-quality`

Input: changed files. Runs `pnpm check-all`, `pnpm quality`, and mutation on the changed source files. Output: `_workspace/03_quality_report.md` with numbers. Any failing gate goes back to Phase 2 as a finding.

## Phase 4 — review · `s-expo-reviewer`

Input: `git diff main...HEAD`, the plan, the quality report. Output: `_workspace/04_reviewer_findings.md`, each finding `path:line — severity — problem — fix`. Blocking findings go back to Phase 2. **At most two build↔review loops**; after that, stop and show the user what remains.

## Phase 5 — record · `s-expo-docs-keeper`

Input: the log and findings. Adds new glossary terms, decisions and lessons to `docs/memory/`, appends to `docs/memory/log.md`, and updates any `docs/` page the change made false.

## Phase 6 — commit / PR (main thread)

Small ordered Conventional Commits whose body says why and how it was proven. Push and open the pull request only when the user asked for it. Never `--no-verify`.

## Data passing

Files in `_workspace/` named `{phase}_{agent}_{artifact}.md`. The read-only agents (planner, quality, reviewer) have no write tool on purpose: they return the artifact as their final message and the main thread saves it. They are git-ignored and kept after the run so the work can be audited or resumed. Agents return a five-line summary; the detail stays in the file, so the main thread stays small.

## Errors

- An agent fails once → retry once with the error in the prompt. Fails again → continue without it and name the gap in the final report.
- Rate limit, auth or permission errors → do not retry; check what the partial artifact actually contains, write what is missing to `_workspace/`, tell the user (with the reset time for a rate limit).
- Never fill a missing agent judgment by guessing. Only facts you verified go into an artifact on its behalf.
- Conflicting results are kept with their source, not deleted.

## Without subagents

The phases are plain procedure. In any tool without subagents, run them yourself in order, reading `.agents/agents/<name>.md` as the role for that phase and writing the same `_workspace/` files. The output and the gates are the same.

## Test scenarios

- **Normal**: "add a profile screen with a title" → plan names `profile-screen.test.tsx` first; builder sees it fail on the missing module; gates green; reviewer finds nothing blocking; memory gains nothing or a glossary term; one `feat(profile)` commit.
- **Error**: quality reports `CRAP 32` on a new function → Phase 2 splits the decision into a pure function with tests → gates rerun green → review passes. If still failing after two loops, the run stops and reports the function and its score.

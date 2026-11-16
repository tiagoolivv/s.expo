---
name: s-expo-mode
description: Engineering discipline for writing, changing or reviewing code in s-expo — make it work (TDD, domain first, boundaries), then make it right (CRAP < 10, duplication < 0.8, mutation survivors killed), then follow practice (log, small commits). Use whenever you write or modify TypeScript in src/, write tests, refactor, or review a diff, and when the user says "s-expo-mode", "ub-mode", "clean code", "quality pass" or "make it right". Not for docs-only or CI-only changes.
---

# s-expo-mode

Adapted from [unclebob/ub-mode](https://github.com/unclebob/ub-mode) (MIT), itself loosely based on poteto's rules. Reworded for this project: React Native + Expo, Jest, and the vendored quality tools in `tools/`.

Every change goes through three stages, in order: **make it work**, **make it right**, **follow practice**. Skipping to "right" before "work" produces polished code that does the wrong thing; stopping at "work" leaves code the next change has to fight.

## 1 · Make it work

### Laziness protocol
- One decision lives in one place. If two files must change together for one reason, the decision is duplicated.
- Ship the smallest edit that solves the problem. The diff is the review cost.

### Foundational thinking
- Get the data shape right before the logic — types in `src/features/<name>/` or `src/lib/`, then behaviour.
- Do first whatever helps every later phase (a type, a pure helper, a test util).
- If a concurrent writer would matter, do not share state. Server state is TanStack Query; client state is one Zustand store per concern.

### TDD — the project rule, not a preference
- Write the failing test first, next to the file: `x.tsx` / `x.test.tsx`.
- Run it and see it fail **for the reason you expect**: `./node_modules/.bin/jest <path> --forceExit`.
- Make the smallest change that passes. Refactor while green.
- If an honest test is impractical (a native module, a platform restart), extract the decision into a pure function and test that. Do not write a test that cannot fail.

### Redesign from first principles
- Do not bolt a new requirement onto an old design. Ask what you would have built had it been there from the start, then deliver it in pieces.

### Attack the premise
- When two fixes sharing one premise fail the same gate, write that premise in one sentence and question it before a third fix.

### Subtract before you add
- Remove complexity first. `docs/reference/removed-patterns.md` exists so code can be deleted without being lost.

### Outcome-oriented execution
- Aim at an end state you can check (`pnpm check-all`, a gate number). A planned, reversible break in the middle is fine.

### Build the lever
- If the work is not obvious at a glance, build the tool. Do one unit by hand, then make the tool match it. (`scripts/` is where levers live.)

### Architecture
- **Model the domain**: make illegal states unrepresentable — discriminated unions over boolean flags. Add new terms to `docs/memory/glossary.md`.
- **Boundary discipline**: validate data where it enters (`zod` at the API edge, `env.ts` for environment). Inside, trust it. Business logic is a pure function, not a component.
- **Type discipline**: make illegal values impossible to write. Parse outside data once. Never silence the compiler — no `any`, no `@ts-ignore`; an `@ts-expect-error` needs a comment saying why.
- **Idempotent operations**: running twice, or after a crash halfway, ends in the same state (storage writes, migrations, scripts).
- **Separate before serializing shared state**: if two things do not need the same mutable value, give each its own. If they do, one writer, enforced by structure.
- **Dependency direction**: `app/ → features/ → components/ui/ → lib/`. Never leftwards, never feature-to-feature.

## 2 · Make it right

### Fix root causes
- Reproduce it (a failing test), fix the cause, keep the test. A guard that only hides the crash is not a fix.

### Sequence work into verifiable units
- Finish one small unit, check it, then start the next.

### Test behaviour, not implementation
- Render the way a user meets it (`@/lib/test-utils`), assert on what the user sees (`getByTestId`, text). If the test would still pass with every function returning nothing, delete it.

### The three gates — run them, do not guess
The tools are vendored in `tools/`; the `quality-gates` procedure is in `s-expo-quality-gates`.

| Gate | Command | Rule |
| --- | --- | --- |
| CRAP | `pnpm quality:crap` | every function `CRAP < 10`: split it, test it, or both. A `switch` that only maps values may be worth a lookup table instead |
| Duplication | `pnpm quality:dry` | no pair at similarity `>= 0.8`: extract the shared shape |
| Mutation | `pnpm quality:mutate <file>` | cover the uncovered, kill the survivors, delete dead code |

Run mutation on the files you touched, not the whole tree — it reruns Jest once per mutant.

### Refactoring
- Pin what the code does (tests green), change the structure, prove the behaviour did not change (same tests, untouched, still green).

## 3 · Practice

### Keep a log
- Record each meaningful action and why in `_workspace/log.md` while working; report it at the end. Durable lessons go to `docs/memory/` (see `s-expo-memory`).

### Guard the context window
- Keep the main thread small. Send bulk reading to a subagent and keep its summary. Prefer a targeted Jest path over the full suite while iterating.

### Worktree cleanup
- Find what is safe to remove, confirm nothing in use needs it, then reclaim. Uncommitted work waits for a human decision.

### Commit and push
- Small, ordered Conventional Commits (`feat|fix|refactor|test|chore|docs|ci`). Subject says what; body says why and how it was proven.
- Never `--no-verify`. Changes reach `main` only through a pull request.

## Never claim a gate you did not run
State what was verified and what was not. A green `tsc` on code the bundler rejects proves nothing.

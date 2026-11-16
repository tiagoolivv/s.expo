---
name: s-expo-quality-gates
description: Run and interpret s-expo's quality gates — lint, type-check, Jest, CRAP scores (crapper), structural duplication (dryer) and mutation testing (mutator) from the vendored tools/ folder. Use before opening a pull request, after a refactor, when asked "is it clean?", "run the gates", "check CRAP", "find duplication", "mutation test this file", or when a quality CI job fails. Not for writing the code itself (use s-expo-mode / s-expo-dev).
---

# s-expo quality gates

Two layers. The first is what CI already blocks on; the second is the ub-mode "make it right" layer from unclebob's tools, vendored under `tools/`.

## Layer 1 — the merge gates

```bash
pnpm check-all     # eslint + tsc + translation lint + jest + hook tests
```

A failure here blocks the pull request. Fix before anything else.

## Layer 2 — crapper, dryer, mutator

All three need Python 3.11+. `scripts/quality.sh` finds one (macOS ships 3.9 as `python3`; `brew install python@3.12` if none), builds `tools/<tool>/.venv` on first run, and fails the command when a threshold is crossed. Reports go to `.metrics/` (git-ignored).

| Command | Tool | Fails when | Exit |
| --- | --- | --- | --- |
| `pnpm quality:crap` | crapper | any function in `src/` has CRAP > 10 | 2 |
| `pnpm quality:dry` | dryer | any pair of functions is >= 0.8 similar | 3 |
| `pnpm quality:mutate src/path/file.ts` | mutator | a mutant survives (tests still pass after a code change) | 3 |
| `pnpm quality` | crap + dry | either fails | — |

`quality:crap` runs `pnpm coverage` (Jest with an LCOV reporter) first, so its numbers include coverage. Append `--use-existing-coverage` (`sh scripts/quality.sh crap src --use-existing-coverage`) to reuse `coverage/lcov.info`, or `--no-coverage` for complexity only.

### Reading CRAP

`CRAP = CC² × (1 − coverage)³ + CC`. A function with complexity 6 and 10% coverage scores 32. Two ways down, usually both:
1. **Test it** — coverage drives the cubic term toward zero; a fully covered function scores exactly its complexity.
2. **Split it** — pull the decision into a small pure function (`toggle-preferences.ts` is the house example) and test that directly.

### Reading duplication

`DUPLICATE score=1.00` with two line ranges means the two functions have the same structure once names and literals are normalised away. Extract the shared shape into one function the two call. Do not "fix" it by renaming — dryer ignores names.

### Reading mutation

- `killed` — a test failed when the code changed. Good.
- `survived` — the code changed and every test still passed. Either a test is missing an assertion, or the code is dead. Add the assertion or delete the code.
- `uncovered` — no test reaches that line. Cover it first; mutator does not run uncovered sites.

Mutation reruns Jest once per mutant: always pass the file(s) you changed. `--scan` lists sites without running anything.

## Reporting

Report numbers, not adjectives: worst CRAP and its function, duplicate pairs, killed/survived per file. Say which gates you did **not** run.

## Updating the tools

`tools/` is a verbatim copy of upstream at the commits recorded in `THIRD_PARTY_NOTICES.md`; the gate hook blocks edits there. To update, re-copy from upstream and bump the recorded commit.

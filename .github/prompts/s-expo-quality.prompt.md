---
mode: agent
description: Run s-expo quality gates (check-all, CRAP, duplication, mutation) and report the numbers.
---

Follow `.claude/skills/s-expo-quality-gates/SKILL.md` as `.claude/agents/s-expo-quality.md`: run `pnpm check-all`, `pnpm quality`, and `pnpm quality:mutate <file>` for each changed source file. Report numbers, and name any gate you could not run.

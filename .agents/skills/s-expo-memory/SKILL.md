---
name: s-expo-memory
description: Read and write s-expo's in-repo project memory (docs/memory/) — glossary, decisions, lessons, work log — so any session, in any tool and on any model, starts with the project's context instead of a long chat. Use at the start of a session or task to load context, and when asked "remember this", "record the decision", "what did we decide about X", "why is it like this", "add a lesson", "update memory", or at the end of a change (Phase 5 of s-expo-dev).
---

# s-expo memory

Chat history is lost when a conversation ends or the model changes. `docs/memory/` is the part of that history worth keeping, committed with the code so it travels to every clone, tool and model.

## Layout

| File | Holds | Write when |
| --- | --- | --- |
| `docs/memory/README.md` | the index: one line per entry worth knowing before starting work | an entry is important enough that every session should see it |
| `docs/memory/glossary.md` | domain terms and what they mean in this code | a new concept gets a name in code |
| `docs/memory/decisions.md` | choices that could reasonably be undone, with the reason | you chose between real alternatives |
| `docs/memory/lessons.md` | things that failed in a non-obvious way, and the fix | something cost more than ten minutes to understand |
| `docs/memory/log.md` | one dated line per merged change: what and why | every change that went through s-expo-dev |

## Reading (session start)

1. `AGENTS.md` is already loaded in most tools. Read `docs/memory/README.md` next — it is short on purpose.
2. Open a topic file only when the task touches it: `grep -n "<term>" docs/memory/*.md` beats reading everything.

## Writing

- **Dates are absolute** (`2026-11-16`), never "yesterday".
- **Say why.** A decision without its reason gets reverted by the next reader.
- **One fact, one place.** If `docs/` already explains it, link there. If a memory entry becomes a rule everyone must follow, promote it to `AGENTS.md` or a `.agents/rules/` file and leave a link behind.
- **Correct, do not append contradictions.** When an entry turns out wrong, edit or delete it.
- **Never store secrets**, tokens, personal data or the content of `.env` files.
- Keep each entry to a few lines. Memory is scanned, not studied.

## Entry formats

```markdown
## 2026-11-16 · Uniwind, not NativeWind
**Context:** … **Decision:** … **Why:** … **Revisit if:** …
```

```markdown
## Symptom: `Could not find MIME for Buffer <null>` on prebuild (Linux)
**Cause:** … **Fix:** … **Seen:** 2026-05-02
```

## Relation to tool-specific memory

Some tools keep their own per-user memory outside the repository. Use that for personal preferences only; put anything about **this project** here, where every tool, model and teammate can read it.

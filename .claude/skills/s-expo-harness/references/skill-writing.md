# Writing skills that trigger and hold up

Condensed from revfactory/harness v2 (`skill-writing-guide.md`, `skill-testing-guide.md`), Apache-2.0.

## Progressive disclosure

| Layer | Loaded | Budget |
| --- | --- | --- |
| `name` + `description` | always, for every skill | ~100 words |
| `SKILL.md` body | when the skill triggers | < 500 lines |
| `references/` | when the body says to read one | unlimited; add a table of contents past 300 lines |
| `scripts/` | executed, not read | unlimited |

## The description is the trigger

Bad: `"Handles releases."`
Good: `"Cut an s-expo release through the GitHub Actions chain … Use when asked to 'release', 'bump the version' … Production builds are out of scope."`

Include: what it does, the phrasings that should load it (including follow-ups — "redo", "only the X part", "continue"), and the closest thing it is **not** for.

## Body

- Explain why before the rule; a reader who knows the reason handles the edge case.
- Generalise from principles; do not add one rule per past incident.
- Pick one imperative voice and keep it.
- Link to the one place a convention lives instead of copying it.
- If every run rewrites the same helper, ship it as a script.

## Testing

1. Write 2–3 realistic requests; run with the skill and without it; compare.
2. Trigger check: 10 phrasings that should load it, 10 near-misses that should not. A near-miss is close in wording but belongs to another skill — that is what tests the boundary.
3. Fix with principles, rerun, stop when changes stop helping.

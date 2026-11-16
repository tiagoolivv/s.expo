# Third-party notices

Work this repository builds on, what was taken, and under which license. The repository itself is MIT ([LICENSE](./LICENSE)).

| Project | Used for | How | License | Upstream commit |
| --- | --- | --- | --- | --- |
| [obytes/react-native-template-obytes](https://github.com/obytes/react-native-template-obytes) | the starter this template was derived from (v9.0.0) | adapted | MIT, © 2021 Obytes | — |
| [revfactory/harness](https://github.com/revfactory/harness) | the harness method: team patterns, execution modes, skill writing, evolve loop | adapted and translated into `.claude/skills/s-expo-harness`, `s-expo-evolve`, `s-expo-dev` | Apache-2.0 | `92d9f1b` |
| [unclebob/ub-mode](https://github.com/unclebob/ub-mode) | engineering principles for writing and reviewing code | adapted into `.claude/skills/s-expo-mode` | MIT, © 2026 Robert C. Martin | `3da62bf` |
| [unclebob/crapper](https://github.com/unclebob/crapper) | CRAP score per function | vendored verbatim in `tools/crapper` | 0BSD, © 2026 Robert C. Martin | `c757ec7` |
| [unclebob/dryer](https://github.com/unclebob/dryer) | structural duplication finder | vendored verbatim in `tools/dryer` | 0BSD, © 2026 Robert C. Martin | `66ff6d2` |
| [unclebob/mutator](https://github.com/unclebob/mutator) | mutation testing | vendored verbatim in `tools/mutator` | 0BSD, © 2026 Robert C. Martin | `830ec7e` |
| [paladini/harness-score](https://github.com/paladini/harness-score) | measuring harness maturity | run with `npx harness-score@1.10.0`; not vendored | MIT, © 2026 Fernando Paladini | `0bd25db` (v1.10.0) |

## Changes to Apache-2.0 material

The `s-expo-harness`, `s-expo-evolve` and `s-expo-dev` skills are derivative works of revfactory/harness v2. They were translated from Korean into English, condensed, renamed with the `s-expo-` prefix, and rewritten around this project's agents, gates and file layout. The original is available at the commit above under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Vendored tools

`tools/crapper`, `tools/dryer` and `tools/mutator` are unmodified copies of upstream, each with its own `LICENSE`. The gate hook blocks agent edits there; to update one, copy the new upstream commit over it and change the commit in the table.

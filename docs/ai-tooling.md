# MCP servers and skills

This template is meant to be worked on with an AI agent. Two mechanisms make that work better, and they solve different problems.

| | What it is | Solves |
| --- | --- | --- |
| **MCP server** | a process the agent talks to over a protocol, exposing tools and data | the agent cannot *know* your build status, your docs for a library released last month, or your open pull requests |
| **Skill** | a folder with a `SKILL.md` the agent loads on demand | the agent does not *know how you work* — your conventions, your review checklist, your release steps |

The short version: **an MCP brings in facts the model does not have; a skill brings in procedure the model would otherwise invent.** Reach for an MCP when the answer changes over time. Reach for a skill when the answer is a repeatable process.

## MCP servers worth having here

### Expo — official, and the one that matters most

```bash
claude mcp add --transport http expo https://mcp.expo.dev/mcp
```

Free plan, OAuth-backed. It gives the agent current SDK documentation, project diagnostics, EAS build status, EAS Workflow validation, and store review data.

This one earned its place during the SDK 54 to 57 upgrade in this repository. The migration that broke the build — expo-router dropping React Navigation in SDK 56 — is documented on a page no model trained before it can know about. The agent read the guide, applied the exact import mapping, and the bundle went green. Guessing would have cost hours.

Docs: [docs.expo.dev/mcp](https://docs.expo.dev/mcp/)

### Uniwind — styling answers that do not apply to NativeWind

Uniwind publishes a documentation MCP and an [`llms.txt`](https://docs.uniwind.dev/llms.txt) index. Check [docs.uniwind.dev](https://docs.uniwind.dev/) for the current endpoint.

Worth having because this project uses **Uniwind, not NativeWind**, and most Tailwind-for-React-Native answers on the internet are about NativeWind. They look right and are wrong here — different theming model, Metro transformer instead of a Babel plugin, no `ThemeProvider`. An agent without this server will confidently apply NativeWind advice.

### Context7 — documentation for any library

Fetches current docs for a named library. Useful for the parts of the stack Expo does not cover: TanStack Query, Zustand, Zod, i18next, Maestro. See [context7.com](https://context7.com/) for setup.

### GitHub — pull requests and CI without leaving the session

Lets the agent read pull requests, review comments and workflow results. The `gh` CLI covers the same ground if it is already authenticated, and is often simpler.

### What is deliberately not here

**No MCP that writes code for you.** Several exist that generate React Native components or scaffold features. They do not know this project's dependency rule, its no-barrel rule, or that routes are one-line re-exports, so what they produce has to be rewritten to fit. The conventions in [`workflow.md`](./workflow.md) are the input an agent needs — not a generator.

## Skills worth writing for this project

A skill is a folder under `.claude/skills/<name>/` containing a `SKILL.md`: YAML frontmatter with `name` and `description`, then the instructions. Project skills live in the repository and travel with it; personal ones live in `~/.claude/skills/`.

**The description is the trigger.** It is what the agent matches against the task, so it has to say what the skill does *and when to use it*. A vague description means the skill is never loaded, which is indistinguishable from not having written it.

This template ships its own, all prefixed `s-expo-`, as part of the agent harness described in [`harness.md`](./harness.md). The four this page used to recommend writing now exist — `s-expo-new-feature`, `s-expo-upgrade-sdk`, `s-expo-release` and `s-expo-maestro-flow` — next to the orchestrator `s-expo-dev`, the engineering discipline `s-expo-mode`, the quality gates, project memory, and the skills that maintain the harness itself. The full table is in [`AGENTS.md`](../AGENTS.md#agent-harness).

They keep the body short and link out to the `docs/` file rather than duplicating it. Two copies of a convention drift apart, and the one the agent reads will be the stale one.

The Expo MCP server is declared in `.mcp.json` at the repository root, so Claude Code offers to enable it on first use instead of each person adding it by hand.

## Rules for using either

**An MCP answer is evidence, not authority.** It can be out of date, or right about a different version. When it matters, check it against this repository: the installed version, the actual file, the real output.

**Neither replaces the conventions.** An agent with every MCP in the world will still write a cross-feature import unless [`workflow.md`](./workflow.md) and [`architecture/overview.md`](./architecture/overview.md) are in front of it. That is why `AGENTS.md` at the repository root — which `CLAUDE.md` and `GEMINI.md` import — points at those first.

**Never report a check you did not run.** An MCP saying a build succeeded is not the same as `pnpm check-all` passing, and `tsc` passing is not the same as the bundle building. Both distinctions have already bitten this repository — see the note at the end of [`workflow.md`](./workflow.md).

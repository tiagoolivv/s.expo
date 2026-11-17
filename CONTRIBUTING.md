# Contributing

Thanks for helping. `s-expo` is a template, so the bar for a change is: will every project seeded from it want this? Bug fixes, upgrades, better defaults and clearer docs usually qualify; features specific to one app usually do not — open an issue first if you are unsure.

## Before you start

- **Bugs and ideas:** open an issue using the [issue template](./.github/ISSUE_TEMPLATE.md). Search first; someone may have reported it.
- **Security problems:** never in a public issue. Follow [SECURITY.md](./SECURITY.md).
- **Questions about how something works:** the [`docs/`](./docs/README.md) folder and [`docs/memory/`](./docs/memory/README.md) explain most decisions and why they were made.

## Set up

You need Node.js 22.13+ (or 24+), pnpm (the repository enforces it), and Xcode or Android Studio to run the app. Expo Go is not supported — the app runs in a development build.

```bash
pnpm install
pnpm env:use development   # copies .env.development.example onto .env.local
pnpm start                 # dev server
pnpm ios                   # or: pnpm android
```

No `.env` file is ever committed. See [docs/guides/environment.md](./docs/guides/environment.md).

## Making a change

The full loop is in [docs/workflow.md](./docs/workflow.md). In short:

1. **Branch from an up-to-date `main`**, named `<type>/<short-kebab-description>` — `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`, `test/`, `ci/`.
2. **Test first.** Write the failing test, see it fail for the right reason, then write the code. Tests sit next to the file they cover.
3. **Follow the project rules** in [AGENTS.md](./AGENTS.md#rules): dependency direction `app/ → features/ → components/ui/ → lib/`, routes as one-line re-exports, no barrels inside a feature, Tailwind classes through Uniwind, every user-facing string translated in every locale.
4. **Keep it clean:** every function CRAP < 10, no duplication ≥ 0.8, no surviving mutants in what you changed.
5. **Verify before committing:**

   ```bash
   pnpm check-all                  # lint, types, translations, tests, hook tests
   pnpm quality                    # CRAP + duplication
   pnpm quality:mutate <file>      # mutation testing on the files you changed
   ```

   Add or upgrade Expo-managed packages with `pnpm expo install <package>`, never `pnpm add`, and run `pnpm dlx expo-doctor@latest` afterwards.

6. **Commit with [Conventional Commits](https://www.conventionalcommits.org/)** — commitlint enforces them. The subject says what changes; the body says why. The git hooks run the branch-name check, `eslint --fix`, `tsc` and commitlint: never skip them with `--no-verify`.
7. **Open a pull request to `main`** using the [pull request template](./.github/PULL_REQUEST_TEMPLATE.md). Say why, and what you decided not to do.

## What a pull request needs to merge

`main` is protected. A pull request merges only when these checks pass:

| Check | What it runs |
| --- | --- |
| Lint TS | ESLint (formatting included — there is no Prettier) |
| Type Check | `tsc` |
| Tests | Jest, with a coverage comment on the pull request |
| Quality | CRAP scores and duplication |
| Harness | the agent-harness hook tests and `harness-score` |

CodeQL and Expo Doctor also run and should be green. End-to-end tests (Maestro) are not part of the gate; run `pnpm e2e-test`, or the `e2e-android` workflow, when a change touches navigation or startup.

Releases are cut by the maintainers through the release workflow — do not bump `package.json`'s version in a pull request. See [docs/ci/workflows.md](./docs/ci/workflows.md).

## Working with an AI agent

Agents are welcome here, and the repository is set up for them: [AGENTS.md](./AGENTS.md) is the entry point for any tool or model, and the `s-expo-*` skills in `.agents/skills/` describe how to plan, build, verify and record a change. You are responsible for what you submit, however it was written: run the checks yourself and read the diff before opening the pull request.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE) that covers this project.

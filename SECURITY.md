# Security policy

## Supported versions

`s-expo` is a template: projects copy it and move on. Security fixes land on `main` and ship in the next release. Only the latest release is supported.

| Version | Supported |
| --- | --- |
| Latest release (`main`) | yes |
| Any earlier release | no — update to the latest |

If you seeded a project from an older release, compare it against the latest one and apply the fix yourself; there is no back-porting.

## Reporting a vulnerability

**Do not open a public issue, discussion or pull request for a vulnerability.**

Report it privately through GitHub: open the [**Security** tab of this repository](https://github.com/tiagoolivv/s.expo/security) and choose **Report a vulnerability**, or go straight to [the private report form](https://github.com/tiagoolivv/s.expo/security/advisories/new). Only the maintainers can see it.

A useful report has:

- what the problem is and what an attacker gains from it;
- the file, workflow or configuration involved, and the release or commit you looked at;
- steps to reproduce, or a proof of concept;
- how you would fix it, if you have an idea.

### What happens next

1. We aim to acknowledge the report within **7 days**.
2. We confirm the problem, decide its severity, and agree a timeline with you. Most fixes should ship within **30 days** of confirmation.
3. The fix is developed in a private fork through a GitHub Security Advisory, released, and then the advisory is published — with credit to you, unless you prefer otherwise.

Please give us that time before talking about it publicly. This is a volunteer-run project, so these are targets, not guarantees.

## Scope

**In scope** — anything this repository ships or runs:

- the app code in `src/` and its configuration (`app.config.ts`, `env.ts`, config plugins);
- the GitHub Actions workflows and composite actions in `.github/`;
- the agent harness: hooks in `.agents/hooks/`, the guardrails in `AGENTS.md`, and the Claude Code adapter in `.claude/`;
- the build, release and EAS configuration.

**Out of scope:**

- **Vulnerabilities in a dependency.** Report them to that project. Dependabot already tracks known advisories here; how this repository patches transitive packages is in [`docs/memory/decisions.md`](./docs/memory/decisions.md).
- The example API the template calls (`api.github.com`), and Expo, EAS or GitHub services themselves.
- Issues that need a rooted or jailbroken device, physical access to an unlocked device, or a malicious build installed by the user.
- Values in `EXPO_PUBLIC_*` variables. They are inlined into the app bundle by design and must never hold secrets — that is documented, not a vulnerability. A real secret that *was* committed or bundled is in scope.

## What the repository already does

- **Dependabot alerts** and security updates, with same-major `pnpm.overrides` for transitive packages Dependabot cannot patch.
- **CodeQL** code scanning on every pull request (JavaScript/TypeScript, Python and Actions).
- **Least-privilege workflows:** every workflow declares its `GITHUB_TOKEN` permissions, and untrusted input never reaches a shell script through `${{ }}` interpolation.
- **Protected `main`:** changes arrive only through pull requests that pass lint, type-check, tests, quality and harness checks.
- **No secrets in the repository:** `.env` files are git-ignored, only `*.example` files are committed, and EAS reads its values from `eas env`.
- **Agent guardrails:** the hooks in `.agents/hooks/` block force-pushes to `main`, skipped git hooks, production builds and edits to secret or generated files.

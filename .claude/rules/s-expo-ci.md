---
description: GitHub Actions, EAS and native configuration rules.
paths:
  - ".github/**"
  - "eas.json"
  - "app.config.ts"
  - "env.ts"
---

# CI, EAS and native config

- Every job runs on `ubuntu-latest`. Never a macOS runner (10x cost on a private repo; arm64 has no api-level 29 emulator).
- A step that must trigger another workflow uses `secrets.GH_TOKEN`; `GITHUB_TOKEN` never triggers workflows.
- Never edit `ios/` or `android/` — they are generated. Native changes go through config plugins in `app.config.ts`.
- `EXPO_PUBLIC_*` values are inlined in the bundle: never a secret. EAS builds cannot see local `.env` files; use `eas env:set`.
- `expo prebuild` call sites in CI retry three times (Linux race in `app-icon-badge`).
- Production EAS builds and store submissions stay manual. See `docs/ci/workflows.md`.

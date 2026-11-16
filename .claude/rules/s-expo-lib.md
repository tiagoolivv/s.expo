---
description: Infrastructure layer rules for src/lib.
paths:
  - "src/lib/**"
---

# lib/

- `lib/` is the bottom layer: it never imports from `features/`, `components/ui/` or `app/`.
- Validate outside data at the boundary (API responses with `zod`, environment in `env.ts`); inside, trust the types.
- No `any`, no `@ts-ignore`. An `@ts-expect-error` carries a comment saying why.
- Storage goes through `lib/storage.tsx` (MMKV). Keys are constants, not string literals scattered around.
- Every package imported here is declared in `package.json` — `node-linker=hoisted` hides undeclared ones until they break.

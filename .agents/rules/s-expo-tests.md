---
description: How unit tests are written and run.
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "jest.config.js"
  - "jest-setup.ts"
---

# Tests

- Written **before** the code and **seen failing** for the expected reason. For a bug, the test reproduces it first.
- Render through `@/lib/test-utils`; assert what the user sees (`getByTestId`, text), not internals.
- If the test would still pass with every function returning nothing, it is not a test.
- Mock the module boundary (`@/lib/api`), never the network. Native mocks live in `__mocks__/` and `jest-setup.ts`.
- Single file: `./node_modules/.bin/jest <path> --forceExit` (it can hang without `--forceExit`).
- Surviving mutants (`pnpm quality:mutate <file>`) mean a missing assertion. See `docs/testing/unit.md`.

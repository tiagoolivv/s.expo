---
description: Non-negotiables for feature folders — structure, imports, tests beside files.
paths:
  - "src/features/**"
---

# Features

- A feature is `src/features/<name>/`: `<name>-screen.tsx`, optional `components/`, `api.ts`, `use-<name>-store.tsx`, tests beside the files they cover.
- **Never import another feature.** Shared code moves up to `src/lib/` or `src/components/ui/`.
- **No `index.ts` barrel** inside a feature — it widens the Fast Refresh boundary. Import files directly.
- Relative imports (`./`) within the feature; `@/…` across folders.
- Pure decisions (next value, formatting, validation) go in a plain `.ts` module tested without rendering — `toggle-preferences.ts` is the model.
- Server state: TanStack Query in `api.ts`. Client state that outlives the screen: one Zustand store.
- Test first: `./node_modules/.bin/jest src/features/<name> --forceExit`, seen failing before the code exists.
- Keep every function under CRAP 10 (`pnpm quality:crap`). See `docs/guides/add-a-feature.md`.

---
name: s-expo-new-feature
description: Scaffold a new feature folder in s-expo the project way — test first, <name>-screen.tsx, one-line route re-export, translations in every locale, optional api.ts query and use-<name>-store.tsx. Use when asked to "add a screen", "create a feature", "new page", "scaffold <name>", or when s-expo-planner plans a new feature folder. For changes inside an existing feature, use s-expo-dev directly.
---

# New feature

Full worked example: [`docs/guides/add-a-feature.md`](../../../docs/guides/add-a-feature.md). This is the order and the checks; read the guide for the code.

## Order
1. Branch: `git checkout main && git pull && git checkout -b feat/<name>`.
2. `src/features/<name>/<name>-screen.test.tsx` — render with `@/lib/test-utils`, assert a `testID` (`<name>-title`). Run `./node_modules/.bin/jest src/features/<name> --forceExit` and **see it fail** on the missing module.
3. `src/features/<name>/<name>-screen.tsx` — named export `<Name>Screen`, UI from `@/components/ui`, text via `translate('<name>.title')`.
4. Add the key to **every** file in `src/translations/`, keys sorted ascending. `pnpm lint:translations` compares each to `en-us.json`.
5. Route: `src/app/<name>.tsx` → `export { <Name>Screen as default } from '@/features/<name>/<name>-screen';` — nothing else.
6. Data only if needed: `src/features/<name>/api.ts` with `react-query-kit` `createQuery`; test by mocking `@/lib/api`, never the network.
7. Client state only if it outlives the screen: `use-<name>-store.tsx` with Zustand + `createSelectors`.
8. `pnpm check-all`, then `pnpm quality`.

## Checks
- [ ] test written first and seen failing
- [ ] file names kebab-case; screen is `<name>-screen.tsx`, named export
- [ ] route is a one-line re-export
- [ ] no import from another feature; no `index.ts` barrel in the feature
- [ ] every string translated in every locale
- [ ] colours are `@theme` tokens, never inline hex
- [ ] new packages declared in `package.json`
- [ ] new domain term added to `docs/memory/glossary.md`

Working code for forms, queries and stores that were removed from the template lives in [`docs/reference/removed-patterns.md`](../../../docs/reference/removed-patterns.md) — copy it back rather than rewriting.

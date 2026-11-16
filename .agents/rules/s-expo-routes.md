---
description: Expo Router route files are one-line re-exports.
paths:
  - "src/app/**"
---

# Routes

- A route is exactly one line: `export { XScreen as default } from '@/features/x/x-screen';`
- No logic, state, styling or hooks in `src/app/` — the URL tree must be reorganisable without touching a screen.
- `_layout.tsx` holds the single Stack and providers only.
- Import navigation APIs from `expo-router/react-navigation`, never `@react-navigation/*` (the SDK 56+ bundler rejects it).

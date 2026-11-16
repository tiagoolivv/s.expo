---
description: Design-system rules for src/components/ui and all styling.
paths:
  - "src/components/ui/**"
  - "src/global.css"
  - "src/**/*.tsx"
---

# UI and styling

- Style with `className` (Uniwind + Tailwind 4). **This is Uniwind, not NativeWind** — no `ThemeProvider`, no Babel plugin, theme in CSS.
- Colours and spacing are tokens in `@theme` in `src/global.css`. Never an inline hex.
- `className` only reaches native for components imported from `react-native`. Re-exporting a third-party component? Wrap it in `withUniwind` (see `safe-area-view.tsx`).
- `src/components/ui/` wraps primitives; features import from `@/components/ui`, never from `react-native` UI packages directly.
- Every user-facing string goes through `translate('key')`. The `accessibilityLabel`s in `preferences-bar.tsx` are the exception — Maestro reads them, they stay English.
- See `docs/design-system/theming.md`.

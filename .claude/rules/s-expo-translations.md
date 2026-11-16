---
description: Translation file rules.
paths:
  - "src/translations/**"
---

# Translations

- `en-us.json` is the reference. Every key exists in **every** locale file (`i18n-json/identical-keys`).
- Keys sorted ascending; `pnpm lint:translations` fixes order and fails on missing keys.
- Interpolation uses i18next syntax, validated by `scripts/i18next-syntax-validation.js`.
- `en-US` is the default language; `pt-BR` the alternative.

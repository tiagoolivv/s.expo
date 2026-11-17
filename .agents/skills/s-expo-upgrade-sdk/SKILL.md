---
name: s-expo-upgrade-sdk
description: Upgrade s-expo to the next Expo SDK in the strict order that worked before — changelogs for every skipped SDK, clean start, expo install --fix, expo-doctor until clean, peers Expo does not manage, type-check then bundle, check-all, prebuild. Use when asked to "upgrade Expo", "move to SDK 58", "bump expo", "expo-doctor fails after an upgrade". Not for bumping a single non-Expo library.
---

# Upgrade the Expo SDK

The procedure is [`docs/guides/upgrading-sdk.md`](../../../docs/guides/upgrading-sdk.md). Each step's output is the next step's input, so do not reorder.

1. **Changelogs** for every SDK skipped, not only the target (`expo.dev/changelog/sdk-<N>`), plus the router migration guide (`docs.expo.dev/router/migrate/sdk-<from>-to-<to>/`). Use the Expo MCP server or `docs.expo.dev/llms.txt` (`docs/ai-tooling.md`) — SDK breaking changes post-date any model's training data. Do not guess an API. Expo's own `expo-upgrade` skill (official plugin) is a useful second checklist; where it differs from this one, this one wins.
2. **Clean start**: `git checkout -b chore/upgrade-sdk-<N>` from `main`, then `pnpm check-all` green before touching anything.
3. **Bump**: `pnpm expo install expo@^<N>.0.0` then `pnpm expo install --fix`.
4. **Doctor**: `pnpm dlx expo-doctor@latest` until every check passes. Exclusions go to `expo.install.exclude` in `package.json`, with a reason in the PR.
5. **Peers Expo does not own**: Uniwind, Zustand, TanStack, worklets/reanimated pairs. Compare versions by hand; read install warnings.
6. **Type-check, then bundle**: `pnpm type-check`, `pnpm expo export --platform ios`, `pnpm expo export --platform android`. The bundle is the real test.
7. **Everything**: `pnpm check-all`, `pnpm quality`.
8. **Native**: `pnpm prebuild --clean` and a device build.
9. Record what broke in `docs/memory/lessons.md` and update the SDK numbers in `AGENTS.md` and `README.md`.

Never edit `ios/` or `android/` to make it build — fix it in `app.config.ts` with a config plugin.

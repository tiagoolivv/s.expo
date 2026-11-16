---
name: s-expo-maestro-flow
description: Write or fix a Maestro end-to-end flow for s-expo in .maestro/app/ — testID targets, ${APP_ID}, normalising persisted MMKV state without clearState, asserting accessibilityLabels instead of collapsed children. Use when asked to "add an e2e test", "write a Maestro flow", "the e2e is flaky", "cover this screen end to end". Not for Jest unit tests.
---

# Maestro flow

Reference: [`docs/testing/e2e.md`](../../../docs/testing/e2e.md). Flows live in `.maestro/app/` and are listed in `.maestro/config.yaml`.

## Rules, each learned the hard way
- Start with `appId: ${APP_ID}` and build the **development** variant; a `preview` build fails with an unrelated launch error.
- Target `testID`s (`id:`), never visible text — text changes with the device locale.
- Never `clearState: true` on a dev build: it wipes the dev client's server URL and the app opens the launcher. Normalise state with a conditional `runFlow` on the toggle's `accessibilityLabel`, and restore what you found at the end.
- A `Pressable` with an `accessibilityLabel` collapses its children on iOS — assert the label, not the emoji or text inside.
- Content below the fold needs `scrollUntilVisible`, not `assertVisible`.
- The `accessibilityLabel`s in `preferences-bar.tsx` stay in English; flows depend on them.
- `maestro hierarchy` against the booted app settles what a flow can actually see.

## Run
`pnpm e2e-test` needs a JVM, the app installed on a simulator/emulator, and exactly one booted device. E2E is not a merge gate; CI runs it only by hand (`e2e-android.yml`). Say in the PR whether you ran it.

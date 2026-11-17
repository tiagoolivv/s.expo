# TypeScript

The project runs TypeScript 6 in `strict` mode with `checkJs` on. `pnpm type-check` is `tsc --noemit` and is a required check in CI.

## Rules

**No `any`.** When a type is genuinely unknown, use `unknown` and narrow it. `any` disables checking for everything downstream of it, which is the opposite of what it looks like it is doing.

**Derive types, do not restate them.** A Zod schema is the source of truth and the type comes out of it:

```ts
const schema = z.object({ email: z.string().email() });
export type FormType = z.infer<typeof schema>;
```

Two declarations of the same shape drift apart. One does not.

**Type the boundary, infer the rest.** Annotate function parameters, public return types and API payloads. Let inference handle local variables.

**Prefer `type` over `interface`.** `ts/consistent-type-definitions` enforces it. Declaration merging is a footgun in application code.

**Import types with `import type`.** It makes the erasure explicit and avoids pulling a runtime module in for a type alone.

## Things this project does on purpose

`compilerOptions.types` names `jest` explicitly. TypeScript 6 no longer picks up every `@types/*` package automatically, and without this line every `describe` and `expect` in the repository is an error. If you add another package whose types are global rather than imported, add it to that array.

`@types/jest` is on 30, matching both Jest 30 and the `ts6.0` dist-tag of `@types/jest`. Until SDK 57 it sat in `expo.install.exclude`, because `expo-doctor` expected the Jest 29 types; SDK 58 moved to Jest 30 and no longer pins it, so the exclusion is gone.

`baseUrl` is deliberately absent. It is deprecated and stops working in TypeScript 7, and a `tsconfig` error takes the path mappings down with it — which shows up as every `@/…` import going red in the editor while `pnpm type-check` still passes.

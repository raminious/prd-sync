<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Start here

Read `PROGRESS.md` before you work. It records what is built, why each decision was made, how to
check a change, and what is not done. Update it when the state changes.

## Writing

Write in ASD-STE100. This applies to docs, UI text, and messages to the user.

## Code

This is a prototype. Keep it small: no new dependency and no new abstraction without a present
need.

- **One exported component per file:** `src/components/<Name>/index.tsx`. A `Props` interface
  stays private in the file that uses it. `src/components/ui/**` is shadcn output and is exempt.
- **One exported function per util file:** `src/utils/<domain>/<function-name>.ts` in kebab-case,
  named after the function. Import with the full path, `@/utils/prds/get-prd`. No barrel files.
- **One server action per file** in `src/actions/`. Each action checks the sign-in itself.
- **Booleans start with `is`:** `isMinor`, `isPending`. Not `has` or `can`.
- **Comments:** one line, and only where the reason is not obvious. No JSDoc blocks.

Before you say that a change is done, run `npm test`, `npm run lint`, and `npx tsc --noEmit`.

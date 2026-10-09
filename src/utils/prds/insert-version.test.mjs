import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

// Node does not know the "@/" alias from tsconfig.json
registerHooks({
  resolve: (specifier, context, nextResolve) =>
    nextResolve(
      specifier.startsWith("@/")
        ? new URL(`../../${specifier.slice(2)}.ts`, import.meta.url).href
        : specifier,
      context,
    ),
});

process.env.DATABASE_PATH = ":memory:";
const { getPrd } = await import("./get-prd.ts");
const { insertPrd } = await import("./insert-prd.ts");
const { insertVersion } = await import("./insert-version.ts");

test("a save adds a version and rejects a stale or empty change", () => {
  insertPrd({ slug: "demo", title: "Demo", content: "one\n", author: "A" });
  const prd = getPrd("demo");
  assert.equal(prd.latestVersion, 1);

  const change = { summary: "s", author: "A", isMinor: false };
  assert.deepEqual(insertVersion(prd.id, { ...change, content: "two\n", baseVersion: 1 }), {
    status: "saved",
    number: 2,
  });
  assert.deepEqual(insertVersion(prd.id, { ...change, content: "three\n", baseVersion: 1 }), {
    status: "conflict",
    latest: 2,
  });
  assert.deepEqual(insertVersion(prd.id, { ...change, content: "two\n", baseVersion: 2 }), {
    status: "unchanged",
  });
  assert.equal(getPrd("demo").latestVersion, 2);
});

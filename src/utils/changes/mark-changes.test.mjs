import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

const { markChanges } = await import("./mark-changes.ts");
const { rehypeChangeMarks } = await import("./rehype-change-marks.ts");

// the class names are the look, not the logic
const render = (markdown) =>
  renderToStaticMarkup(
    createElement(
      ReactMarkdown,
      { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeChangeMarks] },
      markdown,
    ),
  ).replace(/ class="[^"]*"/g, "");
const changes = (previous, current) => render(markChanges(previous, current));

test("the changes between two versions are marked in the rendered Markdown", () => {
  const list = "## Rules\n\n1. one\n2. two\n";
  assert.equal(changes(list, list), render(list));

  // a new list item stays a list item, and bold text that ends with a period stays bold
  assert.match(
    changes(list, `${list}3. **three.**\n`),
    /<li>two<\/li>\s*<li><strong><ins>three\.<\/ins><\/strong><\/li>/,
  );
  // a removed line stays in the text
  assert.match(changes(list, "## Rules\n\n1. one\n"), /<li>one<\/li>\s*<li><del>two<\/del><\/li>/);
  // a new number for the same text is not a change
  assert.equal(changes("1. one\n2. two\n", "1. one\n3. two\n"), render("1. one\n3. two\n"));

  // a small change in a line marks only the words
  assert.match(
    changes("The name is free again.\n", "The name is free now.\n"),
    /<p>The name is free <del>again<\/del><ins>now<\/ins>\.<\/p>/,
  );
  // a different line, or a change in a link address, marks the full lines
  assert.match(
    changes("Use the old flow.\n", "Delete each bucket first.\n"),
    /<p><del>Use the old flow\.<\/del>\s*<ins>Delete each bucket first\.<\/ins><\/p>/,
  );
  assert.match(
    changes("See [the docs](https://a.test).\n", "See [the docs](https://b.test).\n"),
    /<del>See <\/del><a href="https:\/\/a\.test"><del>the docs<\/del><\/a><del>\.<\/del>/,
  );

  const table = "| a | b |\n| - | - |\n| one | two |\n";
  assert.match(
    changes(table, table.replace("two", "three")),
    /<td>one<\/td><td><del>two<\/del><ins>three<\/ins><\/td>/,
  );
  // a changed line with a new line after it: the words in the first, the full second line
  assert.match(
    changes(table, `${table.replace("two", "three")}| new | row |\n`),
    /<del>two<\/del><ins>three<\/ins><\/td><\/tr><tr><td><ins>new<\/ins><\/td><td><ins>row<\/ins><\/td>/,
  );

  const code = "```js\nconst x = 1;\n```\n";
  assert.match(
    changes(code, code.replace("1", "2")),
    /<del>const x = 1;<\/del>\n<ins>const x = 2;<\/ins>/,
  );
});

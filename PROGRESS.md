# Progress

Last update: 2026-10-09, second session (the skill template, the presentation, projects, and the
change view on the PRD page).
This file is a snapshot. Update it when the state changes.

## Why this project exists

Ramin Mousavi works on the Hive compute console (`hcd-web`). Two problems there started this:

1. The PRDs do not stay in sync with the code. The repo keeps a hand copy of each PRD for the
   coding agents, and that copy becomes old. Today the copy is
   `.agents/skills/hivecompute/references/s3-console-integration.md` in
   `/Users/raminmousavi/Development/apps/hive/hive-compute-forks/hcd-web`.
2. The product manager changes a PRD and forgets to tell the developers and the design team.

This tool has one job: create PRDs, keep each version like git does, and serve them by URL to
people and to coding agents. It is a prototype. Its purpose is to show the idea to the managers.

The idea that makes PRD and code agree is the **version pin**: a repo records the PRD version that
its code agrees with. The diff from that version to the latest version is the work list. See
"Use from a repo" in `README.md`.

## State

All of this works and was checked on 2026-10-09:

- PRD list, PRD page (rendered Markdown, version list, old versions with `?v=N`).
- "Agent access" button on the PRD page. It opens a dialog with the two `curl` commands.
- Markdown editor with Write and Preview tabs. The save bar is sticky at the bottom of the window.
- Each save adds a version. A change summary is mandatory.
- A save is rejected when the content has no changes, or when a newer version was saved while the
  user edited. The text stays in the editor.
- Change view on the PRD page: the switch "Show the changes from vN" (`?changes=1`) marks the
  changes from the previous version in the rendered PRD. New text is green, removed text is red
  with a line through it. It was checked in a headless browser with a temporary `zz-test-prd`
  (paragraph, list, table, code block) and with the real S3 PRD.
- Diff page for any two versions. It opens after each save and shows the notification result.
- Slack message after each save, unless "Minor edit" is selected.
- Back button on each page that is not the list. Its text is the project name, for example
  "Hive Compute PRDs".
- Projects: each PRD is in one project. There are two, Hive Compute and AI Services. The list page
  has a project switch (`/?project=<slug>`) and the "New PRD" button, which makes a PRD in the
  selected project. The API list gives the project of each PRD. Checked in a headless browser:
  the switch, a create in AI Services with a temporary `zz-test-prd`, and the refusal of an
  address that exists in a different project.
- API with a bearer token: list, PRD as Markdown, diff from a version.
- The author of a version is the user name of the browser sign-in. The name field is read-only.
- Skill template for other repos: `skill-template/prd-sync/SKILL.md`. A repo copies the folder. The
  skill holds the pins and tells the agents how to get a PRD, read the diff, and move a pin. Each
  command in it was run against the local server. A new agent followed it in a temporary repo
  against a stub server: it got the diff, reported the change, and left the pin.
- Presentation for the managers: `presentation/index.html`. It is one file with no build step.
  Open it in a browser. It has 7 slides: 5 for the idea, 1 for the demo steps, 1 for the state and
  the proposal. The speaker notes are about 410 words, so the talk and a 2-minute demo fit in 6 to
  7 minutes. The layout comes from https://gmail-ingestion-proposal.raminious.workers.dev/. It
  was checked with screenshots at 1440x900 and 1280x720.

Git: commit `058870c` has the work up to the first version of the presentation. The project change
and the later presentation edits are not committed. Ask before you commit.

Data: `data/prd.db` (not in git) has one PRD, `s3-console-integration`. Version 1 is the copy from
the `hcd-web` skill. Version 2 is a save that Ramin made in the UI. Do not delete them. The PRDs from before projects
are in Hive Compute. `data/prd-before-projects.db` is a backup from before the `project` column.

Environment: `.env.local` (not in git) has a generated `ADMIN_PASSWORD` and `PRD_API_TOKEN`.
`SLACK_WEBHOOK_URL` was empty when the file was made, so messages go to the server log.

The dev server runs on port 3210, because port 3000 is used by a different app on this machine.
Ramin usually runs `npm run dev` in his own terminal. Check the port before you start a second one.

## Decisions and their reasons

| Decision | Reason |
| --- | --- |
| Markdown only, in a plain textarea. | Agents need Markdown. Ramin confirmed it. |
| SQLite through the built-in `node:sqlite`. Two tables. `versions` is append-only. | "Works like git" is the behaviour, not the storage. Git as storage needs more code. No native module to install. |
| Notify on each save. "Minor edit" turns it off. | The problem is that people forget. An optional "send" checkbox keeps the problem. |
| Slack webhook first. No email. | One HTTP call, no mail provider. Ramin asked for email at first and agreed to start with Slack. |
| Editor behind HTTP Basic with one shared password. API behind a bearer token. | Agents read PRD text as instructions. An open editor lets any person give instructions to the agents. Ramin wanted no real login for the prototype. |
| The Basic user name is the author name. An empty user name is refused. | Ramin asked for a read-only name that is "the logged-in user". There is no real login, so this is the only identity. |
| Each API route checks the token itself. The proxy does not cover `/api`. | A matcher mistake in the proxy must not open the data. Server actions also check the sign-in themselves. |
| Cache Components are off in `next.config.ts`. The root layout has `dynamic = "force-dynamic"`. | Next.js 16.4 turns Cache Components on in new apps. A synchronous SQLite read then runs at build time, and the page shows old data. |
| `PrdForm` submits with `onSubmit` and `startTransition`, not with a native `action`. | React resets a form after a native action submit, also when the server rejects the save. The user would lose the text. |
| The actions change CRLF to LF in the content. | Browsers send textarea line ends as CRLF. Without this, a diff shows each line as changed. |
| Projects are a fixed list in `src/lib/config.ts`, not a table. | Ramin asked for two projects and no "new project" form. A table has no use before that form exists. |
| The address (slug) of a PRD is unique in all projects. | The page URLs, the API routes, and the pins in the repos do not change. The cost: two projects cannot have a PRD with the same title. |
| The "New PRD" button is on the list page, not in the header. | The header does not know the selected project. The list page does. |
| The change view puts rare bracket characters around the changed text in the Markdown source. A rehype plugin changes them into `<ins>` and `<del>`. | The PRD stays rendered Markdown, so the reader sees the changes in place. No raw HTML and no new dependency. Markdown reads the brackets as punctuation, so bold text and links do not break. |
| A changed line shows the changed words only when the two lines are almost the same and no Markdown syntax changed. If not, it shows the full old line and the full new line. | A word mark in the middle of Markdown syntax (a link address, bold marks) breaks the line. |
| Adoption is not solved. | The tool helps only if the product manager writes PRDs here and in no other place. Ramin said: think about it later. |

## Things that cost time

- **Next.js 16.4 is not the version in your training data.** Read `node_modules/next/dist/docs/`
  first. Middleware is now `src/proxy.ts`.
- **shadcn** uses the Radix base with the `nova` preset. The generated components import `cn` from
  the `cn` package, not from `@/lib/utils`. The shadcn CLI added `"packageManager": "yarn@..."` to
  `package.json`. It was removed. The project uses npm. To add a component while the dev server
  runs, print it with `npx shadcn add <name> --dry-run --view src/components/ui/<name>.tsx` and
  write the file by hand. This does not run an install.
- **`node:sqlite` rows have no prototype.** React refuses them as props of a client component.
  Pass the fields, not the row.
- **`npm install` while the dev server runs** makes Turbopack fail with "Could not find the Next.js
  package". Start the server again.
- **The unit test** runs TypeScript directly in Node. It has a small resolve hook for the `@/`
  alias, so each `@/` import must point to a file. Types need `import type`.
- **The token line in `.env.local` has quotes or white space around the value.** Next.js removes
  them. A plain `grep | cut` in a shell does not, and the API then answers `Unauthorized`. The
  skill template removes them with `tr`.
- **The running dev server did not rebuild the stylesheet after a change in `globals.css`.** It
  sent the old rules for many minutes. Class names in source files show immediately, so the
  colours of the change view are class names in `src/lib/change-marks.ts`.
- **Known small flaws of the change view:** a numbered list counts the removed items, so its
  numbers can be different from the PRD. A change of only a list number or a heading level does
  not show. The view compares with the previous version only.
- **Known small flaw:** after a rejected save, the button still shows the old "Save as vN" number.

## How to check a change

```bash
npm test            # save logic and project filter on an in-memory database, and the change marks
npm run lint
npx tsc --noEmit
```

For the UI, the first session used Playwright from `hcd-web` in a headless browser. The scripts
were temporary and are gone. The method:

```js
import { createRequire } from "node:module";
const require = createRequire(
  "/Users/raminmousavi/Development/apps/hive/hive-compute-forks/hcd-web/apps/frontend/package.json",
);
const { chromium } = require("@playwright/test");
const browser = await chromium.launch();
const context = await browser.newContext({
  httpCredentials: { username: "Test Author", password: process.env.ADMIN_PASSWORD },
});
```

Run it with `node --env-file=.env.local <script>`. Rules for a check on the real database:

- Use a temporary PRD with the slug `zz-test-prd`. Add it with the `sqlite3` CLI, because a create
  in the UI sends a notification.
- Save with "Minor edit" selected, so that no Slack message goes out.
- Delete the rows of `zz-test-prd` from `versions` and `prds` when you are done.
- Select the form error with `p[role=alert]`. Next.js adds its own element with `role="alert"`.

## Not done

1. **Commit the work.** Ask Ramin first.
2. **Connect the `hcd-web` skill.** The template is ready in `skill-template/prd-sync/`, and its
   example pin row is the `hcd-web` row. Not done: copy it into `hcd-web`, add the two `.env`
   lines, and delete the hand copy of the PRD. `hcd-web` was not changed, because its skills are
   checked-in files that the agents of the team use, and the tool runs only on localhost. This
   needs Ramin's go-ahead.
3. **Real Slack test.** The call was tested only against a local stub (200, 500, no connection).
4. **Email**, if the managers want it.
5. **Rename and delete of a PRD.** The title is fixed when the PRD is made. The project is also
   fixed: there is no form for a new project, and no way to move a PRD to a different project.
   The Slack message does not name the project, and the API list has no project filter.
6. **Real login and roles.** This replaces the shared password, and the author name then comes
   from a real identity.
7. **Deployment.** SQLite needs a disk that stays. Set `APP_URL` to the public address.
8. **Adoption.** Open question: where does the product manager write PRDs today, and will they
   write them only here?

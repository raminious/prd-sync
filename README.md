# PRD Admin

A prototype with one job: create PRDs, keep each version, and serve them to people and to coding
agents.

## Run

```bash
cp .env.example .env.local   # then set ADMIN_PASSWORD and PRD_API_TOKEN
npm install
npm run dev                  # http://localhost:3210
```

The browser asks for a user name and a password. Use your name as the user name and the value of
`ADMIN_PASSWORD` as the password. Your name is recorded as the author of each version that you
save. The app is locked when `ADMIN_PASSWORD` is empty.

Tested with Node 24. The database is the built-in `node:sqlite`, and the data is in `data/prd.db`.

## How it works

- PRDs are Markdown.
- Each PRD is in one project. The projects are a fixed list in `src/lib/config.ts`: Hive Compute
  and AI Services. The list page shows one project at a time, and "New PRD" makes a PRD in the
  project that you see.
- A save does not change a version. It adds a new one. A change summary is mandatory.
- A save is rejected when a different person saved a newer version while you edited. Your text
  stays in the editor.
- A PRD page has the switch "Show the changes from vN". It marks the changes from the previous
  version in the text of the PRD: new text is green, removed text is red.
- After a save, the app sends a Slack message with the summary and a link to the diff. Select
  "Minor edit" to skip the message.

## API

Each route needs the header `Authorization: Bearer $PRD_API_TOKEN`.

| Route                             | Returns                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `GET /api/prds`                   | JSON list: slug, title, project, latest version.                                                                               |
| `GET /api/prds/:slug`             | The latest version as Markdown. Add `?version=N` for an old one. Headers: `X-PRD-Version`, `X-PRD-Latest-Version`.             |
| `GET /api/prds/:slug/diff?from=N` | Text: the change summaries and a unified diff from version N to the latest version. Add `&to=M` to stop at an earlier version. |

## Use from a repo

`skill-template/prd-sync/` is a skill for the coding agents of a repo. It tells them how to get a
PRD, how to find the changes after the recorded version, and when to update that version.

1. Copy the folder into the skills folder of the repo:
   `cp -r skill-template/prd-sync <repo>/.agents/skills/`
2. Do the "Setup" steps at the end of its `SKILL.md`.

How it works:

- The skill file records the version that the code agrees with. For example:
  `s3-console-integration`, pin 1.
- Before work in that area, the agent calls the diff route with the recorded version.
  - `No changes.` means that the code and the PRD agree.
  - If not, the diff is the work list. The agent updates the recorded version when the work is
    done.

## Checks

```bash
npm test
npm run lint
```

## Not in the prototype

Login and roles, email, a form for a new project, rename and delete of a PRD, a rich-text editor,
and comments.

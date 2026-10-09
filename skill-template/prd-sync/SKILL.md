---
name: prd-sync
description: Use when a task touches a product area that has a PRD, before you write or change code for that area. Also use when the user mentions a PRD, a product spec, requirements, a PRD version, a version pin, or PRD Admin, or asks if the code agrees with the PRD.
---

# PRD sync

The PRDs for this repo are in PRD Admin. PRD Admin keeps each version of a PRD and serves it
through an API. Get the PRD from the API each time. A copy in this repo or in your memory becomes
old.

This repo records a **pin** for each PRD: the PRD version that the code agrees with. The diff from
the pin to the latest version is the work list.

## Pins

| PRD slug | Pin | Code that it covers |
| --- | --- | --- |
| `s3-console-integration` | 1 | `apps/frontend/src/pages/console/StoragePage/**`, and all S3 work |

## Commands

Run the commands from the root of the repo. The shell does not keep the two functions, so include
them in each command.

```bash
get() { grep "^$1=" .env | cut -d= -f2- | tr -d "\"' \r"; }
prd() { curl -sS -H "Authorization: Bearer $(get PRD_API_TOKEN)" "$(get PRD_ADMIN_URL)/api/prds$1"; }

prd "/s3-console-integration/diff?from=1"   # the changes after pin 1
prd "/s3-console-integration"               # the latest version, as Markdown
prd ""                                      # each PRD: slug, title, latest version
```

Add `&to=M` to stop a diff at version M. Add `?version=N` to get the old version N.

## Before you write code

1. Find the row for your area in the Pins table. If there is no row, run `prd ""`. If a PRD covers
   the area, go to step 4.
2. Get the diff from the pin.
3. Read the result:
   - `No changes.`: the code and the PRD agree.
   - A `Changes:` list and a diff: the PRD changed after the pin. The diff is the work list. Tell
     the user what changed before you write code. If a change is not part of your task, ask before
     you build it.
4. Get the latest version and read all of it.
5. Do the work.

## After the work

- Change the pin only when the code agrees with each change in the diff. The new pin is the
  version in the `To:` line of that diff. Put the pin change and the code change in the same
  commit.
- If a change in the diff is not built, do not change the pin. Tell the user which changes remain.
- If the PRD had no row and the code now agrees with the version that you read, add a row with
  that version as the pin.

## Problems

| Result | Cause | Do this |
| --- | --- | --- |
| `Unauthorized` | `PRD_API_TOKEN` is missing or wrong. | Ask the user for the token. |
| `PRD not found` | The slug is wrong. | Run `prd ""` to get the slugs. |
| `Use ?from=N&to=M with ...` | The pin is not a version of this PRD. | Tell the user. Do not guess a pin. |
| `curl: (...)` | PRD Admin does not run, or `PRD_ADMIN_URL` is missing or wrong. | Tell the user that you cannot check the PRD. Ask before you continue. |

## Rules

- The API only reads. If a PRD is wrong or not clear, tell the user. A person changes it in the
  web editor at `PRD_ADMIN_URL`.
- Do not save PRD text in this repo.
- Do not print the token. Do not commit `.env`.

## Setup

Do these steps one time for each repo. Then delete this section.

1. Copy this folder into the skills folder of the repo, for example `.agents/skills/prd-sync/`.
2. Add two lines to the `.env` at the root of the repo. Get the two values from the `.env.local`
   of PRD Admin: `PRD_ADMIN_URL` is its `APP_URL`, and `PRD_API_TOKEN` is its `PRD_API_TOKEN`. If
   `APP_URL` is not set there, the address is `http://localhost:3210`. Make sure that git ignores
   `.env`.

   ```bash
   PRD_ADMIN_URL=
   PRD_API_TOKEN=
   ```

3. Replace the rows of the Pins table with the PRDs of this repo. `prd ""` gives the slugs. The
   pin is the version that the code agrees with today.
4. Delete the old PRD copies from the repo, so that the agents do not read them.

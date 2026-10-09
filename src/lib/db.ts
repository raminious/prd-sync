import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";

const path = process.env.DATABASE_PATH ?? "data/prd.db";
mkdirSync(dirname(path), { recursive: true });

export const db = new DatabaseSync(path, { timeout: 5000 });

// versions is append-only: a save always adds a row, it never changes one
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS prds (
    id INTEGER PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS versions (
    id INTEGER PRIMARY KEY,
    prd_id INTEGER NOT NULL REFERENCES prds(id),
    number INTEGER NOT NULL,
    content TEXT NOT NULL,
    summary TEXT NOT NULL,
    author TEXT NOT NULL,
    is_minor INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now')),
    UNIQUE (prd_id, number)
  );
`);

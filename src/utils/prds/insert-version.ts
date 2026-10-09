import { db } from "@/lib/db";

interface NewVersion {
  content: string;
  summary: string;
  author: string;
  isMinor: boolean;
  baseVersion: number;
}

type Result =
  | { status: "saved"; number: number }
  | { status: "conflict"; latest: number }
  | { status: "unchanged" };

export function insertVersion(
  prdId: number,
  { content, summary, author, isMinor, baseVersion }: NewVersion,
): Result {
  // The driver is synchronous, so no other save runs between this read and the insert.
  // ponytail: one process only; UNIQUE (prd_id, number) rejects a race between two processes.
  const latest = db
    .prepare("SELECT number, content FROM versions WHERE prd_id = ? ORDER BY number DESC LIMIT 1")
    .get(prdId) as { number: number; content: string };

  if (latest.number !== baseVersion) return { status: "conflict", latest: latest.number };
  if (latest.content === content) return { status: "unchanged" };

  const number = latest.number + 1;
  db.prepare(
    "INSERT INTO versions (prd_id, number, content, summary, author, is_minor) VALUES (?, ?, ?, ?, ?, ?)",
  ).run(prdId, number, content, summary, author, isMinor ? 1 : 0);
  return { status: "saved", number };
}

import { db } from "@/lib/db";
import type { PrdVersionMeta } from "@/types/prd";

export function listVersions(prdId: number): PrdVersionMeta[] {
  return db
    .prepare(
      `SELECT number, summary, author, is_minor AS isMinor, created_at AS createdAt
       FROM versions
       WHERE prd_id = ?
       ORDER BY number DESC`,
    )
    .all(prdId)
    .map((row) => ({ ...row, isMinor: Boolean(row.isMinor) }) as PrdVersionMeta);
}

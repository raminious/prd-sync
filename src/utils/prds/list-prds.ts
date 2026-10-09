import { db } from "@/lib/db";
import type { PrdSummary } from "@/types/prd";

export function listPrds() {
  return db
    .prepare(
      `SELECT p.slug, p.title, v.number AS version, v.created_at AS updatedAt, v.author AS updatedBy
       FROM prds p
       JOIN versions v ON v.prd_id = p.id
       WHERE v.number = (SELECT MAX(number) FROM versions WHERE prd_id = p.id)
       ORDER BY v.created_at DESC`,
    )
    .all() as unknown as PrdSummary[];
}

import { db } from "@/lib/db";
import type { PrdSummary } from "@/types/prd";

// no project = the PRDs of all projects
export function listPrds(project?: string) {
  return db
    .prepare(
      `SELECT p.slug, p.title, p.project, v.number AS version, v.created_at AS updatedAt, v.author AS updatedBy
       FROM prds p
       JOIN versions v ON v.prd_id = p.id
       WHERE v.number = (SELECT MAX(number) FROM versions WHERE prd_id = p.id)
         AND (?1 IS NULL OR p.project = ?1)
       ORDER BY v.created_at DESC`,
    )
    .all(project ?? null) as unknown as PrdSummary[];
}

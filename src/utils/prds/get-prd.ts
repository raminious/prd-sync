import { db } from "@/lib/db";
import type { Prd } from "@/types/prd";

export function getPrd(slug: string) {
  return db
    .prepare(
      `SELECT p.id, p.slug, p.title, MAX(v.number) AS latestVersion
       FROM prds p
       JOIN versions v ON v.prd_id = p.id
       WHERE p.slug = ?
       GROUP BY p.id`,
    )
    .get(slug) as Prd | undefined;
}

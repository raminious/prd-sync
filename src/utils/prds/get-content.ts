import { db } from "@/lib/db";

export function getContent(prdId: number, version: number) {
  const row = db
    .prepare("SELECT content FROM versions WHERE prd_id = ? AND number = ?")
    .get(prdId, version);
  return row?.content as string | undefined;
}

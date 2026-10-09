import { db } from "@/lib/db";

interface NewPrd {
  slug: string;
  title: string;
  content: string;
  author: string;
}

export function insertPrd({ slug, title, content, author }: NewPrd) {
  db.exec("BEGIN");
  try {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO prds (slug, title) VALUES (?, ?)")
      .run(slug, title);
    db.prepare(
      "INSERT INTO versions (prd_id, number, content, summary, author) VALUES (?, 1, ?, 'Initial version', ?)",
    ).run(lastInsertRowid, content, author);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

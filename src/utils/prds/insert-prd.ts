import { db } from "@/lib/db";

interface NewPrd {
  slug: string;
  title: string;
  project: string;
  content: string;
  author: string;
}

export function insertPrd({ slug, title, project, content, author }: NewPrd) {
  db.exec("BEGIN");
  try {
    const { lastInsertRowid } = db
      .prepare("INSERT INTO prds (slug, title, project) VALUES (?, ?, ?)")
      .run(slug, title, project);
    db.prepare(
      "INSERT INTO versions (prd_id, number, content, summary, author) VALUES (?, 1, ?, 'Initial version', ?)",
    ).run(lastInsertRowid, content, author);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

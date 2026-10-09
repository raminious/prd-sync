"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { FormState } from "@/types/prd";
import { getAdminUser } from "@/utils/auth/get-admin-user";
import { notifyStakeholders } from "@/utils/notify-stakeholders";
import { getPrd } from "@/utils/prds/get-prd";
import { insertPrd } from "@/utils/prds/insert-prd";
import { slugify } from "@/utils/prds/slugify";

export async function createPrd(_state: FormState, formData: FormData): Promise<FormState> {
  const author = getAdminUser((await headers()).get("authorization"));
  if (!author) return { error: "You are not authorized." };

  const title = String(formData.get("title") ?? "").trim();
  // browsers send textarea line ends as CRLF, which would show each line as changed in a diff
  const content = String(formData.get("content") ?? "").replace(/\r\n?/g, "\n");
  const slug = slugify(title);

  if (!slug || !content.trim()) return { error: "Title and content are mandatory." };
  if (getPrd(slug)) return { error: `A PRD with the address "${slug}" already exists.` };

  insertPrd({ slug, title, content, author });
  await notifyStakeholders({ slug, title, version: 1, author, summary: "New PRD" });
  redirect(`/prds/${slug}`);
}

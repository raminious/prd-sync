"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { FormState } from "@/types/prd";
import { getAdminUser } from "@/utils/auth/get-admin-user";
import { notifyStakeholders } from "@/utils/notify-stakeholders";
import { getPrd } from "@/utils/prds/get-prd";
import { insertVersion } from "@/utils/prds/insert-version";

export async function saveVersion(_state: FormState, formData: FormData): Promise<FormState> {
  const author = getAdminUser((await headers()).get("authorization"));
  if (!author) return { error: "You are not authorized." };

  const slug = String(formData.get("slug") ?? "");
  const summary = String(formData.get("summary") ?? "").trim();
  // browsers send textarea line ends as CRLF, which would show each line as changed in a diff
  const content = String(formData.get("content") ?? "").replace(/\r\n?/g, "\n");
  const baseVersion = Number(formData.get("baseVersion"));
  const isMinor = formData.get("isMinor") === "on";

  if (!summary || !content.trim()) return { error: "Content and change summary are mandatory." };

  const prd = getPrd(slug);
  if (!prd) return { error: "This PRD does not exist." };

  const result = insertVersion(prd.id, { content, summary, author, isMinor, baseVersion });
  if (result.status === "unchanged") return { error: "The content has no changes." };
  if (result.status === "conflict")
    return {
      error: `Version ${result.latest} was saved while you edited version ${baseVersion}. Copy your text, open the editor again, and apply your changes to version ${result.latest}.`,
    };

  const notice = isMinor
    ? "minor"
    : await notifyStakeholders({
        slug,
        title: prd.title,
        version: result.number,
        author,
        summary,
      });
  redirect(`/prds/${slug}/diff?from=${baseVersion}&to=${result.number}&notice=${notice}`);
}

import { APP_URL } from "@/lib/config";

interface Notice {
  slug: string;
  title: string;
  version: number;
  author: string;
  summary: string;
}

export type NoticeStatus = "sent" | "failed" | "off";

export async function notifyStakeholders({
  slug,
  title,
  version,
  author,
  summary,
}: Notice): Promise<NoticeStatus> {
  const escape = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const link =
    version > 1
      ? `${APP_URL}/prds/${slug}/diff?from=${version - 1}&to=${version}`
      : `${APP_URL}/prds/${slug}`;
  const text = `*${escape(title)}* is now at v${version} (${escape(author)})\n> ${escape(summary)}\n<${link}|See the changes>`;

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log(`[notify] SLACK_WEBHOOK_URL is not set. Message not sent:\n${text}`);
    return "off";
  }

  // The version is already saved, so a failed notification must not fail the save.
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (response.ok) return "sent";
    console.error(`[notify] Slack answered ${response.status}`);
  } catch (error) {
    console.error("[notify] Slack webhook failed", error);
  }
  return "failed";
}

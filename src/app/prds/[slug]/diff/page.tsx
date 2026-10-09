import { structuredPatch } from "diff";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BackToList } from "@/components/BackToList";
import { DiffView } from "@/components/DiffView";
import { VersionSelect } from "@/components/VersionSelect";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format-date";
import { getContent } from "@/utils/prds/get-content";
import { getPrd } from "@/utils/prds/get-prd";
import { listVersions } from "@/utils/prds/list-versions";
import { parseVersion } from "@/utils/prds/parse-version";

const NOTICES: Record<string, string> = {
  sent: "The version is saved. The stakeholders got a notification.",
  minor: "The version is saved as a minor edit. No notification was sent.",
  off: "The version is saved. No notification was sent, because SLACK_WEBHOOK_URL is not set.",
  failed: "The version is saved, but the notification failed. Tell the stakeholders yourself.",
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ from?: string; to?: string; notice?: string }>;
}

export default async function DiffPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const prd = getPrd(slug);
  if (!prd) notFound();

  const to = parseVersion(query.to, prd.latestVersion) ?? prd.latestVersion;
  const from = parseVersion(query.from, prd.latestVersion) ?? Math.max(to - 1, 1);
  const versions = listVersions(prd.id);
  const changes = versions.filter(
    (version) => version.number > Math.min(from, to) && version.number <= Math.max(from, to),
  );
  const { hunks } = structuredPatch(
    `v${from}`,
    `v${to}`,
    getContent(prd.id, from) ?? "",
    getContent(prd.id, to) ?? "",
  );
  const notice = query.notice && NOTICES[query.notice];

  return (
    <div className="flex flex-col gap-6">
      <BackToList project={prd.project} />
      {notice && (
        <p role="status" className="rounded-lg border bg-muted px-4 py-3 text-sm">
          {notice}
        </p>
      )}

      <div>
        <h1 className="text-2xl font-semibold">
          <Link href={`/prds/${slug}`} className="underline">
            {prd.title}
          </Link>
          : v{from} to v{to}
        </h1>
      </div>

      <form className="flex flex-wrap items-end gap-3">
        <VersionSelect name="from" label="From" defaultValue={from} versions={versions} />
        <VersionSelect name="to" label="To" defaultValue={to} versions={versions} />
        <Button type="submit" variant="outline">
          Compare
        </Button>
      </form>

      {changes.length > 0 && (
        <ul className="flex flex-col gap-1 text-sm">
          {changes.map((version) => (
            <li key={version.number}>
              <span className="font-medium">v{version.number}</span> {version.summary}{" "}
              <span className="text-muted-foreground">
                ({version.author}, {formatDate(version.createdAt)})
              </span>
            </li>
          ))}
        </ul>
      )}

      {hunks.length > 0 ? (
        <DiffView hunks={hunks} />
      ) : (
        <p className="text-muted-foreground">These versions have the same content.</p>
      )}
    </div>
  );
}

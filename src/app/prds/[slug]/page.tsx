import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentAccess } from "@/components/AgentAccess";
import { BackToList } from "@/components/BackToList";
import { ChangesSwitch } from "@/components/ChangesSwitch";
import { Markdown } from "@/components/Markdown";
import { VersionList } from "@/components/VersionList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CHANGE_STYLES } from "@/lib/change-marks";
import { markChanges } from "@/utils/changes/mark-changes";
import { getContent } from "@/utils/prds/get-content";
import { getPrd } from "@/utils/prds/get-prd";
import { listVersions } from "@/utils/prds/list-versions";
import { parseVersion } from "@/utils/prds/parse-version";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string; changes?: string }>;
}

export default async function PrdPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const prd = getPrd(slug);
  if (!prd) notFound();

  const query = await searchParams;
  const version = parseVersion(query.v, prd.latestVersion) ?? prd.latestVersion;
  const isLatest = version === prd.latestVersion;
  const isCompare = version > 1 && query.changes === "1";
  const content = getContent(prd.id, version) ?? "";

  const switchQuery = new URLSearchParams();
  if (!isLatest) switchQuery.set("v", String(version));
  if (!isCompare) switchQuery.set("changes", "1");

  return (
    <div className="flex flex-col gap-6">
      <BackToList project={prd.project} />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{prd.title}</h1>
          <p className="text-sm text-muted-foreground">
            v{version}
            {isLatest ? (
              " (latest)"
            ) : (
              <>
                {" is an old version. "}
                <Link href={`/prds/${slug}`} className="underline">
                  Go to v{prd.latestVersion}
                </Link>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <AgentAccess slug={slug} version={prd.latestVersion} />
          {prd.latestVersion > 1 && (
            <Button asChild variant="outline">
              <Link href={`/prds/${slug}/diff`}>Compare versions</Link>
            </Button>
          )}
          <Button asChild>
            <Link href={`/prds/${slug}/edit`}>Edit</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex min-w-0 flex-col gap-3">
          {version > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <ChangesSwitch
                isOn={isCompare}
                href={`/prds/${slug}${switchQuery.size ? `?${switchQuery}` : ""}`}
                label={`Show the changes from v${version - 1}`}
              />
              {isCompare && (
                <p className="flex gap-2 text-sm">
                  <ins className={CHANGE_STYLES.ins}>New text</ins>
                  <del className={CHANGE_STYLES.del}>Removed text</del>
                </p>
              )}
            </div>
          )}
          <Card>
            <CardContent>
              <Markdown
                content={
                  isCompare ? markChanges(getContent(prd.id, version - 1) ?? "", content) : content
                }
              />
            </CardContent>
          </Card>
        </div>
        <aside>
          <VersionList
            slug={slug}
            versions={listVersions(prd.id)}
            current={version}
            isCompare={isCompare}
          />
        </aside>
      </div>
    </div>
  );
}

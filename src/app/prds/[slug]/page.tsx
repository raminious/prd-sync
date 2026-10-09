import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentAccess } from "@/components/AgentAccess";
import { BackToList } from "@/components/BackToList";
import { Markdown } from "@/components/Markdown";
import { VersionList } from "@/components/VersionList";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getContent } from "@/utils/prds/get-content";
import { getPrd } from "@/utils/prds/get-prd";
import { listVersions } from "@/utils/prds/list-versions";
import { parseVersion } from "@/utils/prds/parse-version";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ v?: string }>;
}

export default async function PrdPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const prd = getPrd(slug);
  if (!prd) notFound();

  const version = parseVersion((await searchParams).v, prd.latestVersion) ?? prd.latestVersion;
  const isLatest = version === prd.latestVersion;

  return (
    <div className="flex flex-col gap-6">
      <BackToList />
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
        <Card>
          <CardContent>
            <Markdown content={getContent(prd.id, version) ?? ""} />
          </CardContent>
        </Card>
        <aside>
          <VersionList slug={slug} versions={listVersions(prd.id)} current={version} />
        </aside>
      </div>
    </div>
  );
}

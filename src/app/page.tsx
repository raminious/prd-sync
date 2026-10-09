import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PROJECTS } from "@/lib/config";
import { formatDate } from "@/utils/format-date";
import { listPrds } from "@/utils/prds/list-prds";
import { getProject } from "@/utils/projects/get-project";

interface Props {
  searchParams: Promise<{ project?: string }>;
}

export default async function HomePage({ searchParams }: Props) {
  const project = getProject((await searchParams).project) ?? PROJECTS[0];
  const prds = listPrds(project.slug);
  const newPrdHref = `/new?project=${project.slug}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">PRDs</h1>
        <Button asChild size="sm">
          <Link href={newPrdHref}>New PRD</Link>
        </Button>
      </div>
      <nav aria-label="Projects" className="flex flex-wrap gap-2">
        {PROJECTS.map(({ slug, name }) => {
          const isCurrent = slug === project.slug;
          return (
            <Button key={slug} asChild size="sm" variant={isCurrent ? "secondary" : "ghost"}>
              <Link href={`/?project=${slug}`} aria-current={isCurrent ? "page" : undefined}>
                {name}
              </Link>
            </Button>
          );
        })}
      </nav>
      {prds.length === 0 ? (
        <p className="text-muted-foreground">
          There are no PRDs in {project.name}.{" "}
          <Link href={newPrdHref} className="underline">
            Create the first one.
          </Link>
        </p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {prds.map((prd) => (
            <li key={prd.slug}>
              <Link
                href={`/prds/${prd.slug}`}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted/50"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{prd.title}</p>
                  <p className="truncate font-mono text-xs text-muted-foreground">{prd.slug}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm text-muted-foreground">
                  <span className="hidden sm:inline">
                    {prd.updatedBy} · {formatDate(prd.updatedAt)}
                  </span>
                  <Badge variant="secondary">v{prd.version}</Badge>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

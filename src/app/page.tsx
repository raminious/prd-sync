import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/format-date";
import { listPrds } from "@/utils/prds/list-prds";

export default function HomePage() {
  const prds = listPrds();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">PRDs</h1>
      {prds.length === 0 ? (
        <p className="text-muted-foreground">
          There are no PRDs.{" "}
          <Link href="/new" className="underline">
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

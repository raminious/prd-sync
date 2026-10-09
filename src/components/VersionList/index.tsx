import Link from "next/link";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrdVersionMeta } from "@/types/prd";
import { formatDate } from "@/utils/format-date";

interface Props {
  slug: string;
  versions: PrdVersionMeta[];
  current: number;
  isCompare: boolean;
}

export function VersionList({ slug, versions, current, isCompare }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Versions</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="flex flex-col gap-4">
          {versions.map((version) => (
            <li
              key={version.number}
              className={cn(
                "flex flex-col gap-1 border-l-2 pl-3 text-sm",
                version.number === current && "border-primary",
              )}
            >
              <div className="flex items-center gap-2">
                <Link
                  href={`/prds/${slug}?v=${version.number}${isCompare ? "&changes=1" : ""}`}
                  className="font-medium underline"
                >
                  v{version.number}
                </Link>
                {version.isMinor && <Badge variant="outline">minor</Badge>}
                {version.number > 1 && (
                  <Link
                    href={`/prds/${slug}/diff?from=${version.number - 1}&to=${version.number}`}
                    className="ml-auto text-xs text-muted-foreground underline"
                  >
                    diff
                  </Link>
                )}
              </div>
              <p>{version.summary}</p>
              <p className="text-xs text-muted-foreground">
                {version.author} · {formatDate(version.createdAt)}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}

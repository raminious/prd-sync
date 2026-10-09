import { cn } from "cn";
import type { StructuredPatchHunk } from "diff";

const LINE_STYLES: Record<string, string> = {
  "+": "bg-green-500/15 text-green-900",
  "-": "bg-red-500/15 text-red-900",
  "\\": "text-muted-foreground",
};

interface Props {
  hunks: StructuredPatchHunk[];
}

export function DiffView({ hunks }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border font-mono text-xs leading-5">
      {hunks.map((hunk) => (
        <div key={`${hunk.oldStart}:${hunk.newStart}`}>
          <div className="bg-muted px-3 py-1 text-muted-foreground">
            @@ -{hunk.oldStart},{hunk.oldLines} +{hunk.newStart},{hunk.newLines} @@
          </div>
          {hunk.lines.map((line, index) => (
            <div key={index} className={cn("px-3 whitespace-pre-wrap", LINE_STYLES[line[0]])}>
              {line || " "}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

import type { PrdVersionMeta } from "@/types/prd";

interface Props {
  name: string;
  label: string;
  defaultValue: number;
  versions: PrdVersionMeta[];
}

export function VersionSelect({ name, label, defaultValue, versions }: Props) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-sm font-medium">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-9 max-w-xs rounded-md border bg-background px-2 text-sm font-normal"
      >
        {versions.map((version) => (
          <option key={version.number} value={version.number}>
            v{version.number} — {version.summary}
          </option>
        ))}
      </select>
    </label>
  );
}

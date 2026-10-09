import { createTwoFilesPatch } from "diff";
import { isApiAuthorized } from "@/utils/auth/is-api-authorized";
import { getContent } from "@/utils/prds/get-content";
import { getPrd } from "@/utils/prds/get-prd";
import { listVersions } from "@/utils/prds/list-versions";
import { parseVersion } from "@/utils/prds/parse-version";

interface Context {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Context) {
  if (!isApiAuthorized(request)) return new Response("Unauthorized\n", { status: 401 });

  const prd = getPrd((await params).slug);
  if (!prd) return new Response("PRD not found\n", { status: 404 });

  const query = new URL(request.url).searchParams;
  const from = parseVersion(query.get("from"), prd.latestVersion);
  const to = query.has("to") ? parseVersion(query.get("to"), prd.latestVersion) : prd.latestVersion;
  if (!from || !to || from > to)
    return new Response(
      `Use ?from=N&to=M with 1 <= N <= M <= ${prd.latestVersion}. "to" is optional, the default is the latest version.\n`,
      { status: 400 },
    );

  const latestLabel = to === prd.latestVersion ? " (latest)" : "";
  const header = `PRD: ${prd.title} (${prd.slug})\nFrom: v${from}\nTo: v${to}${latestLabel}\n`;
  if (from === to) return new Response(`${header}\nNo changes.\n`);

  const changes = listVersions(prd.id)
    .filter((version) => version.number > from && version.number <= to)
    .reverse()
    .map(
      (version) =>
        `- v${version.number} (${version.createdAt.slice(0, 10)}, ${version.author}): ${version.summary}`,
    )
    .join("\n");
  const patch = createTwoFilesPatch(
    `${prd.slug}@v${from}`,
    `${prd.slug}@v${to}`,
    getContent(prd.id, from) ?? "",
    getContent(prd.id, to) ?? "",
  );

  return new Response(`${header}\nChanges:\n${changes}\n\n${patch}`);
}

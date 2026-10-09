import { isApiAuthorized } from "@/utils/auth/is-api-authorized";
import { getContent } from "@/utils/prds/get-content";
import { getPrd } from "@/utils/prds/get-prd";
import { parseVersion } from "@/utils/prds/parse-version";

interface Context {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Context) {
  if (!isApiAuthorized(request)) return new Response("Unauthorized\n", { status: 401 });

  const prd = getPrd((await params).slug);
  if (!prd) return new Response("PRD not found\n", { status: 404 });

  const requested = new URL(request.url).searchParams.get("version");
  const version =
    requested === null ? prd.latestVersion : parseVersion(requested, prd.latestVersion);
  if (!version)
    return new Response(`"version" must be a number from 1 to ${prd.latestVersion}\n`, {
      status: 400,
    });

  return new Response(getContent(prd.id, version), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-PRD-Version": String(version),
      "X-PRD-Latest-Version": String(prd.latestVersion),
    },
  });
}

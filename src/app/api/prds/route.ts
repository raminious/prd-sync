import { isApiAuthorized } from "@/utils/auth/is-api-authorized";
import { listPrds } from "@/utils/prds/list-prds";

export async function GET(request: Request) {
  if (!isApiAuthorized(request)) return new Response("Unauthorized\n", { status: 401 });
  return Response.json(listPrds());
}

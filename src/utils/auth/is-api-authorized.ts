import { isSecretMatch } from "@/utils/auth/is-secret-match";

export function isApiAuthorized(request: Request) {
  const [scheme, token] = (request.headers.get("authorization") ?? "").split(" ");
  return scheme === "Bearer" && isSecretMatch(token ?? "", process.env.PRD_API_TOKEN);
}

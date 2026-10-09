import { isSecretMatch } from "@/utils/auth/is-secret-match";

// HTTP Basic: the password is the shared ADMIN_PASSWORD, the user name becomes the author name.
export function getAdminUser(authorization: string | null) {
  const [scheme, encoded] = (authorization ?? "").split(" ");
  if (scheme !== "Basic" || !encoded) return undefined;
  const [user, ...password] = Buffer.from(encoded, "base64").toString().split(":");
  if (!isSecretMatch(password.join(":"), process.env.ADMIN_PASSWORD)) return undefined;
  return user.trim() || undefined;
}

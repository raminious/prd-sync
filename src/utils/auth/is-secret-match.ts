import { createHash, timingSafeEqual } from "node:crypto";

// An unset secret matches nothing, so a missing env variable locks the app.
export function isSecretMatch(given: string, expected: string | undefined) {
  if (!expected) return false;
  const hash = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(hash(given), hash(expected));
}

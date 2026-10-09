export function parseVersion(value: string | null | undefined, latest: number) {
  const version = Number(value);
  return value && Number.isInteger(version) && version >= 1 && version <= latest
    ? version
    : undefined;
}

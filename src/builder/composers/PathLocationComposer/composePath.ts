export function composePath(base: string, segment: string): string {
  const b = base.endsWith("/");
  const s = segment.startsWith("/");
  if (b && s) {
    return base + segment.slice(1);
  }
  if (!b && !s) {
    return base + "/" + segment;
  }
  return base + segment;
}

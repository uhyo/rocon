export function decomposePath(path: string): [string, string] | undefined {
  if (!path.startsWith("/") || path === "/") {
    return undefined;
  }
  const splitterIndex = path.indexOf("/", 1);
  const splitter = splitterIndex === -1 ? path.length : splitterIndex;
  const first = path.substring(1, splitter);
  const rest = path.slice(splitter);
  return [first, rest];
}

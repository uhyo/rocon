import type { BuilderLink } from "../BuilderLink";
import type { Location } from "../Location";
import type { ResolvedRoute } from "./ResolvedRoute";

/**
 * Resolve location from given link and location
 * @package
 */
export function resolveChain<ActionResult, Value>(
  link: BuilderLink<ActionResult, unknown, Value>,
  location: Location
): Array<ResolvedRoute<Value>> {
  const decomposed = link.composer.decompose(location);
  return decomposed.flatMap(([seg, next]) => {
    const resolved = link.followInheritanceChain((link) =>
      link.resolveSegment?.(seg)
    ).result;
    if (resolved === undefined) {
      return [];
    }
    const match = (resolved.type === "normal"
      ? {}
      : {
          [resolved.matchKey]: seg,
        }) as never;

    const childLink = resolved.link;

    if (childLink === undefined || childLink.composer.isLeaf(next)) {
      return [
        {
          route: resolved.value,
          link: childLink,
          match,
          location: next,
        },
      ];
    }
    const result = resolveChain<ActionResult, Value>(childLink, next);
    switch (resolved.type) {
      case "normal": {
        return result;
      }
      case "matching": {
        const key = resolved.matchKey;
        const matchedValue = resolved.matchValue;
        return result.map((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res.match as any)[key] = matchedValue;
          return res;
        });
      }
    }
  });
}

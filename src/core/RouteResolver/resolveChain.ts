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
): Array<ResolvedRoute<ActionResult>> {
  const decomposed = link.composer.decompose(location);
  return decomposed.flatMap(([seg, next]) => {
    const nextRoute = link.resolveSegment?.(seg);
    if (nextRoute === undefined) {
      return [];
    }
    const match = (nextRoute.type === "normal"
      ? {}
      : {
          [nextRoute.matchKey]: seg,
        }) as never;

    const childLink = nextRoute.link;

    if (childLink === undefined || childLink.composer.isLeaf(next)) {
      return [
        {
          route: nextRoute.value,
          link: childLink,
          match,
          location: next,
        },
      ];
    }
    const result = resolveChain<ActionResult, Value>(childLink, next);
    switch (nextRoute.type) {
      case "normal": {
        return result;
      }
      case "matching": {
        const key = nextRoute.matchKey;
        const matchedValue = nextRoute.matchValue;
        return result.map((res) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (res.match as any)[key] = matchedValue;
          return res;
        });
      }
    }
  });
}

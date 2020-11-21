import type { BuilderLink } from "../BuilderLink";
import {
  ResolvedSegmentType,
  SegmentResolver,
} from "../BuilderLink/SegmentResolver";
import type { Location } from "../Location";
import type { ResolvedRoute } from "./ResolvedRoute";

type DecomposedSegmentType<ActionResult, Segment, Value> = ResolvedSegmentType<
  ActionResult,
  Segment,
  Value
> & {
  segment: Segment;
  nextLocation: Location;
};

export type SegmentDecomposer<ActionResult, Segment, Value> = (
  location: Location
) => DecomposedSegmentType<ActionResult, Segment, Value>[];
/**
 * Create a segment decomposer function for given BuilderLink and SegmentResolver.
 */
export function createSegmentDecomposer<ActionResult, Segment, Value>(
  link: BuilderLink<ActionResult, Segment, Value>,
  resolveSegment: SegmentResolver<ActionResult, Segment, Value>
): SegmentDecomposer<ActionResult, Segment, Value> {
  const { composer } = link;
  return (location) => {
    const decomposed = composer.decompose(location);
    return decomposed.flatMap(({ segment, nextLocation }) => {
      const resolved = resolveSegment(segment, nextLocation);
      if (resolved === undefined) {
        return [];
      }
      return [{ ...resolved, segment, nextLocation }];
    });
  };
}

/**
 * Resolve location from given link and location
 * @package
 */
export function resolveChain<ActionResult, Segment, Value>(
  link: BuilderLink<ActionResult, Segment, Value>,
  location: Location,
  currentLocation: Location
): Array<ResolvedRoute<Value>> {
  const resolvedSegments = link.segmentDecomposer?.(location);
  if (resolvedSegments === undefined) {
    return [];
  }
  return resolvedSegments.flatMap((resolved) => {
    const nextCurrentLocation = link.composer.compose(
      currentLocation,
      resolved.segment
    );
    const match = (resolved.type === "normal"
      ? {}
      : {
          [resolved.matchKey]: resolved.matchValue,
        }) as never;

    const childLink = resolved.link;

    if (childLink === undefined) {
      return [
        {
          route: resolved.value,
          match,
          remainingLocation: resolved.nextLocation,
          currentLocation: nextCurrentLocation,
        },
      ];
    }

    const result = resolveChain<ActionResult, unknown, Value>(
      childLink,
      resolved.nextLocation,
      nextCurrentLocation
    );

    if (
      result.length === 0 &&
      childLink.composer.isLeaf(resolved.nextLocation)
    ) {
      return [
        {
          route: resolved.value,
          match,
          remainingLocation: resolved.nextLocation,
          currentLocation: nextCurrentLocation,
        },
      ];
    }
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

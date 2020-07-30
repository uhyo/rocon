import { LocationComposer } from "../LocationComposer";
import type { BaseState, Location } from "../LocationComposer/Location";
import type { RouteRecordType } from "../RouteBuilder/RouteRecord";
import { MatchingRouteRecord } from "../RouteBuilder/RouteRecord/MatchingRouteRecord";
import { ResolvedRoute } from "./ResolvedRoute";

export type ResolvedSegmentType<ActionResult, Segment> =
  | {
      type: "normal";
      route: RouteRecordType<ActionResult, never, boolean>;
    }
  | {
      type: "matching";
      route: MatchingRouteRecord<ActionResult, Segment, never, boolean>;
      value: Segment;
    };

export type SegmentResolver<ActionResult, Segment> = (
  segment: Segment
) => ResolvedSegmentType<ActionResult, Segment> | undefined;

/**
 * Object that resolves given URL to a Route.
 */
export class RouteResolver<ActionResult, Segment> {
  #resolveSegment: SegmentResolver<ActionResult, Segment>;
  #composer: LocationComposer<Segment>;
  constructor(
    composer: LocationComposer<Segment>,
    resolveSegment: SegmentResolver<ActionResult, Segment>
  ) {
    this.#composer = composer;
    this.#resolveSegment = resolveSegment;
  }

  resolve(
    location: Location<BaseState>
  ): Array<ResolvedRoute<ActionResult, never>> {
    return this.resolveAlsoNoAction(location).filter((res) => res.route.action);
  }

  resolveAlsoNoAction(
    location: Location<BaseState>
  ): Array<ResolvedRoute<ActionResult, never>> {
    const decomposed = this.#composer.decompose(location);
    return decomposed.flatMap(([seg, next]) => {
      const nextRoute = this.#resolveSegment(seg);
      if (nextRoute === undefined) {
        return [];
      }
      const match = (nextRoute.type === "normal"
        ? {}
        : {
            [nextRoute.route.key]: seg,
          }) as never;

      const childResolver = nextRoute.route
        .getAttachedBuilder()
        ?.getBuilderLink()
        .getChildBuilder()
        ?.getResolver();

      if (childResolver === undefined || childResolver.#composer.isLeaf(next)) {
        return [
          {
            route: nextRoute.route,
            match,
            location: next,
          },
        ];
      }
      const result = childResolver.resolve(next);
      switch (nextRoute.type) {
        case "normal": {
          return result;
        }
        case "matching": {
          const key = nextRoute.route.key;
          const matchedValue = nextRoute.value;
          return result.map((res) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (res.match as any)[key] = matchedValue;
            return res;
          });
        }
      }
    });
  }
}

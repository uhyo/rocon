import { BuilderLink } from "../BuilderLink";
import type { BaseState, Location } from "../LocationComposer/Location";
import type { RouteRecordType } from "../RouteBuilder/RouteRecord";
import { MatchingRouteRecord } from "../RouteBuilder/RouteRecord/MatchingRouteRecord";
import { resolveChain } from "./resolveChain";
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
  readonly link: BuilderLink<ActionResult, Segment>;
  constructor(link: BuilderLink<ActionResult, Segment>) {
    this.link = link;
  }

  resolve(
    location: Location<BaseState>
  ): Array<ResolvedRoute<ActionResult, never>> {
    return resolveChain(this.link, location).filter((res) => res.route.action);
  }
}

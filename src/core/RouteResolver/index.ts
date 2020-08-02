import type { RouteRecordType } from "../../builder/RouteRecord";
import { MatchingRouteRecord } from "../../builder/RouteRecord/MatchingRouteRecord";
import { BuilderLink } from "../BuilderLink";
import { HasBuilderLink } from "../BuilderLink/AttachableRouteBuilder";
import type { BaseState, Location } from "../Location";
import { resolveChain } from "./resolveChain";
import { ResolvedRoute } from "./ResolvedRoute";

export type ResolvedSegmentType<ActionResult, Segment> =
  | {
      type: "normal";
      route: RouteRecordType<ActionResult, never, boolean>;
      // TODO: this `| undefined` could be removed?
      link: BuilderLink<ActionResult, Segment> | undefined;
    }
  | {
      type: "matching";
      route: MatchingRouteRecord<ActionResult, Segment, never, boolean>;
      link: BuilderLink<ActionResult, Segment> | undefined;
      matchKey: string;
      matchValue: Segment;
    };

export type SegmentResolver<ActionResult, Segment> = (
  segment: Segment
) => ResolvedSegmentType<ActionResult, Segment> | undefined;

/**
 * Object that resolves given URL to a Route.
 */
export class RouteResolver<ActionResult, Segment> {
  static getFromBuilder<ActionResult, Segment>(
    builder: HasBuilderLink<ActionResult, Segment>
  ): RouteResolver<ActionResult, Segment> {
    return builder.getBuilderLink().resolver;
  }

  readonly link: BuilderLink<ActionResult, Segment>;
  constructor(link: BuilderLink<ActionResult, Segment>) {
    this.link = link;
  }

  resolve(location: Location<BaseState>): Array<ResolvedRoute<ActionResult>> {
    return resolveChain(this.link, location).filter((res) => res.route.action);
  }
}

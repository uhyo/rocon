import { BuilderLink } from "../BuilderLink";
import type { BaseState, Location } from "../Location";
import { resolveChain } from "./resolveChain";
import { ResolvedRoute } from "./ResolvedRoute";

export type ResolvedSegmentType<ActionResult, Segment, Value> =
  | {
      type: "normal";
      // value: RouteRecordType<ActionResult, never, boolean>;
      value: Value;
      // TODO: this `| undefined` could be removed?
      link: BuilderLink<ActionResult, Segment, Value> | undefined;
    }
  | {
      type: "matching";
      value: Value;
      link: BuilderLink<ActionResult, Segment, Value> | undefined;
      matchKey: string;
      matchValue: Segment;
    };

export type SegmentResolver<ActionResult, Segment, Value> = (
  segment: Segment
) => ResolvedSegmentType<ActionResult, Segment, Value> | undefined;

/**
 * Object that resolves given URL to a Route.
 */
export class RouteResolver<ActionResult, Segment, Value> {
  readonly link: BuilderLink<ActionResult, Segment, Value>;
  constructor(link: BuilderLink<ActionResult, Segment, Value>) {
    this.link = link;
  }

  resolve(location: Location<BaseState>): Array<ResolvedRoute<Value>> {
    return resolveChain(this.link, location);
  }
}

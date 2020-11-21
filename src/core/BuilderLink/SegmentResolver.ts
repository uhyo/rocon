import type { BuilderLink } from ".";
import type { Location } from "../Location";

export type ResolvedSegmentType<ActionResult, Segment, Value> =
  | {
      type: "normal";
      // value: RouteRecordType<ActionResult, never, boolean>;
      value: Value;
      // TODO: this `| undefined` could be removed?
      link: BuilderLink<ActionResult, unknown, Value> | undefined;
    }
  | {
      type: "matching";
      value: Value;
      link: BuilderLink<ActionResult, unknown, Value> | undefined;
      matchKey: string;
      matchValue: Segment;
    };

export type SegmentResolver<ActionResult, Segment, Value> = (
  segment: Segment,
  remainingLocation: Location
) => ResolvedSegmentType<ActionResult, Segment, Value> | undefined;

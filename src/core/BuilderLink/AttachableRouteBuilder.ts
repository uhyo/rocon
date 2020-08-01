import type { BuilderLink } from ".";

export interface HasBuilderLink<ActionResult, Segment> {
  getBuilderLink(): BuilderLink<ActionResult, Segment>;
}

export type AttachableRouteBuilder<ActionResult, Segment> = HasBuilderLink<
  ActionResult,
  Segment
>;

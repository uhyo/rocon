import type { BuilderLink } from ".";

export interface HasBuilderLink<ActionResult, Segment, Value> {
  getBuilderLink(): BuilderLink<ActionResult, Segment, Value>;
}

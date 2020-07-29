import type { BuilderLink } from ".";

// TODO: rename
export interface AttachableRoutesBuilder<ActionResult, Segment> {
  getBuilderLink(): BuilderLink<ActionResult, Segment>;
}

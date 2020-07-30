import type { PartiallyPartial } from "../util/types/PartiallyPartial";
import type { BuilderLinkOptions } from "./BuilderLinkOptions";

/**
 * Fill missing fields in RoutesOptions object.
 */
export function fillOptions<ActionResult, Segment>(
  obj: PartiallyPartial<BuilderLinkOptions<ActionResult, Segment>, "root">
): asserts obj is BuilderLinkOptions<ActionResult, Segment> {
  if (!obj.root) {
    obj.root = {
      pathname: "/",
      state: null,
    };
  }
}

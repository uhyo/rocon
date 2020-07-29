import type { PartiallyPartial } from "../util/types/PartiallyPartial";
import type { RoutesBuilderOptions } from "./RoutesBuilderOptions";

/**
 * Fill missing fields in RoutesOptions object.
 */
export function fillOptions<ActionResult, Segment>(
  obj: PartiallyPartial<RoutesBuilderOptions<ActionResult, Segment>, "root">
): asserts obj is RoutesBuilderOptions<ActionResult, Segment> {
  if (!obj.root) {
    obj.root = {
      pathname: "/",
      state: null,
    };
  }
}

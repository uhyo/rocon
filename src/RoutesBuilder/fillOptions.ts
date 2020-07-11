import { PathLocationComposer } from "../LocationComposer/PathLocationComposer";
import { RoutesOptions } from "./RoutesOptions";

/**
 * Fill missing fields in RoutesOptions object.
 */
export function fillOptions(
  obj: Partial<RoutesOptions>
): asserts obj is RoutesOptions {
  if (!obj.composer) {
    obj.composer = new PathLocationComposer();
  }
  if (!obj.root) {
    obj.root = {
      pathname: "/",
      state: null,
    };
  }
}

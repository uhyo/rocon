import { PathLocationComposer } from "../LocationComposer/PathLocationComposer";
import { RoutesBuilderOptions } from "./RoutesBuilderOptions";

/**
 * Fill missing fields in RoutesOptions object.
 */
export function fillOptions(
  obj: Partial<RoutesBuilderOptions>
): asserts obj is RoutesBuilderOptions {
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

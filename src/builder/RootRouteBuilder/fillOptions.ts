import { RootRouteBuilderOptions } from ".";

/**
 * @package
 */
export function fillOptions(
  options: Partial<RootRouteBuilderOptions>
): asserts options is RootRouteBuilderOptions {
  if (!options.root) {
    options.root = {
      pathname: "/",
      state: null,
    };
  }
}

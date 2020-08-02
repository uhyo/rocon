import type { Location } from "../Location";

/**
 * Object that represents one resolved route.
 */
export type ResolvedRoute<Value> = {
  // TODO: rename
  readonly route: Value;
  readonly match: unknown;
  readonly location: Location;
};

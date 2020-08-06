import type { Location } from "../Location";

/**
 * Object that represents one resolved route.
 */
export type ResolvedRoute<Value> = {
  readonly route: Value;
  readonly match: unknown;
  readonly currentLocation: Location;
  readonly location: Location;
};

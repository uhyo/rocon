import type { RouteRecordType } from "../../builder/RouteRecord";
import type { MatchingRouteRecord } from "../../builder/RouteRecord/MatchingRouteRecord";
import type { Location } from "../Location";

/**
 * Object that represents one resolved route.
 */
export type ResolvedRoute<ActionType> = {
  readonly route:
    | RouteRecordType<ActionType, never, true>
    | MatchingRouteRecord<ActionType, unknown, never, true>;
  readonly match: unknown;
  readonly location: Location;
};

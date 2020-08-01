import type { RouteRecordType } from "../../builder/RouteRecord";
import type { MatchingRouteRecord } from "../../builder/RouteRecord/MatchingRouteRecord";
import type { Location } from "../../LocationComposer/Location";

/**
 * Object that represents one resolved route.
 */
export type ResolvedRoute<ActionType, Match> = {
  // TODO: reconsider result type
  readonly route: // TODO: test: resolved should always have action
  | RouteRecordType<ActionType, Match, true>
    | MatchingRouteRecord<ActionType, unknown, Match, true>;
  readonly match: Match;
  readonly location: Location;
};

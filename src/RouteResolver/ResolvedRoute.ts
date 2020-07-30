import type { Location } from "../LocationComposer/Location";
import type { RouteRecordType } from "../RouteBuilder/RouteRecord";
import type { MatchingRouteRecord } from "../RouteBuilder/RouteRecord/WildcardRouteRecord";

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

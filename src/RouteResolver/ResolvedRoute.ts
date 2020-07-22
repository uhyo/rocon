import type { Location } from "../LocationComposer/Location";
import type { RouteRecordType } from "../RouteRecord";
import type { WildcardRouteRecord } from "../RouteRecord/WildcardRouteRecord";

/**
 * Object that represents one resolved route.
 */
export type ResolvedRoute<ActionType, Match> = {
  // TODO: reconsider result type
  readonly route:
    | RouteRecordType<ActionType, Match>
    | WildcardRouteRecord<ActionType, Match>;
  readonly match: Match;
  readonly location: Location;
};

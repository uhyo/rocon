import { BaseState, Location } from "../LocationComposer/Location";
import { RouteRecordType } from "../RoutesBuilder/RouteRecord";

/**
 * Object that represents one resolved route.
 */
export type ResolvedRoute<ActionType, Match> = {
  readonly route: RouteRecordType<BaseState, ActionType, Match>;
  readonly match: Match;
  readonly location: Location<BaseState>;
};

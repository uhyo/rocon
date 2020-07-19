import { BaseState, Location } from "../LocationComposer/Location";
import { RouteRecordType } from "../RoutesBuilder/RouteRecord";

/**
 * Object that represents one resolved route.
 */
export type ResolvedRoute<ActionType, Matches> = {
  readonly route: RouteRecordType<BaseState, ActionType>;
  readonly location: Location<BaseState>;
};

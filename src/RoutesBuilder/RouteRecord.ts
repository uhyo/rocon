import type { Location } from "../LocationComposer/Location";
import type {
  RouteDefinitionByState,
  RoutesDefinition,
  StateOfRouteDefinition,
} from "./RoutesDefinitionObject";

/**
 * Route object internally stored in RoutesBuilder.
 */
export type RouteRecord<State, ActionResult> = RouteDefinitionByState<
  State,
  ActionResult
> & {
  location: Location<State>;
};

export type RoutesDefinitionToRouteRecords<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>
> = {
  [P in keyof Defs]: RouteRecord<StateOfRouteDefinition<Defs[P]>, ActionResult>;
};

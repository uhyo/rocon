import { RouteDefinition } from "./RoutesDefinitionObject";

/**
 * Special route definition for wildcard route.
 */
export type WildcardRouteDefinition<Match, ActionResult> = {
  key: string;
  definition: RouteDefinition<Match, ActionResult>;
};

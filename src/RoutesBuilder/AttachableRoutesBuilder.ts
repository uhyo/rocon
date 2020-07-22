import { RoutesBuilder } from ".";
import { RoutesDefinitionToRouteRecords } from "../RouteRecord";
import { RouteResolver } from "../RouteResolver";
import { RouteDefinition } from "./RoutesDefinitionObject";

export interface AttachableRoutesBuilder<
  ActionResult,
  Defs extends Record<string, RouteDefinition<ActionResult, Wildcard>>,
  HasWildcard extends boolean,
  Wildcard
> {
  getRawBuilder(): RoutesBuilder<ActionResult, Defs, HasWildcard, Wildcard>;
  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Wildcard>
  >;
}

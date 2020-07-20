import { RoutesBuilder } from ".";
import { RouteResolver } from "../RouteResolver";
import { RoutesDefinitionToRouteRecords } from "./RouteRecord";
import { RouteDefinition } from "./RoutesDefinitionObject";

export interface AttachableRoutesBuilder<
  ActionResult,
  Defs extends Record<string, RouteDefinition<Wildcard, ActionResult>>,
  Wildcard
> {
  getRawBuilder(): RoutesBuilder<ActionResult, Defs, Wildcard>;
  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs>
  >;
}

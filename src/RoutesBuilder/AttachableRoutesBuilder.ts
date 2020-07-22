import { RoutesBuilder } from ".";
import type { RoutesDefinitionToRouteRecords } from "../RouteRecord";
import { RouteResolver } from "../RouteResolver";
import type { RouteDefinition } from "./RoutesDefinitionObject";
import type { WildcardFlagType } from "./WildcardFlagType";

export interface AttachableRoutesBuilder<
  ActionResult,
  Defs extends Record<string, RouteDefinition<ActionResult, Wildcard>>,
  WildcardFlag extends WildcardFlagType,
  Wildcard
> {
  getRawBuilder(): RoutesBuilder<ActionResult, Defs, WildcardFlag, Wildcard>;
  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Wildcard>
  >;
}

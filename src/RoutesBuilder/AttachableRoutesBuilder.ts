import { RoutesBuilder } from ".";
import { RouteResolver } from "../RouteResolver";
import type { RouteDefinition } from "./RoutesDefinitionObject";
import type { WildcardFlagType } from "./WildcardFlagType";

export interface AttachableRoutesBuilder<
  ActionResult,
  Defs extends Record<string, RouteDefinition<ActionResult, Match>>,
  WildcardFlag extends WildcardFlagType,
  Match
> {
  getRawBuilder(): RoutesBuilder<ActionResult, Defs, WildcardFlag, Match>;
  getResolver(): RouteResolver<ActionResult, string>;
}

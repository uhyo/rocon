import { RoutesBuilder } from ".";
import { RouteResolver } from "../RouteResolver";

export interface AttachableRoutesBuilder<ActionResult> {
  getRawBuilder(): RoutesBuilder<ActionResult>;
  getResolver(): RouteResolver<ActionResult, string>;
}

import { RoutesBuilder } from ".";
import { RouteResolver } from "../RouteResolver";

export interface AttachableRoutesBuilder<ActionResult, Segment> {
  getRawBuilder(): RoutesBuilder<ActionResult, Segment>;
  getResolver(): RouteResolver<ActionResult, Segment>;
}

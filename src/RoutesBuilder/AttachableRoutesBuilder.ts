import { BuilderLink } from ".";
import { RouteResolver } from "../RouteResolver";

export interface AttachableRoutesBuilder<ActionResult, Segment> {
  getBuilderLink(): BuilderLink<ActionResult, Segment>;
  getResolver(): RouteResolver<ActionResult, Segment>;
}

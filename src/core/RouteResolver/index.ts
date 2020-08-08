import { BuilderLink } from "../BuilderLink";
import type { BaseState, Location } from "../Location";
import { resolveChain } from "./resolveChain";
import { ResolvedRoute } from "./ResolvedRoute";

/**
 * Object that resolves given URL to a Route.
 */
export class RouteResolver<ActionResult, Segment, Value> {
  readonly link: BuilderLink<ActionResult, Segment, Value>;
  constructor(link: BuilderLink<ActionResult, Segment, Value>) {
    this.link = link;
  }

  resolve(location: Location<BaseState>): Array<ResolvedRoute<Value>> {
    return resolveChain(this.link, location, {
      pathname: "/",
      state: null,
    });
  }
}

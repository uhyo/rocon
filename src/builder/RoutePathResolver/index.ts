import { Location } from "../../core/Location";
import { RouteResolver } from "../../core/RouteResolver";
import { ResolvedRoute } from "../../core/RouteResolver/ResolvedRoute";
import {
  AttachableRouteBuilder,
  RouteBuilderLinkValue,
} from "../RouteBuilderLink";
import { RouteRecordType } from "../RouteRecord";

export class RoutePathResolver<ActionResult, Segment> {
  static getFromBuilder<ActionResult, Segment>(
    builder: AttachableRouteBuilder<ActionResult, Segment>
  ): RoutePathResolver<ActionResult, Segment> {
    return new RoutePathResolver(builder.getBuilderLink().resolver);
  }

  #resolver: RouteResolver<
    ActionResult,
    Segment,
    RouteBuilderLinkValue<ActionResult>
  >;
  constructor(
    resolver: RouteResolver<
      ActionResult,
      Segment,
      RouteBuilderLinkValue<ActionResult>
    >
  ) {
    this.#resolver = resolver;
  }

  resolve(
    location: Location
  ): Array<ResolvedRoute<RouteRecordType<ActionResult, never, true>>> {
    return this.#resolver.resolve(location).filter(isResultWithAction);
  }

  /**
   * Resolve given location and return the result of running associated action.
   * If multiple locations are resolved, the first one is used.
   */
  resolveAction(location: Location): ActionResult | undefined {
    const res = this.resolve(location)[0];
    if (res === undefined) {
      return undefined;
    }
    return res.route.action(res.match as never);
  }
}

function isResultWithAction<ActionResult>(
  res: ResolvedRoute<RouteRecordType<ActionResult, never, boolean>>
): res is ResolvedRoute<RouteRecordType<ActionResult, never, true>> {
  return !!res.route.action;
}

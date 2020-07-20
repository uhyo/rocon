import { LocationComposer } from "../LocationComposer";
import { BaseState, Location } from "../LocationComposer/Location";
import { RouteRecordsBase } from "../RoutesBuilder";
import { RouteRecordType } from "../RoutesBuilder/RouteRecord";
import { wildcardRouteKey } from "../RoutesBuilder/symbols";
import { WildcardRouteRecordObject } from "../RoutesBuilder/WildcardRouteRecord";
import { ResolvedRoute } from "./ResolvedRoute";

/**
 * Object that resolves given URL to a Route.
 */
export class RouteResolver<
  ActionResult,
  Routes extends RouteRecordsBase<ActionResult> & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    readonly [wildcardRouteKey]?: WildcardRouteRecordObject<any, ActionResult>;
  }
> {
  #routes: Routes;
  #composer: LocationComposer<string>;
  constructor(routes: Routes, composer: LocationComposer<string>) {
    this.#routes = routes;
    this.#composer = composer;
  }

  resolve(
    location: Location<BaseState>
  ): Array<ResolvedRoute<ActionResult, {}>> {
    const composer = this.#composer;
    const decomposed = composer.decompose(location);
    return decomposed.flatMap(([seg, next]) => {
      const nextRoute = this.resolveSegment(seg);
      if (nextRoute === undefined) {
        return [];
      }
      if (composer.isLeaf(next)) {
        return [
          {
            route: nextRoute,
            match: {},
            location: next,
          },
        ];
      }
      const childBuilder = nextRoute.getBuilder();
      if (childBuilder === undefined) {
        return [
          {
            route: nextRoute,
            match: {},
            location: next,
          },
        ];
      }
      return childBuilder.getResolver().resolve(next);
    });
  }

  private resolveSegment(
    segment: string
  ): RouteRecordType<ActionResult, {}> | undefined {
    const route = this.#routes[segment];
    if (route !== undefined) {
      return route;
    }
    const wildcardRoute = this.#routes[wildcardRouteKey];
    if (wildcardRoute !== undefined) {
      // return wildcardRoute.definition;
    }
    return route;
  }
}

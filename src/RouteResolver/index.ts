import { LocationComposer } from "../LocationComposer";
import { BaseState, Location } from "../LocationComposer/Location";
import { RouteRecordType } from "../RoutesBuilder/RouteRecord";

type ResolvedRoutes<ActionResult> = Array<
  readonly [RouteRecordType<BaseState, ActionResult>, Location<BaseState>]
>;

/**
 * Object that resolves given URL to a Route.
 */
export class RouteResolver<
  ActionResult,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Routes extends Record<string, RouteRecordType<any, ActionResult>>
> {
  #routes: Routes;
  #composer: LocationComposer<string>;
  constructor(routes: Routes, composer: LocationComposer<string>) {
    this.#routes = routes;
    this.#composer = composer;
  }

  resolve(location: Location<BaseState>): ResolvedRoutes<ActionResult> {
    const composer = this.#composer;
    const decomposed = composer.decompose(location);
    return decomposed.flatMap(([seg, next]) => {
      const nextRoute = this.#routes[seg];
      if (nextRoute === undefined) {
        return [];
      }
      if (composer.isLeaf(next)) {
        return [[nextRoute, next]];
      }
      const childBuilder = nextRoute.getBuilder();
      if (childBuilder === undefined) {
        return [[nextRoute, next]];
      }
      return childBuilder.getResolver().resolve(next);
    });
  }
}

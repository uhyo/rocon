import { LocationComposer } from "../LocationComposer";
import { BaseState, Location } from "../LocationComposer/Location";
import {
  RouteRecordType,
  StateOfRouteRecordType,
} from "../RoutesBuilder/RouteRecord";

type ResolvedRoutes<ActionResult, State extends BaseState> = Array<
  State extends BaseState
    ? readonly [RouteRecordType<State, ActionResult>, Location<State>]
    : readonly [RouteRecordType<BaseState, ActionResult>, Location<BaseState>]
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

  resolve(
    location: Location<BaseState>
  ): ResolvedRoutes<
    ActionResult,
    StateOfRouteRecordType<Routes[keyof Routes]>
  > {
    const decomposed = this.#composer.decompose(location);
    return decomposed.flatMap(([seg, next]) => {
      const nextRoute = this.#routes[seg];
      if (nextRoute === undefined) {
        return [];
      }
      return [[nextRoute, next] as const];
    }) as ResolvedRoutes<
      ActionResult,
      StateOfRouteRecordType<Routes[keyof Routes]>
    >;
  }
}

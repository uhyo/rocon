import { LocationComposer } from "../LocationComposer";
import { BaseState, Location } from "../LocationComposer/Location";
import { RouteRecordType } from "../RoutesBuilder/RouteRecord";

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

  resolve(location: Location<BaseState>): null {
    // TODO: implement this
    return null;
  }
}

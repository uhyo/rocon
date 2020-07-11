import type { Location } from "../LocationComposer/Location";
import { fillOptions } from "./fillOptions";
import type {
  RouteRecord,
  RoutesDefinitionToRouteRecords,
} from "./RouteRecord";
import type { RoutesDefinition } from "./RoutesDefinitionObject";
import type { RoutesOptions } from "./RoutesOptions";

/**
 * Abstract Builder to define routes.
 */
export class RoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>
> {
  static init<ActionResult>(
    options: Partial<RoutesOptions> = {}
  ): RoutesBuilder<ActionResult, {}> {
    fillOptions(options);
    return new RoutesBuilder<ActionResult, {}>(options);
  }

  readonly options: Readonly<RoutesOptions>;
  #rootLocation: Location;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #routes: Record<string, RouteRecord<any, ActionResult>> = Object.create(null);

  private constructor(options: RoutesOptions) {
    this.options = options;
    this.#rootLocation = options.composer.getRoot();
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D> {
    const result = new RoutesBuilder(this.options);
    const routes = result.#routes;
    Object.assign(routes, this.#routes);
    for (const key of Object.getOwnPropertyNames(defs) as (keyof D &
      string)[]) {
      routes[key] = {
        ...defs[key],
        getLocation: () =>
          this.options.composer.compose(this.#rootLocation, key),
      };
    }
    return result as RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D>;
  }

  getRoutes(): RoutesDefinitionToRouteRecords<ActionResult, Defs> {
    return (this.#routes as unknown) as RoutesDefinitionToRouteRecords<
      ActionResult,
      Defs
    >;
  }
}

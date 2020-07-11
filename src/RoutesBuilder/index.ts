import type { Location } from "../LocationComposer/Location";
import { fillOptions } from "./fillOptions";
import {
  RouteRecord,
  RouteRecordConfig,
  RouteRecordType,
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
  #routes: Record<string, RouteRecordType<any, ActionResult>> = Object.create(
    null
  );
  #routeRecordConfig: RouteRecordConfig;

  private constructor(options: RoutesOptions) {
    this.options = options;
    const rootLocation = options.composer.getRoot();
    this.#rootLocation = rootLocation;
    this.#routeRecordConfig = {
      composer: options.composer,
      rootLocation,
    };
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D> {
    const result = new RoutesBuilder(this.options);
    const routes = result.#routes;
    Object.assign(routes, this.#routes);
    for (const key of Object.getOwnPropertyNames(defs) as (keyof D &
      string)[]) {
      routes[key] = new RouteRecord(
        this.#routeRecordConfig,
        key,
        defs[key].action
      );
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

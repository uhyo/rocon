import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import { RouteResolver } from "../RouteResolver";
import { fillOptions } from "./fillOptions";
import { RouteRecord } from "./RouteRecord";
import type {
  RouteRecordConfig,
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
} from "./RouteRecord";
import type { RoutesBuilderOptions } from "./RoutesBuilderOptions";
import type { RoutesDefinition } from "./RoutesDefinitionObject";
import { routesBuilderSpecies } from "./symbols";

export type RoutesBuilderConstructor = {
  new <ActionResult, Defs extends RoutesDefinition<ActionResult>>(
    options: RoutesBuilderOptions
  ): RoutesBuilder<ActionResult, Defs>;
};

/**
 * Abstract Builder to define routes.
 */
export class RoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>
> {
  static init<ActionResult>(
    options: Partial<RoutesBuilderOptions> = {}
  ): RoutesBuilder<ActionResult, {}> {
    fillOptions(options);
    return new RoutesBuilder<ActionResult, {}>(options);
  }

  readonly [routesBuilderSpecies]: RoutesBuilderConstructor = RoutesBuilder;

  #composer: LocationComposer<string>;
  #rootLocation: Location;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #routes: Record<string, RouteRecordType<any, ActionResult>> = Object.create(
    null
  );
  #routeRecordConfig: RouteRecordConfig;

  constructor(options: RoutesBuilderOptions) {
    this.#composer = options.composer;
    this.#rootLocation = options.root;
    this.#routeRecordConfig = {
      composer: options.composer,
      getRootLocation: () => this.#rootLocation,
      changeRootLocation: (target, newRoot) => {
        target.#rootLocation = newRoot;
      },
    };
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D> {
    const result = new this[routesBuilderSpecies]<
      ActionResult,
      Omit<Defs, keyof D> & D
    >({
      composer: this.#composer,
      root: this.#rootLocation,
    });
    const routes = result.#routes;
    Object.assign(routes, this.#routes);
    for (const key of Object.getOwnPropertyNames(defs) as (keyof D &
      string)[]) {
      routes[key] = new RouteRecord(
        result.#routeRecordConfig,
        key,
        defs[key].action
      );
    }
    return result as RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D>;
  }

  getRoutes(): Readonly<RoutesDefinitionToRouteRecords<ActionResult, Defs>> {
    return (this.#routes as unknown) as RoutesDefinitionToRouteRecords<
      ActionResult,
      Defs
    >;
  }

  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs>
  > {
    return new RouteResolver(this.getRoutes(), this.#composer);
  }
}

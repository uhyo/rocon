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
import { routesBuilderSpecies, wildcardRouteKey } from "./symbols";
import type { WildcardRouteRecord } from "./WildcardRouteRecord";

export type RoutesBuilderConstructor = {
  new <ActionResult, Defs extends RoutesDefinition<ActionResult>>(
    options: RoutesBuilderOptions
  ): RoutesBuilder<ActionResult, Defs>;
};

export type RouteRecordsBase<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteRecordType<any, ActionResult>
>;

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
  #routes: RouteRecordsBase<ActionResult> = Object.create(null);
  #wildcardRoute: WildcardRouteRecord | undefined = undefined;
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

  /**
   * Add a wildcard route and return a new RoutesBuilder.
   */
  wildcard(key: string): RoutesBuilder<ActionResult, Defs> {
    const result = new this[routesBuilderSpecies]<ActionResult, Defs>({
      composer: this.#composer,
      root: this.#rootLocation,
    });
    result.#wildcardRoute = {
      key,
    };
    return result;
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs> & {
      readonly [wildcardRouteKey]?: WildcardRouteRecord;
    }
  > {
    const routes = (this.#routes as unknown) as RoutesDefinitionToRouteRecords<
      ActionResult,
      Defs
    >;
    if (this.#wildcardRoute) {
      return {
        ...routes,
        [wildcardRouteKey]: this.#wildcardRoute,
      };
    } else {
      return routes as Readonly<typeof routes>;
    }
  }

  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs>
  > {
    return new RouteResolver(this.getRoutes(), this.#composer);
  }
}

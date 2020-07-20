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
  new <ActionResult, Defs extends RoutesDefinition<ActionResult>, Wildcard>(
    options: RoutesBuilderOptions
  ): RoutesBuilder<ActionResult, Defs, Wildcard>;
};

export type RouteRecordsBase<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteRecordType<ActionResult, any>
>;

/**
 * Abstract Builder to define routes.
 */
export class RoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  Wildcard
> {
  static init<ActionResult>(
    options: Partial<RoutesBuilderOptions> = {}
  ): RoutesBuilder<ActionResult, {}, {}> {
    fillOptions(options);
    return new RoutesBuilder<ActionResult, {}, {}>(options);
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
  ): RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D, Wildcard> {
    const result = new this[routesBuilderSpecies]<
      ActionResult,
      Omit<Defs, keyof D> & D,
      Wildcard
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
    return result as RoutesBuilder<
      ActionResult,
      Omit<Defs, keyof D> & D,
      Wildcard
    >;
  }

  /**
   * Add a wildcard route and return a new RoutesBuilder.
   */
  wildcard<Key extends string, ValueType>(
    key: Key
  ): RoutesBuilder<
    ActionResult,
    Defs,
    Wildcard &
      {
        [K in Key]: ValueType;
      }
  > {
    const result = new this[routesBuilderSpecies]<
      ActionResult,
      Defs,
      Wildcard &
        {
          [K in Key]: ValueType;
        }
    >({
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

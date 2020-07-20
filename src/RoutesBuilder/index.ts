import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import { RouteRecord } from "../RouteRecord";
import type {
  RouteRecordConfig,
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
} from "../RouteRecord";
import { RouteResolver } from "../RouteResolver";
import type { AttachableRoutesBuilder } from "./AttachableRoutesBuilder";
import { fillOptions } from "./fillOptions";
import type { RoutesBuilderOptions } from "./RoutesBuilderOptions";
import type {
  RouteDefinition,
  RoutesDefinition,
} from "./RoutesDefinitionObject";
import { wildcardRouteKey } from "./symbols";
import {
  WildcardRouteRecord,
  WildcardRouteRecordObject,
} from "./WildcardRouteRecord";

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
> implements AttachableRoutesBuilder<ActionResult, Defs, Wildcard> {
  static init<ActionResult>(
    options: Partial<RoutesBuilderOptions> = {}
  ): RoutesBuilder<ActionResult, {}, {}> {
    fillOptions(options);
    return new RoutesBuilder<ActionResult, {}, {}>(options);
  }

  #composer: LocationComposer<string>;
  #rootLocation: Location;
  #routes: RouteRecordsBase<ActionResult> = Object.create(null);
  #wildcardRoute:
    | WildcardRouteRecordObject<ActionResult, Wildcard>
    | undefined = undefined;
  #routeRecordConfig: RouteRecordConfig;

  private constructor(options: RoutesBuilderOptions) {
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
    const result = new RoutesBuilder<
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
    key: Key,
    routeDefinition: RouteDefinition<
      ActionResult,
      Wildcard &
        {
          [K in Key]: ValueType;
        }
    >
  ): RoutesBuilder<
    ActionResult,
    Defs,
    Wildcard &
      {
        [K in Key]: ValueType;
      }
  > {
    const result = new RoutesBuilder<
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
      matchKey: key,
      route: new WildcardRouteRecord(
        result.#routeRecordConfig,
        // TypeScript requires this `as` but this should be true because Key extends string.
        key as Extract<Key, string>,
        routeDefinition.action
      ),
    };
    return result;
  }

  getRawBuilder(): this {
    return this;
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs> & {
      readonly [wildcardRouteKey]?: WildcardRouteRecordObject<
        ActionResult,
        Wildcard
      >;
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

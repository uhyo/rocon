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

export type RouteRecordsBase<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteRecordType<ActionResult, any>
>;

declare const wildcardCovariance: unique symbol;

/**
 * Abstract Builder to define routes.
 */
export class RoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  HasWildcard extends boolean,
  Wildcard
>
  implements
    AttachableRoutesBuilder<ActionResult, Defs, HasWildcard, Wildcard> {
  // RoutesBuilder is covariant upon Wildcard
  declare readonly [wildcardCovariance]: Wildcard;

  static init<ActionResult, Match = {}>(
    options: Partial<RoutesBuilderOptions> = {}
  ): RoutesBuilder<ActionResult, {}, false, Match> {
    fillOptions(options);
    return new RoutesBuilder(options);
  }

  #composer: LocationComposer<string>;
  #rootLocation: Location;
  #routeRecordConfig: RouteRecordConfig;
  #parentRoute?: RouteRecordType<ActionResult, {}> = undefined;
  #routes: RouteRecordsBase<ActionResult> = Object.create(null);
  #wildcardRoute:
    | WildcardRouteRecordObject<ActionResult, Wildcard>
    | undefined = undefined;

  private constructor(options: RoutesBuilderOptions) {
    this.#composer = options.composer;
    this.#rootLocation = options.root;
    this.#routeRecordConfig = {
      composer: options.composer,
      getRootLocation: (match) => {
        if (this.#parentRoute !== undefined) {
          return this.#parentRoute.getLocation(match);
        }
        return this.#rootLocation;
      },
      changeRootLocation: (target, newRoot) => {
        target.#rootLocation = newRoot;
      },
      attachBuilderToRoute: (builder, route) => {
        builder.#parentRoute = route;
      },
    };
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): RoutesBuilder<
    ActionResult,
    Omit<Defs, keyof D> & D,
    HasWildcard,
    Wildcard
  > {
    const result = new RoutesBuilder<
      ActionResult,
      Omit<Defs, keyof D> & D,
      HasWildcard,
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
    result.#wildcardRoute = this.#wildcardRoute;
    result.#parentRoute = this.#parentRoute;
    return result as RoutesBuilder<
      ActionResult,
      Omit<Defs, keyof D> & D,
      HasWildcard,
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
    true,
    Wildcard &
      {
        [K in Key]: ValueType;
      }
  > {
    const result = new RoutesBuilder<
      ActionResult,
      Defs,
      true,
      Wildcard &
        {
          [K in Key]: ValueType;
        }
    >({
      composer: this.#composer,
      root: this.#rootLocation,
    });
    result.#routes = this.#routes;
    result.#wildcardRoute = {
      matchKey: key,
      route: new WildcardRouteRecord(
        result.#routeRecordConfig,
        // TypeScript requires this `as` but this should be true because Key extends string.
        key as Extract<Key, string>,
        routeDefinition.action
      ),
    };
    result.#parentRoute = this.#parentRoute;
    return result;
  }

  getRawBuilder(): this {
    return this;
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Wildcard> &
      (HasWildcard extends false
        ? {}
        : {
            readonly [wildcardRouteKey]: WildcardRouteRecordObject<
              ActionResult,
              Wildcard
            >;
          })
  > {
    const routes = (this.#routes as unknown) as RoutesDefinitionToRouteRecords<
      ActionResult,
      Defs,
      Wildcard
    >;
    if (this.#wildcardRoute) {
      return {
        ...routes,
        [wildcardRouteKey]: this.#wildcardRoute,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return routes as any;
    }
  }

  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Wildcard>
  > {
    return new RouteResolver(this.getRoutes(), this.#composer);
  }
}

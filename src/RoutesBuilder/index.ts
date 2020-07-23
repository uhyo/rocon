import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import { RouteRecord, WildcardInRouteRecords } from "../RouteRecord";
import type {
  RouteRecordConfig,
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
} from "../RouteRecord";
import {
  WildcardRouteRecord,
  WildcardRouteRecordObject,
} from "../RouteRecord/WildcardRouteRecord";
import { RouteResolver } from "../RouteResolver";
import type { AttachableRoutesBuilder } from "./AttachableRoutesBuilder";
import { fillOptions } from "./fillOptions";
import type { RoutesBuilderOptions } from "./RoutesBuilderOptions";
import type {
  RouteDefinition,
  RoutesDefinition,
} from "./RoutesDefinitionObject";
import { wildcardRouteKey } from "./symbols";
import { WildcardFlagType } from "./WildcardFlagType";

export type RouteRecordsBase<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteRecordType<ActionResult, any, any>
>;

declare const wildcardCovariance: unique symbol;

/**
 * Abstract Builder to define routes.
 */
export class RoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  WildcardFlag extends WildcardFlagType,
  Match
> implements AttachableRoutesBuilder<ActionResult, Defs, WildcardFlag, Match> {
  // RoutesBuilder is covariant upon Wildcard
  declare readonly [wildcardCovariance]: Match;

  static init<ActionResult, Match = {}>(
    options: Partial<RoutesBuilderOptions> = {}
  ): RoutesBuilder<ActionResult, {}, "none", Match> {
    fillOptions(options);
    return new RoutesBuilder(options);
  }

  #composer: LocationComposer<string>;
  #rootLocation: Location;
  #routeRecordConfig: RouteRecordConfig;
  #parentRoute?: RouteRecordType<ActionResult, {}, boolean> = undefined;
  #routes: RouteRecordsBase<ActionResult> = Object.create(null);
  #wildcardRoute:
    | WildcardRouteRecordObject<ActionResult, Match, boolean>
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
      attachBuilderToRoute: (builder, route) => {
        builder.#parentRoute = route;
      },
    };
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D, WildcardFlag, Match> {
    const result = new RoutesBuilder<
      ActionResult,
      Omit<Defs, keyof D> & D,
      WildcardFlag,
      Match
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
      WildcardFlag,
      Match
    >;
  }

  /**
   * Add a wildcard route and return a new RoutesBuilder.
   */
  wildcard<
    Key extends string,
    ValueType,
    RD extends RouteDefinition<
      ActionResult,
      Match &
        {
          [K in Key]: ValueType;
        }
    >
  >(
    key: Key,
    routeDefinition: RD
  ): RoutesBuilder<
    ActionResult,
    Defs,
    undefined extends RD["action"] ? "noaction" : "hasaction",
    Match &
      {
        [K in Key]: ValueType;
      }
  > {
    const result = new RoutesBuilder<
      ActionResult,
      Defs,
      undefined extends RD["action"] ? "noaction" : "hasaction",
      Match &
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
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Match> &
      WildcardInRouteRecords<ActionResult, WildcardFlag, Match>
  > {
    const routes = (this.#routes as unknown) as RoutesDefinitionToRouteRecords<
      ActionResult,
      Defs,
      Match
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
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Match>
  > {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new RouteResolver(this.getRoutes() as any, this.#composer);
  }
}

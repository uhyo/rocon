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
import { assertNever } from "../util/assert";
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
 * State of RoutesBuilder.
 * - unattached: this builder is not attached to a parent.
 * - attached: this builder is attached to a parent.
 * - invalidated: this builder is invalidated.
 */
type RoutesBuilderState = "unattached" | "attached" | "invalidated";

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

  #state: RoutesBuilderState = "unattached";
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
        if (builder.#state !== "unattached") {
          throw new Error("A builder cannot be attached more than once.");
        }
        builder.#parentRoute = route;
        builder.#state = "attached";
      },
    };
  }

  private checkInvalidation() {
    if (this.#state === "invalidated") {
      throw new Error("This RoutesBuilder is already invalidated.");
    }
  }

  /**
   * Inherit internal information to a builder generated from this.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private inheritTo(target: RoutesBuilder<ActionResult, any, any, any>): void {
    target.#parentRoute = this.#parentRoute;
    switch (this.#state) {
      case "unattached": {
        break;
      }
      case "attached": {
        // inherit attachedness to child
        this.#state = "invalidated";
        // this.#parentRoute should always exist here but we use ?. here for ease
        this.#parentRoute?.attach(target);
        break;
      }
      case "invalidated": {
        this.checkInvalidation();
        break;
      }
      default: {
        assertNever(this.#state);
      }
    }
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D, WildcardFlag, Match> {
    this.checkInvalidation();

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
    this.inheritTo(result);
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
    this.checkInvalidation();
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
    this.inheritTo(result);
    return result;
  }

  getRawBuilder(): this {
    return this;
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Match> &
      WildcardInRouteRecords<ActionResult, WildcardFlag, Match>
  > {
    this.checkInvalidation();
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

  getResolver(): RouteResolver<ActionResult, string> {
    this.checkInvalidation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new RouteResolver(this.#composer, (segment) => {
      const route = this.#routes[segment];
      if (route !== undefined) {
        return {
          type: "normal",
          route,
        };
      }
      const wildcardRoute = this.#wildcardRoute;
      if (wildcardRoute !== undefined) {
        return {
          type: "wildcard",
          route: wildcardRoute.route,
        };
      }
      return undefined;
    });
  }
}

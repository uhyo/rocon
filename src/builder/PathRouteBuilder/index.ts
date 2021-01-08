import { BuilderLink } from "../../core/BuilderLink";
import { isString } from "../../validator";
import { PathLocationComposer } from "../composers/PathLocationComposer";
import { AttachableRouteBuilder, RouteBuilderLink } from "../RouteBuilderLink";
import {
  PathRouteRecord,
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
} from "../RouteRecord";
import {
  MatchingRouteRecord,
  MatchingRouteRecordObject,
} from "../RouteRecord/MatchingRouteRecord";
import type {
  ActionType,
  RouteDefinition,
  RoutesDefinition,
} from "../RoutesDefinitionObject";
import type {
  ActionTypeToWildcardFlag,
  ExistingWildcardFlagType,
  WildcardFlagType,
} from "../WildcardFlagType";
import { isRootPath } from "./isRootPath";
import type { PathSingleRouteInterface } from "./PathSingleRouteInterface";

type RouteRecordsBase<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteRecordType<ActionResult, any, any>
>;

type AnyRouteType<
  ActionResult,
  WildcardFlag extends WildcardFlagType,
  Match
> = WildcardFlag extends ExistingWildcardFlagType
  ? MatchingRouteRecord<
      ActionResult,
      string,
      Match,
      WildcardFlag extends "hasaction" ? true : false
    >
  : undefined;

type ExactRouteType<
  ActionResult,
  WildcardFlag extends WildcardFlagType,
  Match
> = WildcardFlag extends ExistingWildcardFlagType
  ? PathRouteRecord<
      ActionResult,
      Match,
      WildcardFlag extends "hasaction" ? true : false
    >
  : undefined;

/**
 * Builder to define routes using pathname.
 */
export class PathRouteBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  AnyFlag extends WildcardFlagType,
  ExactFlag extends WildcardFlagType,
  Match
> implements AttachableRouteBuilder<ActionResult, string | undefined> {
  static init<ActionResult>(): PathRouteBuilder<
    ActionResult,
    {},
    "none",
    "none",
    {}
  > {
    return new PathRouteBuilder(
      new BuilderLink({
        composer: new PathLocationComposer(),
      })
    );
  }

  readonly #link: RouteBuilderLink<ActionResult, string | undefined>;
  #routes: RouteRecordsBase<ActionResult> = Object.create(null);
  #wildcardRoute:
    | MatchingRouteRecordObject<
        ActionResult,
        string | undefined,
        Match,
        boolean
      >
    | undefined = undefined;
  #exactRoute:
    | PathRouteRecord<ActionResult, Match, boolean>
    | undefined = undefined;

  private constructor(
    link: RouteBuilderLink<ActionResult, string | undefined>
  ) {
    this.#link = link;
    link.register(this, (value, remainingLocation) => {
      if (value === undefined) {
        // this is for exact route, so we check whether the route is exact
        if (!isRootPath(remainingLocation)) {
          return undefined;
        }
        const exactRoute = this.#exactRoute;
        return (
          exactRoute && {
            type: "normal",
            value: exactRoute,
            link: exactRoute.getAttachedBuilderLink(),
          }
        );
      }
      const route = this.#routes[value];
      if (route !== undefined) {
        return {
          type: "normal",
          value: route,
          link: route.getAttachedBuilderLink(),
        };
      }
      const wildcardRoute = this.#wildcardRoute;
      if (wildcardRoute !== undefined) {
        return {
          type: "matching",
          value: wildcardRoute.route,
          link: wildcardRoute.route.getAttachedBuilderLink(),
          matchKey: wildcardRoute.matchKey,
          matchValue: value,
        };
      }
      return undefined;
    });
  }

  /**
   * Add multiple routes at once and return a new Path route builder.
   */
  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): PathRouteBuilder<
    ActionResult,
    Omit<Defs, keyof D> & D,
    AnyFlag,
    ExactFlag,
    Match
  > {
    const result = new PathRouteBuilder<
      ActionResult,
      Omit<Defs, keyof D> & D,
      AnyFlag,
      ExactFlag,
      Match
    >(this.#link.inherit());
    const routes = result.#routes;
    Object.assign(routes, this.#routes);
    for (const key of Object.getOwnPropertyNames(defs) as (keyof D &
      string)[]) {
      routes[key] = new PathRouteRecord(result, key, defs[key].action);
    }
    result.#wildcardRoute = this.#wildcardRoute;
    result.#exactRoute = this.#exactRoute;
    return result;
  }

  /**
   * Add a route and return a new Path route builder.
   */
  route<Key extends string>(
    key: Key,
    callback?: (route: PathSingleRouteInterface<ActionResult, Match>) => void
  ): PathRouteBuilder<
    ActionResult,
    Key extends keyof Defs
      ? {
          [K in keyof Defs]: Key extends K
            ? RouteDefinition<ActionResult, Match>
            : Defs[K];
        }
      : {
          [K in keyof Defs | Key]: K extends keyof Defs
            ? Defs[K]
            : RouteDefinition<ActionResult, Match>;
        },
    AnyFlag,
    ExactFlag,
    Match
  > {
    const result = new PathRouteBuilder<
      ActionResult,
      Key extends keyof Defs
        ? {
            [K in keyof Defs]: Key extends K
              ? RouteDefinition<ActionResult, Match>
              : Defs[K];
          }
        : {
            [K in keyof Defs | Key]: K extends keyof Defs
              ? Defs[K]
              : RouteDefinition<ActionResult, Match>;
          },
      AnyFlag,
      ExactFlag,
      Match
    >(this.#link.inherit());
    const routes = result.#routes;
    Object.assign(routes, this.#routes);

    // collect information of route by calling callback.
    let action: ActionType<ActionResult, Match> | undefined;
    let attachedBuilder:
      | AttachableRouteBuilder<ActionResult, Match>
      | undefined;

    if (callback) {
      const intr: PathSingleRouteInterface<ActionResult, Match> = {
        action(a) {
          action = a;
          return this;
        },
        attach(builder: AttachableRouteBuilder<ActionResult, unknown>) {
          attachedBuilder = builder;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return builder as any;
        },
      };
      callback(intr);
    }

    const record = new PathRouteRecord<ActionResult, Match, boolean>(
      result,
      key,
      action
    );
    if (attachedBuilder !== undefined) {
      record.attach(attachedBuilder);
    }
    routes[key] = record;

    result.#wildcardRoute = this.#wildcardRoute;
    result.#exactRoute = this.#exactRoute;
    return result;
  }

  /**
   * Add a catch-all route and return a new Path route builder.
   */
  any<
    Key extends string,
    RD extends RouteDefinition<
      ActionResult,
      Match &
        {
          [K in Key]: string;
        }
    >
  >(
    key: Key,
    routeDefinition?: RD
  ): PathRouteBuilder<
    ActionResult,
    Defs,
    ActionTypeToWildcardFlag<RD["action"]>,
    ExactFlag,
    Match &
      {
        [K in Key]: string;
      }
  > {
    const result = new PathRouteBuilder<
      ActionResult,
      Defs,
      ActionTypeToWildcardFlag<RD["action"]>,
      ExactFlag,
      Match &
        {
          [K in Key]: string;
        }
    >(this.#link.inherit());
    result.#routes = this.#routes;
    result.#wildcardRoute = {
      matchKey: key,
      route: new MatchingRouteRecord(
        result,
        // TypeScript requires this `as` but this should be true because Key extends string.
        key as Extract<Key, string>,
        isString,
        routeDefinition?.action
      ),
    };
    return result;
  }

  /**
   * Add an exact route and return a new Path route builder.
   */
  exact<RD extends RouteDefinition<ActionResult, Match>>(
    routeDefinition: RD
  ): PathRouteBuilder<
    ActionResult,
    Defs,
    AnyFlag,
    ActionTypeToWildcardFlag<RD["action"]>,
    Match
  > {
    const result = new PathRouteBuilder<
      ActionResult,
      Defs,
      AnyFlag,
      ActionTypeToWildcardFlag<RD["action"]>,
      Match
    >(this.#link.inherit());
    result.#routes = this.#routes;
    result.#wildcardRoute = this.#wildcardRoute;
    result.#exactRoute = new PathRouteRecord(
      result,
      undefined,
      routeDefinition.action
    );
    return result;
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Match>
  > {
    const routes = (this.#routes as unknown) as RoutesDefinitionToRouteRecords<
      ActionResult,
      Defs,
      Match
    >;
    return routes;
  }

  /**
   * Shorthand for 'getRoutes()'
   */
  get _(): Readonly<RoutesDefinitionToRouteRecords<ActionResult, Defs, Match>> {
    return this.getRoutes();
  }

  /**
   * Route record of the any route.
   */
  get anyRoute(): AnyRouteType<ActionResult, AnyFlag, Match> {
    return this.#wildcardRoute?.route as AnyRouteType<
      ActionResult,
      AnyFlag,
      Match
    >;
  }

  /**
   * Route record of the exact route.
   */
  get exactRoute(): ExactRouteType<ActionResult, ExactFlag, Match> {
    return this.#exactRoute as ExactRouteType<ActionResult, ExactFlag, Match>;
  }

  getBuilderLink(): RouteBuilderLink<ActionResult, string | undefined> {
    return this.#link;
  }
}

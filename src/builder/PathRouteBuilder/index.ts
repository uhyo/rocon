import { BuilderLink } from "../../core/BuilderLink";
import { isString } from "../../validator";
import { PathLocationComposer } from "../composers/PathLocationComposer";
import { AttachableRouteBuilder, RouteBuilderLink } from "../RouteBuilderLink";
import {
  PathRouteRecord,
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
  WildcardInRouteRecords,
} from "../RouteRecord";
import {
  MatchingRouteRecord,
  MatchingRouteRecordObject,
} from "../RouteRecord/MatchingRouteRecord";
import type {
  RouteDefinition,
  RoutesDefinition,
} from "../RoutesDefinitionObject";
import { wildcardRouteKey } from "../symbols";
import type {
  ActionTypeToWildcardFlag,
  WildcardFlagType,
} from "../WildcardFlagType";

type RouteRecordsBase<ActionResult> = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RouteRecordType<ActionResult, any, any>
>;

/**
 * Builder to define routes using pathname.
 */
export class PathRouteBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  WildcardFlag extends WildcardFlagType,
  Match
> implements AttachableRouteBuilder<ActionResult, string> {
  static init<ActionResult, Match = {}>(): PathRouteBuilder<
    ActionResult,
    {},
    "none",
    Match
  > {
    return new PathRouteBuilder(
      new BuilderLink({
        composer: new PathLocationComposer(),
      })
    );
  }

  /**
   * Attach a newly created PathRouteBuilder to given route.
   */
  static attachTo<ActionResult, Match, HasAction extends boolean>(
    route: RouteRecordType<ActionResult, Match, HasAction>
  ): PathRouteBuilder<ActionResult, {}, "none", Match> {
    return route.attach(PathRouteBuilder.init());
  }

  readonly #link: RouteBuilderLink<ActionResult, string>;
  #routes: RouteRecordsBase<ActionResult> = Object.create(null);
  #wildcardRoute:
    | MatchingRouteRecordObject<ActionResult, string, Match, boolean>
    | undefined = undefined;

  private constructor(link: RouteBuilderLink<ActionResult, string>) {
    this.#link = link;
    link.register(this, (value) => {
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

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): PathRouteBuilder<
    ActionResult,
    Omit<Defs, keyof D> & D,
    WildcardFlag,
    Match
  > {
    const result = new PathRouteBuilder<
      ActionResult,
      Omit<Defs, keyof D> & D,
      WildcardFlag,
      Match
    >(this.#link.inherit());
    const routes = result.#routes;
    Object.assign(routes, this.#routes);
    for (const key of Object.getOwnPropertyNames(defs) as (keyof D &
      string)[]) {
      routes[key] = new PathRouteRecord(result, key, defs[key].action);
    }
    result.#wildcardRoute = this.#wildcardRoute;
    return result;
  }

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
    routeDefinition: RD
  ): PathRouteBuilder<
    ActionResult,
    Defs,
    ActionTypeToWildcardFlag<RD["action"]>,
    Match &
      {
        [K in Key]: string;
      }
  > {
    this.#link.checkInvalidation();

    const result = new PathRouteBuilder<
      ActionResult,
      Defs,
      undefined extends RD["action"] ? "noaction" : "hasaction",
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
        routeDefinition.action
      ),
    };
    return result;
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Match> &
      WildcardInRouteRecords<ActionResult, string, WildcardFlag, Match>
  > {
    this.#link.checkInvalidation();
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

  getBuilderLink(): RouteBuilderLink<ActionResult, string> {
    return this.#link;
  }
}

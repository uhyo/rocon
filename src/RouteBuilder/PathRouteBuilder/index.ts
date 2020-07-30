import { BuilderLink, RouteRecordsBase } from "../../BuilderLink";
import type { AttachableRouteBuilder } from "../../BuilderLink/AttachableRouteBuilder";
import type { BuilderLinkOptions } from "../../BuilderLink/BuilderLinkOptions";
import { PathLocationComposer } from "../../LocationComposer/PathLocationComposer";
import { RouteResolver } from "../../RouteResolver";
import { isString } from "../../validator";
import {
  PathRouteRecord,
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
  WildcardInRouteRecords,
} from "../RouteRecord";
import {
  WildcardRouteRecord,
  WildcardRouteRecordObject,
} from "../RouteRecord/WildcardRouteRecord";
import type {
  RouteDefinition,
  RoutesDefinition,
} from "../RoutesDefinitionObject";
import { wildcardRouteKey } from "../symbols";
import type {
  ActionTypeToWildcardFlag,
  WildcardFlagType,
} from "../WildcardFlagType";

export type PathRouteBuilderOptions<ActionResult> = Omit<
  BuilderLinkOptions<ActionResult, string>,
  "composer"
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
  static init<ActionResult, Match = {}>(
    options: Partial<PathRouteBuilderOptions<ActionResult>> = {}
  ): PathRouteBuilder<ActionResult, {}, "none", Match> {
    const op = {
      ...options,
      composer: new PathLocationComposer(),
    };
    const link = BuilderLink.init<ActionResult, string>(op);
    return new PathRouteBuilder(link);
  }

  /**
   * Attach a newly created PathRouteBuilder to given route.
   */
  static attachTo<ActionResult, Match, HasAction extends boolean>(
    route: RouteRecordType<ActionResult, Match, HasAction>
  ): PathRouteBuilder<ActionResult, {}, "none", Match> {
    return route.attach(PathRouteBuilder.init());
  }

  readonly #link: BuilderLink<ActionResult, string>;
  #routes: RouteRecordsBase<ActionResult> = Object.create(null);
  #wildcardRoute:
    | WildcardRouteRecordObject<ActionResult, string, Match, boolean>
    | undefined = undefined;

  private constructor(link: BuilderLink<ActionResult, string>) {
    this.#link = link;
    link.register(this);
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
      route: new WildcardRouteRecord(
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
      WildcardInRouteRecords<ActionResult, WildcardFlag, Match>
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

  getBuilderLink(): BuilderLink<ActionResult, string> {
    return this.#link;
  }

  getResolver(): RouteResolver<ActionResult, string> {
    return this.#link.getResolver((segment) => {
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

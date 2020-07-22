import { LocationComposer } from "../LocationComposer";
import type { BaseState, Location } from "../LocationComposer/Location";
import type { RouteRecordType } from "../RouteRecord";
import {
  WildcardRouteRecord,
  WildcardRouteRecordObject,
} from "../RouteRecord/WildcardRouteRecord";
import { RouteRecordsBase } from "../RoutesBuilder";
import { wildcardRouteKey } from "../RoutesBuilder/symbols";
import { ResolvedRoute } from "./ResolvedRoute";

type ResolvedSegmentType<ActionResult> =
  | {
      type: "normal";
      route: RouteRecordType<ActionResult, {}, boolean>;
    }
  | {
      type: "wildcard";
      route: WildcardRouteRecord<ActionResult, {}, boolean>;
    };

/**
 * Object that resolves given URL to a Route.
 */
export class RouteResolver<
  ActionResult,
  Routes extends RouteRecordsBase<ActionResult> & {
    readonly [wildcardRouteKey]?: WildcardRouteRecordObject<
      ActionResult,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any
    >;
  }
> {
  #routes: Routes;
  #composer: LocationComposer<string>;
  constructor(routes: Routes, composer: LocationComposer<string>) {
    this.#routes = routes;
    this.#composer = composer;
  }

  resolve(
    location: Location<BaseState>
  ): Array<ResolvedRoute<ActionResult, {}>> {
    const composer = this.#composer;
    const decomposed = composer.decompose(location);
    return decomposed.flatMap(([seg, next]) => {
      const nextRoute = this.resolveSegment(seg);
      if (nextRoute === undefined) {
        return [];
      }
      const match =
        nextRoute.type === "normal"
          ? {}
          : {
              [nextRoute.route.matchKey]: seg,
            };

      if (composer.isLeaf(next)) {
        return [
          {
            route: nextRoute.route,
            match,
            location: next,
          },
        ];
      }
      const childBuilder = nextRoute.route.getBuilder();
      if (childBuilder === undefined) {
        return [
          {
            route: nextRoute.route,
            match,
            location: next,
          },
        ];
      }
      const result = childBuilder.getResolver().resolve(next);
      switch (nextRoute.type) {
        case "normal": {
          return result;
        }
        case "wildcard": {
          return result.map((res) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (res.match as any)[nextRoute.route.matchKey] = seg;
            return res;
          });
        }
      }
    });
  }

  private resolveSegment(
    segment: string
  ): ResolvedSegmentType<ActionResult> | undefined {
    const route = this.#routes[segment];
    if (route !== undefined) {
      return {
        type: "normal",
        route,
      };
    }
    const wildcardRoute = this.#routes[wildcardRouteKey];
    if (wildcardRoute !== undefined) {
      return {
        type: "wildcard",
        route: wildcardRoute.route,
      };
    }
    return undefined;
  }
}

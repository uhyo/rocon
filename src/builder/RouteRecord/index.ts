import type { Location } from "../../core/Location";
import type { RoutesDefinition } from "../RoutesDefinitionObject";
import { wildcardRouteKey } from "../symbols";
import type { WildcardFlagType } from "../WildcardFlagType";
import type { MatchingRouteRecordObject } from "./MatchingRouteRecord";
import { PathRouteRecord } from "./PathRouteRecord";
import type { RouteRecordType } from "./RouteRecordType";

export { PathRouteRecord };
export type { RouteRecordType };

export type RouteRecordConfig<Segment> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRootLocation: (match: any) => Location<any>;
};
export type RoutesDefinitionToRouteRecords<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  Match
> = {
  [P in Extract<keyof Defs, string>]: RouteRecordType<
    ActionResult,
    Match,
    ActionToHasAction<Defs[P]["action"]>
  >;
};

type ActionToHasAction<A> = A extends unknown
  ? undefined extends A
    ? false
    : true
  : never;

export type WildcardInRouteRecords<
  ActionResult,
  Value,
  WildcardFlag extends WildcardFlagType,
  Match
> = {
  none: {};
  noaction: {
    readonly [wildcardRouteKey]: MatchingRouteRecordObject<
      ActionResult,
      Value,
      Match,
      false
    >;
  };
  hasaction: {
    readonly [wildcardRouteKey]: MatchingRouteRecordObject<
      ActionResult,
      Value,
      Match,
      true
    >;
  };
}[WildcardFlag];

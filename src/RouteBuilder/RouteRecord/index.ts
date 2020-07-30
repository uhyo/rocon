import type { Location } from "../../LocationComposer/Location";
import type { RoutesDefinition } from "../RoutesDefinitionObject";
import { wildcardRouteKey } from "../symbols";
import type { WildcardFlagType } from "../WildcardFlagType";
import { PathRouteRecord } from "./PathRouteRecord";
import type { RouteRecordType } from "./RouteRecordType";
import type { WildcardRouteRecordObject } from "./WildcardRouteRecord";

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
    undefined extends Defs[P]["action"] ? false : true
  >;
};

export type WildcardInRouteRecords<
  ActionResult,
  WildcardFlag extends WildcardFlagType,
  Match
> = {
  none: {};
  noaction: {
    readonly [wildcardRouteKey]: WildcardRouteRecordObject<
      ActionResult,
      Match,
      false
    >;
  };
  hasaction: {
    readonly [wildcardRouteKey]: WildcardRouteRecordObject<
      ActionResult,
      Match,
      true
    >;
  };
}[WildcardFlag];

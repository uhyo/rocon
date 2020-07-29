import type { RoutesDefinition } from "../../BuilderLink/RoutesDefinitionObject";
import { wildcardRouteKey } from "../../BuilderLink/symbols";
import type { WildcardFlagType } from "../../BuilderLink/WildcardFlagType";
import type { Location } from "../../LocationComposer/Location";
import { PathRouteRecord } from "./PathRouteRecord";
import type { RouteRecordType } from "./RouteRecordType";
import type { WildcardRouteRecordObject } from "./WildcardRouteRecord";

export { PathRouteRecord };
export type { RouteRecordType };

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteRecordConfig<Segment> = {
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

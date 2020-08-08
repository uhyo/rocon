import type { Location } from "../../core/Location";
import type { RoutesDefinition } from "../RoutesDefinitionObject";
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

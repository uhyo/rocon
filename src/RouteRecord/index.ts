import type { LocationComposer } from "../LocationComposer";
import type { Location } from "../LocationComposer/Location";
import { RoutesBuilder } from "../RoutesBuilder";
import type { RoutesDefinition } from "../RoutesBuilder/RoutesDefinitionObject";
import { wildcardRouteKey } from "../RoutesBuilder/symbols";
import type { WildcardFlagType } from "../RoutesBuilder/WildcardFlagType";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";
import type { RouteRecordType } from "./RouteRecordType";
import type { WildcardRouteRecordObject } from "./WildcardRouteRecord";

export type { RouteRecordType };

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteRecordConfig<Segment> = {
  composer: LocationComposer<Segment>;
  getRootLocation: (match: any) => Location<any>;
  /**
   * Attach given builder to a route.
   */
  attachBuilderToRoute: (
    builder: RoutesBuilder<any, any>,
    route: RouteRecordType<any, any, any>
  ) => void;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Object for each route provided by RoutesBuilder.
 * Should implement RouteRecordType.
 * @package
 */
export class RouteRecord<ActionResult, Match, HasAction extends boolean>
  extends RouteRecordBase<ActionResult, Match, HasAction>
  implements RouteRecordType<ActionResult, Match, HasAction> {
  /**
   * Key of this route.
   */
  readonly key: string;
  #config: RouteRecordConfig<string>;

  constructor(
    config: RouteRecordConfig<string>,
    key: string,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(config, action);
    this.#config = config;
    this.key = key;
  }

  getLocation(match: Match): Location {
    const parentLocation = this.#config.getRootLocation(match);
    return this.#config.composer.compose(parentLocation, this.key);
  }
}

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

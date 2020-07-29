import { HasBuilderLink } from "../BuilderLink/AttachableRoutesBuilder";
import type { RoutesDefinition } from "../BuilderLink/RoutesDefinitionObject";
import { wildcardRouteKey } from "../BuilderLink/symbols";
import type { WildcardFlagType } from "../BuilderLink/WildcardFlagType";
import type { Location } from "../LocationComposer/Location";
import { resolveLinkLocation } from "./resolveLinkLocation";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";
import type { RouteRecordType } from "./RouteRecordType";
import type { WildcardRouteRecordObject } from "./WildcardRouteRecord";

export type { RouteRecordType };

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RouteRecordConfig<Segment> = {
  getRootLocation: (match: any) => Location<any>;
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
  #parent: HasBuilderLink<ActionResult, string>;

  constructor(
    parent: HasBuilderLink<ActionResult, string>,
    key: string,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(action);
    this.#parent = parent;
    this.key = key;
  }

  getLocation(match: Match): Location {
    const link = this.#parent.getBuilderLink();
    return resolveLinkLocation(link, match, (parentLocation) =>
      link.composer.compose(parentLocation, this.key)
    );
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

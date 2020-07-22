import { RouteRecordConfig, RouteRecordType } from ".";
import { Location } from "../LocationComposer/Location";
import { assertString } from "../util/assert";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";

/**
 * Special route definition for wildcard route.
 */
export type WildcardRouteRecordObject<
  ActionResult,
  Match,
  HasAction extends boolean
> = {
  matchKey: string;
  route: WildcardRouteRecord<ActionResult, Match, HasAction>;
};

/**
 * Object for wildcard route in RoutesBuilder.
 */
export class WildcardRouteRecord<ActionResult, Match, HasAction extends boolean>
  extends RouteRecordBase<ActionResult, Match, HasAction>
  implements RouteRecordType<ActionResult, Match, HasAction> {
  readonly matchKey: Extract<keyof Match, string>;
  #config: RouteRecordConfig;
  constructor(
    config: RouteRecordConfig,
    matchKey: Extract<keyof Match, string>,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(config, action);
    this.#config = config;
    this.matchKey = matchKey;
  }

  getLocation(match: Match): Location {
    const wildcardValue = match[this.matchKey];
    assertString(wildcardValue);

    return this.#config.composer.compose(
      this.#config.getRootLocation(match),
      wildcardValue
    );
  }
}

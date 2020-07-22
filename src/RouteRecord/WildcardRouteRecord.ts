import { RouteRecordConfig, RouteRecordType } from ".";
import { Location } from "../LocationComposer/Location";
import type { ActionType } from "../RoutesBuilder/RoutesDefinitionObject";
import { assertString } from "../util/assert";
import { RouteRecordBase } from "./RouteRecordBase";

/**
 * Special route definition for wildcard route.
 */
export type WildcardRouteRecordObject<ActionResult, Match> = {
  matchKey: string;
  route: WildcardRouteRecord<ActionResult, Match>;
};

/**
 * Object for wildcard route in RoutesBuilder.
 */
export class WildcardRouteRecord<ActionResult, Match>
  extends RouteRecordBase<ActionResult, Match>
  implements RouteRecordType<ActionResult, Match> {
  readonly matchKey: Extract<keyof Match, string>;
  #config: RouteRecordConfig;
  constructor(
    config: RouteRecordConfig,
    matchKey: Extract<keyof Match, string>,
    action: ActionType<ActionResult, Match>
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

import { Location } from "../LocationComposer/Location";
import { RouteRecordConfig, RouteRecordType } from "../RouteRecord";
import { RouteRecordBase } from "../RouteRecord/RouteRecordBase";
import type { ActionType } from "./RoutesDefinitionObject";

/**
 * Special route definition for wildcard route.
 */
export type WildcardRouteRecordObject<Match, ActionResult> = {
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
    return this.#config.composer.compose(
      this.#config.getRootLocation(),
      // TODO: revisit here
      (match[this.matchKey] as unknown) as string
    );
  }
}

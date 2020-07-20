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
 * @package
 */
export class WildcardRouteRecord<ActionResult, Match> {
  readonly action: ActionType<ActionResult, Match>;
  readonly matchKey: string;
  constructor(matchKey: string, action: ActionType<ActionResult, Match>) {
    this.matchKey = matchKey;
    this.action = action;
  }
}

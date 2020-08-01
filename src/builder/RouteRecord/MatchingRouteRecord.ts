import { RouteRecordType } from ".";
import { HasBuilderLink } from "../../core/BuilderLink/AttachableRouteBuilder";
import { Location } from "../../core/Location";
import { Validator } from "../../validator";
import { resolveLinkLocation } from "./resolveLinkLocation";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";

/**
 * Special route definition for wildcard route.
 */
export type MatchingRouteRecordObject<
  ActionResult,
  Value,
  Match,
  HasAction extends boolean
> = {
  matchKey: string;
  route: MatchingRouteRecord<ActionResult, Value, Match, HasAction>;
};

/**
 * Object for wildcard route in RouteBuilder.
 */
export class MatchingRouteRecord<
  ActionResult,
  Value,
  Match,
  HasAction extends boolean
> extends RouteRecordBase<ActionResult, Match, HasAction>
  implements RouteRecordType<ActionResult, Match, HasAction> {
  readonly key: Extract<keyof Match, string>;

  #parent: HasBuilderLink<ActionResult, Value>;
  #validator: Validator<Value>;

  constructor(
    parent: HasBuilderLink<ActionResult, Value>,
    key: Extract<keyof Match, string>,
    validator: Validator<Value>,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(parent.getBuilderLink(), action);
    this.#parent = parent;
    this.#validator = validator;
    this.key = key;
  }

  getLocation(match: Match): Location {
    const matchedValue = match[this.key];
    if (!this.#validator(matchedValue)) {
      throw new Error(`Invariant failure: type of '${matchedValue}' is wrong`);
    }

    const link = this.#parent.getBuilderLink();
    const parentLocation = resolveLinkLocation(link, match);
    return link.composer.compose(parentLocation, matchedValue);
  }
}

import { RouteRecordType } from ".";
import { HasBuilderLink } from "../../BuilderLink/AttachableRouteBuilder";
import { Location } from "../../LocationComposer/Location";
import { Validator } from "../../validator";
import { resolveLinkLocation } from "./resolveLinkLocation";
import { ActionTypeOfRouteRecord, RouteRecordBase } from "./RouteRecordBase";

/**
 * Special route definition for wildcard route.
 */
export type WildcardRouteRecordObject<
  ActionResult,
  Value,
  Match,
  HasAction extends boolean
> = {
  matchKey: string;
  route: WildcardRouteRecord<ActionResult, Value, Match, HasAction>;
};

/**
 * Object for wildcard route in RouteBuilder.
 */
export class WildcardRouteRecord<
  ActionResult,
  Value,
  Match,
  HasAction extends boolean
> extends RouteRecordBase<ActionResult, Match, HasAction>
  implements RouteRecordType<ActionResult, Match, HasAction> {
  readonly matchKey: Extract<keyof Match, string>;

  #parent: HasBuilderLink<ActionResult, Value>;
  #validator: Validator<Value>;

  constructor(
    parent: HasBuilderLink<ActionResult, Value>,
    matchKey: Extract<keyof Match, string>,
    validator: Validator<Value>,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(action);
    this.#parent = parent;
    this.#validator = validator;
    this.matchKey = matchKey;
  }

  getLocation(match: Match): Location {
    const wildcardValue = match[this.matchKey];
    if (!this.#validator(wildcardValue)) {
      throw new Error(`Invariant failure: type of '${wildcardValue}' is wrong`);
    }

    const link = this.#parent.getBuilderLink();
    return resolveLinkLocation(link, match, (parentLocation) =>
      link.composer.compose(parentLocation, wildcardValue)
    );
  }
}

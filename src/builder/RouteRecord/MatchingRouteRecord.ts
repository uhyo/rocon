import { RouteRecordType } from ".";
import { Validator } from "../../validator";
import { AttachableRouteBuilder } from "../RouteBuilderLink";
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

  #parent: AttachableRouteBuilder<ActionResult, Value>;
  #validator: Validator<Value>;

  constructor(
    parent: AttachableRouteBuilder<ActionResult, Value>,
    key: Extract<keyof Match, string>,
    validator: Validator<Value>,
    action: ActionTypeOfRouteRecord<ActionResult, Match, HasAction>
  ) {
    super(parent.getBuilderLink(), action, (match) => {
      const matchedValue = match[this.key];
      if (!this.#validator(matchedValue)) {
        throw new Error(
          `Invariant failure: type of '${matchedValue}' is wrong`
        );
      }
      return matchedValue;
    });
    this.#parent = parent;
    this.#validator = validator;
    this.key = key;
  }
}

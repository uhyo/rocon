import { BuilderLink } from "../../BuilderLink";
import { AttachableRouteBuilder } from "../../BuilderLink/AttachableRouteBuilder";
import { StateLocationComposer } from "../../LocationComposer/StateLocationComposer";
import { RouteResolver } from "../../RouteResolver";
import type { Validator } from "../../validator";
import { RouteRecordType } from "../RouteRecord";
import { MatchingRouteRecord } from "../RouteRecord/MatchingRouteRecord";
import { ActionType } from "../RoutesDefinitionObject";
import { SingleRouteAbstractBuilder } from "../SingleRouteAbstractBuilder";
import {
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export class StateRouteBuilder<
  ActionResult,
  StateValue,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
> extends SingleRouteAbstractBuilder<ActionResult, Match, boolean>
  implements AttachableRouteBuilder<ActionResult, StateValue> {
  static init<
    ActionResult,
    StateValue,
    Key extends string,
    Match extends {
      [K in Key]: StateValue;
    }
  >(
    key: Key,
    validator: Validator<StateValue>
  ): StateRouteBuilder<ActionResult, StateValue, "noaction", Match> {
    const link = BuilderLink.init<ActionResult, StateValue>({
      composer: new StateLocationComposer(key, validator),
    });
    const result = new StateRouteBuilder<
      ActionResult,
      StateValue,
      "noaction",
      Match
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, key as any, validator);

    return result;
  }

  /**
   * Attach a newly created StateRouteBuilder to given route.
   */
  static attachTo<
    ActionResult,
    Match,
    HasAction extends boolean,
    Key extends string,
    StateValue
  >(
    route: RouteRecordType<ActionResult, Match, HasAction>,
    key: Key,
    validator: Validator<StateValue>
  ): StateRouteBuilder<
    ActionResult,
    StateValue,
    "noaction",
    Match &
      {
        [K in Key]: StateValue;
      }
  > {
    const b = StateRouteBuilder.init<
      ActionResult,
      StateValue,
      Key,
      Match &
        {
          [K in Key]: StateValue;
        }
    >(key, validator);
    const r: RouteRecordType<
      ActionResult,
      Match & { [K in Key]: StateValue },
      HasAction
    > = route;
    return r.attach(b);
  }

  readonly key: Extract<keyof Match, string>;

  #link: BuilderLink<ActionResult, StateValue>;
  #validator: Validator<StateValue>;
  #route: MatchingRouteRecord<ActionResult, StateValue, Match, boolean>;

  private constructor(
    link: BuilderLink<ActionResult, StateValue>,
    key: Extract<keyof Match, string>,
    validator: Validator<StateValue>
  ) {
    super();
    this.#link = link;
    this.key = key;
    this.#validator = validator;
    this.#route = new MatchingRouteRecord(this, key, validator, undefined);
    link.register(this, (value) => {
      return {
        type: "matching",
        route: this.#route,
        value,
      };
    });
  }

  /**
   * Define action for this route and return a new instance of StateRouteBuilder.
   */
  action(
    action: ActionType<ActionResult, Match>
  ): StateRouteBuilder<ActionResult, StateValue, "hasaction", Match> {
    const validator = this.#validator;

    const result = new StateRouteBuilder<
      ActionResult,
      StateValue,
      "hasaction",
      Match
    >(this.#link.inherit(), this.key, validator);

    result.#route = new MatchingRouteRecord(
      result,
      this.key,
      validator,
      action
    );
    return result;
  }

  getRoute(): WildcardFlag extends ExistingWildcardFlagType
    ? MatchingRouteRecord<
        ActionResult,
        StateValue,
        Match,
        WildcardFlagToHasAction<WildcardFlag>
      >
    : undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.#route as any;
  }

  getBuilderLink(): BuilderLink<ActionResult, StateValue> {
    return this.#link;
  }

  getResolver(): RouteResolver<ActionResult, StateValue> {
    return this.#link.getResolver();
  }
}

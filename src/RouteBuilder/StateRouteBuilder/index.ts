import { BuilderLink } from "../../BuilderLink";
import { AttachableRouteBuilder } from "../../BuilderLink/AttachableRouteBuilder";
import { BuilderLinkOptions } from "../../BuilderLink/BuilderLinkOptions";
import {
  StateLocationComposer,
  Validator,
} from "../../LocationComposer/StateLocationComposer";
import { RouteResolver } from "../../RouteResolver";
import { RouteRecordType } from "../RouteRecord";
import { WildcardRouteRecord } from "../RouteRecord/WildcardRouteRecord";
import { ActionType } from "../RoutesDefinitionObject";
import {
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type StateRouteBuilderOptions<ActionResult, StateValue> = Omit<
  BuilderLinkOptions<ActionResult, StateValue>,
  "composer"
>;

export class StateRouteBuilder<
  ActionResult,
  StateValue,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
> implements AttachableRouteBuilder<ActionResult, StateValue> {
  static init<
    ActionResult,
    StateValue,
    Key extends string,
    Match extends {
      [K in Key]: StateValue;
    }
  >(
    key: Key,
    validator: Validator<StateValue>,
    options: Partial<StateRouteBuilderOptions<ActionResult, StateValue>> = {}
  ): StateRouteBuilder<ActionResult, StateValue, "noaction", Match> {
    const op = {
      ...options,
      composer: new StateLocationComposer(key, validator),
    };
    const link = BuilderLink.init<ActionResult, StateValue>(op);
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
  #route: WildcardRouteRecord<ActionResult, StateValue, Match, boolean>;

  private constructor(
    link: BuilderLink<ActionResult, StateValue>,
    key: Extract<keyof Match, string>,
    validator: Validator<StateValue>
  ) {
    this.#link = link;
    this.key = key;
    this.#validator = validator;
    this.#route = new WildcardRouteRecord(this, key, validator, undefined);
    link.register(this);
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

    result.#route = new WildcardRouteRecord(
      result,
      this.key,
      validator,
      action
    );
    return result;
  }

  getRoute(): WildcardFlag extends ExistingWildcardFlagType
    ? WildcardRouteRecord<
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
    return this.#link.getResolver(() => {
      if (this.#route === undefined) {
        return undefined;
      }
      return {
        type: "wildcard",
        route: this.#route,
      };
    });
  }
}

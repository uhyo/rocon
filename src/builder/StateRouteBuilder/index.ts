import { BuilderLink } from "../../core/BuilderLink";
import type { Validator } from "../../validator";
import { StateLocationComposer } from "../composers/StateLocationComposer";
import {
  AttachableRouteBuilder,
  RouteBuilderLink,
  RouteBuilderLinkValue,
} from "../RouteBuilderLink";
import { RouteRecordType } from "../RouteRecord";
import { MatchingRouteRecord } from "../RouteRecord/MatchingRouteRecord";
import { ActionType } from "../RoutesDefinitionObject";
import { SingleRouteAbstractBuilder } from "../SingleRouteAbstractBuilder";
import {
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type StateRouteBuilerOptions = {
  stateKey?: string;
};

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
    matchKey: Key,
    validator: Validator<StateValue>,
    options: StateRouteBuilerOptions = {}
  ): StateRouteBuilder<ActionResult, StateValue, "noaction", Match> {
    const stateKey = options.stateKey ?? matchKey;
    const link = new BuilderLink<
      ActionResult,
      StateValue,
      RouteBuilderLinkValue<ActionResult>
    >({
      composer: new StateLocationComposer(stateKey, validator, false),
    });
    const result = new StateRouteBuilder<
      ActionResult,
      StateValue,
      "noaction",
      Match
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, matchKey as any, validator);

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

  readonly matchKey: Extract<keyof Match, string>;

  #link: RouteBuilderLink<ActionResult, StateValue>;
  #validator: Validator<StateValue>;
  #route: MatchingRouteRecord<ActionResult, StateValue, Match, boolean>;

  private constructor(
    link: RouteBuilderLink<ActionResult, StateValue>,
    matchKey: Extract<keyof Match, string>,
    validator: Validator<StateValue>
  ) {
    super();
    this.#link = link;
    this.matchKey = matchKey;
    this.#validator = validator;
    this.#route = new MatchingRouteRecord(this, matchKey, validator, undefined);
    link.register(this, (value) => {
      const route = this.#route;
      return {
        type: "matching",
        value: route,
        link: route.getAttachedBuilderLink(),
        matchKey: matchKey,
        matchValue: value,
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
    >(this.#link.inherit(), this.matchKey, validator);

    result.#route = new MatchingRouteRecord(
      result,
      this.matchKey,
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

  getBuilderLink(): RouteBuilderLink<ActionResult, StateValue> {
    return this.#link;
  }
}

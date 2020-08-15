import { BuilderLink } from "../../core/BuilderLink";
import { OptionalIf } from "../../util/OptionalIf";
import type { Validator } from "../../validator";
import { StateLocationComposer } from "../composers/StateLocationComposer";
import {
  AttachableRouteBuilder,
  RouteBuilderLink,
  RouteBuilderLinkValue,
} from "../RouteBuilderLink";
import { MatchingRouteRecord } from "../RouteRecord/MatchingRouteRecord";
import { ActionType } from "../RoutesDefinitionObject";
import { SingleRouteAbstractBuilder } from "../SingleRouteAbstractBuilder";
import {
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type StateRouteBuilerOptions<IsOptional extends boolean> = {
  stateKey?: string;
  optional?: IsOptional;
};

export class StateRouteBuilder<
  ActionResult,
  StateValue,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
>
  extends SingleRouteAbstractBuilder<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  >
  implements AttachableRouteBuilder<ActionResult, StateValue> {
  static init<
    ActionResult,
    StateValue,
    Key extends string,
    IsOptional extends boolean = false
  >(
    matchKey: Key,
    validator: Validator<StateValue>,
    options: StateRouteBuilerOptions<IsOptional> = {}
  ): StateRouteBuilder<
    ActionResult,
    StateValue,
    "noaction",
    {
      [K in Key]: OptionalIf<IsOptional, StateValue>;
    }
  > {
    const stateKey = options.stateKey ?? matchKey;
    const link = new BuilderLink<
      ActionResult,
      OptionalIf<IsOptional, StateValue>,
      RouteBuilderLinkValue<ActionResult>
    >({
      composer: new StateLocationComposer(
        stateKey,
        validator,
        options.optional || (false as IsOptional)
      ),
    });
    const result = new StateRouteBuilder<
      ActionResult,
      StateValue,
      "noaction",
      {
        [K in Key]: OptionalIf<IsOptional, StateValue>;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, matchKey as any, validator);

    return result;
  }

  readonly matchKey: Extract<keyof Match, string>;

  #link: RouteBuilderLink<ActionResult, StateValue>;
  #validator: Validator<StateValue>;
  #route: MatchingRouteRecord<ActionResult, StateValue, Match, boolean>;

  private constructor(
    link: RouteBuilderLink<ActionResult, StateValue | undefined>,
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

  getRoute(): MatchingRouteRecord<
    ActionResult,
    StateValue,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.#route as any;
  }

  getBuilderLink(): RouteBuilderLink<ActionResult, StateValue> {
    return this.#link;
  }
}

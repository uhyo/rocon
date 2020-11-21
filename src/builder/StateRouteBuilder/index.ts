import { BuilderLink } from "../../core/BuilderLink";
import type { OptionalIf } from "../../util/types/OptionalIf";
import type { PartialIf } from "../../util/types/PartialIf";
import { isUndefinedOr, Validator } from "../../validator";
import { StateLocationComposer } from "../composers/StateLocationComposer";
import type {
  AttachableRouteBuilder,
  RouteBuilderLink,
  RouteBuilderLinkValue,
} from "../RouteBuilderLink";
import type { RouteRecordType } from "../RouteRecord";
import { MatchingRouteRecord } from "../RouteRecord/MatchingRouteRecord";
import type { ActionType } from "../RoutesDefinitionObject";
import { SingleRouteAbstractBuilder } from "../SingleRouteAbstractBuilder";
import type {
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
  implements AttachableRouteBuilder<ActionResult, StateValue | undefined> {
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
    OptionalIf<IsOptional, StateValue>,
    "noaction",
    PartialIf<
      IsOptional,
      {
        [K in Key]: StateValue;
      }
    >
  > {
    const stateKey = options.stateKey ?? matchKey;
    const optional = options.optional || (false as IsOptional);
    const usedValidator = (optional
      ? isUndefinedOr(validator)
      : validator) as Validator<OptionalIf<IsOptional, StateValue>>;

    const link = new BuilderLink<
      ActionResult,
      OptionalIf<IsOptional, StateValue>,
      RouteBuilderLinkValue<ActionResult>
    >({
      composer: new StateLocationComposer(stateKey, usedValidator, optional),
    });
    const result = new StateRouteBuilder<
      ActionResult,
      OptionalIf<IsOptional, StateValue>,
      "noaction",
      PartialIf<
        IsOptional,
        {
          [K in Key]: StateValue;
        }
      >
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, matchKey as any, usedValidator);

    return result;
  }

  readonly matchKey: Extract<keyof Match, string>;

  #link: RouteBuilderLink<ActionResult, StateValue | undefined>;
  #validator: Validator<StateValue>;
  #route: RouteRecordType<ActionResult, Match, boolean>;

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

  getRoute(): RouteRecordType<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route;
  }

  getBuilderLink(): RouteBuilderLink<ActionResult, StateValue | undefined> {
    return this.#link;
  }
}

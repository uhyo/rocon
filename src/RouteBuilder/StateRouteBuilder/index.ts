import { BuilderLink } from "../../BuilderLink";
import { AttachableRouteBuilder } from "../../BuilderLink/AttachableRouteBuilder";
import { BuilderLinkOptions } from "../../BuilderLink/BuilderLinkOptions";
import {
  StateLocationComposer,
  Validator,
} from "../../LocationComposer/StateLocationComposer";
import { RouteResolver } from "../../RouteResolver";
import { RouteRecordType } from "../RouteRecord";
import {
  WildcardRouteRecord,
  WildcardRouteRecordObject,
} from "../RouteRecord/WildcardRouteRecord";
import { ActionType, RouteDefinition } from "../RoutesDefinitionObject";
import {
  ActionTypeToWildcardFlag,
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
    RD extends RouteDefinition<
      ActionResult,
      Match &
        {
          [K in Key]: StateValue;
        }
    >,
    Match = {}
  >(
    key: Key,
    validator: Validator<StateValue>,
    routeDefinition: RD,
    options: Partial<StateRouteBuilderOptions<ActionResult, StateValue>> = {}
  ): StateRouteBuilder<
    ActionResult,
    StateValue,
    ActionTypeToWildcardFlag<RD["action"]>,
    Match & { [K in Key]: StateValue }
  > {
    const op = {
      ...options,
      composer: new StateLocationComposer(key, validator),
    };
    const link = BuilderLink.init<ActionResult, StateValue>(op);
    const result = new StateRouteBuilder<
      ActionResult,
      StateValue,
      ActionTypeToWildcardFlag<RD["action"]>,
      Match & { [K in Key]: StateValue }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, key as any, validator, routeDefinition.action);

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
    StateValue,
    RD extends RouteDefinition<
      ActionResult,
      Match &
        {
          [K in Key]: StateValue;
        }
    >
  >(
    route: RouteRecordType<ActionResult, Match, HasAction>,
    key: Key,
    validator: Validator<StateValue>,
    routeDefinition: RD
  ): StateRouteBuilder<
    ActionResult,
    StateValue,
    ActionTypeToWildcardFlag<RD["action"]>,
    Match &
      {
        [K in Key]: StateValue;
      }
  > {
    const b = StateRouteBuilder.init<ActionResult, StateValue, Key, RD, Match>(
      key,
      validator,
      routeDefinition
    );
    const r: RouteRecordType<
      ActionResult,
      Match & { [K in Key]: StateValue },
      HasAction
    > = route;
    return r.attach(b);
  }

  #link: BuilderLink<ActionResult, StateValue>;
  #validator: Validator<StateValue>;
  #route: WildcardRouteRecordObject<ActionResult, StateValue, Match, boolean>;

  private constructor(
    link: BuilderLink<ActionResult, StateValue>,
    key: Extract<keyof Match, string>,
    validator: Validator<StateValue>,
    action: ActionType<ActionResult, Match> | undefined
  ) {
    this.#link = link;
    this.#validator = validator;
    this.#route = {
      matchKey: key,
      route: new WildcardRouteRecord(this, key, validator, action),
    };
  }

  getRoute(): WildcardRouteRecord<
    ActionResult,
    StateValue,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route.route;
  }

  getBuilderLink(): BuilderLink<ActionResult, StateValue> {
    return this.#link;
  }

  getResolver(): RouteResolver<ActionResult, StateValue> {
    return this.#link.getResolver(() => {
      return {
        type: "wildcard",
        route: this.#route.route,
      };
    });
  }
}

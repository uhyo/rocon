import { BuilderLink } from "../../core/BuilderLink";
import { OptionalIf } from "../../util/OptionalIf";
import { isString } from "../../validator";
import { SingleHashLocationComposer } from "../composers/SingleHashLocationComposer";
import {
  AttachableRouteBuilder,
  RouteBuilderLink,
  RouteBuilderLinkValue,
} from "../RouteBuilderLink";
import { MatchingRouteRecord } from "../RouteRecord/MatchingRouteRecord";
import { ActionType } from "../RoutesDefinitionObject";
import { SingleRouteAbstractBuilder } from "../SingleRouteAbstractBuilder";
import type {
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type SingleHashRouteBuilderOptions<IsOptional extends boolean> = {
  optional?: IsOptional;
};

export class SingleHashRouteBuilder<
  ActionResult,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
>
  extends SingleRouteAbstractBuilder<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  >
  implements AttachableRouteBuilder<ActionResult, string> {
  static init<
    ActionResult,
    Key extends string,
    IsOptional extends boolean = false
  >(
    matchKey: Key,
    options: SingleHashRouteBuilderOptions<IsOptional> = {}
  ): SingleHashRouteBuilder<
    ActionResult,
    "noaction",
    {
      [K in Key]: IsOptional extends false ? string : string | undefined;
    }
  > {
    const link = new BuilderLink<
      ActionResult,
      OptionalIf<IsOptional, string>,
      RouteBuilderLinkValue<ActionResult>
    >({
      composer: new SingleHashLocationComposer(
        options.optional || (false as IsOptional)
      ),
    });
    const result = new SingleHashRouteBuilder<
      ActionResult,
      "noaction",
      {
        [K in Key]: IsOptional extends false ? string : string | undefined;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, matchKey as any);
    return result;
  }

  readonly matchKey: Extract<keyof Match, string>;

  #link: RouteBuilderLink<ActionResult, string>;
  #route: MatchingRouteRecord<ActionResult, string, Match, boolean>;

  private constructor(
    link: RouteBuilderLink<ActionResult, string | undefined>,
    matchKey: Extract<keyof Match, string>
  ) {
    super();
    this.#link = link;
    this.matchKey = matchKey;
    this.#route = new MatchingRouteRecord(this, matchKey, isString, undefined);
    link.register(this, (value) => {
      const route = this.#route;
      return {
        type: "matching",
        value: route,
        link: route.getAttachedBuilderLink(),
        matchKey,
        matchValue: value,
      };
    });
  }

  /**
   * Define action for this route and return a new instance of SingleHashRouteBuilder.
   */
  action(
    action: ActionType<ActionResult, Match>
  ): SingleHashRouteBuilder<ActionResult, "hasaction", Match> {
    const result = new SingleHashRouteBuilder<ActionResult, "hasaction", Match>(
      this.#link.inherit(),
      this.matchKey
    );

    result.#route = new MatchingRouteRecord(
      result,
      this.matchKey,
      isString,
      action
    );
    return result;
  }

  /**
   * Get a route object of this builder.
   */
  getRoute(): MatchingRouteRecord<
    ActionResult,
    string,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route;
  }

  getBuilderLink(): RouteBuilderLink<ActionResult, string> {
    return this.#link;
  }
}

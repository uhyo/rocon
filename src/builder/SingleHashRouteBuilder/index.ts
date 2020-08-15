import { BuilderLink } from "../../core/BuilderLink";
import type { OptionalIf } from "../../util/types/OptionalIf";
import type { PartialIf } from "../../util/types/PartialIf";
import { isString, isStringOrUndefined } from "../../validator";
import { SingleHashLocationComposer } from "../composers/SingleHashLocationComposer";
import {
  AttachableRouteBuilder,
  RouteBuilderLink,
  RouteBuilderLinkValue,
} from "../RouteBuilderLink";
import { RouteRecordType } from "../RouteRecord";
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
    PartialIf<
      IsOptional,
      {
        [K in Key]: string;
      }
    >
  > {
    const optional = options.optional || (false as IsOptional);
    const link = new BuilderLink<
      ActionResult,
      OptionalIf<IsOptional, string>,
      RouteBuilderLinkValue<ActionResult>
    >({
      composer: new SingleHashLocationComposer(optional),
    });
    const result = new SingleHashRouteBuilder<
      ActionResult,
      "noaction",
      PartialIf<
        IsOptional,
        {
          [K in Key]: string;
        }
      >
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, matchKey as any, optional);
    return result;
  }

  readonly matchKey: Extract<keyof Match, string>;
  readonly optional: boolean;

  #link: RouteBuilderLink<ActionResult, string>;
  #route: RouteRecordType<ActionResult, Match, boolean>;

  private constructor(
    link: RouteBuilderLink<ActionResult, string | undefined>,
    matchKey: Extract<keyof Match, string>,
    optional: boolean
  ) {
    super();
    this.#link = link;
    this.matchKey = matchKey;
    this.optional = optional;
    this.#route = new MatchingRouteRecord(
      this,
      matchKey,
      optional ? isStringOrUndefined : isString,
      undefined
    );
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
      this.matchKey,
      this.optional
    );

    result.#route = new MatchingRouteRecord(
      result,
      this.matchKey,
      this.optional ? isStringOrUndefined : isString,
      action
    );
    return result;
  }

  /**
   * Get a route object of this builder.
   */
  getRoute(): RouteRecordType<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route;
  }

  getBuilderLink(): RouteBuilderLink<ActionResult, string> {
    return this.#link;
  }
}

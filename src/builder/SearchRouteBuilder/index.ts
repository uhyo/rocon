import { BuilderLink } from "../../core/BuilderLink";
import { OptionalIf } from "../../util/OptionalIf";
import { isString } from "../../validator";
import { SearchLocationComposer } from "../composers/SearchLocationComposer";
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

export type SearchRouteBuilderOptions<IsOptional extends boolean> = {
  searchKey?: string;
  optional?: IsOptional;
};

export class SearchRouteBuilder<
  ActionResult,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
> extends SingleRouteAbstractBuilder<ActionResult, Match, boolean>
  implements AttachableRouteBuilder<ActionResult, string> {
  static init<
    ActionResult,
    Key extends string,
    Match extends {
      [K in Key]: IsOptional extends false ? string : string | undefined;
    },
    IsOptional extends boolean = false
  >(
    matchKey: Key,
    options: SearchRouteBuilderOptions<IsOptional> = {}
  ): SearchRouteBuilder<ActionResult, "noaction", Match> {
    const searchKey = options.searchKey ?? matchKey;
    const link = new BuilderLink<
      ActionResult,
      OptionalIf<IsOptional, string>,
      RouteBuilderLinkValue<ActionResult>
    >({
      composer: new SearchLocationComposer(
        searchKey,
        options.optional || (false as IsOptional)
      ),
    });
    const result = new SearchRouteBuilder<
      ActionResult,
      "noaction",
      Match &
        {
          [K in Key]: IsOptional extends false ? string : string | undefined;
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, matchKey as any);
    return result;
  }

  /**
   * Attach a newly created SearchRouteBuilder to given route.
   */
  static attachTo<
    ActionResult,
    Match,
    HasAction extends boolean,
    Key extends string
  >(
    route: RouteRecordType<ActionResult, Match, HasAction>,
    key: Key
  ): SearchRouteBuilder<
    ActionResult,
    "noaction",
    Match &
      {
        [K in Key]: string;
      }
  > {
    const b = SearchRouteBuilder.init<
      ActionResult,
      Key,
      Match &
        {
          [K in Key]: string;
        },
      false
    >(key);
    const r: RouteRecordType<
      ActionResult,
      Match & { [K in Key]: string },
      HasAction
    > = route;
    return r.attach(b);
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
        matchKey: matchKey,
        matchValue: value,
      };
    });
  }

  /**
   * Define action for this route and return a new instance of SearchRouteBuilder.
   */
  action(
    action: ActionType<ActionResult, Match>
  ): SearchRouteBuilder<ActionResult, "hasaction", Match> {
    const result = new SearchRouteBuilder<ActionResult, "hasaction", Match>(
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

import { BuilderLink } from "../../BuilderLink";
import type { AttachableRouteBuilder } from "../../BuilderLink/AttachableRouteBuilder";
import type { BuilderLinkOptions } from "../../BuilderLink/BuilderLinkOptions";
import { SearchLocationComposer } from "../../LocationComposer/SearchLocationComposer";
import type { RouteResolver } from "../../RouteResolver";
import { isString } from "../../validator";
import { RouteRecordType } from "../RouteRecord";
import { MatchingRouteRecord } from "../RouteRecord/WildcardRouteRecord";
import { ActionType } from "../RoutesDefinitionObject";
import type {
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type SearchRouteBuilderOptions<ActionResult> = Omit<
  BuilderLinkOptions<ActionResult, string>,
  "composer"
>;

export class SearchRouteBuilder<
  ActionResult,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
> implements AttachableRouteBuilder<ActionResult, string> {
  static init<
    ActionResult,
    Key extends string,
    Match extends {
      [K in Key]: string;
    }
  >(
    key: Key,
    options: Partial<SearchRouteBuilderOptions<ActionResult>> = {}
  ): SearchRouteBuilder<ActionResult, "noaction", Match> {
    const op = {
      ...options,
      composer: new SearchLocationComposer(key),
    };
    const link = BuilderLink.init<ActionResult, string>(op);
    const result = new SearchRouteBuilder<
      ActionResult,
      "noaction",
      Match &
        {
          [K in Key]: string;
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, key as any);
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
        }
    >(key);
    const r: RouteRecordType<
      ActionResult,
      Match & { [K in Key]: string },
      HasAction
    > = route;
    return r.attach(b);
  }

  readonly key: Extract<keyof Match, string>;

  #link: BuilderLink<ActionResult, string>;
  #route: MatchingRouteRecord<ActionResult, string, Match, boolean>;

  private constructor(
    link: BuilderLink<ActionResult, string>,
    key: Extract<keyof Match, string>
  ) {
    this.#link = link;
    this.key = key;
    this.#route = new MatchingRouteRecord(this, key, isString, undefined);
    link.register(this);
  }

  /**
   * Define action for this route and return a new instance of SearchRouteBuilder.
   */
  action(
    action: ActionType<ActionResult, Match>
  ): SearchRouteBuilder<ActionResult, "hasaction", Match> {
    const result = new SearchRouteBuilder<ActionResult, "hasaction", Match>(
      this.#link.inherit(),
      this.key
    );

    result.#route = new MatchingRouteRecord(result, this.key, isString, action);
    return result;
  }

  getRoute(): MatchingRouteRecord<
    ActionResult,
    string,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route;
  }

  getBuilderLink(): BuilderLink<ActionResult, string> {
    return this.#link;
  }

  getResolver(): RouteResolver<ActionResult, string> {
    return this.#link.getResolver(() => {
      const route = this.#route;
      if (route === undefined) {
        return undefined;
      }
      return {
        type: "wildcard",
        route,
      };
    });
  }
}

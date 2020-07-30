import { BuilderLink } from "../../BuilderLink";
import type { AttachableRouteBuilder } from "../../BuilderLink/AttachableRouteBuilder";
import type { BuilderLinkOptions } from "../../BuilderLink/BuilderLinkOptions";
import { SearchLocationComposer } from "../../LocationComposer/SearchLocationComposer";
import type { RouteResolver } from "../../RouteResolver";
import { isString } from "../../validator";
import type { RouteRecordType } from "../RouteRecord";
import {
  WildcardRouteRecord,
  WildcardRouteRecordObject,
} from "../RouteRecord/WildcardRouteRecord";
import type { ActionType, RouteDefinition } from "../RoutesDefinitionObject";
import type {
  ActionTypeToWildcardFlag,
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
    RD extends RouteDefinition<
      ActionResult,
      Match &
        {
          [K in Key]: string;
        }
    >,
    Match = {}
  >(
    key: Key,
    routeDefinition: RD,
    options: Partial<SearchRouteBuilderOptions<ActionResult>> = {}
  ): SearchRouteBuilder<
    ActionResult,
    ActionTypeToWildcardFlag<RD["action"]>,
    Match &
      {
        [K in Key]: string;
      }
  > {
    const op = {
      ...options,
      composer: new SearchLocationComposer(key),
    };
    const link = BuilderLink.init<ActionResult, string>(op);
    const result = new SearchRouteBuilder<
      ActionResult,
      ActionTypeToWildcardFlag<RD["action"]>,
      Match &
        {
          [K in Key]: string;
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(link, key as any, routeDefinition.action);
    return result;
  }

  /**
   * Attach a newly created SearchRouteBuilder to given route.
   */
  static attachTo<
    ActionResult,
    Match,
    HasAction extends boolean,
    Key extends string,
    RD extends RouteDefinition<
      ActionResult,
      Match &
        {
          [K in Key]: string;
        }
    >
  >(
    route: RouteRecordType<ActionResult, Match, HasAction>,
    key: Key,
    routeDefinition: RD
  ): SearchRouteBuilder<
    ActionResult,
    ActionTypeToWildcardFlag<RD["action"]>,
    Match &
      {
        [K in Key]: string;
      }
  > {
    const b = SearchRouteBuilder.init<ActionResult, Key, RD, Match>(
      key,
      routeDefinition
    );
    const r: RouteRecordType<
      ActionResult,
      Match & { [K in Key]: string },
      HasAction
    > = route;
    return r.attach(b);
  }

  #link: BuilderLink<ActionResult, string>;
  #route: WildcardRouteRecordObject<ActionResult, string, Match, boolean>;

  private constructor(
    link: BuilderLink<ActionResult, string>,
    key: Extract<keyof Match, string>,
    action: ActionType<ActionResult, Match> | undefined
  ) {
    this.#link = link;
    this.#route = {
      matchKey: key,
      route: new WildcardRouteRecord(this, key, isString, action),
    };
    link.register(this);
  }

  getRoute(): WildcardRouteRecord<
    ActionResult,
    string,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route.route;
  }

  getBuilderLink(): BuilderLink<ActionResult, string> {
    return this.#link;
  }

  getResolver(): RouteResolver<ActionResult, string> {
    return this.#link.getResolver(() => {
      return {
        type: "wildcard",
        route: this.#route.route,
      };
    });
  }
}

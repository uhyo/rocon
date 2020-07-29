import { BuilderLink } from "..";
import { SearchLocationComposer } from "../../LocationComposer/SearchLocationComposer";
import type { RouteRecordType } from "../../RouteRecord";
import {
  WildcardRouteRecord,
  WildcardRouteRecordObject,
} from "../../RouteRecord/WildcardRouteRecord";
import type { RouteResolver } from "../../RouteResolver";
import type { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import type { BuilderLinkOptions } from "../BuilderLinkOptions";
import type { ActionType, RouteDefinition } from "../RoutesDefinitionObject";
import type {
  ActionTypeToWildcardFlag,
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type SearchRoutesBuilderOptions<ActionResult> = Omit<
  BuilderLinkOptions<ActionResult, string>,
  "composer"
>;

export class SearchRoutesBuilder<
  ActionResult,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
> implements AttachableRoutesBuilder<ActionResult, string> {
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
    options: Partial<SearchRoutesBuilderOptions<ActionResult>> = {}
  ): SearchRoutesBuilder<
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
    const rawBuilder = BuilderLink.init<ActionResult, string>(op);
    const result = new SearchRoutesBuilder<
      ActionResult,
      ActionTypeToWildcardFlag<RD["action"]>,
      Match &
        {
          [K in Key]: string;
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    >(rawBuilder, key as any, routeDefinition.action);
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
  ): SearchRoutesBuilder<
    ActionResult,
    ActionTypeToWildcardFlag<RD["action"]>,
    Match &
      {
        [K in Key]: string;
      }
  > {
    const b = SearchRoutesBuilder.init<ActionResult, Key, RD, Match>(
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

  #rawBuilder: BuilderLink<ActionResult, string>;
  #route: WildcardRouteRecordObject<ActionResult, Match, boolean>;

  private constructor(
    rawBuilder: BuilderLink<ActionResult, string>,
    key: Extract<keyof Match, string>,
    action: ActionType<ActionResult, Match> | undefined
  ) {
    this.#rawBuilder = rawBuilder;
    this.#route = {
      matchKey: key,
      route: new WildcardRouteRecord(this, key, action),
    };
  }

  getRoute(): WildcardRouteRecord<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route.route;
  }

  getBuilderLink(): BuilderLink<ActionResult, string> {
    return this.#rawBuilder;
  }

  getResolver(): RouteResolver<ActionResult, string> {
    return this.#rawBuilder.getResolver(() => {
      return {
        type: "wildcard",
        route: this.#route.route,
      };
    });
  }
}

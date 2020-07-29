import { RoutesBuilder } from "..";
import { SearchLocationComposer } from "../../LocationComposer/SearchLocationComposer";
import type { RouteRecordType } from "../../RouteRecord";
import {
  WildcardRouteRecord,
  WildcardRouteRecordObject,
} from "../../RouteRecord/WildcardRouteRecord";
import type { RouteResolver } from "../../RouteResolver";
import type { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import type { RoutesBuilderOptions } from "../RoutesBuilderOptions";
import type { RouteDefinition } from "../RoutesDefinitionObject";
import type {
  ActionTypeToWildcardFlag,
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type SearchRoutesBuilderOptions<ActionResult> = Omit<
  RoutesBuilderOptions<ActionResult, string>,
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
    const rawBuilder = RoutesBuilder.init<ActionResult, string>(op);
    const result = new SearchRoutesBuilder<
      ActionResult,
      ActionTypeToWildcardFlag<RD["action"]>,
      Match &
        {
          [K in Key]: string;
        }
    >(rawBuilder, {
      matchKey: key,
      route: new WildcardRouteRecord(
        rawBuilder.getRouteRecordConfig(),
        // TypeScript requires this `as` but this should be true because Key extends string.
        key as Extract<Key, string>,
        routeDefinition.action
      ),
    });
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

  #rawBuilder: RoutesBuilder<ActionResult, string>;
  #route: WildcardRouteRecordObject<ActionResult, Match, boolean>;

  private constructor(
    rawBuilder: RoutesBuilder<ActionResult, string>,
    route: WildcardRouteRecordObject<ActionResult, Match, boolean>
  ) {
    this.#rawBuilder = rawBuilder;
    this.#route = route;
  }

  getRoute(): WildcardRouteRecord<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.#route.route;
  }

  getRawBuilder(): RoutesBuilder<ActionResult, string> {
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

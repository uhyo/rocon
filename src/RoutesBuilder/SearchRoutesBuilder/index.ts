import { RoutesBuilder } from "..";
import { SearchLocationComposer } from "../../LocationComposer/SearchLocationComposer";
import type {
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
  WildcardInRouteRecords,
} from "../../RouteRecord";
import { WildcardRouteRecord } from "../../RouteRecord/WildcardRouteRecord";
import type { RouteResolver } from "../../RouteResolver";
import type { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import type { RoutesBuilderOptions } from "../RoutesBuilderOptions";
import type {
  RouteDefinition,
  RoutesDefinition,
} from "../RoutesDefinitionObject";
import { wildcardRouteKey } from "../symbols";
import type {
  ActionTypeToWildcardFlag,
  ExistingWildcardFlagType,
  WildcardFlagToHasAction,
} from "../WildcardFlagType";

export type SearchRoutesBuilderOptions = Omit<RoutesBuilderOptions, "composer">;

export class SearchRoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  WildcardFlag extends ExistingWildcardFlagType,
  Match
> implements AttachableRoutesBuilder<ActionResult, Defs, WildcardFlag, Match> {
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
    options: Partial<SearchRoutesBuilderOptions> = {}
  ): SearchRoutesBuilder<
    ActionResult,
    {},
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
    const rawBuilder = RoutesBuilder.init<ActionResult, Match>(op).wildcard<
      Key,
      string,
      RD
    >(key, routeDefinition);
    return new SearchRoutesBuilder(rawBuilder);
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
    {},
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

  #rawBuilder: RoutesBuilder<ActionResult, Defs, WildcardFlag, Match>;

  private constructor(
    rawBuilder: RoutesBuilder<ActionResult, Defs, WildcardFlag, Match>
  ) {
    this.#rawBuilder = rawBuilder;
  }

  getRoute(): WildcardRouteRecord<
    ActionResult,
    Match,
    WildcardFlagToHasAction<WildcardFlag>
  > {
    return this.getRoutes()[wildcardRouteKey].route as WildcardRouteRecord<
      ActionResult,
      Match,
      WildcardFlagToHasAction<WildcardFlag>
    >;
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Match> &
      WildcardInRouteRecords<ActionResult, WildcardFlag, Match>
  > {
    return this.#rawBuilder.getRoutes();
  }

  getRawBuilder(): RoutesBuilder<ActionResult, Defs, WildcardFlag, Match> {
    return this.#rawBuilder;
  }

  getResolver(): RouteResolver<ActionResult, string> {
    return this.#rawBuilder.getResolver();
  }
}

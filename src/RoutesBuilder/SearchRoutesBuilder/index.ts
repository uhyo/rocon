import { RoutesBuilder } from "..";
import { PathLocationComposer } from "../../LocationComposer/PathLocationComposer";
import type {
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
} from "../../RouteRecord";
import type { RouteResolver } from "../../RouteResolver";
import type { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import {
  PathRoutesBuilder,
  PathRoutesBuilderOptions,
} from "../PathRoutesBuilder";
import type { RoutesDefinition } from "../RoutesDefinitionObject";
import type { WildcardFlagType } from "../WildcardFlagType";

export class SearchRoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  WildcardFlag extends WildcardFlagType,
  Match
> implements AttachableRoutesBuilder<ActionResult, Defs, WildcardFlag, Match> {
  static init<ActionResult, Match = {}>(
    options: Partial<PathRoutesBuilderOptions> = {}
  ): SearchRoutesBuilder<ActionResult, {}, "none", Match> {
    const op = {
      ...options,
      composer: new PathLocationComposer(),
    };
    const rawBuilder = RoutesBuilder.init<ActionResult, Match>(op);
    return new SearchRoutesBuilder(rawBuilder);
  }

  /**
   * Attach a newly created PathRouteBuilder to given route.
   */
  static attachTo<ActionResult, Match, HasAction extends boolean>(
    route: RouteRecordType<ActionResult, Match, HasAction>
  ): PathRoutesBuilder<ActionResult, {}, "none", Match> {
    return route.attach(PathRoutesBuilder.init());
  }

  #rawBuilder: RoutesBuilder<ActionResult, Defs, WildcardFlag, Match>;

  private constructor(
    rawBuilder: RoutesBuilder<ActionResult, Defs, WildcardFlag, Match>
  ) {
    this.#rawBuilder = rawBuilder;
  }
  getRawBuilder(): RoutesBuilder<ActionResult, Defs, WildcardFlag, Match> {
    return this.#rawBuilder;
  }

  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Match>
  > {
    return this.#rawBuilder.getResolver();
  }
}

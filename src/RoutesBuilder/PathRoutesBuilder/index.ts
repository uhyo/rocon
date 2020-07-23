import { RoutesBuilder } from "..";
import { PathLocationComposer } from "../../LocationComposer/PathLocationComposer";
import type {
  RoutesDefinitionToRouteRecords,
  WildcardInRouteRecords,
} from "../../RouteRecord";
import { RouteResolver } from "../../RouteResolver";
import type { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import type { RoutesBuilderOptions } from "../RoutesBuilderOptions";
import type { RoutesDefinition } from "../RoutesDefinitionObject";
import type { WildcardFlagType } from "../WildcardFlagType";

export type PathRoutesBuilderOptions = Omit<RoutesBuilderOptions, "composer">;

/**
 * Builder to define routes using pathname.
 */
export class PathRoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  WildcardFlag extends WildcardFlagType,
  Match
> implements AttachableRoutesBuilder<ActionResult, Defs, WildcardFlag, Match> {
  static init<ActionResult>(
    options: Partial<PathRoutesBuilderOptions> = {}
  ): PathRoutesBuilder<ActionResult, {}, "none", {}> {
    const op = {
      ...options,
      composer: new PathLocationComposer(),
    };
    const rawBuilder = RoutesBuilder.init<ActionResult>(op);
    return new PathRoutesBuilder(rawBuilder);
  }

  #rawBuilder: RoutesBuilder<ActionResult, Defs, WildcardFlag, Match>;

  private constructor(
    rawBuilder: RoutesBuilder<ActionResult, Defs, WildcardFlag, Match>
  ) {
    this.#rawBuilder = rawBuilder;
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): PathRoutesBuilder<
    ActionResult,
    Omit<Defs, keyof D> & D,
    WildcardFlag,
    Match
  > {
    return new PathRoutesBuilder(this.#rawBuilder.routes(defs));
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

  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Match>
  > {
    return this.#rawBuilder.getResolver();
  }
}

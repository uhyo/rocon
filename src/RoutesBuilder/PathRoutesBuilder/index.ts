import { RoutesBuilder } from "..";
import { PathLocationComposer } from "../../LocationComposer/PathLocationComposer";
import {
  RoutesDefinitionToRouteRecords,
  WildcardInRouteRecords,
} from "../../RouteRecord";
import { RouteResolver } from "../../RouteResolver";
import { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import { RoutesBuilderOptions } from "../RoutesBuilderOptions";
import { RoutesDefinition } from "../RoutesDefinitionObject";
import { WildcardFlagType } from "../WildcardFlagType";

export type PathRoutesBuilderOptions = Omit<RoutesBuilderOptions, "composer">;

/**
 * Builder to define routes using pathname.
 */
export class PathRoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  WildcardFlag extends WildcardFlagType,
  Wildcard
>
  implements
    AttachableRoutesBuilder<ActionResult, Defs, WildcardFlag, Wildcard> {
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

  #rawBuilder: RoutesBuilder<ActionResult, Defs, WildcardFlag, Wildcard>;

  private constructor(
    rawBuilder: RoutesBuilder<ActionResult, Defs, WildcardFlag, Wildcard>
  ) {
    this.#rawBuilder = rawBuilder;
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): PathRoutesBuilder<
    ActionResult,
    Omit<Defs, keyof D> & D,
    WildcardFlag,
    Wildcard
  > {
    return new PathRoutesBuilder(this.#rawBuilder.routes(defs));
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Wildcard> &
      WildcardInRouteRecords<ActionResult, WildcardFlag, Wildcard>
  > {
    return this.#rawBuilder.getRoutes();
  }

  getRawBuilder(): RoutesBuilder<ActionResult, Defs, WildcardFlag, Wildcard> {
    return this.#rawBuilder;
  }

  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Wildcard>
  > {
    return this.#rawBuilder.getResolver();
  }
}

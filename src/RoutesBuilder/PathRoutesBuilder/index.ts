import { RoutesBuilder } from "..";
import { PathLocationComposer } from "../../LocationComposer/PathLocationComposer";
import type {
  RouteRecordType,
  RoutesDefinitionToRouteRecords,
  WildcardInRouteRecords,
} from "../../RouteRecord";
import { RouteResolver } from "../../RouteResolver";
import type { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import type { RoutesBuilderOptions } from "../RoutesBuilderOptions";
import type {
  RouteDefinition,
  RoutesDefinition,
} from "../RoutesDefinitionObject";
import type {
  ActionTypeToWildcardFlag,
  WildcardFlagType,
} from "../WildcardFlagType";

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
  static init<ActionResult, Match = {}>(
    options: Partial<PathRoutesBuilderOptions> = {}
  ): PathRoutesBuilder<ActionResult, {}, "none", Match> {
    const op = {
      ...options,
      composer: new PathLocationComposer(),
    };
    const rawBuilder = RoutesBuilder.init<ActionResult, Match>(op);
    return new PathRoutesBuilder(rawBuilder);
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

  any<
    Key extends string,
    RD extends RouteDefinition<
      ActionResult,
      Match &
        {
          [K in Key]: string;
        }
    >
  >(
    key: Key,
    routeDefinition: RD
  ): PathRoutesBuilder<
    ActionResult,
    Defs,
    ActionTypeToWildcardFlag<RD["action"]>,
    Match &
      {
        [K in Key]: string;
      }
  > {
    return new PathRoutesBuilder(
      this.#rawBuilder.wildcard(key, routeDefinition)
    );
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

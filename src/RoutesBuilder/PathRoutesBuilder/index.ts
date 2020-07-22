import { RoutesBuilder } from "..";
import { PathLocationComposer } from "../../LocationComposer/PathLocationComposer";
import { RoutesDefinitionToRouteRecords } from "../../RouteRecord";
import { WildcardRouteRecordObject } from "../../RouteRecord/WildcardRouteRecord";
import { RouteResolver } from "../../RouteResolver";
import { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import { RoutesBuilderOptions } from "../RoutesBuilderOptions";
import { RoutesDefinition } from "../RoutesDefinitionObject";
import { wildcardRouteKey } from "../symbols";

export type PathRoutesBuilderOptions = Omit<RoutesBuilderOptions, "composer">;

/**
 * Builder to define routes using pathname.
 */
export class PathRoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  HasWildcard extends boolean,
  Wildcard
>
  implements
    AttachableRoutesBuilder<ActionResult, Defs, HasWildcard, Wildcard> {
  static init<ActionResult>(
    options: Partial<PathRoutesBuilderOptions> = {}
  ): PathRoutesBuilder<ActionResult, {}, false, {}> {
    const op = {
      ...options,
      composer: new PathLocationComposer(),
    };
    const rawBuilder = RoutesBuilder.init<ActionResult>(op);
    return new PathRoutesBuilder(rawBuilder);
  }

  #rawBuilder: RoutesBuilder<ActionResult, Defs, HasWildcard, Wildcard>;

  private constructor(
    rawBuilder: RoutesBuilder<ActionResult, Defs, HasWildcard, Wildcard>
  ) {
    this.#rawBuilder = rawBuilder;
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): PathRoutesBuilder<
    ActionResult,
    Omit<Defs, keyof D> & D,
    HasWildcard,
    Wildcard
  > {
    return new PathRoutesBuilder(this.#rawBuilder.routes(defs));
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Wildcard> & {
      readonly [wildcardRouteKey]?: WildcardRouteRecordObject<
        ActionResult,
        Wildcard
      >;
    }
  > {
    return this.#rawBuilder.getRoutes();
  }

  getRawBuilder(): RoutesBuilder<ActionResult, Defs, HasWildcard, Wildcard> {
    return this.#rawBuilder;
  }

  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs, Wildcard>
  > {
    return this.#rawBuilder.getResolver();
  }
}

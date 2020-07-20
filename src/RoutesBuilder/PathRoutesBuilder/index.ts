import { RoutesBuilder } from "..";
import { PathLocationComposer } from "../../LocationComposer/PathLocationComposer";
import { RoutesDefinitionToRouteRecords } from "../../RouteRecord";
import { RouteResolver } from "../../RouteResolver";
import { AttachableRoutesBuilder } from "../AttachableRoutesBuilder";
import { RoutesBuilderOptions } from "../RoutesBuilderOptions";
import { RoutesDefinition } from "../RoutesDefinitionObject";
import { wildcardRouteKey } from "../symbols";
import { WildcardRouteRecordObject } from "../WildcardRouteRecord";

export type PathRoutesBuilderOptions = Omit<RoutesBuilderOptions, "composer">;

/**
 * Builder to define routes using pathname.
 */
export class PathRoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  Wildcard
> implements AttachableRoutesBuilder<ActionResult, Defs, Wildcard> {
  static init<ActionResult>(
    options: Partial<PathRoutesBuilderOptions> = {}
  ): PathRoutesBuilder<ActionResult, {}, {}> {
    const op = {
      ...options,
      composer: new PathLocationComposer(),
    };
    const rawBuilder = RoutesBuilder.init<ActionResult>(op);
    return new PathRoutesBuilder(rawBuilder);
  }

  #rawBuilder: RoutesBuilder<ActionResult, Defs, Wildcard>;

  private constructor(rawBuilder: RoutesBuilder<ActionResult, Defs, Wildcard>) {
    this.#rawBuilder = rawBuilder;
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): PathRoutesBuilder<ActionResult, Omit<Defs, keyof D> & D, Wildcard> {
    return new PathRoutesBuilder(this.#rawBuilder.routes(defs));
  }

  getRoutes(): Readonly<
    RoutesDefinitionToRouteRecords<ActionResult, Defs> & {
      readonly [wildcardRouteKey]?: WildcardRouteRecordObject<
        Wildcard,
        ActionResult
      >;
    }
  > {
    return this.#rawBuilder.getRoutes();
  }

  getRawBuilder(): RoutesBuilder<ActionResult, Defs, Wildcard> {
    return this.#rawBuilder;
  }

  getResolver(): RouteResolver<
    ActionResult,
    RoutesDefinitionToRouteRecords<ActionResult, Defs>
  > {
    return this.#rawBuilder.getResolver();
  }
}

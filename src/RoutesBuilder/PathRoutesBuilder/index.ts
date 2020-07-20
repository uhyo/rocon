import { RoutesBuilder } from "..";
import { PathLocationComposer } from "../../LocationComposer/PathLocationComposer";
import { fillOptions } from "../fillOptions";
import { RoutesBuilderOptions } from "../RoutesBuilderOptions";
import { RoutesDefinition } from "../RoutesDefinitionObject";

export type PathRoutesBuilderOptions = Omit<RoutesBuilderOptions, "composer">;

/**
 * Builder to define routes using pathname.
 */
export class PathRoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>,
  Wildcard
> extends RoutesBuilder<ActionResult, Defs, Wildcard> {
  static init<ActionResult>(
    options: Partial<PathRoutesBuilderOptions> = {}
  ): PathRoutesBuilder<ActionResult, {}, {}> {
    const op = {
      ...options,
      composer: new PathLocationComposer(),
    };
    fillOptions(op);
    return new PathRoutesBuilder(op);
  }
}

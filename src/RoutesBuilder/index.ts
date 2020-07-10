import { fillOptions } from "./fillOptions";
import type {
  RouteDefinition,
  RoutesDefinition,
} from "./RoutesDefinitionObject";
import type { RoutesOptions } from "./RoutesOptions";

/**
 * Abstract Builder to define routes.
 */
export class RoutesBuilder<
  ActionResult,
  Defs extends RoutesDefinition<ActionResult>
> {
  static init<ActionResult>(
    options: Partial<RoutesOptions> = {}
  ): RoutesBuilder<ActionResult, {}> {
    fillOptions(options);
    return new RoutesBuilder<ActionResult, {}>(options);
  }

  readonly options: RoutesOptions;
  #routes: Record<string, RouteDefinition<never, ActionResult>> = Object.create(
    null
  );

  private constructor(options: RoutesOptions) {
    this.options = options;
  }

  routes<D extends RoutesDefinition<ActionResult>>(
    defs: D
  ): RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D> {
    const result = new RoutesBuilder(this.options);
    Object.assign(result.#routes, this.#routes, defs);
    return result as RoutesBuilder<ActionResult, Omit<Defs, keyof D> & D>;
  }

  getRoutes(): Defs {
    return this.#routes as Defs;
  }
}

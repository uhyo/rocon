import { fillOptions } from "./fillOptions";
import type {
  RouteDefinition,
  RoutesDefinition,
} from "./RoutesDefinitionObject";
import type { RoutesOptions } from "./RoutesOptions";

/**
 * Abstract Builder to define routes.
 */
export class RoutesBuilder<Result, Defs extends RoutesDefinition<Result>> {
  static init<Result>(
    options: Partial<RoutesOptions> = {}
  ): RoutesBuilder<Result, {}> {
    fillOptions(options);
    return new RoutesBuilder<Result, {}>(options);
  }

  readonly options: RoutesOptions;
  #routes: Record<string, RouteDefinition<never, Result>> = Object.create(null);

  private constructor(options: RoutesOptions) {
    this.options = options;
  }

  routes<D extends RoutesDefinition<Result>>(
    defs: D
  ): RoutesBuilder<Result, Omit<Defs, keyof D> & D> {
    const result = new RoutesBuilder(this.options);
    result.#routes = Object.assign(Object.create(null), this.#routes, defs);
    return result as RoutesBuilder<Result, Omit<Defs, keyof D> & D>;
  }

  getRoutes(): Defs {
    return this.#routes as Defs;
  }
}

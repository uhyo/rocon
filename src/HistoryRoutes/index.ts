import type { State } from "history";
import type { RoutesDefinition } from "../RoutesBuilder/RoutesDefinitionObject";
import type { Destination } from "./Destination";
import type { HistoryRoutesOptions } from "./HistoryRoutesOptions";
import type { DefinitionFromRouteObjects, RouteObject } from "./RouteObject";

export class HistoryRoutes<Defs extends RoutesDefinition<Destination<State>>> {
  static init<Defs extends RoutesDefinition<Destination<State>>>(
    routes: Defs,
    options: HistoryRoutesOptions
  ): DefinitionFromRouteObjects<Defs> {
    return (new HistoryRoutes(
      routes,
      options
    ) as unknown) as DefinitionFromRouteObjects<Defs>;
  }

  #routes: Defs;
  #options: HistoryRoutesOptions;
  private constructor(routes: Defs, options: HistoryRoutesOptions) {
    this.#routes = routes;
    this.#options = options;

    const _t = (this as unknown) as Record<string, RouteObject<State>>;
    for (const key of Object.getOwnPropertyNames(routes)) {
      _t[key] = {
        // code is old
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        go: (state) => {
          this.#go(key, state);
        },
      };
    }
  }

  #go = (route: keyof Defs, ...state: [] | [State]): void => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-explicit-any
    const dest = this.#routes[route].action!((state as any)[0]);
    const { state: s, ...rest } = dest;
    this.#options.history.push(rest, s);
  };
}

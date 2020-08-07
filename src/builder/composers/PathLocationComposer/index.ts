import type { BaseState, Location } from "../../../core/Location";
import type {
  DecomposeResult,
  LocationComposer,
} from "../../../core/LocationComposer";
import { composePath } from "./composePath";
import { decomposePath } from "./decomposePath";

export class PathLocationComposer
  implements LocationComposer<string | undefined> {
  isLeaf(location: Readonly<Location>): boolean {
    return location.pathname === "/";
  }
  compose<S extends BaseState>(
    base: Readonly<Location<S>>,
    segment: string | undefined
  ): Location<S> {
    if (segment === undefined) {
      return base;
    }
    return {
      ...base,
      pathname: composePath(base.pathname, segment),
    };
  }
  decompose<S extends BaseState>(
    location: Readonly<Location<S>>
  ): Array<DecomposeResult<string | undefined, S>> {
    const { pathname } = location;
    const s = decomposePath(pathname);
    if (s === undefined) {
      return [];
    }
    const [segment, next] = s;
    return [
      {
        segment,
        nextLocation: {
          ...location,
          pathname: next || "/",
        },
      },
    ];
  }
}

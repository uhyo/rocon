import type { LocationComposer } from "..";
import type { BaseState, Location } from "../Location";
import { composePath } from "./composePath";
import { decomposePath } from "./decomposePath";

export class PathLocationComposer implements LocationComposer<string> {
  isLeaf(location: Readonly<Location>): boolean {
    return location.pathname === "/";
  }
  compose<S extends BaseState>(
    base: Readonly<Location<S>>,
    segment: string
  ): Location<S> {
    return {
      ...base,
      pathname: composePath(base.pathname, segment),
    };
  }
  decompose<S extends BaseState>(
    location: Readonly<Location<S>>
  ): Array<[string, Location<S>]> {
    const { pathname } = location;
    const s = decomposePath(pathname);
    if (s === undefined) {
      return [];
    }
    const [segment, next] = s;
    return [
      [
        segment,
        {
          ...location,
          pathname: next || "/",
        },
      ],
    ];
  }
}

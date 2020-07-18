import { LocationComposer } from "..";
import { BaseState, Location } from "../Location";
import { composePath } from "./composePath";
import { decomposePath } from "./decomposePath";

export class PathLocationComposer implements LocationComposer<string> {
  compose<S extends BaseState>(
    base: Location<S>,
    segment: string
  ): Location<S> {
    return {
      ...base,
      pathname: composePath(base.pathname, segment),
    };
  }
  decompose<S extends BaseState>(
    location: Location<S>
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

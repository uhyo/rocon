import { LocationComposer } from "..";
import { BaseState, Location } from "../Location";
import { composePath } from "./composePath";

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
}

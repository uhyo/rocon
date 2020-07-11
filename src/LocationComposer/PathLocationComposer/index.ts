import { LocationComposer } from "..";
import { Location } from "../Location";
import { composePath } from "./composePath";

export class PathLocationComposer implements LocationComposer<string> {
  compose<S>(base: Location<S>, segment: string): Location<S> {
    return {
      ...base,
      pathname: composePath(base.pathname, segment),
    };
  }
}

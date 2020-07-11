import { LocationComposer } from "..";
import { BaseState, Location } from "../Location";
import { composePath } from "./composePath";

export class PathLocationComposer<RootState extends BaseState>
  implements LocationComposer<string> {
  readonly root: Readonly<Location<RootState>>;
  constructor(root: Location<RootState>) {
    this.root = root;
  }
  getRoot(): Location<RootState> {
    return this.root;
  }
  compose<S>(base: Location<S>, segment: string): Location<S> {
    return {
      ...base,
      pathname: composePath(base.pathname, segment),
    };
  }
}

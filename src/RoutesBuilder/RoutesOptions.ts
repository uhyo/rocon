import { LocationComposer } from "../LocationComposer";
import { Location } from "../LocationComposer/Location";

export type RoutesOptions = {
  /**
   * LocationComposer for composing children paths.
   */
  composer: LocationComposer<string>;
  /**
   * Root location.
   */
  root: Location;
};

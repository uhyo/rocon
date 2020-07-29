import { LocationComposer } from "../LocationComposer";
import { Location } from "../LocationComposer/Location";

export type BuilderLinkOptions<ActionResult, Segment> = {
  /**
   * LocationComposer for composing children paths.
   */
  composer: LocationComposer<Segment>;
  /**
   * Root location.
   */
  root: Location;
};

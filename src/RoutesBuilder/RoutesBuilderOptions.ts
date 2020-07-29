import { LocationComposer } from "../LocationComposer";
import { Location } from "../LocationComposer/Location";

export type RoutesBuilderOptions<ActionResult, Segment> = {
  /**
   * LocationComposer for composing children paths.
   */
  composer: LocationComposer<Segment>;
  /**
   * Function to resolve segment.
   */
  // resolveSegment: (segment: Segment) => ResolvedSegmentType<ActionResult>;
  /**
   * Root location.
   */
  root: Location;
};

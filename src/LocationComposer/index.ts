import { Location } from "./Location";

/**
 * Interface of serializer.
 */
export interface LocationComposer<Segment> {
  getRoot(): Location;
  compose(base: Location, segment: Segment): Location;
}

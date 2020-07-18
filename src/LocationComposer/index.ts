import { Location } from "./Location";

/**
 * Interface of composer.
 */
export interface LocationComposer<Segment> {
  compose(base: Location, segment: Segment): Location;
  decompose(location: Location): Array<[segment: Segment, next: Location]>;
}

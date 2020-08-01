import { Location } from "../core/Location";

/**
 * Interface of composer.
 */
export interface LocationComposer</* invariant */ Segment> {
  /**
   * Returns whether given location is a leaf location.
   */
  isLeaf(location: Readonly<Location>): boolean;
  /**
   * Composes given location with a new segment.
   * @param base base location
   * @param segment new segment
   */
  compose(base: Readonly<Location>, segment: Segment): Location;
  /**
   * Decomposes given location into a set of pairs of a segment and a next location.
   * @param location 
   */
  decompose(location: Readonly<Location>): Array<[segment: Segment, next: Location]>;
}

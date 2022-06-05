import type { BaseState, Location } from "../../../core/Location";
import type {
  DecomposeResult,
  LocationComposer,
} from "../../../core/LocationComposer";
import { locationDiff } from "../../../util/path/locationDiff";

/**
 * LocationComposer that composes to a constant location.
 */
export class ConstLocationComposer implements LocationComposer<unknown> {
  private location: Location;

  constructor(location: Location) {
    this.location = location;
  }

  isLeaf(): boolean {
    return false;
  }
  compose(): Location {
    return this.location;
  }

  decompose<S extends BaseState>(
    base: Location<S>
  ): Array<DecomposeResult<unknown, S>> {
    const diff = locationDiff(this.location, base);
    if (diff === undefined) {
      return [];
    }
    return [
      {
        leaf: false,
        segment: undefined,
        nextLocation: diff,
      },
    ];
  }
}

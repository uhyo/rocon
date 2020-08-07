import type { BaseState, Location } from "../../../core/Location";
import type {
  DecomposeResult,
  LocationComposer,
} from "../../../core/LocationComposer";

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
    return [
      {
        segment: undefined,
        nextLocation: base,
      },
    ];
  }
}

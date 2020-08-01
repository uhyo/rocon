import type { BaseState, Location } from "../../../core/Location";
import type { LocationComposer } from "../../../core/LocationComposer";

/**
 * LocationComposer that does nothing.
 */
class IdentityLocationComposer implements LocationComposer<unknown> {
  isLeaf(): boolean {
    return false;
  }
  compose<S extends BaseState>(base: Location<S>): Location<S> {
    return base;
  }

  decompose<S extends BaseState>(
    base: Location<S>
  ): Array<[unknown, Location<S>]> {
    return [[undefined, base]];
  }
}

export const identityLocationComposer = new IdentityLocationComposer();

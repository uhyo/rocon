import type { BaseState, Location } from "../../../core/Location";
import type {
  DecomposeResult,
  LocationComposer,
} from "../../../core/LocationComposer";
import type { OptionalIf } from "../../../util/OptionalIf";

export class SingleHashLocationComposer<IsOptional extends boolean>
  implements LocationComposer<OptionalIf<IsOptional, string>> {
  readonly optional: IsOptional;
  constructor(optional: IsOptional) {
    this.optional = optional;
  }

  isLeaf(location: Readonly<Location>): boolean {
    return !location.hash;
  }
  compose<S extends BaseState>(
    base: Readonly<Location<S>>,
    segment: OptionalIf<IsOptional, string>
  ): Location<S> {
    return {
      ...base,
      hash: segment !== undefined ? "#" + segment : "",
    };
  }
  decompose<S extends BaseState>(
    location: Readonly<Location<S>>
  ): Array<DecomposeResult<OptionalIf<IsOptional, string>, S>> {
    const { hash } = location;

    if (!hash?.startsWith("#")) {
      if (this.optional) {
        return [
          {
            leaf: false,
            segment: undefined as OptionalIf<IsOptional, string>,
            nextLocation: location,
          },
        ];
      } else {
        return [];
      }
    }

    const nextLocation = {
      ...location,
      hash: "",
    };

    return [
      {
        leaf: false,
        // string is always valid as segment but TS does not allow it
        segment: hash.slice(1) as OptionalIf<IsOptional, string>,
        nextLocation: nextLocation,
      },
    ];
  }
}

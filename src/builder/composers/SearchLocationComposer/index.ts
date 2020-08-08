import type { BaseState, Location } from "../../../core/Location";
import type {
  DecomposeResult,
  LocationComposer,
} from "../../../core/LocationComposer";
import type { OptionalIf } from "../../../util/OptionalIf";

export class SearchLocationComposer<IsOptional extends boolean>
  implements LocationComposer<OptionalIf<IsOptional, string>> {
  readonly key: string;
  readonly optional: IsOptional;
  constructor(key: string, optional: IsOptional) {
    this.key = key;
    this.optional = optional;
  }

  isLeaf(location: Readonly<Location>): boolean {
    return !location.search;
  }
  compose<S extends BaseState>(
    base: Readonly<Location<S>>,
    segment: OptionalIf<IsOptional, string>
  ): Location<S> {
    const params = new URLSearchParams(base.search);
    if (segment !== undefined) {
      params.set(this.key, segment as string);
    }

    return {
      ...base,
      search: params.toString(),
    };
  }
  decompose<S extends BaseState>(
    location: Readonly<Location<S>>
  ): Array<DecomposeResult<OptionalIf<IsOptional, string>, S>> {
    const { search } = location;
    const params = new URLSearchParams(search);
    const value = params.get(this.key);

    if (value === null) {
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

    params.delete(this.key);
    const nextLocation = {
      ...location,
      search: params.toString(),
    };

    return [
      {
        leaf: false,
        // string is always valid as segment but TS does not allow it
        segment: value as OptionalIf<IsOptional, string>,
        nextLocation: nextLocation,
      },
    ];
  }
}

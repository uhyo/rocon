import type { BaseState, Location } from "../../../core/Location";
import type {
  DecomposeResult,
  LocationComposer,
} from "../../../core/LocationComposer";

export class SearchLocationComposer implements LocationComposer<string> {
  readonly key: string;
  constructor(key: string) {
    this.key = key;
  }

  isLeaf(location: Readonly<Location>): boolean {
    return !location.search;
  }
  compose<S extends BaseState>(
    base: Readonly<Location<S>>,
    segment: string
  ): Location<S> {
    const params = new URLSearchParams(base.search);
    params.set(this.key, segment);

    return {
      ...base,
      search: params.toString(),
    };
  }
  decompose<S extends BaseState>(
    location: Readonly<Location<S>>
  ): Array<DecomposeResult<string, S>> {
    const { search } = location;
    const params = new URLSearchParams(search);
    const value = params.get(this.key);
    if (value === null) {
      return [];
    }

    params.delete(this.key);
    const nextLocation = {
      ...location,
      search: params.toString(),
    };
    return [
      {
        leaf: false,
        segment: value,
        nextLocation: nextLocation,
      },
    ];
  }
}

import type { LocationComposer } from "..";
import type { BaseState, Location } from "../../core/Location";

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
  ): Array<[string, Location<S>]> {
    const { search } = location;
    const params = new URLSearchParams(search);
    const value = params.get(this.key);
    if (value === null) {
      return [];
    }

    params.delete(this.key);
    return [
      [
        value,
        {
          ...location,
          search: params.toString(),
        },
      ],
    ];
  }
}

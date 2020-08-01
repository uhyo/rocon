import type { BaseState, Location } from "../../../core/Location";
import type { LocationComposer } from "../../../core/LocationComposer";
import type { Validator } from "../../../validator";

export class StateLocationComposer<Key extends string, StateValue>
  implements LocationComposer<StateValue> {
  readonly key: Key;
  readonly validator: Validator<StateValue>;
  constructor(key: Key, validator: Validator<StateValue>) {
    this.key = key;
    this.validator = validator;
  }

  isLeaf(location: Readonly<Location>): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (location.state as any)?.[this.key] === undefined;
  }
  compose<S extends BaseState>(
    base: Readonly<Location<S>>,
    segment: StateValue
  ): Location<S> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newState = {
      ...base.state,
      [this.key]: segment,
    };

    return {
      ...base,
      state: newState,
    };
  }
  decompose<S extends BaseState>(
    location: Readonly<Location<S>>
  ): Array<[StateValue, Location<Omit<S, Key>>]> {
    const { state } = location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (state as any)?.[this.key];
    if (value === undefined || !this.validator(value)) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [this.key]: _, ...rest } = state;
    return [
      [
        value,
        {
          ...location,
          state: rest,
        },
      ],
    ];
  }
}

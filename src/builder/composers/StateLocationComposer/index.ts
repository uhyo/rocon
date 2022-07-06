import type { BaseState, Location } from "../../../core/Location";
import type {
  DecomposeResult,
  LocationComposer,
} from "../../../core/LocationComposer";
import { OptionalIf } from "../../../util/types/OptionalIf";
import type { Validator } from "../../../validator";

export class StateLocationComposer<
  Key extends string,
  StateValue,
  IsOptional extends boolean
> implements LocationComposer<OptionalIf<IsOptional, StateValue>>
{
  readonly key: Key;
  readonly optional: IsOptional;
  readonly validator: Validator<OptionalIf<IsOptional, StateValue>>;
  constructor(
    key: Key,
    validator: Validator<OptionalIf<IsOptional, StateValue>>,
    optional: IsOptional
  ) {
    this.key = key;
    this.optional = optional;
    this.validator = validator;
  }

  isLeaf(location: Readonly<Location>): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (location.state as any)?.[this.key] === undefined;
  }
  compose<S extends BaseState>(
    base: Readonly<Location<S>>,
    segment: OptionalIf<IsOptional, StateValue>
  ): Location<S> {
    const newState = {
      ...(base.state as {}),
      [this.key]: segment,
    } as S;

    return {
      ...base,
      state: newState,
    };
  }
  decompose<S extends BaseState>(
    location: Readonly<Location<S>>
  ): Array<DecomposeResult<OptionalIf<IsOptional, StateValue>, Omit<S, Key>>> {
    const { state } = location;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = (state as any)?.[this.key];
    if (value === undefined) {
      if (this.optional) {
        return [
          {
            leaf: false,
            segment: undefined as OptionalIf<IsOptional, StateValue>,
            nextLocation: location,
          },
        ];
      } else {
        return [];
      }
    }
    if (!this.validator(value)) {
      return [];
    }

    const { [this.key]: _, ...rest } = state as Record<string, unknown>;
    const nextLocation = {
      ...location,
      state: rest as Omit<S, Key>,
    };
    return [
      {
        leaf: false,
        segment: value as OptionalIf<IsOptional, StateValue>,
        nextLocation,
      },
    ];
  }
}

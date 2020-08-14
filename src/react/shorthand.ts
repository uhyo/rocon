import type { PathRouteBuilder } from "../builder/PathRouteBuilder";
import type {
  RootRouteBuilder,
  RootRouteBuilderOptions,
} from "../builder/RootRouteBuilder";
import type {
  SearchRouteBuilder,
  SearchRouteBuilderOptions,
} from "../builder/SearchRouteBuilder";
import type {
  SingleHashRouteBuilder,
  SingleHashRouteBuilderOptions,
} from "../builder/SingleHashRouteBuilder";
import type {
  StateRouteBuilder,
  StateRouteBuilerOptions,
} from "../builder/StateRouteBuilder";
import {
  Path as RawPath,
  Root as RawRoot,
  Search as RawSearch,
  SingleHash as RawSingleHash,
  State as RawState,
} from "../shorthand";
import type { OptionalIf } from "../util/OptionalIf";
import type { Validator } from "../validator";
import type { ReactElement } from "./types/ReactElement";

type ActionResult = ReactElement | null;

export const Path: <Match = {}>() => PathRouteBuilder<
  ActionResult,
  {},
  "none",
  "none",
  Match
> = RawPath;

export const Search: <
  Key extends string,
  Match extends {
    [K in Key]: IsOptional extends false ? string : string | undefined;
  },
  IsOptional extends boolean = false
>(
  matchKey: Key,
  options?: SearchRouteBuilderOptions<IsOptional>
) => SearchRouteBuilder<ActionResult, "noaction", Match> = RawSearch;

export const State: <
  StateValue,
  Key extends string,
  Match extends { [K in Key]: OptionalIf<IsOptional, StateValue> },
  IsOptional extends boolean = false
>(
  matchKey: Key,
  validator: Validator<StateValue>,
  options?: StateRouteBuilerOptions<IsOptional>
) => StateRouteBuilder<ActionResult, StateValue, "noaction", Match> = RawState;

export const Root: (
  options?: Partial<RootRouteBuilderOptions>
) => RootRouteBuilder<ActionResult, "noaction", {}> = RawRoot;

export const SingleHash: <
  Key extends string,
  Match extends {
    [K in Key]: IsOptional extends false ? string : string | undefined;
  },
  IsOptional extends boolean = false
>(
  matchKey: Key,
  options?: SingleHashRouteBuilderOptions<IsOptional>
) => SingleHashRouteBuilder<ActionResult, "noaction", Match> = RawSingleHash;

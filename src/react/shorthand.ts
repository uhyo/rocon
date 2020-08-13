import type { PathRouteBuilder } from "../builder/PathRouteBuilder";
import {
  RootRouteBuilder,
  RootRouteBuilderOptions,
} from "../builder/RootRouteBuilder";
import type {
  SearchRouteBuilder,
  SearchRouteBuilderOptions,
} from "../builder/SearchRouteBuilder";
import {
  StateRouteBuilder,
  StateRouteBuilerOptions,
} from "../builder/StateRouteBuilder";
import {
  Path as RawPath,
  Root as RawRoot,
  Search as RawSearch,
  State as RawState,
} from "../shorthand";
import { OptionalIf } from "../util/OptionalIf";
import { Validator } from "../validator";
import { ReactElement } from "./types/ReactElement";

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

import type { HasBuilderLink } from "../../BuilderLink/AttachableRouteBuilder";
import type { PathRouteBuilder } from "../PathRouteBuilder";
import type { SearchRouteBuilder } from "../SearchRouteBuilder";
import type { StateRouteBuilder } from "../StateRouteBuilder";

/**
 * Add match contents to given RouteBuilder.
 * When you add a new RouteBuilder, you should also add the type here
 * or the new builder gets less type inference support.
 */
export type AddMatchToRouteBuilder<
  Match,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  B extends HasBuilderLink<any, any>
> = B extends PathRouteBuilder<
  infer ActionResult,
  infer Defs,
  infer WildcardFlag,
  infer IntrinsicMatch
>
  ? PathRouteBuilder<ActionResult, Defs, WildcardFlag, IntrinsicMatch & Match>
  : B extends SearchRouteBuilder<
      infer ActionResult,
      infer WildcardFlag,
      infer IntrinsicMatch
    >
  ? SearchRouteBuilder<ActionResult, WildcardFlag, IntrinsicMatch & Match>
  : B extends StateRouteBuilder<
      infer ActionResult,
      infer StateValue,
      infer WildcardFlag,
      infer IntrinsicMatch
    >
  ? StateRouteBuilder<
      ActionResult,
      StateValue,
      WildcardFlag,
      IntrinsicMatch & Match
    >
  : B;

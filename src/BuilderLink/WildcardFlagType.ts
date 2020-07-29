/**
 * Flag of how a RoutesBuilder holds a wildcard route.
 * - "none": no wildcard route.
 * - "noatcion": wildcard route with no action.
 * - "hasaction": wildcard route with an action.
 */
export type WildcardFlagType = "none" | "noaction" | "hasaction";

export type ExistingWildcardFlagType = "noaction" | "hasaction";

export type ActionTypeToWildcardFlag<ActionType> = undefined extends ActionType
  ? "noaction"
  : "hasaction";

export type WildcardFlagToHasAction<Flag extends ExistingWildcardFlagType> = {
  noaction: false;
  hasaction: true;
}[Flag];

import { PathRouteBuilder } from "./PathRouteBuilder";
import { SearchRouteBuilder } from "./SearchRouteBuilder";
import { StateRouteBuilder } from "./StateRouteBuilder";

/**
 * Initialize a path router.
 */
export const Path = PathRouteBuilder.init;

/**
 * Initialize a search router.
 */
export const Search = SearchRouteBuilder.init;

/**
 * Initialize a state router.
 */
export const State = StateRouteBuilder.init;

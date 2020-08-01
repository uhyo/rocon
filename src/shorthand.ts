import { PathRouteBuilder } from "./builder/PathRouteBuilder";
import { SearchRouteBuilder } from "./builder/SearchRouteBuilder";
import { StateRouteBuilder } from "./builder/StateRouteBuilder";
import { RouteResolver } from "./core/RouteResolver";

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

/**
 * Get a resolver of given router.
 */
export const Resolver = RouteResolver.getFromBuilder;

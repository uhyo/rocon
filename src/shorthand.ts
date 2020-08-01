import { RouteResolver } from "./core/RouteResolver";
import { PathRouteBuilder } from "./RouteBuilder/PathRouteBuilder";
import { SearchRouteBuilder } from "./RouteBuilder/SearchRouteBuilder";
import { StateRouteBuilder } from "./RouteBuilder/StateRouteBuilder";

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

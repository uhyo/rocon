import { PathRouteBuilder } from "./builder/PathRouteBuilder";
import { RootRouteBuilder } from "./builder/RootRouteBuilder";
import { RoutePathResolver } from "./builder/RoutePathResolver";
import { SearchRouteBuilder } from "./builder/SearchRouteBuilder";
import { SingleHashRouteBuilder } from "./builder/SingleHashRouteBuilder";
import { StateRouteBuilder } from "./builder/StateRouteBuilder";

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
 * Initialize a root router.
 */
export const Root = RootRouteBuilder.init;

/**
 * Initialize a single hash router.
 */
export const SingleHash = SingleHashRouteBuilder.init;

/**
 * Get a resolver of given router.
 */
export const Resolver = RoutePathResolver.getFromBuilder;

import { Location } from "history";
import { createContext } from "react";

/**
 * Context that provides current location object.
 */
export const LocationContext = createContext<Location | undefined>(undefined);

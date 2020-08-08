import { Location } from "../../core/Location";

/**
 * Returns whether given location is the root path.
 */
export const isRootPath = ({ pathname }: Location): boolean => {
  return !pathname || pathname === "/";
};

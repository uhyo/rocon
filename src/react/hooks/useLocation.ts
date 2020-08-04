import { Location } from "history";
import { useContext } from "react";
import { LocationContext } from "../contexts/LocationContext";

/**
 * Returns the current location.
 * Throws an error if there is no Rocon root above.
 */
export const useLocation = (): Location => {
  const location = useContext(LocationContext);
  if (location === undefined) {
    throw new Error(
      "No location found. Please make sure you have placed RoconRoot above."
    );
  }
  return location;
};

import type { History } from "history";
import { useContext } from "react";
import { HistoryContext } from "../contexts/HistoryContext";

/**
 * Reads the history object from the history context.
 * Throws an error if there is no history in context.
 */
export const useHistory = (): History => {
  const history = useContext(HistoryContext);
  if (history === undefined) {
    throw new Error(
      "No history found in the context. Please make sure you have placed RoconRoot above."
    );
  }
  return history.history;
};

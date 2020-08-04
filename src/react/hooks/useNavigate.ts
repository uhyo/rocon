import { History } from "history";
import { useContext } from "react";
import { HistoryContext } from "../contexts/HistoryContext";
import { Navigate } from "../types/NavigateFunction";

const cache = new WeakMap<History, Navigate>();

/**
 * Returns the navigate function.
 */
export const useNavigate = (): Navigate => {
  const history = useContext(HistoryContext);
  if (history === undefined) {
    throw new Error(
      "No history found in the context. Please make sure you have placed RoconRoot above."
    );
  }
  return history.navigate;
};

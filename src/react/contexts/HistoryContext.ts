import type { History } from "history";
import { createContext } from "react";
import { Navigate } from "../types/NavigateFunction";

type HistoryContextValue = {
  history: History;
  navigate: Navigate;
};

/**
 * Context for the history object and stuff associated with it.
 */
export const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined
);

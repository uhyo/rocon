import type { History } from "history";
import { createContext } from "react";

type HistoryContextValue = {
  history: History;
};

/**
 * Context for the history object and stuff associated with it.
 */
export const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined
);

import type { History } from "history";
import { createContext } from "react";

type HistoryContextValue = History;

/**
 * Context for the history object.
 */
export const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined
);

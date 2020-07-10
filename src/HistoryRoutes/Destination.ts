/**
 * Object for destination of a history push.
 */
export type Destination<State> = {
  pathname: string;
  search?: string;
  hash?: string;
  state?: State;
};

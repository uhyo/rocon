import { State } from "history";

export type Location<S = State> = {
  pathname: string;
  search?: string;
  hash?: string;
  state: S;
};

import { State } from "history";

export type BaseState = State;

export type Location<S extends BaseState = BaseState> = {
  pathname: string;
  search?: string;
  hash?: string;
  state: S;
};

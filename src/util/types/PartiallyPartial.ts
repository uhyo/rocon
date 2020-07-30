import type { Clean } from "./Clean";

export type PartiallyPartial<T, K extends keyof T> = Clean<
  Partial<Pick<T, K>> & Omit<T, K>
>;

export type OptionalIf<Cond extends boolean, Value> = Cond extends false
  ? Value
  : Value | undefined;

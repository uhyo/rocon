export type PartialIf<Cond extends boolean, Obj> = Cond extends false
  ? Obj
  : Partial<Obj>;

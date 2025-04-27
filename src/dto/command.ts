export interface Command {
  name: string;
  property: {
    key: string;
    value: string | number | boolean;
  };
  comparision: "eq" | "neq" | "gt" | "lt";
}

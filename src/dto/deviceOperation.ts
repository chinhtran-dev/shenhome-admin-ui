export interface DeviceOperation {
  name: string;
  parameter: {
    key: string;
    value: string | number | boolean;
    isEditable: boolean,
    widgetType: string,
    range: number[]
  };
  comparision: "eq" | "neq" | "gt" | "lt";
}
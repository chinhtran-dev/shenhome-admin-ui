import { DeviceOperation } from "@/dto/deviceOperation";
import { Property } from "@/dto/property";

export interface DeviceProfileSearchResponse {
  id: string;
  status: string;
  name: string;
  code: string;
  iconCodePoint: string;
  type: string;
  createdOn?: string;
  modifiedOn?: string;
}

export interface DeviceProfileViewResponse extends DeviceProfileSearchResponse {
  attributes: Property[];
  telemetries: Property[];
  deviceOperations: DeviceOperation[];
  categoryId: string;
}

export interface ListSelectItem {
  id: string;
  name: string;
}

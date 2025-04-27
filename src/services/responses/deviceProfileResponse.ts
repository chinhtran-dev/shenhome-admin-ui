import { Command } from "@/dto/command";
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
  commands: Command[];
  categoryId: string;
}

export interface ListSelectItem {
  id: string;
  name: string;
}

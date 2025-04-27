export interface Device {
  id: string;
  name: string;
  status: string;
  heartbeat?: boolean;
  lastHeartbeat?: string;
  deviceToken: string;
  createdOn: string;
  modifiedOn?: string;
  deviceProfileId: string;
}

export const mockDevices: Device[] = [
  {
    id: "1",
    name: "Temperature Sensor",
    status: "Enabled",
    heartbeat: true,
    lastHeartbeat: "2025-04-01T10:00:00Z",
    deviceToken: "abc123",
    createdOn: "2025-04-01T09:00:00Z",
    deviceProfileId: "1",
  },
  {
    id: "2",
    name: "Switch",
    status: "Disabled",
    heartbeat: false,
    lastHeartbeat: "2025-04-02T12:00:00Z",
    deviceToken: "xyz456",
    createdOn: "2025-04-02T11:00:00Z",
    deviceProfileId: "2",
  },
];

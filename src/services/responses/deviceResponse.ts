export interface DeviceSearchResponse {
	id: string;
	name: string;
	status: string;
	heartbeat?: boolean;
	lastHeartbeat?: string;
	deviceToken: string;
	createdOn: string;
	modifiedOn?: string;
}

export interface DeviceViewResponse extends DeviceSearchResponse {
	deviceProfileId: string;
}
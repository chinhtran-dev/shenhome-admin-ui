export class CreateDeviceRequest {
	name: string;
	deviceProfileId: string;

	constructor(name: string, deviceProfileId: string) {
		this.name = name;
		this.deviceProfileId = deviceProfileId;
	}
}

export class UpdateDeviceRequest {
	name: string;
	deviceProfileId: string;

	constructor(name: string, deviceProfileId: string) {
		this.name = name;
		this.deviceProfileId = deviceProfileId;
	}
}


import { DeviceOperation } from "@/dto/deviceOperation";
import { Property } from "@/dto/property";

class BaseDeviceProfileRequest {
    constructor(
        public name: string = '',
		public code: string = '',
		public type: string = '',
        public iconCodePoint: string = '',
        public categoryId: string = '',
        public attributes: Property[] = [],
        public telemetries: Property[] = [],
        public deviceOperations: DeviceOperation[] = []
    ) {}
}

export class CreateDeviceProfileRequest extends BaseDeviceProfileRequest {
    constructor(
        name: string = '',
		code: string = '',
		type: string = '',
        iconCodePoint: string = '',
        categoryId: string = '',
        attributes: Property[] = [],
        telemetries: Property[] = [],
        deviceOperations: DeviceOperation[] = []
    ) {
        super(name, code, iconCodePoint, categoryId, type, attributes, telemetries, deviceOperations);
    }
}

export class UpdateDeviceProfileRequest extends BaseDeviceProfileRequest {
    constructor(
        name?: string,
		code?: string,
		type?: string,
        iconCodePoint?: string,
        categoryId?: string,
        attributes: Property[] = [],
        telemetries: Property[] = [],
        deviceOperations: DeviceOperation[] = []
    ) {
        super(name, code, iconCodePoint, categoryId, type, attributes, telemetries, deviceOperations);
    }
}
import { Command } from "@/dto/command";
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
        public commands: Command[] = []
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
        commands: Command[] = []
    ) {
        super(name, code, iconCodePoint, categoryId, type, attributes, telemetries, commands);
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
        commands: Command[] = []
    ) {
        super(name, code, iconCodePoint, categoryId, type, attributes, telemetries, commands);
    }
}
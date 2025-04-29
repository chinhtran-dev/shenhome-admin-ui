import { DeviceType } from "@/util/enum";
import { Property } from "./property";
import { Command } from "./deviceOperation";

export interface DeviceProfile {
	id: string;
	status?: string;
	name: string;
	code: string;
	iconCodePoint: string;
	type: string;
	attributes: Property[];
	telemetries: Property[];
	createdOn?: string;
	modifiedOn?: string;
	commands: Command[];
	categoryId: string;
}

export interface DeviceProfileSelect {
	id: string;
	name: string;
}

export const mockDeviceProfilesSelect: DeviceProfileSelect[] = [
	{ id: '1', name: "Smart Light" },
	{ id: '2', name: "Temperature Sensor" }
]

export const mockDeviceProfiles: DeviceProfile[] = [
	{
		id: '1',
		status: 'Enabled',
		name: 'Smart Light',
		code: 'smart_light',
		iconCodePoint: 'f02a',
		type: DeviceType.Actuator.toString(),
		attributes: [
			{ key: 'manufacturer', type: 'string' },
			{ key: 'model', type: 'string' },
			{ key: 'color', type: 'string' }
		],
		telemetries: [
			{ key: 'brightness', type: 'number', unit: '%' },
			{ key: 'power', type: 'boolean' }
		],
		createdOn: '2024-04-01T12:00:00Z',
		modifiedOn: '2024-04-20T08:30:00Z',
		commands: [
			{
				name: 'Turn On',
				property: new Map([
					['power', true]
				]),
				comparision: 'eq'
			},
			{
				name: 'Set Brightness 50%',
				property: new Map([
					['brightness', 50]
				]),
				comparision: 'eq'
			}
		],
		categoryId: '1'
	},
	{
		id: '2',
		status: 'Disabled',
		name: 'Temperature Sensor',
		code: 'temp_sensor',
		iconCodePoint: 'e1ff',
		type: DeviceType.Sensor.toString(),
		attributes: [
			{ key: 'location', type: 'string' },
			{ key: 'accuracy', type: 'number' }
		],
		telemetries: [
			{ key: 'temperature', type: 'number', unit: '°C' },
			{ key: 'humidity', type: 'number', unit: '%' }
		],
		createdOn: '2024-03-10T09:15:00Z',
		modifiedOn: '2024-03-15T14:00:00Z',
		commands: [
			{
				name: 'Calibrate',
				property: new Map([
					['accuracy', 0.5]
				]),
				comparision: 'lt'
			}
		],
		categoryId: '2'
	},
	{
		id: '3',
		status: 'Enabled',
		name: 'Smart Plug',
		code: 'smart_plug',
		iconCodePoint: 'e63c',
		type: DeviceType.Actuator.toString(),
		attributes: [
			{ key: 'voltage', type: 'number', unit: 'V' },
			{ key: 'manufacturer', type: 'string' }
		],
		telemetries: [
			{ key: 'power_usage', type: 'number', unit: 'W' },
			{ key: 'state', type: 'boolean' }
		],
		createdOn: '2024-01-05T11:45:00Z',
		modifiedOn: '2024-01-08T13:00:00Z',
		commands: [
			{
				name: 'Turn On',
				property: new Map([
					['state', true]
				]),
				comparision: 'eq'
			},
			{
				name: 'Turn Off',
				property: new Map([
					['state', false]
				]),
				comparision: 'eq'
			},
			{
				name: 'Set Voltage 220V',
				property: new Map([
					['voltage', 220]
				]),
				comparision: 'eq'
			}
		],
		categoryId: '3'
	},
	{
		id: '4',
		status: 'Enabled',
		name: 'Smart Thermostat',
		code: 'smart_thermostat',
		iconCodePoint: 'e60e',
		type: DeviceType.Actuator.toString(),
		attributes: [
			{ key: 'model', type: 'string' },
			{ key: 'manufacturer', type: 'string' }
		],
		telemetries: [
			{ key: 'temperature', type: 'number', unit: '°C' },
			{ key: 'mode', type: 'string' }
		],
		createdOn: '2024-05-01T10:00:00Z',
		modifiedOn: '2024-05-05T15:30:00Z',
		commands: [
			{
				name: 'Set Temperature 22°C',
				property: new Map([
					['temperature', 22]
				]),
				comparision: 'eq'
			},
			{
				name: 'Switch Mode to Cool',
				property: new Map([
					['mode', 'cool']
				]),
				comparision: 'eq'
			}
		],
		categoryId: '1'
	}
];

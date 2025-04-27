import { Url } from "@/util/appUrl";
import baseService from "./baseService";
import { SearchRequest } from "./requests/baseRequest";
import { ApiResponse, SearchResponse } from "./responses/baseResponse";
import { DeviceSearchResponse, DeviceViewResponse } from "./responses/deviceResponse";
import { CreateDeviceRequest, UpdateDeviceRequest } from "./requests/deviceRequest";

export class DeviceService {

	async search(request: SearchRequest): Promise<SearchResponse<DeviceSearchResponse>> {
		const res = await baseService.patch(Url.devices.list, request);
		const responseData = res.data as SearchResponse<DeviceSearchResponse>;
		
		return responseData;
	}

	async create(request: CreateDeviceRequest): Promise<void> {
		await baseService.post(Url.devices.create, request);
	}

	async update(request: UpdateDeviceRequest, id: string): Promise<void> {
		await baseService.put(Url.devices.update(id), request);
	}

	async delete(id: string): Promise<void> {
		await baseService.delete(Url.devices.delete(id))
	}

	async view(id: string): Promise<DeviceViewResponse> {
		const res = await baseService.get(Url.devices.view(id));
		const responseData = res.data as ApiResponse<DeviceViewResponse>;	
		return responseData.data;
	}
}
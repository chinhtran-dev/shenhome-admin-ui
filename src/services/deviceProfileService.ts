import { Url } from "@/util/appUrl";
import baseService from "./baseService";
import { SearchRequest } from "./requests/baseRequest";
import { ApiResponse, SearchResponse } from "./responses/baseResponse";
import { DeviceProfileSearchResponse, DeviceProfileViewResponse, ListSelectItem } from "./responses/deviceProfileResponse";
import { CreateDeviceProfileRequest, UpdateDeviceProfileRequest } from "./requests/deviceProfileRequest";

export class DeviceProfileService {

	async search(request: SearchRequest): Promise<SearchResponse<DeviceProfileSearchResponse>> {
		const res = await baseService.patch(Url.deviceProfile.list, request);
		const responseData = res.data as SearchResponse<DeviceProfileSearchResponse>;
		
		return responseData;
	}

	async create(request: CreateDeviceProfileRequest): Promise<void> {
		await baseService.post(Url.deviceProfile.create, request);
	}

	async update(request: UpdateDeviceProfileRequest, id: string): Promise<void> {
		await baseService.put(Url.deviceProfile.update(id), request);
	}

	async delete(id: string): Promise<void> {
		await baseService.delete(Url.deviceProfile.delete(id))
	}

	async view(id: string): Promise<DeviceProfileViewResponse> {
		const res = await baseService.get(Url.deviceProfile.view(id));
		const responseData = res.data as ApiResponse<DeviceProfileViewResponse>;

		console.log(responseData.data);
	
		return responseData.data;
	}

	async listSelect(): Promise<ListSelectItem[]> {
		const res = await baseService.get(Url.deviceProfile.listSelect);
		const responseData = res.data as ApiResponse<ListSelectItem[]>;
		
		return responseData.data;
	}
}
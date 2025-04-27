import { Url } from "@/util/appUrl";
import baseService from "./baseService";
import { SearchRequest } from "./requests/baseRequest";
import { ApiResponse, SearchResponse } from "./responses/baseResponse";
import { CreateCategoryRequest, UpdateCategoryRequest } from "./requests/categoryRequest";
import { DeviceProfileSearchResponse, DeviceProfileViewResponse, ListSelectItem } from "./responses/deviceProfileResponse";

export class DeviceProfileService {

	async search(request: SearchRequest): Promise<SearchResponse<DeviceProfileSearchResponse>> {
		const res = await baseService.patch(Url.category.list, request);
		const responseData = res.data as SearchResponse<DeviceProfileSearchResponse>;
		
		return responseData;
	}

	async create(request: CreateCategoryRequest): Promise<void> {
		await baseService.post(Url.category.create, request);
	}

	async update(request: UpdateCategoryRequest, id: string): Promise<void> {
		await baseService.put(Url.category.update(id), request);
	}

	async delete(id: string): Promise<void> {
		await baseService.delete(Url.category.delete(id))
	}

	async view(id: string): Promise<DeviceProfileViewResponse> {
		const res = await baseService.get(Url.category.view(id));
		const responseData = res.data as ApiResponse<DeviceProfileViewResponse>;

		console.log(responseData.data);
	
		return responseData.data;
	}

	async listSelect(): Promise<ListSelectItem[]> {
		const res = await baseService.get(Url.category.list);
		const responseData = res.data as ApiResponse<ListSelectItem[]>;
		
		return responseData.data;
	}
}
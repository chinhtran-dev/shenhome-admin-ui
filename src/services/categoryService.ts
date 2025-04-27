import { Url } from "@/util/appUrl";
import baseService from "./baseService";
import { SearchRequest } from "./requests/baseRequest";
import { CategoryListSelectItem, CategorySearchResponse } from "./responses/categoryResponse";
import { ApiResponse, SearchResponse } from "./responses/baseResponse";
import { CreateCategoryRequest, UpdateCategoryRequest } from "./requests/categoryRequest";

export class CategoryService {

	async search(request: SearchRequest): Promise<SearchResponse<CategorySearchResponse>> {
		const res = await baseService.patch(Url.category.list, request);
		const responseData = res.data as SearchResponse<CategorySearchResponse>;
		
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

	async view(id: string): Promise<CategorySearchResponse> {
		const res = await baseService.get(Url.category.view(id));
		const responseData = res.data as ApiResponse<CategorySearchResponse>;	
		return responseData.data;
	}

	async listSelect(): Promise<CategoryListSelectItem[]> {
		const res = await baseService.get(Url.category.listSelect);
		const responseData = res.data as ApiResponse<CategorySearchResponse[]>;
		
		return responseData.data;
	}
}
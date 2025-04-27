export interface ApiResponse<T> {
	succeeded: boolean;
	message: string;
	code: string;
	data: T;
	errors: string | null;
	request: string;
	returnUrl: string | null;
  }
  
  export const handleApiResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
	const responseData = await response.json();
	
	if (!response.ok) {
	  // Handle HTTP errors, show message to user
	  const errorMessage = responseData.errors || 'Something went wrong';
	  throw new Error(errorMessage);
	}
	
	return responseData as ApiResponse<T>;
};
  
export interface Pagination {
	current: number,
	pageSize: number,
	total: number
}
  

export interface SearchResponse<T> {
	totalRecords: number,
	pageNum: number,
	pageSize: number,
	totalPages: number,
	succeeded: boolean;
	message: string;
	code: string;
	data: T[];
	errors: string | null;
	request: string;
	returnUrl: string | null;
}
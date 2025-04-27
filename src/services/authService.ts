import { Url } from "@/util/appUrl";
import baseService from "./baseService";
import { LoginRequest } from "./requests/authRequest";
import { LoginResponse } from "./responses/authResponse";

export class AuthService {

	async login(request: LoginRequest): Promise<LoginResponse> {
        const res = await baseService.post(`${Url.auth.login}`, request);

        if (res != null) {
            const response = res as LoginResponse;
            localStorage.setItem('accessToken', response.accessToken!);
            localStorage.setItem('refreshToken', response.refreshToken!);
        }
        
		return res.data;
	}

	async logout(): Promise<void> {
        try {
            await baseService.post(Url.auth.logout);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
	}
	
	isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }
}
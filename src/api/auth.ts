import { AxiosResponse } from 'axios';

import apiClient from '~/api/client';
import { FollowersResponse, GetUserResponse, User } from '~/types/users';
import { LoginData, LoginResponse, RegisterData, RegisterResponse } from '~/types/auth';

export const authService = {
    register: async (data: RegisterData): Promise<RegisterResponse> => {
        const params = new URLSearchParams();
        params.append("username", data.username);
        params.append("password", data.password);
        params.append("display_name", data.displayName);

        const response = await apiClient.post<RegisterResponse>(
            '/users/auth/register',
            {
                username: data.username,
                password: data.password,
                display_name: data.displayName,
            }
            // params,
            // {
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded"
            //     }
            // }
        ).catch((error) => {
            throw error;
        }).then((response: AxiosResponse) => {
            localStorage.setItem("tokenExpiry", response.headers["x-token-expiry"]);
            return response.data as RegisterResponse;
        });

        return response;
    },

    login: async (data: LoginData): Promise<LoginResponse> => {
        const params = new URLSearchParams();
        params.append("username", data.username);
        params.append("password", data.password);

        const response = await apiClient.post<LoginResponse>(
            '/users/auth/login',
            params,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }
        ).catch((error) => {
            throw error;
        }).then((response: AxiosResponse) => {
            localStorage.setItem("tokenExpiry", response.headers["x-token-expiry"]);
            return response.data as LoginResponse;
        });

        return response;
    },
    logout: (): Promise<{ message: string }> =>
        apiClient.post('/users/auth/logout').then((res) => res.data),

    refreshToken: async (): Promise<any |undefined> => {
        try {
            const response = await apiClient.post('/users/auth/refresh');
            localStorage.setItem("tokenExpiry", response.headers["x-token-expiry"]);

            return response.data;
        } catch (error) {
            return undefined;
        }
    },

    getCurrentUser: async (): Promise<User | undefined> => {
        try { 
            const response = await apiClient.get('/users/auth/me');
            return response.data;
        } catch (error) {}
        // try {
        //     const response = await apiClient.get('/users/auth/me');
        //     return response.data;
        // } catch (error) {
        //     try {
        //         const refreshRes = await authService.refreshToken();
        //         if (refreshRes && refreshRes.message === "success") {
        //             return await authService.getCurrentUser();
        //         }
        //         return undefined;
        //     }
            
        //     catch (error) {
        //         return undefined;
        //     }
        // }
    },

    getUserByUsername: async (username: string): Promise<GetUserResponse | null> => {
        const response = await apiClient.get<GetUserResponse>(`/users/get/${username}`).catch((error) => {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        });
        
        if (!response) {
            return null;
        }

        return response.data;
    },

    getUsersFollowers: async (id: number, limit: number, last_id: number | undefined): Promise<FollowersResponse | null> => {
        let params: any = {
            user_id: id,
            limit,
        };

        if (last_id !== undefined) {
            params.last_id = last_id;
        }
        
        const response = await apiClient.get<FollowersResponse>(
            "/users/get_followers",
            {
                params
            }
        ).catch((error) => {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        });
        
        if (!response) {
            return null;
        }

        return response.data;
    },

    getUserFollowing: async (id: number, limit: number, last_id: number | undefined): Promise<FollowersResponse | null> => {
        let params: any = {
            user_id: id,
            limit,
        };

        if (last_id !== undefined) {
            params.last_id = last_id;
        }
        
        const response = await apiClient.get<FollowersResponse>(
            "/users/get_following",
            {
                params
            }
        ).catch((error) => {
            if (error.response?.status === 404) {
                return null;
            }
            throw error;
        });
        
        if (!response) {
            return null;
        }

        return response.data;
    },

    followUser: async (followed_id: number): Promise<{ message: string, new_amount: number }> => {
        const response = await apiClient.post<{ message: string, new_amount: number }>(
            `/users/follow`,
            null,
            {
                params: {
                    followed_id,
                }
            }
        );
        console.log(response.data)
        return response.data;
    },

    unfollowUser: async (followed_id: number): Promise<{ message: string, new_amount: number }> => {
        const response = await apiClient.delete<{ message: string, new_amount: number }>(
            `/users/unfollow`,
            {
                params: {
                    followed_id,
                }
            }
        );
        console.log(response.data)
        return response.data;
    },
};


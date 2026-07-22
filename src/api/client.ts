import { redirect } from '@solidjs/router';
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { API_URL } from '~/config';
import { authService } from './auth';


// Create single instance with shared config
const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,              // Default timeout for all requests
    withCredentials: true,       // Include http-only cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// apiClient.interceptors.request.use();

// apiClient.interceptors.response.use(
//     (response) => {
//         const expiry: string | undefined = response.headers["X-Token-Expiry"];

//         if (expiry) {
//             const expiryTS = +expiry * 1000;
//             localStorage.setItem("tokenExpiry", expiryTS.toString());
//         }

//         return response;
//     },

// );

apiClient.interceptors.request.use(
    async (config) => {
        // Add auth headers, trace IDs, or log requests here if needed
        console.log(config.url)
        if (config.url === "/users/auth/refresh") {
            return config;
        }

        const tokenExpiry = localStorage.getItem("tokenExpiry");

        if (!tokenExpiry) {
            return config;
        }

        if (+tokenExpiry * 1000 <= Date.now()) {
            console.log("token is invalid");
            await authService.refreshToken();
        }

        return config;
    },
    (error) => Promise.reject(error)
)

// // Global request interceptor
// apiClient.interceptors.request.use(
//     (config) => {
//         // Add auth headers, trace IDs, or log requests here if needed
//         console.log(`[${config.method?.toUpperCase()}] ${config.url}`);
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// Global response interceptor
// apiClient.interceptors.response.use(
//     (response) => response,
//     async (error: AxiosError) => {
//         const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
//     // Handle 401 Unauthorized globally
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
    
//             try {
//         // Attempt token refresh automatically
//                 await apiClient.post('/users/auth/refresh');
                
//                 // Retry original request with new tokens
//                 return apiClient(originalRequest);
//             } catch (refreshError) {
//                 // Refresh failed → redirect to login
//                 document.location.href = "/login";
//                 return Promise.reject(refreshError);
//             }
//         }
    
//         // Bubble up other errors for individual handlers
//         return Promise.reject(error);
//     }
// );

export default apiClient;

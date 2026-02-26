import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, STORAGE_KEYS, API_ENDPOINTS } from '../constants';
import { ApiResponse } from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        try {
          const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle common errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - token expired
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { token } = response.data;

              await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

              // Retry original request with new token
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, clear tokens and redirect to login
            await this.clearAuthData();
            // You might want to navigate to login screen here
            console.error('Token refresh failed:', refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(refreshToken: string): Promise<AxiosResponse> {
    return axios.post(`${API_BASE_URL}/api/auth/refresh`, {
      refreshToken,
    });
  }

  private async clearAuthData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_ROLE,
      ]);
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // Generic request methods
  public async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get(endpoint, { params });
      return { data: response.data, status: response.status };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post(endpoint, data);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.put(endpoint, data);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.delete(endpoint);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  public async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.patch(endpoint, data);
      return { data: response.data, status: response.status };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  private handleError(error: any): ApiResponse<never> {
    let errorMessage = 'An unexpected error occurred';
    let status = 0;

    if (error.response) {
      // Server responded with error status
      status = error.response.status;
      errorMessage = error.response.data?.message ||
        error.response.data?.error ||
        `Server error: ${status}`;
    } else if (error.request) {
      // Network error
      errorMessage = 'Network error. Please check your connection.';
    } else {
      // Other error
      errorMessage = error.message || errorMessage;
    }

    return {
      error: errorMessage,
      status,
    };
  }

  // File upload method
  public async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: response.data, status: response.status };
    } catch (error: any) {
      return this.handleError(error);
    }
  }

  // Download method
  public async download(endpoint: string, filename?: string): Promise<ApiResponse<Blob>> {
    try {
      const response = await this.api.get(endpoint, {
        responseType: 'blob',
      });
      return { data: response.data, status: response.status };
    } catch (error: any) {
      return this.handleError(error);
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

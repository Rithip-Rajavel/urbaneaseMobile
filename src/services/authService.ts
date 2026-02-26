import apiService from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../constants';
import { User, AuthRequest, OtpRequest, OtpVerificationRequest } from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthService {
  async login(credentials: AuthRequest) {
    const response = await apiService.post<{ token: string; refreshToken: string; user: User }>(
      API_ENDPOINTS.LOGIN,
      credentials
    );

    if (response.data) {
      const { token, refreshToken, user } = response.data;
      
      // Store tokens and user data
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.ACCESS_TOKEN, token],
        [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
        [STORAGE_KEYS.USER_DATA, JSON.stringify(user)],
        [STORAGE_KEYS.USER_ROLE, user.role],
      ]);

      return response.data;
    }

    throw new Error(response.error || 'Login failed');
  }

  async register(userData: AuthRequest) {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.REGISTER,
      userData
    );

    return response.data;
  }

  async registerProvider(userData: AuthRequest) {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.REGISTER_PROVIDER,
      userData
    );

    return response.data;
  }

  async forgotPassword(emailData: OtpRequest) {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.FORGOT_PASSWORD,
      emailData
    );

    return response.data;
  }

  async verifyOtpAndResetPassword(otpData: OtpVerificationRequest) {
    const response = await apiService.post<{ message: string }>(
      API_ENDPOINTS.VERIFY_OTP_RESET_PASSWORD,
      otpData
    );

    return response.data;
  }

  async logout() {
    try {
      // Clear all stored data
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ACCESS_TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER_DATA,
        STORAGE_KEYS.USER_ROLE,
        STORAGE_KEYS.ONESIGNAL_PLAYER_ID,
      ]);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async getUserRole(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_ROLE);
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  }

  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAccessToken();
      const user = await this.getCurrentUser();
      return !!(token && user);
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  async updateUserProfile(userData: Partial<User>) {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user logged in');
    }

    const response = await apiService.put<User>(`/api/users/${currentUser.id}`, userData);

    if (response.data) {
      // Update stored user data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
      return response.data;
    }

    throw new Error(response.error || 'Profile update failed');
  }
}

export default new AuthService();

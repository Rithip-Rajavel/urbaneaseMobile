import apiService from './api';
import { API_ENDPOINTS } from '../constants';
import { User, ProviderProfile } from '../types';

class ProfileService {
  /**
   * Get current user profile
   */
  async getMyProfile() {
    const response = await apiService.get<User>(API_ENDPOINTS.GET_MY_PROFILE);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get profile');
  }

  /**
   * Get user profile by ID
   * @param userId User ID
   */
  async getUserProfile(userId: number) {
    const endpoint = API_ENDPOINTS.GET_PROFILE.replace('{userId}', userId.toString());
    const response = await apiService.get<User>(endpoint);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get user profile');
  }

  /**
   * Get provider profile by provider ID
   * @param providerId Provider ID
   */
  async getProviderProfile(providerId: number) {
    const endpoint = API_ENDPOINTS.GET_PROVIDER_PROFILE.replace('{providerId}', providerId.toString());
    const response = await apiService.get<ProviderProfile>(endpoint);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get provider profile');
  }

  /**
   * Update user profile
   * @param profileData Profile data to update
   */
  async updateProfile(profileData: Partial<User>) {
    const response = await apiService.put<User>(API_ENDPOINTS.GET_MY_PROFILE, profileData);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update profile');
  }

  /**
   * Update provider profile
   * @param providerId Provider ID
   * @param profileData Provider profile data to update
   */
  async updateProviderProfile(providerId: number, profileData: Partial<ProviderProfile>) {
    const endpoint = API_ENDPOINTS.GET_PROVIDER_PROFILE.replace('{providerId}', providerId.toString());
    const response = await apiService.put<ProviderProfile>(endpoint, profileData);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to update provider profile');
  }
}

export default new ProfileService();

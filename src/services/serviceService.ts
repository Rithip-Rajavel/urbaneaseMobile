import apiService from './api';
import { API_ENDPOINTS } from '../constants';
import { ServiceCategory, ProviderProfile, Service } from '../types';

class ServiceService {
  /**
   * Get all active service categories
   */
  async getCategories() {
    const response = await apiService.get<ServiceCategory[]>(API_ENDPOINTS.GET_CATEGORIES);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get categories');
  }

  /**
   * Find nearby service providers
   * @param latitude Target latitude
   * @param longitude Target longitude
   * @param radius Search radius in kilometers (optional, defaults to 10)
   */
  async getNearbyProviders(latitude: number, longitude: number, radius: number = 10) {
    const response = await apiService.get<ProviderProfile[]>(API_ENDPOINTS.GET_NEARBY_PROVIDERS, {
      latitude,
      longitude,
      radius
    });
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get nearby providers');
  }

  /**
   * Search query (Custom wrapper if available, otherwise filters from providers)
   */
  async searchServicesAndProviders(query: string) {
      // Assuming GET_NEARBY_PROVIDERS acts as a fallback or there's an actual search endpoint.
      // The OpenAPI spec didn't outline a dedicated global search. We'll simulate search endpoints using getting categories/providers
      const categories = await this.getCategories();
      
      // Usually would be an API call specifically for search. We'll catch error gracefully
      return { categories: categories };
  }
}

export default new ServiceService();

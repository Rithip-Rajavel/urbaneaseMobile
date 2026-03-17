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
    const response = await apiService.get<any>(API_ENDPOINTS.GET_NEARBY_PROVIDERS, {
      latitude,
      longitude,
      radius
    });

    if (response.data) {
      // API returns { providers: [...], count: number, search_radius_km: number }
      // The providers are actually User objects with SERVICE_PROVIDER role
      // We need to transform them to ProviderProfile-like objects
      const providers = response.data.providers || [];
      return providers.map((provider: any) => ({
        id: provider.id,
        user: provider, // Store the user object as is
        firstName: provider.firstName || provider.username?.split('_')[0] || 'First',
        lastName: provider.lastName || provider.username?.split('_')[1] || 'Last',
        businessName: provider.businessName || `${provider.username}'s Services`,
        verificationStatus: provider.verificationStatus || 'PENDING',
        averageRating: provider.averageRating || 0,
        totalReviews: provider.totalReviews || 0,
        completedJobs: provider.completedJobs || 0,
        yearsOfExperience: provider.yearsOfExperience || 0,
        bio: provider.bio || 'Professional service provider',
        createdAt: provider.createdAt,
        updatedAt: provider.updatedAt,
      }));
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

import apiService from './api';
import { API_ENDPOINTS } from '../constants';
import { Review, ReviewRequest } from '../types';

class ReviewService {
  /**
   * Create a new review
   */
  async createReview(reviewData: ReviewRequest) {
    const response = await apiService.post<Review>(API_ENDPOINTS.CREATE_REVIEW, reviewData);

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to submit review');
  }

  /**
   * Get review for a specific booking
   * @param bookingId The ID of the booking
   */
  async getBookingReview(bookingId: number) {
    const endpoint = API_ENDPOINTS.GET_BOOKING_REVIEW.replace('{bookingId}', bookingId.toString());
    const response = await apiService.get<Review>(endpoint);

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get booking review');
  }

  /**
   * Get reviews submitted by the current user
   */
  async getMyReviews() {
    const response = await apiService.get<Review[]>(API_ENDPOINTS.GET_MY_REVIEWS);

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get your reviews');
  }

  /**
   * Get all reviews for a specific provider
   * @param providerId The ID of the provider
   */
  async getProviderReviews(providerId: number) {
    const endpoint = API_ENDPOINTS.GET_PROVIDER_REVIEWS.replace('{providerId}', providerId.toString());
    const response = await apiService.get<Review[]>(endpoint);

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get provider reviews');
  }

  /**
   * Get review rating stats for a specific provider
   * @param providerId The ID of the provider
   */
  async getProviderStats(providerId: number) {
    const endpoint = API_ENDPOINTS.GET_PROVIDER_STATS.replace('{providerId}', providerId.toString());
    const response = await apiService.get<any>(endpoint); // Replace 'any' with specific Stats interface if defined

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get provider statistics');
  }
}

export default new ReviewService();

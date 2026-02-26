import apiService from './api';
import { API_ENDPOINTS } from '../constants';
import { Booking, BookingRequest } from '../types';

class BookingService {
  async createBooking(bookingData: BookingRequest) {
    const response = await apiService.post<Booking>(API_ENDPOINTS.CREATE_BOOKING, bookingData);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to create booking');
  }

  async getBooking(bookingId: number) {
    const response = await apiService.get<Booking>(API_ENDPOINTS.GET_BOOKING.replace('{bookingId}', bookingId.toString()));
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get booking');
  }

  async getMyBookings(status?: string) {
    const params = status ? { status } : {};
    const response = await apiService.get<Booking[]>(API_ENDPOINTS.GET_MY_BOOKINGS, params);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get bookings');
  }

  async getPendingBookings() {
    const response = await apiService.get<Booking[]>(API_ENDPOINTS.GET_PENDING_BOOKINGS);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get pending bookings');
  }

  async acceptBooking(bookingId: number) {
    const response = await apiService.post<Booking>(
      API_ENDPOINTS.ACCEPT_BOOKING.replace('{bookingId}', bookingId.toString())
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to accept booking');
  }

  async rejectBooking(bookingId: number) {
    const response = await apiService.post<Booking>(
      API_ENDPOINTS.REJECT_BOOKING.replace('{bookingId}', bookingId.toString())
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to reject booking');
  }

  async startService(bookingId: number) {
    const response = await apiService.post<Booking>(
      API_ENDPOINTS.START_SERVICE.replace('{bookingId}', bookingId.toString())
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to start service');
  }

  async completeService(bookingId: number) {
    const response = await apiService.post<Booking>(
      API_ENDPOINTS.COMPLETE_SERVICE.replace('{bookingId}', bookingId.toString())
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to complete service');
  }

  async cancelBooking(bookingId: number) {
    const response = await apiService.post<Booking>(
      API_ENDPOINTS.CANCEL_BOOKING.replace('{bookingId}', bookingId.toString())
    );
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to cancel booking');
  }

  async getAllBookings() {
    const response = await apiService.get<Booking[]>(API_ENDPOINTS.GET_ALL_BOOKINGS);
    
    if (response.data) {
      return response.data;
    }
    
    throw new Error(response.error || 'Failed to get all bookings');
  }

  // Helper methods for booking status management
  getBookingStatusColor(status: string): string {
    switch (status) {
      case 'PENDING':
        return '#f59e0b'; // warning
      case 'ACCEPTED':
        return '#3b82f6'; // info
      case 'IN_PROGRESS':
        return '#8b5cf6'; // purple
      case 'COMPLETED':
        return '#10b981'; // success
      case 'CANCELLED':
        return '#ef4444'; // error
      case 'REJECTED':
        return '#ef4444'; // error
      default:
        return '#64748b'; // secondary
    }
  }

  getBookingStatusText(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Pending';
      case 'ACCEPTED':
        return 'Accepted';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  }

  canAcceptBooking(booking: Booking, userRole: string): boolean {
    return userRole === 'SERVICE_PROVIDER' && booking.status === 'PENDING';
  }

  canRejectBooking(booking: Booking, userRole: string): boolean {
    return userRole === 'SERVICE_PROVIDER' && booking.status === 'PENDING';
  }

  canStartService(booking: Booking, userRole: string): boolean {
    return userRole === 'SERVICE_PROVIDER' && booking.status === 'ACCEPTED';
  }

  canCompleteService(booking: Booking, userRole: string): boolean {
    return userRole === 'SERVICE_PROVIDER' && booking.status === 'IN_PROGRESS';
  }

  canCancelBooking(booking: Booking, userRole: string): boolean {
    return userRole === 'CUSTOMER' && 
           (booking.status === 'PENDING' || booking.status === 'ACCEPTED');
  }

  canReviewBooking(booking: Booking, userRole: string): boolean {
    return userRole === 'CUSTOMER' && booking.status === 'COMPLETED' && !booking.review;
  }
}

export default new BookingService();

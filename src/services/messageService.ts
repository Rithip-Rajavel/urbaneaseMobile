import apiService from './api';
import { API_ENDPOINTS } from '../constants';
import { Message, MessageRequest } from '../types';

class MessageService {
  /**
   * Send a new message
   */
  async sendMessage(messageData: MessageRequest) {
    const response = await apiService.post<Message>(API_ENDPOINTS.SEND_MESSAGE, messageData);

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to send message');
  }

  /**
   * Get complete conversation with another user
   * @param userId The ID of the other user in the conversation
   */
  async getConversation(userId: number) {
    const endpoint = API_ENDPOINTS.GET_CONVERSATION.replace('{userId}', userId.toString());
    const response = await apiService.get<Message[]>(endpoint);

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get conversation');
  }

  /**
   * Get unread messages for the current user
   */
  async getUnreadMessages() {
    const response = await apiService.get<Message[]>(API_ENDPOINTS.GET_UNREAD_MESSAGES);

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get unread messages');
  }

  /**
   * Get the count of unread messages for the current user
   */
  async getUnreadCount() {
    const response = await apiService.get<number>(API_ENDPOINTS.GET_UNREAD_COUNT);

    if (response.data !== undefined) {
      return response.data;
    }

    return 0;
  }

  /**
   * Mark all messages from a specific sender as read
   * @param senderId The ID of the sender whose messages to mark as read
   */
  async markMessagesAsRead(senderId: number) {
    const endpoint = API_ENDPOINTS.MARK_MESSAGES_READ.replace('{senderId}', senderId.toString());
    const response = await apiService.post<{ message: string }>(endpoint);

    if (response.status === 200 || response.data) {
      return true;
    }

    throw new Error(response.error || 'Failed to mark messages as read');
  }

  /**
   * Get messages for a specific booking
   * @param bookingId The ID of the booking
   */
  async getBookingMessages(bookingId: number) {
    const endpoint = API_ENDPOINTS.GET_BOOKING_MESSAGES.replace('{bookingId}', bookingId.toString());
    const response = await apiService.get<Message[]>(endpoint);

    if (response.data) {
      return response.data;
    }

    throw new Error(response.error || 'Failed to get booking messages');
  }
}

export default new MessageService();

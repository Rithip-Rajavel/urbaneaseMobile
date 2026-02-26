import { Dimensions } from 'react-native';

export const API_BASE_URL = 'http://localhost:8080';

export const SCREEN_WIDTH = Dimensions.get('window').width;
export const SCREEN_HEIGHT = Dimensions.get('window').height;

export const USER_ROLES = {
  CUSTOMER: 'CUSTOMER',
  SERVICE_PROVIDER: 'SERVICE_PROVIDER',
  ADMIN: 'ADMIN',
} as const;

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
} as const;

export const VERIFICATION_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  USER_ROLE: 'user_role',
  ONESIGNAL_PLAYER_ID: 'onesignal_player_id',
  LOCATION_PERMISSION: 'location_permission',
  NOTIFICATION_PERMISSION: 'notification_permission',
} as const;

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REGISTER_PROVIDER: '/api/auth/register/provider',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  VERIFY_OTP_RESET_PASSWORD: '/api/auth/verify-otp-reset-password',

  // Services
  GET_CATEGORIES: '/api/services/categories',
  GET_NEARBY_PROVIDERS: '/api/services/providers/nearby',
  UPDATE_PROVIDER_LOCATION: '/api/services/providers/location',
  CALCULATE_DISTANCE: '/api/services/providers/distance',

  // Bookings
  CREATE_BOOKING: '/api/bookings',
  GET_BOOKING: '/api/bookings',
  GET_MY_BOOKINGS: '/api/bookings/my-bookings',
  GET_PENDING_BOOKINGS: '/api/bookings/pending',
  ACCEPT_BOOKING: '/api/bookings/{bookingId}/accept',
  REJECT_BOOKING: '/api/bookings/{bookingId}/reject',
  START_SERVICE: '/api/bookings/{bookingId}/start',
  COMPLETE_SERVICE: '/api/bookings/{bookingId}/complete',
  CANCEL_BOOKING: '/api/bookings/{bookingId}/cancel',

  // Reviews
  CREATE_REVIEW: '/api/reviews',
  GET_PROVIDER_REVIEWS: '/api/reviews/provider/{providerId}',
  GET_PROVIDER_STATS: '/api/reviews/provider/{providerId}/stats',
  GET_MY_REVIEWS: '/api/reviews/my-reviews',
  GET_BOOKING_REVIEW: '/api/reviews/booking/{bookingId}',
  DELETE_REVIEW: '/api/reviews/{reviewId}',

  // Messages
  SEND_MESSAGE: '/api/messages',
  GET_CONVERSATION: '/api/messages/conversation/{userId}',
  GET_BOOKING_MESSAGES: '/api/messages/booking/{bookingId}',
  GET_UNREAD_MESSAGES: '/api/messages/unread',
  GET_UNREAD_COUNT: '/api/messages/unread/count',
  MARK_MESSAGES_READ: '/api/messages/read/{senderId}',
  MARK_ALL_READ: '/api/messages/read/all',

  // Admin
  GET_ALL_USERS: '/api/admin/users',
  GET_ALL_BOOKINGS: '/api/admin/bookings',
  GET_ALL_REVIEWS: '/api/admin/reviews',
  GET_DASHBOARD_STATS: '/api/admin/dashboard',
  GET_PENDING_VERIFICATIONS: '/api/admin/providers/pending-verification',
  VERIFY_PROVIDER: '/api/admin/providers/{providerId}/verify',
  REJECT_PROVIDER: '/api/admin/providers/{providerId}/reject',
  CREATE_CATEGORY: '/api/admin/categories',
  UPDATE_CATEGORY: '/api/admin/categories/{categoryId}',
  DEACTIVATE_USER: '/api/admin/users/{userId}/deactivate',
  ACTIVATE_USER: '/api/admin/users/{userId}/activate',
  CHANGE_USER_ROLE: '/api/admin/users/change-role',
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[\d\s\-\(\)]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
} as const;

export const VALIDATION_MESSAGES = {
  EMAIL_INVALID: 'Please enter a valid email address',
  PHONE_INVALID: 'Please enter a valid phone number',
  PASSWORD_INVALID: 'Password must be at least 6 characters with uppercase, lowercase, and number',
  USERNAME_INVALID: 'Username must be 3-20 characters, alphanumeric and underscore only',
  REQUIRED_FIELD: 'This field is required',
  PASSWORD_MISMATCH: 'Passwords do not match',
} as const;

export const PERMISSIONS = {
  LOCATION: 'location',
  CAMERA: 'camera',
  MICROPHONE: 'microphone',
  NOTIFICATION: 'notification',
} as const;

export const NOTIFICATION_TYPES = {
  BOOKING_REQUEST: 'booking_request',
  BOOKING_ACCEPTED: 'booking_accepted',
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
  NEW_MESSAGE: 'new_message',
  PAYMENT_RECEIVED: 'payment_received',
  PROVIDER_VERIFIED: 'provider_verified',
  PROVIDER_REJECTED: 'provider_rejected',
} as const;

export const MAP_CONFIG = {
  DEFAULT_LATITUDE: 37.78825,
  DEFAULT_LONGITUDE: -122.4324,
  DEFAULT_ZOOM: 15,
  SEARCH_RADIUS: 10, // in kilometers
} as const;

export const CHAT_CONFIG = {
  MESSAGES_PER_PAGE: 20,
  TYPING_TIMEOUT: 3000, // milliseconds
  MAX_MESSAGE_LENGTH: 1000,
} as const;

export const RATING_CONFIG = {
  MAX_RATING: 5,
  MIN_RATING: 1,
  DEFAULT_RATING: 0,
} as const;

export const IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  QUALITY: 0.8,
  MAX_WIDTH: 1024,
  MAX_HEIGHT: 1024,
} as const;

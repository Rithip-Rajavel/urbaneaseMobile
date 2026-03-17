export interface User {
  id: number;
  username: string;
  email: string;
  mobileNumber: string;
  role: 'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN';
  currentLocation?: Location;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  bio?: string;
  profileImageUrl?: string;
  yearsOfExperience?: number;
  averageRating?: number;
  totalReviews?: number;
  completedJobs?: number;
  verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED';
  businessName?: string;
  businessLicense?: string;
  active: boolean;
  enabled: boolean;
  available: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  createdAt: string;
  updatedAt: string;
  services: Service[];
  active: boolean;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  category: ServiceCategory;
  basePrice: number;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
  providerServices?: ProviderService[];
  active: boolean;
}

export interface ProviderService {
  id: number;
  provider: User;
  service: Service;
  customPrice?: number;
  description?: string;
  yearsOfExperience?: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface ProviderProfile {
  id: number;
  user: User;
  firstName: string;
  lastName: string;
  bio?: string;
  profileImageUrl?: string;
  yearsOfExperience?: number;
  averageRating?: number;
  totalReviews?: number;
  completedJobs?: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
  businessName?: string;
  businessLicense?: string;
  createdAt: string;
  updatedAt: string;
  reviews?: Review[];
  fullName?: string;
}

export interface Booking {
  id: number;
  customer: User;
  provider: User;
  service: Service;
  serviceLocation: Location;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  scheduledTime?: string;
  startTime?: string;
  endTime?: string;
  totalAmount?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  review?: Review;
}

export interface BookingRequest {
  serviceId: number;
  providerId: number;
  serviceLocation: Location;
  scheduledTime?: string;
  totalAmount?: number;
  description?: string;
}

export interface Review {
  id: number;
  customer: User;
  provider: ProviderProfile;
  booking: Booking;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewRequest {
  bookingId: number;
  rating: number;
  comment?: string;
}

export interface Message {
  id: number;
  sender: User;
  receiver: User;
  booking?: Booking;
  content: string;
  createdAt: string;
  updatedAt: string;
  read: boolean;
}

export interface MessageRequest {
  receiverId: number;
  content: string;
  bookingId?: number;
}

export interface AuthRequest {
  username: string;
  password: string;
  mobileNumber?: string;
  email?: string;
}

export interface OtpRequest {
  email: string;
}

export interface OtpVerificationRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface RoleChangeRequest {
  userId: number;
  newRole: 'CUSTOMER' | 'SERVICE_PROVIDER' | 'ADMIN';
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status?: number;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    body: number;
    caption: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

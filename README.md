# UrbanEase - Domestic Partner Service App

A comprehensive React Native application that acts as a bridge between Customers (who need help with chores) and Service Providers/Agents (who offer specialized skills).

## 🚀 Features

### Core Features
- **Dual User Personas**: Distinct flows for Customers and Service Providers
- **Service Marketplace**: Categories include cooking, plumbing, cleaning, and general household chores
- **Rating System**: Customers can view ratings for providers to ensure quality
- **Direct Communication**: Integrated calling and chat functionality
- **Location-Based Matching**: Providers can see and accept jobs near their current location

### Technical Features
- **Responsive Design**: Built with responsive utilities for all screen sizes
- **Modern Navigation**: Stack and Bottom Tab navigation
- **Theme System**: Consistent theming throughout the app
- **API Integration**: Axios with interceptors for API calls
- **Local Storage**: AsyncStorage for data persistence
- **Push Notifications**: OneSignal integration
- **Location Services**: GPS-based provider matching

## 📱 App Structure

### User Flows

#### Customer Flow
- **Home**: Browse categories and top providers
- **Categories**: View all service categories
- **Service Providers**: Find and book providers
- **Bookings**: Manage active and past bookings
- **Messages**: Chat with providers
- **Profile**: Manage personal information

#### Provider Flow
- **Dashboard**: Overview of earnings and bookings
- **Bookings**: View and manage service requests
- **Earnings**: Track income and payments
- **Messages**: Communicate with customers
- **Profile**: Manage services and availability

#### Admin Flow
- **Dashboard**: System overview and statistics
- **Users**: Manage user accounts
- **Bookings**: Monitor all bookings
- **Providers**: Verify service providers
- **Categories**: Manage service categories

## 🛠 Tech Stack

### Core Dependencies
- **React Native**: 0.84.0
- **TypeScript**: For type safety
- **React Navigation**: Stack and Bottom Tab navigators
- **React Native Paper**: UI components
- **React Native Element Dropdown**: Custom dropdowns
- **Axios**: HTTP client with interceptors
- **Async Storage**: Local data persistence
- **OneSignal**: Push notifications

### Additional Libraries
- **React Native Maps**: Location services
- **React Native Geolocation**: GPS functionality
- **React Native Image Picker**: Photo uploads
- **React Native Vector Icons**: Icon library
- **React Native Reanimated**: Animations
- **React Native Gesture Handler**: Touch gestures
- **React Native Safe Area Context**: Safe area handling

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
│   ├── auth/          # Authentication screens
│   ├── customer/      # Customer-specific screens
│   ├── provider/      # Provider-specific screens
│   └── admin/         # Admin-specific screens
├── navigation/         # Navigation configuration
├── services/          # API services
├── context/           # React Context providers
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── types/             # TypeScript type definitions
├── constants/         # App constants
└── assets/            # Images and icons
```

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22.11.0
- React Native development environment
- Android Studio / Xcode for mobile development

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urbanease
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **iOS setup (if developing for iOS)**
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Start Metro**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run the app**
   
   For Android:
   ```bash
   npm run android
   # or
   yarn android
   ```
   
   For iOS:
   ```bash
   npm run ios
   # or
   yarn ios
   ```

## 🔧 Configuration

### API Configuration
Update the `API_BASE_URL` in `src/constants/index.ts` to point to your backend server.

### OneSignal Setup
1. Create a OneSignal account
2. Add your app ID to the OneSignal configuration
3. Configure push notification handling

### Environment Variables
Create environment-specific configuration files as needed.

## 📱 Screen Sizes & Responsiveness

The app is built with responsive design utilities:
- Uses `responsiveWidth()` and `responsiveHeight()` functions
- Scales based on base dimensions (390x844 - iPhone 12)
- Maintains aspect ratios across different devices

## 🎨 Theme System

The app uses a comprehensive theme system:
- **Colors**: Consistent color palette
- **Typography**: Responsive font sizes
- **Spacing**: Scalable spacing system
- **Shadows**: Pre-defined shadow styles
- **Border Radius**: Consistent border radius values

## 🔐 Authentication Flow

1. **User Selection**: Choose between Customer and Provider
2. **Registration**: Create account with email verification
3. **Login**: Secure authentication with JWT tokens
4. **Password Reset**: OTP-based password recovery

## 📡 API Integration

### Services Structure
- **authService.ts**: Authentication endpoints
- **bookingService.ts**: Booking management
- **api.ts**: Base API client with interceptors

### Features
- Automatic token refresh
- Error handling
- Request/response interceptors
- File upload support

## 🗺 Location Services

- GPS-based provider matching
- Distance calculations
- Location permissions handling
- Map integration for service areas

## 💬 Messaging System

- Real-time chat between users
- Message history
- Read/unread status
- File attachment support

## ⭐ Rating & Review System

- 5-star rating system
- Review comments
- Provider statistics
- Customer feedback

## 🔔 Push Notifications

- Booking notifications
- Message alerts
- Status updates
- Marketing notifications

## 📊 Admin Dashboard

- User management
- Booking oversight
- Provider verification
- Revenue analytics
- System statistics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 Code Style

- TypeScript for type safety
- Consistent naming conventions
- Component-based architecture
- Proper error handling
- Responsive design principles

## 🐛 Troubleshooting

### Common Issues
- **Metro bundler issues**: Clear cache with `npm start -- --reset-cache`
- **iOS build issues**: Run `pod install` in ios directory
- **Android build issues**: Clean and rebuild the project
- **Navigation issues**: Check navigation configuration

### Debug Mode
Enable debug mode for development:
- Shake device to open dev menu
- Enable remote debugging
- Use React DevTools

## 📄 License

This project is licensed under the Apache 2.0 License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review existing issues

---

**Built with ❤️ using React Native**

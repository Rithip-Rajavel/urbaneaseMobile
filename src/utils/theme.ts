import { Dimensions } from 'react-native';
import { Theme } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Base dimensions for responsive design (iPhone 12 dimensions)
const baseWidth = 390;
const baseHeight = 844;

// Scale factors
const widthScale = screenWidth / baseWidth;
const heightScale = screenHeight / baseHeight;

// Responsive scaling function
export const responsiveWidth = (size: number): number => {
  return size * widthScale;
};

export const responsiveHeight = (size: number): number => {
  return size * heightScale;
};

export const responsiveFontSize = (size: number): number => {
  const scale = Math.min(widthScale, heightScale);
  return size * scale;
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return size + (responsiveWidth(size) - size) * factor;
};

// Color palette
export const colors = {
  primary: '#2563eb', // Blue 600
  primaryDark: '#1d4ed8', // Blue 700
  primaryLight: '#3b82f6', // Blue 500
  secondary: '#10b981', // Emerald 500
  accent: '#f59e0b', // Amber 500
  background: '#ffffff', // White
  backgroundDark: '#f8fafc', // Slate 50
  surface: '#f1f5f9', // Slate 100
  text: '#1e293b', // Slate 800
  textSecondary: '#64748b', // Slate 500
  textLight: '#94a3b8', // Slate 400
  border: '#e2e8f0', // Slate 200
  error: '#ef4444', // Red 500
  errorDark: '#dc2626', // Red 600
  success: '#22c55e', // Green 500
  successDark: '#16a34a', // Green 600
  warning: '#f59e0b', // Amber 500
  warningDark: '#d97706', // Amber 600
  info: '#3b82f6', // Blue 500
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Spacing scale
export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(16),
  lg: moderateScale(24),
  xl: moderateScale(32),
  xxl: moderateScale(48),
  xxxl: moderateScale(64),
};

// Typography scale
export const typography = {
  h1: responsiveFontSize(32),
  h2: responsiveFontSize(28),
  h3: responsiveFontSize(24),
  h4: responsiveFontSize(20),
  h5: responsiveFontSize(18),
  h6: responsiveFontSize(16),
  body: responsiveFontSize(14),
  caption: responsiveFontSize(12),
  small: responsiveFontSize(10),
};

// Font families (adjust based on your fonts)
export const fonts = {
  regular: 'System',
  medium: 'System',
  semibold: 'System',
  bold: 'System',
  light: 'System',
};

// Border radius scale
export const borderRadius = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  round: moderateScale(1000), // For circular elements
};

// Shadow configurations
export const shadows = {
  small: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Theme object
export const theme: Theme = {
  colors,
  spacing,
  typography,
  borderRadius,
};

// Common styles
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.small,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  buttonText: {
    color: colors.background,
    fontSize: typography.body,
    fontFamily: fonts.semibold,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: typography.body,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: typography.h3,
    fontFamily: fonts.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.h5,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  body: {
    fontSize: typography.body,
    fontFamily: fonts.regular,
    color: colors.text,
    lineHeight: typography.body * 1.4,
  },
  caption: {
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    color: colors.textLight,
  },
  errorText: {
    fontSize: typography.caption,
    fontFamily: fonts.regular,
    color: colors.error,
    marginTop: spacing.xs,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shadow: shadows.small,
  shadowMedium: shadows.medium,
  shadowLarge: shadows.large,
};

// Status bar configurations for different themes
export const statusBarConfig = {
  light: {
    barStyle: 'dark-content' as const,
    backgroundColor: colors.background,
  },
  dark: {
    barStyle: 'light-content' as const,
    backgroundColor: colors.text,
  },
  primary: {
    barStyle: 'light-content' as const,
    backgroundColor: colors.primary,
  },
};

import { Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// Responsive dimensions
export const wp = (percentage) => {
  const value = (percentage * width) / 100;
  return Math.round(value);
};

export const hp = (percentage) => {
  const value = (percentage * height) / 100;
  return Math.round(value);
};

// Font scaling
export const normalize = (size) => {
  const scale = width / 375; // iPhone 6/7/8 width as base
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(newSize);
  } else {
    return Math.round(newSize) - 2;
  }
};

// Common dimensions
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};

export const FontSize = {
  xs: normalize(12),
  sm: normalize(14),
  md: normalize(16),
  lg: normalize(18),
  xl: normalize(20),
  xxl: normalize(24),
  xxxl: normalize(28),
  title: normalize(32),
};

export const IconSize = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  xxl: 40,
};

// Camera dimensions
export const CameraDimensions = {
  documentFrame: {
    width: wp(85),
    height: hp(25),
  },
  faceFrame: {
    width: wp(70),
    height: wp(70),
  },
  qrFrame: {
    width: wp(60),
    height: wp(60),
  },
};

// Button dimensions
export const ButtonDimensions = {
  height: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  width: {
    sm: wp(30),
    md: wp(50),
    lg: wp(80),
    full: wp(90),
  },
};

// Input dimensions
export const InputDimensions = {
  height: 48,
  borderWidth: 1,
};

// Header dimensions
export const HeaderDimensions = {
  height: Platform.OS === 'ios' ? 88 : 64,
  statusBarHeight: Platform.OS === 'ios' ? 44 : 24,
};

// Safe area
export const SafeAreaDimensions = {
  top: Platform.OS === 'ios' ? 44 : 0,
  bottom: Platform.OS === 'ios' ? 34 : 0,
};
import { StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { FontSize, Spacing, BorderRadius, ButtonDimensions, InputDimensions } from '../constants/Dimensions';

export const GlobalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  
  // Text Styles
  title: {
    fontSize: FontSize.title,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  
  subtitle: {
    fontSize: FontSize.xl,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  
  heading: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  
  bodyText: {
    fontSize: FontSize.md,
    fontWeight: '400',
    color: Colors.textSecondary,
    lineHeight: FontSize.md * 1.5,
  },
  
  caption: {
    fontSize: FontSize.sm,
    fontWeight: '400',
    color: Colors.textTertiary,
    lineHeight: FontSize.sm * 1.4,
  },
  
  centerText: {
    textAlign: 'center',
  },
  
  // Button Styles
  primaryButton: {
    backgroundColor: Colors.buttonPrimary,
    height: ButtonDimensions.height.md,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  secondaryButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.buttonPrimary,
    height: ButtonDimensions.height.md,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  
  disabledButton: {
    backgroundColor: Colors.buttonDisabled,
    height: ButtonDimensions.height.md,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.sm,
  },
  
  primaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
  
  secondaryButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.buttonPrimary,
  },
  
  disabledButtonText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.white,
  },
  
  // Input Styles
  inputContainer: {
    marginVertical: Spacing.sm,
  },
  
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  
  textInput: {
    height: InputDimensions.height,
    borderWidth: InputDimensions.borderWidth,
    borderColor: Colors.inputBorder,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.inputBackground,
  },
  
  textInputFocused: {
    borderColor: Colors.inputFocus,
  },
  
  textInputError: {
    borderColor: Colors.inputError,
  },
  
  inputError: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  
  // Card Styles
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginVertical: Spacing.sm,
    shadowColor: Colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  // Progress Styles
  progressContainer: {
    height: 4,
    backgroundColor: Colors.progressBackground,
    borderRadius: BorderRadius.xs,
    marginVertical: Spacing.md,
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: BorderRadius.xs,
  },
  
  // Step Indicator Styles
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  
  stepCircleCompleted: {
    backgroundColor: Colors.success,
  },
  
  stepCircleInactive: {
    backgroundColor: Colors.lightGray,
  },
  
  stepNumber: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.white,
  },
  
  stepLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
  
  stepLabelActive: {
    color: Colors.primary,
    fontWeight: '500',
  },
  
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.cameraOverlay,
  },
  
  cameraFrame: {
    borderWidth: 2,
    borderColor: Colors.cameraFrame,
    backgroundColor: 'transparent',
  },
  
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  
  loadingText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  
  // Error Styles
  errorContainer: {
    backgroundColor: Colors.errorLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.sm,
  },
  
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
  },
  
  // Success Styles
  successContainer: {
    backgroundColor: Colors.successLight,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    marginVertical: Spacing.sm,
  },
  
  successText: {
    fontSize: FontSize.sm,
    color: Colors.success,
    textAlign: 'center',
  },
  
  // Spacing Utilities
  marginTop: {
    marginTop: Spacing.md,
  },
  
  marginBottom: {
    marginBottom: Spacing.md,
  },
  
  marginVertical: {
    marginVertical: Spacing.md,
  },
  
  marginHorizontal: {
    marginHorizontal: Spacing.md,
  },
  
  paddingTop: {
    paddingTop: Spacing.md,
  },
  
  paddingBottom: {
    paddingBottom: Spacing.md,
  },
  
  paddingVertical: {
    paddingVertical: Spacing.md,
  },
  
  paddingHorizontal: {
    paddingHorizontal: Spacing.md,
  },
});
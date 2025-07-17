import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { FontSize, Spacing } from '../constants/Dimensions';

const StepIndicator = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Dados\nPessoais' },
    { number: 2, label: 'Capturar B.I\n(Frente)' },
    { number: 3, label: 'Capturar B.I\n(Verso)' },
    { number: 4, label: 'Reconhecimento\nFacial e Prova\nde Vida' },
    { number: 5, label: 'Capturar\nVoz' },
    { number: 6, label: 'Capturar\nAssinatura' },
    { number: 7, label: 'Resultado' },
  ];

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'inactive';
  };

  const getStepStyle = (status) => {
    switch (status) {
      case 'completed':
        return styles.stepCircleCompleted;
      case 'active':
        return styles.stepCircleActive;
      default:
        return styles.stepCircleInactive;
    }
  };

  const getTextStyle = (status) => {
    switch (status) {
      case 'completed':
      case 'active':
        return styles.stepLabelActive;
      default:
        return styles.stepLabel;
    }
  };

  const renderProgressLine = (index) => {
    if (index === steps.length - 1) return null;
    
    const isCompleted = index + 1 < currentStep;
    return (
      <View style={[
        styles.progressLine,
        isCompleted && styles.progressLineCompleted
      ]} />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          return (
            <React.Fragment key={step.number}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, getStepStyle(status)]}>
                  {status === 'completed' ? (
                    <Text style={styles.checkmark}>✓</Text>
                  ) : (
                    <Text style={styles.stepNumber}>{step.number}</Text>
                  )}
                </View>
                <Text style={[styles.stepLabel, getTextStyle(status)]}>
                  {step.label}
                </Text>
              </View>
              {renderProgressLine(index)}
            </React.Fragment>
          );
        })}
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View 
            style={[
              styles.progressBarFill,
              { width: `${(currentStep / totalSteps) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Passo {currentStep} de {totalSteps}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
  },
  
  stepItem: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.white,
  },
  
  checkmark: {
    fontSize: FontSize.sm,
    color: Colors.white,
    fontWeight: 'bold',
  },
  
  stepLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 12,
    paddingHorizontal: 2,
  },
  
  stepLabelActive: {
    color: Colors.primary,
    fontWeight: '500',
  },
  
  progressLine: {
    position: 'absolute',
    top: 14,
    left: '50%',
    right: '-50%',
    height: 2,
    backgroundColor: Colors.lightGray,
    zIndex: -1,
  },
  
  progressLineCompleted: {
    backgroundColor: Colors.success,
  },
  
  progressBarContainer: {
    paddingHorizontal: Spacing.md,
  },
  
  progressBarBackground: {
    height: 4,
    backgroundColor: Colors.progressBackground,
    borderRadius: 2,
    marginBottom: Spacing.xs,
  },
  
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.progressFill,
    borderRadius: 2,
  },
  
  progressText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});

export default StepIndicator;
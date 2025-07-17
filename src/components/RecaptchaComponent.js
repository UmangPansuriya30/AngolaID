import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { FontSize, Spacing, BorderRadius } from '../constants/Dimensions';

const RecaptchaComponent = ({ onVerify, error }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);

  const handleInitialCheck = () => {
    setIsLoading(true);
    
    // Simulate reCAPTCHA verification delay
    setTimeout(() => {
      setIsLoading(false);
      // 70% chance of immediate success, 30% chance of challenge
      const needsChallenge = Math.random() > 0.7;
      
      if (needsChallenge) {
        setShowChallenge(true);
      } else {
        setIsVerified(true);
        onVerify(true);
      }
    }, 1500);
  };

  const handleChallengeComplete = () => {
    setIsLoading(true);
    
    // Simulate challenge completion
    setTimeout(() => {
      setIsLoading(false);
      setShowChallenge(false);
      setIsVerified(true);
      onVerify(true);
    }, 2000);
  };

  const resetRecaptcha = () => {
    setIsVerified(false);
    setShowChallenge(false);
    setIsLoading(false);
    onVerify(false);
  };

  if (showChallenge) {
    return (
      <View style={styles.container}>
        <View style={[styles.recaptchaBox, error && styles.errorBorder]}>
          <View style={styles.challengeContainer}>
            <Text style={styles.challengeTitle}>Verificação de Segurança</Text>
            <Text style={styles.challengeText}>
              Selecione todas as imagens que contêm semáforos
            </Text>
            
            <View style={styles.imageGrid}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.gridItem}
                  onPress={() => {/* Handle image selection */}}
                >
                  <Text style={styles.gridItemText}>🚦</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity
              style={styles.verifyButton}
              onPress={handleChallengeComplete}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <Text style={styles.verifyButtonText}>Verificar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.recaptchaBox, error && styles.errorBorder]}>
        <View style={styles.recaptchaContent}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={isVerified ? resetRecaptcha : handleInitialCheck}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : isVerified ? (
              <Text style={styles.checkmark}>✓</Text>
            ) : (
              <View style={styles.emptyCheckbox} />
            )}
          </TouchableOpacity>
          
          <Text style={styles.recaptchaText}>
            {isVerified ? 'Verificado com sucesso' : "I'm not a robot"}
          </Text>
          
          <View style={styles.recaptchaLogo}>
            <Text style={styles.logoText}>reCAPTCHA</Text>
            <Text style={styles.privacyText}>Privacy - Terms</Text>
          </View>
        </View>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  
  recaptchaBox: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
  },
  
  errorBorder: {
    borderColor: Colors.error,
  },
  
  recaptchaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  
  emptyCheckbox: {
    width: '100%',
    height: '100%',
  },
  
  checkmark: {
    fontSize: 16,
    color: Colors.success,
    fontWeight: 'bold',
  },
  
  recaptchaText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginLeft: Spacing.md,
  },
  
  recaptchaLogo: {
    alignItems: 'flex-end',
  },
  
  logoText: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
  
  privacyText: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  
  challengeContainer: {
    alignItems: 'center',
  },
  
  challengeTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  
  challengeText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 150,
    height: 150,
    marginBottom: Spacing.md,
  },
  
  gridItem: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  
  gridItemText: {
    fontSize: 20,
  },
  
  verifyButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xs,
    minWidth: 100,
  },
  
  verifyButtonText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  errorText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
});

export default RecaptchaComponent;
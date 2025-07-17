import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { FontSize, Spacing, CameraDimensions } from '../constants/Dimensions';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const QRFrame = ({ onQRDetected, isScanning }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const cornerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the frame
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    // Scan line animation
    const scanAnimation = Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    );

    // Corner animation
    const cornerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cornerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(cornerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );

    pulseAnimation.start();
    scanAnimation.start();
    cornerAnimation.start();

    return () => {
      pulseAnimation.stop();
      scanAnimation.stop();
      cornerAnimation.stop();
    };
  }, []);

  // Simulate QR code detection
  useEffect(() => {
    if (onQRDetected && !isScanning) {
      const timer = setTimeout(() => {
        // Simulate QR code detection
        const isQRDetected = Math.random() > 0.4; // 60% chance of detection
        if (isQRDetected) {
          const mockQRData = {
            type: 'QR_CODE',
            data: 'AO123456789|João Silva|1990-01-01|M|Luanda',
            bounds: {
              origin: { x: 100, y: 100 },
              size: { width: 200, height: 200 },
            },
          };
          onQRDetected(mockQRData);
        }
      }, 2500); // Wait 2.5 seconds before detection

      return () => clearTimeout(timer);
    }
  }, [onQRDetected, isScanning]);

  const frameDimensions = {
    width: CameraDimensions.qrFrame.width,
    height: CameraDimensions.qrFrame.height,
  };

  const frameTop = (screenHeight - frameDimensions.height) / 2;
  const frameLeft = (screenWidth - frameDimensions.width) / 2;

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, frameDimensions.height - 2],
  });

  const cornerOpacity = cornerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <View style={styles.container}>
      {/* Dark overlay */}
      <View style={styles.overlay}>
        {/* Top overlay */}
        <View style={[styles.overlaySection, { height: frameTop }]} />
        
        {/* Middle section with frame */}
        <View style={styles.middleSection}>
          {/* Left overlay */}
          <View style={[styles.overlaySection, { width: frameLeft }]} />
          
          {/* Frame area */}
          <View style={styles.frameContainer}>
            <Animated.View
              style={[
                styles.frame,
                {
                  width: frameDimensions.width,
                  height: frameDimensions.height,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              {/* Animated corners */}
              <Animated.View 
                style={[
                  styles.corner, 
                  styles.topLeft,
                  { opacity: cornerOpacity }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.corner, 
                  styles.topRight,
                  { opacity: cornerOpacity }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.corner, 
                  styles.bottomLeft,
                  { opacity: cornerOpacity }
                ]} 
              />
              <Animated.View 
                style={[
                  styles.corner, 
                  styles.bottomRight,
                  { opacity: cornerOpacity }
                ]} 
              />
              
              {/* Scan line */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLineTranslateY }],
                  },
                ]}
              />
              
              {/* QR grid overlay */}
              <View style={styles.qrGrid}>
                {Array.from({ length: 9 }).map((_, index) => (
                  <View key={index} style={styles.gridLine} />
                ))}
              </View>
              
              {/* Center target */}
              <View style={styles.centerTarget}>
                <View style={styles.targetOuter}>
                  <View style={styles.targetInner} />
                </View>
              </View>
            </Animated.View>
          </View>
          
          {/* Right overlay */}
          <View style={[styles.overlaySection, { width: frameLeft }]} />
        </View>
        
        {/* Bottom overlay */}
        <View style={[
          styles.overlaySection, 
          { height: screenHeight - frameTop - frameDimensions.height }
        ]} />
      </View>

      {/* Instructions overlay */}
      <View style={styles.instructionsOverlay}>
        <Text style={styles.instructionTitle}>
          Código QR do B.I.
        </Text>
        <Text style={styles.instructionText}>
          Posicione o código QR do verso do seu Bilhete de Identidade dentro do quadro
        </Text>
      </View>

      {/* Status indicators */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, styles.statusActive]} />
          <Text style={styles.statusText}>Procurando código QR...</Text>
        </View>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, styles.statusActive]} />
          <Text style={styles.statusText}>Mantenha o dispositivo estável</Text>
        </View>
      </View>

      {/* QR detection hint */}
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>
          💡 Certifique-se de que o código QR está bem iluminado e visível
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  
  overlay: {
    flex: 1,
  },
  
  overlaySection: {
    backgroundColor: Colors.cameraOverlay,
  },
  
  middleSection: {
    flexDirection: 'row',
  },
  
  frameContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  frame: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 12,
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  
  corner: {
    position: 'absolute',
    width: 25,
    height: 25,
    borderColor: Colors.white,
    borderWidth: 4,
  },
  
  topLeft: {
    top: -4,
    left: -4,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  
  topRight: {
    top: -4,
    right: -4,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  
  bottomLeft: {
    bottom: -4,
    left: -4,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  
  bottomRight: {
    bottom: -4,
    right: -4,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  
  qrGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  gridLine: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  centerTarget: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
  },
  
  targetOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  targetInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.white,
  },
  
  instructionsOverlay: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  instructionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  
  instructionText: {
    fontSize: FontSize.sm,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: FontSize.sm * 1.3,
  },
  
  statusContainer: {
    position: 'absolute',
    top: 140,
    left: Spacing.md,
  },
  
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: Spacing.sm,
  },
  
  statusActive: {
    backgroundColor: Colors.primary,
  },
  
  statusInactive: {
    backgroundColor: Colors.lightGray,
  },
  
  statusText: {
    fontSize: FontSize.xs,
    color: Colors.white,
    fontWeight: '500',
  },
  
  hintContainer: {
    position: 'absolute',
    bottom: 100,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: Spacing.sm,
    borderRadius: 6,
    alignItems: 'center',
  },
  
  hintText: {
    fontSize: FontSize.xs,
    color: Colors.white,
    textAlign: 'center',
  },
});

export default QRFrame;
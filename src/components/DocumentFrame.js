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

const DocumentFrame = ({ type, onAutoCapture, isCapturing }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the frame
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    // Scan line animation
    const scanAnimation = Animated.loop(
      Animated.timing(scanLineAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    scanAnimation.start();

    return () => {
      pulseAnimation.stop();
      scanAnimation.stop();
    };
  }, []);

  // Simulate auto-capture detection
  useEffect(() => {
    if (onAutoCapture && !isCapturing) {
      const timer = setTimeout(() => {
        // Simulate document detection
        const isDocumentDetected = Math.random() > 0.3; // 70% chance of detection
        if (isDocumentDetected) {
          onAutoCapture();
        }
      }, 3000); // Wait 3 seconds before auto-capture

      return () => clearTimeout(timer);
    }
  }, [onAutoCapture, isCapturing]);

  const getFrameDimensions = () => {
    if (type === 'front') {
      return {
        width: CameraDimensions.documentFrame.width,
        height: CameraDimensions.documentFrame.height,
      };
    }
    return {
      width: CameraDimensions.documentFrame.width,
      height: CameraDimensions.documentFrame.height,
    };
  };

  const frameDimensions = getFrameDimensions();
  const frameTop = (screenHeight - frameDimensions.height) / 2;
  const frameLeft = (screenWidth - frameDimensions.width) / 2;

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, frameDimensions.height - 2],
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
              {/* Corner indicators */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Scan line */}
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: scanLineTranslateY }],
                  },
                ]}
              />
              
              {/* Center guide */}
              <View style={styles.centerGuide}>
                <View style={styles.centerDot} />
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
          {type === 'front' ? 'Frente do B.I.' : 'Verso do B.I.'}
        </Text>
        <Text style={styles.instructionText}>
          {type === 'front' 
            ? 'Posicione a frente do seu Bilhete de Identidade dentro do quadro'
            : 'Posicione o verso do seu Bilhete de Identidade dentro do quadro'
          }
        </Text>
      </View>

      {/* Status indicators */}
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, styles.statusActive]} />
          <Text style={styles.statusText}>Enquadramento adequado</Text>
        </View>
        <View style={styles.statusItem}>
          <View style={[styles.statusDot, styles.statusActive]} />
          <Text style={styles.statusText}>Iluminação adequada</Text>
        </View>
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
    borderColor: Colors.cameraFrame,
    borderRadius: 8,
    position: 'relative',
  },
  
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: Colors.white,
    borderWidth: 3,
  },
  
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.cameraFrame,
    shadowColor: Colors.cameraFrame,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  
  centerGuide: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  
  centerDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.white,
    backgroundColor: 'transparent',
  },
  
  instructionsOverlay: {
    position: 'absolute',
    top: 60,
    left: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    backgroundColor: Colors.success,
  },
  
  statusInactive: {
    backgroundColor: Colors.lightGray,
  },
  
  statusText: {
    fontSize: FontSize.xs,
    color: Colors.white,
    fontWeight: '500',
  },
});

export default DocumentFrame;
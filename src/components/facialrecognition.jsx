import React,{ useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useFrameProcessor } from 'react-native-vision-camera';
import { detectFaces, useFaceDetector } from 'react-native-vision-camera-face-detector';
import { runOnJS } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../src/constants/Colors';
import { FontSize, Spacing, wp, hp } from '../src/constants/Dimensions';
import { GlobalStyles } from '../src/styles/GlobalStyles';
import StepIndicator from '../src/components/StepIndicator';
import { router,useLocalSearchParams } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const FacialRecognition = () => {
    const { user } = useLocalSearchParams();
    const userData = JSON.parse(user);
    const [currentStep, setCurrentStep] = useState(0);
    const [isCapturing, setIsCapturing] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [faceDetected, setFaceDetected] = useState(false);
    const [livenessStep, setLivenessStep] = useState('center');
    const [completedSteps, setCompletedSteps] = useState([]);
    const [capturedImages, setCapturedImages] = useState([]);
    // const detectFaces = useFaceDetector({
    //     mode: 'accurate',
    //     trackingEnabled: true,
    // });
    console.log('User Data:', userData);
    console.log('User Data:', typeof detectFaces);
    const cameraRef = useRef(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const devices = useCameraDevices();
    const device = devices[0];

    const livenessSteps = [
        { id: 'center', instruction: 'Olhe diretamente para a câmera', icon: 'face' },
        { id: 'left', instruction: 'Vire o rosto para a esquerda', icon: 'keyboard-arrow-left' },
        { id: 'right', instruction: 'Vire o rosto para a direita', icon: 'keyboard-arrow-right' },
        { id: 'smile', instruction: 'Sorria naturalmente', icon: 'sentiment-satisfied' },
    ];

    useEffect(() => {
        (async () => {
            const permission = await Camera.requestCameraPermission();
            if (permission !== 'authorized') {
                Alert.alert('Permissão', 'A permissão da câmera é necessária.');
            }
        })();
        StatusBar.setBarStyle('light-content');
        startLivenessDetection();

        return () => StatusBar.setBarStyle('default');
    }, []);

    useEffect(() => {
        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
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
        pulseAnimation.start();
        return () => pulseAnimation.stop();
    }, []);

    const frameProcessor = useFrameProcessor((frame) => {
        'worklet';
        const faces = detectFaces(frame);
        runOnJS(setFaceDetected)(faces);
    }, []);

    const startLivenessDetection = () => {
        setCurrentStep(0);
        setLivenessStep(livenessSteps[0].id);
        setCompletedSteps([]);
        setCapturedImages([]);
        startCountdown();
    };

    const startCountdown = () => {
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    captureCurrentStep();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const captureCurrentStep = async () => {
        if (!cameraRef.current || isCapturing) return;

        try {
            setIsCapturing(true);
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
            ]).start();

            const photo = await cameraRef.current.takePhoto({ flash: 'off' });

            const isValidCapture = await validateLivenessStep(photo.path, livenessStep);

            if (isValidCapture) {
                const newCompletedSteps = [...completedSteps, currentStep];
                const newCapturedImages = [...capturedImages, {
                    step: livenessStep,
                    uri: photo.path,
                    timestamp: Date.now(),
                }];

                setCompletedSteps(newCompletedSteps);
                setCapturedImages(newCapturedImages);

                if (currentStep < livenessSteps.length - 1) {
                    setTimeout(() => {
                        setCurrentStep(currentStep + 1);
                        setLivenessStep(livenessSteps[currentStep + 1].id);
                        startCountdown();
                    }, 1000);
                } else {
                    setTimeout(() => {
                        completeLivenessDetection();
                    }, 1000);
                }
            } else {
                Alert.alert(
                    'Captura Inválida',
                    'Não foi possível detectar o movimento solicitado. Tente novamente.',
                    [{ text: 'OK', onPress: () => startCountdown() }]
                );
            }
        } catch (error) {
            console.error('Error capturing image:', error);
            Alert.alert('Erro', 'Erro ao capturar imagem. Tente novamente.');
        } finally {
            setIsCapturing(false);
        }
    };

    const validateLivenessStep = async (imageUri, step) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const isValid = Math.random() > 0.15;
                resolve(isValid);
            }, 1500);
        });
    };

    const completeLivenessDetection = () => {
        Alert.alert('Reconhecimento Facial Concluído', 'Prova de vida validada com sucesso!', [
            {
                text: 'Continuar',
                onPress: () => navigation.navigate('VoiceCapture', {
                    facialData: capturedImages,
                }),
            },
        ]);
    };

    const getCurrentInstruction = () => livenessSteps[currentStep]?.instruction || '';
    const getCurrentIcon = () => livenessSteps[currentStep]?.icon || 'face';
    const getFaceFrameStyle = () => {
        const baseSize = wp(60);
        return {
            width: baseSize,
            height: baseSize * 1.2,
            borderRadius: baseSize * 0.6,
        };
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reconhecimento Facial</Text>
            </View>

            <StepIndicator currentStep={4} totalSteps={7} />

            <View style={styles.cameraContainer}>
                {device != null && (
                    <Camera
                        ref={cameraRef}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={true}
                        photo={true}
                        frameProcessor={frameProcessor}
                        frameProcessorFps={5}
                    />
                )}

                <Animated.View style={[styles.cameraOverlay, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                    <Animated.View
                        style={[
                            styles.faceFrame,
                            getFaceFrameStyle(),
                            {
                                transform: [{ scale: pulseAnim }],
                                borderColor: faceDetected ? Colors.success : Colors.primary,
                            },
                        ]}>
                        <View style={styles.faceIndicator}>
                            <Icon name={faceDetected ? 'face' : 'face-retouching-off'} size={40} color={faceDetected ? Colors.success : Colors.lightGray} />
                        </View>
                    </Animated.View>
                </Animated.View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
                <View style={styles.instructionHeader}>
                    <Icon name={getCurrentIcon()} size={32} color={Colors.primary} />
                    <Text style={styles.instructionTitle}>
                        Passo {currentStep + 1} de {livenessSteps.length}
                    </Text>
                </View>

                <Text style={styles.instructionText}>
                    {getCurrentInstruction()}
                </Text>

                {countdown > 0 && (
                    <View style={styles.countdownContainer}>
                        <Text style={styles.countdownText}>{countdown}</Text>
                    </View>
                )}
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${((currentStep + 1) / livenessSteps.length) * 100}%` },
                        ]}
                    />
                </View>

                <View style={styles.stepsContainer}>
                    {livenessSteps.map((step, index) => (
                        <View key={step.id} style={styles.stepItem}>
                            <View style={[
                                styles.stepCircle,
                                {
                                    backgroundColor: completedSteps.includes(index)
                                        ? Colors.success
                                        : index === currentStep
                                            ? Colors.primary
                                            : Colors.lightGray,
                                },
                            ]}>
                                <Icon
                                    name={completedSteps.includes(index) ? 'check' : step.icon}
                                    size={16}
                                    color={Colors.white}
                                />
                            </View>
                            <Text style={styles.stepLabel}>{step.id}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Status */}
            <View style={styles.statusContainer}>
                <View style={styles.statusItem}>
                    <View style={[
                        styles.statusDot,
                        { backgroundColor: faceDetected ? Colors.success : Colors.error }
                    ]} />
                    <Text style={styles.statusText}>
                        {faceDetected ? 'Rosto detectado' : 'Posicione seu rosto no quadro'}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingTop: hp(6),
        paddingBottom: Spacing.md,
    },

    backButton: {
        padding: Spacing.sm,
        marginRight: Spacing.sm,
    },

    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: '600',
        color: Colors.white,
    },

    cameraContainer: {
        flex: 1,
        margin: Spacing.md,
        borderRadius: 12,
        overflow: 'hidden',
    },

    camera: {
        flex: 1,
    },

    cameraOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },

    faceFrame: {
        borderWidth: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },

    faceIndicator: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    instructionsContainer: {
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        alignItems: 'center',
    },

    instructionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },

    instructionTitle: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginLeft: Spacing.sm,
    },

    instructionText: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: FontSize.md * 1.4,
    },

    countdownContainer: {
        marginTop: Spacing.md,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    countdownText: {
        fontSize: FontSize.xl,
        fontWeight: 'bold',
        color: Colors.white,
    },

    progressContainer: {
        padding: Spacing.md,
        backgroundColor: Colors.surface,
    },

    progressBar: {
        height: 4,
        backgroundColor: Colors.lightGray,
        borderRadius: 2,
        marginBottom: Spacing.md,
    },

    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 2,
    },

    stepsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    stepItem: {
        alignItems: 'center',
    },

    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },

    stepLabel: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        textTransform: 'capitalize',
    },

    statusContainer: {
        padding: Spacing.md,
        backgroundColor: Colors.surface,
    },

    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: Spacing.sm,
    },

    statusText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
});

export  default FacialRecognition;
// import {
//   StyleSheet,
//   Text,
//   View
// } from 'react-native'
// import {
//   useEffect,
//   useState,
//   useRef
// } from 'react'
// import {
//   Camera,
//   useCameraDevices,
//   useFrameProcessor
// } from 'react-native-vision-camera'
// import {
//   detectFaces,
//   DetectionResult
// } from 'react-native-vision-camera-face-detector'
// import { Worklets } from 'react-native-worklets-core'
// import { SafeAreaView } from 'react-native-safe-area-context'

// export default function FacialRecognition() {
//   const cameraRef = useRef(null);
//   const devices = useCameraDevices();
//   const device = devices[0];


//   useEffect(() => {
//     (async () => {
//       const status = await Camera.requestCameraPermission()
//       console.log({ status })
//     })()
//   }, [device])


//   const handleFacesDetection = Worklets.createRunOnJS((
//     result
//   ) => {
//     console.log('detection result', result)
//   })
//   console
//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet'
//     const result = detectFaces({
//       frame,
//       options: {
//         // detection settings
//       }
//     })
//     handleFacesDetection(result)
//   }, [handleFacesDetection])

//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
//         <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}>Facial Recognition</Text>
//         <Text>Device: {device?.name || 'No device'}</Text>
//         <View style={{
//           flex: 1,
//           position: 'relative',
//           zIndex: 0,
//           backgroundColor: 'red',
//           width: '100%',
//         }}>

//           {device && <Camera
//             ref={cameraRef}
//             style={{ flex: 1 }}
//             device={device}
//             isActive={true}
//             photo={true}
//             video={false}
//             torch={'on'}
//           />}
//         </View>
//       </View>
//     </SafeAreaView>
//   )
// }


// export default FacialRecognition =()=>{
//     return (
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//             <Text
//                 style={{ fontSize: 24, fontWeight: 'bold', color: 'red' }}
//             >Facial Recognition Component</Text>
//         </View>
//     );
// }
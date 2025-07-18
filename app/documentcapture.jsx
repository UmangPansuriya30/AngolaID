// import React, { useState, useRef, useEffect } from 'react';
// import {
//     View,
//     Text,
//     StyleSheet,
//     TouchableOpacity,
//     Alert,
//     Dimensions,
//     StatusBar,
// } from 'react-native';

// import { SafeAreaView } from 'react-native-safe-area-context';
// import { RNCamera } from 'react-native-camera';
// import { Colors } from '../src/constants/Colors';
// import { FontSize, Spacing, BorderRadius, wp, hp, CameraDimensions } from '../src/constants/Dimensions';
// import { GlobalStyles } from '../src/styles/GlobalStyles';
// import { Link } from 'expo-router';
// import StepIndicator from '../src/components/StepIndicator';
// import DocumentFrame from '../src/components/DocumentFrame';
// import QRCodeScanner from '../src/components/QRCodeScanner';
// import { router, useLocalSearchParams } from 'expo-router';


// const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// export default function DocumentCapture() {
//     const { user } = useLocalSearchParams();
//     const userData = JSON.parse(user);

//     // return (
//     //     <View style={[GlobalStyles.container, { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }]}>
//     //         <Text style={GlobalStyles.title}>Document Capture</Text>
//     //         <Link style={{
//     //             color: 'blue',
//     //             fontSize: 25,
//     //         }} href="/personaldata">Go to Personal Data</Link>
//     //         <StatusBar style="auto" />
//     //     </View>
//     // );
//     const [currentStep, setCurrentStep] = useState('front'); // 'front', 'back', 'qr'
//     const [capturedImages, setCapturedImages] = useState({
//         front: null,
//         back: null,
//     });
//     const [qrData, setQrData] = useState(null);
//     const [isCapturing, setIsCapturing] = useState(false);
//     const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);
//     const [autoCapture, setAutoCapture] = useState(true);
//     const cameraRef = useRef(null);

//     const stepTitles = {
//         front: 'Capturar a Frente do BI',
//         back: 'Capturar o Verso do BI',
//         qr: 'Detectar QR Code',
//     };

//     const stepInstructions = {
//         front: 'Aproxime o B.I dentro do quadro para que a foto do B.I tenha uma tamanho visível.',
//         back: 'Aponte a câmera para o QR do verso do B.I. e aproxime lentamente até o código QR preencher a área indicada.',
//         qr: 'Aguarde até que o QR seja detectado automaticamente.',
//     };

//     useEffect(() => {
//         StatusBar.setBarStyle('light-content');
//         StatusBar.setBackgroundColor(Colors.black);

//         return () => {
//             StatusBar.setBarStyle('dark-content');
//             StatusBar.setBackgroundColor(Colors.white);
//         };
//     }, []);

//     const handleCapture = async () => {
//         if (isCapturing || !cameraRef.current) return;

//         setIsCapturing(true);

//         try {
//             const options = {
//                 quality: 0.8,
//                 base64: false,
//                 skipProcessing: false,
//                 forceUpOrientation: true,
//             };

//             const data = await cameraRef.current.takePictureAsync(options);

//             if (currentStep === 'front') {
//                 setCapturedImages(prev => ({ ...prev, front: data.uri }));
//                 setCurrentStep('back');
//             } else if (currentStep === 'back') {
//                 setCapturedImages(prev => ({ ...prev, back: data.uri }));
//                 setCurrentStep('qr');
//             }

//         } catch (error) {
//             console.error('Error capturing image:', error);
//             Alert.alert('Erro', 'Falha ao capturar imagem. Tente novamente.');
//         } finally {
//             setIsCapturing(false);
//         }
//     };

//     const handleQRCodeDetected = (qrData) => {
//         if (qrData && qrData.data) {
//             setQrData(qrData.data);

//             // Simulate QR processing
//             setTimeout(() => {
//                 handleContinue();
//             }, 1000);
//         }
//     };

//     const handleContinue = () => {
//         const documentData = {
//             ...userData,
//             documents: {
//                 front: capturedImages.front,
//                 back: capturedImages.back,
//                 qrData: qrData,
//             },
//         };

//         navigation.navigate('FacialRecognition', { userData: documentData });
//     };

//     const handleRetake = () => {
//         if (currentStep === 'back') {
//             setCurrentStep('front');
//             setCapturedImages({ front: null, back: null });
//         } else if (currentStep === 'qr') {
//             setCurrentStep('back');
//             setCapturedImages(prev => ({ ...prev, back: null }));
//         }
//         setQrData(null);
//     };

//     const toggleFlash = () => {
//         setFlashMode(
//             flashMode === RNCamera.Constants.FlashMode.off
//                 ? RNCamera.Constants.FlashMode.on
//                 : RNCamera.Constants.FlashMode.off
//         );
//     };

//     const toggleAutoCapture = () => {
//         setAutoCapture(!autoCapture);
//     };

//     const renderCameraOverlay = () => {
//         if (currentStep === 'qr') {
//             return (
//                 <QRCodeScanner
//                     onQRCodeDetected={handleQRCodeDetected}
//                     isActive={currentStep === 'qr'}
//                 />
//             );
//         }

//         return (
//             <DocumentFrame
//                 type={currentStep}
//                 onAutoCapture={autoCapture ? handleCapture : null}
//                 isCapturing={isCapturing}
//             />
//         );
//     };

//     const getStepNumber = () => {
//         switch (currentStep) {
//             case 'front': return 2;
//             case 'back': return 3;
//             case 'qr': return 3;
//             default: return 2;
//         }
//     };

//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Step Indicator - only show when not in camera mode */}
//             <View style={styles.stepIndicatorContainer}>
//                 <StepIndicator currentStep={getStepNumber()} totalSteps={7} />
//             </View>

//             {/* Camera View */}
//             <View style={styles.cameraContainer}>
//                 <RNCamera
//                     ref={cameraRef}
//                     style={styles.camera}
//                     type={RNCamera.Constants.Type.back}
//                     flashMode={flashMode}
//                     captureAudio={false}
//                     androidCameraPermissionOptions={{
//                         title: 'Permissão para usar a câmera',
//                         message: 'Precisamos da sua permissão para usar a câmera',
//                         buttonPositive: 'Ok',
//                         buttonNegative: 'Cancelar',
//                     }}>
//                 {renderCameraOverlay()}
//                 </RNCamera>

//                 {/* Top Controls */}
//                 <View style={styles.topControls}>
//                     <TouchableOpacity
//                         style={styles.controlButton}
//                         onPress={() => navigation.goBack()}>
//                         <Text style={styles.controlButtonText}>✕</Text>
//                     </TouchableOpacity>

//                     <View style={styles.titleContainer}>
//                         <Text style={styles.stepTitle}>{stepTitles[currentStep]}</Text>
//                     </View>

//                     <TouchableOpacity
//                         style={styles.controlButton}
//                         onPress={toggleFlash}>
//                         <Text style={styles.controlButtonText}>
//                             {flashMode === RNCamera.Constants.FlashMode.off ? '🔦' : '💡'}
//                         </Text>
//                     </TouchableOpacity>
//                 </View>

//                 {/* Instructions */}
//                 <View style={styles.instructionsContainer}>
//                     <Text style={styles.instructionsText}>
//                         {stepInstructions[currentStep]}
//                     </Text>
//                 </View>

//                 {/* Bottom Controls */}
//                 <View style={styles.bottomControls}>
//                     {currentStep !== 'qr' && (
//                         <>
//                             <TouchableOpacity
//                                 style={styles.secondaryButton}
//                                 onPress={handleRetake}
//                                 disabled={currentStep === 'front'}
//                             >
//                                 <Text style={[
//                                     styles.secondaryButtonText,
//                                     currentStep === 'front' && styles.disabledText
//                                 ]}>
//                                     Refazer
//                                 </Text>
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={[
//                                     styles.captureButton,
//                                     isCapturing && styles.capturingButton
//                                 ]}
//                                 onPress={handleCapture}
//                                 disabled={isCapturing}
//                             >
//                                 <View style={styles.captureButtonInner} />
//                             </TouchableOpacity>

//                             <TouchableOpacity
//                                 style={styles.secondaryButton}
//                                 onPress={toggleAutoCapture}
//                             >
//                                 <Text style={styles.secondaryButtonText}>
//                                     {autoCapture ? '🔄 Auto' : '📷 Manual'}
//                                 </Text>
//                             </TouchableOpacity>
//                         </>
//                     )}

//                     {currentStep === 'qr' && qrData && (
//                         <TouchableOpacity
//                             style={styles.continueButton}
//                             onPress={handleContinue}
//                         >
//                             <Text style={styles.continueButtonText}>
//                                 Continuar
//                             </Text>
//                         </TouchableOpacity>
//                     )}
//                 </View>

//                 {/* Auto-capture indicator */}
//                 {currentStep !== 'qr' && autoCapture && (
//                     <View style={styles.autoIndicator}>
//                         <Text style={styles.autoIndicatorText}>
//                             💡 Iluminação adequada
//                         </Text>
//                         <Text style={styles.autoIndicatorSubtext}>
//                             Posicionamento adequado
//                         </Text>
//                     </View>
//                 )}
//             </View>
//         </SafeAreaView>
//     );
// }
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Dimensions,
    StatusBar,
    Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { Colors } from '../src/constants/Colors';
import { FontSize, Spacing, BorderRadius } from '../src/constants/Dimensions';
import { GlobalStyles } from '../src/styles/GlobalStyles';
import { Link, router, useLocalSearchParams } from 'expo-router';
import StepIndicator from '../src/components/StepIndicator';
import DocumentFrame from '../src/components/DocumentFrame';
import QRCodeScanner from '../src/components/QRCodeScanner';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function DocumentCapture() {
    const { user } = useLocalSearchParams();
    const userData = JSON.parse(user);


    const [currentStep, setCurrentStep] = useState('front');
    const [capturedImages, setCapturedImages] = useState({ front: null, back: null });
    const [qrData, setQrData] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [flash, setFlash] = useState('off');
    const [autoCapture, setAutoCapture] = useState(true);

    const cameraRef = useRef(null);
    const devices = useCameraDevices();
    const device = devices[0];

    const stepTitles = {
        front: 'Capturar a Frente do BI',
        back: 'Capturar o Verso do BI',
        qr: 'Detectar QR Code',
    };

    const stepInstructions = {
        front: 'Aproxime o B.I dentro do quadro para que a foto do B.I tenha uma tamanho visível.',
        back: 'Aponte a câmera para o QR do verso do B.I. e aproxime lentamente até o código QR preencher a área indicada.',
        qr: 'Aguarde até que o QR seja detectado automaticamente.',
    };

    useEffect(() => {
        StatusBar.setBarStyle('light-content');
        StatusBar.setBackgroundColor(Colors.black);

        const requestPermissions = async () => {
            const cameraStatus = await Camera.requestCameraPermission();
            if (cameraStatus !== 'granted') {
                Alert.alert('Permissão', 'A permissão da câmera é necessária.');
            }
        };

        requestPermissions();

        return () => {
            StatusBar.setBarStyle('dark-content');
            StatusBar.setBackgroundColor(Colors.white);
        };
    }, []);

    const handleCapture = async () => {
        if (!cameraRef.current) return;

        try {
            setIsCapturing(true);

            const photo = await cameraRef.current.takePhoto({
                flash: flash === 'on' ? 'on' : 'off',
            });

            // Get path to the image
            const imagePath = photo.path;

            // Save image to correct step
            if (currentStep === 'front') {
                setCapturedImages(prev => ({ ...prev, front: imagePath }));
                setCurrentStep('back');
            } else if (currentStep === 'back') {
                setCapturedImages(prev => ({ ...prev, back: imagePath }));
                setCurrentStep('qr');
            }

        } catch (error) {
            console.error('Capture error:', error);
            Alert.alert('Erro', 'Falha ao capturar imagem.');
        } finally {
            setIsCapturing(false);
        }
    };

    const handleQRCodeDetected = (qrData) => {
        if (qrData && qrData.data) {
            setQrData(qrData.data);
            setTimeout(() => {
                handleContinue();
            }, 1000);
        }
    };

    const handleContinue = () => {
        const documentData = {
            ...userData,
            documents: {
                front: capturedImages.front,
                back: capturedImages.back,
                qrData: qrData,
            },
        };
        router.navigate({ pathname: '/FacialRecognition', params: { userData: JSON.stringify(documentData) } });
    };

    const handleRetake = () => {
        if (currentStep === 'back') {
            setCurrentStep('front');
            setCapturedImages({ front: null, back: null });
        } else if (currentStep === 'qr') {
            setCurrentStep('back');
            setCapturedImages(prev => ({ ...prev, back: null }));
        }
        setQrData(null);
    };

    const toggleFlash = () => {
        setFlash(prev => (prev === 'off' ? 'on' : 'off'));
    };

    const toggleAutoCapture = () => {
        setAutoCapture(!autoCapture);
    };

    const renderCameraOverlay = () => {
        if (currentStep === 'qr') {
            return <QRCodeScanner onQRCodeDetected={handleQRCodeDetected} isActive />;
        }

        return (
            <DocumentFrame
                type={currentStep}
                onAutoCapture={autoCapture ? handleCapture : null}
                isCapturing={isCapturing}
            />
        );
    };

    const getStepNumber = () => {
        switch (currentStep) {
            case 'front': return 2;
            case 'back': return 3;
            case 'qr': return 3;
            default: return 2;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.stepIndicatorContainer}>
                <StepIndicator currentStep={getStepNumber()} totalSteps={7} />
            </View>

            <View style={styles.cameraContainer}>
                {device && (
                    <Camera
                        ref={cameraRef}
                        style={styles.camera}
                        device={device}
                        isActive={true}
                        photo={true}
                        video={false}
                        torch={flash}
                    />
                )}
                {device && renderCameraOverlay()}

                <View style={styles.topControls}>
                    <TouchableOpacity style={styles.controlButton} onPress={() => router.back()}>
                        <Text style={styles.controlButtonText}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.titleContainer}>
                        <Text style={styles.stepTitle}>{stepTitles[currentStep]}</Text>
                    </View>

                    <TouchableOpacity style={styles.controlButton} onPress={toggleFlash}>
                        <Text style={styles.controlButtonText}>
                            {flash === 'off' ? '🔦' : '💡'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.instructionsContainer}>
                    <Text style={styles.instructionsText}>{stepInstructions[currentStep]}</Text>
                </View>

                <View style={styles.bottomControls}>
                    {currentStep !== 'qr' && (
                        <>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={handleRetake}
                                disabled={currentStep === 'front'}
                            >
                                <Text style={[
                                    styles.secondaryButtonText,
                                    currentStep === 'front' && styles.disabledText
                                ]}>
                                    Refazer
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.captureButton, isCapturing && styles.capturingButton]}
                                onPress={handleCapture}
                                disabled={isCapturing}
                            >
                                <View style={styles.captureButtonInner} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.secondaryButton} onPress={toggleAutoCapture}>
                                <Text style={styles.secondaryButtonText}>
                                    {autoCapture ? '🔄 Auto' : '📷 Manual'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {currentStep === 'qr' && (
                        <>
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => {
                                    router.push({
                                        pathname: '/facialrecognition', params: {
                                            user: JSON.stringify({
                                                ...userData,
                                                documents: {
                                                    front: capturedImages.front,
                                                    back: capturedImages.back,
                                                    qrData: qrData,
                                                }
                                            })
                                        }
                                    })
                                }}
                                disabled={currentStep === 'front'}
                            >
                                <Text >Next</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {currentStep === 'qr' && qrData && (
                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <Text style={styles.continueButtonText}>Continuar</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {currentStep !== 'qr' && autoCapture && (
                    <View style={styles.autoIndicator}>
                        <Text style={styles.autoIndicatorText}>💡 Iluminação adequada</Text>
                        <Text style={styles.autoIndicatorSubtext}>Posicionamento adequado</Text>
                    </View>
                )}
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },

    stepIndicatorContainer: {
        backgroundColor: Colors.white,
        zIndex: 1,
    },
    cameraContainer: {
        flex: 1,
        position: 'relative',
        zIndex: 0,
    },

    camera: {
        flex: 1,
    },

    topControls: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    controlButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    controlButtonText: {
        fontSize: 20,
        color: Colors.white,
    },

    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },

    stepTitle: {
        fontSize: FontSize.lg,
        fontWeight: '600',
        color: Colors.white,
        textAlign: 'center',
    },

    instructionsContainer: {
        position: 'absolute',
        bottom: 140,
        left: Spacing.md,
        right: Spacing.md,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: Spacing.md,
        borderRadius: BorderRadius.sm,
    },

    instructionsText: {
        fontSize: FontSize.sm,
        color: Colors.white,
        textAlign: 'center',
        lineHeight: FontSize.sm * 1.4,
    },

    bottomControls: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.xl,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: Colors.secondary,
    },

    capturingButton: {
        backgroundColor: Colors.secondary,
    },

    captureButtonInner: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.secondary,
    },

    secondaryButton: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },

    secondaryButtonText: {
        fontSize: FontSize.sm,
        color: Colors.white,
        fontWeight: '500',
    },

    disabledText: {
        opacity: 0.5,
    },

    continueButton: {
        backgroundColor: Colors.success,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.md,
    },

    continueButtonText: {
        fontSize: FontSize.md,
        color: Colors.white,
        fontWeight: '600',
    },

    autoIndicator: {
        position: 'absolute',
        top: 100,
        left: Spacing.md,
        backgroundColor: 'rgba(56, 161, 105, 0.9)',
        padding: Spacing.sm,
        borderRadius: BorderRadius.sm,
    },

    autoIndicatorText: {
        fontSize: FontSize.xs,
        color: Colors.white,
        fontWeight: '500',
    },

    autoIndicatorSubtext: {
        fontSize: FontSize.xs,
        color: Colors.white,
        opacity: 0.8,
    },
});
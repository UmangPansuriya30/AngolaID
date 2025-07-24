import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Animated,
    StatusBar,
    Platform,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Colors } from '../src/constants/Colors';
import { FontSize, Spacing, wp, hp } from '../src/constants/Dimensions';
import { GlobalStyles } from '../src/styles/GlobalStyles';
import StepIndicator from '../src/components/StepIndicator';
import { useLocalSearchParams } from 'expo-router';



const voicecapture = () => {
    // const { user } = useLocalSearchParams();
    // const userData = JSON.parse(user) || {};
    const userData = {};
    const [isRecording, setIsRecording] = useState(false);
    const [recordTime, setRecordTime] = useState('00:00');
    const [isPlaying, setIsPlaying] = useState(false);
    const [playTime, setPlayTime] = useState('00:00');
    const [audioPath, setAudioPath] = useState('');
    const [hasPermission, setHasPermission] = useState(false);
    const [currentPhrase, setCurrentPhrase] = useState(0);
    const [recordedPhrases, setRecordedPhrases] = useState([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    console.log('userData', userData);
    // const AudioRecorderPlayer = AudioRecorderPlayer;
    // console.log('AudioRecorderPlayer', AudioRecorderPlayer);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const waveAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const phrases = [
        {
            id: 1,
            text: "Meu nome é [Nome Completo] e estou validando minha identidade",
            placeholder: "Substitua [Nome Completo] pelo seu nome real",
            duration: 8,
        },
        {
            id: 2,
            text: "Hoje é dia [Data] e estou em [Local]",
            placeholder: "Diga a data atual e sua localização",
            duration: 6,
        },
        {
            id: 3,
            text: "Este é meu processo de verificação de identidade para AngolaID",
            placeholder: "Frase de confirmação do processo",
            duration: 7,
        },
    ];

    useEffect(() => {
        StatusBar.setBarStyle('light-content');
        checkMicrophonePermission();
        startAnimations();

        return () => {
            StatusBar.setBarStyle('default');
            AudioRecorderPlayer.stopRecorder();
            AudioRecorderPlayer.stopPlayer();
        };
    }, []);

    const startAnimations = () => {
        // Pulse animation for record button
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

        // Wave animation
        const waveAnimation = Animated.loop(
            Animated.timing(waveAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            })
        );

        pulseAnimation.start();
        waveAnimation.start();
    };

    const checkMicrophonePermission = async () => {
        try {
            const permission = Platform.OS === 'ios'
                ? PERMISSIONS.IOS.MICROPHONE
                : PERMISSIONS.ANDROID.RECORD_AUDIO;

            const result = await check(permission);

            if (result === RESULTS.GRANTED) {
                setHasPermission(true);
            } else {
                const requestResult = await request(permission);
                setHasPermission(requestResult === RESULTS.GRANTED);
            }
        } catch (error) {
            console.error('Permission error:', error);
            setHasPermission(false);
        }
    };

    const startRecording = async () => {
        if (!hasPermission) {
            Alert.alert(
                'Permissão Necessária',
                'É necessário permitir o acesso ao microfone para gravar sua voz.',
                [{ text: 'OK', onPress: checkMicrophonePermission }]
            );
            return;
        }

        try {
            const path = Platform.select({
                ios: `voice_${Date.now()}.m4a`,
                android: `${AudioRecorderPlayer.mmssss(Date.now())}.mp4`,
            });
            console.log('Recording path:', path);
            const result = await AudioRecorderPlayer.startRecorder(path);
            console.log('Recording path2:', path);
            setAudioPath(result);
            setIsRecording(true);

            // Start recording animation
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 1.2,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();

            AudioRecorderPlayer.addRecordBackListener((e) => {
                setRecordTime(AudioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
            });

            // Auto-stop after phrase duration
            const maxDuration = phrases[currentPhrase].duration * 1000;
            setTimeout(() => {
                if (isRecording) {
                    stopRecording();
                }
            }, maxDuration);

        } catch (error) {
            console.error('Recording error:', error);
            Alert.alert('Erro', 'Erro ao iniciar gravação. Tente novamente.');
        }
    };

    const stopRecording = async () => {
        try {
            const result = await AudioRecorderPlayer.stopRecorder();
            setIsRecording(false);
            setRecordTime('00:00');

            // Stop animation
            scaleAnim.setValue(1);

            // Analyze voice
            setIsAnalyzing(true);
            const analysisResult = await analyzeVoice(result);
            setIsAnalyzing(false);

            if (analysisResult.isValid) {
                const newRecordedPhrase = {
                    id: phrases[currentPhrase].id,
                    text: phrases[currentPhrase].text,
                    audioPath: result,
                    duration: analysisResult.duration,
                    quality: analysisResult.quality,
                    timestamp: Date.now(),
                };

                setRecordedPhrases([...recordedPhrases, newRecordedPhrase]);

                if (currentPhrase < phrases.length - 1) {
                    // Move to next phrase
                    setCurrentPhrase(currentPhrase + 1);
                } else {
                    // All phrases completed
                    completeVoiceCapture();
                }
            } else {
                Alert.alert(
                    'Gravação Inválida',
                    analysisResult.message || 'A gravação não atende aos critérios de qualidade. Tente novamente.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Stop recording error:', error);
            Alert.alert('Erro', 'Erro ao parar gravação.');
        }
    };

    const analyzeVoice = async (audioPath) => {
        // Simulate voice analysis
        return new Promise((resolve) => {
            setTimeout(() => {
                const isValid = Math.random() > 0.2; // 80% success rate
                const duration = Math.floor(Math.random() * 5) + 3; // 3-8 seconds
                const quality = Math.floor(Math.random() * 30) + 70; // 70-100% quality

                resolve({
                    isValid,
                    duration,
                    quality,
                    message: isValid ? 'Gravação válida' : 'Qualidade de áudio insuficiente',
                });
            }, 2000);
        });
    };

    const playRecording = async () => {
        if (!audioPath) return;

        try {
            setIsPlaying(true);
            await AudioRecorderPlayer.startPlayer(audioPath);

            AudioRecorderPlayer.addPlayBackListener((e) => {
                setPlayTime(AudioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));

                if (e.currentPosition === e.duration) {
                    setIsPlaying(false);
                    setPlayTime('00:00');
                }
            });
        } catch (error) {
            console.error('Play error:', error);
            setIsPlaying(false);
        }
    };

    const stopPlaying = async () => {
        try {
            await AudioRecorderPlayer.stopPlayer();
            setIsPlaying(false);
            setPlayTime('00:00');
        } catch (error) {
            console.error('Stop playing error:', error);
        }
    };

    const completeVoiceCapture = () => {
        Alert.alert(
            'Captura de Voz Concluída',
            'Todas as frases foram gravadas com sucesso!',
            [
                {
                    text: 'Continuar',
                    onPress: () => router.push({
                        pathname: '/Signature', params: {
                            ...userData,
                            voiceData: recordedPhrases,
                        }
                    }),
                },
            ]
        );
    };

    const skipVoiceCapture = () => {
        Alert.alert(
            'Pular Captura de Voz',
            'A captura de voz é opcional, mas recomendada para maior segurança. Deseja continuar sem gravar?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Pular',
                    onPress: () => router.push({
                        pathname: 'Signature', params: {
                            ...userData,
                            voiceData: null,
                        }
                    }),
                },
            ]
        );
    };

    const getCurrentPhrase = () => phrases[currentPhrase];
    const progress = ((currentPhrase + 1) / phrases.length) * 100;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.dark} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Icon name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Captura de Voz</Text>
                <TouchableOpacity
                    style={styles.skipButton}
                    onPress={skipVoiceCapture}
                >
                    <Text style={styles.skipText}>Pular</Text>
                </TouchableOpacity>
            </View>

            {/* Step Indicator */}
            <StepIndicator currentStep={5} totalSteps={7} />

            {/* Content */}
            <View style={styles.content}>
                {/* Progress */}
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        Frase {currentPhrase + 1} de {phrases.length}
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>

                {/* Phrase */}
                <View style={styles.phraseContainer}>
                    <Text style={styles.phraseTitle}>Leia a frase em voz alta:</Text>
                    <Text style={styles.phraseText}>{getCurrentPhrase().text}</Text>
                    <Text style={styles.phraseHint}>{getCurrentPhrase().placeholder}</Text>
                </View>

                {/* Voice Visualizer */}
                <View style={styles.visualizerContainer}>
                    <Animated.View
                        style={[
                            styles.recordButton,
                            {
                                transform: [
                                    { scale: isRecording ? scaleAnim : pulseAnim },
                                ],
                                backgroundColor: isRecording ? Colors.error : Colors.primary,
                            },
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.recordButtonInner}
                            onPress={isRecording ? stopRecording : startRecording}
                            disabled={isAnalyzing}
                        >
                            <Icon
                                name={isRecording ? 'stop' : 'mic'}
                                size={40}
                                color={Colors.white}
                            />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Wave animation */}
                    {isRecording && (
                        <View style={styles.waveContainer}>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Animated.View
                                    key={index}
                                    style={[
                                        styles.wave,
                                        {
                                            opacity: waveAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0.3, 1],
                                            }),
                                            transform: [
                                                {
                                                    scaleY: waveAnim.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: [0.5, 2],
                                                    }),
                                                },
                                            ],
                                        },
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Controls */}
                <View style={styles.controlsContainer}>
                    <Text style={styles.timerText}>
                        {isRecording ? `Gravando: ${recordTime}` :
                            isPlaying ? `Reproduzindo: ${playTime}` :
                                isAnalyzing ? 'Analisando...' : 'Toque para gravar'}
                    </Text>

                    {audioPath && !isRecording && (
                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={isPlaying ? stopPlaying : playRecording}
                        >
                            <Icon
                                name={isPlaying ? 'pause' : 'play-arrow'}
                                size={24}
                                color={Colors.primary}
                            />
                            <Text style={styles.playButtonText}>
                                {isPlaying ? 'Pausar' : 'Reproduzir'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Completed phrases */}
                {recordedPhrases.length > 0 && (
                    <View style={styles.completedContainer}>
                        <Text style={styles.completedTitle}>Frases Gravadas:</Text>
                        {recordedPhrases.map((phrase, index) => (
                            <View key={phrase.id} style={styles.completedItem}>
                                <Icon name="check-circle" size={20} color={Colors.success} />
                                <Text style={styles.completedText}>
                                    Frase {index + 1} - {phrase.duration}s
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Instruções:</Text>
                <Text style={styles.instructionsText}>
                    • Fale de forma clara e natural{"\n"}
                    • Mantenha o dispositivo próximo à boca{"\n"}
                    • Evite ruídos de fundo{"\n"}
                    • A gravação será automática por {getCurrentPhrase().duration} segundos
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingTop: hp(6),
        paddingBottom: Spacing.md,
        backgroundColor: Colors.dark,
    },

    backButton: {
        padding: Spacing.sm,
    },

    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: '600',
        color: Colors.white,
    },

    skipButton: {
        padding: Spacing.sm,
    },

    skipText: {
        fontSize: FontSize.md,
        color: Colors.primary,
        fontWeight: '500',
    },

    content: {
        flex: 1,
        padding: Spacing.md,
    },

    progressContainer: {
        marginBottom: Spacing.lg,
    },

    progressText: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },

    progressBar: {
        height: 6,
        backgroundColor: Colors.lightGray,
        borderRadius: 3,
    },

    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: 3,
    },

    phraseContainer: {
        backgroundColor: Colors.surface,
        padding: Spacing.lg,
        borderRadius: 12,
        marginBottom: Spacing.lg,
    },

    phraseTitle: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },

    phraseText: {
        fontSize: FontSize.lg,
        color: Colors.textPrimary,
        lineHeight: FontSize.lg * 1.4,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },

    phraseHint: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontStyle: 'italic',
        textAlign: 'center',
    },

    visualizerContainer: {
        alignItems: 'center',
        marginVertical: Spacing.xl,
    },

    recordButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: Colors.primary,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },

    recordButtonInner: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },

    waveContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.md,
    },

    wave: {
        width: 4,
        height: 20,
        backgroundColor: Colors.primary,
        marginHorizontal: 2,
        borderRadius: 2,
    },

    controlsContainer: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },

    timerText: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },

    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
    },

    playButtonText: {
        fontSize: FontSize.md,
        color: Colors.primary,
        marginLeft: Spacing.sm,
        fontWeight: '500',
    },

    completedContainer: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: 8,
        marginBottom: Spacing.md,
    },

    completedTitle: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },

    completedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },

    completedText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginLeft: Spacing.sm,
    },

    instructionsContainer: {
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        margin: Spacing.md,
        borderRadius: 8,
    },

    instructionsTitle: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },

    instructionsText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: FontSize.sm * 1.4,
    },
});

export default voicecapture;
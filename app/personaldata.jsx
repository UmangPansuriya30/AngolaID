import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import  RNPickerSelect  from 'react-native-picker-select';
import { Colors } from '../src/constants/Colors';
import { FontSize, Spacing, BorderRadius, wp, hp } from '../src/constants/Dimensions';
import { GlobalStyles } from '../src/styles/GlobalStyles';
import StepIndicator from '../src/components/StepIndicator';
import RecaptchaComponent from '../src/components/RecaptchaComponent';
import { router, useLocalSearchParams } from 'expo-router';

export default function PersonalDataScreen() {
    const { validationType } = useLocalSearchParams();
    const [phoneNumber, setPhoneNumber] = useState('+244');
    const [profession, setProfession] = useState('');
    const [isRecaptchaVerified, setIsRecaptchaVerified] = useState(false);
    const [errors, setErrors] = useState({});
    const phoneInputRef = useRef(null);

    const professions = [
        { label: 'Selecione a sua profissão', value: '' },
        { label: 'Advogado(a)', value: 'lawyer' },
        { label: 'Médico(a)', value: 'doctor' },
        { label: 'Engenheiro(a)', value: 'engineer' },
        { label: 'Professor(a)', value: 'teacher' },
        { label: 'Empresário(a)', value: 'entrepreneur' },
        { label: 'Funcionário Público', value: 'public_servant' },
        { label: 'Estudante', value: 'student' },
        { label: 'Comerciante', value: 'trader' },
        { label: 'Técnico(a)', value: 'technician' },
        { label: 'Artista', value: 'artist' },
        { label: 'Jornalista', value: 'journalist' },
        { label: 'Agricultor(a)', value: 'farmer' },
        { label: 'Motorista', value: 'driver' },
        { label: 'Enfermeiro(a)', value: 'nurse' },
        { label: 'Arquiteto(a)', value: 'architect' },
        { label: 'Contador(a)', value: 'accountant' },
        { label: 'Policial', value: 'police' },
        { label: 'Militar', value: 'military' },
        { label: 'Outro', value: 'other' },
    ];

    const validateForm = () => {
        const newErrors = {};

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 9) {
            newErrors.phoneNumber = 'Número de telefone inválido';
        } else if (!phoneNumber.startsWith('+244')) {
            newErrors.phoneNumber = 'Número deve começar com +244';
        }

        // Validate profession
        if (!profession) {
            newErrors.profession = 'Por favor, selecione uma profissão';
        }

        // Validate reCAPTCHA
        if (!isRecaptchaVerified) {
            newErrors.recaptcha = 'Por favor, complete a verificação reCAPTCHA';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (validateForm()) {
            const userData = {
                validationType,
                phoneNumber,
                profession,
                isRecaptchaVerified,
            };
            
            router.push({ pathname: '/documentcapture', params: { userData } });
        } else {
            Alert.alert(
                'Dados Incompletos',
                'Por favor, preencha todos os campos obrigatórios.',
                [{ text: 'OK' }]
            );
        }
    };

    const handleSkipPhoneVerification = () => {
        Alert.alert(
            'Pular Verificação',
            'Tem certeza que deseja pular a verificação de telefone? Isso pode afetar a segurança da sua conta.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Pular',
                    style: 'destructive',
                    onPress: () => {
                        const userData = {
                            validationType,
                            phoneNumber: null,
                            profession,
                            isRecaptchaVerified: true, // Skip recaptcha for demo
                        };
                        router.push({pathname:'/documentcapture', params: { userData }});
                    }
                },
            ]
        );
    };

    const handleRecaptchaVerify = (verified) => {
        setIsRecaptchaVerified(verified);
        if (verified) {
            setErrors(prev => ({ ...prev, recaptcha: null }));
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                {/* Step Indicator */}
                <StepIndicator currentStep={1} totalSteps={7} />

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <Text style={styles.logoIcon}>📱</Text>
                            </View>
                            <Text style={styles.title}>Informações Pessoais</Text>
                            <Text style={styles.subtitle}>
                                Preencha os seus dados para continuar com a verificação
                            </Text>
                        </View>

                        {/* Beta Warning */}
                        <View style={styles.warningContainer}>
                            <Text style={styles.warningIcon}>⚠️</Text>
                            <Text style={styles.warningText}>
                                Esta é uma versão BETA para testes e recolha de feedback.{"\n"}
                                Nenhuma informação é guardada nos servidores. Todos os dados{"\n"}
                                (incluindo QR do B.I.) ficam apenas no seu dispositivo.
                            </Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            {/* Phone Number Input */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Telefone</Text>
                                <View style={styles.phoneInputContainer}>
                                    <View style={styles.countryCode}>
                                        <Text style={styles.flagEmoji}>🇦🇴</Text>
                                        <Text style={styles.countryCodeText}>+244</Text>
                                    </View>
                                    <TextInput
                                        ref={phoneInputRef}
                                        style={[
                                            styles.phoneInput,
                                            errors.phoneNumber && styles.inputError,
                                        ]}
                                        value={phoneNumber.replace('+244', '')}
                                        onChangeText={(text) => {
                                            // Remove any non-numeric characters
                                            const numericText = text.replace(/[^0-9]/g, '');
                                            setPhoneNumber('+244' + numericText);
                                            if (errors.phoneNumber) {
                                                setErrors(prev => ({ ...prev, phoneNumber: null }));
                                            }
                                        }}
                                        placeholder="Número de telefone"
                                        placeholderTextColor={Colors.textTertiary}
                                        keyboardType="phone-pad"
                                        maxLength={9}
                                    />
                                </View>
                                {errors.phoneNumber && (
                                    <Text style={styles.errorText}>{errors.phoneNumber}</Text>
                                )}
                            </View>

                            {/* Profession Picker */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Profissão</Text>
                                <View style={[
                                    styles.pickerContainer,
                                    errors.profession && styles.inputError,
                                ]}>
                                    <RNPickerSelect
                                        onValueChange={(value) => {
                                            setProfession(value);
                                            if (errors.profession) {
                                                setErrors(prev => ({ ...prev, profession: null }));
                                            }
                                        }}
                                        items={professions.slice(1)} // Remove the placeholder
                                        style={pickerSelectStyles}
                                        value={profession}
                                        placeholder={professions[0]}
                                        useNativeAndroidPickerStyle={false}
                                    />
                                    <Text style={styles.pickerArrow}>▼</Text>
                                </View>
                                {errors.profession && (
                                    <Text style={styles.errorText}>{errors.profession}</Text>
                                )}
                            </View>

                            {/* reCAPTCHA */}
                            <View style={styles.inputContainer}>
                                <RecaptchaComponent
                                    onVerify={handleRecaptchaVerify}
                                    error={errors.recaptcha}
                                />
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.continueButton,
                                    (!phoneNumber || !profession || !isRecaptchaVerified) && styles.disabledButton,
                                ]}
                                onPress={handleContinue}
                                disabled={!phoneNumber || !profession || !isRecaptchaVerified}
                                activeOpacity={0.8}>
                                <Text style={[
                                    styles.continueButtonText,
                                    (!phoneNumber || !profession || !isRecaptchaVerified) && styles.disabledButtonText,
                                ]}>
                                    ENTRAR COM NO. DE TELEFONE
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.skipButton}
                                onPress={handleSkipPhoneVerification}
                                activeOpacity={0.7}>
                                <Text style={styles.skipButtonText}>
                                    PULAR VERIFICAÇÃO DE TELEFONE
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },

    container: {
        padding: Spacing.xl,
    },

    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },

    logoContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },

    logoIcon: {
        fontSize: 28,
    },

    title: {
        fontSize: FontSize.xxl,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },

    subtitle: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: FontSize.md * 1.4,
    },

    warningContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.warningLight,
        padding: Spacing.md,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.xl,
        alignItems: 'flex-start',
    },

    warningIcon: {
        fontSize: 20,
        marginRight: Spacing.sm,
        marginTop: 2,
    },

    warningText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.warning,
        lineHeight: FontSize.sm * 1.3,
    },

    formContainer: {
        marginBottom: Spacing.xl,
    },

    inputContainer: {
        marginBottom: Spacing.lg,
    },

    inputLabel: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },

    phoneInputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: BorderRadius.sm,
        backgroundColor: Colors.inputBackground,
    },

    countryCode: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        borderRightWidth: 1,
        borderRightColor: Colors.inputBorder,
        backgroundColor: Colors.backgroundSecondary,
    },

    flagEmoji: {
        fontSize: 20,
        marginRight: Spacing.xs,
    },

    countryCodeText: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textPrimary,
    },

    phoneInput: {
        flex: 1,
        height: 48,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
    },

    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.inputBorder,
        borderRadius: BorderRadius.sm,
        backgroundColor: Colors.inputBackground,
        paddingRight: Spacing.md,
    },

    pickerArrow: {
        fontSize: 12,
        color: Colors.textTertiary,
    },

    inputError: {
        borderColor: Colors.inputError,
    },

    errorText: {
        fontSize: FontSize.xs,
        color: Colors.error,
        marginTop: Spacing.xs,
    },

    actionContainer: {
        marginTop: Spacing.lg,
    },

    continueButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.sm,
        marginBottom: Spacing.md,
    },

    disabledButton: {
        backgroundColor: Colors.buttonDisabled,
    },

    continueButtonText: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.white,
        textAlign: 'center',
    },

    disabledButtonText: {
        color: Colors.white,
    },

    skipButton: {
        paddingVertical: Spacing.sm,
    },

    skipButtonText: {
        fontSize: FontSize.sm,
        color: Colors.secondary,
        textAlign: 'center',
        fontWeight: '600',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: FontSize.md,
        paddingVertical: 12,
        paddingHorizontal: Spacing.md,
        color: Colors.textPrimary,
        paddingRight: 30,
        height: 48,
    },
    inputAndroid: {
        fontSize: FontSize.md,
        paddingHorizontal: Spacing.md,
        paddingVertical: 8,
        color: Colors.textPrimary,
        paddingRight: 30,
        height: 48,
    },
    placeholder: {
        color: Colors.textTertiary,
    },
});


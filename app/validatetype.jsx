import React from 'react'
import { Link, router } from 'expo-router';
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import { Colors } from '../src/constants/Colors';
import { FontSize, Spacing, BorderRadius, wp, hp } from '../src/constants/Dimensions';

export default function ValidationTypeScreen() {
    const [selectedType, setSelectedType] = useState(null);

    const handleTypeSelection = (type) => {
        setSelectedType(type);
    };

    const handleContinue = () => {
        if (selectedType) {
            router.push({ pathname: '/personaldata', params: { validationType: selectedType } });
        }
    };
    const handleSkipToDashboard = () => {
        router.push('/documentcapture');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

            <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.header}
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>AI</Text>
                        <View style={styles.fingerprintIcon}>
                            <Text style={styles.fingerprintText}>🔒</Text>
                        </View>
                    </View>
                    <Text style={styles.brandName}>ANGOLA ID</Text>
                    <Text style={styles.tagline}>
                        AngolaID – o teu ID digital em menos de 5 minutos
                    </Text>
                </View>
            </LinearGradient>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.selectionContainer}>
                    <Text style={styles.title}>Selecione o Tipo de Validação</Text>
                    <Text style={styles.subtitle}>
                        Selecione se deseja validar como pessoa singular ou empresa.
                    </Text>

                    {/* Individual Validation Option */}
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            selectedType === 'individual' && styles.selectedCard,
                        ]}
                        onPress={() => handleTypeSelection('individual')}
                        activeOpacity={0.8}>
                        <View style={styles.optionContent}>
                            <View style={styles.optionIcon}>
                                <Text style={styles.iconText}>👤</Text>
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={[
                                    styles.optionTitle,
                                    selectedType === 'individual' && styles.selectedText,
                                ]}>
                                    Validação Individual
                                </Text>
                                <Text style={styles.optionDescription}>
                                    Para pessoas singulares que desejam validar a sua identidade pessoal
                                </Text>
                            </View>
                            <View style={[
                                styles.radioButton,
                                selectedType === 'individual' && styles.radioButtonSelected,
                            ]}>
                                {selectedType === 'individual' && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Business Validation Option */}
                    <TouchableOpacity
                        style={[
                            styles.optionCard,
                            selectedType === 'business' && styles.selectedCard,
                        ]}
                        onPress={() => handleTypeSelection('business')}
                        activeOpacity={0.8}>
                        <View style={styles.optionContent}>
                            <View style={styles.optionIcon}>
                                <Text style={styles.iconText}>🏢</Text>
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={[
                                    styles.optionTitle,
                                    selectedType === 'business' && styles.selectedText,
                                ]}>
                                    Validação de Empresa
                                </Text>
                                <Text style={styles.optionDescription}>
                                    Para empresas que necessitam de validação corporativa
                                </Text>
                            </View>
                            <View style={[
                                styles.radioButton,
                                selectedType === 'business' && styles.radioButtonSelected,
                            ]}>
                                {selectedType === 'business' && (
                                    <View style={styles.radioButtonInner} />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Continue Button */}
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            !selectedType && styles.disabledButton,
                        ]}
                        onPress={handleContinue}
                        disabled={!selectedType}
                        activeOpacity={0.8}>
                        <Text style={[
                            styles.continueButtonText,
                            !selectedType && styles.disabledButtonText,
                        ]}>
                            Continuar
                        </Text>
                    </TouchableOpacity>

                    {/* Skip to Dashboard Link */}
                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={handleSkipToDashboard}
                        activeOpacity={0.7}>
                        <Text style={styles.skipButtonText}>
                            Pular para Dashboard
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Desenvolvido com ❤️ por{" "}
                    <Text style={styles.footerLink}>www.techbytech.tech</Text>
                    {" "}🇦🇴 © 2025
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },

    header: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.xl,
        borderBottomLeftRadius: BorderRadius.xl,
        borderBottomRightRadius: BorderRadius.xl,
    },

    logoContainer: {
        alignItems: 'center',
    },

    logoCircle: {
        width: wp(15),
        height: wp(15),
        borderRadius: wp(7.5),
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.sm,
        position: 'relative',
    },

    logoText: {
        fontSize: FontSize.lg,
        fontWeight: '800',
        color: Colors.white,
    },

    fingerprintIcon: {
        position: 'absolute',
        bottom: -3,
        right: -3,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    fingerprintText: {
        fontSize: 10,
    },

    brandName: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.white,
        marginBottom: Spacing.xs,
    },

    tagline: {
        fontSize: FontSize.sm,
        color: Colors.white,
        textAlign: 'center',
        opacity: 0.9,
    },

    content: {
        flex: 1,
    },

    selectionContainer: {
        padding: Spacing.xl,
    },

    title: {
        fontSize: FontSize.xxl,
        fontWeight: '700',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: Spacing.md,
    },

    subtitle: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: FontSize.md * 1.4,
    },

    optionCard: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        padding: Spacing.lg,
        marginBottom: Spacing.md,
        borderWidth: 2,
        borderColor: Colors.border,
        shadowColor: Colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    selectedCard: {
        borderColor: Colors.primary,
        backgroundColor: Colors.primaryLight + '10',
    },

    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    optionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },

    iconText: {
        fontSize: 24,
    },

    optionTextContainer: {
        flex: 1,
    },

    optionTitle: {
        fontSize: FontSize.lg,
        fontWeight: '600',
        color: Colors.textPrimary,
        marginBottom: Spacing.xs,
    },

    selectedText: {
        color: Colors.primary,
    },

    optionDescription: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: FontSize.sm * 1.3,
    },

    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },

    radioButtonSelected: {
        borderColor: Colors.primary,
    },

    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.primary,
    },

    continueButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.xl,
        marginBottom: Spacing.md,
    },

    disabledButton: {
        backgroundColor: Colors.buttonDisabled,
    },

    continueButtonText: {
        fontSize: FontSize.lg,
        fontWeight: '600',
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
        fontSize: FontSize.md,
        color: Colors.primary,
        textAlign: 'center',
        textDecorationLine: 'underline',
    },

    footer: {
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },

    footerText: {
        fontSize: FontSize.xs,
        color: Colors.textTertiary,
        textAlign: 'center',
    },

    footerLink: {
        fontWeight: '600',
        color: Colors.primary,
    },
});
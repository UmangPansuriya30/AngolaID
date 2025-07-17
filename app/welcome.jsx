import { Link } from 'expo-router'
import { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'react-native-linear-gradient';
import { Colors } from '../src/constants/Colors';
import { FontSize, Spacing, BorderRadius, wp, hp } from '../src/constants/Dimensions';

export default function WelcomeScreen() {
    const fadeAnim = new Animated.Value(0);
    const slideAnim = new Animated.Value(50);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleGetStarted = () => {
        router.push('/validatetype');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

            <LinearGradient
                colors={[Colors.primary, Colors.primaryDark]}
                style={styles.gradient}
            >
                <View style={styles.content}>
                    {/* Logo Section */}
                    <Animated.View
                        style={[
                            styles.logoContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}>
                        <View style={styles.logoCircle}>
                            <Text style={styles.logoText}>AI</Text>
                            <View style={styles.fingerprintIcon}>
                                <Text style={styles.fingerprintText}>🔒</Text>
                            </View>
                        </View>

                        <Text style={styles.brandName}>ANGOLA ID</Text>
                        <Text style={styles.tagline}>
                            O teu ID digital em menos de 5 minutos
                        </Text>
                    </Animated.View>

                    {/* Features Section */}
                    <Animated.View
                        style={[
                            styles.featuresContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}>
                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>📱</Text>
                            <Text style={styles.featureText}>100% Digital</Text>
                        </View>

                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>⚡</Text>
                            <Text style={styles.featureText}>Rápido e Seguro</Text>
                        </View>

                        <View style={styles.featureItem}>
                            <Text style={styles.featureIcon}>🇦🇴</Text>
                            <Text style={styles.featureText}>Feito em Angola</Text>
                        </View>
                    </Animated.View>

                    {/* Action Section */}
                    <Animated.View
                        style={[
                            styles.actionContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Link
                            style={styles.getStartedButton}
                            href="/validatetype"
                            // onPress={handleGetStarted}
                            activeOpacity={0.8}>
                            <Text style={styles.getStartedText}>Começar Verificação</Text>
                        </Link>

                        <Text style={styles.disclaimer}>
                            Esta é uma versão BETA para testes e recolha de feedback.{"\n"}
                            Nenhuma informação é guardada nos servidores.
                        </Text>
                    </Animated.View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Desenvolvido com ❤️ por{" "}
                        <Text style={styles.footerLink}>www.techbytech.tech</Text>
                        {" "}🇦🇴 © 2025
                    </Text>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    gradient: {
        flex: 1,
    },

    content: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
        justifyContent: 'space-between',
        paddingTop: hp(8),
        paddingBottom: hp(4),
    },

    logoContainer: {
        alignItems: 'center',
        marginBottom: hp(4),
    },

    logoCircle: {
        width: wp(25),
        height: wp(25),
        borderRadius: wp(12.5),
        backgroundColor: Colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        position: 'relative',
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },

    logoText: {
        fontSize: FontSize.xxxl,
        fontWeight: '800',
        color: Colors.white,
    },

    fingerprintIcon: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    fingerprintText: {
        fontSize: 16,
    },

    brandName: {
        fontSize: FontSize.title,
        fontWeight: '800',
        color: Colors.white,
        marginBottom: Spacing.sm,
        letterSpacing: 2,
    },

    tagline: {
        fontSize: FontSize.lg,
        color: Colors.white,
        textAlign: 'center',
        opacity: 0.9,
        lineHeight: FontSize.lg * 1.3,
    },

    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: hp(4),
    },

    featureItem: {
        alignItems: 'center',
        flex: 1,
    },

    featureIcon: {
        fontSize: 32,
        marginBottom: Spacing.sm,
    },

    featureText: {
        fontSize: FontSize.sm,
        color: Colors.white,
        textAlign: 'center',
        fontWeight: '500',
    },

    actionContainer: {
        alignItems: 'center',
    },

    getStartedButton: {
        backgroundColor: Colors.secondary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xxl,
        borderRadius: BorderRadius.xl,
        marginBottom: Spacing.xl,
        shadowColor: Colors.black,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        minWidth: wp(70),
    },

    getStartedText: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.white,
        textAlign: 'center',
    },

    disclaimer: {
        fontSize: FontSize.xs,
        color: Colors.white,
        textAlign: 'center',
        opacity: 0.8,
        lineHeight: FontSize.xs * 1.4,
        paddingHorizontal: Spacing.md,
    },

    footer: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
        alignItems: 'center',
    },

    footerText: {
        fontSize: FontSize.xs,
        color: Colors.white,
        textAlign: 'center',
        opacity: 0.7,
    },

    footerLink: {
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});
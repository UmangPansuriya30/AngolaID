import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function helloWorld() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello World</Text>
            <Link style={styles.link} href="/welcome">Go to Welcome</Link>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255,5,255,1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        fontSize: 50,
    },
    link: {
        color: 'blue',
        fontSize: 25,
        marginTop: 20,
    },
});
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { StatusBar, StyleSheet } from 'react-native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import WelcomeScreen from "./src/screens/WelcomeScreen"

export default function Index() {
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

// const Stack = createStackNavigator();
// const App = () => {
//     return (
//         <SafeAreaProvider>
//             <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
//             <NavigationContainer>
//                 <Stack.Navigator
//                     initialRouteName="Welcome"
//                     screenOptions={{
//                         headerStyle: {
//                             backgroundColor: '#FFFFFF',
//                             elevation: 0,
//                             shadowOpacity: 0,
//                             borderBottomWidth: 0,
//                         },
//                         headerTintColor: '#333333',
//                         headerTitleStyle: {
//                             fontWeight: '600',
//                             fontSize: 18,
//                         },
//                         headerBackTitleVisible: false,
//                         gestureEnabled: true,
//                     }}>
//                     <Stack.Screen
//                         name="Welcome"
//                         component={WelcomeScreen}
//                         options={{ headerShown: false }}
//                     />
//                 </Stack.Navigator>
//             </NavigationContainer>
//         </SafeAreaProvider>
//     )
// }

// export default App
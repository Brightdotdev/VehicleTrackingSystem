import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import Register from './screens/register';
import RegisterGoogle from './screens/registerGoogle';
import RegisterLocally1 from './screens/registerLocally1';
import RegisterLocally2 from './screens/registerLocally2';
import Screen1 from './screens/screen1'; 
import DispatchRecord from './screens/dispatchRecord'; 
import ActiveDispatch from './screens/activeDispatch'; 
import PendingDispatch from './screens/pendingDispatch';
import CompletedDispatch from './screens/completedDispatch';
import Profile from './screens/profile';
import notification from './screens/notification';


const Stack = createNativeStackNavigator();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  const [fontsLoaded] = useFonts({
    Inter: require('./assets/fonts/Inter-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="dispatchRecord" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="register" component={Register} />
          <Stack.Screen name="registerGoogle" component={RegisterGoogle} />
          <Stack.Screen name="registerLocally1" component={RegisterLocally1} />
          <Stack.Screen name="registerLocally2" component={RegisterLocally2} />
          <Stack.Screen name="screen1" component={Screen1} />
          <Stack.Screen name="dispatchRecord" component={DispatchRecord} />
          <Stack.Screen name="activeDispatch" component={ActiveDispatch} />
          <Stack.Screen name="pendingDispatch" component={PendingDispatch} />
          <Stack.Screen name="completedDispatch" component={CompletedDispatch} />
          <Stack.Screen name="profile" component={Profile} />
          <Stack.Screen name="notification" component={notification} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

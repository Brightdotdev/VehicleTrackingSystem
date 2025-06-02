import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import "./global.css"
import { ThemeProvider } from './contexts/ThemeProvider'
import { useFonts } from "expo-font";
import { NavigationContainer } from '@react-navigation/native';
import ActiveDispatch from './screens/ActiveDispatch';
import CompletedDispatch from './screens/CompletedDispatch';
import DispatchRecord from './screens/DispatchRecord';
import PendingDispatch from './screens/PendingDispatch';
import Register from './screens/Register';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const App = () => {

    const [fontsLoaded] = useFonts({
    "Futura Heavy": require("./assets/fonts/Futura-Heavy-font.ttf"),
    "Futura Medium BT": require("./assets/fonts/futura medium bt.ttf"),
    "Roboto": require("./assets/fonts/Roboto-VariableFont_wdth,wght.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }


  return (

<ThemeProvider>

    <View>
      <Text className='text-4xl text-red-800' >App</Text>
    </View>


 <SafeAreaView>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="dispatchRecord" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="register" component={Register} />
          
          <Stack.Screen name="dispatchRecord" component={DispatchRecord} />
          <Stack.Screen name="activeDispatch" component={ActiveDispatch} />
          <Stack.Screen name="pendingDispatch" component={PendingDispatch} />
          <Stack.Screen name="completedDispatch" component={CompletedDispatch} />
          

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>

    </ThemeProvider>
  )
}

export default App





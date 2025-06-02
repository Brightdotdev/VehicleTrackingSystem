import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import Register from "./screens/Register";
import RegisterGoogle from "./screens/RegisterGoogle";
import RegisterLocally1 from "./screens/RegisterLocally1";
import RegisterLocally2 from "./screens/RegisterLocally2";
import Screen1 from "./screens/Screen1";
import DispatchRecord from "./screens/DispatchRecord";
import ActiveDispatch from "./screens/ActiveDispatch";
import PendingDispatch from "./screens/PendingDispatch";
import CompletedDispatch from "./screens/CompletedDispatch";
import Profile from "./screens/Profile";
import notification from "./screens/Notification";
import CarInfo from "./screens/CarInfo";
import CarInfo2 from "./screens/CarInfo2";
import CarRequest from "./screens/CarRequest";

const Stack = createNativeStackNavigator();

const App = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);

  const [fontsLoaded] = useFonts({
    Inter: require("./assets/fonts/Inter-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="RegisterLocally1"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="RegisterGoogle" component={RegisterGoogle} />
          <Stack.Screen name="RegisterLocally1" component={RegisterLocally1} />
          <Stack.Screen name="RegisterLocally2" component={RegisterLocally2} />
          <Stack.Screen name="Screen1" component={Screen1} />
          <Stack.Screen name="DispatchRecord" component={DispatchRecord} />
          <Stack.Screen name="ActiveDispatch" component={ActiveDispatch} />
          <Stack.Screen name="PendingDispatch" component={PendingDispatch} />
          <Stack.Screen name="CompletedDispatch" component={CompletedDispatch} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="CarInfo" component={CarInfo} />
          <Stack.Screen name="CarInfo2" component={CarInfo2} />
          <Stack.Screen name="CarRequest" component={CarRequest} />
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

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const RegisterLocally1 = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (name.trim().length > 0) {
      setError("");
      navigation.navigate("Screen1", { name });
    } else {
      setError("Please enter your name");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerM}>
        <View style={styles.contnetUp}>
          <Image
            source={require("../assets/cable-car.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>AUTO PORT</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.greeting}>Hello Stranger</Text>
          <Text style={styles.prompt}>what do you prefer we call you by</Text>

          <Image
            source={require("../assets/Divider.png")}
            style={styles.divider}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="Hi im {user’s google name}"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          <TouchableOpacity style={styles.button} onPress={handleContinue}>
            <Text style={styles.buttonText}>Sign me Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterLocally1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerM: {
    flex: 1,
    marginHorizontal: "5%",
  },
  contnetUp: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "10%",
  },
  logo: {
    width: "12%",
    aspectRatio: 1,
    marginBottom: "3%",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
    marginBottom: "15%",
  },
  content: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    height: "70%",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: "2%",
  },
  prompt: {
    fontSize: 16,
    color: "#555",
    marginBottom: "8%",
  },
  divider: {
    width: "95%",
  },
  inputContainer: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#DDD",
    marginTop: "8%",
    marginBottom: "6%",
  },
  input: {
    width: "100%",
    height: 45,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: "4%",
    fontSize: 20,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: "3%",
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
    marginTop: "5%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: "2%",
    alignSelf: "flex-start",
  },
  inputError: {
    borderColor: "red",
  },
});

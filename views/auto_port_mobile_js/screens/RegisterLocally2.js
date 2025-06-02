import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";

const RegisterLocally2 = () => {
  const route = useRoute();
  const { name } = route.params || {};
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [error, setError] = useState("");

  const handleSignUp = () => {
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    setError("");
    Alert.alert("Signed Up!", `Welcome aboard, ${name}`);
    setTimeout(() => {
      navigation.navigate("Screen1", { name });
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.containerM}>
        <View style={styles.header}>
          <Image
            source={require("../assets/cable-car.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>
            {name ? `${name}'s fleet` : "Your fleet"}
          </Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Set up your secure password</Text>
          <Text style={styles.subtitle}>
            we need a password secure your account
          </Text>

          <Image
            source={require("../assets/Divider.png")}
            style={styles.divider}
            resizeMode="contain"
          />

          <TextInput
            style={styles.input}
            placeholder="my secure password."
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign me Up(3/3)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterLocally2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containerM: {
    flex: 1,
    paddingHorizontal: "5%",
  },
  header: {
    marginTop: "5%",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: "8%",
    aspectRatio: 1,
    marginRight: "3%",
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    flexShrink: 1,
  },
  content: {
    marginTop: "70%",
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: "2%",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: "5%",
    textAlign: "center",
  },
  divider: {
    width: "95%",
    height: 1,
    marginBottom: "8%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingVertical: "3%",
    paddingHorizontal: "4%",
    fontSize: 18,
    marginBottom: "6%",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: "4%",
    borderRadius: 6,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: "4%",
    alignSelf: "flex-start",
  },
});

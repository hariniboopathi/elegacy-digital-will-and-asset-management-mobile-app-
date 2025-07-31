import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../src/constants/Colors";

// Add your backend URL here (e.g., your Ngrok URL)
const API_BASE_URL = "http://localhost:5000";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // for navigation

  const handleLogin = async () => {
    // Basic validation
    if (!email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Invalid Password", "Password must be at least 6 characters.");
      return;
    }

    try {
      // Call Flask login API
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      console.log("response",response)
      const data = await response.json();
      console.log("Login response:", data);

      if (response.ok) {
        // Store user token/session in AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(data));

        // Navigate to home immediately
        router.replace("/");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Unable to connect to the server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.linkText}>
        Don't have an account? <Link href="/register">Register</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.white,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: Colors.accent,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  linkText: {
    textAlign: "center",
    marginTop: 10,
  },
});

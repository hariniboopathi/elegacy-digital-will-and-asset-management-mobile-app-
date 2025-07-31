import { Link, router } from "expo-router";
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

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



const handleRegister = async () => {
  if (!name || !email || !password || !confirmPassword) {
    Alert.alert("All fields are required.");
    return;
  }
  if (!email.includes("@")) {
    Alert.alert("Invalid Email", "Please enter a valid email.");
    return;
  }
  if (password !== confirmPassword) {
    Alert.alert("Passwords do not match.");
    return;
  }

  try {
    // Add your backend URL here (e.g., your Ngrok URL)
    const API_BASE_URL = "http://localhost:5000";
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      Alert.alert("Success", "Registration successful!", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } else {
      Alert.alert("Error", data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Registration Error:", error);
    Alert.alert("Error", "Unable to connect to server.");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <Text style={styles.linkText}>
        Already have an account? <Link href="/login">Login</Link>
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

import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Colors from "../src/constants/Colors";

const { width } = Dimensions.get("window");

export default function About() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  return (
    <ImageBackground
      source={require("../assets/home-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>About eLegacy</Text>
          <Text style={styles.subtitle}>
            Securely manage your digital and financial assets, assign
            beneficiaries, and safeguard your digital legacy.
          </Text>
        </Animated.View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What is eLegacy?</Text>
          <Text style={styles.sectionText}>
            eLegacy is a secure platform designed for digital will and asset
            management. Your data is encrypted with AES-256 & RSA, ensuring the
            highest level of security.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Use?</Text>
          <Text style={styles.sectionText}>
            1. Create an account and log in. {"\n"}
            2. Upload your documents securely. {"\n"}
            3. Assign beneficiaries and conditions for release. {"\n"}
            4. Manage and track your digital legacy with ease.
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    padding: 20,
  },
  content: {
    marginTop: 60,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: Colors.white,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.white,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 22,
  },
  section: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.primary,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.black,
  },
});

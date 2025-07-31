import LoginScreen from "@/app/login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await AsyncStorage.removeItem("user"); // Clear session
        console.log("User logged out.");
        // Navigate to login screen
        router.replace("/login");
      } catch (error) {
        console.error("Logout Error:", error);
      }
    };

    performLogout();
  }, []);

  return <LoginScreen />; // Show login screen after clearing session
}

export default LogoutScreen;

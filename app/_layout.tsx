import SplashScreen from "@/src/screens/SplashScreen";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import Colors from "../src/constants/Colors";

export default function Layout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status with splash delay
  useEffect(() => {
    const timer = setTimeout(async () => {
      const user = await AsyncStorage.getItem("user");
      setIsLoggedIn(!!user);
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [loading, isLoggedIn]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary },
        headerTintColor: "#fff",
        drawerActiveTintColor: Colors.primary,
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      {/* Home */}
      <Drawer.Screen
        name="index"
        options={{
          title: "Welcome Home",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Upload Documents */}
      <Drawer.Screen
        name="upload"
        options={{
          title: "Upload Docs",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cloud-upload-outline" size={size} color={color} />
          ),
        }}
      />


      {/* View Documents */}
      <Drawer.Screen
        name="view-documents"
        options={{
          title: "Doc Manager",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="folder-open-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Manage Access */}
      <Drawer.Screen
        name="manageAccess"
        options={{
          title: "Access Manager",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Notifications */}
      <Drawer.Screen
        name="notification"
        options={{ 
          title: "Notifications",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Will & Legal Documents */}
      <Drawer.Screen
        name="will-documents"
        options={{
          title: "Will & Legal doc builder",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      {/* About */}
      <Drawer.Screen
        name="about"
        options={{
          title: "About",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Profile */}
      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Logout */}
      <Drawer.Screen
        name="logout"
        options={{
          title: "Logout",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          drawerItemPress: async (e) => {
            e.preventDefault();
            await AsyncStorage.removeItem("user");
            console.warn("User removed from AsyncStorage");
            router.replace("/login");
          },
        }}
      />

      {/* Hidden Screens */}
      <Drawer.Screen
        name="login"
        options={{
          title: "Login",
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="register"
        options={{
          title: "Register",
          headerShown: false,
          drawerItemStyle: { display: "none" },
        }}
      />
    </Drawer>
  );
}

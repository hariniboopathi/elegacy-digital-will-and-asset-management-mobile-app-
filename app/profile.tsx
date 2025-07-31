import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../src/constants/Colors";

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Load saved profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Load logged-in user data
        const userData = await AsyncStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          // Set email from logged-in user data
          setEmail(user.user?.email || user.email || "");
          setName(user.user?.name || user.name || "");
        }

        // Load saved profile data (for phone, address, profile image)
        const savedProfile = await AsyncStorage.getItem("userProfile");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          // Only update fields that aren't already set from user data
          if (!name) setName(profile.name || "");
          if (!email) setEmail(profile.email || "");
          setPhone(profile.phone || "");
          setAddress(profile.address || "");
          setProfileImage(profile.profileImage || null);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  // Pick profile image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  // Save profile
  const saveProfile = async () => {
    if (!name || !email) {
      Alert.alert("Please fill in your name and email.");
      return;
    }

    const profile = { name, email, phone, address, profileImage };
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    Alert.alert("Profile saved successfully!");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require("../assets/default-profile.png")}
            style={styles.profileImage}
          />
          <Ionicons name="camera" size={20} color="white" style={styles.cameraIcon} />
        </TouchableOpacity>
        <Text style={styles.userName}>{name || "Your Name"}</Text>
        <Text style={styles.userPhone}>{phone || "+91-XXXXXXXXXX"}</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <TextInput style={styles.infoValue} value={email} onChangeText={setEmail} placeholder="Enter Email" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <TextInput style={styles.infoValue} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Enter Phone" />
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address</Text>
          <TextInput style={styles.infoValue} value={address} onChangeText={setAddress} placeholder="Enter Address" />
        </View>
      </View>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.actionButton} onPress={saveProfile}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.actionText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Ionicons name="document-text-outline" size={20} color={Colors.primary} />
        <Text style={styles.optionText}>My Uploaded Documents</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionButton}>
        <Ionicons name="time-outline" size={20} color={Colors.primary} />
        <Text style={styles.optionText}>Access Logs</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9ff",
  },
  topContainer: {
    backgroundColor: Colors.primary,
    alignItems: "center",
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: Colors.accent,
    padding: 5,
    borderRadius: 15,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  userPhone: {
    color: "#f0f0f0",
    fontSize: 14,
  },
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.gray,
  },
  infoValue: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 5,
    fontSize: 16,
    color: "#333",
  },
  actionButton: {
    backgroundColor: Colors.accent,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  actionText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  optionButton: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    marginLeft: 10,
    color: Colors.primary,
    fontWeight: "600",
  },
});

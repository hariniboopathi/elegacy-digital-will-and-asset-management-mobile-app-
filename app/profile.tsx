import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../src/constants/Colors";

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [shareEmail, setShareEmail] = useState("");

  // Load saved profile details
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedProfile = await AsyncStorage.getItem("userProfile");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setName(profile.name || "");
          setEmail(profile.email || "");
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

  // Save profile data
  const saveProfile = async () => {
    if (!name || !email) {
      Alert.alert("Please fill in your name and email.");
      return;
    }

    const profile = { name, email, phone, address, profileImage };
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    Alert.alert("Profile saved successfully!");
  };

  // Handle document sharing
  const handleShare = () => {
    if (!shareEmail.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }
    // Future backend integration can go here
    Alert.alert("Invited!", `Your invitation has been sent to ${shareEmail}`);
    setModalVisible(false);
    setShareEmail("");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ alignItems: "center" }}>
      <Text style={styles.header}>My Profile</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={
            profileImage
              ? { uri: profileImage }
              : require("../assets/default-profile.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.editPhoto}>Change Photo</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <View style={{ marginTop: 20, width: "80%" }}>
        <Button title="Save Profile" color={Colors.accent} onPress={saveProfile} />
      </View>

      {/* Share Documents Button */}
      <View style={{ marginTop: 20, width: "80%" }}>
        <Button title="INVITE COLLABORATOR" color={Colors.primary} onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal for entering email */}
      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter email to invite:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter email"
              value={shareEmail}
              onChangeText={setShareEmail}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.okBtn} onPress={handleShare}>
                <Text style={styles.okText}>Invite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginBottom: 10,
  },
  editPhoto: {
    color: Colors.accent,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: "90%",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  cancelBtn: { padding: 10 },
  cancelText: { color: "red" },
  okBtn: { padding: 10 },
  okText: { color: Colors.primary, fontWeight: "bold" },
});

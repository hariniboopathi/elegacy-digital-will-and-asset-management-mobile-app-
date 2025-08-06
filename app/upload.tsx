import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // <-- Needed for navigation
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../src/constants/Colors";

const API_BASE_URL = "http://192.168.0.106:5000";

export default function UploadDocumentScreen() {
  const navigation = useNavigation();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("");

  // Metadata fields
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");

  // Load user email first
  useEffect(() => {
    loadUserEmail();
  }, []);

  // Once userEmail is available, fetch documents
  useEffect(() => {
    if (userEmail) {
      loadDocuments();
    }
  }, [userEmail]);

  const loadUserEmail = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        setUserEmail(user.user?.email || user.email || "");
      }
    } catch (error) {
      console.error("Error loading user email:", error);
    }
  };

  const loadDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/documents/${userEmail}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error("Document pick error:", error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert("Please select a file first!");
      return;
    }
    if (!propertyName) {
      Alert.alert("Please enter a Property Name!");
      return;
    }
    if (!userEmail) {
      Alert.alert("Please login first! User email not found.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("email", userEmail);
      formData.append("title", title || selectedFile.name);
      formData.append("propertyName", propertyName);
      formData.append("address", address);
      formData.append("type", type);

      formData.append("document", {
        uri: selectedFile.uri,
        type: selectedFile.mimeType || "application/octet-stream",
        name: selectedFile.name || `file_${Date.now()}.dat`,
      } as any);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Document uploaded successfully!");
        await loadDocuments();
        setSelectedFile(null);
        setTitle("");
        setPropertyName("");
        setAddress("");
        setType("");
      } else {
        Alert.alert("Upload Failed", data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Error", "Failed to upload document");
    }
  };

  return (
    <View style={styles.container}>
      {/* Upload Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add File</Text>

        <TextInput
          placeholder="Document Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Property Name"
          value={propertyName}
          onChangeText={setPropertyName}
          style={styles.input}
        />
        <TextInput
          placeholder="Property Address"
          value={address}
          onChangeText={setAddress}
          style={styles.input}
        />
        <TextInput
          placeholder="Property Type"
          value={type}
          onChangeText={setType}
          style={styles.input}
        />

        <TouchableOpacity style={styles.uploadBox} onPress={handlePickDocument}>
          <Text style={{ color: Colors.primary, fontWeight: "bold" }}>
            {selectedFile ? `Selected: ${selectedFile.name}` : "Browse Files"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
          <Text style={styles.uploadBtnText}>Upload File</Text>
        </TouchableOpacity>
      </View>

      {/* View Uploaded Documents Button */}
      <TouchableOpacity
        style={styles.viewDocsBtn}
        onPress={() => navigation.navigate("view-documents" as never)}
      >
        <Text style={styles.viewDocsBtnText}>
          View Uploaded Documents ({documents.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white, padding: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  uploadBtn: {
    backgroundColor: "#748DAE",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  uploadBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  viewDocsBtn: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  viewDocsBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../src/constants/Colors";

const API_BASE_URL = "http://192.168.29.160:5000"; 

export default function UploadDocumentScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("");

  // Metadata fields
  const [propertyName, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");

  // Load user email and existing documents
  useEffect(() => {
    loadUserEmail();
    loadDocuments();
  }, []);

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
      if (userEmail) {
        const response = await fetch(`${API_BASE_URL}/api/documents/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        }
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
    console.log("=== UPLOAD DEBUG START ===");

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

      // formData.append("document", {
      //   uri: selectedFile.uri,
      //   type: selectedFile.mimeType || "application/octet-stream",
      //   name: selectedFile.name || `file_${Date.now()}.dat`,
      // } as any);
        // ✅ CORRECT — sending actual file for native platforms
      formData.append("document", {
          uri: selectedFile.uri,
          type: selectedFile.mimeType || "application/octet-stream",
          name: selectedFile.name || `file_${Date.now()}.dat`,
      } as any);

      
      
      console.log("Sending FormData to:", `${API_BASE_URL}/api/upload`);

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Response data:", data);

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

      <Text style={styles.subHeader}>Uploaded Documents</Text>
      {documents.length === 0 ? (
        <Text style={styles.noDocs}>No documents uploaded yet.</Text>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item._id || item.id}
          renderItem={({ item }) => (
            <View style={styles.docItem}>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.title}</Text>
              <Text style={{ color: Colors.gray }}>
                {item.property_name} | {item.type}
              </Text>
            </View>
          )}
        />
      )}
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
  cardTitle: { fontSize: 20, fontWeight: "bold", color: Colors.primary, marginBottom: 15 },
  input: { borderWidth: 1, borderColor: Colors.gray, padding: 10, borderRadius: 8, marginBottom: 15 },
  uploadBox: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
    marginBottom: 20,
  },
  uploadBtn: { backgroundColor: "#748DAE", padding: 12, borderRadius: 8, alignItems: "center" },
  uploadBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  subHeader: { fontSize: 18, fontWeight: "bold", marginTop: 10, marginBottom: 10 },
  noDocs: { textAlign: "center", color: Colors.gray, marginTop: 20 },
  docItem: { backgroundColor: "#f1f1f1", padding: 10, borderRadius: 6, marginBottom: 8 },
});

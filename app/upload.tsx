import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
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

export default function UploadDocumentScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);

  // Metadata
  const [fileType, setFileType] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [notes, setNotes] = useState("");

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

  const handleUpload = () => {
    if (!selectedFile) {
      Alert.alert("Please select a file first!");
      return;
    }
    if (!fileType) {
      Alert.alert("Please select a File Type!");
      return;
    }

    const newDoc = {
      id: Date.now().toString(),
      title: title || selectedFile.name,
      name: selectedFile.name,
      fileType,
      expiryDate,
      notes,
      date: new Date().toLocaleDateString(),
    };

    setDocuments([...documents, newDoc]);
    setSelectedFile(null);
    setTitle("");
    setFileType("");
    setExpiryDate("");
    setNotes("");
    Alert.alert("Document uploaded successfully!");
  };

  return (
    <View style={styles.container}>
      {/* Card for Add File */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Add File</Text>

        <TextInput
          placeholder="File Type (e.g., CPR Card)"
          value={fileType}
          onChangeText={setFileType}
          style={styles.input}
        />

        <TextInput
          placeholder="Expiration Date (Optional)"
          value={expiryDate}
          onChangeText={setExpiryDate}
          style={styles.input}
        />

        <TextInput
          placeholder="Notes"
          value={notes}
          onChangeText={setNotes}
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

      {/* Uploaded Documents */}
      <Text style={styles.subHeader}>Uploaded Documents</Text>
      {documents.length === 0 ? (
        <Text style={styles.noDocs}>No documents uploaded yet.</Text>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.docItem}>
              <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
              <Text style={{ color: Colors.gray }}>
                Type: {item.fileType} | Uploaded: {item.date}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
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
  uploadBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },
  noDocs: {
    textAlign: "center",
    color: Colors.gray,
    marginTop: 20,
  },
  docItem: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
});

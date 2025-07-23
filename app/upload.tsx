import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../src/constants/Colors";

export default function UploadDocumentScreen() {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedFile(result.assets[0]); // Access the selected file
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

    const newDoc = {
      id: Date.now().toString(),
      title: title || selectedFile.name,
      name: selectedFile.name,
      date: new Date().toLocaleDateString(),
    };

    setDocuments([...documents, newDoc]);
    setSelectedFile(null);
    setTitle("");
    Alert.alert("Document uploaded successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Document</Text>

      <View style={styles.centerContent}>
        <TextInput
          placeholder="Document Title (optional)"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TouchableOpacity style={styles.uploadBox} onPress={handlePickDocument}>
          <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Pick a Document</Text>
        </TouchableOpacity>

        {selectedFile && <Text style={styles.fileInfo}>Selected: {selectedFile.name}</Text>}

        <Button title="Upload Document" color={Colors.accent} onPress={handleUpload} />
      </View>

      <Text style={styles.subHeader}>Uploaded Documents</Text>

      {documents.length === 0 ? (
        <Text style={styles.noDocs}>No documents uploaded yet.</Text>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.docItem}>
              <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
              <Text style={{ color: Colors.gray }}>Uploaded: {item.date}</Text>
            </TouchableOpacity>
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
    paddingTop: 30,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    width: "100%",
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: 10,
    alignItems: "center",
    padding: 20,
    marginBottom: 15,
    width: "100%",
  },
  fileInfo: {
    marginBottom: 10,
    color: Colors.primary,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.black,
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
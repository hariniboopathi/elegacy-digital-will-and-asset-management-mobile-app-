import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../src/constants/Colors";

// Add your backend URL here
const API_BASE_URL = "http://192.168.29.160:5000";

export default function ViewDocuments() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"property_name" | "type">("property_name");
  const [userEmail, setUserEmail] = useState("");

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const [isMetadataModalVisible, setMetadataModalVisible] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);

  // Load user email and documents from MongoDB
  useEffect(() => {
    loadUserEmail();
  }, []);

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
      if (userEmail) {
        const response = await fetch(`${API_BASE_URL}/api/documents/${userEmail}`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        } else {
          console.error("Failed to load documents");
        }
      }
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  // Filter documents
  const filteredDocuments = documents
    .filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.property_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => (a[sortBy] > b[sortBy] ? 1 : -1));

  const openBottomSheet = (doc: any) => {
    setSelectedDoc(doc);
    setBottomSheetVisible(true);
  };

  const handleEditMetadata = () => {
    setMetadataModalVisible(true);
    setBottomSheetVisible(false);
  };

  const handleShare = () => {
    setShareModalVisible(true);
    setBottomSheetVisible(false);
    console.log("Share action for:", selectedDoc.title);
  };

  const handleDelete = () => {
    Alert.alert("Delete Document", `Are you sure you want to delete "${selectedDoc.title}"?`, [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            const response = await fetch(`${API_BASE_URL}/api/documents/${selectedDoc._id}`, {
              method: "DELETE",
            });

            if (response.ok) {
              console.log("Deleted:", selectedDoc.title);
              await loadDocuments(); // Reload documents from server
              setBottomSheetVisible(false);
            } else {
              Alert.alert("Error", "Failed to delete document");
            }
          } catch (error) {
            console.error("Delete error:", error);
            Alert.alert("Error", "Failed to delete document");
          }
        },
      },
    ]);
  };

  const renderDocument = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>
            {item.property_name} | {item.type}
          </Text>
          <Text style={styles.cardAddress}>{item.address}</Text>
        </View>
        <TouchableOpacity onPress={() => openBottomSheet(item)}>
          <Ionicons name="ellipsis-vertical" size={22} color="#333" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Uploaded Documents</Text>

      {/* Search and Sort */}
      <View style={styles.searchSortContainer}>
        <TextInput
          placeholder="Search documents..."
          style={styles.searchBar}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() =>
            setSortBy(sortBy === "property_name" ? "type" : "property_name")
          }
        >
          <Ionicons name="swap-vertical" size={20} color="#fff" />
          <Text style={styles.sortText}>
            Sort by {sortBy === "property_name" ? "Name" : "Type"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredDocuments}
        keyExtractor={(item) => item.id}
        renderItem={renderDocument}
        contentContainerStyle={{ paddingBottom: 50 }}
      />

      {/* Bottom Sheet Menu */}
      <Modal
        visible={bottomSheetVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheet}>
            <Text style={styles.sheetTitle}>Options for {selectedDoc?.title}</Text>
            <TouchableOpacity style={styles.sheetOption} onPress={handleEditMetadata}>
              <Ionicons name="create-outline" size={20} color={Colors.primary} />
              <Text style={styles.sheetText}>Edit Metadata</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetOption} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={Colors.primary} />
              <Text style={styles.sheetText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetOption} onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="red" />
              <Text style={[styles.sheetText, { color: "red" }]}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeSheet}
              onPress={() => setBottomSheetVisible(false)}
            >
              <Text style={styles.closeSheetText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Metadata Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMetadataModalVisible}
        onRequestClose={() => setMetadataModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Metadata</Text>

            <TextInput
              style={styles.input}
              placeholder="Property Name"
              value={selectedDoc?.property_name || ""}
              onChangeText={(text) =>
                setSelectedDoc({ ...selectedDoc, property_name: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Property Address"
              value={selectedDoc?.address || ""}
              onChangeText={(text) =>
                setSelectedDoc({ ...selectedDoc, address: text })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Property Type"
              value={selectedDoc?.type || ""}
              onChangeText={(text) =>
                setSelectedDoc({ ...selectedDoc, type: text })
              }
            />

            <TouchableOpacity
              style={styles.saveButton}
              onPress={async () => {
                try {
                  const response = await fetch(`${API_BASE_URL}/api/documents/${selectedDoc._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(selectedDoc),
                  });

                  if (response.ok) {
                    console.log("Updated Metadata:", selectedDoc);
                    await loadDocuments(); // Reload documents from server
                    setMetadataModalVisible(false);
                  } else {
                    Alert.alert("Error", "Failed to update document metadata");
                  }
                } catch (error) {
                  console.error("Update error:", error);
                  Alert.alert("Error", "Failed to update document metadata");
                }
              }}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShareModalVisible}
        onRequestClose={() => setShareModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Share Document</Text>
            <TextInput style={styles.input} placeholder="Enter email..." />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                console.log("Document shared successfully");
                setShareModalVisible(false);
              }}
            >
              <Text style={styles.saveButtonText}>Send Invite</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4", padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: Colors.primary },
  searchSortContainer: { flexDirection: "row", marginBottom: 15, alignItems: "center" },
  searchBar: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  sortButton: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: { color: "#fff", marginLeft: 5 },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    position: "relative",
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  cardSubtitle: { fontSize: 14, color: "#555", marginTop: 5 },
  cardAddress: { fontSize: 13, color: "#888", marginTop: 3 },

  // Bottom Sheet
  bottomSheetOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  bottomSheet: { backgroundColor: "#fff", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  sheetTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  sheetOption: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  sheetText: { marginLeft: 10, fontSize: 16 },
  closeSheet: { marginTop: 15, padding: 10, alignItems: "center" },
  closeSheetText: { color: Colors.primary, fontWeight: "bold" },

  // Modals
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 10, marginBottom: 12, backgroundColor: "#fafafa" },
  saveButton: { backgroundColor: Colors.primary, padding: 12, borderRadius: 8, alignItems: "center" },
  saveButtonText: { color: "#fff", fontWeight: "bold" },
});

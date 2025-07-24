import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
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

const initialDocuments = [
  { id: "1", title: "Property Deed", propertyName: "Green Villa", address: "123 Palm Street", type: "House" },
  { id: "2", title: "Investment Report", propertyName: "Stock Portfolio", address: "N/A", type: "Financial" },
  { id: "3", title: "Rental Agreement", propertyName: "Sunset Apartments", address: "45 Hill Road", type: "Apartment" },
  { id: "4", title: "Car Ownership", propertyName: "BMW X5", address: "N/A", type: "Vehicle" },
  { id: "5", title: "Insurance Policy", propertyName: "Health Plan", address: "N/A", type: "Insurance" },
  { id: "6", title: "Tax Document", propertyName: "FY 2024 Tax Filing", address: "N/A", type: "Tax" },
];

export default function ViewDocuments() {
  const [documents, setDocuments] = useState(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"propertyName" | "type">("propertyName");

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  const [isMetadataModalVisible, setMetadataModalVisible] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);

  // Filter documents
  const filteredDocuments = documents
    .filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        onPress: () => {
          console.log("Deleted:", selectedDoc.title);
          setDocuments((prev) => prev.filter((doc) => doc.id !== selectedDoc.id));
          setBottomSheetVisible(false);
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
            {item.propertyName} | {item.type}
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
            setSortBy(sortBy === "propertyName" ? "type" : "propertyName")
          }
        >
          <Ionicons name="swap-vertical" size={20} color="#fff" />
          <Text style={styles.sortText}>
            Sort by {sortBy === "propertyName" ? "Name" : "Type"}
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
              value={selectedDoc?.propertyName || ""}
              onChangeText={(text) =>
                setSelectedDoc({ ...selectedDoc, propertyName: text })
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
              onPress={() => {
                console.log("Updated Metadata:", selectedDoc);
                setMetadataModalVisible(false);
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

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

export default function ViewDocumentsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isEditModalVisible, setEditModalVisible] = useState(false);

  const [documents, setDocuments] = useState([
    {
      id: "1",
      name: "Property Deed.pdf",
      propertyName: "Green Villa",
      address: "123 Palm Street",
      type: "Residential",
    },
    {
      id: "2",
      name: "Investment Plan.docx",
      propertyName: "Blue Apartment",
      address: "456 Lake View",
      type: "Commercial",
    },
    {
      id: "3",
      name: "Will_Jan2025.pdf",
      propertyName: "Sunset House",
      address: "789 Beach Road",
      type: "Residential",
    },
    {
      id: "4",
      name: "PropertyTax_2025.pdf",
      propertyName: "Palm Residency",
      address: "101 Palm Heights",
      type: "Residential",
    },
    {
      id: "5",
      name: "RentalAgreement.pdf",
      propertyName: "Hill Top Villa",
      address: "234 Mountain Street",
      type: "Residential",
    },
    {
      id: "6",
      name: "InsurancePolicy.pdf",
      propertyName: "Riverfront House",
      address: "567 River Lane",
      type: "Commercial",
    },
  ]);

  // Filter and sort documents
  const filteredDocs = documents
    .filter(
      (doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "property") return a.propertyName.localeCompare(b.propertyName);
      return 0;
    });

  // Handle Delete
  const handleDelete = (id: string) => {
    Alert.alert("Delete Document", "Are you sure you want to delete this document?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setDocuments((prev) => prev.filter((doc) => doc.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={20} color={Colors.gray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search documents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortBy(sortBy === "name" ? "property" : "name")}
        >
          <Ionicons name="swap-vertical-outline" size={20} color={Colors.primary} />
          <Text style={styles.sortText}>Sort by {sortBy}</Text>
        </TouchableOpacity>
      </View>

      {/* Document List */}
      <FlatList
        data={filteredDocs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.docName}>{item.name}</Text>
              <Text style={styles.propertyText}>
                {item.propertyName} - {item.type}
              </Text>
              <Text style={styles.address}>{item.address}</Text>
            </View>

            {/* Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setEditModalVisible(true)}
              >
                <Ionicons name="create-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => handleDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 50, color: Colors.gray }}>
            No documents found.
          </Text>
        }
      />

      {/* Edit Metadata Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Property Metadata</Text>
            <TextInput placeholder="Property Name" style={styles.modalInput} />
            <TextInput placeholder="Address" style={styles.modalInput} />
            <TextInput placeholder="Type (Residential/Commercial)" style={styles.modalInput} />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => setEditModalVisible(false)}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f9",
    padding: 15,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 12,
    marginLeft: 4,
    color: Colors.primary,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 2,
    alignItems: "center",
  },
  docName: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  propertyText: {
    fontSize: 14,
    color: "#444",
  },
  address: {
    fontSize: 12,
    color: "#777",
  },
  actions: {
    flexDirection: "row",
  },
  iconButton: {
    marginHorizontal: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

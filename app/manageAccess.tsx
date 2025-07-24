import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../src/constants/Colors";

export default function ManageAccess() {
  const [users, setUsers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      documents: ["Property Deed.pdf", "Will_2025.pdf"],
      role: "Viewer",
      lastAccess: "2025-07-23 14:35",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      documents: ["InvestmentDetails.xlsx"],
      role: "Editor",
      lastAccess: "2025-07-23 10:05",
    },
    {
      id: "3",
      name: "Sam Wilson",
      email: "sam@example.com",
      documents: ["Property Deed.pdf"],
      role: "Commenter",
      lastAccess: "2025-07-22 18:25",
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isRoleModalVisible, setRoleModalVisible] = useState(false);

  const openMenu = (user: any) => {
    setSelectedUser(user);
    setMenuVisible(true);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setSelectedUser(null);
  };

  const openModifyAccess = () => {
    setRoleModalVisible(true);
    setMenuVisible(false);
  };

  const changeRole = (role: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, role } : u))
    );
    Alert.alert("Access Updated", `${selectedUser.name} is now ${role}.`);
    setRoleModalVisible(false);
  };

  const removeAccess = () => {
    Alert.alert(
      "Remove Access",
      `Are you sure you want to remove access for ${selectedUser.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setUsers(users.filter((u) => u.id !== selectedUser.id));
            closeMenu();
          },
        },
      ]
    );
  };

  const viewLogs = () => {
    Alert.alert(
      "Access Logs",
      `${selectedUser.name} last accessed on ${selectedUser.lastAccess}`
    );
    closeMenu();
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <View style={styles.userCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <Text style={styles.userDocs}>
          Docs: {item.documents.join(", ")} | Role: {item.role}
        </Text>
      </View>

      <TouchableOpacity onPress={() => openMenu(item)}>
        <Ionicons name="ellipsis-vertical" size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Manage Access</Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderUserItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* 3-Dot Menu Modal */}
      <Modal visible={isMenuVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={closeMenu}
          activeOpacity={1}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={openModifyAccess}
            >
              <Text style={styles.menuText}>Modify Access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={viewLogs}>
              <Text style={styles.menuText}>View Access Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={removeAccess}>
              <Text style={[styles.menuText, { color: "red" }]}>
                Remove Access
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modify Role Modal */}
      <Modal visible={isRoleModalVisible} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setRoleModalVisible(false)}
          activeOpacity={1}
        >
          <View style={styles.roleModal}>
            <Text style={styles.roleHeader}>
              Modify Access for {selectedUser?.name}
            </Text>
            {["Viewer", "Editor", "Commenter"].map((role) => (
              <TouchableOpacity
                key={role}
                style={styles.roleItem}
                onPress={() => changeRole(role)}
              >
                <Text style={styles.menuText}>{role}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8fc",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  userCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  userEmail: {
    color: Colors.gray,
    marginBottom: 5,
  },
  userDocs: {
    color: Colors.accent,
    fontSize: 13,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  menuModal: {
    width: "70%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
  roleModal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  roleHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.primary,
  },
  roleItem: {
    paddingVertical: 10,
  },
});

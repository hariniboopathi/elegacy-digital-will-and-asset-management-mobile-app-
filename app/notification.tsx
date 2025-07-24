import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../src/constants/Colors";

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "share_accept",
      message: "John accepted your share request for Property Deed.pdf",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "doc_view",
      message: "Jane viewed Investment Plan.docx (3 times)",
      time: "4 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "invite_request",
      message: "Alex invited you to view Hill Top Villa.docx",
      time: "Yesterday",
      read: false,
    },
    {
      id: "4",
      type: "doc_view",
      message: "Sam viewed Will_Jan2025.pdf (1 time)",
      time: "2 days ago",
      read: true,
    },
  ]);

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "share_accept":
        return <Ionicons name="checkmark-done-outline" size={24} color={Colors.primary} />;
      case "doc_view":
        return <Ionicons name="eye-outline" size={24} color="#28a745" />;
      case "invite_request":
        return <Ionicons name="person-add-outline" size={24} color="#ff9800" />;
      default:
        return <Ionicons name="notifications-outline" size={24} color={Colors.primary} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={markAllAsRead}>
          <Text style={styles.markReadText}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, item.read && styles.readCard]}>
            {renderIcon(item.type)}
            <View style={styles.textContainer}>
              <Text style={[styles.message, item.read && styles.readText]}>{item.message}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9", padding: 15 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: Colors.primary },
  markReadText: { color: Colors.accent, fontSize: 14 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 6,
    elevation: 1,
  },
  readCard: { opacity: 0.6 },
  textContainer: { marginLeft: 10, flex: 1 },
  message: { fontSize: 15, color: "#333" },
  readText: { color: "#888" },
  time: { fontSize: 12, color: "#777", marginTop: 2 },
  empty: { textAlign: "center", color: "#777", marginTop: 20 },
});

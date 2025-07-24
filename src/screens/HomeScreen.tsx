import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import Colors from "../constants/Colors";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [recentDocs] = useState([
    { id: 1, title: "Property Deed.pdf" },
    { id: 2, title: "Will_Jan2025.pdf" },
    { id: 3, title: "InvestmentDetails.xlsx" },
  ]);

  return (
    <ImageBackground
      source={require("../../assets/dashboard-bg.jpg")}
      style={styles.background}
      imageStyle={{ opacity: 0.15 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.innerContainer}>
          {/* Overview Cards */}
          <View style={styles.cardRow}>
            <Animatable.View animation="fadeInUp" duration={800} style={styles.cardWide}>
              <Ionicons name="documents-outline" size={40} color={Colors.primary} />
              <Text style={styles.cardNumber}>12</Text>
              <Text style={styles.cardLabel}>Total Properties</Text>
            </Animatable.View>

            <Animatable.View animation="fadeInUp" delay={200} duration={800} style={styles.cardWide}>
              <Ionicons name="people-outline" size={40} color={Colors.accent} />
              <Text style={styles.cardNumber}>5</Text>
              <Text style={styles.cardLabel}>Shared Users</Text>
            </Animatable.View>
          </View>

          {/* Recently Accessed */}
          <Animatable.View animation="fadeInUp" delay={400} duration={800} style={styles.recentCard}>
            <Text style={styles.sectionTitle}>Recently Accessed</Text>
            {recentDocs.map((doc) => (
              <View key={doc.id} style={styles.recentItem}>
                <Ionicons name="document-outline" size={20} color={Colors.primary} />
                <Text style={styles.recentText}>{doc.title}</Text>
              </View>
            ))}
          </Animatable.View>

          {/* Quick Actions */}
          <Animatable.View animation="fadeInUp" delay={600} duration={800} style={styles.actionsCard}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Colors.primary }]}
                onPress={() => router.push("/upload")}
              >
                <Ionicons name="cloud-upload-outline" size={22} color="#fff" />
                <Text style={styles.actionText}>Upload Document</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Colors.accent }]}
                onPress={() => router.push("/view-documents")}
              >
                <Ionicons name="share-social-outline" size={22} color="#fff" />
                <Text style={styles.actionText}>Share Access</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#333", marginTop: 10 }]}
              onPress={() => router.push("/notification")}
            >
              <Ionicons name="list-outline" size={22} color="#fff" />
              <Text style={styles.actionText}>View Access Logs</Text>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center",
    paddingVertical: 20,
  },
  innerContainer: {
    alignItems: "center",
    width: width * 0.9,
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  cardWide: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginVertical: 5,
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  recentCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  recentText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
  },
  actionsCard: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 0.48,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
});

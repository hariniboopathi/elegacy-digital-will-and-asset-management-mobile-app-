import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

export default function WillDocumentScreen() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [assets, setAssets] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [isSignatureModalVisible, setSignatureModalVisible] = useState(false);

  // List of pre-built templates
  const templates = [
    { id: "basic", title: "Basic Will Template" },
    { id: "property", title: "Property & Asset Template" },
    { id: "financial", title: "Financial Asset Template" },
  ];

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleSignature = () => {
    setSignatureModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Will & Legal Document Builder</Text>

      <Text style={styles.subHeader}>Select a Template:</Text>
      <View style={styles.templateContainer}>
        {templates.map((tpl) => (
          <TouchableOpacity
            key={tpl.id}
            style={[
              styles.templateCard,
              selectedTemplate === tpl.id && styles.selectedTemplate,
            ]}
            onPress={() => handleTemplateSelect(tpl.id)}
          >
            <Text style={styles.templateText}>{tpl.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subHeader}>Enter Asset Details:</Text>
      <TextInput
        placeholder="e.g., Bank Account No., Property ID, Investments..."
        style={styles.input}
        value={assets}
        onChangeText={setAssets}
        multiline
      />

      <Text style={styles.subHeader}>Enter Beneficiaries:</Text>
      <TextInput
        placeholder="e.g., John Doe (Son), Jane Doe (Daughter)"
        style={styles.input}
        value={beneficiaries}
        onChangeText={setBeneficiaries}
        multiline
      />

      <TouchableOpacity style={styles.signatureButton} onPress={handleSignature}>
        <Text style={styles.signatureButtonText}>Add E-Signature</Text>
      </TouchableOpacity>

      {/* Signature Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isSignatureModalVisible}
        onRequestClose={() => setSignatureModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sign Your Document</Text>
            {/* Placeholder for signature pad */}
            <View style={styles.signaturePad}>
              <Text style={{ color: Colors.gray }}>Signature Pad Placeholder</Text>
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSignatureModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Save & Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginTop: 15,
    marginBottom: 5,
  },
  templateContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  templateCard: {
    width: "45%",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  selectedTemplate: {
    borderColor: Colors.primary,
    backgroundColor: "#e3f2fd",
  },
  templateText: {
    fontSize: 16,
    color: Colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#fafafa",
    minHeight: 60,
    textAlignVertical: "top",
  },
  signatureButton: {
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  signatureButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 15,
  },
  signaturePad: {
    width: "100%",
    height: 200,
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../constants/Colors';

const ViewDocumentsScreen = () => {
  const [verified, setVerified] = useState(false);
  const [pin, setPin] = useState('');

  const [documents] = useState([
    { id: '1', title: 'Will Document.pdf' },
    { id: '2', title: 'Property Papers.jpg' },
    { id: '3', title: 'Bank Statement.pdf' },
  ]);

  const handleVerify = () => {
    if (pin === '1234') {
      setVerified(true);
      Alert.alert('Access Granted', 'You can now view your documents.');
    } else {
      Alert.alert('Incorrect PIN', 'Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>View Uploaded Documents</Text>

      {!verified ? (
        <View style={styles.verifyContainer}>
          <Text style={styles.verifyText}>Enter your PIN to view documents:</Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            placeholder="Enter PIN"
            secureTextEntry
            keyboardType="number-pad"
            style={styles.pinInput}
          />
          <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
            <Text style={styles.verifyBtnText}>Verify</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.docItem}>
              <Text style={styles.docTitle}>{item.title}</Text>
              <TouchableOpacity onPress={() => Alert.alert('Open', `Opening ${item.title}`)}>
                <Ionicons name="eye-outline" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  verifyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  verifyText: { fontSize: 16, marginBottom: 10, color: '#333' },
  pinInput: {
    borderWidth: 1,
    borderColor: Colors.gray,
    padding: 10,
    borderRadius: 8,
    width: '50%',
    textAlign: 'center',
    marginBottom: 10,
  },
  verifyBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  verifyBtnText: { color: Colors.white, fontWeight: 'bold' },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  docTitle: { color: Colors.primary, fontWeight: '500' },
});

export default ViewDocumentsScreen;

import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

const UploadScreen = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<string | null>(null);

  const handleUpload = () => {
    if (!title || !file) {
      Alert.alert('Missing Info', 'Please enter a title and select a file.');
      return;
    }
    Alert.alert('Success', `Uploaded "${title}" successfully!`);
    setTitle('');
    setFile(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upload Documents</Text>

      <TextInput
        style={styles.input}
        placeholder="Document Title"
        value={title}
        onChangeText={setTitle}
      />

      <TouchableOpacity
        style={styles.filePicker}
        onPress={() => setFile('dummy-file.pdf')}
      >
        <Text style={styles.filePickerText}>
          {file ? `Selected: ${file}` : 'Pick a File'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
        <Text style={styles.uploadBtnText}>Upload</Text>
      </TouchableOpacity>
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
  input: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  filePicker: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  filePickerText: {
    color: Colors.primary,
    textAlign: 'center',
  },
  uploadBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadBtnText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
});

export default UploadScreen;

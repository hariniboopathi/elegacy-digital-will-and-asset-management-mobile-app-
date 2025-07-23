import Home from '@/src/screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';

export default function index() {
  useEffect(() => {
    const checkLogin = async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        console.warn("No user found. Redirecting to login...");
        router.replace("/login");
      }
      // No need to redirect to '/' if user exists
    };
    checkLogin();
  }, []);                                                                                         

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Home />
    </View>
  );
}

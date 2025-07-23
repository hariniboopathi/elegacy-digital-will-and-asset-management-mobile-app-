// import { Ionicons } from '@expo/vector-icons';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import React from 'react';
// import Colors from '../constants/Colors';

// import HomeScreen from '../screens/HomeScreen';
// import ProfileScreen from '../screens/ProfileScreen';
// import UploadScreen from '../screens/UploadScreen';
// import ViewDocumentsScreen from '../screens/ViewDocumentsScreen';

// const Drawer = createDrawerNavigator();

// const DrawerNavigator = ({ navigation }: any) => {
//   return (
//     <Drawer.Navigator
//       screenOptions={{
//         headerStyle: { backgroundColor: Colors.primary },
//         headerTintColor: '#fff',
//         drawerActiveTintColor: Colors.primary,
//       }}
//     >
//       <Drawer.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="home-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Upload Documents"
//         component={UploadScreen}
//         options={{
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="cloud-upload-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="View Documents"
//         component={ViewDocumentsScreen}
//         options={{
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="folder-open-outline" color={color} size={size} />
//           ),
//         }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           drawerIcon: ({ color, size }) => (
//             <Ionicons name="person-outline" color={color} size={size} />
//           ),
//         }}
//       />
      
//     </Drawer.Navigator>
//   );
// };

// export default DrawerNavigator;

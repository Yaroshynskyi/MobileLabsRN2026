import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import MainScreen from './src/screens/MainScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import CustomDrawer from './src/components/CustomDrawer';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const NewsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Main" 
        component={MainScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
      />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="NewsStack"
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen 
          name="NewsStack" 
          component={NewsStack} 
          options={{ title: 'Новини' }} 
        />
        <Drawer.Screen 
          name="Contacts" 
          component={ContactsScreen} 
          options={{ title: 'Контакти' }} 
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
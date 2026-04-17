import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'styled-components/native'; 

import { GameProvider } from './src/context/GameContext';
import { AppThemeProvider } from './src/context/ThemeContext';

import GameScreen from './src/screens/GameScreen';
import ChallengesScreen from './src/screens/ChallengesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const MainNavigation = () => {
  const theme = useTheme();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.text,
          tabBarStyle: { backgroundColor: theme.colors.surface, height: 60, paddingBottom: 10 },
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Game') iconName = focused ? 'game-controller' : 'game-controller-outline';
            else if (route.name === 'Challenges') iconName = focused ? 'list' : 'list-outline';
            else if (route.name === 'Settings') iconName = focused ? 'settings' : 'settings-outline';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Game" component={GameScreen} options={{ title: 'Clicker' }} />
        <Tab.Screen name="Challenges" component={ChallengesScreen} options={{ title: 'Challenges' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppThemeProvider>
        <GameProvider>
          <MainNavigation />
        </GameProvider>
      </AppThemeProvider>
    </GestureHandlerRootView>
  );
}
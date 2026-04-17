import React, { useState } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ThemeProvider } from 'styled-components/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { lightTheme, darkTheme } from './src/theme/theme';
import { GameProvider } from './src/context/GameContext';

import GameScreen from './src/screens/GameScreen';
import ChallengesScreen from './src/screens/ChallengesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const systemTheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(systemTheme === 'dark');

  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GameProvider>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: theme.colors.surface },
                headerTintColor: theme.colors.text,
                tabBarStyle: { backgroundColor: theme.colors.surface },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
              }}
            >
              <Tab.Screen name="Game" component={GameScreen} options={{ title: 'Gesture Clicker' }} />
              <Tab.Screen name="Challenges" component={ChallengesScreen} options={{ title: 'Challenges' }} />
              <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
            </Tab.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </GameProvider>
    </GestureHandlerRootView>
  );
}
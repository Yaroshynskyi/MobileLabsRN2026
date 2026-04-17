import React, { createContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from 'styled-components/native';
import { lightTheme, darkTheme } from '../theme/theme';

export const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const systemTheme = useColorScheme();
  const [isDarkTheme, setIsDarkTheme] = useState(systemTheme === 'dark');

  const toggleTheme = () => setIsDarkTheme((prev) => !prev);
  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { ThemeProvider } from './src/context/ThemeContext';
import { AppProvider } from './src/context/AppContext';
import TabNavigator from './src/navigation/TabNavigator';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <TabNavigator />
          <Toast />
        </NavigationContainer>
      </AppProvider>
    </ThemeProvider>
  );
}

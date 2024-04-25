
import { AppProvider, UserProvider } from '@realm/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { ThemeProvider } from 'styled-components/native';

import { Routes } from './src/routes';

import { StatusBar } from 'react-native';
import { Loading } from './src/components/Loading';
import { SignIn } from './src/screens/SignIn';

import theme from './src/theme';

import { REALM_APP_ID } from '@env';

export default function App() {

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  if(!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider>
          <StatusBar 
            barStyle="light-content" 
            backgroundColor="transparent" 
            translucent 
          />
          <UserProvider fallback={SignIn}>
            <Routes />
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}

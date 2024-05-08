import 'react-native-get-random-values';

import { AppProvider, UserProvider } from '@realm/react';
import { WifiSlash } from 'phosphor-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import './src/libs/dayjs';

import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { useNetInfo } from '@react-native-community/netinfo';
import { ThemeProvider } from 'styled-components/native';

import { RealmProvider, syncConfig } from './src/libs/realm';
import { Routes } from './src/routes';

import { StatusBar } from 'react-native';
import { Loading } from './src/components/Loading';
import { TopMessage } from './src/components/TopMessage';
import { SignIn } from './src/screens/SignIn';

import theme from './src/theme';

import { REALM_APP_ID } from '@env';

export default function App() {

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  const netInfo = useNetInfo();

  if(!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <AppProvider id={REALM_APP_ID}>
      <ThemeProvider theme={theme}>
        <SafeAreaProvider style={{ backgroundColor: theme.COLORS.GRAY_800 }}>
          
          {
            !netInfo.isConnected &&
            <TopMessage 
              title='Você está off-line'
              icon={WifiSlash}
            />
          }
          
          <StatusBar 
            barStyle="light-content" 
            backgroundColor="transparent" 
            translucent 
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider sync={syncConfig} fallback={Loading}>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}

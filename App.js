import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RemotePushNotification from './src/components/RemotePushNotification';
import { LOVProvider } from './src/context/LovContext';
import AppView from './src/modules/AppViewContainer';
import store, { persistor } from './src/redux/store';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AlertProvider } from './src/context/AlertContext';
let profilelogo = require('./assets/images/BDMT.png');

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate
            loading={
              <View style={styles.container}>
                <Image
                  source={profilelogo}
                  style={{ width: 300, height: 100, marginBottom: 10 }}
                />
                <ActivityIndicator />
                <Text style={styles.errorText}>Initializing App...</Text>
              </View>
            }
            persistor={persistor}
          >
            <LOVProvider>
              <AlertProvider>
                <NavigationContainer>
                  <RemotePushNotification />
                  <AppView />
                </NavigationContainer>
              </AlertProvider>
            </LOVProvider>
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  errorText: {
    color: 'grey',
    fontSize: 18,
    padding: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
});

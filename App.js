import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import RemotePushNotification from './src/components/RemotePushNotification';
import { LOVProvider } from './src/context/LovContext';
import AppView from './src/modules/AppViewContainer';
import store from './src/redux/store';
let profilelogo = require('./assets/images/BDMT.png');

export default function App() {
  let persistor = persistStore(store);

  return (
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
          <NavigationContainer>
            <RemotePushNotification />
            <AppView />
          </NavigationContainer>
        </LOVProvider>
      </PersistGate>
    </Provider>
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

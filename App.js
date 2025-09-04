import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import RemotePushNotification from './src/components/RemotePushNotification';
import AppView from './src/modules/AppViewContainer';
import store from './src/redux/store';
import { StatusBar } from 'react-native';
import { LOVProvider } from './src/context/LovContext';

export default function App() {
  let persistor = persistStore(store);

  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={styles.container}>
            <ActivityIndicator />
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
});

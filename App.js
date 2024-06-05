import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import AppView from './src/modules/AppViewContainer';
import store from './src/redux/store';

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
        persistor={persistor}>
        <NavigationContainer>
          <AppView />
        </NavigationContainer>
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

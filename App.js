import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';
import {persistStore} from 'redux-persist';
import {PersistGate} from 'redux-persist/integration/react';
import AppView from './src/modules/AppViewContainer';
import store from './src/redux/store';
import usePushNotification from './src/hooks/usePushNotification';

export default function App() {
  let persistor = persistStore(store);

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  React.useEffect(() => {
    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();
  }, []);

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

import React, {useEffect} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
import PushNotification from 'react-native-push-notification';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment';

const RemotePushNotification = () => {
  useEffect(() => {
    requestUserPermission();

    // Clean up function
    return () => {
      // Clean up any event listeners or subscriptions
      unsubscribeForegroundNotifications();
      unsubscribeBackgroundNotifications();
      unsubscribeNotificationOpenedApp();
    };
  }, []);

  const requestUserPermission = async () => {
    const apiLevel = await DeviceInfo.getApiLevel();
    console.log({apiLevel});

    if (Platform.OS === 'ios') {
      // const firebaseConfig = {
      //   apiKey: "AIzaSyBxXucmx1kC8qwiZdPk17GyAtZej1qYil8",
      //   authDomain: "cardealzpoint.firebaseapp.com",
      //   projectId: "cardealzpoint",
      //   storageBucket: "cardealzpoint.appspot.com",
      //   databaseURL: "https://cardealzpoint-default-rtdb.firebaseio.com",
      //   messagingSenderId: "508057505431",
      //   appId:
      //     "508057505431-5j209dro4aprg8lp96rsljh8u8tsjbtn.apps.googleusercontent.com",
      // };

      // let app;
      // if (firebase.apps.length === 0) {
      //   app = firebase.initializeApp(firebaseConfig);
      // } else {
      //   app = firebase.app();
      // }

      // // const db = firebase.firestore();
      // const auth = firebase.auth();
      // console.log({ auth, app });
      // Request iOS permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        console.log('Authorization status:', authStatus);
        setupNotifications();
      }
    } else if (Platform.OS === 'android' && apiLevel >= 33) {
      // Request Android permission (For API level 33+, for 32 or below is not required)
      const res = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      if (res === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Android notification permission granted');
        setupNotifications();
      } else {
        console.log('Android notification permission denied');
      }
    } else {
      setupNotifications();
    }
  };

  const setupNotifications = () => {
    getFCMToken();
    subscribeForegroundNotifications();
    subscribeBackgroundNotifications();
    subscribeNotificationOpenedApp();
  };

  const getFCMToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('Your Firebase Token is:', fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  const subscribeForegroundNotifications = () => {
    messaging().onMessage(async remoteMessage => {
      console.log(
        'A new message arrived! (FOREGROUND)',
        JSON.stringify(remoteMessage),
      );
      localNotification(remoteMessage);
    });
  };

  const subscribeBackgroundNotifications = () => {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log(
        'A new message arrived! (BACKGROUND)',
        JSON.stringify(remoteMessage),
      );
      localNotification(remoteMessage);
    });
  };

  const subscribeNotificationOpenedApp = () => {
    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'App opened from BACKGROUND by tapping notification:',
        JSON.stringify(remoteMessage),
      );
      localNotification(remoteMessage);
    });
  };

  const unsubscribeForegroundNotifications = () => {
    return messaging().onMessageHandlerRemoved;
  };

  const unsubscribeBackgroundNotifications = () => {
    return messaging().setBackgroundMessageHandler;
  };

  const unsubscribeNotificationOpenedApp = () => {
    return messaging().onNotificationOpenedApp;
  };

  const localNotification = remoteMessage => {
    const key = Date.now().toString(); // Key must be unique every time
    const {title, body} = remoteMessage.notification;
    const {image} = remoteMessage.data;
    const sentTime = remoteMessage.sentTime;
    console.log('title', title, 'message', body, 'sentTime', sentTime);
    PushNotification.createChannel(
      {
        channelId: remoteMessage.messageId,
        channelName: 'Local message',
        channelDescription: 'Notification for Local message',
        importance: 4,
        vibrate: true,
      },
      created => console.log(`createChannel returned '${created}'`),
    );
    PushNotification.localNotification({
      channelId: remoteMessage.messageId,
      title: title,
      message: body,
      color: 'black',
      // bigText: body, // (optional) default: "message" prop
      bigPictureUrl: image,
      subText: moment(sentTime).fromNow(),
      actions: [`${moment(sentTime).fromNow()}`],
    });
  };

  return null; // This component doesn't render anything visible
};

export default RemotePushNotification;
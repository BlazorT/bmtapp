import React, {useEffect} from 'react';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios'; // Make sure to install this dependency

const PushNotifications = () => {
  const localNotification = () => {
    const key = Date.now().toString(); // Key must be unique everytime
    PushNotification.createChannel(
      {
        channelId: key, // (required)
        channelName: 'Local messasge', // (required)
        channelDescription: 'Notification for Local message', // (optional) default: undefined.
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    PushNotification.localNotification({
      channelId: key, //this must be same with channelid in createchannel
      title: 'Local Message',
      message: 'Local message !!',
    });
  };
  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      // (required) Called when a remote or local notification is opened or received
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        // process the notification here
        // required on iOS only
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      // Android only
      senderID: '1090501687137',
      // iOS only
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Example of sending a notification
    PushNotification.localNotification({
      /* Android Only Properties */
      channelId: 'channel-id',
      vibrate: true, // (optional) default: true
      title: 'My Notification Title', // (optional)
      message: 'My Notification Message', // (required)
      playSound: true, // (optional) default: true
    });
  }, []);

  return null;
};

export default PushNotifications;

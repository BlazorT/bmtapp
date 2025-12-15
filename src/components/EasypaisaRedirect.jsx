import AesJs from 'aes-js';
import { Buffer } from 'buffer';
import moment from 'moment';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useUser } from '../hooks/useUser';
import { EASYPAISA_EXPIRY_TIME } from '../constants';
import servicesettings from '../modules/dataservices/servicesettings';
import Toast from 'react-native-simple-toast';
import { useTheme } from '../hooks/useTheme';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import { keepOnlyAlphanumeric } from '../helper/dateFormatter';

function convertObjectToString(obj) {
  let data = '';
  Object.keys(obj)
    .sort()
    .forEach(key => {
      data += `${key}=${obj[key]}` + '&';
    });
  return data.slice(0, data.length - 1);
}

const pkcs5Pad = (text, blockSize) => {
  const pad = blockSize - (text.length % blockSize);
  return text + String.fromCharCode(pad).repeat(pad);
};

const EasypaisaRedirect = ({ isOpen, onClose, toPay, onlinePaymentType }) => {
  const theme = useTheme();
  const { user } = useUser();
  const [initialPostData, setInitialPostData] = useState(null);
  const [confirmationPostData, setConfirmationPostData] = useState(null);
  const [tokenReceived, setTokenReceived] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    prepareInitialRequest();
  }, [isOpen]);

  if (!isOpen) return null;

  const prepareInitialRequest = async () => {
    try {
      const orderNumber =
        `${keepOnlyAlphanumeric((Number(user.orgId) ?? '') + 'RBMT')}` +
        'D' +
        moment().format('YYYYMMDDHHmmss');

      const requestBody = {
        amount: toPay?.toFixed(1),
        // amount: '1.0',
        autoRedirect: '1',
        ...(user?.email && { emailAddr: user.email }),
        expiryDate: moment()
          .add(EASYPAISA_EXPIRY_TIME, 'minute')
          .format('YYYYMMDD HHmmss'),
        orderRefNum: orderNumber,
        paymentMethod: 'MA_PAYMENT_METHOD',
        postBackURL: `${
          servicesettings.payment_service
        }/api/payment/ep-callback`,
        storeId: onlinePaymentType?.profileId ?? '760757',
      };

      const HASH_KEY = onlinePaymentType?.cert ?? 'YHVUNCYFR0V4XLW8';
      const aes = new AesJs.ModeOfOperation.ecb(
        AesJs.utils.utf8.toBytes(HASH_KEY),
      );
      const paddedString = pkcs5Pad(convertObjectToString(requestBody), 16);
      const encryptedBytes = aes.encrypt(
        AesJs.utils.utf8.toBytes(paddedString),
      );
      const merchantHashedReq = Buffer.from(encryptedBytes).toString('base64');
      requestBody.merchantHashedReq = merchantHashedReq;

      const formBody = queryString.stringify(requestBody);
      setInitialPostData({
        uri:
          onlinePaymentType?.callBackUri ??
          'https://easypay.easypaisa.com.pk/easypay/Index.jsf',
        method: 'POST',
        body: formBody,
      });
    } catch (error) {
      console.error('🚨 Failed to prepare Easypay request:', error);
    }
  };

  const parseQueryParams = url => {
    const params = {};
    const query = url.split('?')[1];
    if (!query) return params;
    query.split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      params[key] = decodeURIComponent(value || '');
    });
    return params;
  };

  const onInitialNavigation = navState => {
    const url = navState.url;
    if (url.includes('auth_token') && !tokenReceived) {
      const params = parseQueryParams(url);
      const token = params['auth_token'];
      const formBody = queryString.stringify({
        auth_token: token,
        postBackURL: 'https://hotmealzndealz.com/Home/PrivacyPolicy',
      });

      setConfirmationPostData({
        uri:
          onlinePaymentType?.paymentStatusEnquiryUri ??
          'https://easypay.easypaisa.com.pk/easypay/Confirm.jsf',
        method: 'POST',
        body: formBody,
      });
      setTokenReceived(true);
    }
  };

  const onConfirmationNavigation = navState => {
    const url = navState.url;
    if (url.includes('message')) {
      const params = parseQueryParams(url);
      const orderRefNumber = params['orderRefNumber'];
      const rawMessage = params['message'];
      const message = rawMessage
        ? decodeURIComponent(rawMessage.replace(/\+/g, ' '))
        : ''; // Remove plus signs
      const amount = params['amount'];
      const transactionRefNumber = params['transactionRefNumber'];
      console.log('🚨 params', params);

      if (message) {
        onClose();
        Toast.show(message);
      } else {
        Toast.show('Payment has been confirmed successfully!');
        const paymentData = {
          orderRefNumber,
          message,
          amount,
          transactionRefNumber,
        };
        onClose(btoa(JSON.stringify(paymentData)));
      }
    }
  };

  if (!initialPostData) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Initializing transaction...</Text>
      </View>
    );
  }

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={[styles.header, { backgroundColor: theme.modalBackColor }]}
          onPress={() => onClose(null)}
        >
          <AntdIcon name="close" size={24} color={theme.textColor} />
          <Text color={theme.textColor}>Easypaisa</Text>
        </TouchableOpacity>
        {!tokenReceived ? (
          <WebView
            source={initialPostData}
            onNavigationStateChange={onInitialNavigation}
            javaScriptEnabled
            domStorageEnabled
            cacheEnabled
            scrollEnabled
            sharedCookiesEnabled
            // userAgent="Mozilla/5.0"
          />
        ) : (
          <WebView
            source={confirmationPostData}
            onNavigationStateChange={onConfirmationNavigation}
            javaScriptEnabled
            cacheEnabled
            scrollEnabled
            sharedCookiesEnabled
            domStorageEnabled
            // renderToHardwareTextureAndroid={true}
            onLoadProgress={e => {
              console.log('🚨 onLoadProgress', e.nativeEvent.progress);
              console.log('🚨 onLoadProgress', e.nativeEvent.url);
            }}
            // domStorageEnabled
            // userAgent="Mozilla/5.0"
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  header: {
    height: 50,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    padding: 10,
    columnGap: 5,
  },
});

export default EasypaisaRedirect;

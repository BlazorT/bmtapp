import AesJs from 'aes-js';

import { Buffer } from 'buffer';

import moment from 'moment';

import queryString from 'query-string';

import React, { useEffect, useState, useRef } from 'react';

import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import { WebView } from 'react-native-webview';

import { useUser } from '../hooks/useUser';

import { EASYPAISA_EXPIRY_TIME } from '../constants';

import servicesettings from '../modules/dataservices/servicesettings';

import Toast from 'react-native-simple-toast';

import { useTheme } from '../hooks/useTheme';

import AntdIcon from 'react-native-vector-icons/AntDesign';

import { keepOnlyAlphanumeric } from '../helper/dateFormatter';

// Helper: Convert object to sorted key=value& string

const convertObjectToString = obj => {
  return Object.keys(obj)

    .sort()

    .map(key => `${key}=${obj[key]}`)

    .join('&');
};

// PKCS5 padding

const pkcs5Pad = (text, blockSize) => {
  const pad = blockSize - (text.length % blockSize);

  return text + String.fromCharCode(pad).repeat(pad);
};

// Parse query params from URL

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

const EasypaisaRedirect = ({ isOpen, onClose, toPay, onlinePaymentType }) => {
  const theme = useTheme();

  const { user } = useUser();

  const [htmlSource, setHtmlSource] = useState(null);

  const [tokenProcessed, setTokenProcessed] = useState(false);

  const webViewRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      prepareInitialRequest();

      setTokenProcessed(false); // Reset for new transaction
    }
  }, [isOpen]);

  const prepareInitialRequest = async () => {
    try {
      const orderNumber =
        `${keepOnlyAlphanumeric((Number(user?.orgId) ?? '') + 'RBMT')}` +
        'D' +
        moment().format('YYYYMMDDHHmmss');

      const requestBody = {
        amount: toPay?.toFixed(1) || '1.0',

        autoRedirect: '1',

        ...(user?.email && { emailAddr: user.email }),

        expiryDate: moment()
          .add(EASYPAISA_EXPIRY_TIME, 'minute')

          .format('YYYYMMDD HHmmss'),

        orderRefNum: orderNumber,

        paymentMethod: 'MA_PAYMENT_METHOD',

        postBackURL: `${servicesettings.payment_service}/api/payment/ep-callback`,

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

      // Auto-submit HTML form – most reliable on iOS

      const html = `

        <!DOCTYPE html>

        <html>

          <head>

            <meta name="viewport" content="width=device-width, initial-scale=1.0">

            <style>body { margin:0; padding:0; }</style>

          </head>

          <body onload="document.forms[0].submit()">

            <form method="POST" action="https://easypay.easypaisa.com.pk/easypay/Index.jsf">

              ${formBody

                .split('&')

                .map(pair => {
                  const [k, v] = pair.split('=');

                  const name = decodeURIComponent(k);

                  const value = decodeURIComponent(v);

                  return `<input type="hidden" name="${name}" value="${value}" />`;
                })

                .join('')}

            </form>

          </body>

        </html>

      `;

      setHtmlSource({ html });
    } catch (error) {
      console.error('🚨 Failed to prepare Easypay request:', error);

      Toast.show('Failed to initialize payment');

      onClose(null);
    }
  };

  const onNavigationStateChange = navState => {
    const { url } = navState;

    console.log('WebView URL:', url);

    // Step 1: Detect auth_token redirect

    if (url.includes('auth_token') && !tokenProcessed) {
      const params = parseQueryParams(url);

      const token = params['auth_token'];

      if (token) {
        const confirmUrl =
          onlinePaymentType?.paymentStatusEnquiryUri ||
          'https://easypay.easypaisa.com.pk/easypay/Confirm.jsf';

        const postBackURL = `${servicesettings.payment_service}/api/payment/ep-callback`; // Use same as initial

        const injectedJS = `

          (function() {

            const form = document.createElement('form');

            form.method = 'POST';

            form.action = '${confirmUrl}';

            const tokenInput = document.createElement('input');

            tokenInput.type = 'hidden';

            tokenInput.name = 'auth_token';

            tokenInput.value = '${token}';

            form.appendChild(tokenInput);

            const pbInput = document.createElement('input');

            pbInput.type = 'hidden';

            pbInput.name = 'postBackURL';

            pbInput.value = '${postBackURL}';

            form.appendChild(pbInput);

            document.body.appendChild(form);

            form.submit();

          })();

        `;

        webViewRef.current?.injectJavaScript(injectedJS);

        setTokenProcessed(true);
      }
    }

    // Step 2: Detect final result (success or failure)

    if (url.includes('message') || url.includes('Confirm.jsf')) {
      const params = parseQueryParams(url);

      const rawMessage = params['message'];

      const message = rawMessage
        ? decodeURIComponent(rawMessage.replace(/\+/g, ' '))
        : '';

      const orderRefNumber = params['orderRefNumber'];

      const amount = params['amount'];

      const transactionRefNumber = params['transactionRefNumber'];

      if (Object.keys(params).length > 0) {
        // Avoid duplicate calls

        if (
          message.includes('failed') ||
          message.includes('error') ||
          message
        ) {
          Toast.show(message || 'Payment failed');

          onClose(null);
        } else {
          Toast.show('Payment successful!');

          const paymentData = {
            orderRefNumber,

            message,

            amount,

            transactionRefNumber,
          };

          onClose(btoa(JSON.stringify(paymentData)));
        }
      }
    }
  };

  if (!isOpen) return null;

  if (!htmlSource) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#fff" />

        <Text style={styles.loadingText}>Initializing transaction...</Text>
      </View>
    );
  }

  return (
    <Modal visible={isOpen} transparent animationType="slide">
      <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
        <TouchableOpacity
          style={[styles.header, { backgroundColor: theme.modalBackColor }]}
          onPress={() => onClose(null)}
        >
          <AntdIcon name="close" size={24} color={theme.textColor} />

          <Text style={{ color: theme.textColor, fontSize: 16 }}>
            Easypaisa
          </Text>
        </TouchableOpacity>

        <WebView
          ref={webViewRef}
          source={htmlSource}
          onNavigationStateChange={onNavigationStateChange}
          javaScriptEnabled={true} // already have
          domStorageEnabled={true} // already have
          thirdPartyCookiesEnabled={true} // critical for sessions
          sharedCookiesEnabled={true} // critical
          cacheEnabled={true}
          scrollEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="compatibility"
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
          // New additions for iOS reliability:

          setSupportMultipleWindows={false} // prevents JS window.open issues
          allowsBackForwardNavigationGestures={true}
          pagingEnabled={false}
          bounces={false}
          overScrollMode="never"
          // Debug helpers

          onLoadStart={e => console.log('Load Start:', e.nativeEvent.url)}
          onLoadEnd={e => console.log('Load End:', e.nativeEvent.url)}
          onError={e => console.log('WebView Error:', e.nativeEvent)}
          onHttpError={e => console.log('HTTP Error:', e.nativeEvent)}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,

    backgroundColor: 'rgba(0,0,0,0.7)',

    alignItems: 'center',

    justifyContent: 'center',
  },

  loadingText: {
    color: '#fff',

    marginTop: 16,

    fontSize: 16,
  },

  header: {
    height: 50,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 16,

    gap: 8,
  },
});

export default EasypaisaRedirect;

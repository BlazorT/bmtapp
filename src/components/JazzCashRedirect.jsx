import axios from 'axios';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import { WebView } from 'react-native-webview';
import { keepOnlyAlphanumeric } from '../helper/dateFormatter';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/useUser';
import servicesettings from '../modules/dataservices/servicesettings';
import Toast from 'react-native-simple-toast';

const JazzCashRedirect = ({ isOpen, onClose, toPay, onlinePaymentType }) => {
  const theme = useTheme();
  const { user } = useUser();
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false); // Prevent multiple triggers

  React.useEffect(() => {
    if (isOpen) initiatePayment();
  }, [isOpen]);

  const initiatePayment = async () => {
    try {
      setLoading(true);

      const TxnDateTime = new Date()
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 14);
      const TxnRefNumber = `BMT${TxnDateTime}`;

      const TxnExpiryDateTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .replace(/[-T:.Z]/g, '')
        .slice(0, 14);

      const billRef =
        `${keepOnlyAlphanumeric((Number(user.orgId) ?? '') + 'RBMT')}` +
        'D' +
        moment().format('YYYYMMDDHHmmss');

      const transactionDetails = {
        pp_Amount: parseInt(toPay?.toFixed(2) * 100), // JazzCash requires amount in paisa
        pp_BillReference: billRef,
        pp_Description: `Payment for ${billRef}`,
        pp_Language: 'EN',
        pp_MerchantID: onlinePaymentType?.merchantAccountId,
        pp_Password: onlinePaymentType?.secretKey,
        pp_ReturnURL:
          onlinePaymentType?.callBackUri ||
          'https://hotmealzndealz.com/externalapi/ExternalPaymentsApi/jc-return-url',
        pp_TxnCurrency: 'PKR',
        pp_TxnDateTime: TxnDateTime,
        pp_TxnExpiryDateTime: TxnExpiryDateTime,
        pp_TxnRefNo: TxnRefNumber,
        pp_TxnType: 'MPAY',
        pp_BankID: '',
        pp_ProductID: '',
        pp_Version: '1.1',
        ppmpf_1: keepOnlyAlphanumeric(user?.email ?? ''),
        ppmpf_2: '',
        ppmpf_3: 'mobile',
      };
      const response = await axios.post(
        `${servicesettings.payment_service}/api/payment/jc-secure-hash`,
        transactionDetails,
      );
      const url =
        response?.data?.redirectUrl ||
        'https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/';
      const formHtml = `
  <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          background: #fff;
          font-family: sans-serif;
        }
        form {
          margin: 0;
          padding: 0;
        }
        .jsformWrapper {
          border: 0px solid rgba(196, 21, 28, 0.5);
          padding: 2rem 2rem 4rem;
          width: 600px;
          margin: 2rem auto 0;
          border-radius: 2px;
        }
        .jsformWrapper button {
          background: rgba(196, 21, 28, 1);
          border: none;
          color: #fff;
          width: 120px;
          height: 40px;
          font-size: 16px;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
        }
      </style>
    </head>
    <body onload="document.forms[0].submit();">
      <h1 style="text-align: center; color: rgba(196, 21, 28, 1); margin-top: 3rem;">JazzCash Payment Redirect...</h1>
      <div class="jsformWrapper">
        <form method="post" action="${url}">
          <input type="hidden" name="pp_Version" value="${transactionDetails.pp_Version}" />
          <input type="hidden" name="pp_TxnType" value="${transactionDetails.pp_TxnType}" />
          <input type="hidden" name="pp_Language" value="${transactionDetails.pp_Language}" />
          <input type="hidden" name="pp_MerchantID" value="${transactionDetails.pp_MerchantID}" />
          <input type="hidden" name="pp_Password" value="${transactionDetails.pp_Password}" />
          <input type="hidden" name="pp_TxnRefNo" value="${TxnRefNumber}" />
          <input type="hidden" name="pp_Amount" value="${transactionDetails.pp_Amount}" />
          <input type="hidden" name="pp_TxnCurrency" value="${transactionDetails.pp_TxnCurrency}" />
          <input type="hidden" name="pp_TxnDateTime" value="${TxnDateTime}" />
          <input type="hidden" name="pp_BillReference" value="${transactionDetails.pp_BillReference}" />
          <input type="hidden" name="pp_Description" value="${transactionDetails.pp_Description}" />
          <input type="hidden" name="pp_BankID" value="${transactionDetails.pp_BankID}" />
          <input type="hidden" name="pp_ProductID" value="${transactionDetails.pp_ProductID}" />
          <input type="hidden" name="pp_TxnExpiryDateTime" value="${TxnExpiryDateTime}" />
          <input type="hidden" name="pp_ReturnURL" value="${transactionDetails.pp_ReturnURL}" />
          <input type="hidden" name="pp_SecureHash" value="${response.data.secureHash}" />
          <input type="hidden" name="ppmpf_1" value="${transactionDetails.ppmpf_1}" />
          <input type="hidden" name="ppmpf_2" value="${transactionDetails.ppmpf_2}" />
          <input type="hidden" name="ppmpf_3" value="${transactionDetails.ppmpf_3}" />
        </form>
      </div>
    </body>
  </html>
`;

      setPaymentUrl({
        uri: url,
        body: formHtml,
      });
      setShowWebView(true);
    } catch (error) {
      Toast.show('Payment initiation failed:');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const parseQueryParams = url => {
    const queryString = url.split('?')[1];
    const params = {};
    if (!queryString) return params;

    queryString.split('&').forEach(part => {
      const [key, value] = part.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });

    return params;
  };

  const handleNavigationStateChange = useCallback(
    navState => {
      // Prevent handling navigation state change after payment is processed
      if (isPaymentProcessed) return;

      // Ignore unnecessary "about:blank" URLs or the callback URL if already processed
      if (
        navState.url.includes('about:blank') ||
        navState.url.includes('jc-callback') ||
        isPaymentProcessed
      ) {
        return;
      }

      // Look for the callback URL from JazzCash
      if (navState.url.includes('checkout')) {
        const params = parseQueryParams(navState.url);
        const status = params['pp_ResponseCode'];
        const pp_TxnType = params['pp_TxnType'] || '';
        const pp_Amount = params['pp_Amount'] || '';
        const pp_BillReference = params['pp_BillReference'] || '';
        const pp_ResponseCode = params['pp_ResponseCode'] || '';
        const pp_RetreivalReferenceNo = params['pp_RetreivalReferenceNo'] || '';
        const pp_SubMerchantID = params['pp_SubMerchantID'] || '';
        const pp_TxnCurrency = params['pp_TxnCurrency'] || '';
        const pp_TxnDateTime = params['pp_TxnDateTime'] || '';
        const pp_TxnRefNo = params['pp_TxnRefNo'] || '';
        const pp_MobileNumber = params['pp_MobileNumber'] || '';
        const pp_CNIC = params['pp_CNIC'] || '';
        const pp_SecureHash = params['pp_SecureHash'] || '';
        const pp_ResponseMessage = params['pp_ResponseMessage'] || '';

        const filteredResponse = {
          pp_TxnType,
          pp_Amount,
          pp_BillReference,
          pp_ResponseCode,
          pp_RetreivalReferenceNo,
          pp_SubMerchantID,
          pp_TxnCurrency,
          pp_TxnDateTime,
          pp_TxnRefNo,
          pp_MobileNumber,
          pp_CNIC,
          pp_SecureHash,
        };

        if (status === '000') {
          setIsPaymentProcessed(true); // Mark payment as processed
          setTimeout(() => {
            onClose(btoa(JSON.stringify(filteredResponse)));
          }, 1000);
          // You can add additional success handling here
        } else {
          setTimeout(() => {
            Toast.show(pp_ResponseMessage || 'Payment has been canceled');
            onClose();
          }, 1000);
          // Handle payment failure
        }

        setShowWebView(false); // Hide WebView after processing
      }
    },
    [isPaymentProcessed],
  );

  if (!showWebView || !paymentUrl) {
    return (
      <Modal
        visible={isOpen}
        backdropColor={'transparent'}
        transparent
        animationType="slide"
      >
        <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
          <TouchableOpacity
            style={[styles.header, { backgroundColor: theme.modalBackColor }]}
            onPress={() => onClose(null)}
          >
            <AntdIcon name="close" size={24} color={theme.textColor} />
            <Text style={{ color: theme.textColor }}>JazzCash</Text>
          </TouchableOpacity>
          <View style={[styles.loaderContainer, { top: 50 }]}>
            <ActivityIndicator size="large" color="#C4151C" />
          </View>
        </View>
      </Modal>
    );
  }

  // if (showWebView && paymentUrl) {
  //   return (
  //     <WebView
  //       originWhitelist={['*']}
  //       source={{
  //         method: 'POST',
  //         uri: paymentUrl.uri,
  //         html: paymentUrl.body,
  //       }}
  //       onNavigationStateChange={handleNavigationStateChange}
  //       style={styles.webview}
  //       javaScriptEnabled={true}
  //       domStorageEnabled={true}
  //       startInLoadingState={true}
  //       renderLoading={() => <ActivityIndicator size="large" color="#4A5568" />}
  //     />
  //   );
  // }
  if (showWebView && paymentUrl) {
    return (
      <Modal
        visible={isOpen}
        backdropColor={'transparent'}
        transparent
        animationType="slide"
      >
        <View style={{ flex: 1, marginTop: Platform.OS === 'ios' ? 50 : 0 }}>
          <TouchableOpacity
            style={[styles.header, { backgroundColor: theme.modalBackColor }]}
            onPress={() => onClose(null)}
          >
            <AntdIcon name="close" size={24} color={theme.textColor} />
            <Text style={{ color: theme.textColor }}>JazzCash</Text>
          </TouchableOpacity>
          {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#C4151C" />
            </View>
          )}
          <WebView
            originWhitelist={['*']}
            source={{
              html: paymentUrl.body,
              baseUrl: '',
            }}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            onNavigationStateChange={handleNavigationStateChange}
            javaScriptEnabled
            domStorageEnabled
            scalesPageToFit
            startInLoadingState
          />
        </View>
      </Modal>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    position: 'absolute',
    zIndex: 999,
    backgroundColor: 'rgba(255,255,255,1)',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
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

export default JazzCashRedirect;

import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Text,
  View,
} from 'react-native';
import { AppLifecycle } from 'react-native-applifecycle';
import { useTheme } from '../hooks/useTheme';
import { useJCInquiry } from '../hooks/useJazzCash';
import Toast from 'react-native-simple-toast';
import useCountdownTimer from '../hooks/useCountdownTimer';

const JCPaymentConfirm = ({
  isVisible,
  toggleModal,
  jazzCashTxnRefNo,
  onCheckout,
  setShowJCPayment,
  setOrderDetail,
  selectedGateway,
  setPaymentError,
}) => {
  const theme = useTheme();
  const { inquireJC } = useJCInquiry();
  const lastState = useRef(null);

  React.useEffect(() => {
    if (!isVisible || !jazzCashTxnRefNo) return;

    // Run it immediately
    handleConfirm();

    // Set up polling every 5 minutes
    const intervalId = setInterval(
      () => {
        handleConfirm();
      },
      // 5000,
      30 * 1000,
    ); // 5 minutes

    return () => clearInterval(intervalId); // Cleanup
  }, [isVisible, jazzCashTxnRefNo]);

  React.useEffect(() => {
    if (!isVisible) return;

    let isMounted = true;
    lastState.current = null;

    const listener = AppLifecycle.addEventListener('change', state => {
      if (!isMounted) return;

      if (state === 'active' && lastState.current !== 'active') {
        handleConfirm();
      }
      lastState.current = state;
    });

    return () => {
      isMounted = false;
      listener.remove();
    };
  }, [isVisible]);

  const handleConfirm = async () => {
    if (!jazzCashTxnRefNo) {
      setShowJCPayment(false);
      Toast.show('Payment has been canceled');
      setPaymentError('Payment has been canceled');
      return;
    }
    const body = {
      txnRefNo: jazzCashTxnRefNo,
    };
    const res = await inquireJC(body);
    if (res) {
      if (res?.pp_PaymentResponseCode === '121') {
        setShowJCPayment(false);
        Toast.show('Payment has been confirmed successfully!');
        onCheckout(btoa(JSON.stringify(res)));
      } else if (res?.pp_PaymentResponseCode === '999') {
        setShowJCPayment(false);
        const message = `Payment did not approved.\n${
          res?.pp_PaymentResponseMessage ||
          'JazzCash payment failed. Please try again.'
        }`;
        Toast.show(message);
        setPaymentError(message);
      }
    }
  };

  const timer = useCountdownTimer(10 * 60, isVisible); // second param triggers reset

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} backdropColor={'transparent'} transparent>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)', // optional dim backdrop
        }}
      >
        <View
          style={{
            backgroundColor: theme.modalBackColor,
            paddingHorizontal: 15,
            paddingVertical: 15,
            justifyContent: 'center',
            alignItems: 'center',
            width: '90%',
            borderRadius: 12,
            shadowColor: theme.textColor,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
            alignSelf: 'center',
            marginTop: Platform.OS === 'ios' ? 50 : 0,
          }}
        >
          {selectedGateway?.logo ? (
            <Image
              source={{
                uri: `data:image/png;base64,${selectedGateway.logo}`,
              }}
              style={{
                width: 50,
                height: 50,
              }}
              resizeMode="contain"
            />
          ) : null}

          {/* Spinner */}
          <ActivityIndicator
            color={theme.selectedCheckBox}
            size="large"
            style={{ marginVertical: 20 }}
          />

          {/* Status text */}
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 4,
              fontSize: 22,
              color: theme.textColor,
            }}
          >
            Waiting for Payment Approval
          </Text>
          <Text
            style={{
              textAlign: 'center',
              color: theme.placeholderColor,
              marginBottom: 20,
            }}
          >
            This may take up to 10 minutes
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: theme.selectedCheckBox,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: theme.textColor,
                fontWeight: '700',
                fontSize: 13,
              }}
            >
              ⏱ Remaining:
            </Text>
            <Text
              style={{
                color: theme.textColor,
                fontWeight: '700',
                fontSize: 13,
              }}
              translate={false}
            >
              {timer}
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{
              width: '100%',
              height: 0.5,
              backgroundColor: theme.placeholderColor,
              marginBottom: 16,
            }}
          />

          {/* Steps label */}
          <Text
            style={{
              alignSelf: 'flex-start',
              color: theme.placeholderColor,
              marginBottom: 10,
              letterSpacing: 0.5,
              fontSize: 12,
            }}
          >
            FOLLOW THESE STEPS
          </Text>

          {/* Steps */}
          {[
            { step: '1', text: 'Open your JazzCash app' },
            { step: '2', text: 'Tap the 👤 profile icon at top right' },
            { step: '3', text: 'Tap on Payment Requests' },
            { step: '4', text: 'Select the Pending tab' },
            { step: '5', text: 'Approve your payment' },
          ].map(({ step, text }) => (
            <View
              key={step}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginBottom: 10,
                width: '100%',
              }}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: theme.selectedCheckBox,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: theme.textColor,
                    fontSize: 13,
                  }}
                >
                  {step}
                </Text>
              </View>
              <Text
                style={{
                  flex: 1,
                  fontWeight: '700',
                  color: theme.textColor,
                  fontSize: 13,
                }}
              >
                {text}
              </Text>
            </View>
          ))}
          {/* <Text
            style={{ color: theme.textColor, fontSize: 18, marginVertical: 6 }}
          >
            Remaining time: {timer}
          </Text> */}
          {/* <Button
          title={'Button.Cancel'}
          onPress={onCancel}
          style={{width: '100%'}}
        /> */}
        </View>
      </View>
    </Modal>
  );
};

export default JCPaymentConfirm;

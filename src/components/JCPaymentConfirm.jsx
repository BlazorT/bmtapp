import React, { useRef } from 'react';
import { ActivityIndicator, Modal, Platform, Text, View } from 'react-native';
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
      1 * 60 * 1000,
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
        Toast.show(
          res?.pp_PaymentResponseMessage || 'Payment has been canceled',
        );
      }
    }
  };

  const timer = useCountdownTimer(10 * 60, isVisible); // second param triggers reset

  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} backdropColor={'transparent'} transparent>
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
        {/* <CloseIcon onPress={toggleModal} /> */}
        <Text
          style={{
            color: theme.textColor,
            fontSize: 22,
            fontWeight: '700',
          }}
        >
          Jazz Cash
        </Text>
        {/* <SuccessIcon loop icon={require('../assets/gifs/loader.json')} /> */}
        <View style={{ width: 200 }}>
          <ActivityIndicator
            color={theme.buttonBackColor}
            style={{
              transform: [{ scaleX: 5 }, { scaleY: 5 }],
              marginVertical: 50,
            }}
          />
        </View>
        <Text style={{ color: theme.textColor, fontSize: 18 }}>
          Confirming payment it may take some time, might be upto 10 min....
        </Text>
        <Text
          style={{
            color: theme.buttonBackColor,
            fontSize: 18,
            marginVertical: 6,
          }}
        >
          Please approve the payment request in your JazzCash app to complete
          your order.
        </Text>

        <Text
          style={{ color: theme.textColor, fontSize: 18, marginVertical: 6 }}
        >
          Remaining time: {timer}
        </Text>
        {/* <Button
          title={'Button.Cancel'}
          onPress={onCancel}
          style={{width: '100%'}}
        /> */}
      </View>
    </Modal>
  );
};

export default JCPaymentConfirm;

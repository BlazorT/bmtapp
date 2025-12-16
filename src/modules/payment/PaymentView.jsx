import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '../../hooks/useTheme';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import servicesettings from '../dataservices/servicesettings';
import PaymentType from '../../components/PaymentType';
import EasyPaisaPay from '../../components/EasyPaisaPay';
import RNSButton from '../../components/Button';
import EasypaisaRedirect from '../../components/EasypaisaRedirect';
import JazzCashPay from '../../components/JazzCashPay';
import JazzCashRedirect from '../../components/JazzCashRedirect';

const PaymentView = ({
  onPayComplete,
  selectedGateway,
  easypaisaOption,
  easyPaisaMobileNumber,
  setSelectedGetway,
  setEasypaisaOption,
  setEasyPaisaMobileNumber,
  jazzCashMobileNumber,
  jazzCashNic,
  jazzCashOption,
  setJazzCashMobileNumber,
  setJazzCashNic,
  setJazzCashOption,
  toPay,
}) => {
  const theme = useTheme();

  const [gateways, setGateways] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEPRedirectOpen, setIsEPRedirectOpen] = useState(false);
  const [isJCRedirectOpen, setIsJCRedirectOpen] = useState(false);

  useEffect(() => {
    fetchPaymentGateways();
  }, []);

  const onEPRedirectClose = ref => {
    setIsEPRedirectOpen(false);
    if (ref) {
      onPayComplete(ref);
    }
  };

  const onJCRedirectClose = ref => {
    setIsJCRedirectOpen(false);
    if (ref) {
      onPayComplete(ref);
    }
  };

  const fetchPaymentGateways = async () => {
    try {
      setLoading(true);

      let headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          storeId: 1,
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.gateway_key,
        },
      };
      const response = await fetch(
        //
        servicesettings.payment_gateways,
        headerFetch,
      );
      if (!response.ok) {
        Toast.show('Something went wrong, please try again');
        return;
      }

      const res = await response.json();
      console.log({ res });
      if (res?.status && Array.isArray(res?.data)) {
        const filterGateways = res?.data?.filter(d => d?.status == 1);
        setGateways(filterGateways);
      } else {
        Toast.show(res?.message || 'Something went wrong, try again later!');
      }
    } catch (error) {
      Toast.show(error?.message || 'Something went wrong, try again later!');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentType = paymentOption => {
    setSelectedGetway(paymentOption);
  };

  const handleOrderDetail = (value, key) => {
    if (key === 'easypaisaOption') {
      setEasypaisaOption(value);
    }
    if (key === 'easyPaisaMobileNumber') {
      setEasyPaisaMobileNumber(value);
    }
    if (key === 'jazzCashMobileNumber') {
      setJazzCashMobileNumber(value);
    }
    if (key === 'jazzCashNic') {
      setJazzCashNic(value);
    }
    if (key === 'jazzCashOption') {
      setJazzCashOption(value);
    }
  };

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.backgroundColor },
      ]}
      scrollEnabled={false}
    >
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{ color: theme.textColor }}
        color={theme.textColor}
      />
      {gateways?.length === 0 && !loading && (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: theme.placeholderColor }]}>
            No gateways found
          </Text>
        </View>
      )}
      {!selectedGateway &&
        gateways?.length > 0 &&
        gateways.map(item => (
          <PaymentType
            key={item.id}
            handleOrderDetail={handlePaymentType}
            {...item}
          />
        ))}

      {selectedGateway?.name?.toLowerCase() == 'easypaisa' && (
        <EasyPaisaPay
          orderDetail={{
            onlinePaymentType: selectedGateway,
            easypaisaOption,
            easyPaisaMobileNumber,
          }}
          handleOrderDetail={handleOrderDetail}
          setIsEPRedirectOpen={setIsEPRedirectOpen}
          //   cartTotal={cartTotal}
        />
      )}
      {selectedGateway?.name?.toLowerCase() == 'jazzcash' && (
        <JazzCashPay
          orderDetail={{
            onlinePaymentType: selectedGateway,
            jazzCashNic,
            jazzCashMobileNumber,
            jazzCashOption,
          }}
          handleOrderDetail={handleOrderDetail}
          setIsJCRedirectOpen={setIsJCRedirectOpen}
          //   cartTotal={cartTotal}
        />
      )}
      <EasypaisaRedirect
        isOpen={isEPRedirectOpen}
        onClose={onEPRedirectClose}
        onlinePaymentType={selectedGateway}
        toPay={toPay}
      />
      <JazzCashRedirect
        isOpen={isJCRedirectOpen}
        onClose={onJCRedirectClose}
        onlinePaymentType={selectedGateway}
        toPay={toPay}
      />
      {selectedGateway?.id && gateways?.length > 1 && (
        <RNSButton
          style={{
            width: '100%',
            borderColor: theme.textColor,
            borderWidth: 0.8,
            borderRadius: 6,
            borderStyle: 'dashed',
          }}
          bgColor={'transparent'}
          textStyle={{ color: theme.textColor }}
          caption="Change Payment Method"
          onPress={() => setSelectedGetway(null)}
        />
      )}
    </KeyboardAwareScrollView>
  );
};

export default PaymentView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // paddingHorizontal: 5,
    // paddingVertical: 5,
    rowGap: 10,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 10,
  },
  emptyText: {
    fontSize: 16,
  },
});

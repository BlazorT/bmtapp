import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../hooks/useTheme';
import RNSButton from './Button';
import Divider from './Divider';

const JazzCashPay = ({
  orderDetail,
  handleOrderDetail,
  setIsJCRedirectOpen,
}) => {
  const theme = useTheme();
  const { onlinePaymentType } = orderDetail;
  const navigation = useNavigation();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackColor,
          shadowColor: theme.buttonBackColor,
        },
      ]}
    >
      {orderDetail?.jazzCashOption === 'wallet' && (
        <>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              rowGap: 6,
            }}
          >
            {onlinePaymentType.icon && (
              <FontAwesome
                name={'credit-card'}
                style={{ fontSize: 40, color: theme.textColor }}
              />
            )}
            {onlinePaymentType.logo && (
              <Image
                source={{
                  uri: `data:image/png;base64,${onlinePaymentType.logo}`,
                }}
                style={{
                  width: 50,
                  height: 50,
                }}
                resizeMode="contain"
              />
            )}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                fontWeight: '700',
                color: theme.textColor,
              }}
            >
              {onlinePaymentType.name}
            </Text>
          </View>
          <View style={{ width: '100%', marginTop: 10, rowGap: 6 }}>
            <TextInput
              placeholder="JazzCash Account Number e.g 03001234567"
              placeholderTextColor={theme.placeholderColor}
              value={orderDetail.jazzCashMobileNumber}
              onChangeText={value =>
                handleOrderDetail(value, 'jazzCashMobileNumber')
              }
              keyboardType="numeric"
              maxLength={11}
              style={{
                width: '100%',
                backgroundColor: theme.inputBackColor,
                color: theme.textColor,
                borderRadius: 6,
                paddingHorizontal: 10,
                fontSize: 16,
                borderWidth: 1,
                height: 45,
              }}
            />
            <TextInput
              placeholder="From Right Side 6 Digits of CNIC*"
              placeholderTextColor={theme.placeholderColor}
              value={orderDetail.jazzCashNic}
              onChangeText={value => handleOrderDetail(value, 'jazzCashNic')}
              keyboardType="numeric"
              maxLength={6}
              style={{
                width: '100%',
                backgroundColor: theme.inputBackColor,
                color: theme.textColor,
                borderRadius: 6,
                paddingHorizontal: 10,
                fontSize: 16,
                borderWidth: 1,
                height: 45,
              }}
            />
          </View>
          <RNSButton
            style={{ width: '100%', marginTop: 10 }}
            bgColor={theme.buttonBackColor}
            caption="Change JazzCash Mode"
            onPress={() => handleOrderDetail('', 'jazzCashOption')}
          />
        </>
      )}
      {orderDetail?.jazzCashOption === '' && (
        <>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              columnGap: 6,
            }}
          >
            {orderDetail?.onlinePaymentType?.logo && (
              <Image
                source={{
                  uri: `data:image/svg+xml;base64,${onlinePaymentType.logo}`,
                }}
                style={{
                  width: 50,
                  height: 50,
                }}
                resizeMode="contain"
              />
            )}
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                fontWeight: '700',
                color: theme.textColor,
              }}
            >
              {orderDetail?.onlinePaymentType?.name ?? ' JazzCash'}
            </Text>
          </View>
          <RNSButton
            style={{ width: '100%', marginTop: 10 }}
            bgColor={theme.buttonBackColor}
            caption="Pay From Mobile Wallet"
            onPress={() => handleOrderDetail('wallet', 'jazzCashOption')}
          />

          <Divider text={'OR'} />
          <RNSButton
            style={{ width: '100%', marginTop: 10 }}
            bgColor={theme.buttonBackColor}
            caption="Pay Through Card"
            onPress={() => {
              setIsJCRedirectOpen(true);
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 3,
    width: '100%',
  },
  helperText: {
    position: 'absolute',
    top: 5,
    right: 0,
    left: 0,
    bottom: 0,
    textAlign: 'center',
  },
});
export default JazzCashPay;

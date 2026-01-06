import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../hooks/useTheme';
import RNSButton from './Button';
import Divider from './Divider';
import { TextInput } from '.';

const EasyPaisaPay = ({
  orderDetail,
  handleOrderDetail,
  setIsEPRedirectOpen,
}) => {
  const { onlinePaymentType, easypaisaOption } = orderDetail;
  const navigation = useNavigation();
  const theme = useTheme();

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
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: 6,
        }}
      >
        {easypaisaOption === '' && (
          <>
            {onlinePaymentType.logo ? (
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
            ) : (
              <FontAwesome
                name={'credit-card'}
                style={{ fontSize: 40, color: theme.textColor }}
              />
            )}
          </>
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
      <Text
        style={{
          textAlign: 'center',
          color: theme.placeholderColor,
          marginVertical: 10,
        }}
      >
        Please ensure you have the EasyPaisa app installed on your device to
        receive payment notifications and complete your payment smoothly.
      </Text>
      {!easypaisaOption && (
        <View style={{ rowGap: 6, width: '100%' }}>
          <RNSButton
            style={{ width: '100%', marginTop: 10 }}
            bgColor={theme.buttonBackColor}
            caption="Easy Paisa Quick Pay"
            onPress={() => handleOrderDetail('quickPay', 'easypaisaOption')}
            nIcon={
              <FontAwesome
                name={'flash'}
                style={{ fontSize: 22, color: theme.textColor }}
              />
            }
          />

          <Divider text={'Or'} />
          <RNSButton
            style={{ width: '100%' }}
            bgColor={theme.buttonBackColor}
            caption="Easy Paisa Checkout"
            onPress={() => setIsEPRedirectOpen(true)}
            nIcon={
              <FontAwesome
                name={'external-link'}
                style={{ fontSize: 22, color: theme.textColor }}
              />
            }
          />
        </View>
      )}
      {easypaisaOption == 'quickPay' && (
        <View style={{ rowGap: 6, width: '100%' }}>
          <TextInput
            placeholder="Easy Paisa Account Number e.g 03001234567"
            placeholderTextColor={theme.placeholderColor}
            value={orderDetail.easyPaisaMobileNumber}
            onChangeText={value =>
              handleOrderDetail(value, 'easyPaisaMobileNumber')
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
          <RNSButton
            style={{ width: '100%', marginTop: 10 }}
            bgColor={theme.buttonBackColor}
            caption="CHANGE EASYPAISA MODE"
            onPress={() => handleOrderDetail('', 'easypaisaOption')}
          />
        </View>
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

export default EasyPaisaPay;

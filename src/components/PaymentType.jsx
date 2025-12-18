import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PaymentType = ({
  id,
  name,
  logo,
  merchantAccountId,
  handleOrderDetail,
  disabled,
  url,
  cert,
  secretKey,
  primaryKey,
}) => {
  const theme = useTheme();

  const onPaymentType = () => {
    // console.log(first)
    handleOrderDetail({
      id,
      name,
      logo,
      merchantAccountId,
      url,
      cert,
      secretKey,
      primaryKey,
    });
  };
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={!disabled && onPaymentType}
      style={[
        styles.card,
        {
          backgroundColor: theme.cardBackColor,
          shadowColor: theme.buttonBackColor,
        },
      ]}
    >
      {id == 3 && (
        <Text
          style={[
            styles.helperText,
            {
              color: theme.lightGray,
            },
          ]}
        >
          We never store or share your card information.
        </Text>
      )}
      {logo ? (
        <Image
          source={{ uri: `data:image/svg+xml;base64,${logo}` }}
          style={{
            width: 50,
            height: 50,
            // tintColor: theme.textColor,
          }}
          resizeMode="contain"
        />
      ) : (
        <FontAwesome
          name={'credit-card'}
          style={{ fontSize: 40, color: theme.textColor }}
        />
      )}
      <Text
        style={{
          textAlign: 'center',
          fontSize: 22,
          color: theme.textColor,
          fontWeight: '700',
        }}
      >
        {name}
      </Text>
      <MaterialIcon
        name={'keyboard-arrow-right'}
        style={{
          fontSize: 24,
          color: theme.textColor,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    margin: 2,
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

export default PaymentType;

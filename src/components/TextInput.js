import React from 'react';
import {Platform, StyleSheet, TextInput, View} from 'react-native';

import {colors, fonts} from '../styles';

const RNSTextInput = ({
  type,
  dark,
  style,
  placeholderTextColor,
  ...restProps
}) => {
  const finalStyle = [
    styles.default,
    //type === 'bordered' && styles.bordered,
    dark && styles.dark,
    style && style,
  ];

  return (
    <View style={{alignSelf: 'stretch', flexDirection: 'column'}}>
      <TextInput
        placeholderTextColor={placeholderTextColor || colors.white}
        //underlineColorAndroid="none"
        {...restProps}
        style={finalStyle}
      />
      {Platform.OS === 'ios' && (
        <View style={{height: 0.5, backgroundColor: 'white'}} />
      )}
    </View>
  );
};

const HEIGHT = 40;

const styles = StyleSheet.create({
  default: {
    height: HEIGHT,
    color: 'white',
    //borderLeftWidth:0,
    // borderLeftColor: colors.borderColor,
    paddingLeft: 10,
    margin: 0.8,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    height: 46,
    fontFamily: fonts.primaryRegular,
    ...Platform.select({
      android: {
        marginLeft: 0,
        //opacity: 0.9,
      },
    }),
  },
  bordered: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 5,
    paddingHorizontal: 20,
  },
  dark: {
    color: colors.gray,
  },
  primary: {
    borderRadius: HEIGHT / 2,
    backgroundColor: 'transparent',
  },
});

export default RNSTextInput;

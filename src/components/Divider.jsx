import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';

const Divider = ({
  text,
  height = 1,
  color,
  borderStyle = 'solid',
  textStyle,
}) => {
  const theme = useTheme();
  const themeMode = useSelector(state => state.theme.mode);

  return (
    <View style={common.divider}>
      <View
        style={[
          common.line,
          {
            borderColor:
              color || themeMode == 'light' ? theme.lightGray : theme.lightGray,
            borderTopWidth: height,
            borderStyle: borderStyle,
          },
        ]}
      />
      {text && (
        <Text
          style={[common.dividerText, { color: theme.textColor }, textStyle]}
        >
          {text}
        </Text>
      )}
      <View
        style={[
          common.line,
          {
            borderColor:
              color || themeMode == 'light' ? theme.lightGray : theme.lightGray,
            borderTopWidth: height,
            borderStyle: borderStyle,
          },
        ]}
      />
    </View>
  );
};
const common = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  line: {
    flex: 1,
    height: 0,
  },
  dividerText: {
    marginHorizontal: 5,
  },
});
export default Divider;

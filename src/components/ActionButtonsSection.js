// components/ActionButtonsSection.js
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Button from '../components/Button';

export default function ActionButtonsSection({ onCancel, onSubmit, theme }) {
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Button
        style={[styles.button, { flexBasis: '47%' }]}
        bgColor={theme.buttonBackColor}
        caption="Cancel"
        onPress={onCancel}
      />
      <Button
        style={[styles.button, { flexBasis: '47%' }]}
        bgColor={theme.buttonBackColor}
        caption="Submit"
        onPress={onSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 7,
    marginBottom: 40,
    width: Dimensions.get('window').width - 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  button: {
    height: 45,
    borderRadius: 5,
    borderWidth: 0,
  },
});

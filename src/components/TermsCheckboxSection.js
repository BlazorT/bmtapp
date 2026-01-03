// components/TermsCheckboxSection.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

export default function TermsCheckboxSection({
  selectterms,
  setselectterms,
  setModalVisible,
  theme,
}) {
  return (
    <View style={styles.container}>
      <CheckBox
        value={selectterms}
        style={styles.checkbox}
        onValueChange={setselectterms}
        lineWidth={1.0}
        boxType="square"
        tintColors={{
          true: theme.selectedCheckBox,
          false: theme.buttonBackColor,
        }}
      />
      <Text style={[styles.label, { color: theme.selectedCheckBox }]}>
        Agree with
      </Text>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={[styles.labelLink, { color: theme.selectedCheckBox }]}>
          Terms & Conditions (EULA)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'center',
  },
  checkbox: {
    height: 18,
    width: 18,
    margin: 5,
  },
  label: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  labelLink: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

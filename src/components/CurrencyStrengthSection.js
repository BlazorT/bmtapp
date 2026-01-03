// components/CurrencyStrengthSection.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../styles';
import { Dropdown, TextInput } from '.';

export default function CurrencyStrengthSection({
  CurrencyItem,
  currencySelectedId,
  setCurrencySelectedId,
  setSelectedCurrencyId,
  strength,
  setStrength,
  theme,
}) {
  const handleCurrencySelect = index => {
    setCurrencySelectedId(index);
    setSelectedCurrencyId(CurrencyItem[index].id);
  };

  return (
    <View style={styles.container}>
      <View style={{ width: '53%' }}>
        <Dropdown
          placeholderTextColor={theme.placeholderColor}
          onSelect={handleCurrencySelect}
          selectedIndex={currencySelectedId}
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
            },
          ]}
          items={CurrencyItem}
          placeholder="Select Currency..."
          clearTextOnFocus={true}
          keyboardAppearance="dark"
          maxLength={5}
        />
      </View>
      <View style={{ width: '43%' }}>
        <TextInput
          placeholderTextColor={theme.placeholderColor}
          style={[
            styles.strengthInput,
            { backgroundColor: theme.inputBackColor, color: theme.textColor },
          ]}
          value={strength}
          onChangeText={setStrength}
          placeholder="Strength"
          clearTextOnFocus={false}
          keyboardAppearance="dark"
          keyboardType="phone-pad"
          maxLength={50}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdown: {
    borderRadius: 4,
    height: 46,
    fontSize: 15,
    borderWidth: 0,
  },
  strengthInput: {
    borderRadius: 4,
    fontSize: 15,
    borderWidth: 0,
    height: 41,
  },
});

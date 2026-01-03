// components/BasicInfoSection.js
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import TextInput from '../components/TextInput';
import colors from '../styles/colors';
import { useTheme } from '../hooks/useTheme';

export default function BasicInfoSection({
  orgName,
  setOrgName,
  Email,
  setEmail,
  Contact,
  setContact,
  orgAddress,
  setOrgAddress,
}) {
  const theme = useTheme();
  const [focusStates, setFocusStates] = useState({
    orgName: false,
    email: false,
    contact: false,
  });

  const handleFocus = (field, value) => {
    setFocusStates(prev => ({ ...prev, [field]: value }));
  };

  const getInputStyle = isFocused => {
    return isFocused ? styles.inputOnFocus : styles.input;
  };

  return (
    <>
      <TextInput
        placeholderTextColor={theme.placeholderColor}
        style={[
          getInputStyle(focusStates.orgName),
          orgName === '' && styles.mandatory,
          { backgroundColor: theme.inputBackColor, color: theme.textColor },
        ]}
        value={orgName}
        onChangeText={setOrgName}
        onEndEditing={() => handleFocus('orgName', false)}
        onFocus={() => handleFocus('orgName', true)}
        placeholder="Organization Name"
        clearTextOnFocus={true}
        keyboardAppearance="dark"
        maxLength={50}
      />

      <TextInput
        placeholderTextColor={theme.placeholderColor}
        value={Email}
        onChangeText={setEmail}
        onEndEditing={() => handleFocus('email', false)}
        onFocus={() => handleFocus('email', true)}
        style={[
          getInputStyle(focusStates.email),
          Email === '' && styles.mandatory,
          { backgroundColor: theme.inputBackColor, color: theme.textColor },
        ]}
        keyboardType="email-address"
        placeholder="Email"
        clearTextOnFocus={true}
        keyboardAppearance="dark"
        maxLength={40}
      />

      <TextInput
        placeholderTextColor={theme.placeholderColor}
        style={[
          getInputStyle(focusStates.contact),
          Contact === '' && styles.mandatory,
          { backgroundColor: theme.inputBackColor, color: theme.textColor },
        ]}
        value={Contact}
        onChangeText={setContact}
        onEndEditing={() => handleFocus('contact', false)}
        onFocus={() => handleFocus('contact', true)}
        placeholder="Contact"
        clearTextOnFocus={false}
        keyboardAppearance="dark"
        keyboardType="phone-pad"
        maxLength={50}
      />

      <TextInput
        multiline={true}
        textAlignVertical="top"
        placeholderTextColor={theme.placeholderColor}
        style={[
          styles.addressInput,
          orgAddress === '' && styles.mandatory,
          { backgroundColor: theme.inputBackColor, color: theme.textColor },
        ]}
        value={orgAddress}
        onChangeText={setOrgAddress}
        placeholder="Address..."
        clearTextOnFocus={true}
        keyboardAppearance="dark"
        maxLength={200}
      />
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: '3%',
    paddingHorizontal: 12,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 0,
  },
  inputOnFocus: {
    marginTop: '3%',
    paddingHorizontal: 12,
    borderRadius: 4,
    fontSize: 16,
    borderWidth: 0,
  },
  addressInput: {
    marginTop: 15,
    marginBottom: 4,
    height: 75,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 0,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  mandatory: {
    borderWidth: 1,
    borderColor: colors.mandatoryColor,
  },
});

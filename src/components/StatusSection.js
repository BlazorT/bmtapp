// components/StatusSection.js
import React from 'react';
import { StyleSheet } from 'react-native';
import Dropdown from '../components/Dropdown';
import { colors } from '../styles';

export default function StatusSection({
  statusItem,
  statusSelectedId,
  setStatusSelectedId,
  setSelectedStatusId,
  setSelectAreaEnabled,
  setSelectSocialAreaEnabled,
  theme,
}) {
  const handleStatusSelect = index => {
    setSelectAreaEnabled(false);
    setSelectSocialAreaEnabled(false);
    setStatusSelectedId(index);
    setSelectedStatusId(statusItem[index].id);
  };

  return (
    <Dropdown
      placeholderTextColor={theme.placeholderColor}
      onSelect={handleStatusSelect}
      selectedIndex={statusSelectedId}
      style={[
        styles.dropdown,
        { backgroundColor: theme.inputBackColor, color: theme.textColor },
      ]}
      items={statusItem}
      placeholder="Select Status..."
      clearTextOnFocus={true}
      keyboardAppearance="dark"
      maxLength={5}
    />
  );
}

const styles = StyleSheet.create({
  dropdown: {
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
    height: 46,
    fontSize: 15,
    marginTop: '3%',
    fontWeight: 'bold',
  },
});

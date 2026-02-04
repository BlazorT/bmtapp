import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import RNSButton from '../../Button';
import { useTheme } from '../../../hooks/useTheme';

const PermissionRequest = ({ onRequestPermission, onClose }) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <MaterialIcon name="contacts" size={80} color={theme.placeholderColor} />
      <Text style={[styles.title, { color: theme.textColor }]}>
        Access Your Contacts
      </Text>
      <Text style={[styles.text, { color: theme.placeholderColor }]}>
        We need permission to access your contacts to help you quickly import
        recipients.
      </Text>
      <RNSButton
        caption="Grant Permission"
        bgColor={theme.buttonBackColor}
        onPress={onRequestPermission}
        nIcon={<MaterialIcon name="check" size={20} color={theme.tintColor} />}
        style={styles.button}
      />
      <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
        <Text style={[styles.cancelText, { color: theme.placeholderColor }]}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  button: {
    minWidth: 180,
  },
  cancelButton: {
    marginTop: 16,
    padding: 10,
  },
  cancelText: {
    fontSize: 14,
  },
});

export default PermissionRequest;

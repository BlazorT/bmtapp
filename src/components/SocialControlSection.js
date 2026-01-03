// components/SocialControlSection.js
import React from 'react';
import { View, TouchableOpacity, Image, Text, StyleSheet } from 'react-native';
import TextInput from '../components/TextInput';

const DownArrowIcon = require('../../assets/images/downarrow.png');
const UpArrowIcon = require('../../assets/images/uparrow.png');

export default function SocialControlSection({
  SelectSocialAreaEnabled,
  setSelectSocialAreaEnabled,
  whatsapp,
  setWhatsapp,
  facebookId,
  setFacebookId,
  instagramId,
  setInstagramId,
  iban,
  setIban,
  theme,
}) {
  return (
    <TouchableOpacity
      style={styles.toggleButton}
      onPress={() => setSelectSocialAreaEnabled(!SelectSocialAreaEnabled)}
    >
      <View style={styles.dropdownHeader}>
        <Text style={[styles.heading, { color: theme.textColor }]}>
          Social Control
        </Text>
        <Image
          source={SelectSocialAreaEnabled ? DownArrowIcon : UpArrowIcon}
          style={[styles.icon, { tintColor: theme.tintColor }]}
        />
      </View>

      {SelectSocialAreaEnabled && (
        <View style={styles.content}>
          <View style={styles.rowContainer}>
            <View style={[styles.input]}>
              <TextInput
                placeholderTextColor={theme.placeholderColor}
                value={whatsapp}
                onChangeText={setWhatsapp}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
                keyboardType="phone-pad"
                placeholder="WhatsApp"
                clearTextOnFocus={true}
                keyboardAppearance="dark"
                minLength={8}
                maxLength={24}
              />
            </View>
            <View style={[styles.input]}>
              <TextInput
                placeholderTextColor={theme.placeholderColor}
                value={facebookId}
                onChangeText={setFacebookId}
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
                keyboardType="email-address"
                placeholder="Facebook"
                clearTextOnFocus={true}
                keyboardAppearance="dark"
                minLength={15}
                maxLength={60}
              />
            </View>
          </View>

          <TextInput
            placeholderTextColor={theme.placeholderColor}
            value={instagramId}
            onChangeText={setInstagramId}
            style={[
              styles.fullInput,
              { backgroundColor: theme.inputBackColor, color: theme.textColor },
            ]}
            placeholder="Instagram"
            keyboardType="twitter"
            clearTextOnFocus={true}
            keyboardAppearance="dark"
            minLength={15}
            maxLength={50}
          />

          <TextInput
            placeholderTextColor={theme.placeholderColor}
            value={iban}
            onChangeText={setIban}
            style={[
              styles.fullInput,
              { backgroundColor: theme.inputBackColor, color: theme.textColor },
            ]}
            placeholder="IBAN/Wire Transfer ID"
            clearTextOnFocus={true}
            keyboardAppearance="dark"
            maxLength={4}
            minLength={3}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    height: 26,
    width: 26,
  },
  content: {
    width: '100%',
    marginTop: 6,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  input: {
    flex: 1,
    borderRadius: 4,
    fontSize: 15,
    borderWidth: 0,
  },
  fullInput: {
    width: '100%',
    borderRadius: 4,
    fontSize: 15,
    marginTop: 12,
    borderWidth: 0,
  },
});

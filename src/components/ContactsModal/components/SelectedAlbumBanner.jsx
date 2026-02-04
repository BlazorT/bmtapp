import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

const SelectedAlbumBanner = ({ count, onClear }) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.buttonBackColor }]}
    >
      <Text style={[styles.text, { color: theme.textColor }]}>
        {count} album{count !== 1 ? 's' : ''} selected
      </Text>
      <TouchableOpacity onPress={onClear}>
        <Text style={[styles.clearText, { color: theme.placeholderColor }]}>
          Clear
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default SelectedAlbumBanner;

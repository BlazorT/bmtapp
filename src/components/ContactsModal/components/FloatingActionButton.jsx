import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../hooks/useTheme';

const FloatingActionButton = ({ count, onPress, loading }) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.buttonBackColor }]}
    >
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={theme.tintColor} />
        ) : (
          <>
            <MaterialIcon
              name="playlist-add"
              size={24}
              color={theme.tintColor}
            />
            <Text style={[styles.text, { color: theme.tintColor }]}>
              Add {count} to Albums
            </Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    borderRadius: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FloatingActionButton;

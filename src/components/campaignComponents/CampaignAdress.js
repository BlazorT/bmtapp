import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import RNSTextInput from '../TextInput';
import Icon from 'react-native-vector-icons/Entypo';

const CampaignAdress = ({ label }) => {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Debounced query state
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query); // ✅ update debounced query after delay
    }, 500); // delay in ms (500 = 0.5s)

    return () => {
      clearTimeout(handler); // cleanup on typing
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      setLoading(true);
      // 🔥 Replace with your API call
      console.log('Searching for:', debouncedQuery);

      // simulate API call
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [debouncedQuery]);

  return (
    <View>
      {label ? (
        <Text style={[styles.label, { color: theme.textColor }]}>{label}</Text>
      ) : null}
      <View>
        <RNSTextInput
          placeholder="Search Area..."
          placeholderTextColor={theme.placeholderColor}
          value={query}
          onChangeText={setQuery}
          style={{
            width: '100%',
            backgroundColor: theme.inputBackColor,
            color: theme.textColor,
            borderRadius: 6,
            paddingHorizontal: 10,
            fontSize: 16,
            borderColor: '#ff00003d',
            borderWidth: 1,
            height: 60,
          }}
          textAlignVertical="top"
        />
        {loading && (
          <ActivityIndicator
            style={styles.loader}
            size={'small'}
            color={theme.selectedCheckBox}
          />
        )}
        {query && !loading && (
          <TouchableOpacity
            style={styles.crossIcon}
            onPress={() => setQuery('')}
          >
            <Icon name="cross" size={18} color={theme.buttonBackColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default CampaignAdress;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  loader: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  crossIcon: {
    position: 'absolute',
    right: 5,
    top: 5,
    zIndex: 9999,
  },
});

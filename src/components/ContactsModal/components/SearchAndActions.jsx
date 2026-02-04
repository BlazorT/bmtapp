import React from 'react';
import { View, Platform, StyleSheet, Dimensions } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import RNSTextInput from '../../TextInput';
import RNSButton from '../../Button';
import { useTheme } from '../../../hooks/useTheme';

const SearchAndActions = ({
  searchText,
  onSearchChange,
  onSelectAll,
  loading,
  availableCount,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <RNSTextInput
        placeholder="Search contacts..."
        placeholderTextColor={theme.placeholderColor}
        value={searchText}
        onChangeText={onSearchChange}
        style={[
          styles.searchInput,
          {
            backgroundColor: theme.inputBackColor,
            color: theme.textColor,
            borderColor: theme.containerBorderColor,
            marginRight: Platform.OS === 'ios' ? 5 : 0,
          },
        ]}
      />
      <RNSButton
        caption="Select All"
        bgColor={theme.buttonBackColor}
        onPress={onSelectAll}
        disabled={loading || availableCount === 0}
        small
        nIcon={
          <MaterialIcon
            name="select-all"
            size={16}
            color={theme.backgroundColor}
          />
        }
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    width: Platform.OS === 'ios' ? 230 : Dimensions.get('window').width - 155,
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    height: 40,
    borderWidth: 1,
  },
  button: {
    width: 'auto',
  },
});

export default SearchAndActions;

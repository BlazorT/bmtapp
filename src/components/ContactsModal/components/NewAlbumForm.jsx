import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import moment from 'moment';
import RNSTextInput from '../../TextInput';
import RNSDropDown from '../../Dropdown';
import RNSButton from '../../Button';
import { useTheme } from '../../../hooks/useTheme';
import { useAlbumOperations } from './hooks/useAlbumOperations';

const NewAlbumForm = ({ networks, onCancel, onCreate }) => {
  const theme = useTheme();
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumCode, setNewAlbumCode] = useState(
    moment().local().format('DDMMYYYY'),
  );
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumNetworkId, setNewAlbumNetworkId] = useState(-1);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    await onCreate();
    setLoading(false);

    // Reset form
    setNewAlbumName('');
    setNewAlbumCode(moment().local().format('DDMMYYYY'));
    setNewAlbumDesc('');
    setNewAlbumNetworkId(-1);
  };

  const handleCancel = () => {
    setNewAlbumName('');
    setNewAlbumCode(moment().local().format('DDMMYYYY'));
    setNewAlbumDesc('');
    setNewAlbumNetworkId(-1);
    onCancel();
  };

  return (
    <View style={styles.container}>
      <RNSTextInput
        placeholder="Album Name"
        placeholderTextColor={theme.placeholderColor}
        value={newAlbumName}
        onChangeText={setNewAlbumName}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackColor,
            color: theme.textColor,
            borderColor: theme.containerBorderColor,
          },
        ]}
      />
      <RNSTextInput
        placeholder="Album Code"
        value={newAlbumCode}
        placeholderTextColor={theme.placeholderColor}
        onChangeText={setNewAlbumCode}
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBackColor,
            color: theme.textColor,
            borderColor: theme.containerBorderColor,
          },
        ]}
      />
      <RNSDropDown
        items={networks}
        selectedIndex={newAlbumNetworkId}
        onSelect={setNewAlbumNetworkId}
        style={{
          width: '100%',
          borderRadius: 6,
          paddingHorizontal: 10,
          fontSize: 16,
          borderWidth: 1,
          backgroundColor: theme.inputBackColor,
          color: theme.textColor,
          borderColor: theme.containerBorderColor,
        }}
        placeholder="Select Network..."
        clearTextOnFocus={true}
        keyboardAppearance={'dark'}
      />
      <RNSTextInput
        placeholder="Description (Optional)"
        value={newAlbumDesc}
        placeholderTextColor={theme.placeholderColor}
        onChangeText={setNewAlbumDesc}
        multiline
        style={[
          styles.input,
          styles.textArea,
          {
            backgroundColor: theme.inputBackColor,
            color: theme.textColor,
            borderColor: theme.containerBorderColor,
          },
        ]}
      />
      <View style={styles.buttons}>
        <RNSButton
          caption="Cancel"
          bgColor={theme.placeholderColor}
          disabled={loading}
          onPress={handleCancel}
          style={styles.button}
        />
        <RNSButton
          caption="Create"
          disabled={loading}
          bgColor={theme.buttonBackColor}
          onPress={handleCreate}
          loading={loading}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 15,
  },
  input: {
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    height: 45,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
  },
});

export default NewAlbumForm;

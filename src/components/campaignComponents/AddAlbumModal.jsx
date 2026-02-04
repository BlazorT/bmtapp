import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import RNSTextInput from '../TextInput';
import RNSButton from '../Button';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useUser } from '../../hooks/useUser';
import Toast from 'react-native-simple-toast';
import servicesettings from '../../modules/dataservices/servicesettings';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import RNSDropDown from '../Dropdown';

const AddAlbumModal = ({
  showAddAlbumModal,
  toggleAddAlbumModal,
  fetchAlbumList,
  networkId,
}) => {
  const theme = useTheme();
  const { user } = useUser();

  const lovs = useSelector(state => state.lovs).lovs;

  const networks = lovs?.lovs?.networks;

  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumCode, setNewAlbumCode] = useState(
    moment().local().format('DDMMYYYY'),
  );
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumNetworkId, setNewAlbumNetworkId] = useState(-1);
  const [creatingAlbum, setCreatingAlbum] = useState(false);

  useEffect(() => {
    if (showAddAlbumModal && networkId) setNewAlbumNetworkId(networkId - 1);
  }, [networkId, showAddAlbumModal]);

  const createNewAlbum = async () => {
    if (
      !newAlbumName.trim() ||
      !newAlbumCode.trim() ||
      newAlbumNetworkId === -1
    ) {
      Toast.show('Please enter album name, code, and select network');
      return;
    }

    try {
      setCreatingAlbum(true);
      const body = {
        Id: 0,
        Orgid: user?.orgId,
        Name: newAlbumName.trim(),
        Code: newAlbumCode.trim(),
        Desc: newAlbumDesc.trim(),
        Networkid: networks[newAlbumNetworkId]?.id,
        Status: 1,
        CreatedBy: user?.id,
        LastUpdatedBy: user?.id,
        CreatedAt: moment().utc().format(),
        LastUpdatedAt: moment().utc().format(),
        RowVer: 1,
      };

      const headerFetch = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };

      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/submitalbumlist',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Failed to create album');
        return;
      }

      const res = await response.json();

      if (res?.status) {
        Toast.show('Album created successfully');
        setNewAlbumName('');
        setNewAlbumCode(moment().local().format('DDMMYYYY'));
        setNewAlbumDesc('');
        setNewAlbumNetworkId(-1);
        toggleAddAlbumModal();
        fetchAlbumList && (await fetchAlbumList());
      } else {
        Toast.show(res?.message || 'Failed to create album');
      }
    } catch (error) {
      console.error('Error creating album:', error);
      Toast.show('Error creating album');
    } finally {
      setCreatingAlbum(false);
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAddAlbumModal}
      onRequestClose={toggleAddAlbumModal}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.modalBackColor },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>
              Create New Album
            </Text>
            <TouchableOpacity onPress={toggleAddAlbumModal}>
              <AntdIcon name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <RNSTextInput
              placeholder="Album Name *"
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
              placeholder="Album Code *"
              placeholderTextColor={theme.placeholderColor}
              value={newAlbumCode}
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
              items={networks || []}
              selectedIndex={newAlbumNetworkId}
              onSelect={setNewAlbumNetworkId}
              style={[
                styles.dropdown,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                  borderColor: theme.containerBorderColor,
                },
              ]}
              placeholder="Select Network *"
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              disabled={!!networkId}
            />

            <RNSTextInput
              placeholder="Description (Optional)"
              placeholderTextColor={theme.placeholderColor}
              value={newAlbumDesc}
              onChangeText={setNewAlbumDesc}
              multiline
              numberOfLines={4}
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

            <View style={styles.buttonRow}>
              <RNSButton
                caption="Cancel"
                bgColor={theme.buttonBackColor}
                onPress={toggleAddAlbumModal}
                disabled={creatingAlbum}
                style={styles.button}
              />
              <RNSButton
                caption="Create Album"
                bgColor={theme.buttonBackColor}
                onPress={createNewAlbum}
                loading={creatingAlbum}
                disabled={creatingAlbum}
                style={styles.button}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddAlbumModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    gap: 15,
  },
  input: {
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    height: 45,
    borderWidth: 1,
  },
  dropdown: {
    width: '100%',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 1,
  },
});

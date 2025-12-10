import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import Contacts from 'react-native-contacts';
import Toast from 'react-native-simple-toast';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import CheckBox from '@react-native-community/checkbox';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/useUser';
import servicesettings from '../modules/dataservices/servicesettings';
import CustomeAlert from './Alert';
import RNSButton from './Button';
import RNSTextInput from './TextInput';
import { openSettings } from 'react-native-permissions';
import { useSelector } from 'react-redux';
import RNSDropDown from './Dropdown';

const ContactsModal = ({
  isOpen,
  onClose,
  onImportComplete,
  recipients,
  fetchRecipients,
  albumList,
  fetchAlbumList,
}) => {
  // console.log({ albumList });
  const { user } = useUser();
  const networks = useSelector(state => state.lovs.lovs.lovs.networks);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [importingAll, setImportingAll] = useState(false);
  const [importingIds, setImportingIds] = useState(new Set());
  const [importAllContactAlert, setImportAllContactAlert] = useState(false);

  // New states for album selection
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [showAlbumSelector, setShowAlbumSelector] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumCode, setNewAlbumCode] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumNetworkId, setNewAlbumNetworkId] = useState(-1);
  const [creatingAlbumLoading, setCreatingAlbumLoading] = useState(false);
  const [submittingBatch, setSubmittingBatch] = useState(false);

  const toggleIsImportAllContactAlert = () =>
    setImportAllContactAlert(prev => !prev);

  // Check if a contact is already imported
  const isContactImported = contact => {
    if (!recipients || !Array.isArray(recipients)) return false;
    return recipients.some(
      recipient => recipient.contentId === contact.primaryContact,
    );
  };

  // Toggle contact selection
  const toggleContactSelection = contactId => {
    setSelectedContacts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contactId)) {
        newSet.delete(contactId);
      } else {
        newSet.add(contactId);
      }
      return newSet;
    });
  };

  // Select all imported contacts
  const selectAllImportedContacts = () => {
    const importedContactIds = filteredContacts
      .filter(c => !isContactImported(c))
      .map(c => c.id);
    setSelectedContacts(new Set(importedContactIds));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedContacts(new Set());
  };

  // Create new album
  const createNewAlbum = async () => {
    if (!newAlbumName.trim() || !newAlbumCode.trim()) {
      Toast.show('Please enter album name and code');
      return;
    }

    try {
      setCreatingAlbumLoading(true);
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
      console.log({ body });
      const headerFetch = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      // return;
      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/submitalbumlist',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Failed to create album');
        return null;
      }
      const res = await response.json();
      console.log({ res });
      if (res?.status) {
        Toast.show('Album created successfully');
        setNewAlbumName('');
        setNewAlbumCode('');
        setNewAlbumDesc('');
        setNewAlbumNetworkId(-1);
        setShowNewAlbumForm(false);
        await fetchAlbumList?.();
        return res.data?.id || res.id;
      } else {
        Toast.show(res?.message || 'Failed to create album');
        return null;
      }
    } catch (error) {
      console.error('Error creating album:', error);
      Toast.show('Error creating album');
      return null;
    } finally {
      setCreatingAlbumLoading(false);
    }
  };

  // Submit selected contacts to album
  const submitSelectedContactsToAlbum = async () => {
    if (!selectedAlbum) {
      Toast.show('Please select an album');
      return;
    }

    const selectedContactsList = filteredContacts.filter(c =>
      selectedContacts.has(c.id),
    );

    if (selectedContactsList.length === 0) {
      Toast.show('No contacts selected');
      return;
    }

    setSubmittingBatch(true);

    try {
      const phoneContacts = selectedContactsList
        .map(c => c.primaryContact)
        .filter(p => p && /^[0-9+]+$/.test(p));

      const emailContacts = selectedContactsList
        .flatMap(c => c.emails || [])
        .filter(email => email && email.length > 3);

      const body = [
        ...[1, 2].map(networkId => ({
          id: 0,
          orgId: user?.orgId,
          networkId: networkId,
          contentlst: phoneContacts,
          desc: '',
          albumid: selectedAlbum,
          createdBy: user?.id,
          createdAt: moment().utc().format(),
          lastUpdatedAt: moment().utc().format(),
          rowVer: 1,
        })),
        ...(emailContacts.length > 0
          ? [
              {
                id: 0,
                orgId: user?.orgId,
                networkId: 3,
                contentlst: emailContacts,
                desc: '',
                albumid: selectedAlbum,
                createdBy: user?.id,
                createdAt: moment().utc().format(),
                lastUpdatedAt: moment().utc().format(),
                rowVer: 1,
              },
            ]
          : []),
      ];
      console.log({ body: JSON.stringify(body) });
      console.log({ body });
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
        servicesettings.baseuri + 'Compaigns/postCompaignContactData',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Failed to add contacts to album');
        return;
      }

      const res = await response.json();
      console.log({ res });

      if (res?.status) {
        Toast.show(
          `Successfully added ${selectedContactsList.length} contact(s) to album`,
        );
        await fetchRecipients();
        setSelectedContacts(new Set());
        setShowAlbumSelector(false);
        setSelectedAlbum(null);
      } else {
        Toast.show(res?.message || 'Failed to add contacts to album');
      }
    } catch (error) {
      console.error('Error adding contacts to album:', error);
      Toast.show('Error adding contacts to album');
    } finally {
      setSubmittingBatch(false);
    }
  };

  // Request permission for contacts
  const requestContactsPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: 'Contacts Permission',
            message:
              'This app would like to access your contacts to import recipients.',
            buttonPositive: 'Allow',
            buttonNegative: 'Deny',
          },
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setPermissionGranted(true);
          fetchContacts();
        } else {
          Toast.show('Permission denied. Cannot access contacts.');
          openSettings();
        }
      } else {
        Contacts.checkPermission().then(permission => {
          if (permission === 'undefined' || permission === 'denied') {
            Contacts.requestPermission().then(newPermission => {
              if (newPermission === 'authorized') {
                setPermissionGranted(true);
                fetchContacts();
              } else {
                Toast.show('Permission denied. Cannot access contacts.');
              }
            });
          } else if (permission === 'authorized') {
            setPermissionGranted(true);
            fetchContacts();
          }
        });
      }
    } catch (error) {
      console.error('Permission error:', error);
      Toast.show('Error requesting permission');
    }
  };

  // Fetch contacts from device
  const fetchContacts = async () => {
    setLoading(true);

    try {
      Contacts.getAll()
        .then(deviceContacts => {
          const processedContacts = deviceContacts
            .map(contact => {
              const phoneNumbers =
                contact.phoneNumbers
                  ?.map(p => p.number.replace(/[\s\-\(\)]/g, ''))
                  .filter(num => /^[0-9+]+$/.test(num)) || [];

              const emails = contact.emailAddresses?.map(e => e.email) || [];

              const name =
                contact.displayName ||
                `${contact.givenName ?? ''} ${contact.familyName ?? ''}`.trim();

              return {
                id: contact.recordID,
                name: name || null,
                phoneNumbers,
                emails,
                primaryContact: phoneNumbers[0] || emails[0] || null,
                type: phoneNumbers[0] ? 'phone' : 'email',
              };
            })
            .filter(contact => contact.primaryContact)
            .filter(contact => {
              const len = contact.primaryContact.length;
              return !(len >= 1 && len <= 4);
            })
            .filter(contact => contact.name && contact.name.length > 1)
            .sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              return nameA.localeCompare(nameB);
            });

          setContacts(processedContacts);
        })
        .catch(error => {
          console.error('Error fetching contacts:', error);
          Toast.show('Error loading contacts');
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error('Error in fetchContacts:', error);
      Toast.show('Error loading contacts');
      setLoading(false);
    }
  };

  // Import a single contact with album selection
  const importContact = async (contact, albumId = null) => {
    setImportingIds(prev => new Set(prev).add(contact.id));

    try {
      const body = [
        {
          id: 0,
          orgId: user?.orgId,
          networkId: 1,
          contentlst: [contact.primaryContact],
          desc: '',
          albumid: albumId,
          createdBy: user?.id,
          createdAt: moment().utc().format(),
          lastUpdatedAt: moment().utc().format(),
          rowVer: 1,
        },
        {
          id: 0,
          orgId: user?.orgId,
          networkId: 2,
          contentlst: [contact.primaryContact],
          desc: '',
          albumid: albumId,
          createdBy: user?.id,
          createdAt: moment().utc().format(),
          lastUpdatedAt: moment().utc().format(),
          rowVer: 1,
        },
      ];

      const validEmails = (contact.emails || []).filter(
        email => email && email.length > 3,
      );

      if (validEmails.length > 0) {
        body.push({
          id: 0,
          orgId: user?.orgId,
          networkId: 3,
          contentlst: validEmails,
          desc: '',
          albumid: albumId,
          createdBy: user?.id,
          createdAt: moment().utc().format(),
          lastUpdatedAt: moment().utc().format(),
          rowVer: 1,
        });
      }

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
        servicesettings.baseuri + 'Compaigns/postCompaignContactData',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show(`Failed to import ${contact.name}`);
        return false;
      }

      const res = await response.json();
      if (res?.status) {
        Toast.show(`Successfully imported ${contact.name}`);
        await fetchRecipients();
        return true;
      } else {
        Toast.show(res?.message || `Failed to import ${contact.name}`);
        return false;
      }
    } catch (error) {
      console.error('Error importing contact:', error);
      Toast.show(`Error importing ${contact.name}`);
      return false;
    } finally {
      setImportingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(contact.id);
        return newSet;
      });
    }
  };

  // Import all contacts with album selection
  const importAllContacts = async () => {
    if (!selectedAlbum) {
      Toast.show('Please select an album first');
      setShowAlbumSelector(true);
      return;
    }

    toggleIsImportAllContactAlert();
    const notImportedContacts = filteredContacts.filter(
      c => !isContactImported(c),
    );

    if (notImportedContacts.length === 0) {
      Toast.show('No new contacts to import');
      return;
    }
    setImportingAll(true);

    try {
      const phoneContacts = notImportedContacts
        .map(c => c.primaryContact)
        .filter(p => p && /^[0-9+]+$/.test(p));

      const emailContacts = notImportedContacts
        .flatMap(c => c.emails || [])
        .filter(email => email && email.length > 3);

      const body = [
        ...[1, 2].map(networkId => ({
          id: 0,
          orgId: user?.orgId,
          networkId: networkId,
          contentlst: phoneContacts,
          desc: '',
          albumid: selectedAlbum,
          createdBy: user?.id,
          createdAt: moment().utc().format(),
          lastUpdatedAt: moment().utc().format(),
          rowVer: 1,
        })),
        ...(emailContacts.length > 0
          ? [
              {
                id: 0,
                orgId: user?.orgId,
                networkId: 3,
                contentlst: emailContacts,
                desc: '',
                albumid: selectedAlbum,
                createdBy: user?.id,
                createdAt: moment().utc().format(),
                lastUpdatedAt: moment().utc().format(),
                rowVer: 1,
              },
            ]
          : []),
      ];

      const headerFetch = {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      console.log({ body });
      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/postCompaignContactData',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Failed to import contacts');
        return;
      }

      const res = await response.json();
      console.log({ res });

      if (res?.status) {
        Toast.show(
          `Successfully imported ${notImportedContacts.length} contact(s)`,
        );
        await fetchRecipients();
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        Toast.show(res?.message || 'Failed to import contacts');
      }
    } catch (error) {
      console.error('Error importing all contacts:', error);
      Toast.show('Error importing contacts');
    } finally {
      setImportingAll(false);
    }
  };

  const filteredContacts = useMemo(() => {
    let list = contacts;

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      list = contacts.filter(
        contact =>
          contact.name?.toLowerCase().includes(searchLower) ||
          contact.primaryContact?.toLowerCase().includes(searchLower),
      );
    }

    return [...list].sort((a, b) => {
      const aSelected = selectedContacts.has(a.id);
      const bSelected = selectedContacts.has(b.id);

      // selected first
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      // same state → sort by name
      return a.name.localeCompare(b.name);
    });
  }, [contacts, searchText, selectedContacts]);

  useEffect(() => {
    if (isOpen && !permissionGranted) {
      requestContactsPermission();
    }
  }, [isOpen]);

  const renderPermissionRequest = () => (
    <View style={styles.permissionContainer}>
      <MaterialIcon name="contacts" size={80} color={theme.placeholderColor} />
      <Text style={[styles.permissionTitle, { color: theme.textColor }]}>
        Access Your Contacts
      </Text>
      <Text style={[styles.permissionText, { color: theme.placeholderColor }]}>
        We need permission to access your contacts to help you quickly import
        recipients.
      </Text>
      <RNSButton
        caption="Grant Permission"
        bgColor={theme.buttonBackColor}
        onPress={requestContactsPermission}
        nIcon={<MaterialIcon name="check" size={20} color={theme.tintColor} />}
        style={styles.permissionButton}
      />
      <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
        <Text style={[styles.cancelText, { color: theme.placeholderColor }]}>
          Cancel
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAlbumSelector = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showAlbumSelector}
      onRequestClose={() => setShowAlbumSelector(false)}
    >
      <View style={styles.albumModalOverlay}>
        <View
          style={[
            styles.albumModalContent,
            { backgroundColor: theme.modalBackColor },
          ]}
        >
          <View style={styles.albumModalHeader}>
            <Text style={[styles.albumModalTitle, { color: theme.textColor }]}>
              Select Album
            </Text>
            <TouchableOpacity onPress={() => setShowAlbumSelector(false)}>
              <AntdIcon name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {showNewAlbumForm ? (
            <View style={styles.newAlbumForm}>
              <RNSTextInput
                placeholder="Album Name"
                placeholderTextColor={theme.placeholderColor}
                value={newAlbumName}
                onChangeText={setNewAlbumName}
                style={[
                  styles.albumInput,
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
                  styles.albumInput,
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
                  borderColor: '#ff00003d',
                  borderWidth: 1,
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                  borderColor: theme.containerBorderColor,
                }}
                placeholder="Select Netword..."
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
                  styles.albumInput,
                  styles.albumTextArea,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                    borderColor: theme.containerBorderColor,
                  },
                ]}
              />
              <View style={styles.albumFormButtons}>
                <RNSButton
                  caption="Cancel"
                  bgColor={theme.placeholderColor}
                  disabled={creatingAlbumLoading}
                  onPress={() => {
                    setShowNewAlbumForm(false);
                    setNewAlbumName('');
                    setNewAlbumCode('');
                    setNewAlbumDesc('');
                  }}
                  style={styles.albumFormButton}
                />
                <RNSButton
                  caption="Create"
                  disabled={creatingAlbumLoading}
                  bgColor={theme.buttonBackColor}
                  onPress={async () => {
                    const newAlbumId = await createNewAlbum();
                    if (newAlbumId) {
                      setSelectedAlbum(newAlbumId);
                    }
                  }}
                  loading={creatingAlbumLoading}
                  style={styles.albumFormButton}
                />
              </View>
            </View>
          ) : (
            <>
              <ScrollView style={styles.albumList}>
                {albumList && albumList.length > 0 ? (
                  albumList.map(album => (
                    <TouchableOpacity
                      key={album.id}
                      style={[
                        styles.albumItem,
                        {
                          backgroundColor:
                            selectedAlbum === album.id
                              ? theme.buttonBackColor + '50'
                              : theme.modalBackColor,
                          borderColor:
                            selectedAlbum === album.id
                              ? theme.buttonBackColor
                              : theme.containerBorderColor,
                        },
                      ]}
                      onPress={() => setSelectedAlbum(album.id)}
                    >
                      <View style={styles.albumItemContent}>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            columnGap: 5,
                          }}
                        >
                          <Text
                            style={[
                              styles.albumName,
                              { color: theme.textColor },
                            ]}
                          >
                            {album.name}
                          </Text>
                          <View
                            style={[
                              styles.typeBadge,
                              {
                                backgroundColor: theme.green + '20',
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.typeText,
                                {
                                  color: theme.green,
                                },
                              ]}
                            >
                              {networks?.find(n => n?.id == album.networkid)
                                ?.name || ''}
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[
                            styles.albumCode,
                            { color: theme.placeholderColor },
                          ]}
                        >
                          {album.code}
                        </Text>
                        {album.desc && (
                          <Text
                            style={[
                              styles.albumDesc,
                              { color: theme.placeholderColor },
                            ]}
                          >
                            {album.desc}
                          </Text>
                        )}
                      </View>
                      {selectedAlbum === album.id && (
                        <MaterialIcon
                          name="check-circle"
                          size={24}
                          color={theme.buttonBackColor}
                        />
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text
                    style={[
                      styles.noAlbumsText,
                      { color: theme.placeholderColor },
                    ]}
                  >
                    No albums available
                  </Text>
                )}
              </ScrollView>

              <RNSButton
                caption="Create New Album"
                bgColor={theme.green}
                onPress={() => setShowNewAlbumForm(true)}
                nIcon={
                  <MaterialIcon name="add" size={20} color={theme.tintColor} />
                }
                style={styles.createAlbumButton}
              />

              <RNSButton
                caption="Confirm"
                bgColor={theme.buttonBackColor}
                onPress={() => {
                  if (selectedAlbum) {
                    setShowAlbumSelector(false);
                    submitSelectedContactsToAlbum();
                  } else {
                    Toast.show('Please select an album');
                  }
                }}
                disabled={!selectedAlbum}
                style={styles.confirmAlbumButton}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const notImportedCount = filteredContacts.filter(
    c => !isContactImported(c),
  ).length;

  const importedCount = filteredContacts.filter(c =>
    isContactImported(c),
  ).length;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <CustomeAlert
          massagetype={'warning'}
          hide={toggleIsImportAllContactAlert}
          confirm={importAllContacts}
          Visible={importAllContactAlert}
          alerttype={'confirmation'}
          Title={'Import All Contacts'}
          Massage={`Are you sure you want to import ${notImportedCount} contact(s)?`}
        />
        {renderAlbumSelector()}
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <View
            style={[
              styles.container,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <View style={[styles.header]}>
              <Text style={[styles.title, { color: theme.textColor }]}>
                Import Contacts
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <AntdIcon name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>
            <View
              style={[
                {
                  width: '100%',
                  height: 0.1,
                  backgroundColor: theme.textColor,
                },
              ]}
            />
            {!permissionGranted ? (
              renderPermissionRequest()
            ) : (
              <>
                <View style={styles.actionsRow}>
                  <RNSTextInput
                    placeholder="Search contacts..."
                    placeholderTextColor={theme.placeholderColor}
                    value={searchText}
                    onChangeText={setSearchText}
                    style={[
                      styles.searchInput,
                      {
                        width: 240,
                        backgroundColor: theme.inputBackColor,
                        color: theme.textColor,
                        borderColor: theme.containerBorderColor,
                      },
                    ]}
                  />
                  <RNSButton
                    caption="Import All"
                    bgColor={theme.buttonBackColor}
                    onPress={() => {
                      if (!selectedAlbum) {
                        selectAllImportedContacts();
                        setShowAlbumSelector(true);
                      } else {
                        toggleIsImportAllContactAlert();
                      }
                    }}
                    loading={importingAll}
                    disabled={loading || importingAll || notImportedCount === 0}
                    small
                    nIcon={
                      <MaterialIcon
                        name="file-download"
                        size={20}
                        color={theme.tintColor}
                      />
                    }
                    style={styles.importAllBtn}
                  />
                </View>

                {selectedAlbum && (
                  <View
                    style={[
                      styles.selectedAlbumBanner,
                      { backgroundColor: theme.buttonBackColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.selectedAlbumText,
                        { color: theme.textColor },
                      ]}
                    >
                      Album:{' '}
                      {albumList?.find(a => a.id === selectedAlbum)?.name ||
                        'Selected'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowAlbumSelector(true)}
                    >
                      <Text
                        style={[
                          styles.changeAlbumText,
                          { color: theme.placeholderColor },
                        ]}
                      >
                        Change
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {!loading && (
                  <View style={styles.statsRow}>
                    <Text
                      style={[styles.resultsCount, { color: theme.textColor }]}
                    >
                      {filteredContacts.length} contact
                      {filteredContacts.length !== 1 ? 's' : ''} found
                      {notImportedCount < filteredContacts.length &&
                        ` (${notImportedCount} new)`}
                    </Text>
                    {selectedContacts.size > 0 && (
                      <TouchableOpacity onPress={clearSelection}>
                        <Text
                          style={[
                            styles.clearSelectionText,
                            { color: theme.buttonBackColor },
                          ]}
                        >
                          Clear ({selectedContacts.size})
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}

                {importedCount > 0 && selectedContacts.size === 0 && (
                  <TouchableOpacity
                    onPress={selectAllImportedContacts}
                    style={[
                      styles.selectAllButton,
                      { backgroundColor: theme.blue + '20' },
                    ]}
                  >
                    <MaterialIcon
                      name="check-box"
                      size={20}
                      color={theme.blue}
                    />
                    <Text style={[styles.selectAllText, { color: theme.blue }]}>
                      Select All Imported Contacts ({notImportedCount})
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.listContainer}>
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator
                        color={theme.buttonBackColor}
                        size="large"
                      />
                      <Text
                        style={[styles.loadingText, { color: theme.textColor }]}
                      >
                        Loading contacts...
                      </Text>
                    </View>
                  ) : (
                    <FlatList
                      data={filteredContacts}
                      renderItem={({ item }) => {
                        const isImporting = importingIds.has(item.id);
                        const isImported = isContactImported(item);
                        const isSelected = selectedContacts.has(item.id);

                        return (
                          <View
                            style={[
                              styles.contactCard,
                              {
                                backgroundColor: theme.modalBackColor,
                                opacity: isImported ? 0.9 : 1,
                                borderWidth: isSelected ? 2 : 0,
                                borderColor: theme.buttonBackColor,
                              },
                            ]}
                          >
                            {!isImported && (
                              <CheckBox
                                style={{
                                  transform: [
                                    {
                                      scale: Platform.OS === 'ios' ? 0.8 : 1.2,
                                    },
                                  ],
                                  marginRight: 10,
                                }}
                                onValueChange={() =>
                                  toggleContactSelection(item.id)
                                }
                                value={isSelected}
                                boxType={'square'}
                                tintColors={{
                                  true: theme.buttonBackColor,
                                  false: theme.placeholderColor,
                                }}
                              />
                            )}
                            <View style={styles.contactInfo}>
                              <View style={styles.contactHeader}>
                                <Text
                                  style={[
                                    styles.contactName,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  {item.name}
                                </Text>
                                <View
                                  style={[
                                    styles.typeBadge,
                                    {
                                      backgroundColor:
                                        item.type === 'phone'
                                          ? theme.green + '20'
                                          : theme.blue + '20',
                                    },
                                  ]}
                                >
                                  <MaterialIcon
                                    name={
                                      item.type === 'phone' ? 'phone' : 'email'
                                    }
                                    size={12}
                                    color={
                                      item.type === 'phone'
                                        ? theme.green
                                        : theme.blue
                                    }
                                  />
                                  <Text
                                    style={[
                                      styles.typeText,
                                      {
                                        color:
                                          item.type === 'phone'
                                            ? theme.green
                                            : theme.blue,
                                      },
                                    ]}
                                  >
                                    {item.type === 'phone'
                                      ? 'SMS | Whatsapp'
                                      : 'Email'}
                                  </Text>
                                </View>
                              </View>
                              <Text
                                style={[
                                  styles.contactDetail,
                                  { color: theme.placeholderColor },
                                ]}
                                numberOfLines={1}
                              >
                                {item.primaryContact}
                              </Text>
                              {isImported && (
                                <Text
                                  style={[
                                    styles.importedLabel,
                                    { color: theme.green },
                                  ]}
                                >
                                  ✓ Already imported
                                </Text>
                              )}
                            </View>
                            {isImported && (
                              <TouchableOpacity
                                onPress={() => {
                                  if (!selectedAlbum) {
                                    setShowAlbumSelector(true);
                                  } else {
                                    importContact(item, selectedAlbum);
                                  }
                                }}
                                disabled={
                                  isImporting || importingAll || isImported
                                }
                                style={[
                                  styles.importBtn,
                                  {
                                    backgroundColor: isImported
                                      ? theme.green
                                      : theme.buttonBackColor,
                                    opacity:
                                      isImporting || importingAll || isImported
                                        ? 0.5
                                        : 1,
                                  },
                                ]}
                              >
                                <MaterialIcon
                                  name="check"
                                  size={20}
                                  color={theme.tintColor}
                                />
                                {/* {isImporting ? (
                                <ActivityIndicator
                                  size="small"
                                  color={theme.tintColor}
                                />
                                ) : isImported ?
                                  <MaterialIcon
                                  name="check"
                                  size={20}
                                  color={theme.tintColor}
                                /> (
                                  ) : (
                                    <MaterialIcon
                                  name="person-add"
                                  size={20}
                                  color={theme.tintColor}
                                  />
                                  )} */}
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      }}
                      keyExtractor={item => item.id}
                      contentContainerStyle={styles.listContent}
                      keyboardShouldPersistTaps="handled"
                      ListEmptyComponent={() => (
                        <View style={styles.emptyState}>
                          <MaterialIcon
                            name="contact-phone"
                            size={60}
                            color={theme.placeholderColor}
                          />
                          <Text
                            style={[
                              styles.emptyText,
                              { color: theme.focusText },
                            ]}
                          >
                            No contacts found
                          </Text>
                          <Text
                            style={[
                              styles.emptySubText,
                              { color: theme.placeholderColor },
                            ]}
                          >
                            {searchText
                              ? 'Try adjusting your search'
                              : 'No contacts available to import'}
                          </Text>
                        </View>
                      )}
                      showsVerticalScrollIndicator={false}
                    />
                  )}
                </View>
              </>
            )}
          </View>
        </SafeAreaView>

        {/* Floating Action Button for Batch Operations */}
        {selectedContacts.size > 0 && (
          <View
            style={[
              styles.fabContainer,
              { backgroundColor: theme.buttonBackColor },
            ]}
          >
            <TouchableOpacity
              style={styles.fabButton}
              onPress={() => setShowAlbumSelector(true)}
              disabled={submittingBatch}
            >
              {submittingBatch ? (
                <ActivityIndicator size="small" color={theme.tintColor} />
              ) : (
                <>
                  <MaterialIcon
                    name="playlist-add"
                    size={24}
                    color={theme.tintColor}
                  />
                  <Text style={[styles.fabText, { color: theme.tintColor }]}>
                    Add {selectedContacts.size} to Album
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '100%',
    height: '100%',
    borderBottomEndRadius: 12,
    rowGap: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
    padding: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInput: {
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    height: 40,
    borderWidth: 1,
  },
  importAllBtn: {
    width: 'auto',
  },
  selectedAlbumBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
  },
  selectedAlbumText: {
    fontSize: 14,
    fontWeight: '600',
  },
  changeAlbumText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  clearSelectionText: {
    fontSize: 13,
    fontWeight: '600',
  },
  selectAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    gap: 8,
  },
  selectAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContainer: {
    flexGrow: 1,
  },
  listContent: {
    paddingBottom: 120,
    flexGrow: 1,
  },
  contactCard: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  contactInfo: {
    flex: 1,
    marginRight: 10,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  contactDetail: {
    fontSize: 14,
    marginBottom: 2,
  },
  importedLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  importBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  permissionButton: {
    minWidth: 180,
  },
  cancelButton: {
    marginTop: 16,
    padding: 10,
  },
  cancelText: {
    fontSize: 14,
  },
  // Album selector modal styles
  albumModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  albumModalContent: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  albumModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  albumModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  albumList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
  },
  albumItemContent: {
    flex: 1,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  albumCode: {
    fontSize: 13,
    marginBottom: 2,
  },
  albumDesc: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  noAlbumsText: {
    textAlign: 'center',
    fontSize: 14,
    padding: 20,
  },
  createAlbumButton: {
    marginBottom: 10,
  },
  confirmAlbumButton: {
    marginTop: 5,
  },
  // New album form styles
  newAlbumForm: {
    gap: 15,
  },
  albumInput: {
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    height: 45,
    borderWidth: 1,
  },
  albumTextArea: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  albumFormButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  albumFormButton: {
    flex: 1,
  },
  // Floating action button
  fabContainer: {
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
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 10,
  },
  fabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  albumRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3333',
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
});

export default ContactsModal;

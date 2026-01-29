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
  const { user } = useUser();
  const networks = useSelector(state => state.lovs.lovs.lovs.networks);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [importingIds, setImportingIds] = useState(new Set());

  // Multi-album selection states
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [showAlbumSelector, setShowAlbumSelector] = useState(false);
  const [selectedAlbums, setSelectedAlbums] = useState(new Set());
  const [showNewAlbumForm, setShowNewAlbumForm] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumCode, setNewAlbumCode] = useState(
    moment().local().format('DDMMYYYY'),
  );
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [newAlbumNetworkId, setNewAlbumNetworkId] = useState(-1);
  const [creatingAlbumLoading, setCreatingAlbumLoading] = useState(false);
  const [submittingBatch, setSubmittingBatch] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Helper: Check if contact exists in specific album
  const existsInAlbum = (contact, albumId) => {
    if (!recipients || !Array.isArray(recipients)) return false;
    return recipients.some(
      r => r.contentId === contact.primaryContact && r.albumId === albumId,
    );
  };

  // Helper: Get contact types (phone and/or email)
  const getContactTypes = contact => {
    const types = [];
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      types.push('phone');
    }
    if (contact.emails && contact.emails.length > 0) {
      types.push('email');
    }
    return types;
  };

  // Helper: Get network IDs for contact type
  const getNetworkIdsForContactType = type => {
    if (type === 'phone') return [1, 2]; // SMS, WhatsApp
    if (type === 'email') return [3]; // Email
    return [];
  };

  // Helper: Check if album is compatible with selected contacts
  const isAlbumCompatibleWithContacts = (album, selectedContactsList) => {
    const albumNetworkId = album.networkid;

    return selectedContactsList.some(contact => {
      const contactTypes = getContactTypes(contact);
      return contactTypes.some(type => {
        const networkIds = getNetworkIdsForContactType(type);
        return networkIds.includes(albumNetworkId);
      });
    });
  };

  // Helper: Check if all selected contacts exist in album
  const allContactsExistInAlbum = (album, selectedContactsList) => {
    const compatibleContacts = selectedContactsList.filter(contact => {
      const contactTypes = getContactTypes(contact);
      return contactTypes.some(type => {
        const networkIds = getNetworkIdsForContactType(type);
        return networkIds.includes(album.networkid);
      });
    });

    if (compatibleContacts.length === 0) return false;

    return compatibleContacts.every(contact =>
      existsInAlbum(contact, album.id),
    );
  };

  // Helper: Count how many selected contacts exist in album
  const countContactsInAlbum = (album, selectedContactsList) => {
    const compatibleContacts = selectedContactsList.filter(contact => {
      const contactTypes = getContactTypes(contact);
      return contactTypes.some(type => {
        const networkIds = getNetworkIdsForContactType(type);
        return networkIds.includes(album.networkid);
      });
    });

    const existingCount = compatibleContacts.filter(contact =>
      existsInAlbum(contact, album.id),
    ).length;

    return { existing: existingCount, total: compatibleContacts.length };
  };

  // Helper: Check if contact exists in all selected albums
  const contactExistsInAllSelectedAlbums = contact => {
    if (selectedAlbums.size === 0) return false;

    const contactTypes = getContactTypes(contact);
    const compatibleAlbums = Array.from(selectedAlbums)
      .map(albumId => albumList.find(a => a.id === albumId))
      .filter(
        album =>
          album &&
          contactTypes.some(type => {
            const networkIds = getNetworkIdsForContactType(type);
            return networkIds.includes(album.networkid);
          }),
      );

    if (compatibleAlbums.length === 0) return false;

    return compatibleAlbums.every(album => existsInAlbum(contact, album.id));
  };

  // Helper: Count albums contact is in
  const countAlbumsForContact = contact => {
    if (!albumList) return 0;
    return albumList.filter(album => existsInAlbum(contact, album.id)).length;
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

  // Toggle album selection
  const toggleAlbumSelection = albumId => {
    setSelectedAlbums(prev => {
      const newSet = new Set(prev);
      if (newSet.has(albumId)) {
        newSet.delete(albumId);
      } else {
        newSet.add(albumId);
      }
      return newSet;
    });
  };

  // Select all non-imported contacts
  const selectAllImportedContacts = () => {
    const notInAllAlbumsContactIds = filteredContacts
      .filter(c => !contactExistsInAllSelectedAlbums(c))
      .map(c => c.id);
    setSelectedContacts(new Set(notInAllAlbumsContactIds));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedContacts(new Set());
  };

  // Create new album
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
        return null;
      }

      const res = await response.json();

      if (res?.status) {
        Toast.show('Album created successfully');
        setNewAlbumName('');
        setNewAlbumCode(moment().local().format('DDMMYYYY'));
        setNewAlbumDesc('');
        setNewAlbumNetworkId(-1);
        setShowNewAlbumForm(false);
        await fetchAlbumList?.();
        return { albumId: res.data?.id || res.id, networkId: body.Networkid };
      } else {
        Toast.show(res?.message || 'Failed to create album');
        return { albumId: null, networkId: null };
      }
    } catch (error) {
      console.error('Error creating album:', error);
      Toast.show('Error creating album');
      return { albumId: null, networkId: null };
    } finally {
      setCreatingAlbumLoading(false);
    }
  };

  // Calculate submission summary
  const getSubmissionSummary = () => {
    const selectedContactsList = filteredContacts.filter(c =>
      selectedContacts.has(c.id),
    );

    const summary = Array.from(selectedAlbums)
      .map(albumId => {
        const album = albumList.find(a => a.id === albumId);
        if (!album) return null;

        const compatibleContacts = selectedContactsList.filter(contact => {
          const contactTypes = getContactTypes(contact);
          return contactTypes.some(type => {
            const networkIds = getNetworkIdsForContactType(type);
            return networkIds.includes(album.networkid);
          });
        });

        const newContacts = compatibleContacts.filter(
          contact => !existsInAlbum(contact, album.id),
        );

        const existingContacts = compatibleContacts.filter(contact =>
          existsInAlbum(contact, album.id),
        );

        return {
          album,
          newCount: newContacts.length,
          existingCount: existingContacts.length,
          totalCompatible: compatibleContacts.length,
        };
      })
      .filter(Boolean);

    return summary;
  };

  // Submit selected contacts to selected albums
  const submitSelectedContactsToAlbums = async () => {
    if (selectedAlbums.size === 0) {
      Toast.show('Please select at least one album');
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
      const requests = [];

      for (const albumId of selectedAlbums) {
        const album = albumList.find(a => a.id === albumId);
        if (!album) continue;

        const albumNetworkId = album.networkid;

        // Filter contacts compatible with this album's network
        const compatibleContacts = selectedContactsList.filter(contact => {
          // Skip if already exists
          if (existsInAlbum(contact, albumId)) return false;

          const contactTypes = getContactTypes(contact);
          return contactTypes.some(type => {
            const networkIds = getNetworkIdsForContactType(type);
            return networkIds.includes(albumNetworkId);
          });
        });

        if (compatibleContacts.length === 0) continue;

        // Separate phone and email contacts
        const phoneContacts = compatibleContacts
          .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
          .map(c => c.primaryContact)
          .filter(p => p && /^[0-9+]+$/.test(p));

        const emailContacts = compatibleContacts
          .filter(c => c.emails && c.emails.length > 0)
          .flatMap(c => c.emails)
          .filter(email => email && email.length > 3);

        // Create request based on album network
        if ([1, 2].includes(albumNetworkId) && phoneContacts.length > 0) {
          // SMS or WhatsApp album
          requests.push({
            id: 0,
            orgId: user?.orgId,
            networkId: albumNetworkId,
            contentlst: phoneContacts,
            desc: '',
            albumid: albumId,
            createdBy: user?.id,
            createdAt: moment().utc().format(),
            lastUpdatedAt: moment().utc().format(),
            rowVer: 1,
          });
        } else if (albumNetworkId === 3 && emailContacts.length > 0) {
          // Email album
          requests.push({
            id: 0,
            orgId: user?.orgId,
            networkId: 3,
            contentlst: emailContacts,
            desc: '',
            albumid: albumId,
            createdBy: user?.id,
            createdAt: moment().utc().format(),
            lastUpdatedAt: moment().utc().format(),
            rowVer: 1,
          });
        }
      }

      if (requests.length === 0) {
        Toast.show('No new contacts to add');
        setSubmittingBatch(false);
        return;
      }

      const headerFetch = {
        method: 'POST',
        body: JSON.stringify(requests),
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
        Toast.show('Failed to add contacts to albums');
        return;
      }
      const res = await response.json();
      if (res?.status) {
        Toast.show(
          `Successfully added contacts to ${selectedAlbums.size} album(s)`,
        );
        await fetchRecipients();
        setSelectedContacts(new Set());
        setSelectedAlbums(new Set());
        setShowAlbumSelector(false);
        setShowConfirmation(false);
      } else {
        Toast.show(res?.message || 'Failed to add contacts to albums');
      }
    } catch (error) {
      console.error('Error adding contacts to albums:', error);
      Toast.show('Error adding contacts to albums');
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

  const normalizePhone = phone => {
    if (!phone) return '';

    // keep digits only
    const digits = phone.replace(/\D/g, '');

    // take last 10 digits (most reliable universal match)
    return digits.slice(-10);
  };

  // const dedupeContacts = contacts => {
  //   const seen = new Set();

  //   return contacts.filter(contact => {
  //     const key = normalizePhone(contact.primaryContact);

  //     if (!key || seen.has(key)) {
  //       return false;
  //     }

  //     seen.add(key);
  //     return true;
  //   });
  // };

  const filteredContacts = useMemo(() => {
    // 1. Deduplicate using normalized phone
    const seen = new Set();
    let list = contacts.filter(contact => {
      const key = normalizePhone(contact.primaryContact);

      if (!key || seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });

    // 2. Search filter (name OR normalized phone)
    if (searchText?.trim()) {
      const searchLower = searchText.toLowerCase();
      const searchDigits = searchText.replace(/\D/g, '');
      const searchKey = searchDigits ? searchDigits.slice(-10) : '';

      list = list.filter(contact => {
        const nameMatch = contact.name?.toLowerCase().includes(searchLower);

        const phoneMatch =
          searchKey &&
          normalizePhone(contact.primaryContact).includes(
            searchKey.replace(/^0/, ''),
          );

        return nameMatch || phoneMatch;
      });
    }

    // 3. Sort (selected first, then name)
    return list.sort((a, b) => {
      const aSelected = selectedContacts.has(a.id);
      const bSelected = selectedContacts.has(b.id);

      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;

      return (a.name ?? '').localeCompare(b.name ?? '');
    });
  }, [contacts, searchText, selectedContacts]);

  // Group albums by network
  const groupedAlbums = useMemo(() => {
    if (!albumList || !networks) return {};

    const grouped = {};

    networks.forEach(network => {
      const networkAlbums = albumList.filter(
        album => album.networkid === network.id,
      );
      if (networkAlbums.length > 0) {
        grouped[network.id] = {
          network,
          albums: networkAlbums,
        };
      }
    });

    return grouped;
  }, [albumList, networks]);

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

  const renderConfirmationModal = () => {
    const summary = getSubmissionSummary();
    const totalNew = summary.reduce((sum, item) => sum + item.newCount, 0);
    const totalExisting = summary.reduce(
      (sum, item) => sum + item.existingCount,
      0,
    );

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.confirmationOverlay}>
          <View
            style={[
              styles.confirmationContent,
              { backgroundColor: theme.modalBackColor },
            ]}
          >
            <View style={styles.confirmationHeader}>
              <Text
                style={[styles.confirmationTitle, { color: theme.textColor }]}
              >
                Confirm Addition
              </Text>
              <TouchableOpacity onPress={() => setShowConfirmation(false)}>
                <AntdIcon name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            <View style={styles.confirmationSummary}>
              <Text style={[styles.summaryTitle, { color: theme.textColor }]}>
                Adding {selectedContacts.size} contact(s) to{' '}
                {selectedAlbums.size} album(s):
              </Text>

              <ScrollView style={styles.summaryList}>
                {summary.map(
                  ({ album, newCount, existingCount, totalCompatible }) => (
                    <View
                      key={album.id}
                      style={[
                        styles.summaryItem,
                        { backgroundColor: theme.inputBackColor },
                      ]}
                    >
                      <View style={styles.summaryItemHeader}>
                        <Text
                          style={[
                            styles.summaryAlbumName,
                            { color: theme.textColor },
                          ]}
                        >
                          {album.name}
                        </Text>
                        <View
                          style={[
                            styles.summaryBadge,
                            { backgroundColor: theme.green + '20' },
                          ]}
                        >
                          <Text
                            style={[
                              styles.summaryBadgeText,
                              { color: theme.green },
                            ]}
                          >
                            {
                              networks?.find(n => n.id === album.networkid)
                                ?.name
                            }
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.summaryDetail,
                          { color: theme.placeholderColor },
                        ]}
                      >
                        {newCount} new contact{newCount !== 1 ? 's' : ''}
                        {existingCount > 0 &&
                          ` (${existingCount} already exist${existingCount !== 1 ? '' : 's'})`}
                      </Text>
                    </View>
                  ),
                )}
              </ScrollView>

              <View
                style={[
                  styles.summaryTotal,
                  { borderTopColor: theme.containerBorderColor },
                ]}
              >
                <Text
                  style={[styles.summaryTotalText, { color: theme.textColor }]}
                >
                  Total: {totalNew} new addition{totalNew !== 1 ? 's' : ''}
                  {totalExisting > 0 &&
                    ` • ${totalExisting} skipped (already exist)`}
                </Text>
              </View>
            </View>

            <View style={styles.confirmationButtons}>
              <RNSButton
                caption="Cancel"
                bgColor={theme.placeholderColor}
                onPress={() => setShowConfirmation(false)}
                disabled={submittingBatch}
                style={styles.confirmationButton}
              />
              <RNSButton
                caption="Confirm"
                bgColor={theme.buttonBackColor}
                onPress={submitSelectedContactsToAlbums}
                loading={submittingBatch}
                disabled={submittingBatch || totalNew === 0}
                style={styles.confirmationButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderAlbumSelector = () => {
    const selectedContactsList = filteredContacts.filter(c =>
      selectedContacts.has(c.id),
    );

    return (
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
              <Text
                style={[styles.albumModalTitle, { color: theme.textColor }]}
              >
                Select Albums ({selectedAlbums.size} selected)
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAlbumSelector(false);
                  setSelectedAlbums(new Set());
                }}
              >
                <AntdIcon name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            {selectedContactsList.length > 0 && (
              <View
                style={[
                  styles.contactsPreview,
                  { backgroundColor: theme.inputBackColor },
                ]}
              >
                <Text
                  style={[
                    styles.contactsPreviewText,
                    { color: theme.textColor },
                  ]}
                >
                  {selectedContactsList.length} contact
                  {selectedContactsList.length !== 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

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
                      setNewAlbumCode(moment().local().format('DDMMYYYY'));
                      setNewAlbumDesc('');
                      setNewAlbumNetworkId(-1);
                    }}
                    style={styles.albumFormButton}
                  />
                  <RNSButton
                    caption="Create"
                    disabled={creatingAlbumLoading}
                    bgColor={theme.buttonBackColor}
                    onPress={async () => {
                      const { albumId, networkId } = await createNewAlbum();
                      if (albumId && (networkId === 1 || networkId === 2)) {
                        toggleAlbumSelection(albumId);
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
                  {Object.values(groupedAlbums).map(({ network, albums }) => (
                    <View key={network.id} style={styles.networkGroup}>
                      <View
                        style={[
                          styles.networkHeader,
                          { backgroundColor: theme.inputBackColor },
                        ]}
                      >
                        <MaterialIcon
                          name={network.id === 3 ? 'email' : 'phone'}
                          size={16}
                          color={theme.textColor}
                        />
                        <Text
                          style={[
                            styles.networkTitle,
                            { color: theme.textColor },
                          ]}
                        >
                          {network.name}
                        </Text>
                        <Text
                          style={[
                            styles.networkCount,
                            { color: theme.placeholderColor },
                          ]}
                        >
                          ({albums.length})
                        </Text>
                      </View>

                      {albums.map(album => {
                        const isSelected = selectedAlbums.has(album.id);
                        const isCompatible = isAlbumCompatibleWithContacts(
                          album,
                          selectedContactsList,
                        );
                        const allExist = allContactsExistInAlbum(
                          album,
                          selectedContactsList,
                        );
                        const { existing, total } = countContactsInAlbum(
                          album,
                          selectedContactsList,
                        );
                        const isDisabled = !isCompatible || allExist;

                        return (
                          <TouchableOpacity
                            key={album.id}
                            style={[
                              styles.albumItem,
                              {
                                backgroundColor: isSelected
                                  ? theme.buttonBackColor + '30'
                                  : theme.modalBackColor,
                                borderColor: isSelected
                                  ? theme.buttonBackColor
                                  : theme.containerBorderColor,
                                opacity: isDisabled ? 0.5 : 1,
                              },
                            ]}
                            onPress={() =>
                              !isDisabled && toggleAlbumSelection(album.id)
                            }
                            disabled={isDisabled}
                          >
                            <CheckBox
                              value={isSelected}
                              onValueChange={() =>
                                !isDisabled && toggleAlbumSelection(album.id)
                              }
                              disabled={isDisabled}
                              boxType={'square'}
                              style={{
                                transform: [
                                  { scale: Platform.OS === 'ios' ? 0.8 : 1.2 },
                                ],
                                marginRight: 10,
                              }}
                              tintColors={{
                                true: theme.buttonBackColor,
                                false: theme.placeholderColor,
                              }}
                            />
                            <View style={styles.albumItemContent}>
                              <Text
                                style={[
                                  styles.albumName,
                                  { color: theme.textColor },
                                ]}
                              >
                                {album.name}
                              </Text>
                              <Text
                                style={[
                                  styles.albumCode,
                                  { color: theme.placeholderColor },
                                ]}
                              >
                                {album.code}
                              </Text>
                              {selectedContactsList.length > 0 && (
                                <View style={styles.albumStats}>
                                  {!isCompatible ? (
                                    <Text
                                      style={[
                                        styles.albumStatsText,
                                        { color: theme.darkGray },
                                      ]}
                                    >
                                      No compatible contacts
                                    </Text>
                                  ) : allExist ? (
                                    <Text
                                      style={[
                                        styles.albumStatsText,
                                        { color: theme.green },
                                      ]}
                                    >
                                      ✓ All {total} contact
                                      {total !== 1 ? 's' : ''} already added
                                    </Text>
                                  ) : existing > 0 ? (
                                    <Text
                                      style={[
                                        styles.albumStatsText,
                                        { color: theme.blue },
                                      ]}
                                    >
                                      {total - existing} new, {existing}{' '}
                                      existing
                                    </Text>
                                  ) : (
                                    <Text
                                      style={[
                                        styles.albumStatsText,
                                        { color: theme.textColor },
                                      ]}
                                    >
                                      {total} contact{total !== 1 ? 's' : ''}{' '}
                                      compatible
                                    </Text>
                                  )}
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}

                  {Object.keys(groupedAlbums).length === 0 && (
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
                    <MaterialIcon
                      name="add"
                      size={20}
                      color={theme.tintColor}
                    />
                  }
                  style={styles.createAlbumButton}
                />

                <RNSButton
                  caption={`Add to ${selectedAlbums.size} Album${selectedAlbums.size !== 1 ? 's' : ''}`}
                  bgColor={theme.buttonBackColor}
                  onPress={() => {
                    if (selectedAlbums.size > 0) {
                      setShowConfirmation(true);
                    } else {
                      Toast.show('Please select at least one album');
                    }
                  }}
                  disabled={selectedAlbums.size === 0}
                  style={styles.confirmAlbumButton}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  const availableContactsCount = filteredContacts.filter(
    c => !contactExistsInAllSelectedAlbums(c),
  ).length;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        {renderAlbumSelector()}
        {renderConfirmationModal()}

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
                    caption="Select All"
                    bgColor={theme.buttonBackColor}
                    onPress={selectAllImportedContacts}
                    disabled={loading || availableContactsCount === 0}
                    small
                    nIcon={
                      <MaterialIcon
                        name="select-all"
                        size={20}
                        color={theme.tintColor}
                      />
                    }
                    style={styles.importAllBtn}
                  />
                </View>

                {selectedAlbums.size > 0 && (
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
                      {selectedAlbums.size} album
                      {selectedAlbums.size !== 1 ? 's' : ''} selected
                    </Text>
                    <TouchableOpacity
                      onPress={() => setSelectedAlbums(new Set())}
                    >
                      <Text
                        style={[
                          styles.changeAlbumText,
                          { color: theme.placeholderColor },
                        ]}
                      >
                        Clear
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
                        const isSelected = selectedContacts.has(item.id);
                        const albumCount = countAlbumsForContact(item);
                        const existsInAll =
                          contactExistsInAllSelectedAlbums(item);
                        const isDisabled =
                          selectedAlbums.size > 0 && existsInAll;

                        return (
                          <View
                            style={[
                              styles.contactCard,
                              {
                                backgroundColor: theme.modalBackColor,
                                opacity: isDisabled ? 0.6 : 1,
                                borderWidth: isSelected ? 2 : 0,
                                borderColor: theme.buttonBackColor,
                              },
                            ]}
                          >
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
                                !isDisabled && toggleContactSelection(item.id)
                              }
                              value={isSelected}
                              disabled={isDisabled}
                              boxType={'square'}
                              tintColors={{
                                true: theme.buttonBackColor,
                                false: theme.placeholderColor,
                              }}
                            />
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
                              {albumCount > 0 && (
                                <Text
                                  style={[
                                    styles.importedLabel,
                                    { color: theme.green },
                                  ]}
                                >
                                  In {albumCount} album
                                  {albumCount !== 1 ? 's' : ''}
                                </Text>
                              )}
                              {isDisabled && (
                                <Text
                                  style={[
                                    styles.disabledLabel,
                                    { color: theme.darkGray },
                                  ]}
                                >
                                  Already in all selected albums
                                </Text>
                              )}
                            </View>
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
                    Add {selectedContacts.size} to Albums
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
  disabledLabel: {
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 2,
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
    marginBottom: 15,
  },
  albumModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactsPreview: {
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
  contactsPreviewText: {
    fontSize: 13,
    fontWeight: '600',
  },
  albumList: {
    maxHeight: 400,
    marginBottom: 15,
  },
  networkGroup: {
    marginBottom: 20,
  },
  networkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    gap: 8,
  },
  networkTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  networkCount: {
    fontSize: 13,
  },
  albumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 10,
    borderWidth: 2,
  },
  albumItemContent: {
    flex: 1,
  },
  albumName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  albumCode: {
    fontSize: 12,
    marginBottom: 4,
  },
  albumStats: {
    marginTop: 4,
  },
  albumStatsText: {
    fontSize: 11,
    fontWeight: '500',
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
  confirmationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  confirmationContent: {
    width: '100%',
    maxHeight: '70%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
  },
  confirmationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  confirmationSummary: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 15,
  },
  summaryList: {
    maxHeight: 300,
    marginBottom: 15,
  },
  summaryItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  summaryItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryAlbumName: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  summaryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  summaryDetail: {
    fontSize: 13,
  },
  summaryTotal: {
    paddingTop: 15,
    borderTopWidth: 1,
    marginTop: 10,
  },
  summaryTotalText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  confirmationButton: {
    flex: 1,
  },
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
});

export default ContactsModal;

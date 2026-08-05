import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Contacts from 'react-native-contacts';
import Toast from 'react-native-simple-toast';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import { useSelector } from 'react-redux';
import { openSettings } from 'react-native-permissions';

import PermissionRequest from './components/PermissionRequest';
import ContactsList from './components/ContactsList';
import AlbumSelector from './components/AlbumSelector';
import ConfirmationModal from './components/ConfirmationModal';
import FloatingActionButton from './components/FloatingActionButton';
import SearchAndActions from './components/SearchAndActions';
import SelectedAlbumBanner from './components/SelectedAlbumBanner';

import { useContactsData } from './hooks/useContactsData';
import { useAlbumOperations } from './hooks/useAlbumOperations';
import { useWhatsAppVerification } from './hooks/useWhatsAppVerification';
import { normalizePhone, processContacts } from './utils/contactUtils';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ContactsModal = ({
  isOpen,
  onClose,
  onImportComplete,
  recipients,
  fetchRecipients,
  albumList,
  fetchAlbumList,
}) => {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const networks = useSelector(state => state.lovs.lovs.lovs.networks);
  const theme = useTheme();

  // State management
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Selection states
  const [selectedContacts, setSelectedContacts] = useState(new Set());
  const [selectedAlbums, setSelectedAlbums] = useState(new Set());

  // Modal states
  const [showAlbumSelector, setShowAlbumSelector] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Loading states
  const [submittingBatch, setSubmittingBatch] = useState(false);

  // Custom hooks
  const { filteredContacts } = useContactsData({
    contacts,
    searchText,
    selectedContacts,
  });

  const {
    groupedAlbums,
    createNewAlbum,
    submitSelectedContactsToAlbums,
    getSubmissionSummary,
  } = useAlbumOperations({
    albumList,
    networks,
    user,
    fetchAlbumList,
    fetchRecipients,
    recipients,
    filteredContacts,
    selectedContacts,
    selectedAlbums,
    setSelectedContacts,
    setSelectedAlbums,
    setShowAlbumSelector,
    setShowConfirmation,
    setSubmittingBatch,
  });

  const { verifyWhatsAppContacts, whatsAppVerifiedContacts } =
    useWhatsAppVerification();

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
      const deviceContacts = await Contacts.getAll();
      const processedContacts = processContacts(deviceContacts);
      setContacts(processedContacts);

      // Automatically verify WhatsApp for phone contacts
      const phoneContacts = processedContacts.filter(
        c => c.type === 'phone' && c.primaryContact,
      );

      if (phoneContacts.length > 0) {
        await verifyWhatsAppContacts(phoneContacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Toast.show('Error loading contacts');
    } finally {
      setLoading(false);
    }
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

  // Select all non-imported contacts
  const selectAllImportedContacts = () => {
    const availableContactIds = filteredContacts
      .filter(c => {
        // Don't select if already in all selected albums
        if (selectedAlbums.size > 0) {
          const compatibleAlbums = Array.from(selectedAlbums)
            .map(albumId => albumList.find(a => a.id === albumId))
            .filter(Boolean);

          return !compatibleAlbums.every(album =>
            recipients?.some(
              r => r.contentId === c.primaryContact && r.albumId === album.id,
            ),
          );
        }
        return true;
      })
      .map(c => c.id);

    setSelectedContacts(new Set(availableContactIds));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedContacts(new Set());
  };

  useEffect(() => {
    if (isOpen && !permissionGranted) {
      requestContactsPermission();
    }
  }, [isOpen]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        {/* Album Selector Modal */}
        <AlbumSelector
          visible={showAlbumSelector}
          onClose={() => {
            setShowAlbumSelector(false);
            setSelectedAlbums(new Set());
          }}
          selectedContacts={selectedContacts}
          selectedAlbums={selectedAlbums}
          setSelectedAlbums={setSelectedAlbums}
          filteredContacts={filteredContacts}
          groupedAlbums={groupedAlbums}
          albumList={albumList}
          networks={networks}
          recipients={recipients}
          createNewAlbum={createNewAlbum}
          onConfirm={() => {
            if (selectedAlbums.size > 0) {
              setShowAlbumSelector(false);
              setShowConfirmation(true);
            } else {
              Toast.show('Please select at least one album');
            }
          }}
          whatsAppVerifiedContacts={whatsAppVerifiedContacts}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          visible={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          summary={getSubmissionSummary()}
          selectedContacts={selectedContacts}
          selectedAlbums={selectedAlbums}
          networks={networks}
          onConfirm={submitSelectedContactsToAlbums}
          submitting={submittingBatch}
        />

        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: theme.backgroundColor,
                paddingTop: insets.top,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: theme.textColor }]}>
                Import Contacts
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <AntdIcon name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            <View
              style={[styles.divider, { backgroundColor: theme.textColor }]}
            />

            {!permissionGranted ? (
              <PermissionRequest
                onRequestPermission={requestContactsPermission}
                onClose={onClose}
              />
            ) : (
              <>
                {/* Search and Actions */}
                <SearchAndActions
                  searchText={searchText}
                  onSearchChange={setSearchText}
                  onSelectAll={selectAllImportedContacts}
                  loading={loading}
                  availableCount={filteredContacts.length}
                />

                {/* Selected Album Banner */}
                {selectedAlbums.size > 0 && (
                  <SelectedAlbumBanner
                    count={selectedAlbums.size}
                    onClear={() => setSelectedAlbums(new Set())}
                  />
                )}

                {/* Stats Row */}
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

                {/* Contacts List */}
                <ContactsList
                  loading={loading}
                  contacts={filteredContacts}
                  selectedContacts={selectedContacts}
                  selectedAlbums={selectedAlbums}
                  onToggleSelection={toggleContactSelection}
                  recipients={recipients}
                  albumList={albumList}
                  searchText={searchText}
                  whatsAppVerifiedContacts={whatsAppVerifiedContacts}
                />
              </>
            )}
          </View>
        </SafeAreaView>

        {/* Floating Action Button */}
        {selectedContacts.size > 0 && (
          <FloatingActionButton
            count={selectedContacts.size}
            onPress={() => setShowAlbumSelector(true)}
            loading={submittingBatch}
          />
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
  divider: {
    width: '100%',
    height: 0.1,
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
});

export default ContactsModal;

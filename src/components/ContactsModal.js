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
} from 'react-native';
import Contacts from 'react-native-contacts';
import Toast from 'react-native-simple-toast';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/useUser';
import servicesettings from '../modules/dataservices/servicesettings';
import CustomeAlert from './Alert';
import RNSButton from './Button';
import RNSTextInput from './TextInput';
import { openSettings } from 'react-native-permissions';

const ContactsModal = ({
  isOpen,
  onClose,
  onImportComplete,
  recipients,
  fetchRecipients,
}) => {
  const { user } = useUser();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [importingAll, setImportingAll] = useState(false);
  const [importingIds, setImportingIds] = useState(new Set());
  const [importAllContactAlert, setImportAllContactAlert] = useState(false);

  const toggleIsImportAllContactAlert = () =>
    setImportAllContactAlert(prev => !prev);

  // Check if a contact is already imported
  const isContactImported = contact => {
    if (!recipients || !Array.isArray(recipients)) return false;

    return recipients.some(
      recipient => recipient.contentId === contact.primaryContact,
    );
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
        // iOS
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
            // Must have phone/email
            .filter(contact => contact.primaryContact)
            // Remove emergency (1–4 digits)
            .filter(contact => {
              const len = contact.primaryContact.length;
              return !(len >= 1 && len <= 4);
            })
            // Remove contacts with no names
            .filter(contact => contact.name && contact.name.length > 1)
            // Sort alphabetically A-Z
            .sort((a, b) => {
              const nameA = a.name.toLowerCase();
              const nameB = b.name.toLowerCase();
              return nameA.localeCompare(nameB);
            });

          console.log({ processedContacts });

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

  // Import a single contact
  const importContact = async contact => {
    setImportingIds(prev => new Set(prev).add(contact.id));

    try {
      const body = [
        {
          Id: 0,
          OrgId: user?.orgId,
          NetworkId: 1,
          Contentlst: [contact.primaryContact],
          Desc: '',
          CreatedBy: user?.id,
          CreatedAt: moment().utc().format(),
          LastUpdatedAt: moment().utc().format(),
          RowVer: 1,
        },
        {
          Id: 0,
          OrgId: user?.orgId,
          NetworkId: 2,
          Contentlst: [contact.primaryContact],
          Desc: '',
          CreatedBy: user?.id,
          CreatedAt: moment().utc().format(),
          LastUpdatedAt: moment().utc().format(),
          RowVer: 1,
        },
      ];

      const validEmails = (contact.emails || []).filter(
        email => email && email.length > 3,
      );

      if (validEmails.length > 0) {
        body.push({
          Id: 0,
          OrgId: user?.orgId,
          NetworkId: 3,
          Contentlst: validEmails,
          Desc: '',
          CreatedBy: user?.id,
          CreatedAt: moment().utc().format(),
          LastUpdatedAt: moment().utc().format(),
          RowVer: 1,
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

  // Import all contacts
  const importAllContacts = async () => {
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
          Id: 0,
          OrgId: user?.orgId,
          NetworkId: networkId,
          Contentlst: phoneContacts,
          Desc: '',
          CreatedBy: user?.id,
          CreatedAt: moment().utc().format(),
          LastUpdatedAt: moment().utc().format(),
          RowVer: 1,
        })),
        ...(emailContacts.length > 0
          ? [
              {
                Id: 0,
                OrgId: user?.orgId,
                NetworkId: 3,
                Contentlst: emailContacts,
                Desc: '',
                CreatedBy: user?.id,
                CreatedAt: moment().utc().format(),
                LastUpdatedAt: moment().utc().format(),
                RowVer: 1,
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

      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/postCompaignContactData',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Failed to import contacts');
        return;
      }

      const res = await response.json();
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

  // Use useMemo to filter and maintain sorted order - prevents keyboard dismissal
  const filteredContacts = useMemo(() => {
    if (!searchText.trim()) {
      return contacts;
    }

    const searchLower = searchText.toLowerCase();
    return contacts.filter(
      contact =>
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.primaryContact?.toLowerCase().includes(searchLower),
    );
  }, [searchText, contacts]);

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

  const notImportedCount = filteredContacts.filter(
    c => !isContactImported(c),
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
          Massage={`Are you sure you want to import ${filteredContacts.filter(
            c => !isContactImported(c),
          )} contact(s)?`}
        ></CustomeAlert>
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
                    onPress={toggleIsImportAllContactAlert}
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

                {!loading && (
                  <Text
                    style={[styles.resultsCount, { color: theme.textColor }]}
                  >
                    {filteredContacts.length} contact
                    {filteredContacts.length !== 1 ? 's' : ''} found
                    {notImportedCount < filteredContacts.length &&
                      ` (${notImportedCount} new)`}
                  </Text>
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

                        return (
                          <View
                            style={[
                              styles.contactCard,
                              {
                                backgroundColor: theme.modalBackColor,
                                opacity: isImported ? 0.7 : 1,
                              },
                            ]}
                          >
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
                            <TouchableOpacity
                              onPress={() => importContact(item)}
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
                              {isImporting ? (
                                <ActivityIndicator
                                  size="small"
                                  color={theme.tintColor}
                                />
                              ) : isImported ? (
                                <MaterialIcon
                                  name="check"
                                  size={20}
                                  color={theme.tintColor}
                                />
                              ) : (
                                <MaterialIcon
                                  name="person-add"
                                  size={20}
                                  color={theme.tintColor}
                                />
                              )}
                            </TouchableOpacity>
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
  resultsCount: {
    fontSize: 13,
    fontWeight: '500',
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
  additionalInfo: {
    fontSize: 12,
    fontStyle: 'italic',
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
});

export default ContactsModal;

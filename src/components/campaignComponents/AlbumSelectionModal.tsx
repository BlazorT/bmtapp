// AlbumSelectionModal.tsx (UPDATED VERSION)
import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import servicesettings from '../../modules/dataservices/servicesettings';
import RNSButton from '../Button';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { isTab } from '../../constants';
import AddAlbumModal from './AddAlbumModal';
import ImportContactsModal from './ImportContactsModal';
import {
  validateContact,
  getFormatGuidance,
  parseMultipleContacts,
} from '../../helper/contactValidation';

interface Album {
  id: number;
  name: string;
  networkid: number;
  totalContacts?: number;
}

interface Props {
  visible: boolean;
  networkIds: number[];
  disabled?: boolean;
  onSubmit: (selectedAlbums: Album[]) => void;
  onClose: () => void;
  selectedAlbums: Record<number, number[]>;
  setSelectedAlbums: any;
}

const AlbumSelectionModal: React.FC<Props> = ({
  visible,
  networkIds,
  disabled = false,
  onSubmit,
  onClose,
  setSelectedAlbums,
  selectedAlbums,
}) => {
  const { navigate } = useNavigation<any>();
  const theme = useTheme();
  const { user } = useUser();
  const lovs = useSelector((state: any) => state.lovs).lovs;
  const networks = lovs?.lovs?.networks;

  const [loading, setLoading] = useState(true);
  const [recipientsLoading, setRecipientsLoading] = useState(true);
  const [albumsByNetwork, setAlbumsByNetwork] = useState<
    Record<number, Album[]>
  >({});
  const [recipients, setRecipients] = useState([]);
  const [albumList, setAlbumList] = useState([]);
  const [showAddAlbumModal, setShowAddAlbumModal] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(networkIds[0]);

  // Contact input states
  const [selectedAlbumForContacts, setSelectedAlbumForContacts] = useState<
    number | null
  >(null);
  const [showContactInput, setShowContactInput] = useState(false);
  const [contactInput, setContactInput] = useState('');
  const [newContacts, setNewContacts] = useState<string[]>([]);
  const [isAddingContacts, setIsAddingContacts] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const toggleAddAlbumModal = () => {
    setShowAddAlbumModal(prev => !prev);
  };

  // Fetch albums
  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          id: 0,
          orgId: user?.orgId,
          rowVer: 1,
          networkId: 0,
          name: '',
          status: 1,
          createdAt: moment().utc().subtract(10, 'year').format('YYYY-MM-DD'),
          lastUpdatedAt: moment().utc().format('YYYY-MM-DD'),
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };

      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/albumlists',
        headerFetch,
      );

      if (!response.ok) throw new Error('Failed to fetch albums');

      const res = await response.json();
      setAlbumList(res?.data || []);
      const allAlbums: Album[] = res?.data || [];

      // Group albums by networkId
      const grouped: Record<number, Album[]> = {};
      networkIds.forEach(nid => {
        grouped[nid] = allAlbums.filter(a => a.networkid === nid);
      });

      setAlbumsByNetwork(grouped);
    } catch (error) {
      console.error(error);
      Toast.show('Failed to load albums', Toast.LONG);
    } finally {
      setLoading(false);
    }
  };

  // Fetch recipients
  const fetchRecipients = async () => {
    setRecipientsLoading(true);
    try {
      let headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          id: 0,
          orgId: user?.orgId,
          rowVer: 1,
          networkId: 0,
          contentId: '',
          status: 1,
          createdAt: moment().utc().subtract(10, 'year').format('YYYY-MM-DD'),
          lastUpdatedAt: moment().utc().format('YYYY-MM-DD'),
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      const response = await fetch(
        servicesettings.baseuri + 'BlazorApi/campaignrecipients',
        headerFetch,
      );

      if (!response.ok) {
        Toast.show('Something went wrong, please try again', Toast.LONG);
        return;
      }
      const res = await response.json();
      setRecipients(res?.data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      Toast.show('Something went wrong, please try again', Toast.LONG);
    } finally {
      setRecipientsLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchRecipients();
      fetchAlbums();
      setActiveTab(networkIds[0]);
    }

    // Reset contact input when modal closes
    if (!visible) {
      setShowContactInput(false);
      setContactInput('');
      setNewContacts([]);
      setSelectedAlbumForContacts(null);
    }
  }, [visible]);

  const handleAlbumSelect = (networkId: number, albumId: number) => {
    setSelectedAlbums((prev: Record<number, number[]>) => {
      const currentSelections = prev[networkId] || [];
      const isSelected = currentSelections.includes(albumId);

      return {
        ...prev,
        [networkId]: isSelected
          ? currentSelections.filter((id: number) => id !== albumId)
          : [...currentSelections, albumId],
      };
    });
  };

  const handleSelectAll = (networkId: number) => {
    const currentAlbums = albumsByNetwork[networkId] || [];
    const currentSelections = selectedAlbums[networkId] || [];
    const allAlbumIds = currentAlbums.map(a => a.id);

    const allSelected =
      allAlbumIds.length > 0 &&
      allAlbumIds.every(id => currentSelections.includes(id));

    setSelectedAlbums((prev: Record<number, number[]>) => ({
      ...prev,
      [networkId]: allSelected ? [] : allAlbumIds,
    }));
  };

  // Get current network name
  const getCurrentNetworkName = () => {
    return networks?.find((n: any) => n.id === activeTab)?.name || '';
  };

  // Get existing contacts for an album
  const getExistingContacts = (albumId: number) => {
    if (!albumId) return [];

    return (
      recipients
        ?.filter(
          (r: any) => r?.albumid === albumId && r?.networkId === activeTab,
        )
        ?.map((r: any) => r.contentId) || []
    );
  };

  // Add contact with validation
  const addContact = (value: string) => {
    const networkName = getCurrentNetworkName();
    const validation = validateContact(networkName, value);

    if (!validation.isValid) {
      Toast.show(`❌ ${validation.message}`, Toast.LONG);
      return false;
    }

    const trimmedValue = value.trim();

    // Check against existing contacts
    const existingContacts = getExistingContacts(selectedAlbumForContacts!);

    if (networkName === 'SMS' || networkName === 'WHATSAPP') {
      const normalize = n => n.replace(/\D/g, '').slice(-10);

      const exists = existingContacts.some(
        c => normalize(c) === normalize(trimmedValue),
      );
      if (exists) {
        Toast.show(`"${trimmedValue}" is already in this album.`, Toast.LONG);
        return false;
      }
      const existsInNew = newContacts.some(
        c => normalize(c) === normalize(trimmedValue),
      );

      if (existsInNew) {
        Toast.show(`"${trimmedValue}" is already added.`, Toast.LONG);
        return false;
      }
    } else {
      if (existingContacts.includes(trimmedValue)) {
        Toast.show(`"${trimmedValue}" is already in this album.`, Toast.LONG);
        return false;
      }
      // Check against newly added contacts
      if (newContacts.includes(trimmedValue)) {
        Toast.show(`"${trimmedValue}" is already added.`, Toast.LONG);
        return false;
      }
    }

    setNewContacts(prev => [...prev, trimmedValue]);
    return true;
  };

  // Handle manual contact input
  const handleAddContactManually = () => {
    const value = contactInput.trim();
    if (!value) return;

    if (addContact(value)) {
      setContactInput('');
    }
  };

  // Handle paste - parse multiple contacts
  const handlePaste = (text: string) => {
    const contacts = parseMultipleContacts(text);
    let addedCount = 0;

    contacts.forEach(contact => {
      if (addContact(contact)) {
        addedCount++;
      }
    });

    if (addedCount > 0) {
      Toast.show(`Added ${addedCount} contact(s)`, Toast.SHORT);
    }
    setContactInput('');
  };

  // Remove new contact
  const handleDeleteNewContact = (index: number) => {
    const updated = [...newContacts];
    updated.splice(index, 1);
    setNewContacts(updated);
  };

  // Save new contacts to database
  const handleSaveNewContacts = async () => {
    if (newContacts.length === 0) {
      Toast.show('No contacts to add.', Toast.LONG);
      return;
    }

    if (!selectedAlbumForContacts) {
      Toast.show('Please select an album first.', Toast.LONG);
      return;
    }

    setIsAddingContacts(true);

    try {
      const payload = [
        {
          Id: 0,
          OrgId: user?.orgId,
          NetworkId: activeTab,
          Albumid: selectedAlbumForContacts,
          Contentlst: newContacts,
          Desc: '',
          CreatedBy: user?.id,
          CreatedAt: new Date(),
          LastUpdatedAt: new Date(),
          RowVer: 1,
        },
      ];
      const response = await fetch(
        servicesettings.baseuri + 'Compaigns/postCompaignContactData',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: servicesettings.AuthorizationKey,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        Toast.show(errorResult.message || 'Server error occurred.', Toast.LONG);
        return;
      }

      const result = await response.json();

      if (result.status) {
        Toast.show(
          `${newContacts.length} contact(s) added successfully!`,
          Toast.LONG,
        );
        setNewContacts([]);
        setContactInput('');

        // Refresh recipients
        await fetchRecipients();
      } else {
        Toast.show(result.message || 'Failed to add contacts.', Toast.LONG);
      }
    } catch (error) {
      console.error('Error adding contacts:', error);
      Toast.show('Error while adding contacts.', Toast.LONG);
    } finally {
      setIsAddingContacts(false);
    }
  };

  // Handle import from other albums
  const handleImportContacts = (importedContacts: string[]) => {
    const existingContacts = getExistingContacts(selectedAlbumForContacts!);
    const newImportedContacts = importedContacts.filter(
      c => !existingContacts.includes(c) && !newContacts.includes(c),
    );

    setNewContacts(prev => [...prev, ...newImportedContacts]);
    Toast.show(
      `Added ${newImportedContacts.length} contact(s) from album`,
      Toast.SHORT,
    );
  };

  // Handle submit
  const handleSubmit = () => {
    const selectedIds = Object.values(selectedAlbums)
      .flat()
      .filter(id => id !== null) as number[];

    const albums = albumList?.filter((al: any) => selectedIds.includes(al.id));

    // Validate that all selected albums have contacts
    const emptyAlbums = albums.filter((album: any) => {
      const contactCount =
        recipients?.filter((r: any) => r?.albumid === album.id)?.length || 0;
      return contactCount === 0;
    });

    if (emptyAlbums.length > 0) {
      const emptyAlbumNames = emptyAlbums.map((a: any) => a.name).join(', ');
      Toast.show(`Add at least one contact to: ${emptyAlbumNames}`, Toast.LONG);
      return;
    }

    onSubmit(albums);
    onClose();
  };

  const isSubmitDisabled =
    Object.values(selectedAlbums).every(
      (arr: number[]) => !arr || arr.length === 0,
    ) || disabled;

  const currentAlbums = albumsByNetwork[activeTab] || [];
  const currentSelections = selectedAlbums[activeTab] || [];

  const allCurrentSelected =
    currentAlbums.length > 0 &&
    currentAlbums.every(album => currentSelections.includes(album.id));

  return (
    <Modal visible={visible} transparent animationType="slide">
      <AddAlbumModal
        fetchAlbumList={fetchAlbums}
        showAddAlbumModal={showAddAlbumModal}
        toggleAddAlbumModal={toggleAddAlbumModal}
        networkId={activeTab}
      />

      <ImportContactsModal
        visible={showImportModal}
        onClose={() => setShowImportModal(false)}
        currentAlbumId={selectedAlbumForContacts!}
        networkId={activeTab}
        albums={albumList}
        recipients={recipients}
        onImport={handleImportContacts}
      />

      <SafeAreaView style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.backgroundColor,
              width: isTab ? '60%' : '100%',
              alignSelf: 'center',
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              Select Contact List
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <AntdIcon name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {/* Network Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsContainer}
          >
            {networkIds.map(nid => (
              <TouchableOpacity
                key={nid}
                onPress={() => {
                  setActiveTab(nid);
                  setShowContactInput(false);
                  setContactInput('');
                  setNewContacts([]);
                  setSelectedAlbumForContacts(null);
                }}
                style={[
                  styles.tab,
                  {
                    borderBottomColor:
                      activeTab === nid ? theme.textColor : 'transparent',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === nid
                          ? theme.textColor
                          : theme.placeholderColor,
                      fontWeight: activeTab === nid ? '600' : '400',
                    },
                  ]}
                >
                  {networks?.find((n: any) => n.id === nid)?.name || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Album List */}
          <View style={styles.listContainer}>
            {loading || recipientsLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color={theme.buttonBackColor} />
                <Text style={[styles.loadingText, { color: theme.textColor }]}>
                  Loading albums...
                </Text>
              </View>
            ) : (
              <>
                {/* Select All Button */}
                <View style={styles.topActions}>
                  <TouchableOpacity
                    onPress={() => handleSelectAll(activeTab)}
                    style={[
                      styles.selectAllContainer,
                      { backgroundColor: theme.modalBackColor },
                    ]}
                  >
                    <View style={styles.selectAllContent}>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: theme.containerBorderColor,
                            backgroundColor: allCurrentSelected
                              ? theme.buttonBackColor
                              : 'transparent',
                          },
                        ]}
                      >
                        {allCurrentSelected && (
                          <AntdIcon
                            name="check"
                            size={16}
                            color={theme.backgroundColor}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.selectAllText,
                          { color: theme.textColor, fontWeight: '600' },
                        ]}
                      >
                        Select All ({currentSelections.length}/
                        {currentAlbums.length})
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <RNSButton
                    caption="Add Album"
                    onPress={toggleAddAlbumModal}
                    bgColor={theme.darkGray}
                    style={{ marginRight: 0, width: '35%' }}
                  />
                </View>

                {/* Album List */}
                <ScrollView
                  style={styles.albumScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {currentAlbums.map(item => {
                    const isSelected = currentSelections.includes(item.id);
                    const contactCount =
                      recipients?.filter((r: any) => r?.albumid === item.id)
                        ?.length || 0;

                    return (
                      <View key={item.id}>
                        <TouchableOpacity
                          onPress={() => handleAlbumSelect(activeTab, item.id)}
                          style={[
                            styles.albumItem,
                            {
                              backgroundColor: isSelected
                                ? theme.buttonBackColor + '20'
                                : theme.modalBackColor,
                              borderColor: isSelected
                                ? theme.buttonBackColor
                                : theme.containerBorderColor,
                            },
                          ]}
                        >
                          <View style={styles.albumItemContent}>
                            <View
                              style={[
                                styles.checkbox,
                                {
                                  borderColor: isSelected
                                    ? theme.buttonBackColor
                                    : theme.containerBorderColor,
                                  backgroundColor: isSelected
                                    ? theme.buttonBackColor
                                    : 'transparent',
                                },
                              ]}
                            >
                              {isSelected && (
                                <AntdIcon
                                  name="check"
                                  size={16}
                                  color={theme.backgroundColor}
                                />
                              )}
                            </View>

                            <View style={styles.albumInfo}>
                              <Text
                                style={[
                                  styles.albumName,
                                  { color: theme.textColor },
                                ]}
                              >
                                {item.name}
                              </Text>
                              <Text
                                style={[
                                  styles.contactCount,
                                  { color: theme.placeholderColor },
                                ]}
                              >
                                {contactCount} contact
                                {contactCount === 1 ? '' : 's'}
                              </Text>
                            </View>

                            {isSelected && (
                              <>
                                <AntdIcon
                                  name="checkcircle"
                                  size={22}
                                  color={theme.buttonBackColor}
                                />
                                <TouchableOpacity
                                  onPress={(e: any) => {
                                    e?.stopPropagation?.();
                                    setSelectedAlbumForContacts(item.id);
                                    setShowContactInput(true);
                                    setContactInput('');
                                    setNewContacts([]);
                                  }}
                                  style={{
                                    backgroundColor: theme.buttonBackColor,
                                    padding: 6,
                                    borderRadius: 6,
                                    marginLeft: 6,
                                  }}
                                >
                                  <Text style={{ color: theme.white }}>
                                    Add Contacts
                                  </Text>
                                </TouchableOpacity>
                                {/* <RNSButton
                                  caption="Add Contacts"
                                  onPress={(e: any) => {
                                    e?.stopPropagation?.();
                                    setSelectedAlbumForContacts(item.id);
                                    setShowContactInput(true);
                                    setContactInput('');
                                    setNewContacts([]);
                                  }}
                                  bgColor={theme.buttonBackColor}
                                  style={{
                                    width: 'auto',
                                    paddingLeft: 6,
                                  }}
                                  textStyle={{ fontSize: 12 }}
                                  small
                                /> */}
                              </>
                            )}
                          </View>
                        </TouchableOpacity>

                        {/* Contact Input Section */}
                        {selectedAlbumForContacts === item.id &&
                          showContactInput && (
                            <View
                              style={[
                                styles.contactInputSection,
                                {
                                  backgroundColor: theme.modalBackColor,
                                  borderColor: theme.containerBorderColor,
                                },
                              ]}
                            >
                              {/* Section Header */}
                              <View style={styles.contactInputHeader}>
                                <Text
                                  style={[
                                    styles.contactInputTitle,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  Add Contacts to {item.name}
                                </Text>
                                <TouchableOpacity
                                  onPress={() => {
                                    setShowContactInput(false);
                                    setSelectedAlbumForContacts(null);
                                    setContactInput('');
                                    setNewContacts([]);
                                  }}
                                >
                                  <AntdIcon
                                    name="close"
                                    size={20}
                                    color={theme.textColor}
                                  />
                                </TouchableOpacity>
                              </View>

                              {/* Format Guidance */}
                              <View
                                style={[
                                  styles.guidanceBox,
                                  {
                                    backgroundColor:
                                      theme.buttonBackColor + '20',
                                  },
                                ]}
                              >
                                <AntdIcon
                                  name="infocirlceo"
                                  size={16}
                                  color={theme.buttonBackColor}
                                  style={{ marginRight: 8 }}
                                />
                                <Text
                                  style={[
                                    styles.guidanceText,
                                    { color: theme.textColor },
                                  ]}
                                >
                                  {getFormatGuidance(getCurrentNetworkName())}
                                </Text>
                              </View>

                              {/* Contact Input */}
                              <View style={styles.inputRow}>
                                <TextInput
                                  style={[
                                    styles.contactInput,
                                    {
                                      backgroundColor: theme.backgroundColor,
                                      color: theme.textColor,
                                      borderColor: theme.containerBorderColor,
                                    },
                                  ]}
                                  placeholder="Enter contact"
                                  placeholderTextColor={theme.placeholderColor}
                                  value={contactInput}
                                  onChangeText={setContactInput}
                                  autoCapitalize="none"
                                  autoCorrect={false}
                                />
                                <RNSButton
                                  caption="Add"
                                  onPress={handleAddContactManually}
                                  bgColor={theme.buttonBackColor}
                                  style={{
                                    width: 'auto',
                                    paddingHorizontal: 0,
                                    marginLeft: 8,
                                  }}
                                  disabled={!contactInput.trim()}
                                  small
                                />
                              </View>

                              {/* Import Button */}
                              <RNSButton
                                caption="Import from Albums"
                                onPress={() => setShowImportModal(true)}
                                bgColor={theme.darkGray}
                                style={{ marginTop: 8 }}
                                nIcon={
                                  <AntdIcon
                                    name="download"
                                    size={16}
                                    color={theme.white}
                                    style={{ marginRight: 6 }}
                                  />
                                }
                              />

                              {/* New Contacts List */}
                              {newContacts.length > 0 && (
                                <View style={styles.newContactsSection}>
                                  <Text
                                    style={[
                                      styles.sectionLabel,
                                      { color: theme.textColor },
                                    ]}
                                  >
                                    New Contacts ({newContacts.length})
                                  </Text>
                                  <ScrollView
                                    style={styles.contactTags}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                      columnGap: 5,
                                      rowGap: 5,
                                    }}
                                  >
                                    {newContacts.map((contact, idx) => (
                                      <View
                                        key={idx}
                                        style={[
                                          styles.contactTag,
                                          {
                                            backgroundColor:
                                              theme.buttonBackColor,
                                          },
                                        ]}
                                      >
                                        <Text
                                          style={[
                                            styles.contactTagText,
                                            { color: theme.white },
                                          ]}
                                        >
                                          {contact}
                                        </Text>
                                        <TouchableOpacity
                                          onPress={() =>
                                            handleDeleteNewContact(idx)
                                          }
                                          style={styles.deleteIcon}
                                        >
                                          <AntdIcon
                                            name="close"
                                            size={14}
                                            color={theme.white}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                    ))}
                                  </ScrollView>

                                  <RNSButton
                                    caption={
                                      isAddingContacts
                                        ? 'Saving...'
                                        : `Save ${newContacts.length} Contact(s)`
                                    }
                                    onPress={handleSaveNewContacts}
                                    disabled={isAddingContacts}
                                    bgColor={theme.buttonBackColor}
                                    style={{ marginTop: 12 }}
                                  />
                                </View>
                              )}

                              {/* Existing Contacts */}
                              {getExistingContacts(item.id).length > 0 && (
                                <View style={styles.existingContactsSection}>
                                  <Text
                                    style={[
                                      styles.sectionLabel,
                                      { color: theme.placeholderColor },
                                    ]}
                                  >
                                    Existing Contacts (
                                    {getExistingContacts(item.id).length})
                                  </Text>
                                  <ScrollView
                                    style={[
                                      styles.existingContactsList,
                                      {
                                        borderColor: theme.containerBorderColor,
                                        backgroundColor: theme.backgroundColor,
                                      },
                                    ]}
                                    contentContainerStyle={{
                                      flexDirection: 'row',
                                      rowGap: 5,
                                      columnGap: 5,
                                      flexWrap: 'wrap',
                                    }}
                                    nestedScrollEnabled
                                  >
                                    {getExistingContacts(item.id).map(
                                      (contact, idx) => (
                                        <View
                                          key={idx}
                                          style={[
                                            styles.existingContactItem,
                                            {
                                              backgroundColor:
                                                theme.modalBackColor,
                                            },
                                          ]}
                                        >
                                          <Text
                                            style={[
                                              styles.existingContactText,
                                              { color: theme.textColor },
                                            ]}
                                          >
                                            {contact}
                                          </Text>
                                        </View>
                                      ),
                                    )}
                                  </ScrollView>
                                </View>
                              )}
                            </View>
                          )}
                      </View>
                    );
                  })}
                </ScrollView>
              </>
            )}
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <RNSButton
              caption="Cancel"
              onPress={onClose}
              bgColor={theme.darkGray}
              style={{ marginRight: 10, width: '48%' }}
            />
            <RNSButton
              caption="Confirm"
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              bgColor={
                isSubmitDisabled ? theme.darkGray : theme.buttonBackColor
              }
              style={{ width: '48%' }}
              textStyle={{ fontSize: Platform.OS === 'ios' ? 14 : 16 }}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '99%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeBtn: {
    padding: 6,
  },
  tabsContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
  },
  listContainer: {
    flex: 1,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  selectAllContainer: {
    padding: 12,
    borderRadius: 10,
    width: '60%',
  },
  selectAllContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectAllText: {
    fontSize: 16,
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  albumScrollView: {
    flex: 1,
  },
  albumItem: {
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    padding: 14,
  },
  albumItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  albumInfo: {
    flex: 1,
    marginLeft: 12,
  },
  albumName: {
    fontSize: 16,
    fontWeight: '600',
  },
  contactCount: {
    fontSize: 13,
    marginTop: 4,
  },
  contactInputSection: {
    marginTop: 8,
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  contactInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactInputTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  guidanceBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  guidanceText: {
    fontSize: 13,
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  newContactsSection: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  contactTags: {
    maxHeight: 100,
  },
  contactTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  contactTagText: {
    fontSize: 13,
    marginRight: 6,
  },
  deleteIcon: {
    padding: 2,
  },
  existingContactsSection: {
    marginTop: 16,
  },
  existingContactsList: {
    maxHeight: 120,
    borderWidth: 1,
    borderRadius: 8,
    padding: 5,
  },
  existingContactItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  existingContactText: {
    fontSize: 13,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
});

export default AlbumSelectionModal;

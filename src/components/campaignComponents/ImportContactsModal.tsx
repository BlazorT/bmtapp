// ImportContactsModal.tsx
import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import { useTheme } from '../../hooks/useTheme';
import RNSButton from '../Button';

interface Contact {
  contentId: string;
  albumid: number;
  networkId: number;
}

interface Album {
  id: number;
  name: string;
  networkid: number;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  currentAlbumId: number;
  networkId: number;
  albums: Album[];
  recipients: Contact[];
  onImport: (selectedContacts: string[]) => void;
}

const ImportContactsModal: React.FC<Props> = ({
  visible,
  onClose,
  currentAlbumId,
  networkId,
  albums,
  recipients,
  onImport,
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState<number | null>(null);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(
    new Set(),
  );

  // Filter albums for the same network, excluding current album
  const availableAlbums = useMemo(() => {
    return albums.filter(
      album => album.networkid === networkId && album.id !== currentAlbumId,
    );
  }, [albums, networkId, currentAlbumId]);

  // Get contacts for selected album, excluding those already in current album
  const albumContacts = useMemo(() => {
    if (!selectedAlbum) return [];

    const currentAlbumContacts = recipients
      .filter(r => r.albumid === currentAlbumId && r.networkId === networkId)
      .map(r => r.contentId);

    const contacts = recipients
      .filter(r => r.albumid === selectedAlbum && r.networkId === networkId)
      .map(r => r.contentId)
      .filter(contentId => !currentAlbumContacts.includes(contentId));

    // Apply search filter
    if (searchQuery.trim()) {
      return contacts.filter(contact =>
        contact.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return contacts;
  }, [selectedAlbum, recipients, currentAlbumId, networkId, searchQuery]);

  const handleContactToggle = (contact: string) => {
    setSelectedContacts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contact)) {
        newSet.delete(contact);
      } else {
        newSet.add(contact);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedContacts.size === albumContacts.length) {
      setSelectedContacts(new Set());
    } else {
      setSelectedContacts(new Set(albumContacts));
    }
  };

  const handleImport = () => {
    if (selectedContacts.size === 0) return;
    onImport(Array.from(selectedContacts));
    handleClose();
  };

  const handleClose = () => {
    setSearchQuery('');
    setSelectedAlbum(null);
    setSelectedContacts(new Set());
    onClose();
  };

  const allSelected =
    albumContacts.length > 0 && selectedContacts.size === albumContacts.length;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.backgroundColor },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              Import Contacts from Albums
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <AntdIcon name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {/* Album Selection */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Select Album
            </Text>
            <FlatList
              data={availableAlbums}
              keyExtractor={item => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => {
                const isSelected = selectedAlbum === item.id;
                const contactCount = recipients.filter(
                  r => r.albumid === item.id && r.networkId === networkId,
                ).length;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedAlbum(item.id);
                      setSelectedContacts(new Set());
                      setSearchQuery('');
                    }}
                    style={[
                      styles.albumChip,
                      {
                        backgroundColor: isSelected
                          ? theme.buttonBackColor
                          : theme.modalBackColor,
                        borderColor: isSelected
                          ? theme.buttonBackColor
                          : theme.containerBorderColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.albumChipText,
                        {
                          color: isSelected
                            ? theme.textColor
                            : theme.placeholderColor,
                        },
                      ]}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={[
                        styles.albumChipCount,
                        {
                          color: isSelected
                            ? theme.textColor
                            : theme.placeholderColor,
                        },
                      ]}
                    >
                      {contactCount} contacts
                    </Text>
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text
                  style={[styles.emptyText, { color: theme.placeholderColor }]}
                >
                  No other albums available for this network
                </Text>
              }
            />
          </View>

          {/* Contacts List */}
          {selectedAlbum && (
            <>
              {/* Search Bar */}
              <View style={styles.searchContainer}>
                <AntdIcon
                  name="search1"
                  size={20}
                  color={theme.placeholderColor}
                  style={styles.searchIcon}
                />
                <TextInput
                  style={[
                    styles.searchInput,
                    {
                      color: theme.textColor,
                      backgroundColor: theme.modalBackColor,
                    },
                  ]}
                  placeholder="Search contacts..."
                  placeholderTextColor={theme.placeholderColor}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setSearchQuery('')}
                    style={styles.clearBtn}
                  >
                    <AntdIcon
                      name="closecircle"
                      size={18}
                      color={theme.placeholderColor}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* Select All */}
              {albumContacts.length > 0 && (
                <TouchableOpacity
                  onPress={handleSelectAll}
                  style={[
                    styles.selectAllContainer,
                    { backgroundColor: theme.modalBackColor },
                  ]}
                >
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: theme.containerBorderColor,
                        backgroundColor: allSelected
                          ? theme.buttonBackColor
                          : 'transparent',
                      },
                    ]}
                  >
                    {allSelected && (
                      <AntdIcon name="check" size={16} color={theme.white} />
                    )}
                  </View>
                  <Text
                    style={[styles.selectAllText, { color: theme.textColor }]}
                  >
                    Select All ({selectedContacts.size}/{albumContacts.length})
                  </Text>
                </TouchableOpacity>
              )}

              {/* Contact List */}
              <FlatList
                data={albumContacts}
                keyExtractor={(item, index) => `${item}-${index}`}
                style={styles.contactList}
                renderItem={({ item }) => {
                  const isSelected = selectedContacts.has(item);
                  return (
                    <TouchableOpacity
                      onPress={() => handleContactToggle(item)}
                      style={[
                        styles.contactItem,
                        {
                          backgroundColor: isSelected
                            ? theme.modalBackColor
                            : theme.backgroundColor,
                          borderColor: isSelected
                            ? theme.buttonBackColor
                            : theme.containerBorderColor,
                        },
                      ]}
                    >
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
                            color={theme.white}
                          />
                        )}
                      </View>
                      <Text
                        style={[styles.contactText, { color: theme.textColor }]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text
                      style={[
                        styles.emptyText,
                        { color: theme.placeholderColor },
                      ]}
                    >
                      {searchQuery.trim()
                        ? 'No contacts found matching your search'
                        : 'No new contacts available to import'}
                    </Text>
                  </View>
                }
              />
            </>
          )}

          {/* Footer */}
          <View style={styles.footer}>
            <RNSButton
              caption="Cancel"
              onPress={handleClose}
              bgColor={theme.darkGray}
              style={{ marginRight: 10, width: '48%' }}
            />
            <RNSButton
              caption={`Import (${selectedContacts.size})`}
              onPress={handleImport}
              disabled={selectedContacts.size === 0}
              bgColor={
                selectedContacts.size === 0
                  ? theme.darkGray
                  : theme.buttonBackColor
              }
              style={{ width: '48%' }}
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
    height: '85%',
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
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  closeBtn: {
    padding: 6,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  albumChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    minWidth: 120,
  },
  albumChipText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  albumChipCount: {
    fontSize: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 12,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 40,
    fontSize: 14,
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    padding: 5,
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  selectAllText: {
    fontSize: 15,
    fontWeight: '600',
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
  contactList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
  },
  contactText: {
    fontSize: 15,
    marginLeft: 12,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});

export default ImportContactsModal;

import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import { useTheme } from '../../../hooks/useTheme';
import RNSButton from '../../Button';
import NewAlbumForm from './NewAlbumForm';
import {
  isAlbumCompatibleWithContacts,
  allContactsExistInAlbum,
  countContactsInAlbum,
} from '../utils/contactUtils';

const AlbumItem = ({
  album,
  isSelected,
  isDisabled,
  stats,
  network,
  onToggle,
  hasSelectedContacts,
}) => {
  const theme = useTheme();

  return (
    <TouchableOpacity
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
      onPress={() => !isDisabled && onToggle(album.id)}
      disabled={isDisabled}
    >
      <CheckBox
        value={isSelected}
        onValueChange={() => !isDisabled && onToggle(album.id)}
        disabled={isDisabled}
        boxType={'square'}
        style={{
          transform: [{ scale: Platform.OS === 'ios' ? 0.8 : 1.2 }],
          marginRight: 10,
        }}
        tintColors={{
          true: theme.buttonBackColor,
          false: theme.placeholderColor,
        }}
      />
      <View style={styles.albumItemContent}>
        <Text style={[styles.albumName, { color: theme.textColor }]}>
          {album.name}
        </Text>
        <Text style={[styles.albumCode, { color: theme.placeholderColor }]}>
          {album.code}
        </Text>
        {hasSelectedContacts && stats && (
          <View style={styles.albumStats}>
            {!stats.isCompatible ? (
              <Text style={[styles.albumStatsText, { color: theme.darkGray }]}>
                No compatible contacts
              </Text>
            ) : stats.allExist ? (
              <Text style={[styles.albumStatsText, { color: theme.green }]}>
                ✓ All {stats.total} contact{stats.total !== 1 ? 's' : ''}{' '}
                already added
              </Text>
            ) : stats.existing > 0 ? (
              <Text style={[styles.albumStatsText, { color: theme.blue }]}>
                {stats.total - stats.existing} new, {stats.existing} existing
              </Text>
            ) : (
              <Text style={[styles.albumStatsText, { color: theme.textColor }]}>
                {stats.total} contact{stats.total !== 1 ? 's' : ''} compatible
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const NetworkGroup = ({
  network,
  albums,
  selectedAlbums,
  selectedContactsList,
  recipients,
  onToggleAlbum,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.networkGroup}>
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
        <Text style={[styles.networkTitle, { color: theme.textColor }]}>
          {network.name}
        </Text>
        <Text style={[styles.networkCount, { color: theme.placeholderColor }]}>
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
          recipients,
        );
        const { existing, total } = countContactsInAlbum(
          album,
          selectedContactsList,
          recipients,
        );
        const isDisabled = !isCompatible || allExist;

        return (
          <AlbumItem
            key={album.id}
            album={album}
            isSelected={isSelected}
            isDisabled={isDisabled}
            stats={{
              isCompatible,
              allExist,
              existing,
              total,
            }}
            network={network}
            onToggle={onToggleAlbum}
            hasSelectedContacts={selectedContactsList.length > 0}
          />
        );
      })}
    </View>
  );
};

const AlbumSelector = ({
  visible,
  onClose,
  selectedContacts,
  selectedAlbums,
  setSelectedAlbums,
  filteredContacts,
  groupedAlbums,
  albumList,
  networks,
  recipients,
  createNewAlbum,
  onConfirm,
  whatsAppVerifiedContacts,
}) => {
  const theme = useTheme();
  const [showNewAlbumForm, setShowNewAlbumForm] = React.useState(false);

  const selectedContactsList = filteredContacts.filter(c =>
    selectedContacts.has(c.id),
  );

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

  // Count WhatsApp verified contacts
  const whatsAppCount = selectedContactsList.filter(
    c => whatsAppVerifiedContacts?.get?.(c.id)?.hasWhatsApp,
  ).length;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[styles.content, { backgroundColor: theme.modalBackColor }]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              Select Albums ({selectedAlbums.size} selected)
            </Text>
            <TouchableOpacity onPress={onClose}>
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
                style={[styles.contactsPreviewText, { color: theme.textColor }]}
              >
                {selectedContactsList.length} contact
                {selectedContactsList.length !== 1 ? 's' : ''} selected
                {/* {whatsAppCount > 0 && (
                  <Text style={{ color: '#25D366' }}>
                    {' '}
                    • {whatsAppCount} WhatsApp
                  </Text>
                )} */}
              </Text>
            </View>
          )}

          {showNewAlbumForm ? (
            <NewAlbumForm
              networks={networks}
              onCancel={() => setShowNewAlbumForm(false)}
              onCreate={async data => {
                const { albumId, networkId } = await createNewAlbum(data);
                if (albumId && (networkId === 1 || networkId === 2)) {
                  toggleAlbumSelection(albumId);
                }
              }}
            />
          ) : (
            <>
              <ScrollView style={styles.albumList}>
                {Object.values(groupedAlbums).map(({ network, albums }) => (
                  <NetworkGroup
                    key={network.id}
                    network={network}
                    albums={albums}
                    selectedAlbums={selectedAlbums}
                    selectedContactsList={selectedContactsList}
                    recipients={recipients}
                    onToggleAlbum={toggleAlbumSelection}
                  />
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
                  <MaterialIcon name="add" size={20} color={theme.tintColor} />
                }
                style={styles.createButton}
              />

              <RNSButton
                caption={`Add to ${selectedAlbums.size} Album${selectedAlbums.size !== 1 ? 's' : ''}`}
                bgColor={theme.buttonBackColor}
                onPress={onConfirm}
                disabled={selectedAlbums.size === 0}
                style={styles.confirmButton}
              />
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
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
  createButton: {
    marginBottom: 10,
  },
  confirmButton: {
    marginTop: 5,
  },
});

export default AlbumSelector;

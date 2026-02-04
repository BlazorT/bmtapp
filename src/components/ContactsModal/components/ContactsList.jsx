import React from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../../../hooks/useTheme';
import {
  contactExistsInAllSelectedAlbums,
  countAlbumsForContact,
} from '../utils/contactUtils';
import { useWhatsAppVerification } from '../hooks/useWhatsAppVerification';

const ContactItem = ({
  item,
  isSelected,
  isDisabled,
  albumCount,
  existsInAll,
  onToggleSelection,
  whatsAppStatus,
}) => {
  const theme = useTheme();
  const { canOpenWhatsApp } = useWhatsAppVerification();

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
          transform: [{ scale: Platform.OS === 'ios' ? 0.8 : 1.2 }],
          marginRight: 10,
        }}
        onValueChange={() => !isDisabled && onToggleSelection(item.id)}
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
          <Text style={[styles.contactName, { color: theme.textColor }]}>
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
              name={item.type === 'phone' ? 'phone' : 'email'}
              size={12}
              color={item.type === 'phone' ? theme.green : theme.blue}
            />
            <Text
              style={[
                styles.typeText,
                {
                  color: item.type === 'phone' ? theme.green : theme.blue,
                },
              ]}
            >
              {item.type === 'phone'
                ? whatsAppStatus?.hasWhatsApp
                  ? 'SMS | WhatsApp'
                  : 'SMS'
                : 'Email'}
            </Text>
          </View>
        </View>
        <View style={styles.contactDetailRow}>
          <Text
            style={[styles.contactDetail, { color: theme.placeholderColor }]}
            numberOfLines={1}
          >
            {item.primaryContact}
          </Text>
          {/* {item.type === 'phone' && whatsAppStatus?.hasWhatsApp && (
            <View
              style={[
                styles.whatsappBadge,
                { backgroundColor: '#25D366' + '20' },
              ]}
            >
              <MaterialIcon name="check-circle" size={12} color="#25D366" />
              <Text style={[styles.whatsappText, { color: '#25D366' }]}>
                WhatsApp
              </Text>
            </View>
          )} */}
        </View>
        {albumCount > 0 && (
          <Text style={[styles.importedLabel, { color: theme.green }]}>
            In {albumCount} album{albumCount !== 1 ? 's' : ''}
          </Text>
        )}
        {isDisabled && (
          <Text style={[styles.disabledLabel, { color: theme.darkGray }]}>
            Already in all selected albums
          </Text>
        )}
      </View>
    </View>
  );
};

const ContactsList = ({
  loading,
  contacts,
  selectedContacts,
  selectedAlbums,
  onToggleSelection,
  recipients,
  albumList,
  searchText,
  whatsAppVerifiedContacts,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={theme.buttonBackColor} size="large" />
        <Text style={[styles.loadingText, { color: theme.textColor }]}>
          Loading contacts...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={contacts}
        renderItem={({ item }) => {
          const isSelected = selectedContacts.has(item.id);
          const albumCount = countAlbumsForContact(item, albumList, recipients);
          const existsInAll = contactExistsInAllSelectedAlbums(
            item,
            selectedAlbums,
            albumList,
            recipients,
          );
          const isDisabled = selectedAlbums.size > 0 && existsInAll;
          const whatsAppStatus = whatsAppVerifiedContacts?.get?.(item.id);

          return (
            <ContactItem
              item={item}
              isSelected={isSelected}
              isDisabled={isDisabled}
              albumCount={albumCount}
              existsInAll={existsInAll}
              onToggleSelection={onToggleSelection}
              whatsAppStatus={whatsAppStatus}
            />
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
            <Text style={[styles.emptyText, { color: theme.focusText }]}>
              No contacts found
            </Text>
            <Text
              style={[styles.emptySubText, { color: theme.placeholderColor }]}
            >
              {searchText
                ? 'Try adjusting your search'
                : 'No contacts available to import'}
            </Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  contactDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  contactDetail: {
    fontSize: 14,
    flex: 1,
  },
  whatsappBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 3,
  },
  whatsappText: {
    fontSize: 10,
    fontWeight: '600',
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
});

export default ContactsList;

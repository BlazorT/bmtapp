import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AntdIcon from 'react-native-vector-icons/AntDesign';
import RNSButton from '../../Button';
import { useTheme } from '../../../hooks/useTheme';

const SummaryItem = ({
  album,
  newCount,
  existingCount,
  totalCompatible,
  network,
}) => {
  const theme = useTheme();

  return (
    <View
      style={[styles.summaryItem, { backgroundColor: theme.inputBackColor }]}
    >
      <View style={styles.summaryItemHeader}>
        <Text style={[styles.summaryAlbumName, { color: theme.textColor }]}>
          {album.name}
        </Text>
        <View
          style={[styles.summaryBadge, { backgroundColor: theme.green + '20' }]}
        >
          <Text style={[styles.summaryBadgeText, { color: theme.green }]}>
            {network?.name}
          </Text>
        </View>
      </View>
      <Text style={[styles.summaryDetail, { color: theme.placeholderColor }]}>
        {newCount} new contact{newCount !== 1 ? 's' : ''}
        {existingCount > 0 &&
          ` (${existingCount} already exist${existingCount !== 1 ? '' : 's'})`}
      </Text>
    </View>
  );
};

const ConfirmationModal = ({
  visible,
  onClose,
  summary,
  selectedContacts,
  selectedAlbums,
  networks,
  onConfirm,
  submitting,
}) => {
  const theme = useTheme();

  if (!visible) return null;

  const totalNew = summary.reduce((sum, item) => sum + item.newCount, 0);
  const totalExisting = summary.reduce(
    (sum, item) => sum + item.existingCount,
    0,
  );

  return (
    <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 999 }}>
      <View style={styles.overlay}>
        <View
          style={[styles.content, { backgroundColor: theme.modalBackColor }]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.textColor }]}>
              Confirm Addition
            </Text>
            <TouchableOpacity onPress={onClose}>
              <AntdIcon name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          <View style={styles.summaryContainer}>
            <Text style={[styles.summaryTitle, { color: theme.textColor }]}>
              Adding {selectedContacts.size} contact(s) to {selectedAlbums.size}{' '}
              album(s):
            </Text>

            <ScrollView style={styles.summaryList}>
              {summary.map(
                ({ album, newCount, existingCount, totalCompatible }) => (
                  <SummaryItem
                    key={album.id}
                    album={album}
                    newCount={newCount}
                    existingCount={existingCount}
                    totalCompatible={totalCompatible}
                    network={networks?.find(n => n.id === album.networkid)}
                  />
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

          <View style={styles.buttons}>
            <RNSButton
              caption="Cancel"
              bgColor={theme.placeholderColor}
              onPress={onClose}
              disabled={submitting}
              style={styles.button}
            />
            <RNSButton
              caption="Confirm"
              bgColor={theme.buttonBackColor}
              onPress={onConfirm}
              loading={submitting}
              disabled={submitting || totalNew === 0}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryContainer: {
    // flex: 1,
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
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
  },
});

export default ConfirmationModal;

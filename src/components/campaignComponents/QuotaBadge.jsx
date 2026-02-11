import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // or any icon family you like
import { useTheme } from '../../hooks/useTheme';

const QuotaBadge = ({ totalQuota, usedQuota, remainingQuota }) => {
  const theme = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const isOverused = remainingQuota < 0;
  const isLimitReached = remainingQuota === 0;

  const displayRemaining = Math.max(remainingQuota, 0);
  const overusedAmount = isOverused ? Math.abs(remainingQuota) : 0;

  const badgeColor =
    isOverused || isLimitReached ? '#E53E3E' : theme.buttonBackColor; // danger / info

  const badgeText = isOverused
    ? `Over by ${overusedAmount}`
    : isLimitReached
      ? 'Limit reached'
      : `${displayRemaining} left`;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity
        style={[styles.badge, { backgroundColor: badgeColor }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.badgeText}>{badgeText}</Text>
        <Icon name="info" size={16} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.modalBackColor },
            ]}
          >
            <Text style={[styles.modalText, { color: theme.textColor }]}>
              Total : <Text style={styles.bold}>{totalQuota}</Text>
            </Text>
            <Text style={[styles.modalText, { color: theme.textColor }]}>
              Used : <Text style={styles.bold}>{usedQuota}</Text>
            </Text>
            <Text style={[styles.modalText, { color: theme.textColor }]}>
              Remaining :{' '}
              <Text style={[styles.bold, isOverused && { color: '#E53E3E' }]}>
                {displayRemaining}
              </Text>
            </Text>

            {isOverused && (
              <Text
                style={[
                  [styles.modalText],
                  { marginTop: 8, color: '#E53E3E', fontWeight: '600' },
                ]}
              >
                Overused by {overusedAmount}. Payment required for extra usage.
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    columnGap: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
  },
  modalText: {
    fontSize: 14,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '700',
  },
});

export default QuotaBadge;

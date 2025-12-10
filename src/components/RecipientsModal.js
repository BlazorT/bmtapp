import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import RecipientsList from './campaignComponents/RecipientsList';

const RecipientsModal = ({ isOpen, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <SafeAreaView style={{ flex: 1, width: '100%' }}>
          <View
            style={[
              styles.container,
              { backgroundColor: theme.backgroundColor },
            ]}
          >
            <RecipientsList />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default RecipientsModal;

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
});

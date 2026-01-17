// components/PDFViewerModal.js
import React from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Pdf from 'react-native-pdf';

const { width, height } = Dimensions.get('window');

export default function PDFViewerModal({ visible, onClose, pdfUri }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>× Close</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Agreement PDF</Text>
        </View>

        <Pdf
          source={{ uri: pdfUri, cache: true }}
          onLoadComplete={numberOfPages => {
            console.log(`PDF loaded — ${numberOfPages} pages`);
          }}
          onPageChanged={page => console.log(`Page: ${page}`)}
          onError={error => console.log('PDF error:', error)}
          style={styles.pdf}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    marginTop: Platform.OS === 'ios' ? 50 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#111',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  closeBtn: { paddingHorizontal: 12 },
  closeText: { color: '#FF3B30', fontSize: 17, fontWeight: '600' },
  title: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  pdf: { flex: 1, width, backgroundColor: '#f5f5f5' },
});

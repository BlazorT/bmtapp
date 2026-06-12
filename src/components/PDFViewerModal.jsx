// components/PDFViewerModal.js
import React from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Pdf from 'react-native-pdf';
import Toast from 'react-native-simple-toast';

const { width } = Dimensions.get('window');

export default function PDFViewerModal({ visible, onClose, pdfUri }) {
  const handleDownload = async () => {
    try {
      const timestamp = new Date().getTime();
      const fileName = `BMT_Agreement_${timestamp}.pdf`;

      const { dirs } = ReactNativeBlobUtil.fs;
      const downloadPath =
        Platform.OS === 'ios'
          ? `${dirs.DocumentDir}/${fileName}`
          : `${dirs.DownloadDir}/${fileName}`;

      // Copy file to downloads directory
      await ReactNativeBlobUtil.fs.cp(pdfUri, downloadPath);

      // For Android, add to downloads and show notification
      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.MediaCollection.copyToMediaStore(
          {
            name: fileName,
            parentFolder: '',
            mimeType: 'application/pdf',
          },
          'Download',
          downloadPath,
        );

        ReactNativeBlobUtil.android.addCompleteDownload({
          title: fileName,
          description: 'BMT Agreement PDF downloaded',
          mime: 'application/pdf',
          path: downloadPath,
          showNotification: true,
        });
      }

      Toast.show(
        `PDF saved to: ${Platform.OS === 'ios' ? 'Files app' : 'Downloads folder'}`,
      );
    } catch (error) {
      console.error('Download error:', error);
      Toast.show('Unable to save the PDF. Please try again.');
    }
  };

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
          <TouchableOpacity onPress={handleDownload} style={styles.downloadBtn}>
            <Text style={styles.downloadText}>↓ Download</Text>
          </TouchableOpacity>
        </View>

        <Pdf
          source={{ uri: pdfUri, cache: true }}
          // onLoadComplete={numberOfPages => {
          //   console.log(`PDF loaded — ${numberOfPages} pages`);
          // }}
          // onPageChanged={page => console.log(`Page: ${page}`)}
          onError={error => console.error('PDF error:', error)}
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
    marginHorizontal: 8,
  },
  downloadBtn: { paddingHorizontal: 12 },
  downloadText: { color: '#007AFF', fontSize: 17, fontWeight: '600' },
  pdf: { flex: 1, width, backgroundColor: '#f5f5f5' },
});

import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { isTab } from '../constants';
import { useTheme } from '../hooks/useTheme';
import { colors } from '../styles';

const MediaPickerModal = ({
  isOpen,
  close,
  isImage,
  openCamera,
  openGallery,
}) => {
  const theme = useTheme();
  return (
    <Modal visible={isOpen} transparent={true} animationType="fade">
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: theme.modalBackColor },
          ]}
        >
          <Text style={[styles.modalTitle, { color: theme.selectedCheckBox }]}>
            Select {isImage ? 'Image' : 'Video'} Source
          </Text>
          <Text style={styles.modalSubtitle}>
            Choose where to pick your {isImage ? 'image' : 'video'} from
          </Text>

          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: theme.buttonBackColor },
            ]}
            onPress={openCamera}
          >
            <Text style={styles.modalButtonText}>📷 Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.modalButton,
              { backgroundColor: theme.buttonBackColor },
            ]}
            onPress={openGallery}
          >
            <Text style={styles.modalButtonText}>🖼️ Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => close()}
          >
            <Text
              style={[
                styles.modalButtonText,
                styles.cancelButtonText,
                { color: theme.placeholderColor },
              ]}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
      >
        <View
          style={{
            width: isTab ? '30%' : Dimensions.get('screen').width - 20,
            height: Dimensions.get('screen').height - 550,
            borderRadius: 10,
            backgroundColor: theme.modalBackColor,
            paddingHorizontal: 10,
            paddingVertical: 20,
            rowGap: 10,
          }}
        >
          {isImage && (
            <>
              <TouchableOpacity onPress={openCamera}>
                <Text style={{ color: theme.textColor, fontSize: 20 }}>
                  Take Photo
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openGallery}>
                <Text style={{ color: theme.textColor, fontSize: 20 }}>
                  Choose Photo from gallery
                </Text>
              </TouchableOpacity>
            </>
          )}
          {!isImage && (
            <>
              <TouchableOpacity onPress={openCamera}>
                <Text style={{ color: theme.textColor, fontSize: 20 }}>
                  Take Video
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openGallery}>
                <Text style={{ color: theme.textColor, fontSize: 20 }}>
                  Choose Video from gallery
                </Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            onPress={close}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              borderTopColor: theme.textColor,
              borderTopWidth: 1,
            }}
          >
            <Text style={{ color: theme.textColor, fontSize: 20 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </Modal>
  );
};

export default MediaPickerModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: isTab ? '30%' : '80%',
    backgroundColor: colors.white || '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.TextColor || '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.placeholderColor || '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.buttonBackColor || '#007AFF',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: colors.borderColor || '#e0e0e0',
    marginTop: 16,
  },
  cancelButtonText: {
    color: colors.TextColor || '#333',
  },
});

// components/ProfileSection.js
import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ActionSheetIOS,
  Linking,
  Modal,
  Text,
} from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Alert from './Alert';
import { colors } from '../styles';
import { useTheme } from '../hooks/useTheme';

const profileIcon = require('../../assets/images/defaultUser.png');

export default function ProfileSection({ img, setimg, EditImgURI }) {
  const theme = useTheme();
  const [permissionVisible, setpermissionVisible] = useState(false);
  const [permissionType, setPermissionType] = useState('');
  const [sourceModalVisible, setSourceModalVisible] = useState(false);

  const requestCameraPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    check(permission)
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            launchCameraHandler();
            break;
          case RESULTS.DENIED:
            request(permission).then(res => {
              if (res === RESULTS.GRANTED) launchCameraHandler();
            });
            break;
          case RESULTS.BLOCKED:
            setPermissionType('camera');
            setpermissionVisible(true);
            break;
          default:
            break;
        }
      })
      .catch(error => console.error('Camera permission error:', error));
  };

  const requestGalleryPermission = async () => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.PHOTO_LIBRARY
        : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;

    check(permission)
      .then(result => {
        switch (result) {
          case RESULTS.GRANTED:
            launchGalleryHandler();
            break;
          case RESULTS.DENIED:
            request(permission).then(res => {
              if (res === RESULTS.GRANTED) launchGalleryHandler();
            });
            break;
          case RESULTS.BLOCKED:
            setPermissionType('gallery');
            setpermissionVisible(true);
            break;
          default:
            break;
        }
      })
      .catch(error => console.error('Gallery permission error:', error));
  };

  const launchCameraHandler = () => {
    launchCamera(
      {
        mediaType: 'photo',
        includeBase64: true,
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          setimg(response.assets);
        }
      },
    );
  };

  const launchGalleryHandler = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        selectionLimit: 1,
      },
      response => {
        if (!response.didCancel && !response.errorCode) {
          if (response.assets && response.assets.length > 0) {
            setimg(response.assets);
          }
        }
      },
    );
  };

  const handleCameraPress = () => {
    setSourceModalVisible(false);
    requestCameraPermission();
  };

  const handleGalleryPress = () => {
    setSourceModalVisible(false);
    if (Platform.OS === 'ios') {
      requestGalleryPermission();
    } else {
      launchGalleryHandler();
    }
  };

  const handleImageSourceSelection = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Camera', 'Gallery'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: undefined,
          userInterfaceStyle: 'dark',
        },
        index => {
          if (index === 1) {
            requestCameraPermission();
          } else if (index === 2) {
            requestGalleryPermission();
          }
        },
      );
    } else {
      setSourceModalVisible(true);
    }
  };

  const getPermissionMessage = () => {
    if (permissionType === 'camera') {
      return '"BDMT" would like to access your camera';
    } else if (permissionType === 'gallery') {
      return '"BDMT" would like to access your photos';
    }
    return '"BDMT" would like to access your device';
  };

  return (
    <>
      <Alert
        massagetype={'warning'}
        hide={() => setpermissionVisible(false)}
        confirm={() => {
          setpermissionVisible(false);
          Linking.openSettings();
        }}
        Visible={permissionVisible}
        alerttype={'confirmation'}
        Title={'Permission Required'}
        Massage={getPermissionMessage()}
      />

      <Modal
        visible={sourceModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSourceModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.modalBackColor },
            ]}
          >
            <Text
              style={[styles.modalTitle, { color: theme.selectedCheckBox }]}
            >
              Select Image Source
            </Text>
            <Text style={styles.modalSubtitle}>
              Choose where to pick your image from
            </Text>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: theme.buttonBackColor },
              ]}
              onPress={handleCameraPress}
            >
              <Text style={styles.modalButtonText}>📷 Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: theme.buttonBackColor },
              ]}
              onPress={handleGalleryPress}
            >
              <Text style={styles.modalButtonText}>🖼️ Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setSourceModalVisible(false)}
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
      </Modal>

      <View style={styles.container}>
        <TouchableOpacity onPress={handleImageSourceSelection}>
          <Image
            source={
              EditImgURI && img === ''
                ? { uri: EditImgURI }
                : img !== ''
                  ? { uri: `data:image/png;base64,${img[0].base64}` }
                  : profileIcon
            }
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 12,
  },
  profileImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderColor: colors.profileBorderColor,
    borderWidth: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.white || '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
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

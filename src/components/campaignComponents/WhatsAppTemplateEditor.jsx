import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  Platform,
  ActionSheetIOS,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RNSTextInput from '../TextInput';
import { useTheme } from '../../hooks/useTheme';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import DocumentPicker from '@react-native-documents/picker';
import Toast from 'react-native-simple-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import Alert from '../Alert';
import servicesettings from '../../modules/dataservices/servicesettings';

const WhatsAppTemplateEditor = ({ value, onChange, onClear }) => {
  const theme = useTheme();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [currentUploadParam, setCurrentUploadParam] = useState(null);
  const [sourceModalVisible, setSourceModalVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(false);
  const [permissionType, setPermissionType] = useState('');

  if (!value || !value.components) {
    return (
      <View
        style={[
          styles.alertContainer,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <Icon name="info" size={24} color="#2196F3" />
        <Text style={[styles.alertText, { color: theme.textColor }]}>
          No WhatsApp template selected
        </Text>
      </View>
    );
  }

  const { components, parameters, category } = value;

  const handleParameterChange = (section, index, newValue) => {
    const updatedParams = { ...parameters };

    if (updatedParams[section][index]) {
      if (updatedParams[section][index].type === 'text') {
        updatedParams[section][index].text = newValue;
      } else {
        const mediaType = updatedParams[section][index].type;
        updatedParams[section][index][mediaType] = { link: newValue };
      }
    }

    onChange({ ...value, parameters: updatedParams });
  };

  // Upload media file to server
  const uploadMediaFile = async (file, section, index) => {
    setUploadingMedia(true);
    const data = new FormData();

    data.append('file', {
      name: file.fileName || file.name,
      uri: file.uri,
      type: file.type,
    });

    try {
      const ImageheaderFetch = {
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        cache: false,
        timeout: 6000,
        method: 'post',
        body: data,
        headers: {
          Authorization: servicesettings.AuthorizationKey,
          'Content-Type': 'multipart/form-data',
        },
      };
      const res = await fetch(
        servicesettings.baseuri + 'BlazorApi/uploadAttachment',
        ImageheaderFetch,
      );
      if (!res.ok) {
        throw new Error(`Upload failed with status: ${res.status}`);
      }

      const response = await res.json();
      const uploadedUrl =
        response?.data?.replace(/^\\\\?wwwroot[\\/]/, '').replace(/\\/g, '/') ||
        '';
      if (uploadedUrl) {
        // Convert to full URL
        const fullUrl =
          servicesettings.baseuri.replace('/api/', '') + uploadedUrl;
        handleParameterChange(section, index, fullUrl);
        Toast.show('Media uploaded successfully');
      } else {
        throw new Error('No URL returned from upload');
      }
    } catch (error) {
      Toast.showWithGravity(
        error?.message || 'Upload failed',
        Toast.LONG,
        Toast.CENTER,
      );
    } finally {
      setUploadingMedia(false);
    }
  };

  // Camera permission handling
  const requestCameraPermission = async (section, index, mediaType) => {
    const permission =
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

    const result = await check(permission);

    switch (result) {
      case RESULTS.GRANTED:
        launchCameraHandler(section, index, mediaType);
        break;
      case RESULTS.DENIED:
        const reqResult = await request(permission);
        if (reqResult === RESULTS.GRANTED) {
          launchCameraHandler(section, index, mediaType);
        }
        break;
      case RESULTS.BLOCKED:
        setPermissionType('camera');
        setPermissionVisible(true);
        break;
      default:
        break;
    }
  };

  // Gallery permission handling
  const requestGalleryPermission = async (section, index, mediaType) => {
    if (Platform.OS === 'android') {
      launchGalleryHandler(section, index, mediaType);
      return;
    }

    const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
    const result = await check(permission);

    switch (result) {
      case RESULTS.GRANTED:
        launchGalleryHandler(section, index, mediaType);
        break;
      case RESULTS.DENIED:
        const reqResult = await request(permission);
        if (reqResult === RESULTS.GRANTED) {
          launchGalleryHandler(section, index, mediaType);
        }
        break;
      case RESULTS.BLOCKED:
        setPermissionType('gallery');
        setPermissionVisible(true);
        break;
      default:
        break;
    }
  };

  const launchCameraHandler = (section, index, mediaType) => {
    launchCamera(
      {
        mediaType: mediaType === 'video' ? 'video' : 'photo',
        includeBase64: false,
      },
      response => {
        if (response.assets && response.assets.length > 0) {
          uploadMediaFile(response.assets[0], section, index);
        }
      },
    );
  };

  const launchGalleryHandler = (section, index, mediaType) => {
    launchImageLibrary(
      {
        mediaType: mediaType === 'video' ? 'video' : 'photo',
        includeBase64: false,
        selectionLimit: 1,
      },
      response => {
        if (!response.didCancel && !response.errorCode) {
          if (response.assets && response.assets.length > 0) {
            uploadMediaFile(response.assets[0], section, index);
          }
        }
      },
    );
  };

  const launchDocumentPicker = async (section, index) => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.allFiles],
      });

      if (result && result.length > 0) {
        uploadMediaFile(result[0], section, index);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Toast.show('Error picking document');
      }
    }
  };

  const handleMediaUploadOption = (section, index, mediaType) => {
    setCurrentUploadParam({ section, index, mediaType });

    if (mediaType === 'document') {
      launchDocumentPicker(section, index);
      return;
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Camera', 'Gallery'],
          cancelButtonIndex: 0,
          userInterfaceStyle: 'dark',
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            requestCameraPermission(section, index, mediaType);
          } else if (buttonIndex === 2) {
            requestGalleryPermission(section, index, mediaType);
          }
        },
      );
    } else {
      setSourceModalVisible(true);
    }
  };

  const handleCameraPress = () => {
    setSourceModalVisible(false);
    const { section, index, mediaType } = currentUploadParam;
    requestCameraPermission(section, index, mediaType);
  };

  const handleGalleryPress = () => {
    setSourceModalVisible(false);
    const { section, index, mediaType } = currentUploadParam;
    requestGalleryPermission(section, index, mediaType);
  };

  const getPermissionMessage = () => {
    if (permissionType === 'camera') {
      return '"BDMT" would like to access your camera';
    } else if (permissionType === 'gallery') {
      return '"BDMT" would like to access your photos';
    }
    return '"BDMT" would like to access your device';
  };

  // Replace {{1}}, {{2}} etc. in text with parameter values
  const fillTextWithParams = (component, section) => {
    if (!component.text) return '';
    let text = component.text;
    let paramIndex = 0;

    return text.replace(/\{\{(\d+)\}\}/g, () => {
      const param = parameters[section]?.[paramIndex];
      paramIndex++;
      if (!param) return '';
      return param.type === 'text'
        ? `{{${param.text || 'empty'}}}`
        : `{{[${param.type.toUpperCase()}]}}`;
    });
  };

  const renderParameterInput = (section, index, param) => {
    const label = `${section.charAt(0).toUpperCase() + section.slice(1)} Param ${index + 1}`;

    if (param.type === 'text') {
      return (
        <View key={`${section}-${index}`} style={styles.paramInputContainer}>
          <Text style={[styles.paramLabel, { color: theme.textColor }]}>
            {label}
          </Text>
          <RNSTextInput
            value={param.text || ''}
            onChangeText={value => handleParameterChange(section, index, value)}
            placeholder={`Enter value for {{${index + 1}}}`}
            placeholderTextColor={theme.placeholderColor}
            style={[
              styles.paramInput,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
              },
            ]}
          />
        </View>
      );
    }

    const mediaLabels = {
      image: 'Header Image',
      video: 'Header Video',
      document: 'Header Document',
    };

    const mediaIcons = {
      image: 'image',
      video: 'videocam',
      document: 'description',
    };

    if (mediaLabels[param.type]) {
      return (
        <View key={`${section}-${index}`} style={styles.paramInputContainer}>
          <Text style={[styles.paramLabel, { color: theme.textColor }]}>
            {mediaLabels[param.type]}
          </Text>

          {/* URL Input */}
          <RNSTextInput
            value={param[param.type]?.link || ''}
            onChangeText={value => handleParameterChange(section, index, value)}
            placeholder="Enter media URL or upload..."
            placeholderTextColor={theme.placeholderColor}
            style={[
              styles.paramInput,
              {
                backgroundColor: theme.backgroundColor,
                color: theme.textColor,
              },
            ]}
            autoCapitalize="none"
            keyboardType="url"
          />

          {/* Upload Button */}
          <TouchableOpacity
            style={[
              styles.uploadButton,
              { backgroundColor: theme.buttonBackColor },
            ]}
            onPress={() => handleMediaUploadOption(section, index, param.type)}
          >
            <Icon name={mediaIcons[param.type]} size={20} color="#fff" />
            <Text style={styles.uploadButtonText}>
              Upload {param.type === 'document' ? 'File' : 'from Device'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return null;
  };

  const headerComponent = components.find(c => c.type === 'HEADER');
  const bodyComponent = components.find(c => c.type === 'BODY');
  const footerComponent = components.find(c => c.type === 'FOOTER');
  const buttonsComponent = components.find(c => c.type === 'BUTTONS');

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ rowGap: 12 }}>
      <Spinner
        visible={uploadingMedia}
        textContent={'Uploading...'}
        textStyle={{ color: '#FFF' }}
      />

      {/* Permission Alert */}
      <Alert
        massagetype={'warning'}
        hide={() => setPermissionVisible(false)}
        confirm={() => {
          setPermissionVisible(false);
          Linking.openSettings();
        }}
        Visible={permissionVisible}
        alerttype={'confirmation'}
        Title={'Permission Required'}
        Massage={getPermissionMessage()}
      />

      {/* Source Selection Modal (Android) */}
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
              Select Source
            </Text>
            <Text
              style={[styles.modalSubtitle, { color: theme.placeholderColor }]}
            >
              Choose where to pick your media from
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
                  { color: theme.placeholderColor },
                ]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Template Preview */}
      <View
        style={[styles.previewCard, { backgroundColor: theme.cardBackColor }]}
      >
        <View style={styles.previewHeader}>
          <View style={styles.previewHeaderLeft}>
            <Text style={[styles.previewTitle, { color: theme.textColor }]}>
              Preview
            </Text>
            <View
              style={[styles.categoryBadge, { backgroundColor: '#6C757D' }]}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          </View>
        </View>

        {/* WhatsApp Message Bubble */}
        <View
          style={[
            styles.messageBubble,
            { backgroundColor: theme.backgroundColor },
          ]}
        >
          {/* HEADER */}
          {headerComponent && (
            <View style={styles.messageSection}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>HEADER</Text>
              </View>
              {headerComponent.format !== 'TEXT' ? (
                <View style={styles.mediaContainer}>
                  {parameters.header?.[0] &&
                  parameters.header[0][parameters.header[0].type]?.link ? (
                    parameters.header[0].type === 'image' ? (
                      <Image
                        source={{ uri: parameters.header[0].image.link }}
                        style={styles.mediaImage}
                        resizeMode="cover"
                      />
                    ) : parameters.header[0].type === 'video' ? (
                      <View style={styles.videoPlaceholder}>
                        <Icon name="videocam" size={40} color="#666" />
                        <Text style={styles.mediaText}>Video</Text>
                      </View>
                    ) : (
                      <View style={styles.documentPlaceholder}>
                        <Icon name="description" size={32} color="#666" />
                        <Text style={styles.mediaText} numberOfLines={1}>
                          {parameters.header[0].document.link}
                        </Text>
                      </View>
                    )
                  ) : (
                    <View style={styles.mediaPlaceholder}>
                      <Icon name="hide-image" size={40} color="#999" />
                      <Text style={[styles.placeholderText, { color: '#999' }]}>
                        [{headerComponent.format}]
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={styles.messageText}>
                  {fillTextWithParams(headerComponent, 'header')}
                </Text>
              )}
            </View>
          )}

          {/* BODY */}
          {bodyComponent && (
            <View style={styles.messageSection}>
              <View
                style={[styles.sectionBadge, { backgroundColor: '#FFC107' }]}
              >
                <Text style={styles.sectionBadgeText}>BODY</Text>
              </View>
              <Text style={[styles.messageText, { color: theme.textColor }]}>
                {fillTextWithParams(bodyComponent, 'body')}
              </Text>
            </View>
          )}

          {/* FOOTER */}
          {footerComponent && (
            <View style={styles.messageSection}>
              <View
                style={[styles.sectionBadge, { backgroundColor: '#6C757D' }]}
              >
                <Text style={styles.sectionBadgeText}>FOOTER</Text>
              </View>
              <Text
                style={[
                  styles.messageText,
                  { color: theme.placeholderColor, fontSize: 12 },
                ]}
              >
                {footerComponent.text}
              </Text>
            </View>
          )}

          {/* BUTTONS */}
          {buttonsComponent?.buttons?.length > 0 && (
            <View style={styles.messageSection}>
              <View
                style={[styles.sectionBadge, { backgroundColor: '#28A745' }]}
              >
                <Text style={styles.sectionBadgeText}>
                  BUTTONS ({buttonsComponent.buttons.length})
                </Text>
              </View>
              <View style={styles.buttonsContainer}>
                {buttonsComponent.buttons.map((btn, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.buttonItem,
                      {
                        backgroundColor: theme.buttonBackColor,
                        borderColor: theme.textColor,
                      },
                    ]}
                  >
                    <Icon
                      name={
                        btn.type === 'URL'
                          ? 'link'
                          : btn.type === 'PHONE_NUMBER'
                            ? 'phone'
                            : 'reply'
                      }
                      size={16}
                      color={theme.textColor}
                    />
                    <Text
                      style={[styles.buttonText, { color: theme.textColor }]}
                    >
                      {btn.text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Parameter Inputs */}
      <View
        style={[
          styles.parametersCard,
          { backgroundColor: theme.cardBackColor },
        ]}
      >
        <Text style={[styles.parametersTitle, { color: theme.textColor }]}>
          Fill Template Parameters
        </Text>

        {parameters.header?.length > 0 && (
          <View style={styles.paramSection}>
            <Text style={[styles.paramSectionTitle, { color: '#17A2B8' }]}>
              Header Parameters
            </Text>
            {parameters.header.map((param, index) =>
              renderParameterInput('header', index, param),
            )}
          </View>
        )}

        {parameters.body?.length > 0 && (
          <View style={styles.paramSection}>
            <Text style={[styles.paramSectionTitle, { color: '#007BFF' }]}>
              Body Parameters
            </Text>
            {parameters.body.map((param, index) =>
              renderParameterInput('body', index, param),
            )}
          </View>
        )}

        {parameters.header?.length === 0 && parameters.body?.length === 0 && (
          <View style={styles.noParamsContainer}>
            <Icon name="check-circle" size={24} color="#28A745" />
            <Text style={[styles.noParamsText, { color: theme.textColor }]}>
              This template has no parameters to fill
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  alertText: {
    fontSize: 14,
    flex: 1,
  },
  previewCard: {
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageBubble: {
    borderRadius: 8,
    padding: 12,
  },
  messageSection: {
    marginBottom: 12,
  },
  sectionBadge: {
    backgroundColor: '#17A2B8',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  sectionBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 20,
  },
  mediaContainer: {
    marginTop: 4,
  },
  mediaImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
  },
  videoPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentPlaceholder: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    gap: 8,
  },
  mediaPlaceholder: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 12,
    marginTop: 8,
  },
  mediaText: {
    fontSize: 12,
    color: '#666',
  },
  buttonsContainer: {
    gap: 8,
  },
  buttonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
    gap: 8,
  },
  buttonText: {
    color: '#2196F3',
    fontSize: 14,
    fontWeight: '500',
  },
  parametersCard: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  parametersTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  paramSection: {
    marginBottom: 0,
  },
  paramSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  paramInputContainer: {
    marginBottom: 12,
  },
  paramLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 6,
  },
  paramInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noParamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  noParamsText: {
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
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
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
    marginTop: 16,
  },
});

export default WhatsAppTemplateEditor;

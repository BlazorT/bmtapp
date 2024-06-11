import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import noImage from '../../../assets/images/picture.png';
import {useTheme} from '../../hooks/useTheme';
import pdfIcon from '../../../assets/images/pdficon.png';
import minusIcon from '../../../assets/images/crossicon.png';
import pdfViewIcon from '../../../assets/images/pdfview.png';

import MediaPickerModal from '../MediaPickerModal';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import Video from 'react-native-video';

const CampaignAttachment = ({handleCampaignInfo, campaignInfo}) => {
  const theme = useTheme();

  const [isMediaMdlOpen, setIsMediaMdlOpen] = React.useState(false);
  const [isImage, setIsImage] = React.useState(false);
  const [isPermissions, setIsPermissions] = React.useState(false);

  React.useEffect(() => {
    console.log('campaignInfo', campaignInfo.image);
    // Request camera and storage permissions on component mount
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraStatus = await request(PERMISSIONS.ANDROID.CAMERA);
      const readStorageStatus = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      );
      // const writeStorageStatus = await request(
      //   PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      // );

      if (
        cameraStatus === RESULTS.GRANTED &&
        readStorageStatus === RESULTS.GRANTED
      ) {
        setIsPermissions(true);
        // console.log('All permissions granted');
      } else {
        setIsPermissions(false);
        // Alert.alert('Permissions not granted');
      }
    } catch (error) {
      setIsPermissions(false);
      console.error('Error requesting permissions: ', error);
    }
  };
  const openCamera = () => {
    setIsMediaMdlOpen(false);
    launchCamera(
      {
        mediaType: isImage ? 'photo' : 'video',
        durationLimit: 180,
        // includeBase64: true,
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          handleCampaignInfo(isImage ? 'image' : 'video', response.assets[0]);
          console.log('ImagePicker Response: ', response.assets[0]);
        }
      },
    );
  };

  const openGallery = () => {
    setIsMediaMdlOpen(false);
    launchImageLibrary(
      {mediaType: isImage ? 'photo' : 'video', durationLimit: 180},
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          handleCampaignInfo(isImage ? 'image' : 'video', response.assets[0]);
          console.log('ImagePicker Response: ', response);
        }
      },
    );
  };

  const pdfPicker = async () => {
    setIsMediaMdlOpen(false);
    const response = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    if (response !== undefined || response !== '') {
      handleCampaignInfo('pdf', response[0]);
    }
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <View>
        <Text
          style={{
            color: theme.textColor,
            fontSize: 17,
            textAlign: 'center',
            marginBottom: 10,
          }}>
          Photo
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsMediaMdlOpen(true);
            setIsImage(true);
          }}
          style={{
            width: 80,
            height: 80,
            borderWidth: 2,
            borderColor: theme.textColor,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={
              campaignInfo.image == '' ? noImage : {uri: campaignInfo.image.uri}
            }
            style={{
              height: 70,
              width: 70,
              borderRadius: 50,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            resizeMode="cover"
          />
        </TouchableOpacity>
        {campaignInfo.image !== '' && (
          <TouchableOpacity
            onPress={() => handleCampaignInfo('image', '')}
            style={{
              position: 'absolute',
              top: 25,
              left: -5,
              borderWidth: 1,
              borderColor: theme.textColor,
              borderRadius: 50,
            }}>
            <Image
              source={minusIcon}
              style={{height: 22, width: 22, tintColor: theme.tintColor}}
            />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text
          style={{
            color: theme.textColor,
            fontSize: 17,
            textAlign: 'center',
            marginBottom: 10,
          }}>
          Video
        </Text>
        <TouchableOpacity
          onPress={() => {
            setIsMediaMdlOpen(true);
            setIsImage(false);
          }}
          style={{
            width: 80,
            height: 80,
            borderWidth: 2,
            borderColor: theme.textColor,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {campaignInfo.video == '' ? (
            <Image
              source={noImage}
              style={{
                height: 70,
                width: 70,
                alignSelf: 'center',
                resizeMode: 'contain',
              }}
              resizeMode="contain"
            />
          ) : (
            <View
              style={{
                borderRadius: 100,
                overflow: 'hidden',
              }}>
              <Video
                source={{uri: campaignInfo.video.uri}}
                style={{
                  height: 70,
                  width: 70,
                  alignSelf: 'center',
                }}
                resizeMode="cover"
              />
            </View>
          )}
        </TouchableOpacity>
        {campaignInfo.video !== '' && (
          <TouchableOpacity
            onPress={() => handleCampaignInfo('video', '')}
            style={{
              position: 'absolute',
              top: 25,
              left: -5,
              borderWidth: 1,
              borderColor: theme.textColor,
              borderRadius: 50,
            }}>
            <Image
              source={minusIcon}
              style={{height: 22, width: 22, tintColor: theme.tintColor}}
            />
          </TouchableOpacity>
        )}
      </View>
      <View>
        <Text
          style={{
            color: theme.textColor,
            fontSize: 17,
            textAlign: 'center',
            marginBottom: 10,
          }}>
          PDF
        </Text>
        <TouchableOpacity
          onPress={pdfPicker}
          style={{
            width: 80,
            height: 80,
            borderWidth: 2,
            borderColor: theme.textColor,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={campaignInfo.pdf === '' ? pdfIcon : pdfViewIcon}
            style={{
              height: 60,
              width: 60,
              alignSelf: 'center',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {campaignInfo.pdf !== '' && (
          <TouchableOpacity
            onPress={() => handleCampaignInfo('pdf', '')}
            style={{
              position: 'absolute',
              top: 25,
              left: -5,
              borderWidth: 1,
              borderColor: theme.textColor,
              borderRadius: 50,
            }}>
            <Image
              source={minusIcon}
              style={{height: 22, width: 22, tintColor: theme.tintColor}}
            />
          </TouchableOpacity>
        )}
      </View>
      <MediaPickerModal
        isOpen={isMediaMdlOpen}
        close={() => setIsMediaMdlOpen(false)}
        isImage={isImage}
        openCamera={openCamera}
        openGallery={openGallery}
      />
    </View>
  );
};

export default CampaignAttachment;

const styles = StyleSheet.create({});

import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import noImage from '../../../assets/images/picture.png';
import {useTheme} from '../../hooks/useTheme';
import PdfIcon from '../../../assets/images/pdficon.png';
import MediaPickerModal from '../MediaPickerModal';

const CampaignAttachment = () => {
  const theme = useTheme();

  const [isMediaMdlOpen, setIsMediaMdlOpen] = React.useState(false);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}>
      <View>
        <Text
          style={{color: theme.textColor, fontSize: 17, textAlign: 'center'}}>
          Photo
        </Text>
        <TouchableOpacity
          onPress={() => setIsMediaMdlOpen(true)}
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
            source={noImage}
            style={{
              height: 70,
              width: 70,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            //   resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{color: theme.textColor, fontSize: 17, textAlign: 'center'}}>
          Video
        </Text>
        <TouchableOpacity
          onPress={() => setIsMediaMdlOpen(true)}
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
            source={noImage}
            style={{
              height: 70,
              width: 70,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            //   resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View>
        <Text
          style={{color: theme.textColor, fontSize: 17, textAlign: 'center'}}>
          PDF
        </Text>
        <TouchableOpacity
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
            source={PdfIcon}
            style={{
              height: 60,
              width: 60,
              alignSelf: 'center',
              resizeMode: 'contain',
            }}
            //   resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <MediaPickerModal
        isOpen={isMediaMdlOpen}
        close={() => setIsMediaMdlOpen(false)}
      />
    </View>
  );
};

export default CampaignAttachment;

const styles = StyleSheet.create({});

import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '../hooks/useTheme';

const MediaPickerModal = ({isOpen, close}) => {
  const theme = useTheme();
  return (
    <Modal visible={isOpen} transparent={true} animationType="fade">
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <View
          style={{
            width: Dimensions.get('screen').width - 20,
            height: Dimensions.get('screen').height - 550,
            borderRadius: 10,
            backgroundColor: theme.modalBackColor,
            paddingHorizontal: 10,
            paddingVertical: 20,
            rowGap: 10,
          }}>
          <TouchableOpacity>
            <Text style={{color: theme.textColor, fontSize: 20}}>
              Take Photo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{color: theme.textColor, fontSize: 20}}>
              Take Video
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{color: theme.textColor, fontSize: 20}}>
              Choose Photo from gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{color: theme.textColor, fontSize: 20}}>
              Choose Video from gallery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={close}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              borderTopColor: theme.textColor,
              borderTopWidth: 1,
            }}>
            <Text style={{color: theme.textColor, fontSize: 20}}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MediaPickerModal;

const styles = StyleSheet.create({});

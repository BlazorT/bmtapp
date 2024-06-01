import React, {useState} from 'react';
import {Image, Modal, StyleSheet, View} from 'react-native';
const Model = props => {
  const [modalVisible, setModalVisible] = useState(false);
  const tickIcon = require('../../assets/images/th.png');
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.modalVisible}
      >
        <View style={styles.modalView}>
          <Image source={tickIcon} style={styles.iconimage} />
        </View>
      </Modal>
    </View>
  );
};
// visible={modalVisible}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
    backgroundColor: '#010c1fb8',
    position: 'absolute',
    bottom: 0,
    //borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    textAlign: 'center',
  },
  iconimage: {
    borderColor: '#010c1fb8',
    borderWidth: 0,
    borderRadius: 100,
    width: 170,
    height: 170,
  },
});
export default Model;

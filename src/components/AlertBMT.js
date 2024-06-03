import React, {useEffect, useState} from 'react';
import {Dimensions, Modal, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button} from '../components';
import {colors} from '../styles';
import {useSelector} from 'react-redux';
import {useTheme} from '../hooks/useTheme';
export default function CustomeAlert(props) {
  const theme = useTheme();
  const isMode = useSelector(state => state.theme.mode);
  const [customestyle, setcustomestyle] = useState(styles.Alert_Message);

  useEffect(() => {
    if (props.massagetype == 'warning') {
      setcustomestyle(styles.Warning_Message);
    } else if (props.massagetype == 'error') {
      setcustomestyle(styles.Error_Message);
    }
  });
  function Hide() {
    props.hide();
  }
  ok_Button = () => {
    props.OK();
  };
  function confirmation() {
    props.confirm();
  }
  return (
    <View>
      {props.alerttype == 'confirmation' ? (
        <Modal
          style={styles.modalView}
          visible={props.Visible}
          transparent={true}
          animationType={'fade'}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <LinearGradient
              colors={
                isMode == 'dark'
                  ? [
                      theme.cardBackColor,
                      theme.cardBackColor,
                      theme.cardBackColor,
                    ]
                  : ['#cdcdcd', '#f5f5f5', '#cdcdcd']
              }
              style={styles.Alert_Main_View}>
              <Text style={[styles.Alert_Title, {color: theme.textColor}]}>
                {props.Title}
              </Text>
              <Text
                style={[
                  customestyle,
                  styles.customestyleMessage,
                  {color: theme.textColor},
                ]}>
                {props.Massage}
              </Text>
              <View
                style={{width: '100%', height: 0.3, backgroundColor: '#474747'}}
              />
              <View style={styles.ButtonView}>
                <Button
                  style={styles.btnButton}
                  bgColor={theme.buttonBackColor}
                  caption="OK"
                  onPress={() => confirmation()}
                />
              </View>
            </LinearGradient>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  Alert_Main_View: {
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor : "#8a8a8a",
    height: 200,
    width: Dimensions.get('window').width - 20,
    marginLeft: 5,
    //marginHorizontal:10,
    //width: '97%',
    //borderWidth: 1,
    //borderColor: '#fff',
    borderRadius: 7,
  },
  ButtonView: {
    borderTopWidth: 1,
    borderColor: '#474747',
    width: 100 + '%',
    paddingTop: 8,
    marginBottom: 7,
    //paddingVertical:10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  btnButton: {
    width: 40 + '%',
    height: 48,
    fontSize: 32,
    borderRadius: 12,
  },
  customestyleMessage: {
    //height:55,
    fontSize: 18,
    color: 'black',
  },
  Alert_Title: {
    fontSize: 22,
    color: 'black',
    textAlign: 'center',
    //padding: 10,
    // height: '11%'
    marginBottom: 4,
    marginTop: 15,
  },
  Alert_Message: {
    fontSize: 22,
    color: 'black',
    textAlign: 'center',
    padding: 10,
    height: '42%',
  },
  Warning_Message: {
    fontSize: 22,
    color: 'orange',
    textAlign: 'center',
    padding: 10,
    height: '40%',
  },
  Error_Message: {
    fontSize: 22,
    color: 'red',
    textAlign: 'center',
    padding: 10,
    height: '42%',
  },
  modalView: {
    justifyContent: 'space-around',
    //width: '100%',
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
});

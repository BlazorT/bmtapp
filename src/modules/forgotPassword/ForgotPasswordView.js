import AsyncStorage from '@react-native-async-storage/async-storage';
import Base64 from 'Base64';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/Entypo';
import {Button, TextInput} from '../../components';
import Alert from '../../components/Alert';
import Model from '../../components/Model';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
const Password = require('../../../assets/images/icons/Password1.png');
export default function ForgotPasswordScreen(props) {
  const [Email, setEmail] = useState('');
  const [Emailfocus, setEmailFocus] = useState(false);
  const customestyleEmail = Emailfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const customestyleEmaildisable = styles.sectionStyledisable;
  const [OTP, setOTP] = useState('');
  const [OTPfocus, setOTPFocus] = useState(false);
  const customestyleOTP = OTPfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const customestyleOTPdisable = styles.sectionStyledisable;
  const [Password, setPassword] = useState('');
  const [Passwordfocus, setPasswordFocus] = useState(false);
  const customestylePassword = Passwordfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const [ConfirmPasswordfocus, setConfirmPasswordFocus] = useState(false);
  const customestyleConfirmPassword = ConfirmPasswordfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [timer, settimer] = useState(40);
  const [GenratedOTP, setGenratedOTP] = useState('');
  const [disableemail, setdisableemail] = useState(true);
  const [disablecode, setdisablecode] = useState(true);
  const [timerCount, setTimer] = useState(60);
  const [btnsend, setbtnsend] = useState('Send');
  const [vesible, setvesible] = useState(false);
  const [OTPmassage, setOTPmassage] = useState(
    'OTP send to Email on press send button',
  );
  const [Visible, setVisible] = useState(false);
  const [VisibleOTP, setVisibleOTP] = useState(false);
  const [Visiblechange, setVisiblechange] = useState(false);
  const [showtick, setshowtick] = useState(false);
  const [spinner, setspinner] = useState(false);
  const changeCancelClick = () => {
    if (Password.trim() == '') {
      Toast.showWithGravity(
        'Please enter "Password"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (ConfirmPassword.trim() == '') {
      Toast.showWithGravity(
        'Please enter "Confirm password"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (ConfirmPassword.trim() != Password.trim()) {
      Toast.showWithGravity(
        'Password and Confirm password does not match',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    setVisiblechange(true);
  };
  const changehide = () => {
    setVisiblechange(false);
  };
  const changeconfirm = () => {
    setVisiblechange(false);
    ChangePassword();
  };
  const CancelClick = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(false);
    props.navigation.replace('Login');
  };
  /*********************************************************** useEffect *************************************************/
  useEffect(() => {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata != null) {
        setEmail(Asyncdata.Email);
      } else {
        setEmail('');
      }
    });
    console.disableYellowBox = true;
  }, []);
  //******************************************************send email*********************************************************//
  const SendEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (Email.trim() == '') {
      Toast.showWithGravity(
        'Please enter "Email address"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (reg.test(Email.trim()) === false) {
      Toast.showWithGravity(
        'Registration email address is not correct',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    //setOTPmassage('check your email for get "OTP" ');
    //setTimer(60);
    //setdisable(true);

    AsyncStorage.getItem('LoginInformation').then(function (res) {
      setspinner(true);
      let Asyncdata = JSON.parse(res);
      var blazorHeader = new Headers();
      blazorHeader.append('Authorization', servicesettings.AuthorizationKey);
      blazorHeader.append('Content-Type', 'application/json');
      var headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          email: Email.trim().toLowerCase(),
          securitytoken: '',
          password: '',
          orgid: '0',
        }),
        headers: blazorHeader,
      };
      // headers: blazorHeader
      fetch(servicesettings.baseuri + 'forgot', headerFetch)
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.data == null) {
            setspinner(false);
            Toast.showWithGravity(
              'Registration email address is not correct',
              Toast.LONG,
              Toast.CENTER,
            );
            return;
          } else {
            setspinner(false);
            setVisibleOTP(true);
            setdisableemail(false);
            setdisablecode(true);
            setvesible(false);
            setOTP('');
            setPassword('');
            setConfirmPassword('');
          }
          if (responseJson.data != null) {
            setGenratedOTP(responseJson.data);
          }
        })
        .catch(error => {
          setspinner(false);
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
        });
    });
    /*
let interval = setInterval(() => {
setTimer(lastTimerCount => {
lastTimerCount <= 1 && clearInterval(interval)
return lastTimerCount - 1
})
}, 1000)
setTimeout(() =>{
setdisable(false);
}, 57000);
return () => clearInterval(interval)*/
  };
  //******************************************************check verification*********************************************************//
  const CheckVerify = () => {
    if (OTP.trim() == '') {
      Toast.showWithGravity(
        'Please enter "Security code"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (OTP.trim() != GenratedOTP) {
      Toast.showWithGravity(
        'Security code invalid or expired',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    Toast.showWithGravity(
      'Security code verified successfully',
      Toast.LONG,
      Toast.CENTER,
    );
    setdisablecode(false);
    setvesible(true);
  };
  //*****************************************************change password*******************************************************************//
  const ChangePassword = () => {
    if (Password.trim() == '') {
      Toast.showWithGravity(
        'Please enter "Password"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (ConfirmPassword.trim() == '') {
      Toast.showWithGravity(
        'Please enter "Confirm password"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (ConfirmPassword.trim() != Password.trim()) {
      Toast.showWithGravity(
        'Password and confirm password does not match',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      var blazorHeader = new Headers();
      blazorHeader.append('Authorization', servicesettings.AuthorizationKey);
      blazorHeader.append('Content-Type', 'application/json');
      var headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          email: Email.trim().toLowerCase(),
          securitytoken: OTP,
          password: Base64.btoa(Password),
          orgid: '0',
        }),
        headers: blazorHeader,
      };
      fetch(servicesettings.baseuri + 'forgot', headerFetch)
        .then(response => response.json())
        .then(responseJson => {
          Toast.showWithGravity(
            'Pawssword has beeen changed successfully',
            Toast.LONG,
            Toast.CENTER,
          );
          setshowtick(true);
          setTimeout(() => {
            setshowtick(false);
            //props.navigation.replace('Login');
          }, 1250);
        })
        .catch(error => {
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
          console.error('service error', error);
        });
    });
  };
  /********************************************************* View ****************************************************************/
  /*
<Spinner
                    visible={spinner}
                    textContent={'Submitting...'}
                    textStyle={{color: '#FFF'}}
                  />
 */
  return (
    <View style={styles.container}>
      {spinner == true ? (
        <View style={styles.modalView}>
          <View>
            <ActivityIndicator
              animating={spinner}
              size="large"
              color="#ffffff"
            />
            <Text style={styles.gallerytext}>Submitting...</Text>
          </View>
        </View>
      ) : (
        <View></View>
      )}
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Do you want to close ?'}></Alert>
      <Alert
        massagetype={'warning'}
        hide={changehide}
        confirm={changeconfirm}
        Visible={Visiblechange}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Do you want to reset password ?'}></Alert>
      <ScrollView>
        <View style={styles.textContainer}>
          <View style={styles.sectionStyleText}>
            <Text style={styles.lblOTP}>
              Enter your email and we'll send you a security code to get back
              into your account.
            </Text>
          </View>
          <View
            style={
              disableemail == true
                ? customestyleEmail
                : customestyleEmaildisable
            }>
            <TextInput
              placeholderTextColor="#a2a2a2"
              style={disableemail == true ? styles.Text : styles.Textdisable}
              editable={disableemail}
              placeholder="Registration email address"
              value={Email}
              onChangeText={value => setEmail(value)}
              onEndEditing={() => setEmailFocus(false)}
              onFocus={() => setEmailFocus(true)}
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              maxLength={40}
            />
          </View>
          <Button
            style={[styles.btnverify, {flexBasis: '47%'}]}
            bgColor={colors.Blazorbutton}
            caption="Send Code"
            onPress={() => SendEmail()}
          />
          {VisibleOTP == true ? (
            <View>
              <View style={styles.sectionStyleText}>
                <Text style={styles.lblOTP}>
                  The code has been sent to your email. Please enter below.
                </Text>
              </View>
              <View
                style={
                  disablecode == true ? customestyleOTP : customestyleOTPdisable
                }>
                <TextInput
                  placeholderTextColor="#a2a2a2"
                  clearTextOnFocus={true}
                  editable={disablecode}
                  style={
                    disablecode == true ? styles.TextOTP : styles.TextOTPdisable
                  }
                  value={OTP}
                  onChangeText={value => setOTP(value)}
                  onEndEditing={() => setOTPFocus(false)}
                  onFocus={() => setOTPFocus(true)}
                  placeholder="Security code"
                  secureTextEntry={false}
                  // clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  KeyboardType="numeric"
                  maxLength={8}
                />
              </View>
              <Button
                style={[styles.btnverify, {flexBasis: '47%'}]}
                bgColor={colors.Blazorbutton}
                caption="Verify"
                onPress={() => CheckVerify()}
              />
            </View>
          ) : (
            <View></View>
          )}
          {vesible == true ? (
            <View>
              <View style={customestylePassword}>
                <Icon name="lock" style={styles.imageStyle} />
                <TextInput
                  placeholderTextColor="#a2a2a2"
                  style={styles.Text}
                  value={Password}
                  onEndEditing={() => setPasswordFocus(false)}
                  onFocus={() => setPasswordFocus(true)}
                  onChangeText={value => setPassword(value)}
                  placeholder="Password"
                  secureTextEntry={true}
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  maxLength={10}
                />
              </View>
              <View style={customestyleConfirmPassword}>
                <Icon name="lock" style={styles.imageStyle} />
                <TextInput
                  placeholderTextColor="#a2a2a2"
                  style={styles.Text}
                  value={ConfirmPassword}
                  onEndEditing={() => setConfirmPasswordFocus(false)}
                  onFocus={() => setConfirmPasswordFocus(true)}
                  onChangeText={value => setConfirmPassword(value)}
                  placeholder="Confirm password"
                  secureTextEntry={true}
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  maxLength={10}
                />
              </View>
              <View style={styles.ButtonView}>
                <Button
                  style={[styles.btnCancel, {flexBasis: '47%'}]}
                  bgColor={colors.BlazorCancleButton}
                  caption="Cancel"
                  onPress={() => CancelClick()}
                />
                <Button
                  style={[styles.btnSubmit, {flexBasis: '47%'}]}
                  bgColor={colors.Blazorbutton}
                  caption="Submit"
                  onPress={() => changeCancelClick()}
                />
              </View>
            </View>
          ) : (
            <View></View>
          )}
          <Model modalVisible={showtick}></Model>
        </View>
      </ScrollView>
    </View>
  );
}
/********************************************************** Styles *************************************************************/
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BlazorBg,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
  },
  gallerytext: {
    fontSize: 20,
    color: '#cacccb',
    marginTop: 25,
    marginBottom: 40,
  },
  modalView: {
    justifyContent: 'space-around',
    width: '100%',
    height: '100%',
    backgroundColor: '#010c1f66',
    position: 'absolute',
    bottom: 0,
    borderRadius: 20,
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
  textContainer: {
    paddingVertical: 5,
  },
  btnCancel: {
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  btnSubmit: {
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
  },
  btnverify: {
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 0,
    width: Dimensions.get('window').width - 50,
  },
  ButtonView: {
    paddingVertical: 10,
    width: Dimensions.get('window').width - 46,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Text: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    color: colors.TextColor,
    //backgroundColor: colors.TextBoxContainer,
    width: Dimensions.get('window').width - 107.8,
  },
  Textdisable: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    color: colors.TextColor,
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width - 107.8,
  },
  TextOTPdisable: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 22,
    color: colors.TextColor,
    backgroundColor: 'transparent',
    width: Dimensions.get('window').width - 107.8,
  },
  TextOTP: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 22,
    color: colors.TextColor,
    //backgroundColor: colors.TextBoxContainer,
    width: Dimensions.get('window').width - 107.8,
  },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyledisable: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0,
    backgroundColor: '#808080bd',
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleOnFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0,
    backgroundColor: colors.TextBoxContainer,
    borderColor: 'white',
    borderRadius: 4,
  },
  lblOTP: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: 15,
    color: colors.white,
  },
  btnResendview: {
    height: 52,
    width: 100,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 11,
    marginTop: 25,
  },
  btnResend: {
    fontSize: 16,
    color: colors.white,
  },
  OTPView: {
    flexDirection: 'row',
  },
  sectionStyleOTP: {
    flexDirection: 'row',
    marginTop: 25,
    height: 50,
    fontSize: 16,
    color: colors.white,
    borderWidth: 0,
    backgroundColor: colors.black,
    borderColor: colors.borderColor,
    borderRadius: 4,
    width: Dimensions.get('window').width - 164,
  },
  sectionStyleOTPfocuse: {
    flexDirection: 'row',
    marginTop: 25,
    height: 50,
    fontSize: 16,
    color: colors.white,
    borderWidth: 0,
    backgroundColor: colors.black,
    borderColor: 'white',
    borderRadius: 4,
    width: Dimensions.get('window').width - 164,
  },
  imageStyle: {
    margin: 10,
    fontSize: 30,
    color: colors.AwesomeIconColor,
  },
  sectionStyleText: {
    paddingVertical: 22,
    width: Dimensions.get('window').width - 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

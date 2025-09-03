import Base64 from 'Base64';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/Entypo';
import { Button } from '../../components';
import Alert from '../../components/Alert';
import Model from '../../components/Model';
import { colors } from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import Spinner from 'react-native-loading-spinner-overlay';
const Password = require('../../../assets/images/icons/Password1.png');
export default function ForgotPasswordScreen(props) {
  const theme = useTheme();
  const { user, isAuthenticated } = useUser();

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
    if (isAuthenticated) {
      setEmail(user.Email);
    } else {
      setEmail('');
    }

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

    setspinner(true);
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
    fetch(servicesettings.baseuri + 'BlazorApi/forgot', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson', responseJson, {
          email: Email.trim().toLowerCase(),
          securitytoken: '',
          password: '',
          orgid: '0',
        });
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
      console.log({ GenratedOTP, OTP });
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
    // setVisibleOTP(false);
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
    setspinner(true);
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
    fetch(servicesettings.baseuri + 'BlazorApi/forgot', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson, {
          email: Email.trim().toLowerCase(),
          securitytoken: OTP,
          password: Base64.btoa(Password),
          orgid: '0',
        });
        if (responseJson.status == true) {
          Toast.showWithGravity(
            'Pawssword has beeen changed successfully',
            Toast.LONG,
            Toast.CENTER,
          );
          setspinner(false);
          setshowtick(true);
          setTimeout(() => {
            setshowtick(false);
            props.navigation.replace('Login');
          }, 1250);
        } else {
          setspinner(false);
          Toast.show(
            responseJson.message ||
              'Something went wrong, try another time !!!',
          );
        }
      })
      .catch(error => {
        setspinner(false);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        console.error('service error', error);
      });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <Spinner
        visible={spinner}
        textContent={'Submitting...'}
        textStyle={{ color: theme.textColor }}
        color={theme.textColor}
      />
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Do you want to close ?'}
      ></Alert>
      <Alert
        massagetype={'warning'}
        hide={changehide}
        confirm={changeconfirm}
        Visible={Visiblechange}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={'Do you want to reset password ?'}
      ></Alert>
      <ScrollView>
        <View style={styles.textContainer}>
          <View style={styles.sectionStyleText}>
            <Text style={[styles.lblOTP, { color: theme.textColor }]}>
              Enter your email and we'll send you a security code to get back
              into your account.
            </Text>
          </View>
          <View
            style={[
              disableemail == true
                ? customestyleEmail
                : customestyleEmaildisable,
              { backgroundColor: theme.inputBackColor },
            ]}
          >
            <TextInput
              placeholderTextColor={theme.placeholderColor}
              style={[
                disableemail == true
                  ? [styles.Text, { color: theme.textColor }]
                  : styles.Textdisable,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
              ]}
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
            style={[styles.btnverify, { flexBasis: '47%' }]}
            bgColor={theme.buttonBackColor}
            caption="Send Code"
            onPress={() => SendEmail()}
          />
          {VisibleOTP && (
            <View>
              <View style={styles.sectionStyleText}>
                <Text style={styles.lblOTP}>
                  The code has been sent to your email. Please enter below.
                </Text>
              </View>
              <View
                style={[
                  disablecode == true
                    ? customestyleOTP
                    : customestyleOTPdisable,
                  { backgroundColor: theme.inputBackColor },
                ]}
              >
                <TextInput
                  placeholderTextColor={theme.placeholderColor}
                  clearTextOnFocus={true}
                  editable={disablecode}
                  style={[
                    disablecode == true
                      ? styles.TextOTP
                      : styles.TextOTPdisable,
                    { color: theme.textColor },
                  ]}
                  value={OTP}
                  onChangeText={value => setOTP(value)}
                  onEndEditing={() => setOTPFocus(false)}
                  onFocus={() => setOTPFocus(true)}
                  placeholder="Security code"
                  secureTextEntry={false}
                  // clearTextOnFocus={true}
                  keyboardType="numeric"
                  keyboardAppearance={'dark'}
                  maxLength={8}
                />
              </View>
              <Button
                style={[styles.btnverify, { flexBasis: '47%' }]}
                bgColor={theme.buttonBackColor}
                caption="Verify"
                onPress={() => CheckVerify()}
              />
            </View>
          )}
          {vesible && (
            <View>
              <View
                style={[
                  customestylePassword,
                  { backgroundColor: theme.inputBackColor },
                ]}
              >
                <Icon
                  name="lock"
                  style={[styles.imageStyle, { color: theme.buttonBackColor }]}
                />
                <TextInput
                  placeholderTextColor={theme.placeholderColor}
                  style={[styles.Text, { color: theme.textColor }]}
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
              <View
                style={[
                  customestyleConfirmPassword,
                  { backgroundColor: theme.inputBackColor },
                ]}
              >
                <Icon
                  name="lock"
                  style={[styles.imageStyle, { color: theme.buttonBackColor }]}
                />
                <TextInput
                  placeholderTextColor={theme.placeholderColor}
                  style={[styles.Text, { color: theme.textColor }]}
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
                  style={[styles.btnCancel, { flexBasis: '47%' }]}
                  bgColor={theme.buttonBackColor}
                  caption="Cancel"
                  onPress={() => CancelClick()}
                />
                <Button
                  style={[styles.btnSubmit, { flexBasis: '47%' }]}
                  bgColor={theme.buttonBackColor}
                  caption="Submit"
                  onPress={() => changeCancelClick()}
                />
              </View>
            </View>
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

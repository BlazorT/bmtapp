//import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Base64 from 'Base64';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import { Button } from '../../components';
import ContinueWithFacebook from '../../components/ContinueWithFacebook';
import Model from '../../components/Model';
import SignupWithFacebook from '../../components/SignupWithFacebook';
import { colors } from '../../styles';
import servicesettings from '../dataservices/servicesettings';
const googleIcon = require('../../../assets/images/icons/google.png');

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import { LoginManager } from 'react-native-fbsdk-next';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';

export default function LoginScreen(props) {
  const theme = useTheme();
  const { loginUser } = useUser();
  const [spinner, setspinner] = useState(false);

  const profilelogo = require('../../../assets/images/BDMT.png');

  const [userInfo, setUserInfo] = useState('');
  const [Email, setEmail] = useState('');
  const [emailfocus, setemailFocus] = useState(false);
  const customestyleEmail = emailfocus
    ? styles.sectionStyleOnEmailFocus
    : styles.sectionStyleEmail;
  const [Password, setPassword] = useState('');
  const [Passwordfocus, setPasswordFocus] = useState(false);
  const customestylePassword = Passwordfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [show, setshow] = useState(true);
  const [modalVisible, setmodalVisible] = useState(false);
  const [FacebookmodalVisible, setfacebookmodalVisible] = useState(false);
  const [modalVisiblecamera, setmodalVisiblecamera] = useState(false);
  const [modalVisibleTermsAndConditions, setmodalVisibleTermsAndConditions] =
    useState(false);
  const showhidepassword = () => {
    if (show == false) {
      setshow(true);
    }
    if (show == true) {
      setshow(false);
    }
  };

  useEffect(() => {
    global.SocialMedia = 0;
    GoogleSignin.configure({
      webClientId:
        '344400656576-n1btnvu3unr8ioidunk8i6d6ne6qb903.apps.googleusercontent.com',
      offlineAccess: true,
    });

    if (global.SignUp_Login == 1) {
      setmodalVisiblecamera(false);
    } else {
      setmodalVisiblecamera(true);
    }
  }, []);

  const Signup = async () => {
    global.SocialMedia = 1;
    try {
      console.log('GoogleSignin Info --> ', JSON.stringify(GoogleSignin));
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      let userInfo = await GoogleSignin.signIn();
      userInfo = userInfo.data;
      console.log('User Info --> ', userInfo);

      var givenName = userInfo.user.givenName;
      var name = userInfo.user.name;

      if (givenName.length >= '0' && givenName.includes(' ')) {
        var firstName = givenName.split(' ')[0];
        var lastName = givenName.split(' ')[1];
        var userName = givenName.replace(' ', '.');
      } else if (name.length >= '0' && name.includes(' ')) {
        var firstName = name.split(' ')[0];
        var lastName = name.split(' ')[1];
        var userName = name.replace(' ', '.');
      }
      var facebookOS = 5;
      AsyncStorage.removeItem('SignupWithGoogle_Facebook');
      var GoogleData = {
        firstName: firstName,
        lastName: lastName,
        userName: userName,
        facebookOS: facebookOS,
        userID: userInfo.user.id,
        picture: userInfo.user.photo,
        email: userInfo.user.email,
        authtoken: userInfo.idToken,
      };
      console.log('google data ' + JSON.stringify(GoogleData));
      AsyncStorage.setItem(
        'SignupWithGoogle_Facebook',
        JSON.stringify(GoogleData),
      );

      setUserInfo(userInfo);
      setmodalVisiblecamera(false);
      if (global.Signup_LoginWithGoogle == 1) {
        ContinueWithSocialMedia();
      } else if (global.Signup_LoginWithGoogle == 2) {
        ContinueWithSocialMedia();
      }
    } catch (error) {
      console.log('Message', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Play Services Not Available or Outdated');
      } else {
        alert(error.message);
      }
    }
  };

  const ClickTerms_Condition = () => {
    setmodalVisibleTermsAndConditions(true);
  };
  async function UserCreate() {
    global.ContinueWithFacebook = 0;
    //props.navigation.navigate('Sign Up');
    setmodalVisiblecamera(true);
  }

  const checkTextInput = () => {
    if (Email.trim() == '') {
      Toast.show('Please enter username or email');

      return;
    }

    if (Password == '') {
      Toast.show('Please enter password');

      return;
    }

    setspinner(true);
    var headerFetch = {
      method: 'GET',
      // body: JSON.stringify({
      //   email: Email.trim(),
      //   password: Base64.btoa(Password.trim()),
      //   orgid: '1',
      //   subscriptionPackageId: 0,
      //   regsource: 0,
      // }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };

    console.log('headerFetch from login', JSON.stringify(headerFetch.body));
    // authenticateorguser
    fetch(
      servicesettings.baseuri +
        `Common/login?email=${Email.trim()}&password=${Base64.btoa(Password.trim())}`,
      headerFetch,
    )
      .then(response => response.json())
      .then(responseJson => {
        setspinner(false);
        console.log('headerFetch from login', JSON.stringify(responseJson));
        if (responseJson.status == false) {
          {
            responseJson.message != ''
              ? Toast.show(' ' + responseJson.message + ' ')
              : Toast.show('Data not found');
          }
          return;
        } else if (
          responseJson.status == false &&
          responseJson.errorCode == '404'
        ) {
          {
            responseJson.message != ''
              ? Toast.show(' ' + responseJson.message + ' ')
              : Toast.show('Data not found');
          }
          return;
        } else if (
          responseJson.status == false &&
          responseJson.errorCode == '202'
        ) {
          {
            responseJson.message != ''
              ? Toast.show(' ' + responseJson.message + ' ')
              : Toast.show('Api validation failed');
          }
          return;
        } else if (
          responseJson.status == true &&
          responseJson.errorCode == '407'
        ) {
          {
            responseJson.message != ''
              ? Toast.show(' ' + responseJson.message + ' ')
              : Toast.show(
                  'Too many requests, must be 40 Seconds interval between next request!',
                );
          }
          return;
        } else if (!responseJson?.data) {
          Toast.show('Oops login failed incorrect username/password');
          return;
        } else {
          if (responseJson.Error) {
            Toast.show('Network request failed');
          }
          const userData = Array.isArray(responseJson?.data)
            ? responseJson.data?.[0]
            : responseJson.data;
          AsyncStorage.setItem('LoginInformation', JSON.stringify(userData));
          loginUser(userData);
          global.Storeid = userData.storeid;
          global.ROLEID = userData.roleid;
          global.USERID = userData.id;
          global.StoreName = userData.TradeName;
          //console.log("global.Storeid check " + global.Storeid)

          Toast.show(`${userData?.fullName} has been logged in successfully`);
          setmodalVisible(true);
          setTimeout(() => {
            setmodalVisible(false);
            props.navigation.replace('BMT');
          }, 4000);
        }
      })
      .catch(error => {
        setspinner(false);
        console.error('service error', error);
        Toast.showWithGravity(
          'Something went wrong, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
      });
  };

  const ContinueWithSocialMedia = () => {
    setspinner(true);
    LoginManager.setLoginBehavior('web_only');
    AsyncStorage.getItem('SignupWithGoogle_Facebook').then(
      async function (res) {
        //AsyncStorage.getItem('SignupWithGoogle').then(function (res) {
        let Asyncdata = JSON.parse(res);

        if (Asyncdata != null) {
          setspinner(true);
          var fcmToken = servicesettings.fcmToken;
          var pictureUrl = Asyncdata.picture;
          var UserName = Asyncdata.userName;
          var Password = Asyncdata.userID;
          var email = Asyncdata.email;
          var authToken = Asyncdata.authtoken;
          //
          var FirstName = Asyncdata.firstName;
          var LastName = Asyncdata.lastName;
          let uniqueId = '';
          //let uniqueId = DeviceInfo.getUniqueId();
          let OS = 0;
          setspinner(true);
          if (Platform.OS === 'ios') {
            // OS = 3;
            var checkSignupSocialMedia = Asyncdata.facebookOS;
            if (checkSignupSocialMedia == 4) {
              OS = 6;
            } else {
              OS = 7;
            }
          }
          if (Platform.OS === 'android') {
            // OS = Asyncdata.facebookOS;
            OS = 4;
          }
          const data = new FormData();
          // console.log("imgdata check not equal null " + JSON.stringify(imgdata));
          if (pictureUrl != '') {
            var encodeUrl = Math.floor(Math.random() * 999999999999);
            data.append('profiles', {
              name: 'rn_image_picker_lib_temp_' + encodeUrl + '.jpg',
              uri: pictureUrl,
              type: 'image/jpeg',
            });
            console.log(
              'pictureUrl check not equal pictureUrl data ' +
                JSON.stringify(data),
            );
          }
          data.append('fmctoken', fcmToken);
          data.append('id', (0).toString());
          data.append('orgid', (1).toString());
          data.append('authtoken', authToken);
          data.append('IMs', uniqueId);
          data.append('regsource', OS.toString());
          data.append('username', UserName.trim());
          if (
            FirstName == null ||
            FirstName == '' ||
            FirstName == 'undefined'
          ) {
            data.append('firstname', FirstName);
          } else {
            data.append('firstname', FirstName.trim());
          }
          if (LastName == null || LastName == '' || LastName == 'undefined') {
            data.append('lastname', LastName);
          } else {
            data.append('lastname', LastName.trim());
          }
          if (email == null || email == '' || email == 'undefined') {
            data.append('email', '');
          } else {
            data.append('email', email.trim());
          }
          if (Password == null || Password == '' || Password == 'undefined') {
            data.append('password', Password);
          } else {
            data.append('password', Base64.btoa(Password.trim()));
          }
          data.append('roleid', (5).toString());
          data.append('status', (1).toString());
          // console.log('data ' + JSON.stringify(data));
          var ImageheaderFetch = {
            enctype: 'multipart/form-data',
            processData: false,
            contentType: false,
            cache: false,
            timeout: 600000,
            method: 'post',
            body: data,
            headers: {
              Authorization: servicesettings.AuthorizationKey,
            },
          };
          //
          console.log('useraccountwithlogin', await DeviceInfo.getUniqueId());
          console.log(
            'ImageheaderFetch check image 532 ' +
              JSON.stringify(ImageheaderFetch),
          );
          fetch(
            servicesettings.baseuri + 'useraccountwithlogin',
            ImageheaderFetch,
          )
            .then(response => {
              if (!response.ok) {
                throw new Error(
                  `Request failed with code : ${response.status}`,
                );
              }
              return response.json();
            })
            .then(responseJson => {
              console.log({ responseJson });
              if (
                responseJson.status == false &&
                responseJson.errorCode == '404'
              ) {
                {
                  setspinner(false);
                  responseJson.message != ''
                    ? Toast.show(' ' + responseJson.message + ' ')
                    : Toast.show('Data not found');
                }
                return;
              } else if (
                responseJson.status == false &&
                responseJson.errorCode == '202'
              ) {
                {
                  setspinner(false);
                  responseJson.message != ''
                    ? Toast.show(' ' + responseJson.message + ' ')
                    : Toast.show('Api validation failed');
                }
                return;
              } else if (
                responseJson.status == true &&
                responseJson.errorCode == '407'
              ) {
                {
                  setspinner(false);
                  responseJson.message != ''
                    ? Toast.show(' ' + responseJson.message + ' ')
                    : Toast.show(
                        'Too many requests, must be 40 Seconds interval between next request!',
                      );
                }
                return;
              } else if (responseJson.data.length == 0) {
                setspinner(false);
                Toast.show('Oops login failed incorrect username/password');
                return;
              }
              if (
                responseJson.status == true &&
                responseJson.errorCode == '0'
              ) {
                var responseJsonAdd = responseJson.data[0];
                var userId = responseJsonAdd.id;
                var userRoleId = responseJsonAdd.roleId;
                var userStatusId = responseJsonAdd.status;
                var userOrgId = responseJsonAdd.orgId;
                console.log(
                  'userOrgId > ',
                  userOrgId.toString(),
                  'userRoleId > ',
                  userRoleId.toString(),
                  'userStatusId > ',
                  userStatusId,
                  'userOrgId > ',
                  userOrgId,
                );
                var UserInfo = {
                  address: '',
                  avatar: responseJsonAdd.avatar,
                  email: responseJsonAdd.email,
                  firstname: responseJsonAdd.firstName,
                  id: userId.toString(),
                  lastname: responseJsonAdd.lastName,
                  orgid: userOrgId.toString(),
                  orgname: responseJsonAdd.orgName,
                  roleid: userRoleId.toString(),
                  status: userStatusId.toString(),
                  username: responseJsonAdd.userName,
                };

                console.log({ responseJsonAdd, UserInfo });
                loginUser(UserInfo);

                setspinner(false);
                Toast.show('Save successfully');
                setTimeout(() => {
                  setspinner(false);

                  props.navigation.replace('Dashboard');
                  //props.navigation.navigate('Home');
                }, 2000);
              } else {
                setspinner(false);
                Toast.show(
                  'Your account already exists, please proceed for Sign In ',
                );
              }
            })
            .catch(error => {
              setspinner(false);
              //*********need to some disscuss*********/
              console.error('uploadpicture error', error);
              Toast.showWithGravity(
                error?.message ||
                  'Internet connection failed, try another time !!!',
                Toast.LONG,
                Toast.CENTER,
              );
              return;
            });
        }
      },
    );
  };

  function PressSignUp() {
    setmodalVisiblecamera(false);
    ContinueWithSocialMedia();
  }
  function PressContinue() {
    LoginManager.setLoginBehavior('web_only');
    setmodalVisiblecamera(false);
    ContinueWithSocialMedia();
  }
  function SignupWithGoogle() {
    global.Signup_LoginWithGoogle = 1;
    Signup();
  }
  function LoginWithGoogle() {
    global.Signup_LoginWithGoogle = 2;
    Signup();
  }

  function CreateUser() {
    global.SocialMedia = 0;

    setmodalVisiblecamera(false);
    props.navigation.navigate('Signup');
  }
  function closeSocialMediaModal() {
    setmodalVisiblecamera(false);
  }
  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <View
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        extraScrollHeight={0}
      >
        <View style={styles.iconimage}>
          <Image source={profilelogo} style={{ width: 300, height: 100 }} />
        </View>
        <View style={styles.field}>
          <TextInput
            placeholderTextColor={theme.placeholderColor}
            style={[
              customestyleEmail,
              { backgroundColor: theme.inputBackColor, color: theme.textColor },
            ]}
            contextMenuHidden={true}
            placeholder="Email/Username"
            value={Email}
            onChangeText={value => setEmail(value)}
            onEndEditing={() => setemailFocus(false)}
            onFocus={() => setemailFocus(true)}
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
            maxLength={40}
          />
          <View
            style={[
              customestylePassword,
              { backgroundColor: theme.inputBackColor },
            ]}
          >
            <TextInput
              placeholderTextColor={theme.placeholderColor}
              style={[
                styles.passwordText,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
              ]}
              contextMenuHidden={true}
              placeholder="Password"
              value={Password}
              onEndEditing={() => setPasswordFocus(false)}
              onFocus={() => setPasswordFocus(true)}
              onChangeText={value => setPassword(value)}
              secureTextEntry={show}
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              maxLength={10}
            />
            {Password != '' ? (
              <TouchableOpacity onPress={() => showhidepassword()}>
                <Icon
                  name={show == false ? 'eye-slash' : 'eye'}
                  style={styles.imageStyleshowhide}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity></TouchableOpacity>
            )}
          </View>
        </View>
        <Button
          style={styles.btnlogin}
          caption="LOG IN"
          bgColor={theme.buttonBackColor}
          onPress={() => checkTextInput()}
        />
        <View style={styles.DividerRow}>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.borderColorOr,
            }}
          />
          <View>
            <Text
              style={{
                width: 30,
                fontSize: 19,
                textAlign: 'center',
                marginTop: -4,
                color: colors.borderColorOr,
              }}
            >
              or
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.borderColorOr,
            }}
          />
        </View>
        {Platform.OS === 'android' && (
          <View style={styles.signupView}>
            <TouchableOpacity
              onPress={() => LoginWithGoogle()}
              style={[
                [
                  styles.btnfacebook,
                  { backgroundColor: theme.buttonBackColor },
                ],
                { backgroundColor: theme.buttonBackColor },
              ]}
            >
              <View style={styles.googleIconView}>
                <Image source={googleIcon} style={styles.googleIcon} />
              </View>
              <Text
                style={
                  Platform.OS === 'ios'
                    ? styles.textfacebookIOS
                    : styles.textfacebook
                }
              >
                Sign In With Google
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <ContinueWithFacebook
          PressContinue={PressContinue}
          FacebookmodalVisible={FacebookmodalVisible}
          theme={theme}
        ></ContinueWithFacebook>
        <View style={styles.DividerRow}>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.borderColorOr,
            }}
          />
          <View>
            <Text
              style={{
                width: 30,
                fontSize: 19,
                textAlign: 'center',
                marginTop: -4,
                color: colors.borderColorOr,
              }}
            >
              or
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: colors.borderColorOr,
            }}
          />
        </View>
        <View style={styles.fieldView}>
          <View style={styles.MainView}>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('Forgot Password')}
            >
              <Text style={styles.simpletext}> Forgot password? </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => UserCreate()}>
              <Text style={styles.simpletext}>Sign Up </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                [styles.copyrirgttext, { color: theme.textColor }],
                { color: theme.textColor },
              ]}
            >
              Powerd By Blazor Technologies Inc,{' '}
            </Text>
            <Text
              style={[
                [styles.copyrirgttext, { color: theme.textColor }],
                { color: theme.textColor },
              ]}
            >
              {new Date().getFullYear()}
            </Text>
          </View>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait']}
        visible={modalVisiblecamera}
      >
        <View
          style={[
            styles.ModalMainView,
            { backgroundColor: theme.backgroundColor },
          ]}
        >
          <TouchableOpacity style={{}} onPress={() => closeSocialMediaModal()}>
            <Icons name={'close'} style={styles.CrossIcon} />
          </TouchableOpacity>
          <View style={{ alignItems: 'center', marginBottom: 34 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '900',
                fontFamily: 'sans-serif-medium',
                color: theme.textColor,
              }}
            >
              Sign Up To BMT
            </Text>
          </View>
          <View style={styles.iconimage}>
            <Image source={profilelogo} style={{ width: 300, height: 100 }} />
          </View>
          <View style={styles.centeredView}>
            <View style={styles.signupWithEmailView}>
              <TouchableOpacity
                onPress={() => CreateUser()}
                style={[
                  styles.btnfacebook,
                  { backgroundColor: theme.buttonBackColor },
                ]}
              >
                <Icon name={'envelope'} style={styles.IconEmail} />
                <Text
                  style={
                    Platform.OS === 'ios'
                      ? styles.textfacebookIOS
                      : styles.textfacebook
                  }
                >
                  Sign Up With Email
                </Text>
              </TouchableOpacity>
            </View>
            {Platform.OS === 'android' && (
              <View style={styles.signupView}>
                <TouchableOpacity
                  onPress={() => SignupWithGoogle()}
                  style={[
                    styles.btnfacebook,
                    { backgroundColor: theme.buttonBackColor },
                  ]}
                >
                  <View style={styles.googleIconView}>
                    <Image source={googleIcon} style={styles.googleIcon} />
                  </View>
                  <Text
                    style={
                      Platform.OS === 'ios'
                        ? styles.textfacebookIOS
                        : styles.textfacebook
                    }
                  >
                    Sign Up With Google
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <SignupWithFacebook
              PressSignUp={PressSignUp}
              FacebookmodalVisible={FacebookmodalVisible}
              theme={theme}
            ></SignupWithFacebook>
          </View>
          <View style={styles.Bottomfield}>
            <TouchableOpacity
              onPress={() => ClickTerms_Condition()}
              style={styles.termOfUseView}
            >
              <Text style={styles.termOfUse}>
                Agree with Terms & Conditions{' '}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.Bottomfield}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={[styles.copyrirgttext, { color: theme.textColor }]}>
                Powerd By Blazor Technologies Inc,{' '}
              </Text>
              <Text style={[styles.copyrirgttext, { color: theme.textColor }]}>
                {new Date().getFullYear()}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Model modalVisible={modalVisible}></Model>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={{ color: '#FFF' }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    color: colors.white,
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  field: {
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 3,
  },
  termOfUseView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 3,
  },
  termOfUse: {
    marginTop: 3,
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.TextColor,
  },
  DividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.get('window').width - 50,
    marginHorizontal: 25,
    marginVertical: 12,
  },
  Bottomfield: {
    paddingBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 3,
  },
  fieldView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 3,
    paddingVertical: 12,
  },
  MainView: {
    flexDirection: 'row',
    //alignItems: 'center',
    justifyContent: 'space-around',
  },
  btnlogin: {
    backgroundColor: colors.Blazorbutton,
    width: Dimensions.get('window').width - 50,
    marginHorizontal: 25,
    marginVertical: 10,
    borderRadius: 8,
    height: 46,
    borderColor: colors.InputControlBorderColor,
  },
  TitleLogo: {
    color: colors.TextColorOther,
    fontSize: 22,
    fontWeight: 'bold',
    justifyContent: 'space-around',
    fontFamily: 'Roboto',
  },
  TitleLogoView: {
    paddingBottom: 2 + '%',
    alignItems: 'center',
  },
  TitleLogoViewModal: {
    paddingBottom: 12 + '%',
    alignItems: 'center',
  },
  ButtonView: {
    padding: 12,
    paddingHorizontal: 25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signupEmailView: {
    paddingBottom: 15,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  LoginView: {
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signupView: {
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signupWithEmailView: {
    paddingBottom: 19,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    margin: 20,
    alignSelf: 'stretch',
  },
  btnfacebook: {
    backgroundColor: colors.Blazorbutton,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 50,
    color: 'white',
    marginBottom: 1,
    height: 46,
    alignItems: 'center',
    borderRadius: 4,
  },
  Iconfacebook: {
    fontSize: 25,
    paddingTop: 14,
    paddingHorizontal: 19,
    color: 'white',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: 'red',
    width: 15 + '%',
    height: 46,
  },
  IconEmail: {
    fontSize: 34,
    paddingTop: 5,
    paddingHorizontal: 10,
    color: 'white',
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: '#cb4023',
    width: 15 + '%',
    height: 46,
  },
  googleIcon: {
    height: 30,
    width: 30,
  },
  googleIconView: {
    height: 30,
    paddingTop: 10,
    paddingHorizontal: 10,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    backgroundColor: '#f0eff5',
    borderColor: colors.borderColor,
    borderWidth: 1,
    width: 15 + '%',
    height: 46,
  },
  textfacebook: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    width: 87 + '%',
    textAlign: 'center',
  },
  textfacebookIOS: {
    color: 'white',
    fontSize: 14,
    fontWeight: '200',
    width: 87 + '%',
    textAlign: 'center',
  },
  btnGoggle: {
    marginVertical: 8,
    width: Dimensions.get('window').width - 50,
    height: 46,
    borderRadius: 4,
  },
  iconimage: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginTop: 5 + '%',
  },
  textinputFocuse: {
    backgroundColor: colors.red,
    borderColor: colors.InputControlBorderFocusColor,
    width: Dimensions.get('window').width - 50,
    height: 46,
    marginTop: 10,
    fontSize: 15,
    borderRadius: 4,
    borderWidth: 1,
    shadowColor: colors.red,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  textinputpasswordFocuse: {
    backgroundColor: colors.red,
    borderColor: colors.InputControlBorderFocusColor,
    width: Dimensions.get('window').width - 50,
    height: 46,
    marginTop: 13,
    fontSize: 15,
    borderRadius: 4,
    flexDirection: 'row',
    borderWidth: 1,
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
  textboxstyle: {
    width: Dimensions.get('window').width - 65,
    height: 46,
    backgroundColor: colors.red,
    fontSize: 15,
    marginLeft: 5,
  },
  textboxstylepassword: {
    width: Dimensions.get('window').width - 100,
    height: 46,
    backgroundColor: colors.red,
    fontSize: 13,
    marginLeft: 5,
  },
  inputfieldpassword: {
    flexDirection: 'row',
    //borderWidth: 1,
    borderColor: colors.red,
    width: Dimensions.get('window').width - 50,
    height: 46,
    marginTop: 13,
    //fontWeight: 'bold',
    fontSize: 13,
    borderRadius: 4,
    //textAlign: 'center',
    backgroundColor: colors.InputControlBackColor,
  },
  inputfield: {
    //borderWidth: 1,
    borderColor: colors.TextColor,
    width: Dimensions.get('window').width - 50,
    height: 46,
    marginTop: 13,
    //fontWeight: 'bold',
    fontSize: 15,
    borderRadius: 4,
    //textAlign: 'center',
    backgroundColor: colors.TextColor,
  },
  simpletext: {
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 0,
    fontSize: 18,
    fontWeight: '600',
    //color: colors.TextColor,
    color: colors.TextColor,
    fontFamily: 'Lato-Bold',
    //fontFamily: 'sans-serif-medium',
  },
  copyrirgttext: {
    marginTop: 3,
    fontSize: 15,
    fontWeight: '400',
    color: colors.TextColorOther,
    fontFamily: 'sans-serif-medium',
  },
  imageStyleshowhide: {
    margin: 10,
    fontSize: 25,
    color: 'white',
    //backgroundColor:'red',
  },
  CrossIcon: {
    marginHorizontal: 10,
    fontSize: 25,
    color: colors.LabelColor,
    textAlign: 'right',
  },
  ModalMainView: {
    //  minHeight:580,
    //  maxHeight:580,
    height: Dimensions.get('window').height,
    // flex: 1,
    paddingTop: 12,
    top: 7 + '%',
    paddingBottom: 22,
    //position:'absolute',
    //bottom:1,
    //backgroundColor:'#1a1c20',
    backgroundColor: 'white',
    //backgroundColor:colors.DarkModeApplicationBackgroundColor,
    //alignItems:'center',
    //justifyContent:'center'
  },
  centeredView: {
    paddingTop: 38,
    paddingBottom: 22,
    //backgroundColor:'#1a1c20',
    //backgroundColor:colors.DarkModeApplicationBackgroundColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  Text: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    marginLeft: 5,
    //borderBottomLeftRadius:2,
    borderColor: 'white',
    color: colors.TextColor,
    backgroundColor: colors.TextBoxContainer,
    // backgroundColor: colors.red,
    width: Dimensions.get('window').width - 107.8,
  },
  passwordText: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    marginLeft: 5,
    color: colors.TextBoxColor,
    //backgroundColor: colors.red,
    width: Dimensions.get('window').width - 100,
  },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 46,
    fontSize: 16,
    paddingLeft: 5,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 1,
    borderColor: colors.borderColor,
    //backgroundColor: '#201f1f',
    backgroundColor: colors.TextBoxContainer,
    //borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleOnFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 46,
    paddingLeft: 5,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 2,
    backgroundColor: colors.TextBoxContainer,
    //backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 46,
    fontSize: 16,
    paddingLeft: 15,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 1,
    borderColor: colors.borderColor,
    //backgroundColor: '#201f1f',
    backgroundColor: colors.TextBoxContainer,
    //borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleOnEmailFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    height: 46,
    paddingLeft: 15,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 2,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  imageStyle: {
    margin: 10,
    fontSize: 30,
    color: colors.AwesomeIconColor,
  },
  imageStyleemail: {
    margin: 7,
    fontSize: 28,
    color: colors.AwesomeIconColor,
  },
  imageStyleshowhide: {
    margin: 7,
    fontSize: 25,
    color: colors.AwesomeIconColor,
  },
});

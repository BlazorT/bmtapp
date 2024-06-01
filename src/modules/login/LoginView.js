//import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Base64 from 'Base64';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  NativeModules,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import {Button} from '../../components';
import ContinueWithFacebook from '../../components/ContinueWithFacebook';
import Model from '../../components/Model';
import SignupWithFacebook from '../../components/SignupWithFacebook';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
//import InformationCameraModel from '../../components/InformationCameraModel';
const iconGrids = require('../../../assets/images/tabbar/grids.png');
const profileIcon = require('../../../assets/images/pages/profile.png');
const googleIcon = require('../../../assets/images/icons/google.png');
//import messaging from '@react-native-firebase/messaging';
import DeviceInfo from 'react-native-device-info';
//import { getUniqueId, getManufacturer } from 'react-native-device-info';
//import SearchableDropdown from 'react-native-searchable-dropdown';
//import TwitterLogin from 'react-native-twitter-signin';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
//import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
//import InstagramLogin from 'react-native-instagram-login';
//import CookieManager from '@react-native-community/cookies';
import {LoginManager} from 'react-native-fbsdk-next';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
const {RNTwitterSignIn} = NativeModules;

export default function LoginScreen(props) {
  //console.log('LoginButton' + LoginButton);
  // console.log('AccessToken ' + AccessToken);
  //console.log('Profile ' + JSON.stringify(Profile));
  //console.log('LoginManager ' + JSON.stringify(LoginManager));
  //console.log('AccessToken ' + JSON.stringify(AccessToken));
  //console.log('Profile' + Profile);
  const [storeindex, setstoreindex] = useState(0);
  const [MyData, setMyData] = useState([]);
  //const [emailfocus,setemailFocus]= useState(false);
  const [spinner, setspinner] = useState(false);
  //const customestyleEmail = emailfocus ? styles.textinputFocuse : styles.inputfield;
  const [focus, setFocus] = useState(false);
  const customestyle = focus
    ? styles.textinputpasswordFocuse
    : styles.inputfieldpassword;
  const profilelogo = require('../../../assets/images/BDMT.png');
  const [textInputEmail, setTextInputEmail] = useState('');
  const [textInputPassword, setTextInputPassword] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [Email, setEmail] = useState('');
  const [data, setdata] = useState([]);
  const [orgindex, setorgindex] = useState(0);
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
  const [showtick, setshowtick] = useState(false);
  const [selectedItems, setSelectedItems] = useState('');
  const [modalVisible, setmodalVisible] = useState(false);
  const [FacebookmodalVisible, setfacebookmodalVisible] = useState(false);
  const [modalVisiblecamera, setmodalVisiblecamera] = useState(false);
  const [
    modalVisibleTermsAndConditions,
    setmodalVisibleTermsAndConditions,
  ] = useState(false);
  const showhidepassword = () => {
    if (show == false) {
      setshow(true);
    }
    if (show == true) {
      setshow(false);
    }
  };
  //const emailRef = useRef();
  //const passwordRef = useRef();
  var regExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  useEffect(() => {
    global.SocialMedia = 0;
    //console.log('GoogleSignin.configure');
    GoogleSignin.configure({
      webClientId:
        '344400656576-n1btnvu3unr8ioidunk8i6d6ne6qb903.apps.googleusercontent.com',
      offlineAccess: true,
    });
    console.log('global.SignUp_Login', global.SignUp_Login);
    if (global.SignUp_Login == 1) {
      setmodalVisiblecamera(false);
    } else {
      setmodalVisiblecamera(true);
    }
  }, []);
  const Signup = async () => {
    global.SocialMedia = 1;
    try {
      alert('GoogleSignin ' + JSON.stringify(GoogleSignin));
      console.log('GoogleSignin Info --> ', JSON.stringify(GoogleSignin));
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      alert('userInfo ' + JSON.stringify(userInfo));
      console.log('User Info --> ', JSON.stringify(userInfo));
      //console.log('User Info --> givenName ', JSON.stringify(userInfo.user.givenName));
      var givenName = userInfo.user.givenName;
      var name = userInfo.user.name;
      // console.log('User userInfo.user.familyName ', JSON.stringify(userInfo.user.familyName));
      // console.log('givenName givenName includes ', JSON.stringify(givenName.includes(" ")));
      //console.log('givenName givenName .includes(" ") ', JSON.stringify(givenName.replace(' ','.')));
      // console.log('givenName givenName ', JSON.stringify(givenName.replace(' ','.')));
      // console.log('givenName first name', JSON.stringify(givenName.split(' ')[0]));
      //console.log('givenName last name ', JSON.stringify(givenName.split(' '))[1]);
      //var firstName = (givenName.includes(" "));
      if (givenName.length >= '0' && givenName.includes(' ')) {
        var firstName = givenName.split(' ')[0];
        var lastName = givenName.split(' ')[1];
        var userName = givenName.replace(' ', '.');
        // console.log('firstName firstName firstName firstName ', JSON.stringify(firstName));
        // console.log('lastName lastName lastName lastName ', JSON.stringify(lastName));
        //console.log('userName userName userName userName ', JSON.stringify(userName));
      } else if (name.length >= '0' && name.includes(' ')) {
        var firstName = name.split(' ')[0];
        var lastName = name.split(' ')[1];
        var userName = name.replace(' ', '.');
        //console.log('name firstName firstName firstName firstName ', JSON.stringify(firstName));
        //console.log('name lastName lastName lastName lastName ', JSON.stringify(lastName));
        //console.log('name userName userName userName userName ', JSON.stringify(userName));
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
      // console.log('User Info --> ', JSON.stringify(userInfo));
      setUserInfo(userInfo);
      //props.navigation.navigate('Sign Up');
      setmodalVisiblecamera(false);
      if (global.Signup_LoginWithGoogle == 1) {
        //console.log('ContinueWithSocialMedia click 1 ');
        ContinueWithSocialMedia();
      } else if (global.Signup_LoginWithGoogle == 2) {
        //console.log('LoginContinueWithSocialMedia click 2 ');
        ContinueWithSocialMedia();
        //LoginContinueWithSocialMedia();
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
  console.log('global.SocialMedia ', global.SocialMedia);
  const Constants = {
    //Dev Parse keys
    TWITTER_API_KEY: 'VTicm877GQgV2ODMzmPXdAwnJ',
    TWITTER_SECRET_KEY: 'vAUfRCUxwmZwYYJTvaDEDotqLk6bHfVIGyzSkeVH2xxJgm7jF0',
  };
  const AccessToken = {
    //Dev Parse keys
    TWITTER_API_KEY: 'VTicm877GQgV2ODMzmPXdAwnJ',
    TWITTER_SECRET_KEY: 'vAUfRCUxwmZwYYJTvaDEDotqLk6bHfVIGyzSkeVH2xxJgm7jF0',
  };
  twitterLogin = () => {
    global.SocialMedia = 3;
    console.log('twitterLogin click');
    const fcmSocialToken = servicesettings.fcmToken;
    RNTwitterSignIn.init(
      Constants.TWITTER_API_KEY,
      Constants.TWITTER_SECRET_KEY,
    );
    RNTwitterSignIn.logIn()
      .then(loginData => {
        const {authToken, authTokenSecret} = loginData;
        if (authToken && authTokenSecret) {
          // You can use this data here and move next
        }
      })
      .catch(error => {
        console.log(error);
      });
  };
  const SigninWithFaceboonClick = () => {
    setfacebookmodalVisible(true);
  };
  const TermsAndConditionsClose = () => {
    setmodalVisibleTermsAndConditions(false);
  };
  const ClickTerms_Condition = () => {
    setmodalVisibleTermsAndConditions(true);
  };
  const twitterLoginXX = () => {
    //RNTwitterSignIn.init(Constants.TWITTER_API_KEY, Constants.TWITTER_SECRET_KEY)
    //RNTwitterSignIn.init(APIKEY)
    RNTwitterSignIn.init(
      Constants.TWITTER_API_KEY,
      Constants.TWITTER_SECRET_KEY,
    );
    //console.log('RNTwitterSignIn ' + JSON.stringify(RNTwitterSignIn.init()));
    RNTwitterSignIn.logIn()
      .then(loginData => {
        console.log('loginData 2 ');
        console.log('loginData 3' + loginData);
        const {authToken, authTokenSecret} = loginData;
        if (authToken && authTokenSecret) {
          this.setState({
            isLoggedIn: true,
          });
        }
      })
      .catch(error => {
        //console.log('loginData 4');
        console.log(error);
      });
  };
  async function UserCreate() {
    global.ContinueWithFacebook = 0;
    //props.navigation.navigate('Sign Up');
    setmodalVisiblecamera(true);
  }
  async function facebookClick() {
    global.SocialMedia = 1;
    props.navigation.navigate('Sign Up Facebook');
  }
  const checkTextInput = () => {
    //var reg = /^\S*$/;
    let uniqueId = DeviceInfo.getDeviceId();
    if (Email.trim() == '') {
      Toast.show('Please enter username or email');
      //emailRef.current.focus();
      return;
    }
    //if (reg.test(textInputEmail.trim()) === false) {
    //Toast.showWithGravity('Incorrect user name or email',Toast.LONG,Toast.CENTER)
    // return;
    // }
    if (Password == '') {
      Toast.show('Please enter password');
      //passwordRef.current.focus();
      return;
    }
    // if(textInputEmail.includes(".") && textInputEmail.includes("@")){
    //Toast.show('@ and . use');
    //  var emailcheck = textInputEmail.trim();
    //  }else{
    //Toast.show('@ only use');
    //   var usernamecheck = textInputEmail.trim();
    //}
    // console.log('emailcheck ' + emailcheck);
    var UserName = 'Blazor^^018';
    var Password = 'Blazor~~^^##';
    setspinner(true);
    var headerFetch = {
      method: 'POST',
      body: JSON.stringify({
        username: Email.trim(),
        password: Base64.btoa(Password.trim()),
        orgid: '1',
        subscriptionPackageId: 0,
        regsource: 0,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    //useraccount //users
    // console.log("body ",body);
    console.log('headerFetch from login', JSON.stringify(headerFetch.body));
    //if()
    //console.log("headerFetch from login");
    //fetch(servicesettings.baseuri + 'auhtenticateorguser',headerFetch).then(response =>  response.json())
    //.then((responseJson) => {
    fetch(servicesettings.baseuri + 'authenticateorguser', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        setspinner(false);
        console.log('data response authenticateorguser =>', responseJson);
        if (responseJson.status == false && responseJson.errorCode == '404') {
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
        } else if (responseJson.data.length == 0) {
          Toast.show('Oops login failed incorrect username/password');
          return;
        } else {
          if (responseJson.Error) {
            Toast.show('Network request failed');
          }
          AsyncStorage.setItem(
            'LoginInformation',
            JSON.stringify(responseJson.data),
          );
          global.Storeid = responseJson.data[0].storeid;
          global.ROLEID = responseJson.data[0].roleid;
          global.USERID = responseJson.data[0].id;
          global.StoreName = responseJson.data[0].TradeName;
          //console.log("global.Storeid check " + global.Storeid)
          console.log('global.name check ' + global.StoreName);
          console.log('global.ROLEID ' + global.ROLEID);
          console.log('global.USERID ' + global.USERID);
          Toast.show('Login success');
          setmodalVisible(true);
          setTimeout(() => {
            setmodalVisible(false);
            props.navigation.replace('Dashboard');
          }, 4000);
        }
      })
      .catch(error => {
        setspinner(false);
        console.error('service error', error);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
      });
  };
  const LoginContinueWithSocialMedia = () => {
    LoginManager.setLoginBehavior('web_only');
    console.log('LoginContinueWithSocialMedia 339 ');
    // ClearAsyncStorage();
    console.log('continue login 340 ');
    // Sign with google start
    // if(global.Signup_LoginWithGoogle == 3){AsyncStorage.getItem('SignupWithFacebook')}
    //else if(global.Signup_LoginWithGoogle == 2){AsyncStorage.getItem('SignupWithFacebook')}
    //(global.Signup_LoginWithGoogle == 2){AsyncStorage.getItem('SignupWithFacebook')}
    //AsyncStorage.getItem('SignupWithFacebook')
    AsyncStorage.getItem('SignupWithGoogle_Facebook').then(function(res) {
      let Asyncdata = JSON.parse(res);
      console.log(
        ' SignupWithGoogle SignupWithGoogle SignupWithGoogle SignupWithGoogle ',
        Asyncdata,
      );
      if (Asyncdata != null) {
        setspinner(true);
        //var imgurl = Asyncdata.user.photo;
        // console.log('Async SignupWithGoogle authtoken ', Asyncdata.authtoken);
        // console.log('Async SignupWithGoogle email ', Asyncdata.email);
        // console.log('Async SignupWithGoogle picture ', Asyncdata.picture);
        // console.log('Async SignupWithGoogle firstName ', Asyncdata.firstName);
        // console.log('Async SignupWithGoogle lastName ', Asyncdata.lastName);
        // console.log('Async SignupWithGoogle userName ', Asyncdata.userName);
        //console.log('Async SignupWithGoogle userID ', Asyncdata.userID);
        var UserName = Asyncdata.userName;
        var Password = Asyncdata.userID;
        var email = Asyncdata.email;
        //var authToken = (Asyncdata.user.idToken);
        //var FirstName = (Asyncdata.user.name).split(' ')[0];
        // var LastName = (Asyncdata.user.name).split(' ')[1];
        console.log('Async UserName', UserName);
        var headerFetch = {
          method: 'POST',
          body: JSON.stringify({
            email: email.trim(),
            password: Base64.btoa(Password.trim()),
            orgid: '1',
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: servicesettings.AuthorizationKey,
          },
        };
        console.log('headerFetch ', JSON.stringify(headerFetch));
        fetch(servicesettings.baseuri + 'useraccount', headerFetch)
          .then(response => response.json())
          .then(responseJson => {
            setspinner(false);
            console.log('data response useraccount =>', responseJson);
            if (
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
            } else if (responseJson.data.length == 0) {
              setspinner(false);
              Toast.show('Oops login failed incorrect username/password');
              return;
            } else {
              if (responseJson.Error) {
                Toast.show('Network request failed');
              }
              AsyncStorage.setItem(
                'LoginInformation',
                JSON.stringify(responseJson.data),
              );
              global.Storeid = responseJson.data[0].storeid;
              global.ROLEID = responseJson.data[0].roleid;
              global.USERID = responseJson.data[0].id;
              global.StoreName = responseJson.data[0].TradeName;
              //console.log("global.Storeid check " + global.Storeid)
              console.log('global.name check ' + global.StoreName);
              console.log('global.ROLEID ' + global.ROLEID);
              console.log('global.USERID ' + global.USERID);
              Toast.show('Login success');
              setmodalVisible(true);
              setTimeout(() => {
                setmodalVisible(false);
                setspinner(false);
                props.navigation.replace('Dashboard');
              }, 4000);
            }
            // ClearAsyncStorage();
          })
          .catch(error => {
            setspinner(false);
            console.error('service error', error);
            Toast.showWithGravity(
              'Internet connection failed, try another time !!!',
              Toast.LONG,
              Toast.CENTER,
            );
          });
      }
    });
    const ClearAsyncStorageXX = async function() {
      console.log('Clear Storeage');
      await AsyncStorage.clear();
      // setspinner(false);
    };

    // Sign with google end
  };
  const ContinueWithSocialMedia = () => {
    setspinner(true);
    LoginManager.setLoginBehavior('web_only');
    AsyncStorage.getItem('SignupWithGoogle_Facebook').then(function(res) {
      //AsyncStorage.getItem('SignupWithGoogle').then(function (res) {
      let Asyncdata = JSON.parse(res);
      console.log('SignupWithGoogle_Facebook 438 ', Asyncdata);
      if (Asyncdata != null) {
        setspinner(true);
        var fcmToken = servicesettings.fcmToken;
        var pictureUrl = Asyncdata.picture;
        var UserName = Asyncdata.userName;
        var Password = Asyncdata.userID;
        var email = Asyncdata.email;
        var authToken = Asyncdata.authtoken;
        // console.log('check error ');
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
        if (FirstName == null || FirstName == '' || FirstName == 'undefined') {
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
        console.log('useraccountwithlogin', DeviceInfo.getUniqueId());
        console.log(
          'ImageheaderFetch check image 532 ' +
            JSON.stringify(ImageheaderFetch),
        );
        fetch(
          servicesettings.baseuri + 'useraccountwithlogin',
          ImageheaderFetch,
        )
          .then(response => response.json())
          .then(responseJson => {
            console.log('responseJson useraccountwithlogin', responseJson);
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
            if (responseJson.status == true && responseJson.errorCode == '0') {
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
              var UserInfo = [
                {
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
                },
              ];
              console.log('UserInfo ', UserInfo);
              AsyncStorage.setItem(
                'LoginInformation',
                JSON.stringify(UserInfo),
              );
              setspinner(false);
              Toast.show('Save successfully');
              setTimeout(() => {
                setspinner(false);
                console.log('home ');
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
              'Internet connection failed, try another time !!!',
              Toast.LONG,
              Toast.CENTER,
            );
            return;
          });
      }
    });
  };

  ClearAsyncStorage = async () => {
    await AsyncStorage.clear();
  };
  function PressSignUp() {
    console.log(' PressSignUp click click');
    setmodalVisiblecamera(false);
    ContinueWithSocialMedia();
  }
  function PressContinue() {
    console.log(' PressContinue');
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
  function SignupWithFacebookClick() {
    global.Signup_LoginWithGoogle = 3;
    ContinueWithSocialMedia();
  }
  function LoginWithFacebookClick() {
    // global.Signup_LoginWithGoogle = 2;
    ContinueWithSocialMedia();
  }
  function CreateUser() {
    global.SocialMedia = 0;
    console.log('CreateUser click');
    setmodalVisiblecamera(false);
    props.navigation.navigate('Signup');
    console.log('CreateUser click ee');
  }
  function closeSocialMediaModal() {
    setmodalVisiblecamera(false);
  }
  // console.log('Check store data ' + JSON.stringify(data.sort(function(obj1, obj2) {return obj1.storeid - obj2.storeid;})[0].name));
  //console.log('Check store data ' + JSON.stringify(data.sort(function(obj1, obj2) {return obj1.storeid - obj2.storeid;})[0].id));
  return (
    <View style={styles.container}>
      <View
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={true}
        extraScrollHeight={0}
      >
        <View style={styles.iconimage}>
          <Image source={profilelogo} style={{width: 300, height: 100}} />
        </View>
        <View style={styles.field}>
          <TextInput
            placeholderTextColor={colors.TextBoxPlaceholderColor}
            style={customestyleEmail}
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
          <View style={customestylePassword}>
            <TextInput
              placeholderTextColor={colors.TextBoxPlaceholderColor}
              style={styles.passwordText}
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
          bgColor={colors.Blazorbutton}
          onPress={() => checkTextInput()}
        />
        <View style={styles.DividerRow}>
          <View
            style={{flex: 1, height: 1, backgroundColor: colors.borderColorOr}}
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
            style={{flex: 1, height: 1, backgroundColor: colors.borderColorOr}}
          />
        </View>
        <View style={styles.signupView}>
          <TouchableOpacity
            onPress={() => LoginWithGoogle()}
            style={styles.btnfacebook}
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
        <ContinueWithFacebook
          PressContinue={PressContinue}
          FacebookmodalVisible={FacebookmodalVisible}
        ></ContinueWithFacebook>
        <View style={styles.DividerRow}>
          <View
            style={{flex: 1, height: 1, backgroundColor: colors.borderColorOr}}
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
            style={{flex: 1, height: 1, backgroundColor: colors.borderColorOr}}
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
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.copyrirgttext}>
              Powerd By Blazor Technologies Inc,{' '}
            </Text>
            <Text style={styles.copyrirgttext}>{new Date().getFullYear()}</Text>
          </View>
        </View>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait']}
        visible={modalVisiblecamera}
      >
        <View style={styles.ModalMainView}>
          <TouchableOpacity style={{}} onPress={() => closeSocialMediaModal()}>
            <Icons name={'close'} style={styles.CrossIcon} />
          </TouchableOpacity>
          <View style={{alignItems: 'center', marginBottom: 34}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: '900',
                fontFamily: 'sans-serif-medium',
                color: colors.TextColorOther,
              }}
            >
              Sign Up To BMT
            </Text>
          </View>
          <View style={styles.iconimage}>
            <Image source={profilelogo} style={{width: 300, height: 100}} />
          </View>
          <View style={styles.centeredView}>
            <View style={styles.signupWithEmailView}>
              <TouchableOpacity
                onPress={() => CreateUser()}
                style={styles.btnfacebook}
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
            <View style={styles.signupView}>
              <TouchableOpacity
                onPress={() => SignupWithGoogle()}
                style={styles.btnfacebook}
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
            <SignupWithFacebook
              PressSignUp={PressSignUp}
              FacebookmodalVisible={FacebookmodalVisible}
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
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.copyrirgttext}>
                Powerd By Blazor Technologies Inc,{' '}
              </Text>
              <Text style={styles.copyrirgttext}>
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
        textStyle={{color: '#FFF'}}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    //backgroundColor: '#011112',// '#011f4b',//colors.BlazorBg,
    color: colors.white,
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  field: {
    //backgroundColor:'red',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 3,
  },
  termOfUseView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 3,
    //width: Dimensions.get('window').width-180,
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
    //marginLeft:25,
    marginHorizontal: 25,
    marginVertical: 10,
    //margin: 10,
    //paddingVertical:22,
    //paddingHorizontal:22,
    //marginHorizontal:22,
    borderRadius: 8,
    height: 46,
    //borderWidth: 1,
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
    // marginTop:10,
    paddingBottom: 2 + '%',
    //flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'space-around',
  },
  TitleLogoViewModal: {
    // marginTop:10,
    paddingBottom: 12 + '%',
    //flexDirection: 'row',
    alignItems: 'center',
    //justifyContent: 'space-around',
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
    //paddingHorizontal:25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  LoginView: {
    paddingBottom: 15,
    //paddingHorizontal:25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signupView: {
    paddingBottom: 15,
    //paddingHorizontal:25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  signupWithEmailView: {
    paddingBottom: 19,
    //paddingHorizontal:25,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    margin: 20,
    alignSelf: 'stretch',
  },
  btnfacebook: {
    backgroundColor: colors.Blazorbutton,
    //backgroundColor: '#3c5a9b',
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
    //backgroundColor:'#22355a',
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
    // border-top-left-radius
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
    // border-top-left-radius
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
    //height:170,
    //height: Dimensions.get('window').height-0,
    alignItems: 'center',
    marginTop: 5 + '%',
  },
  textinputFocuse: {
    backgroundColor: colors.red,
    borderColor: colors.InputControlBorderFocusColor,
    //borderColor: '#d3ad1457',
    //borderColor: colors.InputControlBorderFocusColor,
    width: Dimensions.get('window').width - 50,
    height: 46,
    marginTop: 10,
    //fontWeight: 'bold',
    fontSize: 15,
    //marginLeft:5,
    borderRadius: 4,
    //textAlign: 'center',
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
    //fontWeight: 'bold',
    fontSize: 15,
    borderRadius: 4,
    flexDirection: 'row',
    borderWidth: 1,
    //shadowColor: colors.red,
    //shadowOffset: {
    //  width: 0,
    //  height: 12,
    //},
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

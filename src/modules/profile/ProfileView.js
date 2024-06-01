import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import NetInfo from '@react-native-community/netinfo';
import Base64 from 'Base64';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import {Button, Dropdown, TextInput} from '../../components';
import Alert from '../../components/Alert';
import TermsAndConditions from '../../components/Terms&Conditions';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import {useTheme} from '../../hooks/useTheme';
const profileIcon = require('../../../assets/images/defaultUser.png');
const arrowback = require('../../../assets/images/icons/BackArrow.png');
//import messaging from '@react-native-firebase/messaging';
const CurrentDate = new Date();
var filterID = null;
export default function VehicalSallerScreen(props) {
  //console.log('props new ' + JSON.stringify(props));
  const theme = useTheme();
  const [spinner, setspinner] = useState(false);
  const [img, setimg] = useState('');
  const [cityindex, setcityindex] = useState(-1);
  const [orgindex, setorgindex] = useState(0);
  const [orgdata, setorgdata] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setusername] = useState('');
  const [usernamefocus, setusernameFocus] = useState(false);
  const customestyleusername = usernamefocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [Contact, setContact] = useState('');
  const [Contactfocus, setContactFocus] = useState(false);
  const customestyleContact = Contactfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [Email, setEmail] = useState('');
  const [Emailfocus, setEmailFocus] = useState(false);
  const customestyleEmail = Emailfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [Password, setPassword] = useState('');
  const [Passwordfocus, setPasswordFocus] = useState(false);
  const customestylePassword = Passwordfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [Address, setAddress] = useState('');
  const [confirmationVisible, setconfirmationVisible] = useState(false);
  const [errorVisible, seterrorVisible] = useState(false);
  const [successVisible, setsuccessVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectterms, setselectterms] = useState(false);
  const CancelClick = () => {
    setconfirmationVisible(true);
  };
  const [permissionVisible, setpermissionVisible] = useState(false);
  const hidepermission = () => {
    setpermissionVisible(false);
  };
  const confirmpermission = () => {
    setpermissionVisible(false);
    Linking.openSettings();
  };
  const hide = () => {
    setconfirmationVisible(false);
  };
  const OK = () => {
    seterrorVisible(false);
  };
  const confirm = () => {
    setconfirmationVisible(false);
    props.navigation.navigate('BMT');
  };
  const successhide = () => {
    setsuccessVisible(false);
    props.navigation.navigate('BMT');
  };
  const cities = [
    {id: 1, name: 'Lahore'},
    {id: 2, name: 'Islamabad'},
    {id: 3, name: 'Karachi'},
    {id: 4, name: 'Faisalabad'},
    {id: 5, name: 'Bahawalpur'},
  ];
  /***************************************** camera permission ****************************************/
  const requestCameraPermission = async () => {
    check(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    )
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            request(
              Platform.OS === 'ios'
                ? PERMISSIONS.IOS.CAMERA
                : PERMISSIONS.ANDROID.CAMERA,
            ).then(result => {
              console.log(result);
              if (result == 'granted') {
                launchCamera(
                  {
                    mediaType: 'photo',
                    includeBase64: true,
                    maxHeight: 100,
                    maxWidth: 100,
                  },
                  response => {
                    response.assets != undefined
                      ? setimg(response.assets)
                      : setimg('');
                  },
                );
              }
            });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            launchCamera(
              {
                mediaType: 'photo',
                includeBase64: true,
                maxHeight: 100,
                maxWidth: 100,
              },
              response => {
                response.assets != undefined
                  ? setimg(response.assets)
                  : setimg('');
              },
            );
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            setpermissionVisible(true);
            break;
        }
      })
      .catch(error => {
        // …
      });
  };
  /*************************************************** useEffect **************************************/
  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == false) {
        Toast.showWithGravity(
          'Please connect internet',
          Toast.LONG,
          Toast.CENTER,
        );
        return;
      }
    });
    //setorgdata(global.OrgData);
    //setorgdata(orgdata => [...orgdata, {"id": 1,"name": "App user"}]);
    //setorgdata(orgdata => [...orgdata, {"id": 1,"name": "App user"}]);
    getdata();
  }, []);
  function getdata() {
    AsyncStorage.getItem('OrgInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata != null) {
        let Asyncdata = JSON.parse(res);
        //setorgdata(orgdata => [...Asyncdata, {"id": 0,"name": "Select Organization"}]);
        setorgdata(Asyncdata);
        //setOrganizationId(Asyncdata[0].orgid);
        //console.log('Asyncdata OrgInformation  ',Asyncdata);
      }
    });
  }
  /************************************************************* submit data **********************************************************/
  function submit() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let usernameRegex = /^[a-zA-Z0-9_@.]{3,25}$/;
    if (username.trim() == '') {
      Toast.showWithGravity(
        'Please enter "User name"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (usernameRegex.test(username.trim()) === false) {
      Toast.showWithGravity(
        'User Name is not correct',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (Email.trim() == '') {
      Toast.showWithGravity('Please enter "Email"', Toast.LONG, Toast.CENTER);
      return;
    }
    if (Contact.trim() == '') {
      Toast.showWithGravity('Please enter "Contact"', Toast.LONG, Toast.CENTER);
      return;
    }
    if (reg.test(Email.trim()) === false) {
      Toast.showWithGravity('Email is not correct', Toast.LONG, Toast.CENTER);
      return;
    }
    if (cityindex == -1) {
      Toast.showWithGravity('Please select "City"', Toast.LONG, Toast.CENTER);
      return;
    }
    if (Password.trim() == '') {
      Toast.showWithGravity(
        'Please enter "Password"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (selectterms == false) {
      Toast.showWithGravity(
        'For signup , you must need to agree with terms & contents policy.',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    setspinner(true);
    //messaging()
    //.getToken()
    //.then((fcmToken) => {
    //let uniqueId = DeviceInfo.getUniqueId();
    // console.log('img',img[0].type);
    const data = new FormData();
    if (img != '') {
      data.append('profiles', {
        name: img[0].fileName,
        uri: img[0].uri,
        type: img[0].type,
      });
      console.log('data ', data);
    } else {
      data.append('profiles', null);
    }

    data.append('id', 0);
    data.append('orgid', orgdata[orgindex].id);
    data.append('firstname', firstName);
    data.append('lastname', lastName);
    data.append('username', username);
    data.append('Contact', Contact);
    data.append('email', Email);
    data.append('CityId', cities[cityindex].id);
    data.append('password', Base64.btoa(Password.trim()));
    data.append('roleid', 5);
    data.append('fmctoken', '');
    data.append('IM', '');
    data.append('regsource', '1');
    data.append('SecurityToken', '');
    data.append('status', 1);
    console.log('formData addupdatestore', data);
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
    fetch(servicesettings.baseuri + 'addupdateorguser', ImageheaderFetch)
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson addupdateorguser', responseJson);
        if (responseJson.status == true) {
          Toast.show('Save successfully');
          props.navigation.navigate('Home');
        } else {
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
        }
        setspinner(false);
      })
      .catch(error => {
        //*************************** need to some disscuss *****************************/
        console.error('error', error);
        setspinner(false);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        return;
      });
    // });
  }
  const TermsAndConditionsClose = () => {
    setModalVisible(false);
  };
  /******************************************************************  views  *****************************************************/
  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x: 0, y: 0}}
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.backgroundColor},
      ]}
      scrollEnabled={true}>
      <View
        Style={[styles.container, {backgroundColor: theme.backgroundColor}]}>
        <ScrollView>
          <Spinner
            visible={spinner}
            textContent={'Submitting...'}
            textStyle={{color: '#FFF'}}
          />
          <TermsAndConditions
            modalVisible={modalVisible}
            TermsAndConditionsClose={
              TermsAndConditionsClose
            }></TermsAndConditions>
          <Alert
            massagetype={'warning'}
            hide={hidepermission}
            confirm={confirmpermission}
            Visible={permissionVisible}
            alerttype={'confirmation'}
            Title={'Confirmation'}
            Massage={'"BDMT" Would like to access camera ?'}></Alert>
          <Alert
            massagetype={'warning'}
            hide={hide}
            confirm={confirm}
            Visible={confirmationVisible}
            alerttype={'confirmation'}
            Title={'Confirmation'}
            Massage={'Do you want to Discard ?'}></Alert>
          <Alert
            massagetype={'warning'}
            OK={successhide}
            Visible={successVisible}
            alerttype={'error'}
            Title={'Submit'}
            Massage={'User registered successfully'}></Alert>
          <Alert
            massagetype={'error'}
            OK={OK}
            Visible={errorVisible}
            alerttype={'error'}
            Title={'Error'}
            Massage={'Email already has been taken!'}></Alert>
          <View style={styles.ProfileImgView}>
            <TouchableOpacity
              selectable={true}
              onPress={() => requestCameraPermission()}>
              <Image
                source={
                  img == '' || img == undefined
                    ? profileIcon
                    : {uri: 'data:image/png;base64,' + img[0].base64}
                }
                style={styles.ProfileStyle}
              />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholderTextColor={theme.placeholderColor}
            style={[
              customestyleusername,
              {backgroundColor: theme.inputBackColor, color: theme.textColor},
            ]}
            value={firstName}
            onChangeText={value => setFirstName(value)}
            placeholder="First name"
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
            KeyboardType={'name'}
            maxLength={50}
          />
          <TextInput
            placeholderTextColor={theme.placeholderColor}
            style={[
              customestyleusername,
              {backgroundColor: theme.inputBackColor, color: theme.textColor},
            ]}
            value={lastName}
            onChangeText={value => setLastName(value)}
            placeholder="Last name"
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
            KeyboardType={'name'}
            maxLength={50}
          />
          <TextInput
            placeholderTextColor={theme.placeholderColor}
            style={[
              customestyleusername,
              username == '' ? styles.mandatoryControl : null,
              ,
              {backgroundColor: theme.inputBackColor, color: theme.textColor},
            ]}
            value={username}
            onChangeText={value => setusername(value)}
            onEndEditing={() => setusernameFocus(false)}
            onFocus={() => setusernameFocus(true)}
            placeholder="User name"
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
            KeyboardType={'name'}
            maxLength={50}
          />
          <TextInput
            placeholderTextColor={theme.placeholderColor}
            value={Email}
            onChangeText={value => setEmail(value)}
            onEndEditing={() => setEmailFocus(false)}
            onFocus={() => setEmailFocus(true)}
            style={[
              customestyleEmail,
              Email == '' ? styles.mandatoryControl : null,
              ,
              {backgroundColor: theme.inputBackColor, color: theme.textColor},
            ]}
            placeholder="Email"
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
            maxLength={40}
          />
          <TextInput
            placeholderTextColor={theme.placeholderColor}
            style={[
              customestyleContact,
              Contact == '' ? styles.mandatoryControl : null,

              {backgroundColor: theme.inputBackColor, color: theme.textColor},
            ]}
            value={Contact}
            onChangeText={value => setContact(value)}
            onEndEditing={() => setContactFocus(false)}
            onFocus={() => setContactFocus(true)}
            placeholder="Contact"
            clearTextOnFocus={false}
            keyboardAppearance={'dark'}
            KeyboardType={'phone-pad'}
            maxLength={50}
          />
          <Dropdown
            placeholderTextColor={theme.placeholderColor}
            onSelect={value => setorgindex(value)}
            selectedIndex={orgindex}
            style={[
              styles.Pickerstyle,
              {backgroundColor: theme.inputBackColor, color: theme.textColor},
            ]}
            items={orgdata.sort(function (obj1, obj2) {
              return obj1.id - obj2.id;
            })}
            placeholder="Select organization..."
            selectedItemViewStyle={colors.red}
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
            maxLength={5}
          />
          <Dropdown
            placeholderTextColor={theme.placeholderColor}
            onSelect={value => setcityindex(value)}
            selectedIndex={cityindex}
            style={[
              styles.Pickerstyle,
              styles.mandatoryControl,
              {backgroundColor: theme.inputBackColor, color: theme.textColor},
            ]}
            items={cities.sort(function (obj1, obj2) {
              return obj1.id - obj2.id;
            })}
            placeholder="Select City..."
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
            maxLength={5}
          />
          <View
            style={[
              customestylePassword,
              Password == '' ? styles.mandatoryControl : null,
              ,
              {backgroundColor: theme.inputBackColor, color: theme.textColor},
            ]}>
            <TextInput
              placeholderTextColor={theme.placeholderColor}
              value={Password}
              onChangeText={value => setPassword(value)}
              onEndEditing={() => setPasswordFocus(false)}
              onFocus={() => setPasswordFocus(true)}
              secureTextEntry={true}
              style={[
                styles.FieldText,
                {backgroundColor: theme.inputBackColor, color: theme.textColor},
              ]}
              placeholder="Password"
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              maxLength={40}
            />
          </View>
          <View style={styles.termsView}>
            <CheckBox
              value={selectterms}
              style={{height: 18, width: 18, margin: 5}}
              onValueChange={value => setselectterms(value)}
              lineWidth={1.0}
              boxType={'square'}
              tintColors={{true: colors.TextColor}}
            />
            <Text style={styles.lable}>Agree with,</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.lable2}> Terms & Conditions (EULA)</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.ButtonView}>
            <Button
              style={[styles.btnCancel, {flexBasis: '47%'}]}
              bgColor={theme.buttonBackColor}
              caption="Cancel"
              onPress={() => CancelClick()}
            />
            <Button
              style={[styles.btnSubmit, {flexBasis: '47%'}]}
              bgColor={theme.buttonBackColor}
              caption="Submit"
              onPress={() => submit()}
            />
          </View>
        </ScrollView>
      </View>
    </KeyboardAwareScrollView>
  );
}
/******************************************************** styles *************************************************/
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    //backgroundColor: colors.BlazorBg,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'space-around',
    justifyContent: 'center',
  },
  ProfileImgView: {
    alignItems: 'center',
    paddingBottom: '2%',
    paddingTop: '1%',
    justifyContent: 'space-around',
    // marginTop: 2 + '%',
  },
  ProfileStyle: {
    height: 90,
    width: 90,
    borderRadius: 90,
    marginTop: 12,
    borderColor: colors.profileBorderColor,
    borderWidth: 2,
  },
  btnCancel: {
    height: 45,
    borderRadius: 5,
    borderWidth: 0,
  },
  btnSubmit: {
    height: 45,
    borderRadius: 5,
    borderWidth: 0,
  },
  ButtonView: {
    marginTop: 8,
    width: Dimensions.get('window').width - 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  FieldText: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    //backgroundColor: colors.red,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 107.8,
    marginLeft: 0,
    borderColor: colors.borderColor,
    borderWidth: 0,
  },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4 + '%',
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 1,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleOnFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4 + '%',
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 2,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  mandatoryControl: {
    borderWidth: 1,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.mandatoryColor,
  },
  termsView: {
    flexDirection: 'row',
    marginVertical: 8,
    //   justifyContent: 'center',
  },
  lable: {
    marginLeft: 12,
    marginTop: 5,
    color: colors.TextColor,
    fontSize: 14,
    fontWeight: 'bold',
  },
  lable2: {
    marginTop: 5,
    color: colors.TextColor,
    fontSize: 14,
    fontWeight: 'bold',
  },
  Pickerstyle: {
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 4,
    width: Dimensions.get('window').width - 50,
    height: 46,
    color: '#ffffff',
    fontSize: 15,
    marginTop: 3 + '%',
    fontWeight: 'bold',
    //  textAlign: 'center',
  },
  sectionStyleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2 + '%',
    height: 100,
    fontSize: 16,
    color: colors.red,
    width: Dimensions.get('window').width - 50,
    borderWidth: 1,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  FieldTextTitle: {
    height: 95,
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    borderColor: colors.TextBoxContainer,
    backgroundColor: colors.TextBoxContainer,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 70,
    marginLeft: 0,
  },
});

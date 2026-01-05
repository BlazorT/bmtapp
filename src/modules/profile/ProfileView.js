import CheckBox from '@react-native-community/checkbox';
import NetInfo from '@react-native-community/netinfo';
import Base64 from 'Base64';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import { PERMISSIONS, RESULTS, check, request } from 'react-native-permissions';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';
import { Button, Dropdown } from '../../components';
import Alert from '../../components/Alert';
import TermsAndConditions from '../../components/Terms&Conditions';
import { useTheme } from '../../hooks/useTheme';
import { colors } from '../../styles';
import servicesettings from '../dataservices/servicesettings';
import { useUser } from '../../hooks/useUser';
import { isTab } from '../../constants';
const profileIcon = require('../../../assets/images/defaultUser.png');
//import messaging from '@react-native-firebase/messaging';
export default function VehicalSallerScreen(props) {
  const { loginUser } = useUser();
  const lovs = useSelector(state => state.lovs).lovs;
  const theme = useTheme();
  const [spinner, setspinner] = useState(false);
  const [img, setimg] = useState('');
  const [cityindex, setcityindex] = useState(-1);
  const [orgindex, setorgindex] = useState('');
  const [orgdata, setorgdata] = useState([]);
  const [orgname, setorgname] = useState(''); // NEW: for custom org name
  const [showOrgDropdown, setshowOrgDropdown] = useState(false); // NEW: control dropdown visibility
  const [filteredOrgData, setfilteredOrgData] = useState([]); // NEW: filtered results
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
    props.navigation.replace('Blazor Media ToolKit');
  };
  const successhide = () => {
    setsuccessVisible(false);
    props.navigation.navigate('Blazor Media ToolKit');
  };
  const cities = [
    { id: 1, name: 'Lahore' },
    { id: 2, name: 'Islamabad' },
    { id: 3, name: 'Karachi' },
    { id: 4, name: 'Faisalabad' },
    { id: 5, name: 'Bahawalpur' },
  ];
  /***************************************** camera permission ****************************************/
  const requestCameraPermission = async () => {
    try {
      const permissionType =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;

      const result = await check(permissionType);

      const handleLaunchCamera = () => {
        launchCamera(
          {
            mediaType: 'photo',
            includeBase64: true,
            maxHeight: 100,
            maxWidth: 100,
          },
          response => {
            setimg(response.assets ? response.assets : '');
          },
        );
      };

      switch (result) {
        case RESULTS.UNAVAILABLE:
          break;
        case RESULTS.DENIED:
          const requestResult = await request(permissionType);
          if (requestResult === 'granted') {
            handleLaunchCamera();
          }
          break;
        case RESULTS.LIMITED:
          break;
        case RESULTS.GRANTED:
          handleLaunchCamera();
          break;
        case RESULTS.BLOCKED:
          setpermissionVisible(true);
          break;
        default:
          break;
      }
    } catch (error) {
      // Handle error
    }
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
    getdata();
  }, []);

  function getdata() {
    const orgs = lovs['orgs'];
    setorgdata(orgs);
    setfilteredOrgData(orgs);
  }
  // Handle custom organization name input with search filter
  const handleOrgNameChange = text => {
    setorgname(text);
    setorgindex(''); // Clear selection when typing custom name

    // Filter organization data based on input
    if (text.trim() === '') {
      setfilteredOrgData(orgdata);
    } else {
      const filtered = orgdata.filter(org =>
        org.name.toLowerCase().includes(text.toLowerCase()),
      );
      setfilteredOrgData(filtered);
    }
  };

  // Handle organization selection from dropdown
  const handleOrgSelect = (selectedOrg, index) => {
    setorgindex(index);
    setorgname(selectedOrg.name);
    setshowOrgDropdown(false);
  };

  /************************************************************* submit data **********************************************************/
  async function submit() {
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
    if (orgindex === '' && orgname.trim() === '') {
      Toast.showWithGravity(
        'Please select or enter an organization',
        Toast.LONG,
        Toast.CENTER,
      );
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
    //
    let imageUrlOrg = '';
    const data = new FormData();
    if (img != '') {
      data.append('file', {
        name: img[0].fileName,
        uri: img[0].uri,
        type: img[0].type,
      });
      setspinner(true);

      try {
        const res = await fetch(
          servicesettings.baseuri + 'BlazorApi/uploadsingleattachment',
          {
            method: 'post',
            body: data,
            headers: {
              Authorization: servicesettings.AuthorizationKey,
            },
          },
        );
        if (!res.ok) {
          const err = new Error(`Request failed with status : ${res.status}`);
          throw err;
        }
        const response = await res?.json();
        imageUrlOrg =
          response?.data
            ?.replace(/^\\\\?wwwroot[\\/]/, '')
            .replace(/\\/g, '/') || '';
      } catch (error) {
        Toast.showWithGravity(
          error?.message || 'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        return;
      } finally {
        setspinner(false);
      }
    }

    const bodyUser = {
      id: 0,
      OrgId: orgindex !== '' ? orgdata[orgindex].id : 0, // 0 if custom name
      OrgName: orgname,
      FirstName: firstName,
      LastName: lastName,
      UserName: username,
      Contact: Contact,
      Email: Email,
      CityId: cities[cityindex].id,
      Address: cities[cityindex].name,
      Password: Base64.btoa(Password.trim()),
      RoleId: orgindex !== '' ? 4 : 2, //!!if organization is selected then its public user other wise for new org its admin
      Ims: '',
      RegistrationSource: 1,
      SecurityToken: '',
      Status: 1,
      Avatar: imageUrlOrg,
      UserCode: '',
    };
    console.log({ bodyUser });
    var ImageheaderFetch = {
      method: 'post',
      body: JSON.stringify(bodyUser),
      headers: {
        Authorization: servicesettings.AuthorizationKey,
        'Content-Type': 'application/json',
      },
    };
    fetch(servicesettings.baseuri + 'BlazorApi/updateuser', ImageheaderFetch)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Request failed with status : ${response.status}`);
        }
        return response.json();
      })
      .then(responseJson => {
        console.log({ responseJson });
        if (responseJson.status == true) {
          Toast.show(
            `${responseJson.data.firstName} ${responseJson.data.lastName} has been added successfully`,
          );
          const userInfo = {
            ...responseJson.data,
            orgid: responseJson.data.orgId,
          };
          loginUser(userInfo);
          props.navigation.replace('Home');
        } else {
          Toast.showWithGravity(
            responseJson?.message ||
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
          error?.message || 'Internet connection failed, try another time !!!',
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.backgroundColor },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Spinner
          visible={spinner}
          textContent={'Submitting...'}
          textStyle={{ color: '#FFF' }}
        />
        <TermsAndConditions
          modalVisible={modalVisible}
          TermsAndConditionsClose={TermsAndConditionsClose}
        ></TermsAndConditions>
        <Alert
          massagetype={'warning'}
          hide={hidepermission}
          confirm={confirmpermission}
          Visible={permissionVisible}
          alerttype={'confirmation'}
          Title={'Confirmation'}
          Massage={'"BDMT" Would like to access camera ?'}
        ></Alert>
        <Alert
          massagetype={'warning'}
          hide={hide}
          confirm={confirm}
          Visible={confirmationVisible}
          alerttype={'confirmation'}
          Title={'Confirmation'}
          Massage={'Do you want to Discard ?'}
        ></Alert>
        <Alert
          massagetype={'warning'}
          OK={successhide}
          Visible={successVisible}
          alerttype={'error'}
          Title={'Submit'}
          Massage={'User registered successfully'}
        ></Alert>
        <Alert
          massagetype={'error'}
          OK={OK}
          Visible={errorVisible}
          alerttype={'error'}
          Title={'Error'}
          Massage={'Email already has been taken!'}
        ></Alert>
        <View style={styles.ProfileImgView}>
          <TouchableOpacity
            selectable={true}
            onPress={() => requestCameraPermission()}
          >
            <Image
              source={
                img == '' || img == undefined
                  ? profileIcon
                  : { uri: 'data:image/png;base64,' + img[0].base64 }
              }
              style={styles.ProfileStyle}
            />
          </TouchableOpacity>
        </View>

        {/* Form Fields - Responsive Layout */}
        {isTab ? (
          // Tablet Layout - 2 inputs per row
          <>
            <View style={[styles.rowContainer]}>
              <TextInput
                placeholderTextColor={theme.placeholderColor}
                style={[
                  customestyleusername,
                  styles.halfWidth,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
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
                  styles.halfWidth,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
                value={lastName}
                onChangeText={value => setLastName(value)}
                placeholder="Last name"
                clearTextOnFocus={true}
                keyboardAppearance={'dark'}
                KeyboardType={'name'}
                maxLength={50}
              />
            </View>

            <View style={styles.rowContainer}>
              <TextInput
                placeholderTextColor={theme.placeholderColor}
                style={[
                  customestyleusername,
                  styles.halfWidth,
                  username == '' ? styles.mandatoryControl : null,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
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
                  styles.halfWidth,
                  Email == '' ? styles.mandatoryControl : null,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
                placeholder="Email"
                clearTextOnFocus={true}
                keyboardAppearance={'dark'}
                maxLength={40}
              />
            </View>

            <View style={styles.rowContainer}>
              <TextInput
                placeholderTextColor={theme.placeholderColor}
                style={[
                  customestyleContact,
                  styles.halfWidth,
                  Contact == '' ? styles.mandatoryControl : null,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
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
              <View
                style={[
                  customestylePassword,
                  Password == '' ? styles.mandatoryControl : null,
                  styles.halfWidth,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
              >
                <TextInput
                  placeholderTextColor={theme.placeholderColor}
                  value={Password}
                  onChangeText={value => setPassword(value)}
                  onEndEditing={() => setPasswordFocus(false)}
                  onFocus={() => setPasswordFocus(true)}
                  secureTextEntry={true}
                  style={[
                    styles.FieldText,
                    styles.halfWidth,
                    {
                      backgroundColor: theme.inputBackColor,
                      color: theme.textColor,
                    },
                  ]}
                  placeholder="Password"
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  maxLength={40}
                />
              </View>
            </View>

            <View style={styles.rowContainer}>
              <View style={styles.halfWidth}>
                <View
                  style={[
                    customestyleusername,
                    {
                      backgroundColor: theme.inputBackColor,
                      color: theme.textColor,
                      paddingHorizontal: 0,
                    },
                  ]}
                >
                  <TextInput
                    placeholderTextColor={theme.placeholderColor}
                    style={[
                      styles.FieldText,
                      {
                        backgroundColor: theme.inputBackColor,
                        color: theme.textColor,
                        flex: 1,
                      },
                    ]}
                    value={orgname}
                    onChangeText={handleOrgNameChange}
                    onFocus={() => setshowOrgDropdown(true)}
                    placeholder="Select or type organization..."
                    clearTextOnFocus={false}
                    keyboardAppearance={'dark'}
                    maxLength={50}
                  />
                  {showOrgDropdown && filteredOrgData.length > 0 && (
                    <View
                      style={[
                        styles.dropdownList,
                        { backgroundColor: theme.buttonBackColor },
                      ]}
                    >
                      <ScrollView style={{ maxHeight: 150 }}>
                        {filteredOrgData.map((org, index) => (
                          <TouchableOpacity
                            key={index}
                            onPress={() => handleOrgSelect(org, index)}
                            style={styles.dropdownItem}
                          >
                            <Text style={{ color: theme.textColor }}>
                              {org.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.halfWidth}>
                <Dropdown
                  placeholderTextColor={theme.placeholderColor}
                  onSelect={value => setcityindex(value)}
                  selectedIndex={cityindex}
                  style={[
                    styles.Pickerstyle,
                    styles.mandatoryControl,
                    {
                      backgroundColor: theme.inputBackColor,
                      color: theme.textColor,
                    },
                  ]}
                  items={cities.sort(function (obj1, obj2) {
                    return obj1.id - obj2.id;
                  })}
                  placeholder="Select City..."
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  maxLength={5}
                />
              </View>
            </View>
          </>
        ) : (
          // Mobile Layout - Single column
          <>
            <TextInput
              placeholderTextColor={theme.placeholderColor}
              style={[
                customestyleusername,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
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
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
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
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
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
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
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

                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
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
            <View
              style={[
                customestyleusername,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                  paddingHorizontal: 0,
                  position: 'relative',
                },
              ]}
            >
              <TextInput
                placeholderTextColor={theme.placeholderColor}
                style={[
                  styles.FieldText,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
                value={orgname}
                onChangeText={handleOrgNameChange}
                onFocus={() => setshowOrgDropdown(true)}
                placeholder="Select or type organization..."
                clearTextOnFocus={false}
                keyboardAppearance={'dark'}
                maxLength={50}
              />
              {showOrgDropdown && filteredOrgData.length > 0 && (
                <View
                  style={[
                    styles.dropdownList,
                    { backgroundColor: theme.modalBackColor },
                  ]}
                >
                  <ScrollView style={{ maxHeight: 150 }}>
                    {filteredOrgData.map((org, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleOrgSelect(org, index)}
                        style={styles.dropdownItem}
                      >
                        <Text style={{ color: theme.textColor }}>
                          {org.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
            <Dropdown
              placeholderTextColor={theme.placeholderColor}
              onSelect={value => setcityindex(value)}
              selectedIndex={cityindex}
              style={[
                styles.Pickerstyle,
                styles.mandatoryControl,
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
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
                {
                  backgroundColor: theme.inputBackColor,
                  color: theme.textColor,
                },
              ]}
            >
              <TextInput
                placeholderTextColor={theme.placeholderColor}
                value={Password}
                onChangeText={value => setPassword(value)}
                onEndEditing={() => setPasswordFocus(false)}
                onFocus={() => setPasswordFocus(true)}
                secureTextEntry={true}
                style={[
                  styles.FieldText,
                  {
                    backgroundColor: theme.inputBackColor,
                    color: theme.textColor,
                  },
                ]}
                placeholder="Password"
                clearTextOnFocus={true}
                keyboardAppearance={'dark'}
                maxLength={40}
              />
            </View>
          </>
        )}

        <View style={styles.termsView}>
          <CheckBox
            value={selectterms}
            style={{
              // height: 18,
              // width: 18,
              // margin: 5,
              transform: [{ scale: Platform.OS === 'ios' ? 0.8 : 1.2 }],
            }}
            onValueChange={value => setselectterms(value)}
            lineWidth={1.0}
            boxType={'square'}
            tintColors={{
              true: theme.selectedCheckBox,
              false: theme.buttonBackColor,
            }}
          />
          <Text style={styles.lable}>Agree with,</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.lable2}> Terms & Conditions (EULA)</Text>
          </TouchableOpacity>
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
            onPress={() => submit()}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
/******************************************************** styles *************************************************/
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 20,
    flexGrow: 1,
    rowGap: 10,
    columnGap: 10,
  },
  ProfileImgView: {
    alignItems: 'center',
    justifyContent: 'space-around',
    // marginTop: 2 + '%',
  },
  ProfileStyle: {
    height: 90,
    width: 90,
    borderRadius: 90,
    // marginTop: 12,
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
    // marginTop: 4 + '%',
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: '100%',
    borderWidth: 1,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleOnFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 4 + '%',
    height: 46,
    fontSize: 16,
    width: '100%',
    color: colors.TextBoxColor,
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
  dropdownList: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
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
    // paddingHorizontal: 15,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 4,
    width: '100%',
    height: 46,
    color: '#ffffff',
    fontSize: 15,
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
  // New styles for tablet layout
  rowContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '49%',
  },
});

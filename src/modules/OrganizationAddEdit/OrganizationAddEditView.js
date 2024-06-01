import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import NetInfo from '@react-native-community/netinfo';
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
import Spinner from 'react-native-loading-spinner-overlay';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Toast from 'react-native-simple-toast';
import {Button, Dropdown, TextInput} from '../../components';
import Alert from '../../components/Alert';
import TermsAndConditions from '../../components/Terms&Conditions';
import {colors} from '../../styles';
import servicesettings from '../dataservices/servicesettings';
const DownArrowIcon = require('../../../assets/images/downarrow.png');
const UpArrowIcon = require('../../../assets/images/uparrow.png');
const profileIcon = require('../../../assets/images/defaultUser.png');
const arrowback = require('../../../assets/images/icons/BackArrow.png');
//import messaging from '@react-native-firebase/messaging';
const CurrentDate = new Date();
var filterID = null;
export default function OrganizationAddEditScreen(props) {
  //console.log('props new ' + JSON.stringify(props));
  const [spinner, setspinner] = useState(false);
  const [img, setimg] = useState('');
  const [EditImgURI, setEditImgURI] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebookId, setFacebookId] = useState('');
  const [instagramId, setInstagramId] = useState('');
  const [iban, setIban] = useState('');
  const [cityindex, setcityindex] = useState(-1);
  const [orgindex, setorgindex] = useState(0);
  const [orgdata, setorgdata] = useState([]);
  const [orgName, setOrgName] = useState('');
  const [orgNamefocus, setOrgNameFocus] = useState(false);
  const [SelectAreaEnabled, setSelectAreaEnabled] = useState(false);
  const customestyleOrgName = orgNamefocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [Contact, setContact] = useState('');
  const [Contactfocus, setContactFocus] = useState(false);
  const customestyleContact = Contactfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [Email, setEmail] = useState('');
  const [strength, setStrength] = useState('');
  const [selectCountryVal, setSelectCountryVal] = useState('');
  const [selectCountryId, setSelectCountryId] = useState('');
  const [selectCityName, setSelectCityName] = useState('');
  const [selectCityId, setSelectCityId] = useState('');
  const [selectCityVal, setSelectCityVal] = useState('');
  const [selectCountry, setSelectCountry] = useState('');
  const [selectState, setSelectState] = useState('');
  const [Emailfocus, setEmailFocus] = useState(false);
  const customestyleEmail = Emailfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [Password, setPassword] = useState('');
  const [StateIndex, setStateIndex] = useState('');
  const [CityIndex, setCityIndex] = useState('');
  const [cityArray, setCityArray] = useState('');
  const [Cities, setCities] = useState('');
  const [cityNameDetail, setCityNameDetail] = useState([]);
  const [CityDataList, setCityDataList] = useState([]);
  const [onlyState, setOnlyState] = useState([]);
  const [SelectCity, setSelectCity] = useState([]);
  const [stateId, setStateId] = useState('');
  const [cityNameAdd, setCityNameAdd] = useState('');
  const [selectedItems, setSelectedItems] = useState('');

  //const [cityNameDetail, setCityNameDetail] = useState('');
  const [CurrencyItem, setCurrencyItem] = useState('');
  const [packagesList, setPackagesList] = useState('');
  const [stateList, setStateList] = useState('');
  const [statusItem, setStatusItem] = useState('');
  const [currencySelectedId, setCurrencySelectedId] = useState('');
  const [selectedCurrencyId, setSelectedCurrencyId] = useState('');
  const [statusSelectedId, setStatusSelectedId] = useState('0');
  //const [packageSelectedId, setPackageSelectedId] = useState('0');
  //const [selectedPackageId, setSelectedPackageId] = useState('');
  const [selectedStatusId, setSelectedStatusId] = useState('');
  const [editOrgId, setEditOrgId] = useState('');
  const [userId, setUserId] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [Passwordfocus, setPasswordFocus] = useState(false);
  const customestylePassword = Passwordfocus
    ? styles.sectionStyleOnFocus
    : styles.sectionStyle;
  const [orgAddress, setOrgAddress] = useState('');
  const [confirmationVisible, setconfirmationVisible] = useState(false);
  const [EditconfirmationVisible, setEditconfirmationVisible] = useState(false);
  const [errorVisible, seterrorVisible] = useState(false);
  const [successVisible, setsuccessVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [SelectSocialAreaEnabled, setSelectSocialAreaEnabled] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [selectterms, setselectterms] = useState(false);
  const CancelClick = () => {
    setconfirmationVisible(true);
  };
  const CancelEditClick = () => {
    setEditconfirmationVisible(true);
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
  const Edithide = () => {
    setEditconfirmationVisible(false);
    props.navigation.navigate('BMT');
  };
  const OK = () => {
    seterrorVisible(false);
  };
  const confirm = () => {
    setconfirmationVisible(false);
    props.navigation.navigate('BMT');
  };
  const Editconfirm = () => {
    setEditconfirmationVisible(false);
    LoadOrganization();
  };
  const successhide = () => {
    setsuccessVisible(false);
    EditClick();
  };
  const containerStyle = {padding: 0, minHeight: 46, maxHeight: 200};
  //const containerStyle={padding: 0,backgroundColor: colors.InputControlBackColor,color:'white', borderRadius:6, marginTop:12,}
  const textInputStyle = {
    fontSize: 14,
    color: 'black',
    paddingLeft: 2,
    backgroundColor: colors.InputControlBackColor,
    width: Dimensions.get('window').width - 48,
    borderRadius: 4,
    height: 42,
    //paddingLeft:14,
    marginTop: 5,
    borderColor: colors.InputControlBorderColor,
  };
  const itemStyle = {
    padding: 10,
    marginTop: 2,
    backgroundColor: colors.InputControlBackColor,
  };
  const itemTextStyle = {
    color: 'black',
  };
  const itemsContainerStyle = {
    width: Dimensions.get('window').width - 48,
    paddingLeft: 2,
    backgroundColor: colors.InputControlBackColor,
    // backgroundColor: 'green',
    zIndex: 2,
    color: 'black',
  };
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
    cityNameAdd;
    console.log('cityNameAdd ', cityNameAdd);
    LoginInfoLoad();
    getdata();
    CitiesLoad();
    getAllStatesData();
    getAllPackagesData();
    getAllCurrencyData();
    getAllStatusData();
    EditClick();
  }, []);
  function CitiesLoad() {
    var headerFetch = {
      method: 'POST',
      // body: null,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    console.log('headerFetch from bmtcities ', headerFetch);
    fetch(servicesettings.baseuri + 'bmtcities', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        setCityNameDetail(responseJson.data);
      })
      .catch(error => {
        console.error(error);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
      });
  }

  function EditClick() {
    setEditconfirmationVisible(true);
  }
  function LoadOrganization() {
    setspinner(true);
    if (organizationId == '') {
      var UserOrgId = global.ORGANIZATIONID;
    } else {
      var UserOrgId = organizationId;
    }
    var headerFetch = {
      method: 'POST',
      body: JSON.stringify({id: UserOrgId, Name: '', Status: 1}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    console.log('headerFetch from orgs', headerFetch.body);
    fetch(servicesettings.baseuri + 'orgs', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        //console.log("data response orgnization orgs =>",responseJson);
        if (responseJson.data != null) {
          var EditOrg = responseJson.data[0];
          console.log('data response orgnization EditOrg  ', EditOrg);
          var defaultImage = 'compaignImages//16271.jpg';
          var EditImg =
            servicesettings.Imagebaseuri +
            defaultImage
              .replace(/\\/g, '/')
              .replace(',', '')
              .replace(' //', '');
          setEditImgURI(EditImg);
          //setimg(EditOrg.logoAvatar);
          setselectterms(true);
          setEditOrgId(EditOrg.id);
          setOrgName(EditOrg.name);
          setEmail(EditOrg.email);
          setContact(EditOrg.contact);
          setOrgAddress(EditOrg.address);
          var CurrencyVal = EditOrg.currencyId;
          const CurrencySelectedId = CurrencyItem.findIndex(
            item => item.id === CurrencyVal,
          );
          setCurrencySelectedId(CurrencySelectedId);
          setSelectedCurrencyId(CurrencyVal);
          var newid = EditOrg.stateId;
          const StateIndex = stateList.findIndex(item => item.id === newid);
          setSelectCountryVal(StateIndex);
          setSelectCountryId(EditOrg.stateId);
          setSelectCityName(EditOrg.cityName);
          setSelectCityId(EditOrg.cityId);
          var statusId = EditOrg.status;
          const statusSelectIndex = statusItem.findIndex(
            item => item.id === statusId,
          );
          setStatusSelectedId(statusSelectIndex);
          setStrength(EditOrg.strength.toString());
          setWhatsapp(EditOrg.whatsApp);
          setFacebookId(EditOrg.fb);
          setInstagramId(EditOrg.instagram);
          setIban(EditOrg.ibanorWireTransferId);
          //console.log('newid newid newid  new ', newid);

          //console.log('stateList CurrencyItem CurrencyItem  new ', CurrencyItem);
          // console.log('statusSelectIndex statusSelectIndex statusSelectIndex  new ', statusSelectIndex);
          setspinner(false);
        }
      })
      .catch(error => {
        console.error('service error', error);
        setspinner(false);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        //setVisible(false);
      });
  }
  function getdata() {
    AsyncStorage.getItem('OrgInformation').then(function(res) {
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
  function LoginInfoLoad() {
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata != null) {
        let Asyncdata = JSON.parse(res);
        setUserId(Asyncdata[0].id);
        setOrganizationId(Asyncdata[0].orgid);
        global.ORGANIZATIONID = Asyncdata[0].orgid;
        //console.log('Asyncdata LoginInformation  ',Asyncdata);
      } else {
        props.navigation.replace('Login');
      }
    });
  }
  function getAllCurrencyData() {
    AsyncStorage.getItem('AllCurrenciesData').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata != null) {
        let Asyncdata = JSON.parse(res);
        console.log('Asyncdata AllCurrenciesData ' + JSON.stringify(Asyncdata));
        setCurrencyItem(Asyncdata);
      }
    });
  }
  function getAllStatusData() {
    AsyncStorage.getItem('AllStatusData').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata != null) {
        let Asyncdata = JSON.parse(res);
        console.log('Asyncdata AllStatusData ' + JSON.stringify(Asyncdata));
        setStatusItem(Asyncdata);
      }
    });
  }
  function getAllPackagesData() {
    AsyncStorage.getItem('AllPackagesData').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata != null) {
        let Asyncdata = JSON.parse(res);
        console.log('Asyncdata AllPackagesData ' + JSON.stringify(Asyncdata));
        setPackagesList(Asyncdata);
      }
    });
  }
  function getAllStatesData() {
    AsyncStorage.getItem('AllStateListData').then(function(res) {
      let Asyncdata = JSON.parse(res);
      if (Asyncdata != null) {
        let Asyncdata = JSON.parse(res);
        console.log('Asyncdata AllPackagesData ' + JSON.stringify(Asyncdata));
        setStateList(Asyncdata);
      }
    });
  }
  /************************************************************* submit data **********************************************************/
  function submit() {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (orgName.trim() == '') {
      Toast.showWithGravity(
        'Please enter "Organization name"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    if (Contact.trim() == '') {
      Toast.showWithGravity('Please enter "Contact"', Toast.LONG, Toast.CENTER);
      return;
    }
    if (Email.trim() == '') {
      Toast.showWithGravity('Please enter "Email"', Toast.LONG, Toast.CENTER);
      return;
    }
    if (reg.test(Email.trim()) === false) {
      Toast.showWithGravity('Email is not correct', Toast.LONG, Toast.CENTER);
      return;
    }
    console.log('currencySelectedId', currencySelectedId);
    if (currencySelectedId.length == '') {
      Toast.showWithGravity(
        'Please select "Currency"',
        Toast.LONG,
        Toast.CENTER,
      );
      return;
    }
    //if (selectedStatusId.length =='') {Toast.showWithGravity('Please select "Status"',Toast.LONG,Toast.CENTER);return;     }
    if (selectterms.length == '') {
      Toast.showWithGravity('Please select "Status"', Toast.LONG, Toast.CENTER);
      return;
    }
    //if (Password.trim()=="") {Toast.showWithGravity('Please enter "Password"',Toast.LONG,Toast.CENTER);return;}
    //if (selectterms==false) {Toast.showWithGravity('For signup , you must need to agree with terms & contents policy.',Toast.LONG,Toast.CENTER);return; }
    // setspinner(true);
    //messaging()
    //.getToken()
    //.then((fcmToken) => {
    //let uniqueId = DeviceInfo.getUniqueId();
    // console.log('img',img[0].type);
    const data = new FormData();
    if (img != '') {
      data.append('files', {
        name: img[0].fileName,
        uri: img[0].uri,
        type: img[0].type,
      });
      console.log('data ', data);
    } else {
      data.append('files', null);
    }
    if (editOrgId == '') {
      var OrgIdSelect = 0;
    } else {
      var OrgIdSelect = editOrgId;
    }
    data.append('id', OrgIdSelect);
    //data.append('userid', userId);
    data.append('userid', 0);
    data.append('orgname', orgName);
    data.append('contact', Contact);
    data.append('address', orgAddress);
    data.append('email', Email);
    data.append('strength', strength);
    data.append('whatsapp', whatsapp);
    data.append('instagram', instagramId);
    data.append('fb', facebookId);
    data.append('ibanorwiretransferid', iban);
    // data.append('packageid', (selectedPackageId ==''?1:selectedPackageId));
    data.append('currencyid', selectedCurrencyId);
    data.append('stateid', selectCountryId);
    data.append('cityid', selectCityId);
    if (selectCityId == '') {
      data.append('cityname', cityNameAdd);
    } else {
      data.append('cityname', '');
    }
    //data.append('cityname',selectCityName);
    //data.append('roleid',5);
    data.append('status', selectedStatusId == '' ? 1 : selectedStatusId);
    console.log('formData addupdatestore', data);
    var ImageheaderFetch = {
      enctype: 'multipart/form-data',
      processData: false,
      contentType: false,
      cache: false,
      timeout: 600000,
      method: 'POST',
      body: data,
      // body: JSON.stringify({'id':0,'orgname':orgName,'contact':Contact,'address':orgAddress,'email':Email,'whatsapp':whatsapp,'instagram':instagramId,'facebook':facebookId,'iban':iban,'currencyId':selectedCurrencyId,'roleid':5,'status':selectedStatusId}),
      headers: {
        Authorization: servicesettings.AuthorizationKey,
      },
      //headers: {
      //   'Accept': 'application/json',
      //   'Content-Type': 'application/json; charset=utf-8',
      //  'Authorization': servicesettings.AuthorizationKey
      // }
    };
    fetch(servicesettings.baseuri + 'addupdateorg', ImageheaderFetch)
      .then(response => response.json())
      .then(responseJson => {
        console.log('responseJson addupdateorg', responseJson);
        if (responseJson.status == true) {
          //setSubmitmodalVisible(true);
          Toast.show('Save successfully');
          setspinner(false);
          setTimeout(() => {
            props.navigation.navigate('Panel');
          }, 1000);
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
  function CampaignAudienceEnabledClick() {
    setShouldShow(true);
    setSelectSocialAreaEnabled(false);
    if (SelectAreaEnabled == true) {
      setSelectAreaEnabled(false);
    } else {
      setSelectAreaEnabled(true);
    }
  }
  function SocialControlEnabledClick() {
    setSelectAreaEnabled(false);
    if (SelectSocialAreaEnabled == true) {
      setSelectSocialAreaEnabled(false);
    } else {
      setSelectSocialAreaEnabled(true);
    }
  }
  function SelectCurrencyClick(value) {
    setSelectedCurrencyId(CurrencyItem[value].id);
    setCurrencySelectedId(value);
  }
  function SelectStatusClick(value) {
    setSelectAreaEnabled(false);
    setSelectSocialAreaEnabled(false);
    setSelectedStatusId(statusItem[value].id);
    setStatusSelectedId(value);
  }
  function functionCombined() {
    //setShouldShow(!shouldShow);
    setShouldShow(true);
    setSelectSocialAreaEnabled(false);
    if (SelectAreaEnabled == true) {
      setSelectAreaEnabled(false);
    } else {
      setSelectAreaEnabled(true);
    }
  }
  function SelectCountryClick(value) {
    setSelectCityName('');
    setSelectCityId('');
    setSelectCountryVal(value);
    setSelectCountryId(stateList[value].id);
    var SelectedStateId = stateList[value].id;
    FilterCity(SelectedStateId);
  }
  function FilterCity(SelectedStateId) {
    const FilterSelectedStateCity = cityNameDetail.filter(
      item => item.stateId === SelectedStateId,
    );
    setCityDataList(FilterSelectedStateCity);
  }
  function textChangeClick(text) {
    setCityNameAdd(text);
    console.log('text ', text);
    console.log('CityNameAdd ', cityNameAdd);
  }
  function SearchableClick(text) {
    //setCityNameAdd(text);
    console.log('SearchableClick name ', text.name);
    console.log('SearchableClick id ', text.id);
    setSelectCityName(text.name);
    setSelectCityId(text.id);
    functionCombined();
  }
  /******************************************************************  views  *****************************************************/
  return (
    <View style={styles.MainViewContainer}>
      <ScrollView>
        <Spinner
          visible={spinner}
          textContent={'Submitting...'}
          textStyle={{color: '#FFF'}}
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
          Massage={'Do you want to discard ?'}
        ></Alert>
        <Alert
          massagetype={'warning'}
          hide={Edithide}
          confirm={Editconfirm}
          Visible={EditconfirmationVisible}
          alerttype={'confirmation'}
          Title={'Confirmation'}
          Massage={'Do you want to Edit ?'}
        ></Alert>
        <Alert
          massagetype={'warning'}
          OK={successhide}
          Visible={successVisible}
          alerttype={'error'}
          Title={'Submit'}
          Massage={'Organization registered successfully'}
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
            {EditImgURI == '' ? (
              <Image
                source={
                  img == '' || img == undefined
                    ? profileIcon
                    : {uri: 'data:image/png;base64,' + img[0].base64}
                }
                style={styles.ProfileStyle}
              />
            ) : (
              <Image
                source={
                  img == '' || img == undefined
                    ? {uri: EditImgURI}
                    : {uri: 'data:image/png;base64,' + img[0].base64}
                }
                style={styles.ProfileStyle}
              />
            )}
          </TouchableOpacity>
        </View>
        <TextInput
          placeholderTextColor={colors.TextBoxPlaceholderColor}
          style={[
            customestyleOrgName,
            orgName == '' ? styles.mandatoryControl : null,
          ]}
          value={orgName}
          onChangeText={value => setOrgName(value)}
          onEndEditing={() => setOrgNameFocus(false)}
          onFocus={() => setOrgNameFocus(true)}
          placeholder="Organization Name"
          clearTextOnFocus={true}
          keyboardAppearance={'dark'}
          KeyboardType={'name'}
          maxLength={50}
        />
        <TextInput
          placeholderTextColor={colors.TextBoxPlaceholderColor}
          value={Email}
          onChangeText={value => setEmail(value)}
          onEndEditing={() => setEmailFocus(false)}
          onFocus={() => setEmailFocus(true)}
          style={[
            customestyleEmail,
            Email == '' ? styles.mandatoryControl : null,
          ]}
          keyboardType="email-address"
          placeholder="Email"
          clearTextOnFocus={true}
          keyboardAppearance={'dark'}
          maxLength={40}
        />
        <TextInput
          placeholderTextColor={colors.TextBoxPlaceholderColor}
          style={[
            customestyleContact,
            Contact == '' ? styles.mandatoryControl : null,
          ]}
          value={Contact}
          onChangeText={value => setContact(value)}
          onEndEditing={() => setContactFocus(false)}
          onFocus={() => setContactFocus(true)}
          placeholder="Contact"
          clearTextOnFocus={false}
          keyboardAppearance={'dark'}
          keyboardType="phone-pad"
          maxLength={50}
        />
        <TextInput
          multiline={true}
          textAlignVertical="top"
          placeholderTextColor={colors.TextBoxPlaceholderColor}
          style={[
            styles.sectionStyleTitle,
            orgAddress == '' ? styles.mandatoryControl : null,
          ]}
          value={orgAddress}
          onChangeText={value => setOrgAddress(value)}
          placeholder="Address..."
          clearTextOnFocus={true}
          keyboardAppearance={'dark'}
          KeyboardType={'default'}
          maxLength={200}
        />
        <View
          style={{
            flexDirection: 'row',
            paddingTop: 12,
            width: Dimensions.get('window').width - 30,
          }}
        >
          <View style={{width: 53 + '%'}}>
            <Dropdown
              placeholderTextColor={colors.TextBoxPlaceholderColor}
              onSelect={value => SelectCurrencyClick(value)}
              selectedIndex={currencySelectedId}
              style={[styles.PickerstyleRow, styles.mandatoryControl]}
              items={CurrencyItem}
              placeholder="Select Currency..."
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              maxLength={5}
            />
          </View>
          <View style={{marginLeft: 4 + '%', width: 43 + '%'}}>
            <TextInput
              placeholderTextColor={colors.TextBoxPlaceholderColor}
              style={styles.StrengthView}
              value={strength}
              onChangeText={value => setStrength(value)}
              onEndEditing={() => setContactFocus(false)}
              onFocus={() => setContactFocus(true)}
              placeholder="Strength"
              clearTextOnFocus={false}
              keyboardAppearance={'dark'}
              keyboardType="phone-pad"
              maxLength={50}
            />
          </View>
        </View>
        {SelectAreaEnabled == false ? (
          <TouchableOpacity
            style={{
              width: Dimensions.get('window').width - 30,
              marginTop: 12,
              flexDirection: 'row',
              textAlign: 'center',
            }}
            onPress={() => functionCombined()}
          >
            <View style={{flexDirection: 'row', width: 90 + '%'}}>
              <Text style={styles.AttachmentHeading}> Campaign Audience</Text>
            </View>
            <View style={{width: 10 + '%'}}>
              <Image
                source={UpArrowIcon}
                style={styles.AttachmentHeadingIcon}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{width: Dimensions.get('window').width - 30}}>
            <TouchableOpacity
              style={{textAlign: 'center', flexDirection: 'row', marginTop: 10}}
              onPress={() => functionCombined()}
            >
              <View style={{flexDirection: 'row', width: 90 + '%'}}>
                <Text style={styles.AttachmentHeading}> Campaign Audience</Text>
              </View>
              <View style={{width: 10 + '%'}}>
                <Image
                  source={DownArrowIcon}
                  style={styles.AttachmentHeadingIcon}
                />
              </View>
            </TouchableOpacity>
          </View>
        )}
        {SelectSocialAreaEnabled == false ? (
          <TouchableOpacity
            style={{
              width: Dimensions.get('window').width - 30,
              marginTop: 12,
              flexDirection: 'row',
              textAlign: 'center',
            }}
            onPress={() => SocialControlEnabledClick()}
          >
            <View style={{flexDirection: 'row', width: 90 + '%'}}>
              <Text style={styles.AttachmentHeading}> Social Control</Text>
            </View>
            <View style={{width: 10 + '%'}}>
              <Image
                source={UpArrowIcon}
                style={styles.AttachmentHeadingIcon}
              />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{width: Dimensions.get('window').width - 30}}>
            <TouchableOpacity
              style={{textAlign: 'center', flexDirection: 'row', marginTop: 10}}
              onPress={() => SocialControlEnabledClick()}
            >
              <View style={{flexDirection: 'row', width: 90 + '%'}}>
                <Text style={styles.AttachmentHeading}> Social Control</Text>
              </View>
              <View style={{width: 10 + '%'}}>
                <Image
                  source={DownArrowIcon}
                  style={styles.AttachmentHeadingIcon}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.CampaignAudienceView}>
              <View style={{textAlign: 'center'}}>
                <TextInput
                  placeholderTextColor={colors.TextBoxPlaceholderColor}
                  value={whatsapp}
                  onChangeText={value => setWhatsapp(value)}
                  style={styles.SocialControlView}
                  keyboardType="phone-pad"
                  placeholder="Whatsapp"
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  minLength={8}
                  maxLength={24}
                />
              </View>
              <View style={{textAlign: 'center'}}>
                <TextInput
                  placeholderTextColor={colors.TextBoxPlaceholderColor}
                  value={facebookId}
                  onChangeText={value => setFacebookId(value)}
                  style={styles.SocialControlView}
                  keyboardType="email-address"
                  placeholder="Facebook "
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  minLength={15}
                  maxLength={60}
                />
              </View>
              <View style={{textAlign: 'center'}}>
                <TextInput
                  placeholderTextColor={colors.TextBoxPlaceholderColor}
                  value={instagramId}
                  onChangeText={value => setInstagramId(value)}
                  style={styles.SocialControlView}
                  placeholder="Instagram"
                  keyboardType="twitter"
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  minLength={15}
                  maxLength={50}
                />
              </View>
              <View style={{textAlign: 'center'}}>
                <TextInput
                  placeholderTextColor={colors.TextBoxPlaceholderColor}
                  value={iban}
                  onChangeText={value => setIban(value)}
                  style={styles.SocialControlView}
                  placeholder="Iban/Wire Transfer Id"
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  maxLength={4}
                  minLength={3}
                />
              </View>
            </View>
          </View>
        )}
        <Dropdown
          placeholderTextColor={colors.TextBoxPlaceholderColor}
          onSelect={value => SelectStatusClick(value)}
          selectedIndex={statusSelectedId}
          style={styles.Pickerstyle}
          items={statusItem}
          placeholder="Select Status..."
          selectedItemViewStyle={colors.red}
          clearTextOnFocus={true}
          keyboardAppearance={'dark'}
          maxLength={5}
        />
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
          <TouchableOpacity onPress={() => TermsAndConditionsClose()}>
            <Text style={styles.lable2}> Terms & Conditions (EULA)</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ButtonView}>
          <Button
            style={[styles.btnCancel, {flexBasis: '47%'}]}
            bgColor={colors.Blazorbutton}
            caption="Cancel"
            onPress={() => CancelClick()}
          />
          <Button
            style={[styles.btnSubmit, {flexBasis: '47%'}]}
            bgColor={colors.Blazorbutton}
            caption="Submit"
            onPress={() => submit()}
          />
        </View>
      </ScrollView>
      {SelectAreaEnabled ? (
        <View style={styles.modalMainView}>
          <View style={styles.modalSearchView}>
            <View style={styles.centeredfilterView}>
              <View style={styles.sectionStylenew} marginTop={8}>
                <Dropdown
                  placeholderTextColor="gray"
                  onSelect={value => SelectCountryClick(value)}
                  selectedIndex={selectCountryVal}
                  style={styles.TextDropdown}
                  items={stateList}
                  placeholder="Select Country..."
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  maxLength={5}
                />
              </View>
              <View style={styles.textSearchabled}>
                <SearchableDropdown
                  onTextChange={text => textChangeClick(text)}
                  onItemSelect={item => SearchableClick(item)}
                  //onItemSelect={item => setSelectedItems(item)}
                  selectedIndex={CityIndex}
                  //onItemSelect={item => setSelectedItems(item)}
                  containerStyle={containerStyle}
                  textInputStyle={textInputStyle}
                  itemStyle={itemStyle}
                  itemTextStyle={itemTextStyle}
                  itemsContainerStyle={itemsContainerStyle}
                  items={CityDataList}
                  placeholder={
                    selectCityId == '' ? cityNameAdd : ' ' + selectCityName
                  }
                  //placeholder={selectedItems == ''?"  Select Show Room...":'  ' + selectedItems.id}
                  placeholderTextColor="black"
                  resPtValue={false}
                  underlineColorAndroid="transparent"
                />
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}
/******************************************************** styles *************************************************/
const styles = StyleSheet.create({
  MainViewContainer: {
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    paddingLeft: 3.5 + '%',
  },
  ProfileImgView: {
    // width: Dimensions.get('window').width-30,
    //marginHorizontal:15,
    //backgroundColor:'gray',
    alignItems: 'center',
    paddingBottom: '0.5%',
    paddingTop: '0.5%',
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
    marginTop: 7,
    marginBottom: 10,
    width: Dimensions.get('window').width - 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  FieldText: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 107.8,
    marginLeft: 0,
    borderColor: colors.borderColor,
    borderWidth: 0,
  },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3 + '%',
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    borderWidth: 1,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleOnFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3 + '%',
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 40,
    marginHorizontal: 20,
    borderWidth: 2,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
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
    width: Dimensions.get('window').width - 30,
    height: 46,
    color: colors.TextBoxColor,
    fontSize: 15,
    marginTop: 3 + '%',
    fontWeight: 'bold',
    //  textAlign: 'center',
  },
  PickerstyleRow: {
    backgroundColor: colors.TextBoxContainer,
    //backgroundColor: colors.red,
    borderColor: colors.red,
    borderWidth: 1,
    borderRadius: 4,
    //width: 60 + '%',
    height: 46,
    color: colors.TextBoxColor,
    fontSize: 15,
    //  textAlign: 'center',
  },
  StrengthView: {
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 4,
    //width: 45 + '%',
    height: 46,
    color: colors.TextBoxColor,
    //color: "#ffffff",
    fontSize: 15,
    //  textAlign: 'center',
  },
  AttachmentHeadingIcon: {
    height: 26,
    width: 26,
    alignSelf: 'center',
    marginTop: 4,
    marginLeft: 12,
    marginRight: 8,
  },
  AttachmentHeading: {
    //marginLeft:8 + '%',
    marginTop: 1 + '%',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionStyleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 4,
    height: 75,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 30,
    borderWidth: 0,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  SocialControlView: {
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 4,
    width: Dimensions.get('window').width - 40,
    // marginHorizontal:30,
    height: 46,
    color: 'black',
    fontSize: 15,
    marginTop: 15,
    //fontWeight: 'bold',
    // textAlign: 'center',
    backgroundColor: colors.TextBoxContainer,
  },
  CampaignAudiencePickerstyle: {
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 4,
    width: Dimensions.get('window').width - 40,
    // marginHorizontal:30,
    height: 46,
    color: colors.TextBoxColor,
    fontSize: 15,
    marginTop: 15,
    //fontWeight: 'bold',
    // textAlign: 'center',
    backgroundColor: colors.TextBoxContainer,
  },
  CampaignAudienceView: {
    //flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: '2%',
    justifyContent: 'space-around',
  },
  mandatoryControl: {
    borderWidth: 1,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.mandatoryColor,
  },
  modalSearchView: {
    width: Dimensions.get('window').width - 10,
    marginHorizontal: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 6,
  },
  modalMainView: {
    position: 'absolute',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width - 10,
    marginHorizontal: 5,
    top: 45 + '%',
    backgroundColor: 'white',
    alignItems: 'center',
    borderRadius: 6,
    alignItems: 'center',
  },
  centeredfilterView: {
    width: Dimensions.get('window').width - 20,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  sectionStylenew: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    marginBottom: 11,
    fontSize: 17,
    color: colors.white,
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 4,
  },
  TextDropdown: {
    width: Dimensions.get('window').width - 30,
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 4,
    height: 46,
    color: colors.TextBoxColor,
    fontSize: 15,
    marginTop: 10,
    backgroundColor: colors.TextBoxContainer,
  },
  textSearchabled: {
    backgroundColor: colors.TextBoxContainer,
    width: Dimensions.get('window').width - 30,
    color: 'black',
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 6,
  },
  ButtonViewModal: {
    marginTop: 17,
    paddingBottom: 10,
    width: Dimensions.get('window').width - 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

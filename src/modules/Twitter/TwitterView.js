import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/Entypo';
import Icons from 'react-native-vector-icons/FontAwesome';
import {Button, Dropdown, TextInput} from '../../components';
import Alert from '../../components/Alert';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import {colors, fonts} from '../../styles';
//import Icons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RadioForm from 'react-native-simple-radio-button';
import Toast from 'react-native-simple-toast';
import servicesettings from '../dataservices/servicesettings';
const Cameraicon = require('../../../assets/images/icons/camera4.png');
const Cameraicons = require('../../../assets/images/camera.png');
const galleryicon = require('../../../assets/images/491025.png');
//import { MultiSelect } from 'react-native-element-dropdown';
const crumbsContainerStyle = {
  backgroundColor: 'black',
  flexDirection: 'row',
  borderWidth: 1,
  borderColor: '#d6d6d6',
  justifyContent: 'space-between',
  width: Dimensions.get('window').width,
};
const crumbStyle = {
  flexDirection: 'row',
  justifyContent: 'center',
  backgroundColor: 'transparent',
};
const activeCrumbStyle = {
  backgroundColor: 'gray',
  borderColor: '#010c1f',
};
const crumbTextStyle = {
  color: 'white',
  fontSize: 14,
  fontWeight: 'bold',
};
const activeCrumbTextStyle = {
  color: 'white',
  fontSize: 15,
  fontWeight: 'bold',
};
const containerStyle = {padding: 0};
const textInputStyle = {
  fontSize: 15,
  color: '#a2a2a2',
  color: '#a2a2a2',
  backgroundColor: 'black',
  width: Dimensions.get('window').width - 110,
  borderLeftWidth: 0.3,
  borderLeftColor: colors.borderColor,
  height: 50,
};
const itemStyle = {
  padding: 10,
  marginTop: 2,
  backgroundColor: '#bdbdbd52',
};
const itemTextStyle = {
  color: colors.white,
};
const itemsContainerStyle = {
  width: Dimensions.get('window').width - 100,
};
const DATA = [
  {id: 1, name: 'Python'},
  {id: 2, name: 'Java'},
  {id: 3, name: 'JavaScript'},
  {id: 4, name: 'C'},
  {id: 5, name: 'PHP'},
  {id: 6, name: 'Swift'},
  {id: 7, name: 'Ruby'},
  {id: 8, name: 'Dart'},
  {id: 9, name: 'SQL'},
  {id: 10, name: 'Perl'},
];

export default function TwitterScreen(props) {
  const [selectedItems, setSelectedItems] = useState([]);
  const [compaigntime, setcompaigntime] = useState(0);
  const [timeupdateid, settimeupdateid] = useState(0);
  const [recurringtime, setrecurringtime] = useState([]);
  const [selectIndexStatus, setselectIndexStatus] = useState(-1);
  const [Subject, setSubject] = useState('');
  const [timeintervel, settimeintervel] = useState('');
  const [Sender, setSender] = useState('');
  const [recipients, setrecipients] = useState('');
  const [Index, setIndex] = useState(0);
  const [template, settemplate] = useState('');
  const [serverstatus, setserverstatus] = useState('');
  const [POP, setPOP] = useState('');
  const [Port, setPort] = useState('');
  const [Senderid, setSenderid] = useState('');
  const [User, setUser] = useState('');
  const [Password, setPassword] = useState('');
  const [Visible, setVisible] = useState(false);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isSelectTimePickerVisible, setSelectTimePickerVisibility] =
    useState(false);
  const [isCompaigntimePickerVisible, setisCompaigntimePickerVisible] =
    useState(false);
  const [updatetimePickerVisible, setupdatetimePickerVisible] = useState(false);
  const [StartTime, setStartTime] = useState('');
  const [EndTime, setEndTime] = useState('');
  const [CampaignTime, setCampaignTime] = useState('Campaign time');
  const [SelectTime, setSelectTime] = useState('Select time');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorVisible, seterrorVisible] = useState(false);
  const [camera, setcamera] = useState(false);
  const [gallery, setgallery] = useState(false);
  const [showclender, setshowclender] = useState(false);
  const [showinterval, setshowinterval] = useState(true);
  const [successVisible, setsuccessVisible] = useState(false);
  const [img, setimg] = useState('');
  const OK = () => {
    seterrorVisible(false);
  };
  const [permissionVisible, setpermissionVisible] = useState(false);
  const hidepermission = () => {
    setpermissionVisible(false);
  };
  const confirmpermission = () => {
    setpermissionVisible(false);
    Linking.openSettings();
  };
  const [microphonepermissionVisible, setmicrophonepermissionVisible] =
    useState(false);
  const hidemicrophonepermission = () => {
    setmicrophonepermissionVisible(false);
  };
  const confirmmicrophonepermission = () => {
    setmicrophonepermissionVisible(false);
    Linking.openSettings();
  };
  const Status = [
    {id: 1, name: 'Active'},
    {id: 2, name: 'Paused'},
    {id: 3, name: 'Canceled'},
  ];
  const type = [
    {value: 0, label: 'Schedule'},
    {value: 1, label: 'Interval'},
  ];
  function selectType(value) {
    if (value == 0) {
      setshowclender(true);
      setshowinterval(false);
    } else {
      setshowclender(false);
      setshowinterval(true);
    }
    setcompaigntime(value);
  }
  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };
  const hideStartDatePicker = () => {
    setStartDatePickerVisibility(false);
  };
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };
  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };
  const showSelectTimePicker = () => {
    setSelectTimePickerVisibility(true);
  };
  const hideSelectTimePicker = () => {
    setSelectTimePickerVisibility(false);
  };
  const showCampaignTimePicker = () => {
    setisCompaigntimePickerVisible(true);
  };
  const hideCampaignTimePicker = () => {
    setisCompaigntimePickerVisible(false);
  };
  const ShowUpdateTimePicker = id => {
    setupdatetimePickerVisible(true);
    settimeupdateid(id);
  };
  const hideUpdateTimePicker = () => {
    setupdatetimePickerVisible(false);
  };
  const handleStartConfirm = date => {
    setStartTime(date);
  };
  const handleEndConfirm = date => {
    setEndTime(date);
  };
  const handleSelectTimeConfirm = date => {
    var val = Math.floor(1000 + Math.random() * 9000);
    setrecurringtime(recurringtime => [
      ...recurringtime,
      {id: val, RecurringTime: date},
    ]);
    setSelectTimePickerVisibility(false);
  };
  const removeRecurringTime = id => {
    setrecurringtime(recurringtime.filter(item => item.id != id));
  };
  const handleCampaignTimeConfirm = date => {
    setCampaignTime(moment(date).format('hh:mm:ss'));
  };
  const handleupdateTimeConfirm = date => {
    recurringtime.forEach((a, i) => {
      if (a.id === timeupdateid) {
        a.RecurringTime = date;
      }
    });
    setupdatetimePickerVisible(false);
  };
  const CancelClick = () => {
    setVisible(true);
  };
  const hide = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(false);
    props.navigation.navigate('BMT');
  };
  function FilterCity(value) {
    var stateID = servicesettings.State[value == -1 ? 0 : value].StateId;
    setStateIndex(value);
    setCities(Cityjason.filter(d => d.stateId === stateID));
  }
  useEffect(() => {
    //***********************************************************************************************************************************//
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
  }, []);
  /**************************************** validation ************************************************/
  function checkTextInput() {
    setIndex(2);
  }
  function checkTextInputRecord() {
    if (selectedItems.length == 0) {
      Toast.show('Please select item');
      return;
    }
    if (Subject.trim() == '') {
      Toast.show('Please enter subject');
      return;
    }
    if (template.trim() == '') {
      Toast.show('Please enter template');
      return;
    }
    setIndex(1);
  }
  function handlePress(index) {
    if (index == 1) {
      if (selectedItems.length == 0) {
        Toast.show('Please select item');
        return;
      }
      if (Subject.trim() == '') {
        Toast.show('Please enter subject');
        return;
      }
      if (template.trim() == '') {
        Toast.show('Please enter template');
        return;
      }
      setIndex(index);
    }
    if (index == 2) {
      setIndex(index);
    }
    if (index == 0) {
      setIndex(index);
    }
  }
  const onSelectedItemsChange = selectedItems => {
    setSelectedItems(selectedItems);
    for (let i = 0; i < selectedItems.length; i++) {
      var tempItem = DATA.find(item => item.id === selectedItems[i]);
      console.log(tempItem);
    }
    console.log('selectedItems', selectedItems);
  };
  /******************************************************************  views  *****************************************************/
  /*
<View style={styles.sectionStyle}>
<Image source={require('../../../assets/images/icons/recipients.png')} style={styles.imageStyle}></Image>
</View>
<View style={styles.TimeView}>
<View style={styles.sectionStyleTime}>
<Icon name="calendar" style={styles.iconsStyle} />
<View style={styles.datepickercustome}>
<TouchableOpacity style={styles.btntime} onPress={() => showCampaignTimePicker()}>
<Text style={styles.TimeText}>{CampaignTime}</Text>
</TouchableOpacity>
<DateTimePickerModal
isVisible={isCompaigntimePickerVisible}
mode="time"
onConfirm={handleCampaignTimeConfirm}
onCancel={hideCampaignTimePicker}
/>
</View>
</View>
</View>
*/
  const createcompaign = () => {
    if (StartTime == '') {
      Toast.show('Please select start time');
      return;
    }
    if (EndTime == '') {
      Toast.show('Please end time');
      return;
    }
    var ms = moment(EndTime, 'DD/MM/YYYY HH:mm:ss').diff(
      moment(StartTime, 'DD/MM/YYYY HH:mm:ss'),
    );
    var d = moment.duration(ms);
    if (d <= 0) {
      Toast.show('Please select valid end date');
      return;
    }
    if (selectIndexStatus == -1) {
      Toast.show('Please select Status');
      return;
    }
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);

      var headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          Id: 0,
          NetworkId: servicesettings.TwitterID,
          OrgId: Asyncdata[0].orgid,
          Description: Asyncdata[0].orgname + 'Social media campaign',
          Name: Asyncdata[0].orgname,
          Title: 'Twitter Campaign',
          HasgTags: '#Twitter',
          StartTime: StartTime,
          FinishTime: EndTime,
          CreatedBy: Asyncdata[0].id,
          Status: Status[selectIndexStatus].id,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      console.log('headerFetch from login', headerFetch.body);
      fetch(servicesettings.baseuri + 'createcompaign', headerFetch)
        .then(response => response.json())
        .then(responseJson => {
          console.log('data response creat compaign =>', responseJson);
          if (responseJson.status == true) {
            setStartTime('');
            setEndTime('');
            setselectIndexStatus(-1);
            props.navigation.replace('Campaign Status');
          }
        })
        .catch(error => {
          console.error('service error', error);
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
        });
    });
  };
  if (Index == 0) {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={false}>
        <View style={styles.container}>
          <Alert
            massagetype={'warning'}
            hide={hidepermission}
            confirm={confirmpermission}
            Visible={permissionVisible}
            alerttype={'confirmation'}
            Title={'Confirmation'}
            Massage={'"Spentem" would like to access camera ?'}></Alert>
          <TouchableOpacity>
            <AppBreadcrumb
              crumbs={[
                {
                  text: 'Template',
                },
                {text: 'Interval & Frequency'},
                {text: 'Dispatch'},
              ]}
              onSelect={index => {
                handlePress(index);
              }}
              selectedIndex={Index}
            />
          </TouchableOpacity>
          <View style={styles.container}>
            <ScrollView>
              <Alert
                massagetype={'warning'}
                hide={hide}
                confirm={confirm}
                Visible={Visible}
                alerttype={'confirmation'}
                Title={'Confirmation'}
                Massage={'Do you want to discard ?'}></Alert>
              <View style={styles.uploadmodelcontainer}>
                <View style={styles.sectionStyle}>
                  <Image
                    source={require('../../../assets/images/icons/Subject.png')}
                    style={styles.imageStyle}></Image>
                  <TextInput
                    placeholderTextColor="#a2a2a2"
                    style={styles.FieldText}
                    value={Subject}
                    onChangeText={value => setSubject(value)}
                    placeholder="Subject"
                    clearTextOnFocus={true}
                    keyboardAppearance={'dark'}
                    KeyboardType={'name'}
                    maxLength={100}
                  />
                </View>
                <View style={styles.sectionStyleTitle}>
                  <TextInput
                    multiline={true}
                    textAlignVertical="top"
                    placeholderTextColor="#a2a2a2"
                    style={styles.FieldTextTitle}
                    value={template}
                    onChangeText={value => settemplate(value)}
                    placeholder="Template..."
                    clearTextOnFocus={true}
                    keyboardAppearance={'dark'}
                    KeyboardType={'name'}
                    maxLength={200}
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
                    caption="Send"
                    onPress={() => checkTextInputRecord()}
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
  if (Index == 1) {
    return (
      <View style={styles.container}>
        <ScrollView>
          <TouchableOpacity>
            <AppBreadcrumb
              crumbs={[
                {
                  text: 'Template',
                },
                {text: 'Interval & Frequency'},
                {text: 'Dispatch'},
              ]}
              onSelect={index => {
                handlePress(index);
              }}
              selectedIndex={Index}
            />
          </TouchableOpacity>
          <View style={styles.container}>
            <Alert
              massagetype={'warning'}
              hide={hide}
              confirm={confirm}
              Visible={Visible}
              alerttype={'confirmation'}
              Title={'Confirmation'}
              Massage={'Do you want to close ?'}></Alert>
            <View style={styles.radiostyle}>
              <View style={{marginTop: 10, height: 45, flexDirection: 'row'}}>
                <RadioForm
                  radio_props={type}
                  initial={1}
                  //isSelected={4}
                  formHorizontal={true}
                  labelHorizontal={true}
                  buttonColor={'white'}
                  labelColor={'white'}
                  labelStyle={{margin: 10, color: 'white', bottom: 5}}
                  animation={true}
                  onPress={value => {
                    selectType(value);
                  }}
                />
              </View>
            </View>
            {showinterval == true ? (
              <View style={styles.sectionStyle}>
                <Icon name="calendar" style={styles.iconsStyle} />
                <TextInput
                  placeholderTextColor="#a2a2a2"
                  style={styles.FieldText}
                  value={timeintervel}
                  onChangeText={value => settimeintervel(value)}
                  placeholder="Interval time"
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  KeyboardType={'name'}
                  maxLength={100}
                />
              </View>
            ) : (
              <View></View>
            )}

            <DateTimePickerModal
              isVisible={updatetimePickerVisible}
              mode="time"
              onConfirm={handleupdateTimeConfirm}
              onCancel={hideUpdateTimePicker}
            />
            {showclender == true ? (
              <View style={styles.TimeView}>
                <View style={styles.sectionStyleTime}>
                  <Icon name="calendar" style={styles.iconsStyle} />
                  <View style={styles.datepickercustome}>
                    <TouchableOpacity
                      style={styles.btntime}
                      onPress={() => showSelectTimePicker()}>
                      <Text style={styles.TimeText}>{SelectTime}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isSelectTimePickerVisible}
                      mode="time"
                      onConfirm={handleSelectTimeConfirm}
                      onCancel={hideSelectTimePicker}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View></View>
            )}
            <FlatList
              data={recurringtime}
              renderItem={({item}) => (
                <View style={styles.sectionStyleRecurringTime}>
                  <Text style={styles.RecurringTimeText}>
                    {moment(item.RecurringTime).format(' hh : mm : ss A')}
                  </Text>
                  <TouchableOpacity
                    onPress={() => ShowUpdateTimePicker(item.id)}
                    style={{position: 'absolute', right: 15 + '%'}}>
                    <Icon
                      name="pencil"
                      style={{fontSize: 40, color: colors.white}}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeRecurringTime(item.id)}
                    style={{position: 'absolute', right: 10}}>
                    <Icons
                      name="minus-circle"
                      style={{fontSize: 35, color: colors.red}}
                    />
                  </TouchableOpacity>
                </View>
              )}
              numColumns={1}
              horizontal={false}
            />
            <View style={styles.ButtonView}>
              <Button
                style={[styles.btnCancel, {flexBasis: '47%'}]}
                bgColor={colors.BlazorCancleButton}
                caption="Back"
                onPress={() => setIndex(0)}
              />
              <Button
                style={[styles.btnSubmit, {flexBasis: '47%'}]}
                bgColor={colors.Blazorbutton}
                caption="Next"
                onPress={() => checkTextInput()}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  } else if (Index == 2) {
    /************************************************************* Address **********************************************************/
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={false}>
        <View style={styles.container}>
          <Alert
            massagetype={'warning'}
            hide={hide}
            confirm={confirm}
            Visible={Visible}
            alerttype={'confirmation'}
            Title={'Confirmation'}
            Massage={'Do you want to close ?'}></Alert>
          <TouchableOpacity>
            <AppBreadcrumb
              crumbs={[
                {
                  text: 'Template',
                },
                {text: 'Interval & Frequency'},
                {text: 'Dispatch'},
              ]}
              onSelect={index => {
                handlePress(index);
              }}
              selectedIndex={Index}
            />
          </TouchableOpacity>
          <View style={styles.container}>
            <ScrollView>
              <View style={{flexDirection: 'row'}}>
                <View style={styles.sectionStylestatus}>
                  <Text style={styles.SummeryText}>{'Service Name'}</Text>
                </View>
                <Button
                  style={styles.btnTest}
                  bgColor={colors.BlazorCancleButton}
                  caption="Test"
                  onPress={() => setIndex(1)}
                />
              </View>
              <View style={styles.TimeView}>
                <View style={styles.sectionStyleTime}>
                  <Icon name="calendar" style={styles.iconsStyle} />
                  <View style={styles.datepickercustome}>
                    <TouchableOpacity
                      style={styles.btntime}
                      onPress={() => showStartDatePicker()}>
                      <Text style={styles.TimeText}>
                        {StartTime != ''
                          ? moment(StartTime).format('hh:mm:ss')
                          : 'Start time'}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isStartDatePickerVisible}
                      mode="time"
                      onConfirm={handleStartConfirm}
                      onCancel={hideStartDatePicker}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.TimeView}>
                <View style={styles.sectionStyleTime}>
                  <Icon name="calendar" style={styles.iconsStyle} />
                  <View style={styles.datepickercustome}>
                    <TouchableOpacity
                      style={styles.btntime}
                      onPress={() => showEndDatePicker()}>
                      <Text style={styles.TimeText}>
                        {EndTime != ''
                          ? moment(EndTime).format('hh:mm:ss')
                          : 'End time'}
                      </Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      isVisible={isEndDatePickerVisible}
                      mode="time"
                      onConfirm={handleEndConfirm}
                      onCancel={hideEndDatePicker}
                    />
                  </View>
                </View>
              </View>
              <Dropdown
                placeholderTextColor="gray"
                onSelect={value => setselectIndexStatus(value)}
                selectedIndex={selectIndexStatus}
                style={styles.Pickerstyle}
                items={Status}
                placeholder="Status..."
                color={'white'}
                clearTextOnFocus={true}
                keyboardAppearance={'dark'}
                maxLength={5}
              />
              <View style={styles.sectionStyledetail}>
                <Text style={styles.SummeryText}>{'1 => 35 Recepentce'}</Text>
                <Text style={styles.SummeryText}>{'2 => 25 SMS'}</Text>
              </View>
              <View style={styles.ButtonView}>
                <Button
                  style={[styles.btnCancel, {flexBasis: '47%'}]}
                  bgColor={colors.BlazorCancleButton}
                  caption="Back"
                  onPress={() => setIndex(1)}
                />
                <Button
                  style={[styles.btnSubmit, {flexBasis: '47%'}]}
                  bgColor={colors.Blazorbutton}
                  caption="Save"
                  onPress={() => createcompaign()}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}
/************************************************************ styles ***************************************************/
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.BlazorBg,
    flex: 1,
    alignItems: 'center',
  },
  uploadmodelcontainer: {
    width: Dimensions.get('window').width - 50,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  mainview: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  ProfileImgView: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 90,
    borderColor: colors.white,
    borderWidth: 1,
  },
  ProfileImgViewcameraadded: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 90,
    borderColor: 'green',
    borderWidth: 1,
  },
  ProfileImgViewgalleryadded: {
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    width: 80,
    borderRadius: 90,
    borderColor: 'green',
    borderWidth: 1,
  },
  camera: {
    height: 80,
    width: 80,
    tintColor: 'white',
  },
  gallery: {
    height: 50,
    width: 50,
    tintColor: 'white',
  },
  cameraadded: {
    height: 80,
    width: 80,
    tintColor: 'green',
  },
  galleryadded: {
    height: 50,
    width: 50,
    tintColor: 'green',
  },
  cameratext: {
    fontSize: 18,
    color: '#cacccb',
    marginTop: 15,
  },
  gallerytext: {
    fontSize: 18,
    color: '#cacccb',
    marginTop: 15,
  },
  checkboxsecond: {
    position: 'absolute',
    right: 10,
    marginTop: 15,
  },
  checkbox: {
    position: 'absolute',
    left: 20,
  },
  datepickercustome: {
    height: 48,
    borderLeftWidth: 0.3,
    borderLeftColor: colors.borderColor,
  },
  btnCancel: {
    // height:45,
    borderRadius: 5,
    borderWidth: 1,
  },
  btnTest: {
    height: 50,
    marginTop: 15,
    borderRadius: 5,
    borderWidth: 1,
    position: 'absolute',
    right: 0,
  },
  btnSubmit: {
    // height:45,
    borderRadius: 5,
    borderWidth: 1,
  },
  btntime: {
    height: 100,
    width: Dimensions.get('window').width - 80,
  },
  TimeText: {
    fontSize: 15,
    color: '#FFF',
    marginTop: 13,
    marginLeft: 80,
  },
  SummeryText: {
    fontSize: 15,
    color: '#FFF',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  RecurringTimeText: {
    fontSize: 30,
    color: '#FFF',
    marginLeft: 5,
  },

  DateText: {
    fontSize: 15,
    color: '#FFF',
    marginTop: 13,
    marginLeft: 60,
  },
  conditionView: {
    flexDirection: 'row',
  },
  ButtonView: {
    marginTop: 15,
    width: Dimensions.get('window').width - 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  lable: {
    marginTop: 5,
    marginLeft: 5,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  lable2: {
    marginTop: 5,
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  FieldText: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    backgroundColor: colors.TextBoxContainer,
    color: colors.TextColor,
    width: Dimensions.get('window').width - 107.8,
    marginLeft: 0,
  },
  sectionStylecheckbox: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  TimeView: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 50,
  },
  sectionStyleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 50,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  Pickerstyle: {
    borderColor: '#ffffff',
    borderWidth: 0.5,
    borderRadius: 4,
    width: Dimensions.get('window').width - 50,
    height: 50,
    color: '#ffffff',
    fontSize: 20,
    marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.TextBoxContainer,
  },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 50,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleRecurringTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 80,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStylestatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 50,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 160,
    backgroundColor: colors.TextBoxContainer,
    borderWidth: 0.3,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyledetail: {
    //flexDirection: 'row',
    //alignItems: 'center',
    marginTop: 15,
    //height:50,
    minHeight: 50,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleOnFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 50,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.TextBoxContainer,
    borderColor: 'white',
    borderRadius: 4,
  },
  imageStyle: {
    margin: 10,
    height: 35,
    width: 35,
    tintColor: colors.AwesomeIconColor,
  },
  iconsStyle: {
    margin: 10,
    fontSize: 30,
    color: colors.AwesomeIconColor,
  },
  TextDropdown: {
    fontFamily: fonts.primaryRegular,
    width: Dimensions.get('window').width - 103,
    height: 48,
    fontSize: 16,
    color: colors.TextColor,
  },
  dateText: {
    color: 'white',
    fontSize: 15,
  },
  datePicker: {
    marginTop: 4,
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    backgroundColor: colors.black,
    color: colors.TextColor,
    width: Dimensions.get('window').width - 120.8,
  },
  SearchAbleDropdownStyle: {
    flexDirection: 'row',
    marginTop: 5,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.black,
    borderColor: colors.borderColor,
    borderRadius: 4,
    maxHeight: '70%',
  },
  SearchAbleDropdownStyleFocuse: {
    flexDirection: 'row',
    marginTop: 5,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.black,
    borderColor: 'white',
    borderRadius: 4,
    maxHeight: '70%',
  },
  helpimageStyle: {
    height: 30,
    width: 30,
    margin: 9,
  },
  sectionStyleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 100,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  termsView: {
    flexDirection: 'row',
    marginTop: 5,
    //   justifyContent: 'center',
  },
  sectionStyleTitleOnFocus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 100,
    fontSize: 16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.black,
    borderColor: 'white',
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
    color: colors.TextColor,
    width: Dimensions.get('window').width - 70,
    marginLeft: 0,
  },
  radiostyle: {
    // borderColor: '#ffffff',
    // borderWidth: .5,
    //  borderRadius:4,
    width: Dimensions.get('window').width - 50,
    height: 50,
    color: '#ffffff',
    fontSize: 20,
    marginTop: 10,
    //fontWeight: 'bold',
    //textAlign: 'center',
    //  alignItems:'center',
    justifyContent: 'center',
    // backgroundColor: "#07282b",
  },
  dropdown: {
    borderWidth: 0.3,
    borderColor: colors.borderColor,
    width: Dimensions.get('window').width - 50,
    height: 50,
    backgroundColor: colors.TextBoxContainer,
    borderRadius: 4,
    padding: 12,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'white',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'white',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    backgroundColor: colors.Blazorbutton,
    color: 'white',
  },
  icon: {
    marginRight: 5,
    color: 'white',
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.TextBoxContainer,
  },
  selectedStyle: {
    //width: Dimensions.get('window').width-50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: colors.TextBoxContainer,
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
    color: 'white',
  },
  multiSelectContainer: {
    //width: Dimensions.get('window').width-50,
    //backgroundColor:colors.TextBoxContainer,

    //flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    //height:10,
    //fontSize:16,
    color: colors.white,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0.3,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  text: {
    padding: 12,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
});

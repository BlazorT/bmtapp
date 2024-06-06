import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Button, Dropdown, TextInput} from '../../components';
import AddScheduleList from '../../components/AddScheduleList';
import Alert from '../../components/Alert';
import AlertBMT from '../../components/AlertBMT';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import Model from '../../components/Model';
import NetworksSelectedView from '../../components/NetworksSelectedView';
import NetworksView from '../../components/NetworksView';
import {colors, fonts} from '../../styles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import moment from 'moment';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RadioForm from 'react-native-simple-radio-buttons';
import Toast from 'react-native-simple-toast';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import AttachmentIcon from '../../../assets/images/attachment2.png';
import checkedCheckbox from '../../../assets/images/checkboxchecked.png';
import uncheckedCheckbox from '../../../assets/images/checkboxunchecked.png';
import Crossicon from '../../../assets/images/crossicon.png';
import DownArrowIcon from '../../../assets/images/downarrow.png';
import PdfIcon from '../../../assets/images/pdficon.png';
import pdfViewIcon from '../../../assets/images/pdfview.png';
import profileIcon from '../../../assets/images/picture.png';
import PlusIcon from '../../../assets/images/plusicon.png';
import UpArrowIcon from '../../../assets/images/uparrow.png';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';
import servicesettings from '../dataservices/servicesettings';

export default function CampaignScheduleScreen(props) {
  const theme = useTheme();
  const {user, isAuthenticated} = useUser();
  const lovs = useSelector(state => state.lovs).lovs;

  var defaultDateTime = new Date();

  const [selectIntervalType, setSelectIntervalType] = useState(0);
  const [selectIntervalTypeId, setSelectIntervalTypeId] = useState(0);
  const [Subject, setSubject] = useState('');
  const [scheduleData, setScheduleData] = useState('');
  const [totalIndex, setTotalIndex] = useState('');
  const [addScheduleDataForSubmit, setAddScheduleDataForSubmit] = useState('');
  const [networkCount, setNetworkCount] = useState('');
  const [networkSelectSocialMedia, setNetworkSelectSocialMedia] = useState('');
  const [networkUpdateSelected, setNetworkUpdateSelected] = useState('');
  const [scheduleCount, setScheduleCount] = useState('');
  const [intervalVal, setIntervalVal] = useState('');
  const [intervalValDisabled, setIntervalValDisabled] = useState(false);
  const [addScheduleButton, setAddScheduleButton] = useState(true);
  const [Index, setIndex] = useState(0);
  const [template, settemplate] = useState('');
  const [NetworkSelectedAddSchedule, setNetworkSelectedAddSchedule] =
    useState('');
  const [selectStatus, setSelectStatus] = useState('');
  const [campaignStatus, setCampaignStatus] = useState('');
  const [selectAutoGenerate, setSelectAutoGenerate] = useState('');
  const [Hashtag, setHashtag] = useState('');
  const [selectTotalDays, setSelectTotalDays] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [userId, setUserId] = useState('');
  const [PDFSelectData, setPDFSelectData] = useState('');
  const [Videouri, setVideouri] = useState('');
  const [ImgUriBase64, setImgUriBase64] = useState('');
  const [PdfUri, setPdfUri] = useState('');
  const [Visible, setVisible] = useState(false);
  const [networkEditWithScheduleDisabled, setNetworkEditWithScheduleDisabled] =
    useState(false);
  const [AttachmentsEnabled, setAttachmentsEnabled] = useState(false);
  const [SelectAreaEnabled, setSelectAreaEnabled] = useState(false);
  const [sheduleSummeryVisible, setScheduleSummeryVisible] = useState(false);
  const [selectSunday, setSelectSunday] = useState(false);
  const [selectMonday, setSelectMonday] = useState(false);
  const [selectTuesday, setSelectTuesday] = useState(false);
  const [selectWednesday, setSelectWednesday] = useState(false);
  const [selectThursday, setSelectThursday] = useState(false);
  const [selectFriday, setSelectFriday] = useState(false);
  const [selectSaturday, setSelectSaturday] = useState(false);
  const [modalVisiblecamera, setModalVisiblecamera] = useState(false);

  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isSelectStartTimePickerVisible, setSelectStartTimePickerVisibility] =
    useState(false);
  const [isSelectEndTimePickerVisible, setSelectEndTimePickerVisibility] =
    useState(false);
  const [imageSelectedData, setImageSelectedData] = useState('');
  const [imageSelectedDataFlatelist, setImageSelectedDataFlatelist] =
    useState('');
  const [SelectStartTime, setSelectStartTime] = useState('');
  const [SelectEndTime, setSelectEndTime] = useState('');
  const [SelectEndDate, setSelectEndDate] = useState('');
  const [SelectStartDate, setSelectStartDate] = useState('');
  const [SelectCampaignStartDate, setSelectCampaignStartDate] = useState('');
  const [SelectCampaignEndDate, setSelectCampaignEndDate] = useState('');
  const [totalMessageCountAdd, setTotalMessageCountAdd] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [IsCampaignStartDateVisible, setIsCampaignStartDateVisible] =
    useState(false);
  const [IsCampaignEndDateVisible, setIsCampaignEndDateVisible] =
    useState(false);
  const [showclender, setshowclender] = useState(false);
  const [showinterval, setshowinterval] = useState(true);
  const [DataNetwork, setDataNetwork] = useState('');
  const [intervalTypeCustom, setIntervalTypeCustom] = useState('');
  const [selectIntervalTypeForDays, setSelectIntervalTypeForDays] =
    useState('');
  const [noOfDayRepeateInTime, setNoOfDayRepeateInTime] = useState('');
  const [scheduleMessageCount, setScheduleMessageCount] = useState('');
  const [intervalValue, setIntervalValue] = useState('');
  const [networkData, setNetworkData] = useState('');
  const [networkSelectedData, setNetworkSelectedData] = useState('');
  const [networkFinalData, setNetworkFinalData] = useState('');
  const [networksDetail, setNetworksDetail] = useState('');
  const [totalNetworkSelect, setTotalNetworkSelect] = useState('');
  const [scheduleListAddArray, setScheduleListAddArray] = useState('');
  const [scheduleListAddArrayZZZ, setScheduleListAddArrayZZZ] = useState('');
  const [checkUpdateData, setCheckUpdateData] = useState('');
  const [arr, setArr] = useState([]);
  const [weekendDayList, setWeekendDayList] = useState([]);
  const [selectedWeekDayList, setSelectedWeekDayList] = useState([]);
  const [selectStatusValue, setSelectStatusValue] = useState(1);
  const [selectAutoGenerateValue, setSelectAutoGenerateValue] = useState(1);
  const [
    selectAutoGenerateEnabled_Disabled,
    setSelectAutoGenerateEnabled_Disabled,
  ] = useState(false);
  const [selectIntervalTypeVal, setSelectIntervalTypeVal] = useState([]);
  const [selectCountryVal, setSelectCountryVal] = useState('');
  const [selectCountryId, setSelectCountryId] = useState('');
  const [selectStateId, setSelectStateId] = useState('');
  const [selectStateVal, setSelectStateVal] = useState([]);
  const [selectCountry, setSelectCountry] = useState([]);
  const [selectState, setSelectState] = useState([]);
  const [selectedNetworkShowBudget, setSelectedNetworkShowBudget] =
    useState('');
  const [orgCurrencyName, setOrgCurrencyName] = useState('');
  const [orgCurrencyId, setOrgCurrencyId] = useState('');
  const [startDateForAlert, setStartDateForAlert] = useState('');
  const [endDateForAlert, setEndDateForAlert] = useState('');
  const [campaignIdForEdit, setCampaignIdForEdit] = useState('');
  const [img, setimg] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [img1, setimg1] = useState('');
  const [permissionVisible, setpermissionVisible] = useState(false);
  const hidepermission = () => {
    setpermissionVisible(false);
  };
  const confirmpermission = () => {
    setpermissionVisible(false);
    Linking.openSettings();
  };

  const [addScheduleVisible, setAddScheduleVisible] = useState(false);
  const [deleteScheduleVisible, setDeleteScheduleVisible] = useState(false);
  const hideAddSchedule = () => {
    setAddScheduleVisible(false);
  };
  const hideDeleteSchedule = () => {
    setDeleteScheduleVisible(false);
  };
  const Statustype = [
    {value: 0, label: 'Active'},
    {value: 1, label: 'Paused'},
    {value: 2, label: 'Cancelled'},
  ];

  const IntervalType = [
    {id: 1, name: 'One Time'},
    {id: 2, name: 'Daily'},
    {id: 3, name: 'Weekly'},
    {id: 4, name: 'Monthly'},
    {id: 5, name: 'Yearly'},
    {id: 6, name: 'Custom'},
  ];

  function selectType(value) {
    setSelectStatus(value);
    setCampaignStatus(value);
    if (value == 0) {
      setshowclender(true);
      setshowinterval(false);
    } else {
      setshowclender(false);
      setshowinterval(true);
    }
  }
  function selectAutoGenerateClick() {
    if (selectAutoGenerateEnabled_Disabled == true) {
      setSelectAutoGenerateEnabled_Disabled(false);
      setSelectAutoGenerate(0);
    }
    if (selectAutoGenerateEnabled_Disabled == false) {
      setSelectAutoGenerateEnabled_Disabled(true);
      setSelectAutoGenerate(1);
    }
    //
  }
  function CancelClick() {
    setVisible(true);
    global.UpdateCampaign = 0;
  }
  const hide = () => {
    setVisible(false);
  };
  const confirm = () => {
    setVisible(false);
    props.navigation.goBack();
  };
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
    loadInitialData();
  }, []);
  /**************************************** validation ************************************************/
  const loadInitialData = async () => {
    try {
      if (isAuthenticated) {
        const networks = await lovs['mybundlings'];
        const bmtLovs = await lovs['bmtlovs'];
        console.log({networks});
        setUserId(user.id);
        setDataNetwork(networks);
        if (global.UpdateCampaign == 1) {
          UpdateCampaignDetail(networks);
        }
        setSelectState(bmtLovs.states);
        setSelectIntervalTypeVal(bmtLovs.intervals);
        setSelectCountry(bmtLovs.countries);
        setOrganizationId(user.orgid);
      } else {
        props.navigation.replace('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  //const MakeBudget = () => {
  const MakeBudget = async () => {
    try {
      const startDateAsync = await AsyncStorage.getItem('startDate');
      const endDateAsync = await AsyncStorage.getItem('endDate');
      const IntervalValSelect = await AsyncStorage.getItem('SelectIntervalVal');
      const SelectIntervalTypeIdVal = await AsyncStorage.getItem(
        'selectIntervalTypeId',
      );

      if (startDateAsync.length <= 0) {
        var StartDatePick = SelectCampaignStartDate;
      } else {
        var StartDatePick = new Date(startDateAsync);
      }
      if (endDateAsync.length <= 0) {
        var EndDatePick = SelectCampaignEndDate;
      } else {
        //var EndDatePick = SelectEndDate;
        var EndDatePick = new Date(endDateAsync);
      }

      setStartDateForAlert(StartDatePick);
      setEndDateForAlert(EndDatePick);
      //
      //ScheduleStartEndDate();
      AsyncStorage.getItem('WeekendDayDataList').then(function (res) {
        if (AsyncStorage != null) {
          let Asyncdata = JSON.parse(res);
          var selectedWeekDayListVal = Asyncdata;
          console.log(
            'Asyncdata selectedWeekDayListVal  ',
            JSON.stringify(selectedWeekDayListVal),
          );
        } else {
          console.log(
            'Asyncdata selectedWeekDayListVal empty  ',
            JSON.stringify(selectedWeekDayListVal),
          );
        }
        if (networkSelectSocialMedia.length <= 0) {
          console.log(
            'networkSelectSocialMedia.length <=0 ',
            networkSelectSocialMedia.length <= 0,
          );
          //return;
        }
        let weekdays = 0;
        let RepeatDay = 0;
        const currentDate = new Date(StartDatePick);
        while (currentDate <= EndDatePick) {
          const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
          if (dayOfWeek >= 1 && dayOfWeek <= 6) {
            weekdays++;
          }
          if (dayOfWeek === selectedWeekDayListVal - 1) {
            RepeatDay++;
          }
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
          setNoOfDayRepeateInTime(RepeatDay);
          var DayRepeatInSelectDate = RepeatDay;
        }

        console.log(
          'DayRepeatInSelectDate DayRepeatInSelectDate DayRepeatInSelectDate ',
          DayRepeatInSelectDate,
        );

        if (
          SelectIntervalTypeIdVal == '' ||
          SelectIntervalTypeIdVal == 1 ||
          SelectIntervalTypeIdVal == 3 ||
          SelectIntervalTypeIdVal == 4 ||
          SelectIntervalTypeIdVal == 5
        ) {
          const startDate = StartDatePick;
          const endDate = EndDatePick;

          //var Difference_In_Time = endDate.getTime() - startDate.getTime();
          var Difference_In_Days =
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
          //var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
          var TotalNumberSelect = Math.round(Difference_In_Days);

          setSelectTotalDays(TotalNumberSelect);
          let weekdays = 0;
          let RepeatDay = 0;
          const currentDate = new Date(startDate);
          while (currentDate <= endDate) {
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            //
            if (dayOfWeek >= 1 && dayOfWeek <= 6) {
              weekdays++;
            }
            //if (dayOfWeek === value-1) {
            if (dayOfWeek === selectedWeekDayListVal - 1) {
              RepeatDay++;
            }
            currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
            //
            //
            //
            setNoOfDayRepeateInTime(RepeatDay);
            var DayRepeatInSelectDate = RepeatDay;
          }
        }

        if (selectedWeekDayListVal == null || selectedWeekDayListVal == '') {
        } else {
          const multipliedArray = selectedWeekDayListVal.length;
        }

        if (SelectIntervalTypeIdVal == 6) {
          const startDate = StartDatePick;
          const endDate = EndDatePick;
          var Difference_In_Days =
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
          var TotalNumberSelect = Math.round(Difference_In_Days);
          console.log(
            'TotalNumberSelect TotalNumberSelect  ' + TotalNumberSelect,
          );
          //
          console.log(
            'multipliedArray multipliedArray  ' + selectedWeekDayListVal,
          );
          const multipliedArray = selectedWeekDayListVal.length;

          var TotalHours = 1440;
          //var result = TotalHours / intervalVal;
          var result = TotalHours / IntervalValSelect;

          var GetValue = TotalNumberSelect * result;

          var GetTotalValue = GetValue * multipliedArray;

          //const result = TotalHours / intervalVal;
          // const resultAdd = result * noOfDayRepeateInTime;
          //var TotalCampaignBudget =  resultAdd * multipliedArray;
          var TotalCampaignBudget = Math.round(GetTotalValue);

          if (
            TotalCampaignBudget == '' ||
            TotalCampaignBudget == 'Infinity' ||
            TotalCampaignBudget == null ||
            isNaN(TotalCampaignBudget)
          ) {
            setScheduleMessageCount(0);
          } else {
            setScheduleMessageCount(TotalCampaignBudget);
          }
          //if(TotalCampaignBudget > )
        }
        if (SelectIntervalTypeIdVal == 2) {
          const startDate = StartDatePick;
          const endDate = EndDatePick;

          //let currentDate = new Date(startDate);
          // var Difference_In_Time = endDate.getTime() - startDate.getTime();
          var Difference_In_Days =
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);
          var TotalNumberSelect = Math.round(Difference_In_Days);

          if (selectedWeekDayListVal == null || selectedWeekDayListVal == '') {
            console.log(
              'selectedWeekDayListVal empty ',
              selectedWeekDayListVal,
            );
            var multipliedArray = 0;
          } else {
            var multipliedArray = selectedWeekDayListVal.length;
          }
          if (multipliedArray == 1) {
            console.log(
              'multipliedArray ==1 multipliedArray ==1 ',
              multipliedArray,
            );

            // var GetTotalValue = TotalNumberSelect * multipliedArray;
            // var TotalCampaignBudget =  Math.round(GetTotalValue);
            // var GetTotalValue = DayRepeatInSelectDate;
            var TotalCampaignBudget = DayRepeatInSelectDate;

            if (
              TotalCampaignBudget == '' ||
              TotalCampaignBudget == 'Infinity' ||
              TotalCampaignBudget == null ||
              isNaN(TotalCampaignBudget)
            ) {
              console.log(
                'TotalCampaignBudget empty 444 ' + TotalCampaignBudget,
              );
              setScheduleMessageCount(0);
            } else {
              //
              setScheduleMessageCount(TotalCampaignBudget);
            }
          } else {
            var GetValue = TotalNumberSelect / 7;
            var GetTotalValue = GetValue * multipliedArray;
            //var TotalCampaignBudget =  Math.round(GetTotalValue);
            var TotalCampaignBudget = Math.round(GetTotalValue);

            if (
              TotalCampaignBudget == '' ||
              TotalCampaignBudget == Infinity ||
              TotalCampaignBudget == null ||
              isNaN(TotalCampaignBudget)
            ) {
              console.log(
                'TotalCampaignBudget empty 444 ' + TotalCampaignBudget,
              );
              setScheduleMessageCount('0');
            } else {
              if (multipliedArray == 0) {
                setScheduleMessageCount('0');
                return;
              }
              setScheduleMessageCount(TotalCampaignBudget);
            }
          }
        }
        if (SelectIntervalTypeIdVal == 3) {
          console.log(
            'SelectIntervalTypeIdVal ==3 *****************************',
          );

          if (selectedWeekDayListVal == null || selectedWeekDayListVal == '') {
            setScheduleMessageCount('0');
          } else {
            console.log(
              'selectedWeekDayListVal ',
              selectedWeekDayListVal.length,
            );

            const TotalCampaignBudget =
              selectedWeekDayListVal.length * DayRepeatInSelectDate;

            setScheduleMessageCount(TotalCampaignBudget);
          }
        }
        if (SelectIntervalTypeIdVal == 4) {
          console.log(
            'SelectIntervalTypeIdVal ==4 ***************************** ',
          );

          if (selectedWeekDayListVal == null || selectedWeekDayListVal == '') {
            setScheduleMessageCount('0');
          } else {
            console.log(
              'selectedWeekDayListVal ',
              selectedWeekDayListVal.length,
            );

            var GetTotalValue = TotalNumberSelect / 30;
            const TotalCampaignBudget = Math.round(GetTotalValue);

            setScheduleMessageCount(TotalCampaignBudget);
          }
        }
        if (SelectIntervalTypeIdVal == 5) {
          console.log(
            'SelectIntervalTypeIdVal ==5 ***************************** ',
          );
          if (selectedWeekDayListVal == null || selectedWeekDayListVal == '') {
            setScheduleMessageCount('0');
          } else {
            if (selectedWeekDayListVal == 1) {
              setScheduleMessageCount(1);
            } else {
              var GetTotalValue = TotalNumberSelect / 360;
              const TotalCampaignBudget =
                selectedWeekDayListVal.length * DayRepeatInSelectDate;

              setScheduleMessageCount(TotalCampaignBudget);
            }
          }
        }
        if (SelectIntervalTypeIdVal == 1) {
          if (selectedWeekDayListVal == null || selectedWeekDayListVal == '') {
            setScheduleMessageCount('0');
          } else {
            setScheduleMessageCount(1);
          }
        }
        //
        //networkEditWithScheduleDisabled, setNetworkEditWithScheduleDisabled
        if (networkEditWithScheduleDisabled == true) {
          console.log(
            'networkSelectSocialMedia networkSelectSocialMedia if ' +
              JSON.stringify(networkSelectSocialMedia),
          );
          console.log(
            'filteredNames networkUpdateSelected ' +
              JSON.stringify(networkUpdateSelected),
          );
          var filteredNames = networkSelectSocialMedia
            ? networkSelectSocialMedia
                .filter(item => item.purchasedQouta < TotalCampaignBudget)
                .map(item => item.desc)
            : [];
        } else {
          console.log(
            'filteredNames networkUpdateSelected ' +
              JSON.stringify(networkUpdateSelected),
          );
          var filteredNames = networkUpdateSelected
            ? networkUpdateSelected
                .filter(item => item.purchasedQouta < TotalCampaignBudget)
                .map(item => item.desc)
            : [];
        }
        if (filteredNames.length > 0) {
          if (
            TotalCampaignBudget == '' ||
            TotalCampaignBudget == 'Infinity' ||
            TotalCampaignBudget == null ||
            isNaN(TotalCampaignBudget)
          ) {
            console.log(
              'TotalCampaignBudget empty alert ' + TotalCampaignBudget,
            );
            setScheduleMessageCount(0);
            setAddScheduleButton(true);
          } else {
            setScheduleMessageCount(TotalCampaignBudget);
            setAddScheduleButton(false);
            const message = filteredNames;
            alert(
              'Select ' +
                TotalCampaignBudget +
                ' quota is greater than ' +
                message +
                ' network quota! Please Purchase network quota.',
            );
          }
        } else {
          setAddScheduleButton(true);
        }
        if (networkSelectSocialMedia.length <= 0) {
          const filteredData = networkSelectSocialMedia
            ? networkSelectSocialMedia.filter(
                item => item.purchasedQouta < TotalCampaignBudget,
              )
            : [];
          console.log('filteredData if ' + JSON.stringify(filteredData));
        } else {
          const filteredData = networkUpdateSelected
            ? networkUpdateSelected?.filter(
                item => item.purchasedQouta < TotalCampaignBudget,
              )
            : [];
          console.log('filteredData ' + JSON.stringify(filteredData));
        }
      });
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  };
  const SelectIntervalClick = async value => {
    AsyncStorage.removeItem('WeekendDayDataList');
    setScheduleMessageCount('');
    setWeekendDayList('');
    setSelectSunday(false);
    setSelectMonday(false);
    setSelectTuesday(false);
    setSelectWednesday(false);
    setSelectThursday(false);
    setSelectFriday(false);
    setSelectSaturday(false);
    setSelectIntervalTypeForDays(IntervalType[value].id);
    var SelectIntervalTypeIdVal = IntervalType[value].id.toString();
    await AsyncStorage.setItem('selectIntervalTypeId', SelectIntervalTypeIdVal);
    if (IntervalType[value].id == 6) {
      setIntervalValDisabled(true);
      setIntervalTypeCustom(IntervalType[value].id);
      setIntervalVal('60');
      await AsyncStorage.setItem('SelectIntervalVal', '60');
      MakeBudget();
    } else {
      setIntervalValDisabled(false);
      setIntervalVal('0');
      await AsyncStorage.setItem('SelectIntervalVal', '0');
      setSelectIntervalTypeForDays(IntervalType[value].id);
      MakeBudget();
    }
    setSelectIntervalType(value);
    setSelectIntervalTypeId(IntervalType[selectIntervalType].id);
  };
  function SelectCountryClick(value) {
    console.log('selectCountry  ' + JSON.stringify(selectCountry));
    console.log('selectCountry  ' + JSON.stringify(selectCountry[value].id));
    setSelectCountryVal(value);
    setSelectCountryId(selectCountry[value].id);
  }
  function SelectStateClick(value) {
    //
    //console.log('selectState  ' + JSON.stringify(selectState));
    console.log('selectState  ' + JSON.stringify(selectState[value].id));
    setSelectStateVal(value);
    setSelectStateId(selectState[value].id);
  }

  const UpdateCampaignDetail = async AllNetworkList => {
    const Asyncdata = props.route.params.campaign;
    console.log({Asyncdata});
    if (Asyncdata != null) {
      var currentdate = new Date();
      console.log(
        'CampaignUpdate CampaignUpdate detail ' + JSON.stringify(Asyncdata),
      );
      console.log(
        'AllNetworkList AllNetworkList  ' + JSON.stringify(AllNetworkList),
      );

      var UpdateCampaign = Asyncdata.data;
      setSelectCampaignStartDate(UpdateCampaign.startTime);
      setSelectCampaignEndDate(UpdateCampaign.finishTime);
      setHashtag(UpdateCampaign.hashTags);
      setSubject(UpdateCampaign.name);
      setCampaignIdForEdit(UpdateCampaign.id);
      setHashtag(UpdateCampaign.hashTags);
      settemplate(UpdateCampaign.description);
      setSelectStartDate(UpdateCampaign.startTime);
      setSelectEndDate(UpdateCampaign.finishTime);
      setTotalBudget(UpdateCampaign.totalBudget);
      var AutoGenerate = 1;
      if (AutoGenerate == 1) {
        setSelectAutoGenerateEnabled_Disabled(true);
      } else {
        setSelectAutoGenerateEnabled_Disabled(false);
      }
      setSelectAutoGenerate(AutoGenerate);
      var MyStatus = 2;
      setSelectStatusValue(MyStatus);
      var Campaignschedule = JSON.stringify(Asyncdata.data.compaignschedules);
      if (Asyncdata.data.attachments.length <= 0) {
        console.log(
          'Asyncdata.data.attachments.length if ' +
            Asyncdata.data.attachments.length,
        );
        var attachmentData = '';
      } else {
        console.log(
          'Asyncdata.data.attachments.length ' +
            Asyncdata.data.attachments.length,
        );
        var attachmentData = JSON.parse(Asyncdata.data.attachments);
        console.log('attachmentData ' + JSON.stringify(attachmentData));
        //
        const namesArray = attachmentData.map(item => item.image.split('.')[1]);
        console.log('namesArray ' + JSON.stringify(namesArray));
        if (
          attachmentData.find(item => item.image.split('.')[1] === 'pdf') ==
            null ||
          attachmentData.find(item => item.image.split('.')[1] === 'pdf') == ''
        ) {
        } else {
          var FoundElementPdf = attachmentData.find(
            item => item.image.split('.')[1] === 'pdf',
          );
          setPdfUri(FoundElementPdf.image);
        }
        var FoundElementMP4 = attachmentData.find(
          item => item.image.split('.')[1] === 'mp4',
        );
        if (attachmentData.find(item => item.image.split('.')[1] == 'png')) {
          var FoundElement = attachmentData.find(
            item => item.image.split('.')[1] === 'png',
          );
        }
        if (attachmentData.find(item => item.image.split('.')[1] == 'jpg')) {
          var FoundElement = attachmentData.find(
            item => item.image.split('.')[1] === 'jpg',
          );
        }
        if (attachmentData.find(item => item.image.split('.')[1] == 'BMP')) {
          var FoundElement = attachmentData.find(
            item => item.image.split('.')[1] === 'BMP',
          );
        }
        if (attachmentData.find(item => item.image.split('.')[1] == 'WEBP')) {
          var FoundElement = attachmentData.find(
            item => item.image.split('.')[1] === 'WEBP',
          );
        }

        console.log(
          'attachmentData name ',
          attachmentData[0].image.split('.')[1],
        );
        console.log(
          'attachmentData type ',
          attachmentData[0].image.split('.')[1],
        );
        var AttachmentForEdit = attachmentData.map(item => {
          if (
            item.image.split('.')[1] == 'mp4' ||
            item.image.split('.')[1] == 'pdf'
          ) {
            if (item.image.split('.')[1] == 'mp4') {
              return {
                id: item.Id,
                ImageId: item.image.split('/')[2].split('.')[0],
                fileName: item.image.split('/')[2],
                uri:
                  servicesettings.Imagebaseuri +
                  item.image
                    .replace(/\\/g, '/')
                    .replace(',', '')
                    .replace(' //', ''),
                height: '',
                fileType: 'video/' + item.image.split('.')[1],
              };
            }
            if (item.image.split('.')[1] == 'pdf') {
              return {
                id: item.Id,
                ImageId: item.image.split('/')[2].split('.')[0],
                fileName: item.image.split('/')[2],
                uri:
                  servicesettings.Imagebaseuri +
                  item.image
                    .replace(/\\/g, '/')
                    .replace(',', '')
                    .replace(' //', ''),
                height: '',
                fileType: 'application/' + item.image.split('.')[1],
              };
            }
          } else {
            return {
              id: item.Id,
              ImageId: item.image.split('/')[2].split('.')[0],
              fileName: item.image.split('/')[2],
              uri:
                servicesettings.Imagebaseuri +
                item.image
                  .replace(/\\/g, '/')
                  .replace(',', '')
                  .replace(' //', ''),
              //uri: item.image,
              height: '',
              fileType: 'image/' + item.image.split('.')[1],
            };
          }
        });

        global.EditAttachment = 2;

        setImageSelectedDataFlatelist(AttachmentForEdit);
        setImageSelectedData(AttachmentForEdit);

        var VideoUriLink = servicesettings.Imagebaseuri + FoundElementMP4.image;

        setVideouri(VideoUriLink);
      }
      console.log(
        'ScheduleDataUpdate ScheduleDataUpdate ',
        Asyncdata.data.compaignschedules.length,
      );
      if (Asyncdata.data.compaignschedules.length <= 0) {
        console.log(
          'Asyncdata.data.attachments.length if ' +
            Asyncdata.data.attachments.length,
        );
      } else {
        var ScheduleDataUpdate = JSON.parse(Asyncdata.data.compaignschedules);
        console.log(
          'ScheduleDataUpdate ScheduleDataUpdate ' +
            JSON.stringify(ScheduleDataUpdate),
        );
        compaignExecutionSchedulesFlatlist.push({ScheduleDataUpdate});

        var ScheduleDataEdit = ScheduleDataUpdate.map(item => {
          return {
            id: item.id,
            randomId: item.id,
            rowVer: 0,
            networkId: item.NetworkId,
            interval: item.Interval,
            intervaltypename: item.intervaltypename,
            intervalTypeId: item.IntervalTypeId,
            compaignDetailId: item.CompaignDetailId,
            status: 1,
            budget: item.budget,
            messageCount: item.MessageCount,
            //days: item.days,
            days: item.days.split(',').map(numberStr => parseInt(numberStr)),
            startTime: item.StartTime,
            finishTime: item.FinishTime,
            scheduleStartTime: item.StartTime,
            scheduleEndTime: item.FinishTime,
          };
        });

        console.log('NewJson NewJson ' + JSON.stringify(ScheduleDataEdit));
        setScheduleListAddArray(ScheduleDataEdit);
        setScheduleListAddArrayZZZ(ScheduleDataEdit);
      }

      var NetworkDetailList = JSON.parse(Asyncdata.data.compaignsdetails);
      console.log(
        'DataNetwork DataNetwork DataNetwork ',
        JSON.stringify(DataNetwork),
      );
      var networkcount = NetworkDetailList;

      let counter = 0;
      for (let i = 0; i < networkcount.length; i++) {
        if (networkcount[i].networkId != '') counter++;
      }
      setNetworkCount(counter);

      var Allprops = [
        'id',
        'networkId',
        'orgId',
        'status',
        'name',
        'networkName',
        'networkDesc',
        'bufferQuota',
        'orgId',
        'purchasedQouta',
        'unitPriceInclTax',
        'usedQuota',
      ];
      var resultAllNetwork = AllNetworkList.filter(function (o1) {
        return NetworkDetailList.some(function (o2) {
          return o1.networkId === o2.networkId;
        });
      }).map(function (o) {
        return Allprops.reduce(function (newo, name) {
          newo[name] = o[name];
          return newo;
        }, {});
      });

      console.log('NetworkDetailList ' + JSON.stringify(NetworkDetailList));
      // var NetworkJson = resultAllNetwork.map((item) => {
      var NetworkJson = resultAllNetwork.map(item => {
        return {
          id: item.id,
          networkId: item.networkId,
          desc: item.networkDesc,
          name: item.networkName,
          purchasedQouta: item.purchasedQouta,
          unitPriceInclTax: item.unitPriceInclTax,
          usedQuota: item.usedQuota,
          rowVer: 0,
          compaignId: 0,
          status: Number(item.status),
          createdBy: Number(userId),
          lastUpdatedBy: Number(userId),
          createdAt: moment.utc(NetworkDetailList.createdAt).format(),
          lastUpdatedAt: moment.utc(currentdate).format(),
        };
      });

      console.log('NetworkJson data ' + JSON.stringify(NetworkJson));

      setNetworkData(NetworkJson);
      setNetworkFinalData(NetworkJson);
    }
  };

  function checkTextInputRecord() {
    if (Subject.trim() == '') {
      Toast.show('Please enter campaign subject');
      return;
    }
    if (template.trim() == '') {
      Toast.show('Please enter campaign template');
      return;
    }
    if (SelectCampaignStartDate <= 0) {
      Toast.show('Please select valid campaign start date');
      return;
    }
    if (SelectCampaignEndDate <= 0) {
      Toast.show('Please select valid campaign end date');
      return;
    }
    console.log(
      'imageSelectedData.length AttatchmentVideo ',
      imageSelectedData,
    );

    setIndex(1);
  }

  function handlePress(index) {
    if (index == 1) {
      checkTextInputRecord();
      console.log('NextAddSchedule  ' + JSON.stringify(networkData));
    }
    if (index == 2) {
      NextAddSchedule();
      // AddScheduleClick();
      //setIndex(index)
    }
    if (index == 0) {
      setIndex(index);
    }
  }

  const compaignExecutionSchedules = [];
  const compaignExecutionSchedulesFlatlist = [];
  const confirmAddSchedule = () => {
    setAddScheduleVisible(false);
    ScheduleSummaryListClick();
  };
  const confirmDeleteSchedule = () => {
    setDeleteScheduleVisible(false);
    AddScheduleClick();
    ScheduleSummaryListClick();
    checkdataclick();
  };
  const CallCampaignData = async () => {
    var allweekDays = weekendDayList;
    console.log(
      'networkFinalData networkFinalData 584 ',
      networkSelectSocialMedia,
    );

    if (checkUpdateData.randomId == '' || checkUpdateData.randomId == null) {
      var randomIdSchedule = Math.floor(100000 + Math.random() * 900000);
      await networkSelectSocialMedia.map(
        nwk => (
          console.log('nwk ', nwk),
          setScheduleListAddArray(prevv => [
            ...prevv,
            {
              id: 0,
              rowVer: 0,
              budget: nwk.unitPriceInclTax * scheduleMessageCount,
              messageCount: scheduleMessageCount,
              orgId: Number(organizationId),
              days: allweekDays == '' || allweekDays == null ? '' : allweekDays,
              networkId: nwk == '' || nwk == null ? '' : nwk.networkId,
              compaignDetailId: 0,
              isFixedTime: IntervalType[selectIntervalType].id == 1 ? 1 : 0,
              startTime: moment
                .utc(
                  SelectStartDate == ''
                    ? SelectCampaignStartDate
                    : SelectStartDate,
                )
                .format('yyyy-MM-DDTHH:mm:ss'),
              finishTime: moment
                .utc(
                  SelectEndDate == '' ? SelectCampaignEndDate : SelectEndDate,
                )
                .format('yyyy-MM-DDTHH:mm:ss'),
              interval: Number(intervalVal),
              status: 1,
              intervalTypeId: IntervalType[selectIntervalType].id,
              randomId: randomIdSchedule,
              CompaignNetworks: networkSelectSocialMedia,
            },
          ]),
          setScheduleListAddArrayZZZ(prevv => [
            ...prevv,
            {
              id: 0,
              rowVer: 0,
              budget: nwk.unitPriceInclTax * scheduleMessageCount,
              messageCount: scheduleMessageCount,
              orgId: Number(organizationId),
              days: allweekDays == '' || allweekDays == null ? '' : allweekDays,
              networkId: nwk == '' || nwk == null ? '' : nwk.networkId,
              compaignDetailId: 0,
              isFixedTime: IntervalType[selectIntervalType].id == 1 ? 1 : 0,
              startTime: moment
                .utc(
                  SelectStartDate == ''
                    ? SelectCampaignStartDate
                    : SelectStartDate,
                )
                .format('yyyy-MM-DDTHH:mm:ss'),
              finishTime: moment
                .utc(
                  SelectEndDate == '' ? SelectCampaignEndDate : SelectEndDate,
                )
                .format('yyyy-MM-DDTHH:mm:ss'),
              interval: Number(intervalVal),
              status: 1,
              intervalTypeId: IntervalType[selectIntervalType].id,
              randomId: randomIdSchedule,
              CompaignNetworks: networkSelectSocialMedia,
            },
          ]),
          ClearDataAfterAddSchedule()
        ),
      );
    } else {
      console.log(
        'xxxxxxxx  edit schedule ',
        JSON.stringify(checkUpdateData.props),
      );
      var randomIdSchedule = checkUpdateData.randomId;
      var editId = checkUpdateData.props.id;
      var compaignDetailIdEdit = checkUpdateData.props.compaignDetailId;
      var updateCheduleist = scheduleListAddArray.filter(
        (e, i) => e.randomId !== checkUpdateData.randomId,
      );
      var updateCheduleistZZZ = scheduleListAddArrayZZZ.filter(
        (e, i) => e.randomId !== checkUpdateData.randomId,
      );
      setScheduleListAddArray(updateCheduleist);
      setScheduleListAddArrayZZZ(updateCheduleistZZZ);
      await networkSelectSocialMedia.map(
        nwk => (
          setScheduleListAddArray(prevv => [
            ...prevv,
            {
              id: editId == '' || editId == null ? 0 : editId,
              rowVer: 0,
              budget: nwk.unitPriceInclTax * scheduleMessageCount,
              messageCount: scheduleMessageCount,
              orgId: Number(organizationId),
              days: allweekDays == '' || allweekDays == null ? '' : allweekDays,
              networkId: nwk == '' || nwk == null ? '' : nwk.networkId,
              compaignDetailId:
                compaignDetailIdEdit == '' || compaignDetailIdEdit == null
                  ? 0
                  : compaignDetailIdEdit,
              isFixedTime: IntervalType[selectIntervalType].id == 1 ? 1 : 0,
              startTime: moment
                .utc(
                  SelectStartDate == ''
                    ? SelectCampaignStartDate
                    : SelectStartDate,
                )
                .format('yyyy-MM-DDTHH:mm:ss'),
              finishTime: moment
                .utc(
                  SelectEndDate == '' ? SelectCampaignEndDate : SelectEndDate,
                )
                .format('yyyy-MM-DDTHH:mm:ss'),
              interval: Number(intervalVal),
              status: 1,
              intervalTypeId: IntervalType[selectIntervalType].id,
              randomId: randomIdSchedule,
              CompaignNetworks: networkSelectSocialMedia,
            },
          ]),
          setScheduleListAddArrayZZZ(prevv => [
            ...prevv,
            {
              id: editId == '' || editId == null ? 0 : editId,
              rowVer: 0,
              budget: nwk.unitPriceInclTax * scheduleMessageCount,
              messageCount: scheduleMessageCount,
              orgId: Number(organizationId),
              days: allweekDays == '' || allweekDays == null ? '' : allweekDays,
              networkId: nwk == '' || nwk == null ? '' : nwk.networkId,
              compaignDetailId:
                compaignDetailIdEdit == '' || compaignDetailIdEdit == null
                  ? 0
                  : compaignDetailIdEdit,
              isFixedTime: IntervalType[selectIntervalType].id == 1 ? 1 : 0,
              startTime: moment
                .utc(
                  SelectStartDate == ''
                    ? SelectCampaignStartDate
                    : SelectStartDate,
                )
                .format('yyyy-MM-DDTHH:mm:ss'),
              finishTime: moment
                .utc(
                  SelectEndDate == '' ? SelectCampaignEndDate : SelectEndDate,
                )
                .format('yyyy-MM-DDTHH:mm:ss'),
              interval: Number(intervalVal),
              status: 1,
              intervalTypeId: IntervalType[selectIntervalType].id,
              randomId: randomIdSchedule,
              CompaignNetworks: networkSelectSocialMedia,
            },
          ]),
          console.log(
            'scheduleListAddArrayZZZ after update ',
            scheduleListAddArrayZZZ,
          ),
          ClearDataAfterAddSchedule()
        ),
      );
    }
    compaignExecutionSchedulesFlatlist.push({
      id: 0,
      rowVer: 0,
      days: allweekDays == '' || allweekDays == null ? '' : allweekDays,
      networkId:
        networksDetail == '' || networksDetail == null
          ? ''
          : networksDetail[0].networkId,
      compaignDetailId: 0,
      isFixedTime: selectStatus == 1 ? 1 : 0,
      startTime: moment
        .utc(SelectStartDate == '' ? SelectCampaignStartDate : SelectStartDate)
        .format('yyyy-MM-DDTHH:mm:ss'),
      finishTime: moment
        .utc(SelectEndDate == '' ? SelectCampaignEndDate : SelectEndDate)
        .format('yyyy-MM-DDTHH:mm:ss'),
      interval: Number(intervalVal),
      status: selectStatus == null || selectStatus == '' ? 1 : selectStatus,
      intervalTypeId: IntervalType[selectIntervalType].id,
      randomId: randomIdSchedule,
    });
    console.log(
      'compaignExecutionSchedulesFlatlist ',
      compaignExecutionSchedulesFlatlist,
    );
  };
  const checkdataclick = () => {
    console.log('checkdataclick new ', JSON.stringify(scheduleListAddArray));
    //if(scheduleListAddArray =='' || scheduleListAddArray == null ){
    if (scheduleListAddArrayZZZ == '' || scheduleListAddArrayZZZ == null) {
    }
    //else if(scheduleListAddArray !='' || scheduleListAddArray != null ){
    else if (scheduleListAddArrayZZZ != '' || scheduleListAddArrayZZZ != null) {
      const removeDuplicates = (mydataCheck, key) => {
        return [
          ...new Map(mydataCheck.map(item => [item[key], item])).values(),
        ];
      };
      const uniqueData = removeDuplicates(scheduleListAddArrayZZZ, 'randomId');
      setScheduleData(uniqueData);
      setTotalIndex(uniqueData.length);
      setWeekendDayList('');
      setNetworkFinalData(networkData);
    }
    setAddScheduleDataForSubmit(scheduleListAddArray);
    console.log(
      'scheduleListAddArray scheduleListAddArray ww  ',
      JSON.stringify(scheduleListAddArray),
    );
    console.log(
      'scheduleListAddArrayZZZ scheduleListAddArrayZZZ ',
      JSON.stringify(scheduleListAddArrayZZZ),
    );
    console.log('DataNetwork DataNetwork ', JSON.stringify(DataNetwork));
    console.log('scheduleListAddArray', JSON.stringify(scheduleListAddArray));
    let totalPrice = 0;
    let totalMessageCount = 0;
    let itemCount = 0;
    scheduleListAddArray.forEach(item => {
      totalPrice += item.budget;
      itemCount++;
    });
    scheduleListAddArray.forEach(item => {
      totalMessageCount += item.messageCount;
      totalMessageCount++;
    });
    if (totalPrice == null || totalPrice == '') {
      setTotalBudget(0);
    } else {
      setTotalBudget(totalPrice);
    }
    if (totalMessageCount == null || totalMessageCount == '') {
      setTotalMessageCountAdd(0);
    } else {
      setTotalMessageCountAdd(totalMessageCount);
    }
    // const filteredItemsssss = myBundlingsData.filter(item => item.networkId === 0);
    AsyncStorage.setItem(
      'SubmitDataArray',
      JSON.stringify(scheduleListAddArrayZZZ),
    );
  };

  const AddCampaignClick = async () => {
    setNetworkSelectedAddSchedule(networkFinalData);
    console.log(
      'imageSelectedData Captured Image:',
      JSON.stringify(imageSelectedData),
    );

    if (weekendDayList == '' || weekendDayList == '') {
      Toast.showWithGravity('Please select Day', Toast.LONG, Toast.CENTER);
      return;
    }
    await CallCampaignData();
    if (
      compaignExecutionSchedules == null ||
      compaignExecutionSchedules == ''
    ) {
    }
    var CampaignListDataadd = {
      CompaignNetworks: networkSelectSocialMedia,
      compaignExecutionSchedules: compaignExecutionSchedules,
    };
    console.log(
      'CampaignListDataadd 683 ',
      JSON.stringify(CampaignListDataadd),
    );

    if (CampaignListDataadd == '' || CampaignListDataadd == null) {
    } else {
      setAddScheduleDataForSubmit(
        CampaignListDataadd.compaignExecutionSchedules,
      );
      var networkcount = CampaignListDataadd.CompaignNetworks;

      let counter = 0;
      for (let i = 0; i < networkcount.length; i++) {
        if (networkcount[i].networkId != '') counter++;
      }
      setNetworkCount(counter);
      var schCountval = compaignExecutionSchedulesFlatlist;
      let schcounter = 0;
      for (let i = 0; i < schCountval.length; i++) {
        if (schCountval[i].randomId != '') schcounter++;
      }
      // 6
      setScheduleCount(schcounter);
      if (
        compaignExecutionSchedules == '' ||
        compaignExecutionSchedules == null
      ) {
      } else {
        var IntervalTypeCampaignnew =
          compaignExecutionSchedules[0].intervalTypeId;
        if (IntervalTypeCampaignnew == 1) {
          setIntervalValue('One Time');
        } else if (IntervalTypeCampaignnew == 2) {
          setIntervalValue('Daily');
        } else if (IntervalTypeCampaignnew == 3) {
          setIntervalValue('Weekly');
        } else if (IntervalTypeCampaignnew == 4) {
          setIntervalValue('Monthly');
        } else if (IntervalTypeCampaignnew == 5) {
          setIntervalValue('Yearly');
        } else if (IntervalTypeCampaignnew == 6) {
          setIntervalValue('Custom');
        } else if (IntervalTypeCampaignnew == 7) {
          setIntervalValue('Other');
        }
        setspinner(true);
        ClearDataAfterAddSchedule();
      }
    }
  };
  function ClickSubmitData() {
    checkdataclick();
    AsyncStorage.getItem('SubmitDataArray').then(function (res) {
      let Asyncdata = JSON.parse(res);
      console.log(
        'Asyncdata SubmitDataArray  data ',
        JSON.stringify(Asyncdata),
      );
      var addScheduleDataForSubmit = Asyncdata;
      var discount = 0;
      console.log(
        'addScheduleDataForSubmit click ',
        JSON.stringify(addScheduleDataForSubmit),
      );
      var subimtDataBody = {
        id:
          campaignIdForEdit == '' || campaignIdForEdit == null
            ? 0
            : campaignIdForEdit,
        selectCountryId: Number(selectCountryId),
        selectStateId: Number(selectStateId),
        createdBy: Number(userId),
        lastUpdatedBy: Number(userId),
        status:
          campaignStatus == null || campaignStatus == '' ? 1 : campaignStatus,
        orgId: Number(organizationId),
        hashTags: Hashtag,
        description: template,
        name: Subject,
        title: Subject,
        autoGenerateLeads:
          selectAutoGenerate == null || selectAutoGenerate == ''
            ? 0
            : selectAutoGenerate,
        startTime: moment
          .utc(SelectCampaignStartDate != '' ? SelectCampaignStartDate : '')
          .format(),
        finishTime: moment
          .utc(SelectCampaignEndDate != '' ? SelectCampaignEndDate : '')
          .format(),
        CompaignNetworks: networkFinalData,
        compaignExecutionSchedules: addScheduleDataForSubmit,
        totalBudget: totalBudget,
        discount: discount,
      };
      setspinner(true);
      var headerFetch = {
        method: 'POST',
        body: JSON.stringify(subimtDataBody),
        //body: JSON.stringify(subimtDataBody),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          //'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          // 'Content-Type': 'application/json; charset=utf-8',
          Authorization: servicesettings.AuthorizationKey,
        },
      };

      fetch(servicesettings.baseuri + 'createcompletecompaign', headerFetch)
        .then(response => response.json())
        .then(responseJson => {
          if (responseJson.data != null || responseJson.status != 'true') {
            if (imageSelectedData == null || imageSelectedData == '') {
              console.log('responseJson Image', JSON.stringify(responseJson));
              if (
                responseJson.status == false &&
                responseJson.errorCode == '408'
              ) {
                responseJson.message != ''
                  ? Toast.show(' ' + responseJson.message + ' ')
                  : Toast.show('Data not found');
                setModalVisible(false);
                setspinner(false);
                //setModalSpinner_Load(false);
                return;
              } else if (
                responseJson.status == true &&
                responseJson.errorCode == '200'
              ) {
                responseJson.message != ''
                  ? Toast.show(' ' + responseJson.message + ' ')
                  : Toast.show('Data and file successfully submit');
                setspinner(false);
                setModalVisible(true);
                setTimeout(() => {
                  setModalVisible(false);
                  props.navigation.replace('My Campaigns');
                  //setModalSpinner_Load(false);
                  //props.navigation.replace('Campaign Schedule');
                }, 4000);
              } else {
                responseJson.message != ''
                  ? Toast.show(' ' + responseJson.message + ' ')
                  : Toast.show('Data and file successfully submit');
                setspinner(false);
                setModalVisible(true);
                setTimeout(() => {
                  setModalVisible(false);
                  props.navigation.replace('My Campaigns');
                  //setModalSpinner_Load(false);
                }, 4000);
              }
            } else {
              setspinner(false);

              let ID = responseJson.data;
              const data = new FormData();
              try {
                for (var i = 0; i <= 4; i++) {
                  if (imageSelectedData != '') {
                    data.append('files', {
                      name: imageSelectedData[i].fileName,
                      uri: imageSelectedData[i].uri,
                      type: imageSelectedData[i].fileType,
                    });
                    console.log(
                      ' imgData imgData imgData: ',
                      JSON.stringify(data),
                    );
                  }
                }
              } catch (error) {}
              data.append('compaignid', ID);
              data.append('userid', userId);
              //data.append('userid', Number(Asyncdata[0].id));
              data.append('remarks', 'Remarks Text');
              // console.log('formData uploadpicture',JSON.stringify(data))
              var ImageheaderFetch = {
                enctype: 'multipart/form-data',
                processData: false,
                contentType: false,
                cache: false,
                timeout: 6000,
                method: 'post',
                body: data,
                headers: {
                  Authorization: servicesettings.AuthorizationKey,
                },
              };
              console.log(
                'ImageheaderFetch createcompletecompaign',
                JSON.stringify(ImageheaderFetch),
              );
              fetch(
                servicesettings.baseuri + 'uploadattachments',
                ImageheaderFetch,
              )
                .then(response => response.json())
                .then(responseJson => {
                  console.log(
                    'responseJson Image',
                    JSON.stringify(responseJson),
                  );
                  if (
                    responseJson.status == false &&
                    responseJson.errorCode == '408'
                  ) {
                    responseJson.message != ''
                      ? Toast.show(' ' + responseJson.message + ' ')
                      : Toast.show('Data not found');
                    setModalVisible(false);
                    setspinner(false);
                    //setModalSpinner_Load(false);
                    return;
                  } else if (
                    responseJson.status == true &&
                    responseJson.errorCode == '0'
                  ) {
                    responseJson.message != ''
                      ? Toast.show(' ' + responseJson.message + ' ')
                      : Toast.show('Data and file successfully submit');
                    setspinner(false);
                    setModalVisible(true);
                    setTimeout(() => {
                      setModalVisible(false);
                      props.navigation.replace('My Campaigns');
                    }, 4000);
                  }
                })
                .catch(error => {
                  console.error('uploadpicture error', error);
                  Toast.showWithGravity(
                    'Internet connection failed, try another time !!!',
                    Toast.LONG,
                    Toast.CENTER,
                  );
                  setModalVisible(false);
                  return;
                });
            }
          }
        })
        .catch(error => {
          setspinner(false);
          console.error('createcompletecompaign error', error);
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
          return;
        });
    });
  }
  const ClearDataAfterAddSchedule = async () => {
    AsyncStorage.removeItem('WeekendDayDataList');
    await AsyncStorage.setItem('selectIntervalTypeId', '1');
    AsyncStorage.removeItem('SelectIntervalVal');
    setNetworkEditWithScheduleDisabled(true);
    setWeekendDayList('');
    setCheckUpdateData('');
    setScheduleMessageCount('');
    setNetworkSelectSocialMedia('');
    setSelectStatusValue(0);
    setSelectAutoGenerateValue(0);
    setSelectIntervalType(0);
    setIntervalVal('');
    setSelectStartTime('');
    setSelectEndTime('');
    setSelectEndDate('');
    setSelectStartDate('');
    setSelectStatus('');
    setSelectSunday('');
    setSelectMonday('');
    setSelectTuesday('');
    setSelectWednesday('');
    setSelectThursday('');
    setSelectFriday('');
    setSelectSaturday('');
    setspinner(false);
    setAddScheduleVisible(true);
  };

  function OpencameraClick() {
    console.log(
      'imageSelectedData.length AttatchmentPdf ',
      imageSelectedData.length,
    );
    global.EditAttachment = 1;
    if (imageSelectedData.length >= 3) {
      AttachmentComplate();
    } else {
      Opencamera();
    }
  }
  const Opencamera = () => {
    global.EditAttachment = 1;
    try {
      launchCamera({mediaType: 'photo', includeBase64: true}, response => {
        setModalVisiblecamera(false);
        if (response.assets == undefined || response.assets == '') {
        } else {
          //opencamera();
          // console.log('response else  ')
          //console.log('response response  ' + JSON.stringify(response));
          setimg(response.assets);
          var ImageName = Math.floor(100 + Math.random() * 900).toString();

          var ImageResponseData = response.assets[0];
          var fileTypeMake = ImageResponseData.fileName;
          var uri = ImageResponseData.uri;
          var fileType = ImageResponseData.type;
          var fileNameType = '.' + fileTypeMake.split('.')[1];
          var fileName = ImageName + fileNameType;
          var ImageId = ImageName;
          var height = ImageResponseData.height;
          var base64 = ImageResponseData.base64;
          setImgUriBase64(base64);
          var ImageDetailFlatList = {
            fileName: fileName,
            uri: uri,
            fileType: fileType,
            height: height,
            base64: base64,
            ImageId: ImageId,
          };
          setImageSelectedDataFlatelist(prevv => [
            ...prevv,
            ImageDetailFlatList,
          ]);
          var imageDetail = {
            fileName: fileName,
            uri: uri,
            fileType: fileType,
            height: height,
            ImageId: ImageId,
          };
          setImageSelectedData(prevv => [...prevv, imageDetail]);
          console.log(
            'imageSelectedData Captured Image:',
            JSON.stringify(imageSelectedData),
          );
          console.log(
            'imageSelectedData length : ',
            JSON.stringify(imageSelectedData.length),
          );
          if (imageSelectedData.length <= 1) {
            setModalVisiblecamera(true);
          } else {
            setModalVisiblecamera(false);
          }
        }
      });
    } catch (error) {
      console.log('Message', JSON.stringify(error));
    }
  };
  function OpenGalleryClick() {
    console.log(
      'imageSelectedData.length AttatchmentPdf ',
      imageSelectedData.length,
    );
    if (imageSelectedData.length >= 3) {
      AttachmentComplate();
    } else {
      Opengallery();
    }
  }
  const Opengallery = () => {
    global.EditAttachment = 1;
    try {
      setModalVisiblecamera(false);
      launchImageLibrary(
        {mediaType: 'photo', includeBase64: true},
        response => {
          setModalVisiblecamera(false);
          if (response.assets == undefined || response.assets == '') {
            console.log('response empty  ');
          } else {
            //setModalVisiblecamera(false);
            console.log('response Select img ' + JSON.stringify(response));
            var ImageName = Math.floor(100 + Math.random() * 900).toString();
            //console.log('ImageName img ' + ImageName);
            var ImageResponseData = response.assets[0];
            var fileTypeMake = ImageResponseData.fileName;
            var uri = ImageResponseData.uri;
            var fileType = ImageResponseData.type;
            var fileNameType = '.' + fileTypeMake.split('.')[1];
            //var fileType = ImageResponseDatatype;
            var fileName = ImageName + fileNameType;
            var ImageId = ImageName;
            var height = ImageResponseData.height;
            var base64 = ImageResponseData.base64;
            console.log('imageSelectedData Captured Image: 1706');
            setImgUriBase64(base64);
            var ImageDetailFlatList = {
              fileName: fileName,
              uri: uri,
              fileType: fileType,
              height: height,
              base64: base64,
              ImageId: ImageId,
            };
            console.log(
              'imageSelectedData Captured Image: 1709',
              ImageDetailFlatList,
            );
            console.log(
              'imageSelectedData Captured Image: 1710',
              imageSelectedDataFlatelist,
            );
            setImageSelectedDataFlatelist(prevv => [
              ...prevv,
              ImageDetailFlatList,
            ]);
            console.log(
              'imageSelectedData Captured Image: 1711',
              imageSelectedDataFlatelist,
            );
            var imageDetail = {
              fileName: fileName,
              uri: uri,
              fileType: fileType,
              height: height,
              ImageId: ImageId,
            };
            console.log('imageSelectedData Captured Image: 1713');
            setImageSelectedData(prevv => [...prevv, imageDetail]);
            if (imageSelectedData.length <= 1) {
              setModalVisiblecamera(true);
            } else {
              setModalVisiblecamera(false);
            }
            console.log(
              'imageSelectedData Captured Image:',
              JSON.stringify(imageSelectedData),
            );
            console.log(
              'imageSelectedData length : ',
              JSON.stringify(imageSelectedData.length),
            );
            //console.log('imageSelectedData Captured Image:', JSON.stringify(imageSelectedData.length));
            //console.log('response img height ' + JSON.stringify(response.fileSize));
            // console.log('rSelectedImageDataesponse img width ' + JSON.stringify(response.width));
            // var width = this.width;
            // var height = this.height;
            if (
              response.width < 250 ||
              response.height < 250 ||
              response.fileSize < 40
            ) {
              alert(
                'Picture of min. size (Width * height, e.g 250 * 250, 40 KB) is allowed, select another picture and upload',
              );
              return;
            }
          }
        },
      );
    } catch (error) {
      console.log('Message', JSON.stringify(error));
    }
  };
  const AttatchmentPdfClick = async () => {
    global.EditAttachment = 1;
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      if (response == undefined || response == '') {
      } else {
        var ImageName = Math.floor(100 + Math.random() * 900).toString();
        global.PdfPreviousId = ImageName;
        var PdfResponseData = response[0];
        var uri = PdfResponseData.uri;
        setPdfUri(uri);
        var fileType = PdfResponseData.type;
        var fileNameType = '.' + fileType.split('/')[1];
        var fileName = ImageName + fileNameType;
        var ImageId = ImageName;
        var height = '';
        var imageDetail = {
          fileName: fileName,
          uri: uri,
          fileType: fileType,
          height: height,
          ImageId: ImageId,
        };
        console.log('imageDetail last :', JSON.stringify(imageDetail));
        setImageSelectedData(prevv => [...prevv, imageDetail]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
      }
    }
  };
  function GetVideoFromCamera() {
    setModalVisiblecamera(false);
    launchCamera({durationLimit: 180, mediaType: 'video'}, response => {
      setModalVisiblecamera(false);

      if (response.assets == undefined || response.assets == '') {
      } else {
        var ImageName = Math.floor(100 + Math.random() * 900).toString();
        global.VideoPreviousId = ImageName;
        var ImageResponseData = response.assets[0];
        var fileTypeMake = ImageResponseData.fileName;
        var uri = ImageResponseData.uri;
        setVideouri(uri);
        var fileTypeName = ImageResponseData.type.split('/')[1];
        var fileType = ImageResponseData.type;
        var fileName = ImageName + '.' + fileTypeName;
        var ImageId = ImageName;
        var height = ImageResponseData.height;
        var imageDetail = {
          fileName: fileName,
          uri: uri,
          fileType: fileType,
          height: height,
          ImageId: ImageId,
        };
        setImageSelectedData(prevv => [...prevv, imageDetail]);
        console.log('imageSelectedData: ', JSON.stringify(imageSelectedData));
      }
    });
    //
  }
  function GetVideoFromGallery() {
    setModalVisiblecamera(false);
    launchImageLibrary({durationLimit: 580, mediaType: 'video'}, response => {
      setModalVisiblecamera(false);
      if (response.assets == undefined || response.assets == '') {
      } else {
        var ImageName = Math.floor(100 + Math.random() * 900).toString();
        global.VideoPreviousId = ImageName;
        var ImageResponseData = response.assets[0];
        var fileTypeMake = ImageResponseData.fileName;
        var uri = ImageResponseData.uri;
        setVideouri(uri);
        var fileTypeName = ImageResponseData.type.split('/')[1];
        var fileType = ImageResponseData.type;
        var fileName = ImageName + '.' + fileTypeName;
        var ImageId = ImageName;
        var height = ImageResponseData.height;
        var imageDetail = {
          fileName: fileName,
          uri: uri,
          fileType: fileType,
          height: height,
          ImageId: ImageId,
        };
        setImageSelectedData(prevv => [...prevv, imageDetail]);
        console.log('imageSelectedData: ', JSON.stringify(imageSelectedData));
      }
    });
    //
  }

  function AddScheduleClick() {
    setScheduleSummeryVisible(false);
    global.Network_Detail = 1;
  }
  function ScheduleSummaryListClick() {
    if (scheduleListAddArray.length != 0) {
      setScheduleSummeryVisible(true);
      checkdataclick();
      global.Network_Detail = 0;
    } else {
      Toast.show('No data found in Schedule');
    }
  }
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = async date => {
    try {
      setSelectStartDate(date);

      var startDate = date.toString();
      await AsyncStorage.setItem('startDate', startDate);
      hideDatePicker();
      MakeBudget();
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };
  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };
  const hideEndDatePicker = () => {
    setEndDatePickerVisibility(false);
  };
  const handleEndConfirm = async date => {
    try {
      setSelectEndDate(date);
      var endDate = date.toString();
      await AsyncStorage.setItem('endDate', endDate);
      hideEndDatePicker();
      MakeBudget();
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const hideStartTimePicker = () => {
    setSelectStartTimePickerVisibility(false);
  };

  const hideEndTimePicker = () => {
    setSelectEndTimePickerVisibility(false);
  };

  //campaign Date Select start
  const showCampaignStartDatePicker = () => {
    setIsCampaignStartDateVisible(true);
  };
  const handleCampaignStartConfirm = async date => {
    setSelectCampaignStartDate(date);
    var startDate = date.toString();
    await AsyncStorage.setItem('startDate', startDate);
    console.log(
      'setSelectCampaignStartDate ',
      moment.utc(date).format('yyyy-MM-DDTHH:mm:ss'),
    );

    hideCampaignStartConfirm();
  };
  const hideCampaignStartConfirm = () => {
    setIsCampaignStartDateVisible(false);
  };
  const showCampaignEndDatePicker = () => {
    setIsCampaignEndDateVisible(true);
  };
  const handleCampaignEndConfirm = async date => {
    setSelectCampaignEndDate(date);
    var endDate = date.toString();
    await AsyncStorage.setItem('endDate', endDate);

    hideCampaignEndConfirm();
  };
  const hideCampaignEndConfirm = () => {
    setIsCampaignEndDateVisible(false);
  };
  function NextAddSchedule() {
    global.NextSchedule = 1;
    if (networkData == null || networkData == '') {
      console.log('NextAddSchedule empty ' + JSON.stringify(networkData));
      Toast.showWithGravity(
        'Please Select Network For Next',
        Toast.LONG,
        Toast.CENTER,
      );
    } else {
      setIndex(2);
      AddScheduleClick();
      if (global.NextSchedule == 1) {
        NetworkSelectClick();
      }
      console.log('NextAddSchedule  ' + JSON.stringify(networkData));
      setNetworkFinalData(networkData);
      setNetworkSelectedData(networkData);
      setTotalNetworkSelect(networkData.length);
    }
  }
  function ActionNetworkDataClick(SelectProps) {
    setNetworkData(prev => [...prev, SelectProps]);
    if (global.NextSchedule == 1) {
      NetworkSelectClick();
    }
  }
  function ActionNetworkDataRemoveClick(SelectProps) {
    setNetworkData(
      networkData.filter((e, i) => e.networkId !== SelectProps.networkId),
    );
    if (global.NextSchedule == 1) {
      NetworkSelectClick();
    }
  }
  function ActionNetworkSelectedDataClick(SelectProps) {
    console.log('ActionNetworkSelectedDataClick ', {SelectProps});
    setNetworkSelectSocialMedia(prev => [...prev, SelectProps]);
    setSelectedNetworkShowBudget(networkSelectSocialMedia);
  }
  function ActionNetworkSelectedDataRemoveClick(SelectProps) {
    console.log(
      'ActionNetworkSelectedDataRemoveClick ',
      networkSelectSocialMedia,
    );
    setNetworkSelectSocialMedia(
      networkSelectSocialMedia.filter(
        (e, i) => e.networkId !== SelectProps.networkId,
      ),
    );
    setSelectedNetworkShowBudget(networkSelectSocialMedia);
  }
  function NetworkSelectClick() {
    console.log('all networkData ' + JSON.stringify(networkData));
    console.log(
      'all networkSelectedData ' + JSON.stringify(networkSelectedData),
    );
    setNetworksDetail(networkData);
    setNetworkSelectedData(networkSelectedData);
    setIndex(2);
  }
  function CapturePhoto() {
    setModalVisiblecamera(true);
    global.AttatchmentType = 1;
  }

  function AttatchmentVideo() {
    console.log(
      'imageSelectedData.length AttatchmentVideo ',
      imageSelectedData.length,
    );
    setModalVisiblecamera(true);
    global.AttatchmentType = 2;
  }
  function AttatchmentPdf() {
    console.log(
      'imageSelectedData.length AttatchmentPdf ',
      imageSelectedData.length,
    );
    if (imageSelectedData.length >= 3) {
      AttachmentComplate();
    } else {
      AttatchmentPdfClick();
      global.AttatchmentType = 3;
    }
  }

  // function ClickWeekendDays(value) {
  const ClickWeekendDays = async value => {
    const SelectIntervalTypeIdValCheck = await AsyncStorage.getItem(
      'selectIntervalTypeId',
    );
    if (
      SelectIntervalTypeIdValCheck == '' ||
      SelectIntervalTypeIdValCheck == null
    ) {
      await AsyncStorage.setItem('selectIntervalTypeId', '1');
    }
    console.log(
      'weekendDayList weekendDayList weekendDayList weekendDayList weekendDayList  ',
      weekendDayList,
    );
    const IntervalValSelect = await AsyncStorage.getItem('SelectIntervalVal');
    const SelectIntervalTypeIdVal = await AsyncStorage.getItem(
      'selectIntervalTypeId',
    );
    if (
      SelectIntervalTypeIdVal == '' ||
      SelectIntervalTypeIdVal == 1 ||
      SelectIntervalTypeIdVal == 3 ||
      SelectIntervalTypeIdVal == 4 ||
      SelectIntervalTypeIdVal == 5
    ) {
      if (value == 1) {
        if (selectSunday == true) {
          setSelectSunday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];

          setWeekendDayList(updatedArray);
        }
        if (selectSunday == false) {
          setWeekendDayList('');
          setSelectSunday(true);
          setSelectMonday(false);
          setSelectTuesday(false);
          setSelectWednesday(false);
          setSelectThursday(false);
          setSelectFriday(false);
          setSelectSaturday(false);
          var updatedArray = [value];
          setWeekendDayList(updatedArray);
        }
      } else if (value == 2) {
        if (selectMonday == true) {
          setSelectMonday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];

          setWeekendDayList(updatedArray);
        }
        if (selectMonday == false) {
          setWeekendDayList('');
          setSelectSunday(false);
          setSelectMonday(true);
          setSelectTuesday(false);
          setSelectWednesday(false);
          setSelectThursday(false);
          setSelectFriday(false);
          setSelectSaturday(false);
          var updatedArray = [value];

          setWeekendDayList(updatedArray);
        }
      } else if (value == 3) {
        if (selectTuesday == true) {
          setSelectTuesday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];

          setWeekendDayList(updatedArray);
        }
        if (selectTuesday == false) {
          setWeekendDayList('');
          setSelectSunday(false);
          setSelectMonday(false);
          setSelectTuesday(true);
          setSelectWednesday(false);
          setSelectThursday(false);
          setSelectFriday(false);
          setSelectSaturday(false);
          var updatedArray = [value];

          setWeekendDayList(updatedArray);
        }
      } else if (value == 4) {
        if (selectWednesday == true) {
          setSelectWednesday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];

          setWeekendDayList(updatedArray);
        }
        if (selectWednesday == false) {
          setWeekendDayList('');
          setSelectSunday(false);
          setSelectMonday(false);
          setSelectTuesday(false);
          setSelectWednesday(true);
          setSelectThursday(false);
          setSelectFriday(false);
          setSelectSaturday(false);
          var updatedArray = [value];

          setWeekendDayList(updatedArray);
        }
      } else if (value == 5) {
        if (selectThursday == true) {
          setSelectThursday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];

          setWeekendDayList(updatedArray);
        }
        if (selectThursday == false) {
          setWeekendDayList('');
          setSelectSunday(false);
          setSelectMonday(false);
          setSelectTuesday(false);
          setSelectWednesday(false);
          setSelectThursday(true);
          setSelectFriday(false);
          setSelectSaturday(false);
          var updatedArray = [value];

          setWeekendDayList(updatedArray);
        }
      } else if (value == 6) {
        if (selectFriday == true) {
          setSelectFriday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];

          setWeekendDayList(updatedArray);
        }
        if (selectFriday == false) {
          setWeekendDayList('');
          setSelectSunday(false);
          setSelectMonday(false);
          setSelectTuesday(false);
          setSelectWednesday(false);
          setSelectThursday(false);
          setSelectFriday(true);
          setSelectSaturday(false);
          var updatedArray = [value];

          setWeekendDayList(updatedArray);
        }
      } else if (value == 7) {
        if (selectSaturday == true) {
          setSelectSaturday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];
          setWeekendDayList(updatedArray);
        }
        if (selectSaturday == false) {
          setWeekendDayList('');
          setSelectSunday(false);
          setSelectMonday(false);
          setSelectTuesday(false);
          setSelectWednesday(false);
          setSelectThursday(false);
          setSelectFriday(false);
          setSelectSaturday(true);
          var updatedArray = [value];
          setWeekendDayList(updatedArray);
        }
      }
      AsyncStorage.setItem('WeekendDayDataList', JSON.stringify(updatedArray));
      MakeBudget();
    } else {
      if (value == 1) {
        if (selectSunday == true) {
          setSelectSunday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];
          setWeekendDayList(updatedArray);
        }
        if (selectSunday == false) {
          setSelectSunday(true);
          var updatedArray = [...weekendDayList, value];
          setWeekendDayList(updatedArray);
        }
      } else if (value == 2) {
        if (selectMonday == true) {
          setSelectMonday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];
          setWeekendDayList(updatedArray);
        }
        if (selectMonday == false) {
          setSelectMonday(true);
          var updatedArray = [...weekendDayList, value];
          setWeekendDayList(updatedArray);
        }
      } else if (value == 3) {
        if (selectTuesday == true) {
          setSelectTuesday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];
          setWeekendDayList(updatedArray);
        }
        if (selectTuesday == false) {
          setSelectTuesday(true);
          var updatedArray = [...weekendDayList, value];
          setWeekendDayList(updatedArray);
        }
      } else if (value == 4) {
        if (selectWednesday == true) {
          setSelectWednesday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];
          setWeekendDayList(updatedArray);
        }
        if (selectWednesday == false) {
          setSelectWednesday(true);
          var updatedArray = [...weekendDayList, value];
          setWeekendDayList(updatedArray);
        }
      } else if (value == 5) {
        if (selectThursday == true) {
          setSelectThursday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];
          setWeekendDayList(updatedArray);
        }
        if (selectThursday == false) {
          setSelectThursday(true);
          var updatedArray = [...weekendDayList, value];
          setWeekendDayList(updatedArray);
        }
      } else if (value == 6) {
        if (selectFriday == true) {
          setSelectFriday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];
          setWeekendDayList(updatedArray);
        }
        if (selectFriday == false) {
          setSelectFriday(true);
          var updatedArray = [...weekendDayList, value];
          setWeekendDayList(updatedArray);
        }
      } else if (value == 7) {
        if (selectSaturday == true) {
          setSelectSaturday(false);
          var updatedArray = [...weekendDayList.filter((e, i) => e !== value)];
          setWeekendDayList(updatedArray);
        }
        if (selectSaturday == false) {
          setSelectSaturday(true);
          var updatedArray = [...weekendDayList, value];
          setWeekendDayList(updatedArray);
        }
      }
      setSelectedWeekDayList(updatedArray);
      AsyncStorage.setItem('WeekendDayDataList', JSON.stringify(updatedArray));
      MakeBudget();
    }
  };

  function DeleteScheduleList(propsDelete) {
    var newdatacheck = scheduleListAddArray.filter(
      (e, i) => e.randomId !== propsDelete.randomId,
    );
    setScheduleListAddArray(newdatacheck);
    setScheduleListAddArrayZZZ(newdatacheck);
    setDeleteScheduleVisible(true);
  }
  const UpdateScheduleList = async propsUpdate => {
    setNetworkEditWithScheduleDisabled(false);

    setSelectStartTime('');
    setSelectEndTime('');
    setSelectStartDate('');
    setSelectEndDate('');
    var nummberdays = propsUpdate.props.days;
    if (
      propsUpdate.props.CompaignNetworks == '' ||
      propsUpdate.props.CompaignNetworks == null ||
      propsUpdate.props.CompaignNetworks == 'undefined'
    ) {
      //
      var FilterSelectedNetwork = DataNetwork.filter(
        (e, i) => e.networkId === propsUpdate.props.networkId,
      );
      var FilterSelectedNetworkSingleJson = FilterSelectedNetwork.map(item => {
        return {
          id: item.id,
          networkId: item.networkId,
          desc: item.networkDesc,
          name: item.networkName,
          purchasedQouta: item.purchasedQouta,
          unitPriceInclTax: item.unitPriceInclTax,
          usedQuota: item.usedQuota,
          rowVer: 0,
          compaignId: 0,
          status: Number(item.status),
          createdBy: Number(userId),
          lastUpdatedBy: Number(userId),
        };
      });
      var NetworkEditWithSchedule = FilterSelectedNetworkSingleJson;
    } else {
      console.log(
        'props all list CompaignNetworks else ',
        propsUpdate.props.CompaignNetworks,
      );
      var NetworkEditWithSchedule = propsUpdate.props.CompaignNetworks;
    }
    setNetworkSelectSocialMedia(NetworkEditWithSchedule);
    setNetworkUpdateSelected(NetworkEditWithSchedule);
    setCheckUpdateData(propsUpdate);
    varPropsVal = propsUpdate.props;
    setSelectStartDate(varPropsVal.startTime);
    setSelectEndDate(varPropsVal.finishTime);
    var endDate = varPropsVal.finishTime.toString();
    await AsyncStorage.setItem('startDate', varPropsVal.startTime);
    await AsyncStorage.setItem('endDate', endDate);
    setScheduleMessageCount(varPropsVal.budget);
    setTotalMessageCountAdd(varPropsVal.messageCount);
    setIntervalVal(varPropsVal.interval.toString());
    var SelectIntervalValue = varPropsVal.interval.toString();
    await AsyncStorage.setItem('SelectIntervalVal', SelectIntervalValue);
    setSelectStatusValue(varPropsVal.status - 1);
    setSelectIntervalType(varPropsVal.intervalTypeId - 1);
    var SelectIntervalTypeIdVal = varPropsVal.intervalTypeId.toString();
    await AsyncStorage.setItem('selectIntervalTypeId', SelectIntervalTypeIdVal);
    console.log(
      '*************** intervalTypeId intervalTypeId intervalTypeId  ',
      varPropsVal.intervalTypeId,
    );
    if (varPropsVal.intervalTypeId == 6) {
      setIntervalValDisabled(true);
    }
    selectType(varPropsVal.status);
    var selectday = varPropsVal.days;
    AsyncStorage.setItem('WeekendDayDataList', JSON.stringify(selectday));
    setWeekendDayList(selectday);
    //setWeekendDayList
    setSelectSunday(selectday.includes(1));
    setSelectMonday(selectday.includes(2));
    setSelectTuesday(selectday.includes(3));
    setSelectWednesday(selectday.includes(4));
    setSelectThursday(selectday.includes(5));
    setSelectFriday(selectday.includes(6));
    setSelectSaturday(selectday.includes(7));
    MakeBudget();
    AddScheduleClick();
  };

  function DeletePdfAttachment() {
    if (global.EditAttachment == 1) {
      var PdfId = global.PdfPreviousId;
      setImageSelectedData(
        imageSelectedData.filter((e, i) => e.ImageId !== PdfId),
      );
      setImageSelectedDataFlatelist(
        imageSelectedData.filter((e, i) => e.ImageId !== PdfId),
      );
      setPDFSelectData('');
      setPdfUri('');
    } else {
      setImageSelectedData(
        imageSelectedData.filter((e, i) => e.fileType !== 'application/pdf'),
      );
      setImageSelectedDataFlatelist(
        imageSelectedData.filter((e, i) => e.fileType !== 'application/pdf'),
      );
      setPDFSelectData('');
      setPdfUri('');
    }
  }
  function DeleteVideoAttachment() {
    if (global.EditAttachment == 1) {
      var SelectVideoId = global.VideoPreviousId;
      setImageSelectedData(
        imageSelectedData.filter((e, i) => e.ImageId !== SelectVideoId),
      );
      setImageSelectedDataFlatelist(
        imageSelectedData.filter((e, i) => e.ImageId !== SelectVideoId),
      );
      setVideouri('');
    } else {
      setImageSelectedData(
        imageSelectedData.filter((e, i) => e.fileType !== 'video/mp4'),
      );
      setImageSelectedDataFlatelist(
        imageSelectedData.filter((e, i) => e.fileType !== 'video/mp4'),
      );
      setVideouri('');
    }
  }
  function DeletePicture(ImageId) {
    if (imageSelectedData.length == 0) {
      console.log(
        'imageSelectedDataFlatelist new ',
        imageSelectedDataFlatelist.length,
      );
      setImageSelectedData('');
      setImageSelectedDataFlatelist('');
    }
    setImageSelectedData(
      imageSelectedData.filter((e, i) => e.ImageId !== ImageId),
    );
    setImageSelectedDataFlatelist(
      imageSelectedDataFlatelist.filter((e, i) => e.ImageId !== ImageId),
    );
    console.log(
      'imageSelectedDataFlatelist new ',
      imageSelectedDataFlatelist.length,
    );
  }

  function AttachmentsEnabledClick() {
    if (AttachmentsEnabled == true) {
      setAttachmentsEnabled(false);
    } else {
      setAttachmentsEnabled(true);
    }
  }
  function CampaignAudienceEnabledClick() {
    if (SelectAreaEnabled == true) {
      setSelectAreaEnabled(false);
    } else {
      setSelectAreaEnabled(true);
    }
  }
  function AttachmentComplate() {
    alert(
      'Only three Attachments are allowed! If you want to change any one please remove attached',
    );
  }
  const ChangeIntervalVal = async value => {
    console.log(
      'ChangeIntervalVal value ********************************** ',
      value,
    );
    console.log(
      'ChangeIntervalVal value ********************************** ',
      selectIntervalTypeForDays,
    );
    await AsyncStorage.setItem('SelectIntervalVal', value);
    setIntervalVal(value);
    var value = selectIntervalTypeForDays;
    MakeBudget();
  };
  function CloseAttachment() {
    setModalVisiblecamera(false);
    console.log(
      'CloseAttachment imageSelectedData: ',
      JSON.stringify(imageSelectedData),
    );
  }
  const ImageItem = ({base64, ImageId, uri}) => (
    <View style={{textAlign: 'center', marginLeft: 20}}>
      <TouchableOpacity
        style={styles.CrossIconStyleFlatlistView}
        value={ImageId}
        onPress={() => DeletePicture(ImageId)}>
        <Image
          source={Crossicon}
          style={[styles.CrossIconStyle, {tintColor: theme.tintColor}]}
        />
      </TouchableOpacity>
      <View style={{textAlign: 'center'}} selectable={true}>
        {global.EditAttachment == 1 ? (
          <View style={{textAlign: 'center'}} selectable={true}>
            {global.AttatchmentType == 1 ? (
              <Image
                source={{uri: 'data:image/png;base64,' + base64}}
                style={styles.Picture_VideoView}
              />
            ) : null}
            {global.AttatchmentType == 2 ? (
              <Video
                playableDuration={0.5}
                paused={false}
                source={{uri: uri}}
                style={styles.Picture_VideoView}
              />
            ) : null}
            {global.AttatchmentType == 3 ? (
              <Image source={pdfViewIcon} style={styles.Picture_VideoView} />
            ) : null}
          </View>
        ) : (
          <View style={{textAlign: 'center'}} selectable={true}>
            {global.AttatchmentType == 1 ? (
              <Image source={{uri: uri}} style={styles.Picture_VideoView} />
            ) : null}
            {global.AttatchmentType == 2 ? (
              <Video
                playableDuration={0.5}
                paused={false}
                source={{uri: uri}}
                style={styles.Picture_VideoView}
              />
            ) : null}
            {global.AttatchmentType == 3 ? (
              <Image source={pdfViewIcon} style={styles.Picture_VideoView} />
            ) : null}
          </View>
        )}
      </View>
    </View>
  );
  const renderItemsss = ({item}) => (
    <TouchableOpacity
      style={[
        styles.NetworkQuotaViewTouch,
        {backgroundColor: theme.inputBackColor},
      ]}
      onPress={() => MakeBudget()}>
      <View style={styles.NetworkQuotaView}>
        <View style={{width: 50 + '%', marginRight: 8}}>
          <Text style={{fontSize: 15, color: theme.textColor}}>
            {item.desc} : {item.purchasedQouta - item.usedQuota} /{' '}
            {scheduleMessageCount} ,
          </Text>
        </View>
        <View style={{width: 50 + '%'}}>
          <Text style={{fontSize: 15, color: theme.textColor}}>
            Budget: {(scheduleMessageCount * item.unitPriceInclTax).toFixed(2)}{' '}
            {orgCurrencyName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  // if (spinner) {
  //   return (
  //     <View>
  //       <Spinner
  //         visible={spinner}
  //         textContent={'Loading...'}
  //         textStyle={{color: '#FFF'}}
  //       />
  //     </View>
  //   );
  // }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{x: 0, y: 0}}
      contentContainerStyle={[
        styles.container,
        {backgroundColor: theme.backgroundColor},
      ]}
      scrollEnabled={false}>
      <TouchableOpacity>
        <AppBreadcrumb
          crumbs={[
            {
              text: 'Campaign',
            },
            {
              text: `Networks ${networkData.length > 0 ? networkData.length : ''}`,
            },
            {text: 'Schedule'},
          ]}
          onSelect={index => {
            handlePress(index);
          }}
          selectedIndex={Index}
        />
      </TouchableOpacity>
      <ScrollView>
        {Index == 0 && (
          <>
            <Alert
              massagetype={'warning'}
              hide={hidepermission}
              confirm={confirmpermission}
              Visible={permissionVisible}
              alerttype={'confirmation'}
              Title={'Confirmation'}
              Massage={'"BMT" would like to access camera ?'}></Alert>
            <Alert
              massagetype={'warning'}
              hide={hide}
              confirm={confirm}
              Visible={Visible}
              alerttype={'confirmation'}
              Title={'Confirmation'}
              Massage={'Do you want to discard ?'}></Alert>
            <View>
              <View style={styles.uploadmodelcontainer}>
                <TextInput
                  placeholderTextColor={theme.placeholderColor}
                  style={[
                    styles.sectionStyle,
                    Subject == '' ? styles.mandatoryControl : null,
                    ,
                    {
                      backgroundColor: theme.inputBackColor,
                      color: theme.textColor,
                    },
                  ]}
                  value={Subject}
                  onChangeText={value => setSubject(value)}
                  placeholder="Subject"
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  KeyboardType={'default'}
                  maxLength={80}
                  minLength={3}
                />
                <TextInput
                  placeholderTextColor={theme.placeholderColor}
                  style={[
                    styles.sectionStyle,
                    Hashtag == '' ? styles.mandatoryControl : null,
                    ,
                    {
                      backgroundColor: theme.inputBackColor,
                      color: theme.textColor,
                    },
                  ]}
                  value={Hashtag}
                  onChangeText={value => setHashtag(value)}
                  placeholder="Hashtag"
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  KeyboardType={'default'}
                  maxLength={100}
                  minLength={3}
                />
                <TextInput
                  multiline={true}
                  textAlignVertical="top"
                  placeholderTextColor={theme.placeholderColor}
                  style={[
                    styles.sectionStyleTitle,
                    template == '' ? styles.mandatoryControl : null,
                    ,
                    {
                      backgroundColor: theme.inputBackColor,
                      color: theme.textColor,
                    },
                  ]}
                  value={template}
                  onChangeText={value => settemplate(value)}
                  placeholder="Template..."
                  clearTextOnFocus={true}
                  keyboardAppearance={'dark'}
                  KeyboardType={'default'}
                  maxLength={200}
                />
                {SelectAreaEnabled == false ? (
                  <TouchableOpacity
                    style={{
                      width: 100 + '%',
                      marginTop: 12,
                      flexDirection: 'row',
                      textAlign: 'center',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => CampaignAudienceEnabledClick()}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.AttachmentHeading,
                          {color: theme.textColor},
                        ]}>
                        Campaign Audience
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={UpArrowIcon}
                        style={[
                          styles.AttachmentHeadingIcon,
                          {tintColor: theme.tintColor},
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      width: Dimensions.get('window').width - 50,
                      marginHorizontal: 25,
                    }}>
                    <TouchableOpacity
                      style={{
                        width: 100 + '%',
                        marginTop: 12,
                        flexDirection: 'row',
                        textAlign: 'center',
                        justifyContent: 'space-between',
                      }}
                      onPress={() => CampaignAudienceEnabledClick()}>
                      <View>
                        <Text
                          style={[
                            styles.AttachmentHeading,
                            {color: theme.textColor},
                          ]}>
                          Campaign Audience
                        </Text>
                      </View>
                      <View>
                        <Image
                          source={DownArrowIcon}
                          style={[
                            styles.AttachmentHeadingIcon,
                            {tintColor: theme.tintColor},
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.CampaignAudienceView}>
                      <View style={{textAlign: 'center'}}>
                        <Dropdown
                          placeholderTextColor="gray"
                          onSelect={value => SelectCountryClick(value)}
                          selectedIndex={selectCountryVal}
                          style={[
                            styles.CampaignAudiencePickerstyle,
                            styles.mandatoryControl,
                            {backgroundColor: theme.inputBackColor},
                          ]}
                          items={selectCountry}
                          placeholder="Select Country..."
                          clearTextOnFocus={true}
                          keyboardAppearance={'dark'}
                          maxLength={5}
                        />
                      </View>
                      <View style={{textAlign: 'center'}}>
                        <Dropdown
                          placeholderTextColor="gray"
                          onSelect={value => SelectStateClick(value)}
                          selectedIndex={selectStateVal}
                          style={[
                            styles.CampaignAudiencePickerstyle,
                            styles.mandatoryControl,
                            {backgroundColor: theme.inputBackColor},
                          ]}
                          items={selectState}
                          placeholder="Select State..."
                          clearTextOnFocus={true}
                          keyboardAppearance={'dark'}
                          maxLength={5}
                        />
                      </View>
                    </View>
                  </View>
                )}
                {AttachmentsEnabled == false ? (
                  <TouchableOpacity
                    style={{
                      width: 100 + '%',
                      marginTop: 12,
                      flexDirection: 'row',
                      textAlign: 'center',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => AttachmentsEnabledClick()}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.AttachmentHeading,
                          {color: theme.textColor},
                        ]}>
                        Attachments
                      </Text>
                      <Image
                        source={AttachmentIcon}
                        style={[
                          styles.AttachmentHeadingIcon,
                          {tintColor: theme.tintColor},
                        ]}
                      />
                    </View>
                    <View>
                      <Image
                        source={UpArrowIcon}
                        style={[
                          styles.AttachmentHeadingIcon,
                          {tintColor: theme.tintColor},
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <TouchableOpacity
                      style={{
                        width: 100 + '%',
                        marginTop: 12,
                        flexDirection: 'row',
                        textAlign: 'center',
                        justifyContent: 'space-between',
                      }}
                      onPress={() => AttachmentsEnabledClick()}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={[
                            styles.AttachmentHeading,
                            {color: theme.textColor},
                          ]}>
                          Attachments
                        </Text>
                        <Image
                          source={AttachmentIcon}
                          style={[
                            styles.AttachmentHeadingIcon,
                            {tintColor: theme.tintColor},
                          ]}
                        />
                      </View>
                      <View>
                        <Image
                          source={DownArrowIcon}
                          style={[
                            styles.AttachmentHeadingIcon,
                            {tintColor: theme.tintColor},
                          ]}
                        />
                      </View>
                    </TouchableOpacity>
                    <View style={styles.ProfileImgView}>
                      <View style={{width: 33 + '%', textAlign: 'center'}}>
                        <Text
                          style={[
                            styles.AttatchmentTitle,
                            {color: theme.textColor},
                          ]}>
                          Photo
                        </Text>
                        {ImgUriBase64 == null || ImgUriBase64 == '' ? (
                          <TouchableOpacity
                            selectable={true}
                            style={styles.ProfileStyleView}
                            onPress={() => {
                              CapturePhoto();
                            }}>
                            <Image
                              source={
                                img == '' || img == undefined
                                  ? profileIcon
                                  : {uri: 'data:image/png;base64,' + img.base64}
                              }
                              style={styles.ProfileStyle}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={{textAlign: 'center'}}>
                            <TouchableOpacity
                              style={styles.CrossIconStyleView}
                              onPress={() => CapturePhoto()}>
                              <Image
                                source={PlusIcon}
                                style={[
                                  styles.CrossIconStyle,
                                  {tintColor: theme.tintColor},
                                ]}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.ProfileStylePreviewView}
                              onPress={() => CapturePhoto()}>
                              <Image
                                source={{
                                  uri: 'data:image/png;base64,' + ImgUriBase64,
                                }}
                                style={styles.ProfileStylePreview}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <View style={{width: 33 + '%', textAlign: 'center'}}>
                        <Text
                          style={[
                            styles.AttatchmentTitle,
                            {color: theme.textColor},
                          ]}>
                          Video
                        </Text>
                        {Videouri == null || Videouri == '' ? (
                          <TouchableOpacity
                            selectable={true}
                            style={styles.ProfileStyleView}
                            onPress={() => AttatchmentVideo()}>
                            <Image
                              source={
                                img1 == '' || img1 == undefined
                                  ? profileIcon
                                  : {
                                      uri:
                                        'data:image/png;base64,' +
                                        img1[0].base64,
                                    }
                              }
                              style={styles.ProfileStyle}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={{textAlign: 'center', marginLeft: 20}}>
                            <TouchableOpacity
                              style={styles.CrossIconStyleView}
                              onPress={() => AttatchmentVideo()}>
                              <Image
                                source={PlusIcon}
                                style={[
                                  styles.CrossIconStyle,
                                  {tintColor: theme.tintColor},
                                ]}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.VideoControlView}
                              onPress={() => AttatchmentVideo()}>
                              <Video
                                playableDuration={0.5}
                                resizeMode="cover"
                                paused={false}
                                source={{uri: Videouri}}
                                style={[
                                  {width: 100, height: 100, borderRadius: 50},
                                ]}
                                //   style={{width: 75, height: 75}}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                      <View style={{width: 33 + '%', textAlign: 'center'}}>
                        <Text
                          style={[
                            styles.AttatchmentTitle,
                            {color: theme.textColor},
                          ]}>
                          PDF
                        </Text>
                        {PdfUri == null || PdfUri == '' ? (
                          <TouchableOpacity
                            selectable={true}
                            style={styles.ProfileStyleView}
                            onPress={() => AttatchmentPdf()}>
                            <Image
                              source={PdfIcon}
                              style={styles.ProfileStyle}
                            />
                          </TouchableOpacity>
                        ) : (
                          <View style={{textAlign: 'center', marginLeft: 20}}>
                            <TouchableOpacity
                              style={styles.CrossIconStyleView}
                              onPress={() => DeletePdfAttachment()}>
                              <Image
                                source={Crossicon}
                                style={[
                                  styles.CrossIconStyle,
                                  {tintColor: theme.tintColor},
                                ]}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.ProfileStylePreviewView}>
                              <Image
                                source={pdfViewIcon}
                                style={styles.ProfileStylePreview}
                              />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                )}
                <View style={styles.MainViewStartEndTime}>
                  <View style={styles.TimeView_Start_End}>
                    <View
                      style={[
                        styles.sectionStyleTime_End,
                        SelectCampaignStartDate == ''
                          ? styles.mandatoryControl
                          : null,
                        ,
                        {backgroundColor: theme.inputBackColor},
                      ]}>
                      <TouchableOpacity
                        style={styles.btnStartTime}
                        onPress={() => showCampaignStartDatePicker()}>
                        <Text
                          style={[
                            [styles.StartTimeText, {color: theme.textColor}],
                            {color: theme.textColor},
                          ]}>
                          {SelectCampaignStartDate != ''
                            ? moment(SelectCampaignStartDate).format(
                                'DD-MM-YYYY',
                              )
                            : 'Campaign Start'}
                        </Text>
                      </TouchableOpacity>
                      <View>
                        <DateTimePickerModal
                          isVisible={IsCampaignStartDateVisible}
                          minimumDate={new Date(defaultDateTime)}
                          mode="date"
                          display="inline"
                          onConfirm={handleCampaignStartConfirm}
                          onCancel={hideCampaignStartConfirm}
                          isDarkModeEnabled={true}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.TimeView_Start_End}>
                    <View
                      style={[
                        styles.sectionStyleTime_End,
                        SelectCampaignEndDate == ''
                          ? styles.mandatoryControl
                          : null,
                        ,
                        {backgroundColor: theme.inputBackColor},
                      ]}>
                      <TouchableOpacity
                        style={styles.btnStartTime}
                        onPress={() => showCampaignEndDatePicker()}>
                        <Text
                          style={[
                            [styles.StartTimeText, {color: theme.textColor}],
                            {color: theme.textColor},
                          ]}>
                          {SelectCampaignEndDate != ''
                            ? moment(SelectCampaignEndDate).format('DD-MM-YYYY')
                            : 'Campaign End'}
                        </Text>
                      </TouchableOpacity>
                      <View>
                        <DateTimePickerModal
                          isVisible={IsCampaignEndDateVisible}
                          minimumDate={new Date(SelectCampaignStartDate)}
                          mode="date"
                          onConfirm={handleCampaignEndConfirm}
                          onCancel={hideCampaignEndConfirm}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <View
                  style={[
                    styles.radiostyleView,
                    {backgroundColor: theme.inputBackColor},
                  ]}>
                  <View style={styles.radiostyle}>
                    <View
                      style={{marginTop: 13, height: 45, flexDirection: 'row'}}>
                      <RadioForm
                        items={Statustype}
                        value={selectStatus}
                        setValue={v => {
                          selectType(v);
                          console.log({v});
                        }}
                        withLabels={true}
                        buttonOuterColor={theme.selectedCheckBox}
                        defaultButtonColor={theme.selectedCheckBox}
                        buttonOuterSize={30}
                        buttonInnerColor={theme.selectedCheckBox}
                        buttonInnerSize={26}
                        radioFormStyle={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          justifyContent: 'space-between',
                        }}
                        radioButtonItemStyle={{
                          // backgroundColor: '#d3d3d3',
                          width: 110,
                          marginBottom: 10,
                        }}
                        radioButtonLabelStyle={{
                          fontSize: 16,
                          color: theme.textColor,
                        }}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.termsView}>
                  <TouchableOpacity
                    onPress={() => selectAutoGenerateClick()}
                    style={{
                      flexDirection: 'row',
                      width: 100 + '%',
                      paddingLeft: 5,
                      paddingTop: 5,
                      zIndex: 902,
                    }}>
                    <Text
                      style={[
                        [
                          Platform.OS === 'ios'
                            ? styles.lblDayNameIos
                            : styles.lblDayName,
                          {color: theme.textColor},
                        ],
                        {color: theme.textColor},
                      ]}>
                      {' '}
                      Auto Generate Lead
                    </Text>
                    {selectAutoGenerateEnabled_Disabled == true ? (
                      <Image
                        resizeMode="contain"
                        source={checkedCheckbox}
                        style={[
                          [
                            styles.checkboxChecked_Unchecked,
                            {tintColor: theme.selectedCheckBox},
                          ],
                          {tintColor: theme.selectedCheckBox},
                        ]}
                      />
                    ) : (
                      <Image
                        resizeMode="contain"
                        source={uncheckedCheckbox}
                        style={[
                          [
                            styles.checkboxChecked_Unchecked,
                            {tintColor: theme.selectedCheckBox},
                          ],
                          {tintColor: theme.buttonBackColor},
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.ButtonViewNewCampaign}>
                  <Button
                    style={[styles.btnCancel, {flexBasis: '46%'}]}
                    bgColor={theme.buttonBackColor}
                    caption="Cancel"
                    onPress={() => CancelClick()}
                  />
                  <Button
                    style={[styles.btnSubmit, {flexBasis: '46%'}]}
                    bgColor={theme.buttonBackColor}
                    caption="Next"
                    onPress={() => checkTextInputRecord()}
                  />
                </View>
              </View>
            </View>
            <Modal
              animationType="fade"
              transparent={true}
              supportedOrientations={['portrait']}
              visible={modalVisiblecamera}>
              <View style={[styles.centeredView]}>
                <View
                  style={[
                    styles.modalView,
                    {backgroundColor: theme.modalBackColor},
                  ]}>
                  <View style={styles.textview}>
                    {global.AttatchmentType == 1 ? (
                      <Text
                        style={[
                          styles.cameraheading,
                          {color: theme.textColor},
                        ]}>
                        Pick Avatar
                      </Text>
                    ) : (
                      <Text
                        style={[
                          styles.cameraheading,
                          {color: theme.textColor},
                        ]}>
                        Pick Video
                      </Text>
                    )}
                  </View>
                  {global.AttatchmentType == 1 ? (
                    <View>
                      {imageSelectedDataFlatelist == null ||
                      imageSelectedDataFlatelist == '' ? null : (
                        <View>
                          <TouchableOpacity
                            style={styles.ClearAllPhoto}></TouchableOpacity>
                          <FlatList
                            data={imageSelectedDataFlatelist}
                            renderItem={({item}) => (
                              <ImageItem
                                base64={item.base64}
                                ImageId={item.ImageId}
                                uri={item.uri}
                              />
                            )}
                            keyExtractor={item => item.ImageId}
                            numColumns={1}
                            horizontal={true}
                          />
                        </View>
                      )}
                      <View style={styles.textview}>
                        <TouchableOpacity
                          selectable={true}
                          onPress={() => OpencameraClick()}>
                          <Text
                            style={[
                              styles.cameraopention,
                              {color: theme.textColor},
                            ]}>
                            Take Photo...
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.textview}>
                        <TouchableOpacity
                          selectable={true}
                          onPress={() => OpenGalleryClick()}>
                          <Text
                            style={[
                              styles.cameraopention,
                              {color: theme.textColor},
                            ]}>
                            Choose from Library...
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View style={styles.textview}>
                      <TouchableOpacity
                        selectable={true}
                        onPress={() => {
                          imageSelectedData.length >= '2'
                            ? AttachmentComplate()
                            : GetVideoFromCamera();
                        }}>
                        <Text
                          style={[
                            styles.cameraopention,
                            {color: theme.textColor},
                          ]}>
                          Choose Video ...
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        selectable={true}
                        onPress={() => {
                          imageSelectedData.length >= '2'
                            ? AttachmentComplate()
                            : GetVideoFromGallery();
                        }}>
                        <Text
                          style={[
                            styles.cameraopention,
                            {color: theme.textColor},
                          ]}>
                          Choose Video from Gallery...
                        </Text>
                      </TouchableOpacity>
                      {Videouri == null || Videouri == '' ? null : (
                        <View>
                          <TouchableOpacity
                            style={styles.CrossIconStyleVideoView}
                            onPress={() => DeleteVideoAttachment()}>
                            <Image
                              source={Crossicon}
                              style={[
                                styles.CrossIconStyle,
                                {tintColor: theme.tintColor},
                              ]}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.VideoControlPreview}>
                            <Video
                              playableDuration={0}
                              paused={false}
                              resizeMode="cover"
                              source={{uri: Videouri}}
                              style={{marginTop: 12, width: 170, height: 150}}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}
                  <View style={styles.cancelview}>
                    <TouchableOpacity
                      selectable={true}
                      onPress={() => CloseAttachment()}>
                      <Text
                        style={[styles.cameracancel, {color: theme.textColor}]}>
                        OK
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </>
        )}
        {Index == 1 && (
          <View>
            <FlatList
              scrollEnabled={false}
              nestedScrollEnabled={true}
              scroll
              data={DataNetwork}
              //keyExtractor={(item, networkId) => networkId}
              keyExtractor={(item, networkId) => networkId.toString()}
              renderItem={({item}) => (
                <NetworksView
                  networkData={networkData}
                  ActionNetworkDataClick={ActionNetworkDataClick}
                  ActionNetworkDataRemoveClick={ActionNetworkDataRemoveClick}
                  data={item.data}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  networkId={item.networkId}
                  networkName={item.networkName}
                  networkDesc={item.networkDesc}
                  orgId={item.orgId}
                  bufferQuota={item.bufferQuota}
                  purchasedQouta={item.purchasedQouta}
                  usedQuota={item.usedQuota}
                  unitPriceInclTax={item.unitPriceInclTax}
                  categoryId={item.categoryId}
                  status={item.status}
                  createdBy={item.createdBy}
                  createdAt={item.createdAt}
                  lastUpdatedAt={item.lastUpdatedAt}
                  theme={theme}></NetworksView>
              )}
              numColumns={1}
              horizontal={false}
            />
            <View style={styles.ButtonView}>
              <Button
                style={[styles.btnCancel, {flexBasis: '47%'}]}
                bgColor={theme.buttonBackColor}
                caption="Back"
                onPress={() => setIndex(0)}
              />
              <Button
                style={[styles.btnSubmit, {flexBasis: '47%'}]}
                bgColor={theme.buttonBackColor}
                caption="Next"
                onPress={() => NextAddSchedule()}
              />
            </View>
          </View>
        )}
        {Index == 2 && (
          <>
            <Alert
              massagetype={'warning'}
              hide={hide}
              confirm={confirm}
              Visible={Visible}
              alerttype={'confirmation'}
              Title={'Confirmation'}
              Massage={'Do you want to close ?'}></Alert>
            <AlertBMT
              massagetype={'warning'}
              hide={hideAddSchedule}
              confirm={confirmAddSchedule}
              Visible={addScheduleVisible}
              alerttype={'confirmation'}
              Title={'Confirmation'}
              Massage={
                'Schedule from ' +
                moment(startDateForAlert).format('DD-MM-YYYY') +
                ' to ' +
                moment(endDateForAlert).format('DD-MM-YYYY') +
                ' added successfully'
              }></AlertBMT>
            <AlertBMT
              massagetype={'warning'}
              hide={hideDeleteSchedule}
              confirm={confirmDeleteSchedule}
              Visible={deleteScheduleVisible}
              alerttype={'confirmation'}
              Title={'Confirmation'}
              Massage={'Schedule delete successfully'}></AlertBMT>
            <View>
              <View>
                <Alert
                  massagetype={'warning'}
                  hide={hide}
                  confirm={confirm}
                  Visible={Visible}
                  alerttype={'confirmation'}
                  Title={'Confirmation'}
                  Massage={'Do you want to close ?'}></Alert>
                <View
                  style={[
                    styles.ButtonViewstyle,
                    {backgroundColor: theme.cardBackColor},
                  ]}>
                  <TouchableOpacity
                    style={[
                      global.Network_Detail == 0
                        ? styles.btnNetWork
                        : styles.btnNetWorkClick,
                      {borderColor: theme.buttonBackColor},
                    ]}
                    onPress={() => AddScheduleClick()}>
                    <Text
                      style={[
                        styles.NetWork_DetailText,
                        {color: theme.textColor},
                      ]}>
                      Add Schedule
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      global.Network_Detail == 1
                        ? styles.btnCampaignDetail
                        : styles.btnCampaignDetailClick,
                      {borderColor: theme.buttonBackColor},
                    ]}
                    onPress={() => ScheduleSummaryListClick()}>
                    <Text
                      style={[
                        styles.NetWork_DetailText,
                        {color: theme.textColor},
                      ]}>
                      Schedules{' '}
                      {totalIndex == null || totalIndex == ''
                        ? ''
                        : '(' + totalIndex + ')'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {sheduleSummeryVisible == false ? (
                  <ScrollView>
                    <View style={styles.SelectedNetworkView}>
                      <FlatList
                        nestedScrollEnabled={true}
                        scrollEnabled={false}
                        data={networkSelectedData}
                        keyExtractor={(item, id) => id.toString()}
                        renderItem={
                          ({item}) => (
                            <NetworksSelectedView
                              NetworkSelectedAddSchedule={
                                networkSelectSocialMedia
                              }
                              networkSelectSocialMedia={
                                networkSelectSocialMedia
                              }
                              ActionNetworkSelectedDataClick={
                                ActionNetworkSelectedDataClick
                              }
                              ActionNetworkSelectedDataRemoveClick={
                                ActionNetworkSelectedDataRemoveClick
                              }
                              data={item.data}
                              id={item.id}
                              networkId={item.networkId}
                              name={item.desc}
                              purchasedQouta={item.purchasedQouta}
                              unitPriceInclTax={item.unitPriceInclTax}
                              usedQuota={item.usedQuota}
                              IconName={item.desc}
                              description={item.desc}
                              categoryId={item.categoryId}
                              status={item.status}
                              createdBy={item.createdBy}
                              createdAt={item.createdAt}
                              lastUpdatedAt={
                                item.lastUpdatedAt
                              }></NetworksSelectedView>
                          )
                          //<NetworksSelectedView NetworkSelectedAddSchedule={networkSelectSocialMedia} networkSelectSocialMedia={networkSelectSocialMedia} ActionNetworkSelectedDataClick={ActionNetworkSelectedDataClick} ActionNetworkSelectedDataRemoveClick={ActionNetworkSelectedDataRemoveClick} data={item.data} id={item.id} networkId={item.networkId} name={item.networkName} purchasedQouta={item.purchasedQouta} unitPriceInclTax={item.unitPriceInclTax} usedQuota={item.usedQuota} IconName={item.networkName} description={item.networkDesc} categoryId={item.categoryId} status={item.status} createdBy={item.createdBy} createdAt={item.createdAt} lastUpdatedAt={item.lastUpdatedAt} ></NetworksSelectedView>
                        }
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        //numColumns={1}
                        horizontal={false}
                      />
                    </View>
                    <View style={styles.IntervalType_Time}>
                      <View style={{width: 60 + '%'}}>
                        <Dropdown
                          placeholderTextColor="gray"
                          onSelect={value => SelectIntervalClick(value)}
                          selectedIndex={selectIntervalType}
                          style={[
                            styles.Pickerstyle,
                            {backgroundColor: theme.inputBackColor},
                          ]}
                          items={selectIntervalTypeVal}
                          placeholder="Interval Type..."
                          clearTextOnFocus={true}
                          keyboardAppearance={'dark'}
                          maxLength={5}
                        />
                      </View>
                      <View style={{marginLeft: 14, width: 35 + '%'}}>
                        <TextInput
                          placeholderTextColor={theme.placeholderColor}
                          editable={intervalValDisabled}
                          style={[
                            styles.sectionIntervalStyle,
                            {
                              backgroundColor: theme.inputBackColor,
                              color: theme.textColor,
                            },
                          ]}
                          value={intervalVal}
                          onChangeText={value => ChangeIntervalVal(value)}
                          placeholder="Minute (1-60)"
                          clearTextOnFocus={true}
                          keyboardAppearance={'dark'}
                          keyboardType="number-pad"
                          maxLength={4}
                        />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.DaysMainView,
                        {backgroundColor: theme.inputBackColor},
                      ]}>
                      <Text
                        style={[
                          Platform.OS === 'ios'
                            ? styles.TitleDayNameIOS
                            : styles.TitleDayName,
                          {
                            color: theme.textColor,
                            backgroundColor: theme.inputBackColor,
                          },
                        ]}>
                        {' '}
                        Days{' '}
                      </Text>
                      <View style={styles.termsView}>
                        <TouchableOpacity
                          onPress={() => ClickWeekendDays(1)}
                          style={{
                            flexDirection: 'row',
                            width: 25 + '%',
                            paddingLeft: 5,
                            zIndex: 902,
                          }}>
                          {selectSunday == true ? (
                            <Image
                              resizeMode="contain"
                              source={checkedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          ) : (
                            <Image
                              resizeMode="contain"
                              source={uncheckedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          )}
                          <Text
                            style={[
                              Platform.OS === 'ios'
                                ? styles.lblDayNameIos
                                : styles.lblDayName,
                              {color: theme.textColor},
                            ]}>
                            {' '}
                            Sun
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => ClickWeekendDays(2)}
                          style={{
                            flexDirection: 'row',
                            width: 25 + '%',
                            paddingLeft: 5,
                            zIndex: 902,
                          }}>
                          {selectMonday == true ? (
                            <Image
                              resizeMode="contain"
                              source={checkedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          ) : (
                            <Image
                              resizeMode="contain"
                              source={uncheckedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          )}
                          <Text
                            style={[
                              Platform.OS === 'ios'
                                ? styles.lblDayNameIos
                                : styles.lblDayName,
                              {color: theme.textColor},
                            ]}>
                            {' '}
                            Mon
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => ClickWeekendDays(3)}
                          style={{
                            flexDirection: 'row',
                            width: 25 + '%',
                            paddingLeft: 5,
                            zIndex: 902,
                          }}>
                          {selectTuesday == true ? (
                            <Image
                              resizeMode="contain"
                              source={checkedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          ) : (
                            <Image
                              resizeMode="contain"
                              source={uncheckedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          )}
                          <Text
                            style={[
                              Platform.OS === 'ios'
                                ? styles.lblDayNameIos
                                : styles.lblDayName,
                              {color: theme.textColor},
                            ]}>
                            {' '}
                            Tue
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => ClickWeekendDays(4)}
                          style={{
                            flexDirection: 'row',
                            width: 25 + '%',
                            paddingLeft: 5,
                            zIndex: 902,
                          }}>
                          {selectWednesday == true ? (
                            <Image
                              resizeMode="contain"
                              source={checkedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          ) : (
                            <Image
                              resizeMode="contain"
                              source={uncheckedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          )}
                          <Text
                            style={[
                              Platform.OS === 'ios'
                                ? styles.lblDayNameIos
                                : styles.lblDayName,
                              {color: theme.textColor},
                            ]}>
                            {' '}
                            Wed
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.termsView}>
                        <TouchableOpacity
                          onPress={() => {
                            ClickWeekendDays(5);
                          }}
                          style={{
                            flexDirection: 'row',
                            width: 25 + '%',
                            paddingLeft: 5,
                            zIndex: 902,
                          }}>
                          {selectThursday == true ? (
                            <Image
                              resizeMode="contain"
                              source={checkedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          ) : (
                            <Image
                              resizeMode="contain"
                              source={uncheckedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          )}
                          <Text
                            style={[
                              Platform.OS === 'ios'
                                ? styles.lblDayNameIos
                                : styles.lblDayName,
                              {color: theme.textColor},
                            ]}>
                            {' '}
                            Thu
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            ClickWeekendDays(6);
                          }}
                          style={{
                            flexDirection: 'row',
                            width: 25 + '%',
                            paddingLeft: 5,
                            zIndex: 902,
                          }}>
                          {selectFriday == true ? (
                            <Image
                              resizeMode="contain"
                              source={checkedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          ) : (
                            <Image
                              resizeMode="contain"
                              source={uncheckedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          )}
                          <Text
                            style={[
                              Platform.OS === 'ios'
                                ? styles.lblDayNameIos
                                : styles.lblDayName,
                              {color: theme.textColor},
                            ]}>
                            {' '}
                            Fri
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            ClickWeekendDays(7);
                          }}
                          style={{
                            flexDirection: 'row',
                            width: 25 + '%',
                            paddingLeft: 5,
                            zIndex: 902,
                          }}>
                          {selectSaturday == true ? (
                            <Image
                              resizeMode="contain"
                              source={checkedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          ) : (
                            <Image
                              resizeMode="contain"
                              source={uncheckedCheckbox}
                              style={[
                                styles.checkboxChecked_Unchecked,
                                {tintColor: theme.selectedCheckBox},
                              ]}
                            />
                          )}
                          <Text
                            style={[
                              Platform.OS === 'ios'
                                ? styles.lblDayNameIos
                                : styles.lblDayName,
                              {color: theme.textColor},
                            ]}>
                            {' '}
                            Sat
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.MainViewStartEndTime}>
                      <View style={styles.ScheduleTimeView_Start}>
                        <View
                          style={[
                            styles.sectionStyleTime_End,
                            {backgroundColor: theme.inputBackColor},
                          ]}>
                          <TouchableOpacity
                            style={styles.btnStartTime}
                            onPress={() => showDatePicker()}>
                            <Text
                              style={[
                                styles.StartTimeText,
                                {color: theme.textColor},
                              ]}>
                              {SelectStartDate == ''
                                ? moment(SelectCampaignStartDate).format(
                                    'DD-MM-YYYY HH:mm',
                                  )
                                : moment(SelectStartDate).format(
                                    'DD-MM-YYYY HH:mm',
                                  )}
                            </Text>
                          </TouchableOpacity>
                          <View>
                            <DateTimePickerModal
                              isVisible={isDatePickerVisible}
                              minimumDate={new Date(SelectCampaignStartDate)}
                              maximumDate={new Date(SelectCampaignEndDate)}
                              mode="datetime"
                              onConfirm={handleConfirm}
                              onCancel={hideDatePicker}
                            />
                          </View>
                        </View>
                      </View>
                      <View style={styles.ScheduleTimeView_End}>
                        <View
                          style={[
                            styles.sectionStyleTime_End,
                            {backgroundColor: theme.inputBackColor},
                          ]}>
                          <TouchableOpacity
                            style={styles.btnStartTime}
                            onPress={() => showEndDatePicker()}>
                            <Text
                              style={[
                                styles.StartTimeText,
                                {color: theme.textColor},
                              ]}>
                              {SelectEndDate == ''
                                ? moment(SelectCampaignEndDate).format(
                                    'DD-MM-YYYY HH:mm',
                                  )
                                : moment(SelectEndDate).format(
                                    'DD-MM-YYYY HH:mm',
                                  )}
                            </Text>
                          </TouchableOpacity>
                          <View>
                            <DateTimePickerModal
                              isVisible={isEndDatePickerVisible}
                              minimumDate={SelectStartDate}
                              maximumDate={new Date(SelectCampaignEndDate)}
                              mode="datetime"
                              onConfirm={handleEndConfirm}
                              onCancel={hideEndDatePicker}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        width: Dimensions.get('window').width - 30,
                        marginHorizontal: 15,
                        marginTop: 8,
                      }}>
                      <FlatList
                        nestedScrollEnabled={true}
                        scrollEnabled={false}
                        data={networkSelectSocialMedia}
                        renderItem={renderItemsss}
                        //numColumns={1}
                        horizontal={false}
                        keyExtractor={item => item.networkId.toString()}
                      />
                    </View>
                  </ScrollView>
                ) : (
                  <ScrollView>
                    <View style={styles.MainViewScheduleView}>
                      <SafeAreaView>
                        <FlatList
                          nestedScrollEnabled={true}
                          scrollEnabled={false}
                          data={scheduleData}
                          keyExtractor={(item, randomId) => randomId.toString()}
                          renderItem={({item, index}) => (
                            <AddScheduleList
                              UpdateScheduleList={UpdateScheduleList}
                              DeleteScheduleList={DeleteScheduleList}
                              index={index}
                              orgCurrencyName={orgCurrencyName}
                              networkId={item.networkId}
                              budget={item.budget}
                              messageCount={item.messageCount}
                              props={item}
                              randomId={item.randomId}
                              intervalType={item.intervalType}
                              scheduleStartDate={item.startTime}
                              scheduleEndDate={item.finishTime}
                              scheduleStartTime={item.scheduleStartTime}
                              scheduleEndTime={
                                item.scheduleEndTime
                              }></AddScheduleList>
                          )}
                          //renderItem={({item,index}) => <AddScheduleList UpdateScheduleList={UpdateScheduleList} DeleteScheduleList={DeleteScheduleList} networkCount={networkCount} networkSelectSocialMedia={networkSelectSocialMedia} setScheduleCount={index} index={index} networkId={item.networkId} props={item} randomId={item.randomId} intervalType={item.intervalType} scheduleStartDate={item.startTime} scheduleEndDate={item.finishTime} scheduleStartTime={item.scheduleStartTime} scheduleEndTime={item.scheduleEndTime} ></AddScheduleList>}
                          numColumns={1}
                          horizontal={false}
                          //keyExtractor={item => item.randomId}
                          //renderItem={({item}) => this.renderItem.bind(this,item)}
                          // extraData={item => item.randomId}
                        />
                      </SafeAreaView>
                      <View
                        style={[
                          styles.ScheduleView,
                          {backgroundColor: theme.inputBackColor},
                        ]}>
                        <View style={styles.BudgetScheduleRowData}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={[
                                styles.lblBudget,
                                {color: theme.textColor},
                              ]}>
                              Campaign Message :{' '}
                            </Text>
                            <Text
                              style={[
                                styles.lblBudgetVal,
                                {color: theme.textColor},
                              ]}>
                              {totalMessageCountAdd.toFixed(2)}
                            </Text>
                          </View>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={[
                                styles.lblBudget,
                                {color: theme.textColor},
                              ]}>
                              Campaign Budget :{' '}
                            </Text>
                            <Text
                              style={[
                                styles.lblBudgetVal,
                                {
                                  color: theme.textColor,
                                },
                              ]}>
                              {totalBudget.toFixed(2)}
                              {' ' + orgCurrencyName}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                    <Model modalVisible={modalVisible}></Model>
                    <Spinner
                      visible={spinner}
                      textContent={'Loading...'}
                      textStyle={{color: '#FFF'}}
                    />
                  </ScrollView>
                )}
                {sheduleSummeryVisible == false ? (
                  <View style={styles.ButtonScheduleView}>
                    <Button
                      style={[styles.btnCancel, {flexBasis: '47%'}]}
                      bgColor={theme.buttonBackColor}
                      caption="Back"
                      onPress={() => setIndex(1)}
                    />
                    {addScheduleButton == true ? (
                      <Button
                        style={[styles.btnSubmit, {flexBasis: '47%'}]}
                        bgColor={theme.buttonBackColor}
                        caption="+ Schedule"
                        onPress={() => AddCampaignClick()}
                      />
                    ) : (
                      <Button
                        style={[styles.btnSubmit, {flexBasis: '47%'}]}
                        bgColor={theme.buttonBackColor}
                        caption="+ Quota"
                        onPress={() => MakeBudget()}
                      />
                    )}
                  </View>
                ) : null}
                {sheduleSummeryVisible == true ? (
                  <View style={styles.ButtonSubmitView}>
                    <Button
                      style={[styles.btnSubmit, {flexBasis: '98%'}]}
                      bgColor={theme.buttonBackColor}
                      caption="Submit"
                      onPress={() => ClickSubmitData()}
                    />
                  </View>
                ) : null}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAwareScrollView>
  );
}
/************************************************************ styles ***************************************************/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  containerView: {
    flex: 1,
    alignItems: 'center',
  },
  SelectedNetworkView: {
    //flex: 1,
    alignItems: 'center',
  },
  checkboxChecked_Unchecked: {
    height: 27,
    width: 27,
  },
  uploadmodelcontainer: {
    width: Dimensions.get('window').width - 50,
    justifyContent: 'cen',
    flex: 1,
    alignItems: 'center',
  },
  mainview: {
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 15,
  },
  ProfileImgView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: '2%',
    justifyContent: 'space-around',
    // marginTop: 2 + '%',
  },
  CampaignAudienceView: {
    //flexDirection: 'row',
    //backgroundColor:'green',
    alignItems: 'center',
    paddingBottom: '2%',
    justifyContent: 'space-around',
  },
  Picture_VideoView: {
    height: 90,
    width: 90,
    //borderRadius: 6,
    //marginTop:12,
    alignSelf: 'center',
    //borderColor: colors.profileBorderColor,
    //borderWidth: 1,
  },
  VideoControlView: {
    height: 80,
    width: 80,
    borderRadius: 50,
    //marginTop:12,
    alignSelf: 'center',
    borderColor: colors.profileBorderColor,
    borderWidth: 1,
    overflow: 'hidden',
  },
  VideoControlPreview: {
    height: 180,
    width: 180,
    alignSelf: 'center',
    borderColor: colors.profileBorderColor,
  },
  VideoControl: {
    height: 55,
    width: 55,
    marginTop: 12,
    alignSelf: 'center',
  },
  ProfileStyleView: {
    height: 80,
    width: 80,
    borderRadius: 90,
    marginTop: 12,
    alignSelf: 'center',
    resizeMode: 'contain',
    borderColor: colors.profileBorderColor,
    borderWidth: 2,
  },
  ProfileStylePreview: {
    height: 80,
    width: 80,
    borderRadius: 90,
    //marginTop:12,
    borderColor: colors.profileBorderColor,
    borderWidth: 2,
  },
  ProfileStylePreviewView: {
    alignItems: 'center',
    paddingBottom: '2%',
    paddingTop: '1%',
    justifyContent: 'space-around',
    // marginTop: 2 + '%',
  },
  ProfileStyle: {
    height: 55,
    width: 55,
    marginTop: 8,
    marginLeft: 3,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  CrossIconStyleFlatlistView: {
    zIndex: 2,
    position: 'absolute',
    marginLeft: 35,
    marginTop: 1,
  },
  CrossIconStyleView: {
    zIndex: 2,
    position: 'absolute',
    marginLeft: 12,
    marginTop: 1,
  },
  CrossIconStyleVideoView: {
    zIndex: 2,
    position: 'absolute',
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
    width: Dimensions.get('window').width - 40,
  },
  CrossIconStyle: {
    height: 26,
    width: 26,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 34,
  },
  AttachmentHeadingIcon: {
    height: 26,
    width: 26,
    alignSelf: 'center',
    // marginTop: 4,
    marginLeft: 12,
  },
  datepickercustome: {
    height: 46,
    borderLeftWidth: 0.3,
    borderLeftColor: colors.borderColor,
  },
  datepickercustomeStart_End: {
    height: 46,
    borderLeftWidth: 0.3,
    borderLeftColor: colors.borderColor,
    //backgroundColor:'red'
  },
  btnCancel: {
    // height:45,
    borderRadius: 5,
    borderWidth: 0,
  },
  btnTest: {
    height: 44,
    marginTop: 15,
    borderRadius: 5,
    borderWidth: 0,
    position: 'absolute',
    right: 0,
  },
  btnSubmit: {
    // height:45,
    borderRadius: 5,
    borderWidth: 0,
  },
  btntime: {
    height: 100,
    width: Dimensions.get('window').width - 80,
  },
  btnStartTime: {
    // height:100,
    width: 97 + '%',
    // backgroundColor:'orange'
    //width: Dimensions.get('window').width-80,
  },
  StartTimeText: {
    fontSize: 17,
    color: colors.TextBoxColor,
    marginTop: 1,
    marginLeft: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    textAlign: 'center',
  },
  TimeText: {
    fontSize: 15,
    color: colors.TextBoxColor,
    marginTop: 13,
    marginLeft: 80,
  },
  SummeryText: {
    fontSize: 15,
    color: colors.TextBoxColor,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  DaysMainView: {
    width: Dimensions.get('window').width - 35,
    marginHorizontal: 16,
    marginTop: 25,
    paddingVertical: 15,
    //backgroundColor:colors.TextBoxContainer,
    backgroundColor: colors.TextBoxContainer,
    //borderWidth:0.6,
    //borderColor:'green',
    borderRadius: 6,
  },
  radiostyleView: {
    width: '100%',
    marginHorizontal: 15,
    marginTop: 20,
    backgroundColor: colors.TextBoxContainer,
    borderRadius: 6,
  },
  termsView: {
    flexDirection: 'row',
    //width: Dimensions.get('window').width-30,
    //marginHorizontal:15,
    marginVertical: 5,
  },
  AutoGenerateView: {
    //width: Dimensions.get('window').width-30,
    //marginHorizontal:15,
    backgroundColor: 'gray',
    marginVertical: 5,
  },
  TitleDayName: {
    //marginLeft:5,
    top: -16,
    paddingTop: 2,
    fontWeight: '700',
    backgroundColor: colors.TextBoxContainer,
    color: 'black',
    fontSize: 18,
    borderRadius: 8,
    position: 'absolute',
  },
  lblDayName: {
    marginLeft: 2,
    marginRight: 8 + '%',
    marginTop: 0,
    color: 'black',
    fontSize: 17,
  },
  lblDayNameIos: {
    marginLeft: 2,
    marginRight: 8 + '%',
    marginTop: 4,
    color: 'black',
    fontSize: 15,
  },
  DayCheckbox: {
    height: 21,
    width: 25,
    margin: 5,
  },
  RecurringTimeText: {
    fontSize: 14,
    color: colors.TextBoxColor,
    marginLeft: 5,
  },
  SwipeButtonView: {
    position: 'absolute',
    bottom: 0,
    width: 100 + '%',
    //backgroundColor: 'red',
    backgroundColor: '#0116274f',
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 1,
  },
  Deletebtn: {
    height: 40,
    borderRadius: 10,
    //borderWidth: 1,
    backgroundColor: colors.Blazorbutton,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    marginTop: 5,
  },
  Completebtn: {
    height: 40,
    borderRadius: 10,
    //borderWidth: 1,
    backgroundColor: colors.Blazorbutton,
    //backgroundColor: colors.ButtonDefaultColor,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    marginTop: 5,
  },
  Cancelbtn: {
    height: 40,
    borderRadius: 10,
    //borderWidth: 1,
    backgroundColor: colors.Blazorbutton,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    marginTop: 5,
  },
  btnResend: {
    fontSize: 16,
    color: colors.white,
  },
  ButtonView: {
    marginTop: 15,
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ButtonScheduleView: {
    // marginTop: 15,
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ButtonSubmitView: {
    marginTop: 15,
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  ButtonViewNewCampaign: {
    marginTop: 15,
    width: Dimensions.get('window').width - 40,
    //marginHorizontal:15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  FieldText: {
    textDecorationLine: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 15,
    //backgroundColor: colors.TextBoxContainer,
    color: colors.TextColor,
    width: Dimensions.get('window').width - 107.8,
    marginLeft: 0,
  },
  TimeView: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 50,
  },
  TimeView_Start_End: {
    flexDirection: 'row',
    width: '48%',
    marginTop: 15,
  },
  ScheduleTimeView_Start: {
    flexDirection: 'row',
    width: 48 + '%',
    //marginVertical:7,
    marginHorizontal: 4,
    marginTop: 12,
    marginRight: 12,
    // backgroundColor:'blue'
  },
  ScheduleTimeView_End: {
    flexDirection: 'row',
    width: 47 + '%',
    //marginVertical:7,
    marginHorizontal: 4,
    marginTop: 12,
    marginRight: 7,
    // backgroundColor:'blue'
  },
  sectionStyleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleTime_End: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: 100 + '%',
    borderWidth: 0,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  MainViewStartEndTime: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    // width: Dimensions.get('window').width - 30,
    // marginHorizontal: 15,
    //backgroundColor:'red',
    //paddingTop:14,
  },
  MainViewScheduleView: {
    //flexDirection: 'row',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width - 30,
    height: 100 + '%',
    // height: Dimensions.get('window').height-220,
    marginHorizontal: 15,
    // marginBottom:120,
    //paddingTop:14,
  },
  MapIconView: {
    width: 15 + '%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  MapIcon: {
    color: '#ffffff',
    fontSize: 32,
    marginTop: 5,
  },
  AddAreaMap: {
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 4,
    width: Dimensions.get('window').width - 100,
    height: 46,
    color: '#ffffff',
    fontSize: 20,
    marginTop: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.TextBoxContainer,
  },
  Pickerstyle: {
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 4,
    width: 100 + '%',
    //width: Dimensions.get('window').width-30,
    //marginHorizontal:15,
    height: 46,
    color: '#ffffff',
    fontSize: 20,
    //marginTop: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.TextBoxContainer,
  },
  CampaignAudiencePickerstyle: {
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 4,
    width: Dimensions.get('window').width - 50,
    marginHorizontal: 25,
    height: 46,
    color: '#ffffff',
    fontSize: 20,
    marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.TextBoxContainer,
  },
  multiSelectContainer: {
    marginTop: 24,
    borderColor: '#ffffff',
    borderWidth: 0,
    borderRadius: 4,
    width: Dimensions.get('window').width - 50,
    // height: 46,
    color: '#ffffff',
    fontSize: 20,
    // marginTop: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: colors.red,
  },
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  mandatoryControl: {
    borderWidth: 1,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.mandatoryColor,
  },
  sectionIntervalStyle: {
    alignItems: 'center',
    height: 46,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: 100 + '%',
    // width: Dimensions.get('window').width-30,
    //marginHorizontal:15,
    borderWidth: 0,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStyleRecurringTime: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom:15,
    height: 45,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: 46 + '%',
    marginHorizontal: 6,
    //width: Dimensions.get('window').width-50,
    borderWidth: 0,
    backgroundColor: colors.red,
    borderColor: colors.borderColor,
    borderRadius: 4,
  },
  sectionStylestatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    height: 44,
    fontSize: 16,
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 160,
    backgroundColor: colors.TextBoxContainer,
    borderWidth: 0,
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
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0,
    backgroundColor: colors.TextBoxContainer,
    borderColor: colors.borderColor,
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
    color: colors.TextBoxColor,
    width: Dimensions.get('window').width - 50,
    borderWidth: 0,
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
    //backgroundColor: colors.TextBoxContainer,
    color: colors.TextColor,
    width: Dimensions.get('window').width - 70,
    marginLeft: 0,
  },
  radiostyle: {
    // borderColor: '#ffffff',
    // borderWidth: .5,
    //  borderRadius:4,
    // width: Dimensions.get('window').width-30,
    //marginHorizontal:15,
    height: 50,
    color: '#ffffff',
    fontSize: 20,
    // marginTop: 15,
    //marginBottom: 15,
    //fontWeight: 'bold',
    //textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: "#07282b",
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.TextBoxContainer,
  },
  text: {
    padding: 12,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'black',
  },
  btnGetStarted1: {
    flexDirection: 'row',
    backgroundColor: colors.PanelTabList,
    // backgroundColor:colors.red,
    //borderColor:'white',
    width: 95 + '%',
    fontSize: 25,
    // height:15 + '%',
    marginTop: 10,
    marginBottom: 2,
    borderRadius: 6,
    // borderWidth: 1,
  },
  btnGetStarted: {
    borderColor: 'white',
    width: 95 + '%',
    fontSize: 25,
    height: 17.5 + '%',
    marginTop: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  itemImage: {
    height: 45,
    width: 45,
    // tintColor:colors.IconLightColor,
    //backgroundColor:'blue',
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
  },
  itemText: {
    color: colors.TextColorOther,
    fontFamily: fonts.primary,
    marginTop: 11,
    fontSize: 19,
    fontWeight: 'bold',
  },
  itemTextDetail: {
    color: colors.TextColorOther,
    fontFamily: fonts.primary,
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 5,
  },
  ButtonViewstyle: {
    backgroundColor: colors.PagePanelTab,
    marginTop: 5,
    marginBottom: 15,
    width: Dimensions.get('window').width,
    // marginHorizontal:5,
    borderTopWidth: 0,
    //borderColor:'green',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  NetWork_DetailText: {
    fontSize: 15,
    paddingTop: 12,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    justifyContent: 'center',
  },
  btnNetWorkClick: {
    flexBasis: '50%',
    height: 52,
    marginLeft: 1,
    borderBottomWidth: 2,
    borderRadius: 0,
    borderColor: colors.Blazorbutton,
    borderWidth: 0,
  },
  btnNetWork: {
    flexBasis: '50%',
    height: 52,
    marginLeft: 1,
    borderBottomWidth: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
  btnCampaignDetailClick: {
    flexBasis: '50%',
    height: 52,
    marginRight: 1,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: colors.Blazorbutton,
    borderBottomWidth: 2,
  },
  btnCampaignDetail: {
    flexBasis: '50%',
    height: 52,
    marginRight: 1,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  ScheduleView: {
    flexDirection: 'row',
    backgroundColor: colors.PagePanelTab,
    //backgroundColor:'green',
    padding: 4,
    width: Dimensions.get('window').width - 30,
    borderRadius: 6,
    // borderWidth:1,
    //borderColor:'red',
    marginBottom: 12,
  },
  ScheduleRowData: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 51 + '%',
  },
  ScheduleRowDataSmall: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 49 + '%',
  },
  BudgetScheduleRowData: {
    //flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 4,
    //width: 100 + '%',
    //backgroundColor:'red'
  },
  lblBudgetVal: {
    width: 44 + '%',
    color: 'black',
    fontSize: 18,
    //backgroundColor:'red'
  },
  lblBudget: {
    width: 56 + '%',
    color: 'black',
    fontSize: 18,
    //backgroundColor:'orange'
  },
  lblBudgetInfo: {
    // width: 30 + '%',
    color: 'black',
    fontSize: 24,
    textAlign: 'right',
  },
  ViewBudgetInfo: {
    width: 10 + '%',
    color: 'black',
    fontSize: 24,
    textAlign: 'right',
    justifyContent: 'center',
  },
  lblHeadingSchaduleVal: {
    width: 46 + '%',
    //backgroundColor:'red',
    color: 'black',
    fontSize: 14,
    textAlign: 'right',
    paddingRight: 8,
  },
  lblNetworkCount: {
    backgroundColor: '#1da1f2',
    width: 23,
    height: 23,
    color: 'white',
    fontSize: 14,
    borderRadius: 50,
    textAlign: 'center',
    //paddingRight:8,
    marginLeft: 50 + '%',
  },
  lblHeadingSchadule: {
    width: 54 + '%',
    //backgroundColor:'gray',
    color: 'black',
    fontSize: 13,
    paddingLeft: 3,
  },
  DetailHeadingMainView: {
    width: 100 + '%',
    textAlign: 'center',
    flexDirection: 'row',
  },
  DetailHeadingView: {
    width: 90 + '%',
    textAlign: 'center',
  },
  DetailHeading: {
    marginTop: 3 + '%',
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  ScheduleRowDetail: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: Dimensions.get('window').width - 60,
    //backgroundColor:'red',
    marginHorizontal: 15,
    marginTop: 10,
  },
  lblSchaduleSummary: {
    width: 50 + '%',
    //backgroundColor:'gray',
    color: 'black',
    fontSize: 16,
    paddingLeft: 3,
  },
  lblSchaduleSummaryVal: {
    width: 50 + '%',
    //backgroundColor:'gray',
    color: 'black',
    fontSize: 16,
    textAlign: 'right',
    // paddingLeft:3,
  },
  ModalViewSchaduleSummary: {
    height: 55 + '%',
    width: 95 + '%',
    // top:-20,
    backgroundColor: colors.PagePanelTab,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.3,
    borderRadius: 6,
  },
  CancelViewSchaduleSummary: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  A_GcloseIconView: {
    zIndex: 2,
    position: 'absolute',
    borderColor: 'red',
    borderWidth: 0.7,
    marginLeft: 1,
    marginTop: 1,
    backgroundColor: '#010c1f9e',
    borderRadius: 50,
    height: 23,
    width: 23,
    // alignItems:'center',
    //justifyContent:'center'
  },
  closeIconView: {
    zIndex: 2,
    position: 'absolute',
    borderColor: 'red',
    borderWidth: 0.7,
    marginLeft: 12,
    marginTop: 1,
    backgroundColor: '#010c1f9e',
    borderRadius: 50,
    height: 23,
    width: 23,
  },
  closeIconViewFlatlist: {
    textAlign: 'right',
    width: 60 + '%',
    paddingTop: 1,
    zIndex: 2,
    position: 'absolute',
    borderColor: 'red',
    borderWidth: 0.7,
    marginLeft: 32,
    marginTop: 1,
    backgroundColor: '#010c1f9e',
    borderRadius: 50,
    height: 23,
    width: 23,
  },
  closeIcon: {
    color: 'red',
    fontSize: 13,
    marginLeft: 5,
    marginTop: 3,
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#80808061',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    height: 45 + '%',
    width: 90 + '%',
    backgroundColor: 'white',
  },
  textview: {
    width: 100 + '%',
  },
  cancelview: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  AttachmentHeading: {
    //marginLeft:8 + '%',
    marginTop: 1 + '%',
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cameraheading: {
    marginLeft: 8 + '%',
    marginTop: 8 + '%',
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cameraopention: {
    marginLeft: 8 + '%',
    marginTop: 3 + '%',
    color: 'black',
    fontSize: 18,
  },
  cameracancel: {
    color: 'black',
    fontSize: 15,
  },
  card: {
    padding: 10,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  item: {
    width: '50%',
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  AttatchmentTitle: {
    // marginRight:1 + '%',
    marginTop: 8 + '%',
    color: 'black',
    // backgroundColor:'red',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
  },
  AttatchmentTitleAutoGenerate: {
    marginTop: 2 + '%',
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
  },
  ClearAllPhoto: {
    marginTop: 2 + '%',
    marginBottom: 3 + '%',
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    justifyContent: 'center',
  },
  IntervalType_Time: {
    // backgroundColor:'red',
    marginTop: 12,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
  },
  NetworkQuotaView: {
    marginVertical: 3,
    flexDirection: 'row',
    paddingLeft: 4,
    paddingRight: 4,
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 5,
    justifyContent: 'center',
  },
  NetworkQuotaViewTouch: {
    marginVertical: 6,
    //backgroundColor: colors.red,
    backgroundColor: colors.PagePanelTab,
    paddingLeft: 4,
    height: 44,
    paddingRight: 4,
    marginLeft: 3,
    marginRight: 3,
    borderRadius: 5,
    justifyContent: 'center',
  },
});

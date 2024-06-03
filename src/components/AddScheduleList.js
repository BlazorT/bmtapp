import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import Icons from 'react-native-vector-icons/AntDesign';
import DoubleClick from 'rn-double-click';
import {colors} from '../styles';
import {useTheme} from '../hooks/useTheme';
//const iconwave = require('../../assets/images/pages/wave.png');
export default function AddScheduleList(props) {
  const theme = useTheme();
  const [intervalValue, setIntervalValue] = useState();
  const [scheduleSummaryDetailVisible, setScheduleSummaryDetailVisible] =
    useState(false);
  const [networksSummary, setNetworksSummary] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const [intervalTypeIdSummary, setIntervalTypeIdSummary] = useState('');
  const [networkCount, setNetworkCount] = useState('');
  const [intervalSummary, setIntervalSummary] = useState('');
  const [startDateSummary, setStartDateSummary] = useState('');
  const [endDateSummary, setEndDateSummary] = useState('');
  const [selectDaysSummary, setSelectDaysSummary] = useState('');
  const [selectSunSummary, setSelectSunSummary] = useState('');
  const [orgCurrencyName, setOrgCurrencyName] = useState('');
  const [selectMonSummary, setSelectMonSummary] = useState('');
  const [selectTueSummary, setSelectTueSummary] = useState('');
  const [selectWedSummary, setSelectWedSummary] = useState('');
  const [selectThuSummary, setSelectThuSummary] = useState('');
  const [selectFriSummary, setSelectFriSummary] = useState('');
  const [selectSatSummary, setSelectSatSummary] = useState('');
  const [networkTotalPriceSummary, setNetworkTotalPriceSummary] = useState('');
  const [randomSummary, setRandomSummary] = useState('');
  const [networkTotalPrice, setNetworkTotalPrice] = useState();
  const [statusSummary, setStatusSummary] = useState('');
  const [isFixedSummary, setIsFixedSummary] = useState('');

  // var propsdetail = props.props;
  //const uniqueNames = propsdetail.filter((val, randomId, array) => {
  //return array.indexOf(val) == randomId;
  //});

  useEffect(() => {
    if (
      props.props.intervalTypeId == '' ||
      props.props.intervalTypeId == null
    ) {
    } else {
      var IntervalTypeCampaignnew = props.props.intervalTypeId;
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
    }
    setSelectedNetwork(props.networkSelectSocialMedia);
    var NetworkTotalBudget = props.budget;
    setNetworkTotalPrice(NetworkTotalBudget);
    //var networkcountVal = props.networkSelectSocialMedia;
    if (
      props.props.CompaignNetworks == '' ||
      props.props.CompaignNetworks == null ||
      props.props.CompaignNetworks == 'undefined'
    ) {
      setNetworkCount('1');
    } else {
      var networkcountVal = props.props.CompaignNetworks;
      if (networkcountVal.length >= 1) {
        let counter = 0;
        for (let i = 0; i < networkcountVal.length; i++) {
          if (networkcountVal[i].networkId != '') counter++;
        }
        setNetworkCount(counter);
      }
    }
    //setNetworkCount('2');
  }, []);
  //export default class Myvehicle extends PureComponent {
  //const Condition = [{src: 0},{src: 1}];

  const [Buttonsvisible, setButtonsvisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [CancelVisible, setCancelVisible] = useState(false);
  const [NetworkVisible, setNetworkVisible] = useState(false);
  const [config, SetConfig] = useState(false);
  const [CompleteVisible, setCompleteVisible] = useState(false);
  const [modalVisiblecamera, setModalVisiblecamera] = useState(false);
  const [demandfocus, setDemandfocus] = useState(false);
  const [sidebarshowhide, setsidebarshowhide] = useState(false);

  // const [numberSend, setNumberSend] = useState('');
  //const [status, setStatus] = useState('');
  //const [name, setName] = useState('');
  // const [networkId, setNetworkId] = useState('');
  const [title, setTitle] = useState('');
  const [orgName, setOrgName] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [contact, setContact] = useState('');
  const [budget, setBudget] = useState('');
  const [discount, setDiscount] = useState('');
  const [hashTags, setHashTags] = useState('');
  const [description, setDescription] = useState('');

  const [approvalTime, setApprovalTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  //const [data, setData] = useState([]);
  //const [myData, setMyData] = useState([]);

  //const [compaignNetworksAllData, setcompaignNetworksAllData] = useState('');

  function Edit_Add_DeleteClick() {
    setButtonsvisible(true);
  }
  function clickButtonsvisible() {
    setButtonsvisible(false);
  }
  function UpdateSchedule(props) {
    var propsUpdate = props;
    props.UpdateScheduleList(propsUpdate);
    setButtonsvisible(false);
  }
  function ClickDeleteData(props) {
    var propsDelete = props.props;
    props.DeleteScheduleList(propsDelete);
    setButtonsvisible(false);
  }
  function ScheduleDetail(props) {
    var PropsDetail = props.props;
    setNetworksSummary(PropsDetail.networkId);
    setIntervalSummary(PropsDetail.interval);
    setNetworkTotalPriceSummary(PropsDetail.NetworkTotalBudget);
    setOrgCurrencyName(props.orgCurrencyName);
    setStartDateSummary(PropsDetail.startTime);
    setEndDateSummary(PropsDetail.finishTime);
    setRandomSummary(PropsDetail.randomId);
    setIsFixedSummary(PropsDetail.isFixedTime);
    if (
      PropsDetail.intervalTypeId != null ||
      PropsDetail.intervalTypeId != ''
    ) {
      var IntervalTypeIdCheck = PropsDetail.intervalTypeId;
      if (IntervalTypeIdCheck == 1) {
        setIntervalTypeIdSummary('One Time');
      } else if (IntervalTypeIdCheck == 2) {
        setIntervalTypeIdSummary('Daily');
      } else if (IntervalTypeIdCheck == 3) {
        setIntervalTypeIdSummary('Weekly');
      } else if (IntervalTypeIdCheck == 4) {
        setIntervalTypeIdSummary('Monthly');
      } else if (IntervalTypeIdCheck == 5) {
        setIntervalTypeIdSummary('Yearly');
      } else if (IntervalTypeIdCheck == 6) {
        setIntervalTypeIdSummary('Custom');
      } else if (IntervalTypeIdCheck == 7) {
        setIntervalTypeIdSummary('Other');
      }
      //
      AsyncStorage.getItem('networkDataForDetail').then(function (res) {
        let Asyncdata = JSON.parse(res);
        if (Asyncdata != null) {
          // );
          setNetworkDescriptionList(Asyncdata.desc);
        }
      });
    }
    if (PropsDetail.status != null || PropsDetail.status != '') {
      var SelectstatusCheck = PropsDetail.status;
      if (SelectstatusCheck == 1) {
        setStatusSummary('Active');
      } else if (SelectstatusCheck == 2) {
        setStatusSummary('Pause');
      } else if (SelectstatusCheck == 3) {
        setStatusSummary('Canceled');
      }
    }
    var selectday = PropsDetail.days;
    //var days1; var days2; var days3; var days4; var days5; var days6; var days7;
    if (selectday.includes(1)) {
      var days1 = 'Sun,';
    } else {
      days1 = '';
    }
    if (selectday.includes(2)) {
      var days2 = 'Mon,';
    } else {
      days2 = '';
    }
    if (selectday.includes(3)) {
      var days3 = 'Tue,';
    } else {
      days3 = '';
    }
    if (selectday.includes(4)) {
      var days4 = 'Wed,';
    } else {
      days4 = '';
    }
    if (selectday.includes(5)) {
      var days5 = 'Thu,';
    } else {
      days5 = '';
    }
    if (selectday.includes(6)) {
      var days6 = 'Fri,';
    } else {
      days6 = '';
    }
    if (selectday.includes(7)) {
      var days7 = 'Sat';
    } else {
      days7 = '';
    }
    setSelectDaysSummary(days1 + days2 + days3 + days4 + days5 + days6 + days7);
    setScheduleSummaryDetailVisible(true);
  }
  const Item = ({desc}) => (
    <View style={{textAlign: 'right', marginLeft: 7}}>
      <Text style={{color: theme.textColor}}>{desc}</Text>
    </View>
  );
  return (
    <Fragment>
      <View
        style={[
          styles.ScheduleViewList,
          {backgroundColor: theme.inputBackColor},
        ]}>
        <GestureRecognizer
          onSwipeLeft={() => Edit_Add_DeleteClick()}
          config={config}>
          <DoubleClick onClick={() => ScheduleDetail(props)}>
            <View style={{flexDirection: 'row', height: 25}}>
              <View style={styles.ScheduleRowDataSmall}>
                <Text
                  style={[styles.lblHeadingSchadule, {color: theme.textColor}]}>
                  Interval Type
                </Text>
                <Text
                  style={[
                    styles.lblHeadingSchaduleVal,
                    {color: theme.textColor},
                  ]}>
                  {intervalValue}
                </Text>
              </View>
              <View style={styles.ScheduleRowData1}>
                <Text
                  style={[styles.lblHeadingSchadule, {color: theme.textColor}]}>
                  Networks
                </Text>
                <View style={styles.lblHeadingSchaduleVal1}>
                  <Text
                    style={[
                      styles.lblNetworkCount,
                      {backgroundColor: theme.buttonBackColor},
                    ]}>
                    {networkCount}
                  </Text>
                </View>
              </View>
              <View style={styles.ScheduleRowData2}>
                <Text
                  style={[
                    styles.lblHeadingSchadulePrice,
                    {color: theme.textColor},
                  ]}>
                  {props.props.budget.toFixed(1)}
                  {' ' + props.orgCurrencyName}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', height: 25}}>
              <View style={styles.ScheduleRowDataSmall}>
                <Text
                  style={[styles.lblHeadingSchadule, {color: theme.textColor}]}>
                  Start Date
                </Text>
                <Text
                  style={[
                    styles.lblHeadingSchaduleVal,
                    {color: theme.textColor},
                  ]}>
                  {moment(props.scheduleStartDate).format('DD-MM-YYYY')}
                </Text>
              </View>
              <View style={styles.ScheduleRowData}>
                <Text
                  style={[styles.lblHeadingSchadule, {color: theme.textColor}]}>
                  Finish Date
                </Text>
                <Text
                  style={[
                    styles.lblHeadingSchaduleVal,
                    {color: theme.textColor},
                  ]}>
                  {moment(props.scheduleEndDate).format('DD-MM-YYYY')}
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', height: 25}}>
              <View style={styles.ScheduleRowDataSmall}>
                <Text
                  style={[styles.lblHeadingSchadule, {color: theme.textColor}]}>
                  Start Time
                </Text>
                <Text
                  style={[
                    styles.lblHeadingSchaduleVal,
                    {color: theme.textColor},
                  ]}>
                  {moment(props.scheduleStartTime).format('hh:mm a')}
                </Text>
              </View>
              <View style={styles.ScheduleRowData}>
                <Text
                  style={[styles.lblHeadingSchadule, {color: theme.textColor}]}>
                  Finish Time
                </Text>
                <Text
                  style={[
                    styles.lblHeadingSchaduleVal,
                    {color: theme.textColor},
                  ]}>
                  {moment(props.scheduleEndTime).format('hh:mm a')}
                </Text>
              </View>
            </View>
            {Buttonsvisible == true ? (
              <View style={styles.SwipeButtonView}>
                <View
                  style={{
                    width: 100 + '%',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}>
                  <TouchableOpacity
                    value={4}
                    onPress={() => ClickDeleteData(props)}
                    style={{width: 33 + '%', paddingVertical: 5}}>
                    <View
                      style={[
                        styles.Deletebtn,
                        {backgroundColor: theme.buttonBackColor},
                      ]}>
                      <Text style={styles.btnResend}>Delete</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => clickButtonsvisible()}
                    style={{width: 33 + '%', paddingVertical: 5}}>
                    <View
                      style={[
                        styles.Cancelbtn,
                        {backgroundColor: theme.buttonBackColor},
                      ]}>
                      <Text style={styles.btnResend}>Cancel</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => UpdateSchedule(props)}
                    style={{width: 33 + '%', paddingVertical: 5}}>
                    <View
                      style={[
                        styles.Completebtn,
                        {backgroundColor: theme.buttonBackColor},
                      ]}>
                      <Text style={styles.btnResend}>Update</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </DoubleClick>
        </GestureRecognizer>
        <Modal
          animationType="fade"
          transparent={true}
          supportedOrientations={['portrait']}
          visible={scheduleSummaryDetailVisible}
          onRequestClose={() => {
            ({scheduleSummaryDetailVisible: !scheduleSummaryDetailVisible});
          }}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.ModalViewSchaduleSummary,
                {backgroundColor: theme.modalBackColor},
              ]}>
              <View style={styles.DetailHeadingMainView}>
                <View style={styles.DetailHeadingView}>
                  <Text
                    style={[styles.DetailHeading, {color: theme.textColor}]}>
                    Schedule Detail
                  </Text>
                </View>
                <View style={styles.DetailHeadingView}>
                  <TouchableOpacity
                    style={styles.closeIconView}
                    onPress={() => setScheduleSummaryDetailVisible(false)}>
                    <Icons
                      name="close"
                      style={[styles.closeIcon, {color: theme.tintColor}]}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[
                    styles.lblSchaduleSummaryNetwork,
                    {color: theme.textColor},
                  ]}>
                  Networks
                </Text>
                <View style={styles.lblScheduleSummaryNetworkVal}>
                  <FlatList
                    data={selectedNetwork}
                    renderItem={({item}) => <Item desc={item.desc} />}
                    keyExtractor={item => item.networkId}
                    numColumns={1}
                    horizontal={true}
                  />
                </View>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Interval Type
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {intervalTypeIdSummary}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Interval
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {intervalSummary != '' ||
                  intervalSummary != null ||
                  intervalSummary != '0'
                    ? intervalSummary + ' sec'
                    : '0'}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Is Fixed
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {isFixedSummary == 0 ? 'No' : 'Yes'}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  days
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {selectDaysSummary}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Start Date
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {moment(startDateSummary).format('DD-MM-YYYY')}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Finish Date
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {moment(endDateSummary).format('DD-MM-YYYY')}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Random Id
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {randomSummary}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Status
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {statusSummary}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Price
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {props.props.budget}
                  {' ' + orgCurrencyName}
                </Text>
              </View>
              <View style={styles.ScheduleRowDetail}>
                <Text
                  style={[styles.lblSchaduleSummary, {color: theme.textColor}]}>
                  Message Count
                </Text>
                <Text
                  style={[
                    styles.lblSchaduleSummaryVal,
                    {color: theme.textColor},
                  ]}>
                  {props.messageCount}
                </Text>
              </View>
              <View style={styles.CancelViewSchaduleSummary}>
                <TouchableOpacity
                  selectable={true}
                  onPress={() => setScheduleSummaryDetailVisible(false)}>
                  <Text style={[styles.cameracancel, {color: theme.textColor}]}>
                    CANCEL
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </Fragment>
  );
}
const styles = StyleSheet.create({
  ScheduleViewList: {
    // backgroundColor:'green',
    backgroundColor: colors.PagePanelTab,
    padding: 4,
    width: Dimensions.get('window').width - 30,
    //height: Dimensions.get('window').height,
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
  ScheduleRowData1: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 32 + '%',
    // backgroundColor:'red'
  },
  ScheduleRowData2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 22 + '%',
    // backgroundColor:'green'
  },
  ScheduleRowDataSmall: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: 49 + '%',
  },
  BudgetScheduleRowData: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  lblBudgetVal: {
    width: 30 + '%',
    color: 'black',
    fontSize: 22,
  },
  lblBudget: {
    width: 30 + '%',
    color: 'black',
    fontSize: 22,
  },
  lblBudgetInfo: {
    // width: 30 + '%',
    color: 'black',
    fontSize: 24,
    textAlign: 'right',
  },
  ViewBudgetInfo: {
    width: 30 + '%',
    color: 'black',
    fontSize: 24,
    textAlign: 'right',
  },
  lblHeadingSchaduleVal: {
    width: 46 + '%',
    //backgroundColor:'red',
    color: 'black',
    fontSize: 14,
    textAlign: 'right',
    paddingRight: 8,
  },
  lblHeadingSchaduleVal1: {
    width: 26 + '%',
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
    marginLeft: 20 + '%',
  },
  lblHeadingSchadule: {
    width: 54 + '%',
    //backgroundColor:'gray',
    color: 'black',
    fontSize: 13,
    paddingLeft: 3,
  },
  lblHeadingSchadulePrice: {
    color: 'black',
    fontSize: 13,
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
  lblSchaduleSummaryNetwork: {
    width: 26 + '%',
    color: 'black',
    fontSize: 16,
    paddingLeft: 3,
  },
  lblScheduleSummaryNetworkVal: {
    marginLeft: 9,
    textAlign: 'right',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 73 + '%',
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
    height: 60 + '%',
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
  closeIconView: {
    textAlign: 'right',
    width: 8 + '%',
    paddingTop: 5,
    //backgroundColor:'red'
  },
  closeIcon: {
    textAlign: 'right',
    fontSize: 25,
  },
  centeredView: {
    flex: 1,
    backgroundColor: '#80808061',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    height: 40 + '%',
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
  cameraheading: {
    marginLeft: 8 + '%',
    marginTop: 8 + '%',
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  cameraopention: {
    marginLeft: 8 + '%',
    marginTop: 8 + '%',
    color: 'black',
    fontSize: 22,
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
    height: 31,
    borderRadius: 4,
    //borderWidth: 1,
    backgroundColor: colors.Blazorbutton,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    marginTop: 5,
  },
  Completebtn: {
    height: 31,
    borderRadius: 4,
    //borderWidth: 1,
    backgroundColor: colors.Blazorbutton,
    //backgroundColor: colors.ButtonDefaultColor,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    marginTop: 5,
  },
  Cancelbtn: {
    height: 31,
    borderRadius: 4,
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
});

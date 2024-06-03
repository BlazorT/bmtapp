import React, {Fragment, useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../styles';
const BDMT = require('../../assets/images/pepsilogo.png');
const deleteicon = require('../../assets/images/deleteicon.png');
const playicon = require('../../assets/images/playicon.png');
const pauseicon = require('../../assets/images/pauseicon.png');
const AttachmentIcon = require('../../assets/images/attachment.png');
const EMAIL = require('../../assets/images/Email.png');
const INSTAGRAM = require('../../assets/images/instagram.png');
const LINKEDIN = require('../../assets/images/linkedin.png');
const SNAPCHAT = require('../../assets/images/snapchat.png');
const TIKTOK = require('../../assets/images/tiktok.png');
const WHATSAPP = require('../../assets/images/Whatsapp.png');
const TWITTER = require('../../assets/images/Twitter.png');
const SMS = require('../../assets/images/SMS.png');
const FACEBOOK = require('../../assets/images/Facebook.png');
const Crossicon = require('../../assets/images/crossicon.png');
const AutoGenerateYes = require('../../assets/images/autogenerateyes.png');
const AutoGenerateNo = require('../../assets/images/autogenerateno.png');
//import NumericInput from 'react-native-numeric-input'
import GestureRecognizer from 'react-native-swipe-gestures';
import DoubleClick from 'rn-double-click';
//import CustomeAlert from './Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/FontAwesome';
import MycampaignScheduleList from '.././components/MycampaignScheduleList';
import NetworkMycampaign from '.././components/NetworkMycampaign';
import networknamesettings from '.././modules/dataservices/networknamesettings';
import servicesettings from '.././modules/dataservices/servicesettings';
//import { RNVoiceRecorder } from 'react-native-voice-recorder'
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import {useTheme} from '../hooks/useTheme';
//const iconwave = require('../../assets/images/pages/wave.png');
export default function Myvehicle(props) {
  const theme = useTheme();
  useEffect(() => {
    clickForDetailother();
    console.log('props all My Campaign ' + JSON.stringify(props));
    console.log('props all My Campaign ' + JSON.stringify(props.data.orgName));
    console.log(
      'props all My Campaign ' +
        servicesettings.Imagebaseuri +
        props.logoAvatar.replace(/\\/g, '/').replace(',', '').replace('//', ''),
    );

    //console.log("data response compaignsdetails  =>", JSON.stringify(responseJson.data.compaignsdetails));
    // console.log("data response compaignschedules  =>", JSON.stringify(props.data.compaignsdetails));
    // console.log('props all data props ' + JSON.stringify(props));networkId
    // console.log('props all data compaignNetworks ' + JSON.stringify(props.compaignNetworks));
    // var myCampaignDetail = props;
    //console.log('myCampaignDetail ' + (JSON.parse(myCampaignDetail.compaignNetworks)[]));
    //console.log('myCampaignDetail ' + JSON.stringify(JSON.parse(myCampaignDetail.compaignNetworks)));
    //
    //
    //var campaignNetworkDetail = props.compaignNetworks
    //
    //
    setNetworkId(networknamesettings(props.networkId));

    //console.log('setNetworkId new ' + networknamesettings(props.networkId));
    //
  }, []);
  //export default class Myvehicle extends PureComponent {
  //const Condition = [{src: 0},{src: 1}];
  //console.log('props ' + JSON.stringify(props));

  const [Buttonsvisible, setButtonsvisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [CancelVisible, setCancelVisible] = useState(false);
  const [NetworkVisible, setNetworkVisible] = useState(false);
  const [CampaignVisible, setCampaignVisible] = useState(false);
  const [ScheduleVisible, setScheduleVisible] = useState(false);
  const [config, SetConfig] = useState(false);
  const [CompleteVisible, setCompleteVisible] = useState(false);
  const [modalVisiblecamera, setModalVisiblecamera] = useState(false);
  const [demandfocus, setDemandfocus] = useState(false);
  const [sidebarshowhide, setsidebarshowhide] = useState(false);

  const [numberSend, setNumberSend] = useState('');
  const [attachmentDataList, setAttachmentDataList] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [networkId, setNetworkId] = useState('');
  const [title, setTitle] = useState('');
  const [orgName, setOrgName] = useState('');
  const [networkName, setNetworkName] = useState('');
  const [contact, setContact] = useState('');
  const [totalBudget, setTotalBudget] = useState('');
  const [discount, setDiscount] = useState('');
  const [hashTags, setHashTags] = useState('');
  const [description, setDescription] = useState('');
  const [approvalTime, setApprovalTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [finishTime, setFinishTime] = useState('');
  const [networkCount, setNetworkCount] = useState('');
  const [networkIcon, setNetworkIcon] = useState('');
  const [networkData, setNetworkData] = useState([]);
  const [campaignScheduleData, setCampaignScheduleData] = useState([]);

  const [myData, setMyData] = useState([]);
  const [networkIDList, setNetworkIDList] = useState([]);
  const [networkIDList1, setNetworkIDList1] = useState([]);
  const [networkIDList2, setNetworkIDList2] = useState([]);
  const [networkIDList3, setNetworkIDList3] = useState([]);
  const [networkIDList4, setNetworkIDList4] = useState([]);
  //const [compaignNetworksAllData, setcompaignNetworksAllData] = useState('');
  function Edit_CancelClick() {
    setButtonsvisible(true);
  }
  function clickButtonsvisible() {
    //
    setButtonsvisible(false);
  }
  function ButtonShowxx() {
    var value = AsyncStorage.getItem('LoginInformation');
    value.then(data => {
      let Asyncdata = JSON.parse(data);
    });
  }
  const clickForDetailother = async () => {
    //console.log('clickForDetailother clickForDetailother ' + JSON.stringify(props.data));
    //console.log('clickForDetailother clickForDetailother networkData ' + JSON.stringify(networkData));
    var AttachmentCount = props.data.attachments.length;
    setAttachmentDataList(AttachmentCount);
    //
    var networkcount = JSON.parse(props.data.compaignsdetails);
    const itemCount = networkcount.length;
    setNetworkCount(itemCount);
    var myCampaignDetail = props;
    // console.log('myCampaignDetail myCampaignDetail ' + myCampaignDetail.id + JSON.stringify(myCampaignDetail.compaignNetworks));
    if (
      myCampaignDetail.compaignNetworks != '' &&
      myCampaignDetail.compaignNetworks.length >= 4
    ) {
      //console.log('myCampaignDetail not empty ' + JSON.stringify(myCampaignDetail));
      console.log(
        'myCampaignDetail not empty  ' +
          JSON.stringify(
            JSON.parse(myCampaignDetail.compaignNetworks)[0].networkId,
          ) +
          ' , ' +
          JSON.stringify(
            JSON.parse(myCampaignDetail.compaignNetworks)[1].networkId,
          ),
      );
      setNetworkIDList(
        JSON.parse(myCampaignDetail.compaignNetworks)[0].networkId,
      );
      setNetworkIDList1(
        JSON.parse(myCampaignDetail.compaignNetworks)[1].networkId,
      );
      setNetworkIDList2(
        JSON.parse(myCampaignDetail.compaignNetworks)[2].networkId,
      );
      setNetworkIDList3(
        JSON.parse(myCampaignDetail.compaignNetworks)[3].networkId,
      );
      setNetworkIDList4(
        JSON.parse(myCampaignDetail.compaignNetworks)[4].networkId,
      );
      //
      //console.log('myCampaignDetail ' + JSON.stringify(JSON.parse(myCampaignDetail.compaignNetworks)));
      // MyData(JSON.parse(myCampaignDetail.compaignNetworks));
    }

    //console.log('myData myData ' + JSON.stringify(myData));
  };
  const UpdateCampaign = async props => {
    global.UpdateCampaign = 1;
    console.log('UpdateCampaign click ' + JSON.stringify(props));
    AsyncStorage.setItem('CampaignUpdate', JSON.stringify(props));
    props.OpenUpdateCampaign();
  };
  const clickForDetail = async props => {
    //console.log('clickForDetail click ' + JSON.stringify(props));
    console.log('clickForDetail click network new ' + JSON.stringify(props));
    console.log(
      'clickForDetail compaignschedules ' +
        JSON.stringify(props.data.compaignschedules),
    );
    // console.log('clickForDetail network network network network network  ' + JSON.stringify());
    //myCampaignDetail = [{img: this.props}];
    global.Network_Detail = 1;
    setModalVisiblecamera(true);
    setNetworkVisible(true);
    setCampaignVisible(false);
    setScheduleVisible(false);
    var myCampaignDetail = props;
    setNetworkData(JSON.parse(props.data.compaignsdetails));
    setCampaignScheduleData(JSON.parse(props.data.compaignschedules));
    setName(myCampaignDetail.name);
    setTitle(myCampaignDetail.title);
    setOrgName(myCampaignDetail.orgName);
    //setNetworkName(myCampaignDetail.networkName);
    setContact(myCampaignDetail.contact);
    setTotalBudget(myCampaignDetail.totalBudget);
    setDiscount(myCampaignDetail.discount);
    setHashTags(myCampaignDetail.hashTags);
    setDescription(myCampaignDetail.description);
    setApprovalTime(myCampaignDetail.approvalTime);
    setStartTime(myCampaignDetail.startTime);
    setFinishTime(myCampaignDetail.finishTime);

    const namesArray = networkData.map(item => item.networkName.split(','));
    setNetworkName(namesArray);
  };
  function CancelShow() {
    setButtonsvisible(false);
  }
  function CloseModalDetail() {
    setModalVisiblecamera(false);
  }
  function NetworkDetailClick() {
    global.Network_Detail = 1;
    setCampaignVisible(true);
    setNetworkVisible(false);
    setScheduleVisible(false);
    console.log(
      'NetworkVisible > ' +
        NetworkVisible +
        ' CampaignVisible > ' +
        CampaignVisible +
        ' ScheduleVisible > ' +
        ScheduleVisible,
    );
  }
  function NotNetworkDetailClick() {
    setNetworkVisible(true);
    setCampaignVisible(false);
    setScheduleVisible(false);
    global.Network_Detail = 0;
    console.log(
      'NetworkVisible > ' +
        NetworkVisible +
        ' CampaignVisible > ' +
        CampaignVisible +
        ' ScheduleVisible > ' +
        ScheduleVisible,
    );
  }
  function ScheduleDetail() {
    setScheduleVisible(true);
    setNetworkVisible(false);
    setCampaignVisible(false);
    global.Network_Detail = 2;
    console.log(
      'NetworkVisible > ' +
        NetworkVisible +
        ' CampaignVisible > ' +
        CampaignVisible +
        ' ScheduleVisible > ' +
        ScheduleVisible,
    );
  }
  function whatsappSendMessage() {
    var ContactNumber = this.props.contact;
    //if(ContactNumber == )
    var ContactNum = ContactNumber.replace(/^0+/, '');
    //var ContactNum = '92' + this.props.contact.replace(/^0+/, '');

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append(
      'Authorization',
      'Bearer EAAIKVlitaIYBALY9AJyZBZAD8Pfbyb1S8QW7XuvxeptMkoGxqT9Sa766eggme2tURaTKliDVx5PKJ2ZAJBpAcLjQJ7MArzt8cWLZBaHTGZCQSi9C0VxiqE60e1zqPuF88os3rvxOj1kU7X9ZA5SRoKOOpcCSkItl83Thxw7DTRulTQ9wEQ9KyScPwflOuiVwGJoZCqJZA3Eg9QZDZD',
    );

    var raw = JSON.stringify({
      messaging_product: 'whatsapp',
      //"to": "92" + ContactNum,
      to: ContactNum,
      //"to": "923042676412",
      //"to": "96265777766",
      type: 'template',
      template: {
        name: 'hello_world',
        language: {
          code: 'en_US',
        },
      },
    });
    //var newcontact = ContactNum;
    //console.log('newcontact newcontact ' + newcontact.replace(/^0+/, ''));
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };
    SuccessMessage();
    fetch(
      'https://graph.facebook.com/v16.0/115772434768092/messages',
      requestOptions,
    )
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }
  function SuccessMessage() {
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
    }, 4000);
    var Number = this.props.contact;

    Toast.show('Your message to ' + Number + ' has been send successfully!');
  }
  function checkloginfordelete() {
    Toast.show('You need license for delete');
  }
  function SettingClickForChange(props) {
    console.log('SettingClickForChange click ' + JSON.stringify(props));
    // props.SettingClickForChange(props);
    AsyncStorage.setItem('CampaignChangeStatus', JSON.stringify(props));
    props.SettingClickForChangeFlatList(props);
  }
  const ClickDeleteData = async props => {
    props.StatusChangeOnClick(props);
    setButtonsvisible(false);
  };
  function AttachmentPreview(props) {
    var AttachmentPreview = props.data.attachments;
    //console.log('AttachmentPreview ' + JSON.stringify(AttachmentPreview));
    props.AttachmentPreviewDetail(AttachmentPreview);
  }
  function ActionButtonClick(props) {
    console.log('sidebarshowhidefunction click ' + JSON.stringify(props));
    if (sidebarshowhide == true) {
      setsidebarshowhide(false);
    }
    if (sidebarshowhide == false) {
      setsidebarshowhide(true);
    }
  }
  function openShare() {
    Toast.show('coming soon!');
  }
  const Item = ({networkId, networkName}) => (
    <View style={{textAlign: 'right', marginLeft: 7}}>
      <TouchableOpacity>
        <Text style={styles.NetworkNameTitle}>{networkName}</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <Fragment>
      <GestureRecognizer
        onSwipeLeft={() => Edit_CancelClick()}
        onSwipeRight={() => Edit_CancelClick()}
        config={config}>
        <DoubleClick onClick={() => CompleteShow(props)}>
          <View
            style={[
              styles.item,
              {
                backgroundColor: theme.cardBackColor,
                // borderColor: theme.cardBackColor,
              },
            ]}>
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
                      {props.data.status != 1 ? (
                        <Text style={styles.btnResend}>Active</Text>
                      ) : (
                        <Text style={styles.btnResend}>Delete</Text>
                      )}
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
                    onPress={() => UpdateCampaign(props)}
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
            <TouchableOpacity
              style={
                props.data.status != 1
                  ? styles.CampaignStatusInactive
                  : styles.CampaignStatusActive
              }
              onPress={() => clickForDetail(props)}>
              <View style={{width: 15 + '%'}}>
                {props.logoAvatar == '' || props.logoAvatar == null ? (
                  <Image source={BDMT} style={styles.ProfileStyle} />
                ) : (
                  <Image
                    source={{
                      uri:
                        servicesettings.Imagebaseuri +
                        props.logoAvatar
                          .replace(/\\/g, '/')
                          .replace(',', '')
                          .replace(' //', ''),
                    }}
                    style={styles.ProfileStyle}
                  />
                )}
              </View>
              <View style={{width: 84 + '%', marginLeft: 5, paddingTop: 6}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                  <Text style={[styles.TitleStyle, {color: theme.textColor}]}>
                    {props.title == '' ? props.orgName : props.title}
                  </Text>
                  <View style={styles.ActionButtonView}>
                    {attachmentDataList != 0 || attachmentDataList != '' ? (
                      <TouchableOpacity
                        style={styles.settingIconView}
                        onPress={() => AttachmentPreview(props)}>
                        <Image
                          source={AttachmentIcon}
                          style={styles.attachmentIcon}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.settingIconView}></TouchableOpacity>
                    )}
                    <View style={{width: 35 + '%', paddingLeft: 5}}>
                      <Text
                        style={[
                          styles.NetworkCountView,
                          {
                            color: theme.textColor,
                            backgroundColor: theme.buttonBackColor,
                          },
                        ]}>
                        {networkCount}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.settingIconView}
                      onPress={() => SettingClickForChange(props)}>
                      <Icons
                        style={[styles.SettingIcon, {color: theme.tintColor}]}
                        name="setting"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.ItemDetailViewsecond}>
                  <View style={styles.Itemdetail}>
                    <Text style={[styles.StartTime, {color: theme.textColor}]}>
                      {moment(props.startTime).format('MM-DD-YY hh:mm a')}
                    </Text>
                  </View>
                  <View style={styles.ItemdetailMiddle}>
                    <Text style={[styles.StartTime, {color: theme.textColor}]}>
                      {'~'}
                    </Text>
                  </View>
                  <View style={styles.Itemdetail}>
                    <Text style={[styles.FinishTime, {color: theme.textColor}]}>
                      {moment(props.finishTime).format('MM-DD-YY hh:mm a')}
                    </Text>
                    <View></View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </DoubleClick>
      </GestureRecognizer>
      <Modal
        animationType="fade"
        transparent={true}
        supportedOrientations={['portrait']}
        visible={modalVisiblecamera}
        onRequestClose={() => {
          ({modalVisiblecamera: !modalVisiblecamera});
        }}>
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              {backgroundColor: theme.backgroundColor},
            ]}>
            <View style={styles.Img_OrgView}>
              <View style={{width: 24 + '%'}}>
                {props.logoAvatar == '' || props.logoAvatar == null ? (
                  <Image source={BDMT} style={styles.OrgLogo} />
                ) : (
                  <Image
                    source={{
                      uri:
                        servicesettings.Imagebaseuri +
                        props.logoAvatar
                          .replace(/\\/g, '/')
                          .replace(',', '')
                          .replace(' //', ''),
                    }}
                    style={styles.OrgLogo}
                  />
                )}
              </View>
              <Text style={[styles.OrgNameStyle, {color: theme.textColor}]}>
                {name}
              </Text>
            </View>
            <View
              style={[
                styles.ButtonViewstyle,
                {backgroundColor: theme.cardBackColor},
              ]}>
              {ScheduleVisible != true ? (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={[
                      CampaignVisible == false
                        ? styles.btnCampaignDetailClick
                        : styles.btnCampaignDetail,
                      {
                        borderColor: theme.buttonBackColor,
                      },
                    ]}
                    onPress={() => NotNetworkDetailClick()}>
                    <Text
                      style={[
                        styles.NetWork_DetailText,
                        {color: theme.textColor},
                      ]}>
                      Campaign Detail
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      NetworkVisible == false
                        ? styles.btnNetWorkClick
                        : styles.btnNetWork,
                      {
                        borderColor: theme.buttonBackColor,
                      },
                    ]}
                    onPress={() => NetworkDetailClick()}>
                    <Text
                      style={[
                        styles.NetWork_DetailText,
                        {color: theme.textColor},
                      ]}>
                      Networks
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={styles.btnCampaignDetailClick}
                    onPress={() => NotNetworkDetailClick()}>
                    <Text
                      style={[
                        styles.NetWork_DetailText,
                        {color: theme.textColor},
                      ]}>
                      Campaign Detail
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnNetWorkClick}
                    onPress={() => NetworkDetailClick()}>
                    <Text
                      style={[
                        styles.NetWork_DetailText,
                        {color: theme.textColor},
                      ]}>
                      Networks
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={[
                  ScheduleVisible == false
                    ? styles.btnScheduleDetail
                    : styles.btnScheduleDetailClick,
                  {
                    borderColor: theme.buttonBackColor,
                  },
                ]}
                onPress={() => ScheduleDetail()}>
                <Text
                  style={[styles.NetWork_DetailText, {color: theme.textColor}]}>
                  Schedules
                </Text>
              </TouchableOpacity>
            </View>
            {CampaignVisible == true ? (
              <View>
                <View
                  style={{
                    width: Dimensions.get('window').width - 20,
                    marginHorizontal: 10,
                    marginTop: 6,
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: theme.textColor,
                      width: 17 + '%',
                    }}>
                    Network
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: theme.textColor,
                      width: 23 + '%',
                    }}>
                    {' '}
                    Total
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: theme.textColor,
                      width: 22 + '%',
                    }}>
                    Delivered
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: theme.textColor,
                      width: 23 + '%',
                    }}>
                    Remaining
                  </Text>
                </View>
                <FlatList
                  data={networkData}
                  keyExtractor={(item, id) => id.toString()}
                  renderItem={({item}) => (
                    <NetworkMycampaign
                      ActionButtonClick={ActionButtonClick}
                      data={item.data}
                      id={item.id}
                      freeQouta={item.freeQouta}
                      userName={item.userName}
                      compaignFrom={item.compaignFrom}
                      compaignQouta={item.compaignQouta}
                      networkId={item.networkId}
                      networkName={item.networkName}
                      lastUpdatedAt={item.lastUpdatedAt}></NetworkMycampaign>
                  )}
                  numColumns={1}
                  horizontal={false}
                />
                {sidebarshowhide == true ? (
                  <View style={styles.sidebarViewRightupsideview}>
                    <View
                      style={[
                        styles.sidebarViewRight,
                        {backgroundColor: theme.backgroundColor},
                      ]}>
                      <TouchableOpacity
                        style={styles.closeIconView}
                        onPress={() => ActionButtonClick()}>
                        <Icon
                          name="close"
                          style={[styles.closeIcon, {color: theme.tintColor}]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.ChangeActionView,
                          {backgroundColor: theme.cardBackColor},
                        ]}
                        onPress={() => openShare()}>
                        <View style={styles.SidebarIconView}>
                          <Image
                            source={deleteicon}
                            style={[
                              styles.ribbonIcon,
                              // {tintColor: theme.buttonBackColor},
                            ]}
                          />
                        </View>
                        <View style={styles.SidebarDetailView}>
                          <Text
                            style={[styles.IconText, {color: theme.textColor}]}>
                            Active
                          </Text>
                          <Text
                            style={[
                              styles.IconTextDetail,
                              {color: theme.textColor},
                            ]}>
                            Network all schedules will be activated
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.ChangeActionView,
                          {backgroundColor: theme.cardBackColor},
                        ]}
                        onPress={() => openShare()}>
                        <View style={styles.SidebarIconView}>
                          <Image
                            source={deleteicon}
                            style={[
                              styles.ribbonIcon,
                              // {tintColor: theme.buttonBackColor},
                            ]}
                          />
                        </View>
                        <View style={styles.SidebarDetailView}>
                          <Text
                            style={[styles.IconText, {color: theme.textColor}]}>
                            Delete
                          </Text>
                          <Text
                            style={[
                              styles.IconTextDetail,
                              {color: theme.textColor},
                            ]}>
                            Your network all activity will be terminated
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.ChangeActionView,
                          {backgroundColor: theme.cardBackColor},
                        ]}
                        onPress={() => openShare()}>
                        <View style={styles.SidebarIconView}>
                          <Image
                            source={playicon}
                            style={[
                              styles.ribbonIcon,
                              // {tintColor: theme.buttonBackColor},
                            ]}
                          />
                        </View>
                        <View style={styles.SidebarDetailView}>
                          <Text
                            style={[styles.IconText, {color: theme.textColor}]}>
                            play
                          </Text>
                          <Text
                            style={[
                              styles.IconTextDetail,
                              {color: theme.textColor},
                            ]}>
                            Network all schedules will be resumed
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.ChangeActionView,
                          {backgroundColor: theme.cardBackColor},
                        ]}
                        onPress={() => openShare()}>
                        <View style={styles.SidebarIconView}>
                          <Image
                            source={pauseicon}
                            style={[
                              styles.ribbonIcon,
                              // {tintColor: theme.white},
                            ]}
                          />
                        </View>
                        <View style={styles.SidebarDetailView}>
                          <Text
                            style={[styles.IconText, {color: theme.textColor}]}>
                            Pause
                          </Text>
                          <Text
                            style={[
                              styles.IconTextDetail,
                              {color: theme.textColor},
                            ]}>
                            Network all activities will be paused
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            ) : null}
            {NetworkVisible == true ? (
              <View style={styles.ModalMainView}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginHorizontal: 10,
                    paddingTop: 10,
                  }}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Description
                  </Text>
                  <Text style={[styles.titleDetail, {color: theme.textColor}]}>
                    {name}
                  </Text>
                </View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Start Time
                  </Text>
                  <Text style={[styles.titleDetail, {color: theme.textColor}]}>
                    {startTime == '' || startTime == null
                      ? '--'
                      : moment(startTime).format('MM-DD-YY hh:mm a')}
                  </Text>
                </View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Finish Time
                  </Text>
                  <Text style={[styles.titleDetail, {color: theme.textColor}]}>
                    {finishTime == '' || finishTime == null
                      ? '--'
                      : moment(finishTime).format('MM-DD-YY hh:mm a')}
                  </Text>
                </View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Networks
                  </Text>
                  <View style={styles.titleDetailView}>
                    <FlatList
                      data={networkData}
                      renderItem={({item}) => (
                        <Item
                          networkName={item.networkName}
                          networkId={item.networkId}
                        />
                      )}
                      keyExtractor={item => item.id}
                      numColumns={1}
                      horizontal={true}
                    />
                  </View>
                </View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Contact
                  </Text>
                  <Text style={[styles.titleDetail, {color: theme.textColor}]}>
                    {contact == '' || contact == null ? '--' : contact}
                  </Text>
                </View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Auto Generate
                  </Text>
                  <View style={styles.AutoGenerateMainStyle}>
                    {hashTags == '' || hashTags == null ? (
                      <Image
                        source={AutoGenerateYes}
                        style={[
                          styles.AutoGenerateStyle,
                          {tintColor: theme.selectedCheckBox},
                        ]}
                      />
                    ) : (
                      <Image
                        source={AutoGenerateYes}
                        style={[
                          styles.AutoGenerateStyle,
                          {tintColor: theme.selectedCheckBox},
                        ]}
                      />
                    )}
                  </View>
                </View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Hash Tags
                  </Text>
                  <Text style={[styles.titleDetail, {color: theme.textColor}]}>
                    {hashTags == '' || hashTags == null ? '--' : hashTags}
                  </Text>
                </View>
                <View
                  style={{
                    marginLeft: 5,
                    marginRight: 5,
                    width: Dimensions.get('window').width - 30,
                    height: 2,
                    marginBottom: 2,
                    marginTop: 15,
                    backgroundColor: colors.PagePanelTab,
                  }}></View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Discount
                  </Text>
                  <Text style={[styles.titleDetail, {color: theme.textColor}]}>
                    {discount == '' || discount == null ? '--' : discount}
                  </Text>
                </View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Total Budget
                  </Text>
                  <Text style={[styles.titleDetail, {color: theme.textColor}]}>
                    {totalBudget == '' || totalBudget == null
                      ? '--'
                      : totalBudget}
                  </Text>
                </View>
                <View style={styles.CampaignDetailStyle}>
                  <Text style={[styles.titleHeading, {color: theme.textColor}]}>
                    Remarks
                  </Text>
                  <Text style={[styles.titleDetail, {color: theme.textColor}]}>
                    {description == '' || description == null
                      ? '--'
                      : description}
                  </Text>
                </View>
                <View style={styles.btnViewDetail}>
                  <TouchableOpacity
                    style={[
                      styles.btnDetail_Delete,
                      {backgroundColor: theme.buttonBackColor},
                    ]}>
                    <Text style={styles.Delete_Play_PauseTxt}>Pause</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.btnDetail_Delete,
                      {backgroundColor: theme.buttonBackColor},
                    ]}
                    onPress={() => CloseModalDetail()}>
                    <Text style={styles.Delete_Play_PauseTxt}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            {ScheduleVisible == true ? (
              <View>
                <View
                  style={{
                    width: Dimensions.get('window').width - 20,
                    marginHorizontal: 10,
                    marginTop: 6,
                    flexDirection: 'row',
                  }}></View>
                <FlatList
                  data={campaignScheduleData}
                  keyExtractor={(item, id) => id.toString()}
                  renderItem={({item}) => (
                    <MycampaignScheduleList
                      ActionButtonClick={ActionButtonClick}
                      data={item.data}
                      id={item.id}
                      compaignDetailId={item.CompaignDetailId}
                      networkId={item.NetworkId}
                      interval={item.Interval}
                      budget={item.budget}
                      messageCount={item.MessageCount}
                      intervaltypename={item.intervaltypename}
                      intervalTypeId={item.IntervalTypeId}
                      startTime={item.StartTime}
                      finishTime={item.FinishTime}
                      days={item.days}></MycampaignScheduleList>
                  )}
                  numColumns={1}
                  horizontal={false}
                />
                {sidebarshowhide == true ? (
                  <View style={styles.sidebarViewRightupsideview}>
                    <View
                      style={[
                        styles.sidebarViewRight,
                        {backgroundColor: theme.modalBackColor},
                      ]}>
                      <TouchableOpacity
                        style={styles.closeIconView}
                        onPress={() => ActionButtonClick()}>
                        <Icon name="close" style={styles.closeIcon} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.ChangeActionView,
                          {backgroundColor: theme.cardBackColor},
                        ]}
                        onPress={() => openShare()}>
                        <View style={styles.SidebarIconView}>
                          <Image
                            source={deleteicon}
                            style={[
                              styles.ribbonIcon,
                              {tintColor: theme.buttonBackColor},
                            ]}
                          />
                        </View>
                        <View style={styles.SidebarDetailView}>
                          <Text
                            style={[styles.IconText, {color: theme.textColor}]}>
                            Active
                          </Text>
                          <Text
                            style={[
                              styles.IconTextDetail,
                              {color: theme.textColor},
                            ]}>
                            Network all schedules will be activated
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.ChangeActionView,
                          {backgroundColor: theme.cardBackColor},
                        ]}
                        onPress={() => openShare()}>
                        <View style={styles.SidebarIconView}>
                          <Image
                            source={deleteicon}
                            style={[
                              styles.ribbonIcon,
                              {tintColor: theme.buttonBackColor},
                            ]}
                          />
                        </View>
                        <View style={styles.SidebarDetailView}>
                          <Text
                            style={[styles.IconText, {color: theme.textColor}]}>
                            Delete
                          </Text>
                          <Text
                            style={[
                              styles.IconTextDetail,
                              {color: theme.textColor},
                            ]}>
                            Your network all activity will be terminated
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.ChangeActionView,
                          {backgroundColor: theme.cardBackColor},
                        ]}
                        onPress={() => openShare()}>
                        <View style={styles.SidebarIconView}>
                          <Image
                            source={playicon}
                            style={[
                              styles.ribbonIcon,
                              {tintColor: theme.buttonBackColor},
                            ]}
                          />
                        </View>
                        <View style={styles.SidebarDetailView}>
                          <Text
                            style={[styles.IconText, {color: theme.textColor}]}>
                            play
                          </Text>
                          <Text
                            style={[
                              styles.IconTextDetail,
                              {color: theme.textColor},
                            ]}>
                            Network all schedules will be resumed
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.ChangeActionView,
                          {backgroundColor: theme.cardBackColor},
                        ]}
                        onPress={() => openShare()}>
                        <View style={styles.SidebarIconView}>
                          <Image
                            source={pauseicon}
                            style={[
                              styles.ribbonIcon,
                              {tintColor: theme.buttonBackColor},
                            ]}
                          />
                        </View>
                        <View style={styles.SidebarDetailView}>
                          <Text
                            style={[styles.IconText, {color: theme.textColor}]}>
                            Pause
                          </Text>
                          <Text
                            style={[
                              styles.IconTextDetail,
                              {color: theme.textColor},
                            ]}>
                            Network all activities will be paused
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View></View>
                )}
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </Fragment>
  );
}
const styles = StyleSheet.create({
  TitleStyle: {
    marginRight: 2 + '%',
    paddingTop: 8,
    fontSize: 15,
    // color: ,
    width: 60 + '%',
    //backgroundColor:'green'
  },
  ActionButtonView: {
    width: 38 + '%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
    //backgroundColor:'gray'
  },
  CampaignStatusActive: {
    width: 100 + '%',
    borderColor: 'red',
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.PagePanelTab,
    borderWidth: 1,
    borderRadius: 5,
  },
  CampaignStatusInactive: {
    width: 100 + '%',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: colors.PagePanelTab,
    borderColor: colors.red,
    borderWidth: 1,
    borderRadius: 5,
  },
  NetworkCountView: {
    marginTop: 3,
    marginRight: 12,
    // marginLeft: 12,
    paddingTop: 6,
    backgroundColor: '#1da1f2',
    width: 29,
    height: 29,
    color: 'white',
    fontSize: 12,
    borderRadius: 50,
    textAlign: 'center',
  },
  settingIconView: {
    //marginRight: 12,
    paddingTop: 2,
    // color: theme.textColor,
    width: 29 + '%',
    //backgroundColor:'green'
  },
  attachmentIcon: {
    height: 29,
    width: 29,
  },
  SettingIcon: {
    fontSize: 29,
    // color: theme.textColor,
  },
  SocialIcon: {
    height: 24,
    width: 24,
  },
  OrderNumberPhone: {
    marginRight: 12,
    fontSize: 15,
    color: colors.MyCampaignLabelColor,
    width: 38 + '%',
  },
  Ordervalue: {
    // fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 15,
    color: 'red',
  },
  imageStyle: {
    paddingRight: 7,
    paddingLeft: 13,
    fontSize: 22,
    color: colors.AwesomeIconColor,
  },
  itemImage: {
    // paddingRight:7,
    paddingLeft: 13,
    height: 25,
    width: 60,
  },
  btnDelete: {
    height: 40,
    borderRadius: 10,
    borderWidth: 0,
    // backgroundColor: '#ff0000a1',
    alignItems: 'center',
    justifyContent: 'center',
    // margin:4,
    //marginTop: 5,
  },
  btnComplete: {
    height: 40,
    borderRadius: 10,
    borderWidth: 0,
    //borderWidth: 1,
    //backgroundColor: '#008000a6',
    alignItems: 'center',
    justifyContent: 'center',
    // margin:4,
    // marginTop: 5,
  },
  btnViewCancel: {
    // width: 100 + '%',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 10,
    borderWidth: 0,
    backgroundColor: colors.Blazorbutton,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  btnCancel: {
    height: 40,
    borderRadius: 10,
    borderWidth: 0,
    // backgroundColor: '#ff0000a1',
    alignItems: 'center',
    justifyContent: 'center',
    //margin:4,
    //marginTop: 5,
  },
  btnDetail_Delete: {
    width: 46 + '%',
    height: 40,
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: colors.Blazorbutton,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    //marginTop: 5,
  },

  btnResend: {
    fontSize: 16,
    color: colors.white,
  },
  TotalpackageAmount: {
    fontSize: 15,
    color: colors.LabelDetailColor,
  },
  titleDetail: {
    //backgroundColor:'red',
    textAlign: 'right',
    color: colors.LabelDetailColor,
    fontSize: 15,
    width: 62 + '%',
  },
  titleDetailView: {
    //backgroundColor:'red',
    textAlign: 'right',
    width: 62 + '%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  NetworkNameTitle: {
    textAlign: 'right',
    color: colors.LabelDetailColor,
    fontSize: 13,
    //width:62 + '%',
  },
  closeIconView: {
    textAlign: 'right',
    width: Dimensions.get('window').width - 60,
    paddingTop: 12,
  },
  closeIcon: {
    textAlign: 'right',
    fontSize: 25,
  },
  titleHeading: {
    color: colors.LabelDetailColor,
    fontSize: 15,
    width: 38 + '%',
    //backgroundColor:'red'
  },
  totalamount: {
    //marginLeft: 10,
    fontSize: 13,
    color: colors.MyCampaignLabelColor,
  },
  StartTime: {
    //marginLeft: 10,
    fontSize: 13,
    color: colors.TextColorOther,
  },
  FinishTime: {
    marginLeft: 10,
    fontSize: 15,
    color: colors.TextColorOther,
  },
  socialMediaIcon: {
    height: 24,
    width: 24,
    marginHorizontal: 6,
    marginTop: 2,
    //color: '#25d366',
    //textAlign: 'right',
    // backgroundColor:'gray',
  },
  ButtonView: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width - 10,
    marginHorizontal: 5,
    backgroundColor: '#d5d5d5',
    flexDirection: 'row',
    zIndex: 1,
  },
  btnSubmit: {
    margin: 5,
    height: 38,
  },
  btnViewDetail: {
    //backgroundColor:'green',
    paddingTop: 18,
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    flexDirection: 'row',
  },
  Delete_Play_PauseTxt: {
    fontSize: 15,
    paddingTop: 2,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    justifyContent: 'center',
  },
  ItemDetailView: {
    flexDirection: 'row',
    marginLeft: 2 + '%',
    flexDirection: 'row',
    marginTop: 1 + '%',
    width: 100 + '%',
    //bottom: 5,
  },
  ItemDetailViewsecond: {
    marginLeft: 1 + '%',
    flexDirection: 'row',
    marginTop: 2 + '%',
    width: 100 + '%',
    marginBottom: 3 + '%',
  },
  Itemdetail: {
    flexDirection: 'row',
    width: 45 + '%',
    //backgroundColor:'red'
    //width: Dimensions.get('window').width,
  },
  ItemdetailMiddle: {
    flexDirection: 'row',
    width: 8 + '%',
  },
  item: {
    marginTop: 3 + '%',
    marginLeft: 2 + '%',
    marginRight: 2 + '%',
    width: 96 + '%',
    backgroundColor: colors.PagePanelTab,
    // borderColor: colors.borderColor,
    borderWidth: 1,
    borderRadius: 5,
  },
  CampaignDetailStyle: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingTop: 12,
  },
  ProfileStyle: {
    // marginTop:5,
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 1,
    borderColor: colors.red,
    //backgroundColor: "blue",
    borderWidth: 0.6,
    //backgroundColor: "#e7e9eb59",
    borderRadius: 50,
    height: 50,
    width: 50,
  },
  centeredView: {
    marginTop: 13 + '%',
  },
  modalView: {
    //height:100 + '%',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: 'white',
  },
  ModalMainView: {
    marginHorizontal: 10,
    paddingTop: 9,
  },
  Img_OrgView: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
    borderTopWidth: 0.6,
    borderTopColor: '#e5e5e5',
    flexDirection: 'row',
  },
  OrgLogo: {
    height: 70,
    width: 70,
    borderRadius: 150,
    borderWidth: 2,
    borderColor: colors.profileBorderColor,
  },
  AutoGenerateMainStyle: {
    width: 62 + '%',
  },
  AutoGenerateStyle: {
    height: 35,
    width: 35,
    alignSelf: 'flex-end',
  },
  OrgNameStyle: {
    width: 74 + '%',
    fontFamily: 'FontAwesome',
    //backgroundColor:'blue',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.TextColorOther,
  },
  cancelview: {
    position: 'absolute',
    right: 20,
    bottom: 65,
    width: 42 + '%',
  },
  cameraheading: {
    marginTop: 2 + '%',
    color: colors.LabelDetailColor,
    fontSize: 22,
    fontWeight: 'bold',
  },
  cameracancel: {
    color: colors.white,
    fontWeight: 'bold',
  },
  ButtonViewstyle: {
    backgroundColor: colors.PagePanelTab,
    // marginTop: 15,
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  NetWork_DetailText: {
    fontSize: 15,
    paddingTop: 8,
    fontWeight: 'bold',
    color: colors.LabelDetailColor,
    textAlign: 'center',
    justifyContent: 'center',
  },
  btnNetWorkClick: {
    flexBasis: '33%',
    height: 40,
    //marginLeft:1,
    borderBottomWidth: 2,
    borderRadius: 0,
    borderColor: '#1d9bf0ad',
    borderWidth: 0,
  },
  btnTest: {
    height: 35,
    width: 25 + '%',
    marginLeft: 1,
    borderRadius: 6,
    backgroundColor: colors.Blazorbutton,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 3,
  },
  btnCampaignDetailClick: {
    flexBasis: '33%',
    height: 40,
    //marginRight:1,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#1d9bf0ad',
    borderBottomWidth: 2,
  },
  btnNetWork: {
    flexBasis: '33%',
    height: 40,
    //marginLeft:1,
    borderBottomWidth: 0,
    borderRadius: 0,
    borderWidth: 0,
  },
  btnCampaignDetail: {
    flexBasis: '33%',
    height: 40,
    //marginRight:1,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  btnScheduleDetailClick: {
    flexBasis: '33%',
    height: 40,
    //marginRight:1,
    borderRadius: 0,
    borderWidth: 0,
    borderColor: '#1d9bf0ad',
    borderBottomWidth: 2,
  },
  btnScheduleDetail: {
    flexBasis: '33%',
    height: 40,
    //marginRight:1,
    borderRadius: 0,
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  sidebarViewRightupsideview: {
    marginTop: 80,
    width: Dimensions.get('window').width - 40,
    marginHorizontal: 20,
    position: 'absolute',
    //right: 10,
  },
  ChangeActionMainView: {
    //marginTop:80,
    width: Dimensions.get('window').width - 40,
    marginHorizontal: 20,
    position: 'absolute',
    //right: 10,
  },
  sidebarViewRight: {
    backgroundColor: colors.PagePanelTab,
    // backgroundColor: '#c0c0c05e',
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: 9,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    //opacity: 0.7,
    // width: 90,
    // position: 'absolute',
    //right: 10,
  },
  ChangeActionView: {
    marginVertical: 5,
    paddingHorizontal: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    //justifyContent: 'space-around',
    //borderBottomColor: 'white',
    // borderBottomWidth: 1,
    width: Dimensions.get('window').width - 60,
    marginHorizontal: 30,
    borderRadius: 8,
    backgroundColor: '#dfdfdf',
    //height:55,
  },
  SidebarIconView: {
    marginVertical: 5,
    // backgroundColor:'gray',
    width: 15 + '%',
    //height:55,
  },
  SidebarDetailView: {
    marginVertical: 5,
    // backgroundColor:'gray',
    width: 85 + '%',
    paddingLeft: 8,
    //height:55,
  },
  ribbonIcon: {
    height: 45,
    width: 45,
    marginLeft: 3,
    // backgroundColor: 'red',
    //tintColor:'#1da1f2',
    //marginTop:3
  },
  IconText: {
    // color: theme.textColor,
    fontSize: 19,
    fontWeight: 'bold',
    width: 70 + '%',
    //backgroundColor: 'green',
    // fontWeight: "bold",
  },
  IconTextDetail: {
    color: '#00000091',
    fontSize: 14,
    width: 100 + '%',
    //backgroundColor: 'red',
    // fontWeight: "bold",
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
});

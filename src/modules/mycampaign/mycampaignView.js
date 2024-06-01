import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import Icons from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import RNFetchBlob from 'rn-fetch-blob';
import {TextInput} from '../../components';
import Alert from '../../components/Alert';
import Mycampaign from '../../components/Mycampaign';
import {colors} from '../../styles';
const deleteicon = require('../../../assets/images/deleteicon.png');
const crossIcon = require('../../../assets/images/cross.png');
const pdfview = require('../../../assets/images/pdfdownload.png');
const playicon = require('../../../assets/images/playicon.png');
const pauseicon = require('../../../assets/images/pauseicon.png');

import {useNavigation, useRoute} from '@react-navigation/native';
import servicesettings from '../dataservices/servicesettings';
var canceltime = 40;
export default function myvehicleScreen(props) {
  const navigation = useNavigation();
  const route = useRoute();
  global.currentscreen = route.name;
  const [Index, setIndex] = useState(0);
  const [Visible, setVisible] = useState(false);
  const [VisibleConfirmation, setVisibleConfirmation] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const [data, setdata] = useState([]);
  const [networkDataList, setNetworkDataList] = useState('');
  const [campaignScheduleList, setCampaignScheduleList] = useState('');
  const [userId, setUserId] = useState('');
  const [orgId, setOrgId] = useState('');
  const [attachmentData, setAttachmentData] = useState('');
  const [Search, setSearch] = useState('');
  const [img_Video, setImg_Video] = useState('');
  const [img_VideoType, setImg_VideoType] = useState('');
  const [searchBudget, setSearchBudget] = useState('');
  const [selectedCampaingId, setSelectedCampaingId] = useState('');
  const [selectStatusId, setSelectStatusId] = useState('');
  const [selectedCampaingStatus, setSelectedCampaingStatus] = useState('');
  const [store_id, setstore_id] = useState(0);
  const [status, setstatus] = useState(1);
  const [ordertime, setordertime] = useState(null);
  const [timeintervel, settimeintervel] = useState(null);
  const [loginVisible, setloginVisible] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [changeViewVisible, setChangeViewVisible] = useState(false);
  const [attachmentViewVisible, setAttachmentViewVisible] = useState(false);
  const [attachmentFullView, setAttachmentFullView] = useState(false);
  const [spinner, setspinner] = useState(false);
  const ClickStatus = value => {
    setVisible(true);
    setChangeViewVisible(false);
    ClickCampaignStatusName(value);
  };
  const hide = () => {
    setVisible(false);
  };
  const confirm = value => {
    setVisible(false);
    ClickCampaignStatusChange(value);
  };
  useEffect(() => {
    Loaddata();
  }, []);
  function Loaddata() {
    setspinner(true);
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      if (res != null) {
        let Asyncdata = JSON.parse(res);
        setUserId(Asyncdata[0].id);
        setOrgId(Asyncdata[0].orgid);
        const date = new Date();
        var headerFetch = {
          method: 'POST',
          body: JSON.stringify({
            orgId: Asyncdata[0].orgid,
            status: 0,
            name: '',
            networkId: 0,
            id: 0,
            lastUpdatedBy: Asyncdata[0].id,
          }),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: servicesettings.AuthorizationKey,
          },
        };
        console.log('headerFetch from bmtcompaigns ', headerFetch.body);
        fetch(servicesettings.baseuri + 'bmtcompaigns', headerFetch)
          .then(response => response.json())
          .then(responseJson => {
            console.log(
              'data response bmtcompaigns  =>',
              JSON.stringify(responseJson),
            );
            //console.log("data response bmtcompaigns data  =>", JSON.stringify(responseJson.data));
            //console.log("data response compaignsdetails  =>", JSON.stringify(responseJson.data.compaignsdetails));
            //console.log("data response compaignschedules  =>", JSON.stringify(responseJson.data.compaignschedules));
            //var myCampaignDetail = responseJson.data;
            //console.log("data response bmtcompaigns network  =>", myCampaignDetail.compaignNetworks);
            // console.log('myCampaignDetail ' + JSON.stringify(JSON.parse(myCampaignDetail.compaignNetworks)));
            if (responseJson.data != null) {
              setdata(responseJson.data);
              //setNetworkDataList(responseJson.data.compaignsdetails);
              //setCampaignScheduleList(responseJson.data.compaignschedules);
              //console.log("NetworkDataList  =>", JSON.stringify(networkDataList));
              setspinner(false);
            } else {
              setspinner(false);
            }
          })
          .catch(error => {
            console.error('service error', error);
            Toast.showWithGravity(
              'Internet connection failed, try another time !!!',
              Toast.LONG,
              Toast.CENTER,
            );
            setspinner(false);
          });
      } else {
        global.SignUp_Login = 1;
        props.navigation.replace('Login');
      }
    });
  }
  function searchDataClick() {
    if (Search == null || Search == '') {
      console.log('search  =>', Search);
      Toast.showWithGravity('Please enter Keyword', Toast.LONG, Toast.CENTER);
      return;
    }
    var headerFetch = {
      method: 'POST',
      body: JSON.stringify({
        orgId: orgId,
        status: 0,
        name: Search,
        networkId: 0,
        id: 0,
        lastUpdatedBy: userId,
      }),
      // body: JSON.stringify({orgId:Asyncdata[0].orgid,status:1,name:Search,networkId:0,id:0,lastUpdatedBy:Asyncdata[0].id}),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    fetch(servicesettings.baseuri + 'bmtcompaigns', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          'search bmtcompaigns response  =>',
          JSON.stringify(responseJson),
        );
        functionCombined();
        console.log(
          'search data response bmtcompaign  =>',
          JSON.stringify(responseJson),
        );
        if (responseJson.data != null) {
          setdata(responseJson.data);
          setspinner(false);
        } else {
          setspinner(false);
        }
      })
      .catch(error => {
        console.error('service error', error);
        Toast.showWithGravity(
          'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
        setspinner(false);
        functionCombined();
      });
  }
  function ClickCompaignStatus(SelectStatusVal) {
    console.log('selectedCampaingStatus status', selectedCampaingStatus);
    console.log('selectStatusId status', selectStatusId);
    var currentDate = new Date();
    var headerFetch = {
      method: 'POST',
      // 'id':(campaignIdForEdit=='' || campaignIdForEdit == null?0:campaignIdForEdit),"selectCountryId":Number(selectCountryId),"selectStateId":Number(selectStateId),"createdBy":Number(userId),"lastUpdatedBy":Number(userId),'status':campaignStatus==null||campaignStatus==''?1:campaignStatus,'orgId':Number(organizationId),'hashTags':Hashtag,'description':template,'name':Subject,'title':Subject,'autoGenerateLeads':selectAutoGenerate==null||selectAutoGenerate==""?0:selectAutoGenerate,'startTime':moment.utc(SelectCampaignStartDate!=''?SelectCampaignStartDate:'').format(),'finishTime':moment.utc(SelectCampaignEndDate!=''?SelectCampaignEndDate:'').format(),'CompaignNetworks': networkFinalData,'compaignExecutionSchedules': addScheduleDataForSubmit,'totalBudget':totalBudget,'discount':discount,};
      body: JSON.stringify({
        orgId: Number(orgId),
        status: selectStatusId,
        name: '',
        networkId: 0,
        id: SelectStatusVal,
        lastUpdatedBy: Number(userId),
        createdBy: Number(userId),
        campaignStatus: selectStatusId,
        hashTags: '',
        description: '',
        name: '',
        title: '',
        autoGenerateLeads: 0,
        createdAt: moment.utc(currentDate).format(),
        startTime: moment.utc(currentDate).format(),
        finishTime: moment.utc(currentDate).format(),
        totalBudget: 0,
      }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    console.log('Status headerFetch from compaignstatus ', headerFetch.body);
    fetch(servicesettings.baseuri + 'compaignstatus', headerFetch)
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          'Status compaignstatus response  =>',
          JSON.stringify(responseJson),
        );
        if (responseJson.status == true || responseJson.errorCode == '0') {
          responseJson.message != ''
            ? Toast.show(' ' + responseJson.message + ' ')
            : Toast.show('Data updated successfully');
          Loaddata();
          //setdata(responseJson.data)
          //setspinner(false);
        } else {
          Toast.showWithGravity(
            'Internet connection failed, try another time !!!',
            Toast.LONG,
            Toast.CENTER,
          );
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
  }
  function SettingClickForChangeFlatList() {
    AsyncStorage.getItem('CampaignChangeStatus').then(function(res) {
      let Asyncdata = JSON.parse(res);
      console.log('CampaignChangeStatus ', Asyncdata);
      // console.log('CampaignChangeStatus id ',Asyncdata.id);
      //console.log('CampaignChangeStatus status ',Asyncdata.status);
      //console.log('CampaignChangeStatus contact ',Asyncdata.data.contact);
      // console.log('CampaignChangeStatus id ',Asyncdata.data.status);
      setSelectedCampaingStatus(Asyncdata.data.status);
      setSelectedCampaingId(Asyncdata.id);
      if (changeViewVisible == true) {
        setChangeViewVisible(false);
        console.log('true click ');
      }
      if (changeViewVisible == false) {
        setChangeViewVisible(true);
        console.log('false click ');
      }
    });
  }
  function StatusChangeOnClick(props) {
    console.log('StatusChangeOnClick ', props);
    console.log('DeleteData click ' + JSON.stringify(props));
    console.log('DeleteData click ' + JSON.stringify(props.id));
    console.log('DeleteData click ' + JSON.stringify(props.data.status));
    var value = props.data.status;
    if (value == '1') {
      value = '5';
      global.StatusName = 'Active';
    } else {
      value = '1';
      global.StatusName = 'Delete';
    }
    setSelectStatusId(value);
    ClickStatus(value);
  }
  function ClickCampaignStatusChange(value) {
    console.log('ClickCampaignStatusChange ', value);
    // if(value==1){
    //  global.StatusName = 'Active';
    //   console.log('global.StatusName ' + global.StatusName);
    // }
    // else{
    //      global.StatusName = 'Delete';
    // }
    AsyncStorage.getItem('CampaignChangeStatus').then(function(res) {
      let Asyncdata = JSON.parse(res);
      var SelectStatusVal = Asyncdata.id;
      ClickCompaignStatus(SelectStatusVal);

      //setChangeViewVisible(false)
    });
  }
  function ClickCampaignStatusName(value) {
    console.log('ClickCampaignStatusChange ', value);
    setSelectStatusId(value);
    if (value == '1') {
      global.StatusName = 'Active';
    } else {
      global.StatusName = 'Delete';
    }
  }
  function AttachmentPreviewDetail(AttachmentPreview) {
    console.log('AttachmentPreviewDetail click ' + AttachmentPreview);
    //console.log('AttachmentPreviewDetail  ' + AttachmentPreview[1]);
    // console.log('AttachmentPreviewDetail click ' + AttachmentPreview[0].image.replace(/\\/g, "/").replace(',',"").replace(' //',""));
    setAttachmentData(JSON.parse(AttachmentPreview));
    //console.log('attachmentData ' + attachmentData);
    if (attachmentViewVisible == true) {
      setAttachmentViewVisible(false);
    }
    if (attachmentViewVisible == false) {
      setAttachmentViewVisible(true);
    }
  }
  function AttachmentFullViewClick(image) {
    console.log('image click ' + image);
    //console.log('image click full link ' + servicesettings.Imagebaseuri + image.replace(/\\/g, "/").replace(',',"").replace(' //',""));
    //console.log('img_Video click ' + img_Video);
    setImg_Video(image);
    setImg_VideoType(image);
    if (attachmentFullView == true) {
      setAttachmentFullView(false);
      setAttachmentViewVisible(true);
    }
    if (attachmentFullView == false) {
      setAttachmentFullView(true);
      setAttachmentViewVisible(false);
    }
  }
  function AddNewCampaignClick() {
    (global.UpdateCampaign = 0), props.navigation.navigate('Campaign Schedule');
  }
  function OpenUpdateCampaign() {
    (global.UpdateCampaign = 1), props.navigation.navigate('Campaign Schedule');
  }
  function functionCombined() {
    setShouldShow(!shouldShow);
  }
  function PreviewImageFullView(image) {
    console.log('PreviewImageFullView click ', image);
    setImg_Video(image);
  }
  function PreviewVideoFullView(image) {
    console.log('PreviewVideoFullView click ', image);
  }
  function PDFDownloadClick(image) {
    setspinner(true);
    console.log('PDFDownloadClick click ', image);
    const {dirs} = RNFetchBlob.fs;
    const downloadDir =
      Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const pdfUrl =
      servicesettings.Imagebaseuri +
      image
        .replace(/\\/g, '/')
        .replace(',', '')
        .replace(' //', '');
    RNFetchBlob.config({
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: `${downloadDir}/Attachment.pdf`,
        description: 'Downloading PDF file...',
      },
    })
      .fetch('GET', pdfUrl)
      .then(res => {
        // Handle success
        console.log('File downloaded:', res.path());
        setTimeout(() => {
          setspinner(false);
          Toast.show('File downloaded has been send successfully!');
        }, 4000);
      })
      .catch(error => {
        // Handle error
        setspinner(false);
        console.error('Error downloading file:', error);
      });
  }
  const Item = ({image, Id}) => (
    <View style={{textAlign: 'center', marginVertical: 8}}>
      <ScrollView>
        {image.split('.')[1] == 'mp4' ? (
          <TouchableOpacity onPress={() => AttachmentFullViewClick(image)}>
            <Video
              resizeMode={'stretch'}
              rate={1.0}
              ignoreSilentSwitch={'obey'}
              paused={false}
              //     resizeMode="cover"
              source={{
                uri:
                  servicesettings.Imagebaseuri +
                  image
                    .replace(/\\/g, '/')
                    .replace(',', '')
                    .replace(' //', ''),
              }}
              style={{height: 185, width: 100 + '%'}}
            />
          </TouchableOpacity>
        ) : null}
        {image.split('.')[1] != 'pdf' && image.split('.')[1] != 'mp4' ? (
          <TouchableOpacity onPress={() => AttachmentFullViewClick(image)}>
            <Image
              resizeMode="contain"
              source={{
                uri:
                  servicesettings.Imagebaseuri +
                  image
                    .replace(/\\/g, '/')
                    .replace(',', '')
                    .replace(' //', ''),
              }}
              style={styles.AttachmentImage}
            />
          </TouchableOpacity>
        ) : null}
        {image.split('.')[1] == 'pdf' ? (
          <TouchableOpacity
            style={{marginBottom: 12}}
            onPress={() => PDFDownloadClick(image)}
          >
            <Image
              resizeMode="contain"
              source={pdfview}
              style={styles.AttachmentPdf}
            />
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </View>
  );
  return (
    <View style={styles.container}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
      <Alert
        massagetype={'warning'}
        hide={hide}
        confirm={confirm}
        Visible={Visible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={
          'Are you sure you want to ' + global.StatusName + ' campaign ?'
        }
      ></Alert>
      {shouldShow == false ? (
        <View style={styles.AddNewCampaign}>
          <View style={styles.AddNewCampaignView}>
            <TouchableOpacity
              style={styles.btnDetail_Delete}
              onPress={() => AddNewCampaignClick()}
            >
              <Text style={styles.Delete_Play_PauseTxt}>New Campaign</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.SearchButtonView}>
            <TouchableOpacity onPress={() => functionCombined()}>
              <Icons name={'search'} style={styles.cameraicon} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.searchStyle}>
          <View style={styles.SectionView}>
            <TextInput
              placeholderTextColor="black"
              style={styles.searchFieldText}
              value={Search}
              onChangeText={value => setSearch(value)}
              placeholder={' Search'}
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              KeyboardType={'default'}
              maxLength={50}
            />
            <TextInput
              placeholderTextColor="black"
              style={styles.searchFieldText}
              value={searchBudget}
              onChangeText={value => setSearchBudget(value)}
              placeholder={' Budget ≥'}
              clearTextOnFocus={true}
              keyboardAppearance={'dark'}
              KeyboardType={'default'}
              maxLength={50}
            />
          </View>
          <View style={styles.SearchButtonView}>
            <TouchableOpacity onPress={() => searchDataClick()}>
              <Icons name={'search'} style={styles.cameraicon} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={(item, id) => id.toString()}
        renderItem={({item}) => (
          <Mycampaign
            OpenUpdateCampaign={OpenUpdateCampaign}
            StatusChangeOnClick={StatusChangeOnClick}
            SettingClickForChangeFlatList={SettingClickForChangeFlatList}
            AttachmentPreviewDetail={AttachmentPreviewDetail}
            data={item}
            startTime={item.startTime}
            name={item.name}
            id={item.id}
            networkName={item.networkName}
            compaignNetworks={item.compaignNetworks}
            networkId={item.networkId}
            contact={item.contact}
            finishTime={item.finishTime}
            approvalTime={item.approvalTime}
            budget={item.budget}
            logoAvatar={item.logoAvatar}
            description={item.description}
            discount={item.discount}
            hashTags={item.hashTags}
            orgName={item.orgName}
            title={item.title}
            autoGenerateLeads={item.autoGenerateLeads}
            //   discount={item.discount}
            totalBudget={item.totalBudget}
          ></Mycampaign>
        )}
        numColumns={1}
        horizontal={false}
      />
      {changeViewVisible == true ? (
        <View style={styles.ChangeActionMainView}>
          <View style={styles.sidebarViewRight}>
            <TouchableOpacity
              style={styles.closeIconView}
              onPress={() => SettingClickForChangeFlatList()}
            >
              <Icons name="close" style={styles.closeIcon} />
            </TouchableOpacity>
            {selectedCampaingStatus != 1 ? (
              <TouchableOpacity
                style={styles.ChangeActionView}
                value={1}
                onPress={() => ClickStatus(1)}
              >
                <View style={styles.SidebarIconView}>
                  <Image source={deleteicon} style={styles.ribbonIcon} />
                </View>
                <View style={styles.SidebarDetailView}>
                  <Text style={styles.IconText}>Active</Text>
                  <Text style={styles.IconTextDetail}>
                    Network all schedules will be activated
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.ChangeActionView}
                value={5}
                onPress={() => ClickStatus(5)}
              >
                <View style={styles.SidebarIconView}>
                  <Image source={deleteicon} style={styles.ribbonIcon} />
                </View>
                <View style={styles.SidebarDetailView}>
                  <Text style={styles.IconText}>Delete</Text>
                  <Text style={styles.IconTextDetail}>
                    Your network all activity will be terminated
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        <View></View>
      )}
      {attachmentViewVisible == true ? (
        <View style={styles.ChangeActionMainView}>
          <ScrollView>
            <View style={styles.sidebarViewRight}>
              <TouchableOpacity
                style={styles.closeIconView}
                onPress={() => setAttachmentViewVisible(false)}
              >
                <Icons name="close" style={styles.closeIcon} />
              </TouchableOpacity>
              <View style={styles.ChangeActionPictureView}>
                <FlatList
                  data={attachmentData}
                  renderItem={({item}) => (
                    <Item image={item.image} Id={item.Id} />
                  )}
                  keyExtractor={item => item.Id}
                  //numColumns={1}
                  horizontal={false}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      ) : null}
      {attachmentFullView == true ? (
        <View style={styles.ChangeActionMainFullView}>
          <TouchableOpacity
            style={styles.closeIconFullView}
            onPress={() => AttachmentFullViewClick()}
          >
            <Image
              resizeMode="stretch"
              source={crossIcon}
              style={styles.closeIconFull}
            />
          </TouchableOpacity>
          {img_VideoType.split('.')[1] == 'mp4' ? (
            <Video
              resizeMode="contain"
              source={{
                uri:
                  servicesettings.Imagebaseuri +
                  img_Video
                    .replace(/\\/g, '/')
                    .replace(',', '')
                    .replace(' //', ''),
              }}
              style={{
                backgroundColor: 'gray',
                width: Dimensions.get('window').width,
                height: 90 + '%',
              }}
            />
          ) : (
            <Image
              resizeMode="contain"
              source={{
                uri:
                  servicesettings.Imagebaseuri +
                  img_Video
                    .replace(/\\/g, '/')
                    .replace(',', '')
                    .replace(' //', ''),
              }}
              style={{
                backgroundColor: 'gray',
                width: Dimensions.get('window').width,
                height: 90 + '%',
              }}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: 100 + '%',
    height: 100 + '%',
    backgroundColor: 'white',
  },
  spinnerTextStyle: {
    color: '#FFF',
  },
  ChangeActionMainView: {
    marginTop: 10,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height,
    marginHorizontal: 20,
    position: 'absolute',
    //height:100 + '%',
    //right: 10,
  },
  sidebarViewRight: {
    backgroundColor: 'white',
    //backgroundColor: colors.PagePanelTab,
    // backgroundColor: '#c0c0c05e',
    borderRadius: 10,
    alignItems: 'center',
    paddingBottom: 9,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 4, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
  ChangeActionView: {
    marginVertical: 5,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: Dimensions.get('window').width - 60,
    marginHorizontal: 30,
    borderRadius: 8,
    backgroundColor: colors.PagePanelTab,
    //backgroundColor:'#dfdfdf'
  },
  ChangeActionPictureView: {
    marginVertical: 5,
    paddingHorizontal: 7,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    width: Dimensions.get('window').width - 60,
    //height: Dimensions.get('window').height,
    marginHorizontal: 30,
    borderRadius: 8,
    // backgroundColor:colors.red,
    //backgroundColor:'#dfdfdf'
  },
  closeIconFull: {
    // textAlign: 'right',
    //fontSize:25,
    alignItems: 'flex-end',
    zIndex: 12,
    width: 45,
    height: 45,
  },
  closeIconFullView: {
    alignItems: 'flex-end',
    position: 'absolute',
    width: Dimensions.get('window').width - 20,
    marginHorizontal: 10,
    paddingTop: 8,
    zIndex: 12,
  },
  sidebarViewRightFullView: {
    backgroundColor: colors.PagePanelTab,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
  },
  ChangeActionMainFullView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    // backgroundColor:'red',
    position: 'absolute',
    //  top:-23,
    //   zIndex:5009,
  },
  SidebarIconView: {
    marginVertical: 5,
    //backgroundColor:'gray',
    width: 15 + '%',
    //height:55,
  },
  SidebarDetailView: {
    marginVertical: 5,
    //backgroundColor:'gray',
    width: 84 + '%',
    paddingLeft: 8,
    //height:55,
  },
  ribbonIcon: {
    height: 45,
    width: 45,
    //tintColor:'#1da1f2',
    //marginTop:3
  },
  IconText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    width: 70 + '%',
    // fontWeight: "bold",
  },
  IconTextDetail: {
    color: '#00000091',
    fontSize: 13,
    width: 100 + '%',
    //backgroundColor:'red'
    // fontWeight: "bold",
  },
  SectionView: {
    //marginBottom:23,
    //flexDirection: 'row',
    alignItems: 'center',
    //margin: 5,
    //height:8 + '%',
    // height:55,
    paddingRight: 12,
    fontSize: 16,
    color: colors.white,
    width: 83 + '%',
    //backgroundColor: colors.red,
    //backgroundColor: colors.PagePanelTab,
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 4,
  },
  AddNewCampaignView: {
    width: 80 + '%',
  },
  AddNewCampaignButton: {
    fontSize: 16,
    color: colors.white,
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 2,
  },
  SearchButtonView: {
    //marginBottom:23,
    //flexDirection: 'row',
    alignItems: 'center',
    //margin: 5,
    //height:8 + '%',
    // height:55,
    fontSize: 16,
    color: colors.white,
    width: 17 + '%',
    // backgroundColor: 'green',
    //backgroundColor: colors.PagePanelTab,
    borderWidth: 0,
    borderColor: 'white',
    borderRadius: 4,
  },
  AddNewCampaign: {
    //position: 'absolute',
    // top: 12,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    //justifyContent:'center',
    //height:55,
    width: Dimensions.get('window').width,
    borderTopWidth: 1,
    borderColor: colors.InputControlBorderColor,
    backgroundColor: colors.PagePanelTab,
    // backgroundColor:'blue'
  },
  searchStyle: {
    //position: 'absolute',
    // top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //height:55,
    width: Dimensions.get('window').width,
    borderTopWidth: 1,
    borderColor: colors.InputControlBorderColor,
    backgroundColor: colors.PagePanelTab,
    // backgroundColor:'blue'
  },
  searchFieldText: {
    marginLeft: 10,
    height: 43,
    //padding:10,
    marginVertical: 10,
    // marginHorizontal:5,
    borderRadius: 4,
    textDecorationLine: 'none',
    alignItems: 'center',
    fontSize: 15,
    //backgroundColor: "red",
    backgroundColor: colors.white,
    color: 'black',
    // width: Dimensions.get('window').width-70,
    //width: 80 + '%'
  },
  cameraicon: {
    //resizeMode: 'stretch',
    marginRight: 5,
    borderRadius: 1,
    borderColor: colors.white,
    color: 'gray',
    fontSize: 31,
    marginLeft: 10,
  },
  btnDetail_Delete: {
    marginHorizontal: 10,
    width: 152,
    height: 38,
    borderRadius: 6,
    borderWidth: 0,
    backgroundColor: colors.Blazorbutton,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
  },
  Delete_Play_PauseTxt: {
    fontSize: 15,
    paddingHorizontal: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  AttachmentImage: {
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 1,
    borderColor: colors.red,
    //backgroundColor:colors.red,
    borderWidth: 0.6,
    borderRadius: 10,
    height: 185,
    //textAlign: 'center',
    alignItems: 'center',
  },
  AttachmentPdf: {
    // marginRight:5,
    // marginLeft:5,
    //borderRadius:1,
    //borderColor:colors.red,
    // borderRadius:6,
    height: 62,
    width: 100 + '%',
  },
  VideoPreviewView: {
    //marginRight:5,
    // marginLeft:5,
    // backgroundColor:colors.red,
    height: 140,
    width: 200,
  },
});
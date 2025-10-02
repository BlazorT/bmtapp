import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import Model from '../../components/Model';

import NetInfo from '@react-native-community/netinfo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import { useSelector } from 'react-redux';
import CampaignInfo from '../../components/campaignComponents/CampaignInfo';
import CampaignNetwork from '../../components/campaignComponents/CampaignNetwork';
import CampaignSchedule from '../../components/campaignComponents/CampaignSchedule';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import servicesettings from '../dataservices/servicesettings';
import moment from 'moment';
import { MAX_AGE, MIN_AGE } from '../../constants';

export default function CampaignScheduleScreen(props) {
  const theme = useTheme();
  const { isAuthenticated, user } = useUser();
  const lovs = useSelector(state => state.lovs).lovs;

  const [campaignInfo, setCampaignInfo] = useState({
    id: 0,
    subject: '',
    hashtag: '',
    template: '',
    country: '',
    state: '',
    campaignStartDate: '',
    campaignEndDate: '',
    status: 1,
    autoLead: false,
    image: '',
    video: '',
    pdf: '',
    networks: [],
    schedules: [],
    totalBudget: 0,
    discount: 0,
    genderId: '',
    radius: 10,
    locations: [],
    interests: [],
    minAge: MIN_AGE,
    maxAge: MAX_AGE,
  });
  const [Index, setIndex] = useState(0);
  const [updateMessage, setUpdateMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [spinner, setspinner] = useState(false);
  const [networkData, setNetworks] = useState('');

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
    console.log(props.route.params, 'props');
    if (props.route.params) {
      updateCampaignData(props.route.params.campaign);
    }
  }, [props.route.params]);
  /**************************************** validation ************************************************/
  const loadInitialData = async () => {
    try {
      if (isAuthenticated) {
        const networks = await lovs['mybundlings'];
        console.log({ networks });
        setNetworks(networks);
      } else {
        props.navigation.replace('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const updateCampaignData = data => {
    const attachments =
      data.attachments !== '' ? JSON.parse(data.attachments) : [];
    const userNetworks = JSON.parse(data.compaignsdetails);
    const networkData = lovs['mybundlings'];

    const transformNetworks = userNetworks.map(item => {
      const selectedNetwork = networkData.find(
        network => item.networkId == network.networkId,
      );
      return {
        networkId: item.networkId,
        orgId: user.orgId,
        rowVer: 0,
        compaignId: 0,
        id: item.id,
        desc: item.networkName,
        status: 1,
        createdBy: user.id,
        lastUpdatedBy: user.id,
        createdAt: item.createdAt,
        lastUpdatedAt: moment().utc().format(),
        networkId: selectedNetwork.networkId,
        purchasedQouta: selectedNetwork.purchasedQouta,
        unitPriceInclTax: selectedNetwork.unitPriceInclTax,
        usedQuota: selectedNetwork.usedQuota,
      };
    });
    // const datNetworks = lovs['mybundlings'].filter(item =>
    //   networks.some(network => network.networkId === item.networkId),
    // );
    // console.log('transformNetworks', transformNetworks);
    const schedule = JSON.parse(data.compaignschedules);
    const scheduleList = schedule.map(item => {
      const scheduleNetworks = transformNetworks.filter(
        network => network.networkId == item.NetworkId,
      );
      return {
        CompaignNetworks: scheduleNetworks,
        id: item.id,
        budget: item.budget,
        rowVer: 0,
        messageCount: item.MessageCount,
        orgId: user.orgId,
        days: item.days.split(',').map(item => Number(item.replace(/"/g, ''))),
        networkId: item.NetworkId,
        compaignDetailId: item.CompaignDetailId,
        isFixedTime: 1,
        startTime: item.StartTime,
        finishTime: item.FinishTime,
        interval: item.Interval,
        status: 1,
        intervalTypeId: item.IntervalTypeId,
        randomId: item.id,
      };
    });
    // console.log('scheduleList', JSON.stringify(schedule));
    const uris = attachments.map(item => ({
      Id: item.Id,
      uri: `${servicesettings.Imagebaseuri}${item.image}`,
    }));
    const imageUris = uris.filter(
      uri =>
        uri.uri.endsWith('.jpg') ||
        uri.uri.endsWith('.jpeg') ||
        uri.uri.endsWith('.png'),
    )[0];
    const videoUris = uris.filter(
      uri =>
        uri.uri.endsWith('.mp4') ||
        uri.uri.endsWith('.avi') ||
        uri.uri.endsWith('.mov'),
    )[0];
    const pdfUris = uris.filter(uri => uri.uri.endsWith('.pdf'))[0];
    console.log({ imageUris, videoUris, pdfUris });
    setCampaignInfo({
      id: data.id,
      subject: data.name,
      hashtag: data.hashTags ? data.hashTags : '',
      template: data.description,
      country: '',
      state: '',
      campaignStartDate: new Date(data.startTime),
      campaignEndDate: new Date(data.finishTime),
      status: data.status,
      autoLead: data.autoGenerateLeads ? true : false,
      image: imageUris ? imageUris : '',
      video: videoUris ? videoUris : '',
      pdf: pdfUris ? pdfUris : '',
      networks: transformNetworks.length > 0 ? transformNetworks : [],
      schedules: schedule.length > 0 ? scheduleList : [],
      totalBudget: data.budget ? data.budget : 0,
      discount: data.discount ? data.discount : 0,
    });
  };

  const checkValidation = () => {
    if (campaignInfo.template.trim() == '') {
      Toast.show('Please enter campaign title');
      return false;
    }
    if (campaignInfo.startDate == '') {
      Toast.show('Please select valid campaign start date');
      return false;
    }
    if (campaignInfo.endDate == '') {
      Toast.show('Please select valid campaign end date');
      return false;
    }
    return true;
  };

  function handlePress(index) {
    if (index == 1) {
      if (!checkValidation()) {
        return;
      }
      setIndex(index);
    } else if (index == 2) {
      if (!checkValidation()) {
        return;
      }
      if (campaignInfo.networks.length == 0) {
        Toast.show('Please select atleast one network');
        return;
      }
      setIndex(index);
    }
    if (index == 3) {
      if (campaignInfo.networks.length == 0) {
        Toast.show('Please select atleast one network');
        return;
      }
      setIndex(index);
    }
    setIndex(index);
  }

  return (
    <KeyboardAwareScrollView
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.backgroundColor },
      ]}
      scrollEnabled={false}
    >
      <TouchableOpacity>
        <AppBreadcrumb
          crumbs={[
            {
              text: 'Campaign',
            },
            {
              text: `Networks ${campaignInfo.networks.length > 0 ? campaignInfo.networks.length : ''}`,
            },
            { text: 'Schedule' },
          ]}
          onSelect={index => {
            handlePress(index);
          }}
          selectedIndex={Index}
        />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{ width: '100%' }}
        style={{ width: '100%' }}
      >
        {Index == 0 && (
          <CampaignInfo
            campaignInfo={campaignInfo}
            setCampaignInfo={setCampaignInfo}
            setIndex={setIndex}
          />
        )}
        {Index == 1 && (
          <CampaignNetwork
            campaignInfo={campaignInfo}
            setCampaignInfo={setCampaignInfo}
            setIndex={setIndex}
            networks={networkData}
          />
        )}
        {Index == 2 && (
          <>
            <CampaignSchedule
              campaignInfo={campaignInfo}
              setCampaignInfo={setCampaignInfo}
              setIndex={setIndex}
              setModalVisible={setModalVisible}
              setUpdateMessage={setUpdateMessage}
              setspinner={setspinner}
            />
            <Spinner
              visible={spinner}
              textContent="Submitting..."
              textStyle={{ color: theme.textColor }}
              color={theme.textColor}
            />
            <Model modalVisible={modalVisible} message={updateMessage}></Model>
            {/* <Alert
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
              }></AlertBMT> */}
            {/* <AlertBMT
              massagetype={'warning'}
              hide={hideDeleteSchedule}
              confirm={confirmDeleteSchedule}
              Visible={deleteScheduleVisible}
              alerttype={'confirmation'}
              Title={'Confirmation'}
              Massage={'Schedule delete successfully'}></AlertBMT> */}
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});

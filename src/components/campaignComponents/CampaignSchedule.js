import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { useTheme } from '../../hooks/useTheme';
import AddSchedule from './AddSchedule';
import Toast from 'react-native-simple-toast';
import ScheduleList from './ScheduleList';
import RNSButton from '../Button';
import { useUser } from '../../hooks/useUser';
import { useSelector } from 'react-redux';
import moment from 'moment';
import servicesettings from '../../modules/dataservices/servicesettings';
import { useNavigation } from '@react-navigation/native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import {
  CAMPAIGN_INTERESTS,
  GENDER_LIST,
  MAX_AGE,
  MIN_AGE,
} from '../../constants';

const CampaignSchedule = ({
  campaignInfo,
  setCampaignInfo,
  setIndex,

  setModalVisible,
  setUpdateMessage,
  setspinner,
}) => {
  const theme = useTheme();
  const { user } = useUser();
  const lovs = useSelector(state => state.lovs).lovs;
  const navigation = useNavigation();

  const [scheduleTab, setScheduleTab] = React.useState(0);
  const [isUpdate, setIsUpdate] = React.useState(false);
  const [scheduleList, setScheduleList] = React.useState({
    CompaignNetworks: [],
    id: 0,
    budget: 0,
    rowVer: 0,
    messageCount: 0,
    orgId: user.orgId,
    days: [],
    networkId: 0,
    compaignDetailId: 0,
    isFixedTime: 1,
    startTime: campaignInfo.campaignStartDate,
    finishTime: campaignInfo.campaignEndDate,
    interval: 0,
    status: 1,
    intervalTypeId: 1,
    randomId: Math.floor(100000 + Math.random() * 900000),
  });

  useEffect(() => {
    console.log('campaignInfo: ' + JSON.stringify(campaignInfo.schedules));
    if (!isUpdate) {
      setScheduleList({
        CompaignNetworks: [],
        id: 0,
        budget: 0,
        rowVer: 0,
        messageCount: 0,
        orgId: user.orgId,
        days: [],
        networkId: 0,
        compaignDetailId: 0,
        isFixedTime: 1,
        startTime: campaignInfo.campaignStartDate,
        finishTime: campaignInfo.campaignEndDate,
        interval: 0,
        status: 1,
        intervalTypeId: 0,
        randomId: Math.floor(100000 + Math.random() * 900000),
      });
    }
  }, [isUpdate]);

  const addSchedule = async () => {
    console.log({ campaignInfo });
    console.log({ campaignInfo: JSON.stringify(campaignInfo) });
    let campaignBody = {
      id: campaignInfo.id,
      targetaudiance: JSON.stringify({
        interests: campaignInfo.interests
          .map(index => {
            const found = CAMPAIGN_INTERESTS[index];
            return found ? found.name : null;
          })
          .filter(Boolean), // removes nulls if index not found
        genderId:
          campaignInfo.genderId === ''
            ? 0
            : GENDER_LIST[campaignInfo.genderId]?.id,
        locations: campaignInfo?.locations,
        minAge: campaignInfo.minAge,
        maxAge: campaignInfo.maxAge,
      }),
      createdBy: Number(user.id),
      lastUpdatedBy: Number(user.id),
      status: campaignInfo.status,
      orgId: Number(user.orgId),
      hashTags: campaignInfo.hashtag,
      description: campaignInfo?.template,
      name: campaignInfo?.template,
      title: campaignInfo?.template,
      autoGenerateLeads: campaignInfo.autoLead ? 1 : 0,
      createdAt: moment.utc().format(),
      startTime: moment.utc(campaignInfo.campaignStartDate).format(),
      finishTime: moment.utc(campaignInfo.campaignEndDate).format(),
      CompaignNetworks: campaignInfo.networks?.map(n => ({
        CompaignId: n?.compaignId,
        NetworkId: n?.networkId,
        Desc: n?.desc,
        Status: n?.status,
        Code: '',
        posttypejson: JSON.stringify(n?.postTypes || []),
        Template: n?.Template
          ? JSON.stringify({
              template: n?.Template?.template,
              subject: n?.Template?.subject,
              title: n?.Template?.title,
            })
          : '',
      })),
      compaignExecutionSchedules: campaignInfo.schedules?.map(s => ({
        Id: s?.id,
        NetworkId: s?.networkId,
        CompaignDetailId: s?.compaignDetailId,
        Budget: s?.budget,
        Intervalval: s?.interval ? parseInt(s?.interval) : 0,
        IntervalTypeId: s?.intervalTypeId + 1,
        MessageCount: parseInt(s?.messageCount),
        FinishTime: s?.finishTime,
        StartTime: s?.startTime,
        LastUpdatedAt: moment.utc().format(),
        CreatedBy: user?.id,
        CreatedAt: moment.utc().format(),
        LastUpdatedBy: user?.id,
        Status: s?.status,
        RowVer: 0,
        days: JSON.stringify(s?.days || []),
        Budget: s?.budget || 0,
      })),
      Budget: campaignInfo.schedules.reduce((a, b) => a + b.budget, 0),
      discount: 0,
      remarks: '',
      paymentStatus: 0,
      rowVer: 0,
    };

    console.log({ campaignBody });
    // return;
    console.log('campaignBody: ' + JSON.stringify(campaignBody));
    setUpdateMessage(
      `${campaignInfo?.template} has been created successfully.`,
    );
    setspinner(true);

    let headerFetch = {
      method: 'POST',
      body: JSON.stringify(campaignBody),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: servicesettings.AuthorizationKey,
      },
    };
    const response = await fetch(
      // createcompletecompaign
      servicesettings.baseuri + 'Compaigns/submitmycompaign',
      headerFetch,
    );
    setspinner(false);
    console.log({ response });
    if (!response.ok) {
      Toast.show('Something went wrong, please try again');
      return;
    }
    const res = await response.json();
    console.log('response', res);
    if (res.status == false || res.status == '408' || res.status == '400') {
      Toast.show(res.message || 'Something went wrong, please try again');
    } else {
      if (
        (campaignInfo.image !== '' &&
          campaignInfo.image.fileName !== undefined) ||
        (campaignInfo.video !== '' &&
          campaignInfo.video.fileName !== undefined) ||
        (campaignInfo.pdf !== '' && campaignInfo.pdf.name !== undefined)
      ) {
        const data = new FormData();

        if (
          campaignInfo.image != '' &&
          campaignInfo.image.fileName != undefined
        ) {
          const fileTypeMake = campaignInfo.image.fileName;
          const fileNameType = '.' + fileTypeMake.split('.')[1];
          const imageName = '1' + fileNameType;

          data.append('files', {
            id: campaignInfo.image.id,
            name: imageName,
            uri: campaignInfo.image.uri,
            type: campaignInfo.image.type,
          });
        }
        if (
          campaignInfo.video != '' &&
          campaignInfo.video.fileName != undefined
        ) {
          const fileTypeMake = campaignInfo.video.fileName;
          const fileNameType = '.' + fileTypeMake.split('.')[1];
          const imageName = '2' + fileNameType;

          data.append('files', {
            id: campaignInfo.video.id,
            name: imageName,
            uri: campaignInfo.video.uri,
            type: campaignInfo.video.type,
          });
        }
        if (campaignInfo.pdf != '' && campaignInfo.pdf.name != undefined) {
          const fileTypeMake = campaignInfo.pdf.name;
          const fileNameType = '.' + fileTypeMake.split('.')[1];
          const imageName = '3' + fileNameType;

          data.append('files', {
            id: campaignInfo.pdf.id,
            name: imageName,
            uri: campaignInfo.pdf.uri,
            type: campaignInfo.pdf.type,
          });
        }

        data.append('compaignid', res.data);
        data.append('userid', user.id);
        data.append('remarks', 'Remarks Text');
        console.log('imgData: ', JSON.stringify(data));
        const ImageheaderFetch = {
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
        setspinner(true);

        const imageResponse = await fetch(
          servicesettings.baseuri + 'BlazorApi/uploadattachments',
          ImageheaderFetch,
        );
        setspinner(false);

        const attachmentRes = await imageResponse.json();
        console.log('attachmentRes', attachmentRes);
        if (attachmentRes.status == false || attachmentRes.status == '408') {
          setspinner(false);
          Toast.show(res.message || 'Something went wrong, please try again');
        } else {
          localNotification('Campaign Created', campaignInfo.subject);
          setspinner(false);
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
            navigation.navigate('Campaigns', { isReload: true });
            setIndex(0);
            setCampaignInfo({
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
          }, 4000);
        }
      } else {
        localNotification('Campaign Created', campaignInfo.subject);
        setspinner(false);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('Campaigns', { isReload: true });
          setIndex(0);
          setCampaignInfo({
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
        }, 4000);
      }
    }
  };
  const localNotification = async (title, message) => {
    const channelId = `channel_${Date.now().toString()}`; // Unique channel ID

    // Create a channel (required for Android)
    await notifee.createChannel({
      id: channelId,
      name: 'Local Message Channel',
      description: 'Notification channel for local messages',
      importance: AndroidImportance.HIGH, // Equivalent to importance: 4 in PushNotification
      vibration: true,
    });

    // Display a notification
    await notifee.displayNotification({
      title: title,
      body: message,
      android: {
        channelId: channelId, // Link to the created channel
      },
    });
  };

  return (
    <View style={{ marginTop: 5 }}>
      <View
        style={{
          backgroundColor: theme.cardBackColor,
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity
          onPress={() => setScheduleTab(0)}
          style={{
            width: '50%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: scheduleTab == 0 ? 2 : 0,
            borderBottomColor: theme.buttonBackColor,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: theme.textColor,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Add Schedule
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (campaignInfo.schedules.length == 0) {
              Toast.show('Please add schedule first');
              return;
            }
            setScheduleTab(1);
          }}
          style={{
            width: '50%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: scheduleTab == 1 ? 2 : 0,
            borderBottomColor: theme.buttonBackColor,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: theme.textColor,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Schedule
            {campaignInfo.schedules.length > 0
              ? '(' + campaignInfo.schedules.length + ')'
              : ''}
          </Text>
        </TouchableOpacity>
      </View>
      {scheduleTab == 0 && (
        <AddSchedule
          campaignInfo={campaignInfo}
          setCampaignInfo={setCampaignInfo}
          setIndex={setIndex}
          setScheduleTab={setScheduleTab}
          scheduleList={scheduleList}
          setScheduleList={setScheduleList}
          isUpdate={isUpdate}
          setIsUpdate={setIsUpdate}
        />
      )}
      {scheduleTab == 1 && (
        <>
          <ScheduleList
            campaignInfo={campaignInfo}
            setScheduleTab={setScheduleTab}
            setCampaignInfo={setCampaignInfo}
            setScheduleList={setScheduleList}
            setIsUpdate={setIsUpdate}
          />
          <RNSButton
            style={{ width: '100%', marginTop: 10 }}
            bgColor={theme.buttonBackColor}
            caption="Submit"
            onPress={addSchedule}
          />
        </>
      )}
    </View>
  );
};

export default CampaignSchedule;

const styles = StyleSheet.create({});

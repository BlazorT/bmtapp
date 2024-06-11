import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {useTheme} from '../../hooks/useTheme';
import AddSchedule from './AddSchedule';
import Toast from 'react-native-simple-toast';
import ScheduleList from './ScheduleList';
import RNSButton from '../Button';
import {useUser} from '../../hooks/useUser';
import {useSelector} from 'react-redux';
import moment from 'moment';
import servicesettings from '../../modules/dataservices/servicesettings';
import {useNavigation} from '@react-navigation/native';

const CampaignSchedule = ({
  campaignInfo,
  setCampaignInfo,
  setIndex,

  setModalVisible,
  setUpdateMessage,
  setspinner,
}) => {
  const theme = useTheme();
  const {user} = useUser();
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
    orgId: user.orgid,
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
        orgId: user.orgid,
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
    let campaignBody = {
      id: 0,
      selectCountryId: campaignInfo.country == '' ? 0 : Number(country),
      selectStateId: campaignInfo.state == '' ? 0 : Number(state),
      createdBy: Number(user.id),
      lastUpdatedBy: Number(user.id),
      status: campaignInfo.status,
      orgId: Number(user.orgid),
      hashTags: campaignInfo.hashtag,
      description: campaignInfo.template,
      name: campaignInfo.subject,
      title: campaignInfo.subject,
      autoGenerateLeads: campaignInfo.autoLead ? 1 : 0,
      startTime: moment.utc(campaignInfo.campaignStartDate).format(),
      finishTime: moment.utc(campaignInfo.campaignEndDate).format(),
      CompaignNetworks: campaignInfo.networks,
      compaignExecutionSchedules: campaignInfo.schedules,
      totalBudget: campaignInfo.schedules.reduce((a, b) => a + b.budget, 0),
      discount: 0,
    };
    console.log('campaignBody: ' + JSON.stringify(campaignBody));
    setUpdateMessage(`${campaignInfo.subject} has been created successfully.`);
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
      servicesettings.baseuri + 'createcompletecompaign',
      headerFetch,
    );
    console.log('response', response);
    const res = await response.json();
    if (res.status == false || res.status == '408') {
      setspinner(false);
      Toast.show(res.message || 'Something went wrong, please try again');
    } else {
      if (
        campaignInfo.image !== '' ||
        campaignInfo.video != '' ||
        campaignInfo.pdf != ''
      ) {
        const data = new FormData();
        console.log(
          'campaignInfo.image',
          campaignInfo.image,
          campaignInfo.video,
          campaignInfo.pdf,
        );
        if (campaignInfo.image != '') {
          const fileTypeMake = campaignInfo.image.fileName;
          const fileNameType = '.' + fileTypeMake.split('.')[1];
          const imageName =
            Math.floor(100 + Math.random() * 900).toString() + fileNameType;

          data.append('files', {
            name: imageName,
            uri: campaignInfo.image.uri,
            type: campaignInfo.image.type,
          });
        }
        if (campaignInfo.video != '') {
          const fileTypeMake = campaignInfo.video.fileName;
          const fileNameType = '.' + fileTypeMake.split('.')[1];
          const imageName =
            Math.floor(100 + Math.random() * 900).toString() + fileNameType;

          data.append('files', {
            name: imageName,
            uri: campaignInfo.video.uri,
            type: campaignInfo.video.type,
          });
        }
        if (campaignInfo.pdf != '') {
          const fileTypeMake = campaignInfo.pdf.name;
          const fileNameType = '.' + fileTypeMake.split('.')[1];
          const imageName =
            Math.floor(100 + Math.random() * 900).toString() + fileNameType;

          data.append('files', {
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
        const imageResponse = await fetch(
          servicesettings.baseuri + 'uploadattachments',
          ImageheaderFetch,
        );
        const attachmentRes = await imageResponse.json();
        console.log('attachmentRes', attachmentRes);
        if (attachmentRes.status == false || attachmentRes.status == '408') {
          setspinner(false);
          Toast.show(res.message || 'Something went wrong, please try again');
        } else {
          setspinner(false);
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
            navigation.replace('My Campaigns');
          }, 4000);
        }
      } else {
        setspinner(false);
        setModalVisible(true);
        setTimeout(() => {
          setModalVisible(false);
          navigation.replace('My Campaigns');
        }, 4000);
      }
    }
    // console.log('res', res);
    // console.log(JSON.stringify(campaignBody));
  };
  return (
    <View style={{marginTop: 5}}>
      <View
        style={{
          backgroundColor: theme.cardBackColor,
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => setScheduleTab(0)}
          style={{
            width: '50%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: scheduleTab == 0 ? 2 : 0,
            borderBottomColor: theme.buttonBackColor,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: theme.textColor,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
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
          }}>
          <Text
            style={{
              fontSize: 16,
              color: theme.textColor,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
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
            style={{width: '100%', marginTop: 10}}
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

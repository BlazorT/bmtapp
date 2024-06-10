import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AppBreadcrumb from '../../components/AppBreadcrumb';
import Model from '../../components/Model';

import NetInfo from '@react-native-community/netinfo';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import {useSelector} from 'react-redux';
import CampaignInfo from '../../components/campaignComponents/CampaignInfo';
import CampaignNetwork from '../../components/campaignComponents/CampaignNetwork';
import CampaignSchedule from '../../components/campaignComponents/CampaignSchedule';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';

export default function CampaignScheduleScreen(props) {
  const theme = useTheme();
  const {isAuthenticated} = useUser();
  const lovs = useSelector(state => state.lovs).lovs;

  const [campaignInfo, setCampaignInfo] = useState({
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
  }, []);
  /**************************************** validation ************************************************/
  const loadInitialData = async () => {
    try {
      if (isAuthenticated) {
        const networks = await lovs['mybundlings'];
        const bmtLovs = await lovs['bmtlovs'];
        console.log({networks});
        setNetworks(networks);
        if (global.UpdateCampaign == 1) {
          // UpdateCampaignDetail(networks);
        }
      } else {
        props.navigation.replace('Login');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkValidation = () => {
    if (campaignInfo.subject.trim() == '') {
      Toast.show('Please enter campaign subject');
      return false;
    }
    if (campaignInfo.template.trim() == '') {
      Toast.show('Please enter campaign template');
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
              text: `Networks ${campaignInfo.networks.length > 0 ? campaignInfo.networks.length : ''}`,
            },
            {text: 'Schedule'},
          ]}
          onSelect={index => {
            handlePress(index);
          }}
          selectedIndex={Index}
        />
      </TouchableOpacity>
      <ScrollView
        contentContainerStyle={{width: '100%'}}
        style={{width: '100%'}}>
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
              textStyle={{color: theme.textColor}}
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

import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { RectButton } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';

import IoniconsIcon from 'react-native-vector-icons/SimpleLineIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import CustomeAlert from './Alert';
import { useUser } from '../hooks/useUser';
import moment from 'moment';
import servicesettings from '../modules/dataservices/servicesettings';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-simple-toast';
import Model from './Model';
import { useNavigation } from '@react-navigation/native';

const CampaignRightAction = ({ campaign, swipeableRow, loadCampiagns }) => {
  const { user } = useUser();
  const { navigate } = useNavigation();
  const theme = useTheme();

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);

  const onHide = () => setConfirmVisible(prev => !prev);

  const onStatusChange = async () => {
    swipeableRow?.current?.close();
    onHide();
    const status = campaign?.status === 1 ? 5 : 1;
    const updateBody = {
      orgId: campaign?.orgId,
      status,
      name: '',
      networkId: 0,
      id: campaign.id,
      lastUpdatedBy: user?.id,
      createdBy: campaign?.createdBy || user?.id,
      campaignStatus: status,
      hashTags: '',
      description: '',
      name: '',
      title: '',
      autoGenerateLeads: 0,
      createdAt: moment.utc().format(),
      lastUpdateAt: moment.utc().format(),
      startTime: campaign?.startTime || moment.utc().format(),
      finishTime: campaign?.finishTime || moment.utc().format(),
      totalBudget: 0,
    };
    setLoading(true);
    try {
      const res = await fetch(
        servicesettings.baseuri + 'Compaigns/updatecompaign',
        {
          method: 'POST',
          body: JSON.stringify(updateBody),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: servicesettings.AuthorizationKey,
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Request failed with code : ${res?.status}`);
      }
      const data = await res.json();
      if (data?.status == true) {
        Toast.showWithGravity(data?.message, Toast.LONG, Toast.CENTER);
        setCheckVisible(true);
        setTimeout(() => {
          setCheckVisible(false);
          loadCampiagns();
        }, 1000);
      } else {
        Toast.showWithGravity(
          data?.message || 'Internet connection failed, try another time !!!',
          Toast.LONG,
          Toast.CENTER,
        );
      }
    } catch (e) {
      Toast.showWithGravity(
        e?.message || 'Internet connection failed, try another time !!!',
        Toast.LONG,
        Toast.CENTER,
      );
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = () => {
    swipeableRow?.current?.close();
    navigate('Campaign (+)', {
      campaign: campaign,
    });
  };
  return (
    <>
      <RectButton
        style={[
          {
            margin: 1.5,
            width: 80,
            backgroundColor: theme.buttonBackColor,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            rowGap: 5,
          },
        ]}
        onPress={onUpdate}
      >
        <FontAwesomeIcon
          name={'pencil'}
          style={{ color: theme.white }}
          size={25}
        />
        <Animated.Text style={{ color: theme.white, fontWeight: 'bold' }}>
          Update
        </Animated.Text>
      </RectButton>
      <RectButton
        style={[
          {
            margin: 1.5,
            width: 80,
            backgroundColor: campaign?.status == 1 ? 'red' : theme.green,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            rowGap: 5,
          },
        ]}
        onPress={onHide}
      >
        {campaign?.status === 1 ? (
          <FontAwesomeIcon
            name={'trash-o'}
            style={{ color: theme.white }}
            size={25}
          />
        ) : (
          <IoniconsIcon
            name={'reload'}
            style={{ color: theme.white }}
            size={25}
          />
        )}
        <Animated.Text style={{ color: theme.white, fontWeight: 'bold' }}>
          {campaign?.status === 1 ? 'Delete' : 'Active'}
        </Animated.Text>
      </RectButton>
      <CustomeAlert
        massagetype={'warning'}
        hide={() => {
          onHide();
          swipeableRow?.current?.close();
        }}
        confirm={onStatusChange}
        Visible={confirmVisible}
        alerttype={'confirmation'}
        Title={'Confirmation'}
        Massage={`Are you sure you want to ${campaign?.status === 1 ? 'delete' : 'active'} campaign ?`}
      ></CustomeAlert>
      <Spinner
        visible={loading}
        textContent={'Updating...'}
        textStyle={{ color: theme.textColor }}
      />
      <Model modalVisible={checkVisible} />
    </>
  );
};

export default CampaignRightAction;

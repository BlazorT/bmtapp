import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import RNSButton from '../Button';
import { useUser } from '../../hooks/useUser';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Network from './network';
import RecipientsList from './RecipientsList';

const CampaignNetwork = ({
  campaignInfo,
  setCampaignInfo,
  setIndex,
  networks,
}) => {
  const theme = useTheme();

  const [isShowRecipients, setIsShowRecipients] = useState(false);

  const toggleRecipients = () => setIsShowRecipients(prev => !prev);

  const nextStep = () => {
    setIndex(2);
  };
  return (
    <View>
      <RNSButton
        caption="Recipients"
        onPress={toggleRecipients}
        bgColor={theme.buttonBackColor}
        style={{ marginTop: 5 }}
        small
      />
      <RecipientsList isOpen={isShowRecipients} onClose={toggleRecipients} />
      <ScrollView contentContainerStyle={{ rowGap: 10, marginTop: 10 }}>
        {networks.length > 0 &&
          networks
            .filter(n => n?.purchasedQouta !== 0)
            .map((network, index) => (
              <Network
                key={index}
                campaignInfo={campaignInfo}
                network={network}
                setCampaignInfo={setCampaignInfo}
              />
            ))}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}
        >
          <RNSButton
            style={{ width: '46%' }}
            bgColor={theme.buttonBackColor}
            caption="Back"
            onPress={() => setIndex(0)}
          />
          <RNSButton
            style={{ width: '46%' }}
            bgColor={theme.buttonBackColor}
            caption="Next"
            onPress={nextStep}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CampaignNetwork;

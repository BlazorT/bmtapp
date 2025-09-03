import CheckBox from '@react-native-community/checkbox';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import emailIcon from '../../../assets/images/Email.png';
import facebookIcon from '../../../assets/images/Facebook.png';
import smsIcon from '../../../assets/images/SMS.png';
import twitterIcon from '../../../assets/images/Twitter.png';
import whatsappIcon from '../../../assets/images/Whatsapp.png';
import instagramIcon from '../../../assets/images/instagram.png';
import linkedinIcon from '../../../assets/images/linkedin.png';
import snapchatIcon from '../../../assets/images/snapchat.png';
import tiktokIcon from '../../../assets/images/tiktok.png';
import { useTheme } from '../../hooks/useTheme';
import RNSButton from '../Button';
import { useUser } from '../../hooks/useUser';
import moment from 'moment';

const CampaignNetwork = ({
  campaignInfo,
  setCampaignInfo,
  setIndex,
  networks,
}) => {
  const theme = useTheme();
  const { user } = useUser();

  const getIcon = networkId => {
    if (networkId == 1) {
      return smsIcon;
    } else if (networkId == 2) {
      return whatsappIcon;
    } else if (networkId == 3) {
      return emailIcon;
    } else if (networkId == 4) {
      return twitterIcon;
    } else if (networkId == 5) {
      return facebookIcon;
    } else if (networkId == 6) {
      return instagramIcon;
    } else if (networkId == 7) {
      return linkedinIcon;
    } else if (networkId == 8) {
      return tiktokIcon;
    } else if (networkId == 9) {
      return snapchatIcon;
    }
  };

  const nextStep = () => {
    setIndex(2);
  };
  return (
    <View>
      <ScrollView contentContainerStyle={{ rowGap: 10, marginTop: 10 }}>
        {networks.length > 0 &&
          networks.map((network, index) => (
            <View
              key={index}
              style={{
                width: '100%',
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: theme.cardBackColor,
                borderRadius: 6,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  //   alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={getIcon(network.networkId)}
                  style={{ width: 50, height: 50, marginRight: 10 }}
                />
                <View>
                  <Text
                    style={{
                      color: theme.textColor,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}
                  >
                    {network.networkName || network?.name} (
                    {network.purchasedQouta})
                  </Text>
                  <Text style={{ color: theme.textColor, fontSize: 16 }}>
                    {network.networkName || network.name}
                  </Text>
                </View>
              </View>
              <View>
                <CheckBox
                  style={{
                    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                  }}
                  value={
                    campaignInfo.networks.length > 0
                      ? campaignInfo.networks.some(
                          item => item.networkId == network.networkId,
                        )
                      : false
                  }
                  onValueChange={v => {
                    if (v) {
                      setCampaignInfo({
                        ...campaignInfo,
                        networks: [
                          ...campaignInfo.networks,
                          {
                            networkId: network.networkId,
                            orgId: user.orgid,
                            rowVer: 0,
                            purchasedQouta: network.purchasedQouta ?? 0,
                            unitPriceInclTax: network.unitPrice ?? 0,
                            usedQuota: network.usedQuota ?? 0,
                            compaignId: 0,
                            id: 0,
                            desc: network.name,
                            status: 1,
                            createdBy: user.id,
                            lastUpdatedBy: user.id,
                            createdAt: moment().utc().format(),
                            lastUpdatedAt: moment().utc().format(),
                          },
                        ],
                      });
                    } else {
                      setCampaignInfo({
                        ...campaignInfo,
                        networks: campaignInfo.networks.filter(
                          item => item.networkId != network.networkId,
                        ),
                      });
                    }
                  }}
                  boxType={'square'}
                  tintColors={{
                    true: theme.selectedCheckBox,
                    false: theme.buttonBackColor,
                  }}
                />
              </View>
            </View>
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

const styles = StyleSheet.create({});

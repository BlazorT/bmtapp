import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
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
import { useUser } from '../../hooks/useUser';
import { useSelector } from 'react-redux';
import CheckBox from '@react-native-community/checkbox';

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
const Network = ({ campaignInfo, network, setCampaignInfo }) => {
  const theme = useTheme();
  const { user } = useUser();
  const lovs = useSelector(state => state.lovs?.lovs?.lovs);

  const lovNetworks = lovs?.networks;
  const postTypes = lovs?.postTypes;

  const found_network = lovNetworks?.find(
    ln => ln.id === network.networkId,
  )?.desc;
  const network_postype = found_network ? JSON.parse(found_network) : [];

  const isNetworkSelected =
    campaignInfo.networks.length > 0
      ? campaignInfo.networks.some(item => item.networkId == network.networkId)
      : false;

  // console.log({ network });
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.cardBackColor,
        },
      ]}
    >
      <View style={styles.flexBW}>
        <View style={styles.flexC}>
          <Image
            source={getIcon(network.networkId)}
            style={styles.networkIcon}
          />
          <View>
            <Text
              style={[
                styles.networkName,
                {
                  color: theme.textColor,
                },
              ]}
            >
              {network.networkName || network?.name} ({network.purchasedQouta})
            </Text>
            <Text style={{ color: theme.textColor, fontSize: 14 }}>
              {network.networkName || network.name}
            </Text>
          </View>
        </View>
        <View>
          <CheckBox
            style={{
              transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
            }}
            value={isNetworkSelected}
            onValueChange={v => {
              if (v) {
                setCampaignInfo({
                  ...campaignInfo,
                  networks: [
                    ...campaignInfo.networks,
                    {
                      networkId: network.networkId,
                      orgId: user.orgId,
                      rowVer: 0,
                      purchasedQouta: network.purchasedQouta ?? 0,
                      unitPriceInclTax: network.unitPrice ?? 0,
                      usedQuota: network.usedQuota ?? 0,
                      compaignId: 0,
                      posttypejson: '',
                      Code: '',
                      id: 0,
                      desc: network.name,
                      status: 1,
                      postTypes:
                        network_postype?.length === 1 ? network_postype : [],
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
      {isNetworkSelected && network_postype?.length > 1 && (
        <View style={{ flexDirection: 'row' }}>
          {network_postype?.map(np => {
            const selectedNetwork = campaignInfo.networks.find(
              item => item.networkId === network.networkId,
            );

            return (
              <View
                key={np}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 10,
                }}
              >
                <CheckBox
                  style={{
                    transform: [{ scaleX: 1 }, { scaleY: 1 }],
                  }}
                  value={selectedNetwork?.postTypes?.includes(np) ?? false}
                  onValueChange={v => {
                    if (v) {
                      // add postType
                      setCampaignInfo({
                        ...campaignInfo,
                        networks: campaignInfo.networks.map(item =>
                          item.networkId === network.networkId
                            ? {
                                ...item,
                                postTypes: [...(item.postTypes || []), np],
                              }
                            : item,
                        ),
                      });
                    } else {
                      // remove postType
                      setCampaignInfo({
                        ...campaignInfo,
                        networks: campaignInfo.networks.map(item =>
                          item.networkId === network.networkId
                            ? {
                                ...item,
                                postTypes: item.postTypes?.filter(
                                  pt => pt !== np,
                                ),
                              }
                            : item,
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
                <Text style={{ color: theme.textColor, marginLeft: 5 }}>
                  {postTypes?.find(pt => pt?.id === np)?.name || ''}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  flexBW: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flexC: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  networkIcon: { width: 50, height: 50, marginRight: 10 },
  networkName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Network;

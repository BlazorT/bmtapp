import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useActionState, useState } from 'react';
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
import RNSButton from '../Button';
import servicesettings from '../../modules/dataservices/servicesettings';
import Toast from 'react-native-simple-toast';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TemplateViewer from './TemplateViewer';

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

  const [templates, setTemplates] = useState([]);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const openTemplate = item => {
    setSelectedTemplate(item);
    setShowTemplate(true);
  };

  const closeTemplate = () => {
    setSelectedTemplate(null);
    setShowTemplate(false);
  };

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

  const getTemplates = async networkId => {
    if (!isNetworkSelected) {
      Toast.show('Select network first to select template!');
      return;
    }
    setTemplateLoading(true);
    try {
      let headerFetch = {
        method: 'POST',
        body: JSON.stringify({
          keyword: '',
          status: 1,
          networkId,
        }),
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: 'application/json',
          Authorization: servicesettings.AuthorizationKey,
        },
      };
      const response = await fetch(
        // createcompletecompaign
        servicesettings.baseuri + 'Template/campaigntemplatesallnetworks',
        headerFetch,
      );
      if (!response.ok) {
        Toast.show('Something went wrong, please try again');
        return;
      }

      const res = await response.json();
      // Store templates for this specific network
      setShowTemplateList(true);
      setTemplates(res?.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      Toast.show('Something went wrong, please try again');
    } finally {
      setTemplateLoading(false);
    }
  };
  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength
      ? text.substring(0, maxLength) + '...'
      : text;
  };

  const selectedNetwork = campaignInfo.networks.find(
    item => item.networkId === network.networkId,
  );
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
                    Template: '',
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
        <View style={styles.flexC}>
          <View style={{ flexDirection: 'row' }}>
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
                {network.networkName || network?.name} ({network.purchasedQouta}
                )
              </Text>
              <Text style={{ color: theme.textColor, fontSize: 14 }}>
                {network.networkName || network.name}
              </Text>
            </View>
          </View>
        </View>

        <RNSButton
          caption="Template..."
          bgColor={theme.buttonBackColor}
          small
          loading={templateLoading}
          onPress={() => getTemplates(network?.networkId)}
          style={{
            paddingHorizontal: 2,
            maxHeight: 35,
            paddingVertical: 0,
            // minWidth: 60,
          }}
        />
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
      {selectedNetwork?.Template && isNetworkSelected ? (
        <TouchableOpacity
          onPress={() => {
            openTemplate(selectedNetwork?.Template);
          }}
          style={[
            styles.card,
            { backgroundColor: theme.buttonBackColor, rowGap: 5, marginTop: 6 },
          ]}
        >
          <Text
            style={{
              color: theme.textColor,
              fontSize: 14,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Selected Template
          </Text>
          <Text
            style={{
              color: theme.textColor,
              fontSize: 14,
            }}
          >
            {truncateText(selectedNetwork?.Template?.template, 50)}
          </Text>
        </TouchableOpacity>
      ) : null}
      {isNetworkSelected && showTemplateList && templates?.length > 0 ? (
        <View
          style={{
            marginTop: 10,
            borderTopColor: theme.textColor,
            borderTopWidth: 0.5,
          }}
        >
          <Text
            style={{
              color: theme.textColor,
              fontSize: 14,
              marginVertical: 5,
              fontWeight: 'bold',
            }}
          >
            Templates
          </Text>
          <FlatList
            keyExtractor={(item, id) => id.toString()}
            data={templates || []}
            nestedScrollEnabled={true}
            style={{ maxHeight: 200 }} // set a maxHeight on the FlatList itself
            contentContainerStyle={{ rowGap: 5, paddingBottom: 10 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  openTemplate(item);
                }}
                style={[
                  styles.card,
                  { backgroundColor: theme.buttonBackColor },
                ]}
              >
                <View
                  style={{
                    position: 'absolute',
                    right: 5,
                    top: 5,
                    gap: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      openTemplate(item);
                    }}
                  >
                    <FontAwesome
                      name={'external-link'}
                      size={26}
                      color={theme.tintColor}
                    />
                  </TouchableOpacity>

                  <CheckBox
                    style={{
                      transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }],
                      zIndex: 999,
                    }}
                    value={selectedNetwork?.Template?.id === item.id}
                    onValueChange={v => {
                      if (v) {
                        // add postType
                        setCampaignInfo({
                          ...campaignInfo,
                          networks: campaignInfo.networks.map(nt =>
                            nt.networkId === network.networkId
                              ? {
                                  ...nt,
                                  Template: item,
                                }
                              : nt,
                          ),
                        });
                        setShowTemplateList(false);
                      } else {
                        // remove postType
                        setCampaignInfo({
                          ...campaignInfo,
                          networks: campaignInfo.networks.map(nt =>
                            nt.networkId === network.networkId
                              ? {
                                  ...nt,
                                  Template: '',
                                }
                              : nt,
                          ),
                        });
                      }
                    }}
                    boxType={'square'}
                    tintColors={{
                      true: theme.selectedCheckBox,
                      false: theme.modalBackColor,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: theme.textColor,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}
                >
                  Name :{' '}
                  <Text
                    style={{
                      color: theme.textColor,
                      fontSize: 14,
                      fontWeight: 'normal',
                    }}
                  >
                    {item?.name}
                  </Text>
                </Text>
                <Text
                  style={{
                    color: theme.textColor,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}
                >
                  Title :{' '}
                  <Text
                    style={{
                      color: theme.textColor,
                      fontSize: 14,
                      fontWeight: 'normal',
                    }}
                  >
                    {item?.title}
                  </Text>
                </Text>
                {item?.subject ? (
                  <Text
                    style={{
                      color: theme.textColor,
                      fontSize: 14,
                      fontWeight: 'bold',
                    }}
                  >
                    Subject :{' '}
                    <Text
                      style={{
                        color: theme.textColor,
                        fontSize: 14,
                        fontWeight: 'normal',
                      }}
                    >
                      {item?.subject}
                    </Text>
                  </Text>
                ) : null}

                <Text
                  style={{
                    color: theme.textColor,
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}
                >
                  Content :{' '}
                  <Text
                    style={{
                      color: theme.textColor,
                      fontSize: 14,
                      fontWeight: 'normal',
                    }}
                  >
                    {truncateText(item?.template, 50)}
                  </Text>
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : null}
      <TemplateViewer
        isOpen={showTemplate}
        onClose={closeTemplate}
        template={selectedTemplate}
      />
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
  card: {
    padding: 10,
    borderRadius: 6,
  },
  flexBW: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flexC: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  networkIcon: { width: 50, height: 50, marginRight: 10 },
  networkName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Network;

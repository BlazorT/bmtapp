import CheckBox from '@react-native-community/checkbox';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import emailIcon from '../../../assets/images/Email.png';
import facebookIcon from '../../../assets/images/Facebook.png';
import smsIcon from '../../../assets/images/SMS.png';
import twitterIcon from '../../../assets/images/Twitter.png';
import whatsappIcon from '../../../assets/images/Whatsapp.png';
import instagramIcon from '../../../assets/images/instagram.png';
import linkedinIcon from '../../../assets/images/linkedin.png';
import snapchatIcon from '../../../assets/images/snapchat.png';
import tiktokIcon from '../../../assets/images/tiktok.png';
import { safeJSONParse } from '../../helper/dateFormatter';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import servicesettings from '../../modules/dataservices/servicesettings';
import RNSButton from '../Button';
import QuotaBadge from './QuotaBadge';
import TemplateEditorModal from './TemplateEditorModal';

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

const Network = ({
  campaignInfo,
  network,
  setCampaignInfo,
  setScheduleList,
}) => {
  const theme = useTheme();
  const { user } = useUser();
  const lovs = useSelector(state => state.lovs?.lovs?.lovs);

  const [templates, setTemplates] = useState([]);
  const [templateLoading, setTemplateLoading] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);
  const [showTemplateList, setShowTemplateList] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  // ── NEW: confirmation modal state ──
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

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
        servicesettings.baseuri + 'Template/campaigntemplatesallnetworks',
        headerFetch,
      );
      if (!response.ok) {
        Toast.show('Something went wrong, please try again');
        return;
      }

      const res = await response.json();
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

  // ── NEW: performs the actual removal after user confirms ──
  const handleConfirmedRemove = () => {
    setShowRemoveConfirm(false);

    // Remove network from campaignInfo.networks AND
    // remove all schedules that reference this network
    setCampaignInfo(prev => ({
      ...prev,
      networks: prev.networks.filter(
        item => item.networkId !== network.networkId,
      ),
      schedules: prev.schedules?.filter(
        s =>
          s.networkId !== network.networkId &&
          !s.CompaignNetworks?.some(cn => cn.networkId === network.networkId),
      ),
    }));

    // Reset scheduleList
    setScheduleList({
      CompaignNetworks: [],
      id: 0,
      budget: 0,
      rowVer: 0,
      messageCount: 0,
      orgId: user.orgId,
      days: [],
      networkId: 0,
      albums: [],
      compaignDetailId: 0,
      isFixedTime: 1,
      startTime: campaignInfo.campaignStartDate,
      finishTime: campaignInfo.campaignEndDate,
      interval: 0,
      status: 1,
      intervalTypeId: 0,
      randomId: Math.floor(100000 + Math.random() * 900000),
    });
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
          key={`network-cb-${network.networkId}-${isNetworkSelected}-${showRemoveConfirm}`} // ← ADD THIS
          style={{
            transform: [
              { scaleX: Platform.OS === 'ios' ? 0.9 : 1.6 },
              { scaleY: Platform.OS === 'ios' ? 0.9 : 1.6 },
            ],
          }}
          value={isNetworkSelected ? true : false}
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
              // ── NEW: check if this network is used in any schedule ──
              const networkInSchedules = campaignInfo.schedules?.some(
                s =>
                  s.networkId === network.networkId ||
                  s.CompaignNetworks?.some(
                    cn => cn.networkId === network.networkId,
                  ),
              );

              if (networkInSchedules) {
                // Show confirmation modal instead of removing directly
                setShowRemoveConfirm(true);
              } else {
                // Safe to remove directly — no schedules affected
                setCampaignInfo({
                  ...campaignInfo,
                  networks: campaignInfo.networks.filter(
                    item => item.networkId !== network.networkId,
                  ),
                });
              }
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
            <View
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                rowGaps: 2,
              }}
            >
              <Text
                style={[
                  styles.networkName,
                  {
                    color: theme.textColor,
                  },
                ]}
              >
                {network.networkName || network?.name}
              </Text>
              <QuotaBadge
                remainingQuota={network?.purchasedQouta - network?.usedQuota}
                usedQuota={network?.usedQuota}
                totalQuota={network?.purchasedQouta}
              />
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
            paddingHorizontal: 0,
            maxHeight: 30,
            paddingVertical: 0,
            width: 'auto',
          }}
          textStyle={{ fontSize: Platform.OS === 'ios' ? 12 : 14 }}
        />
      </View>

      {isNetworkSelected && network_postype?.length > 1 && (
        <View style={{ flexDirection: 'row', marginTop: 5 }}>
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
                    transform: [
                      { scaleX: Platform.OS === 'ios' ? 0.8 : 1.2 },
                      { scaleY: Platform.OS === 'ios' ? 0.8 : 1.2 },
                    ],
                  }}
                  value={selectedNetwork?.postTypes?.includes(np) ?? false}
                  onValueChange={v => {
                    if (v) {
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
            {selectedNetwork?.Template?.networkId === 2
              ? truncateText(
                  safeJSONParse(
                    selectedNetwork?.Template?.templateJson,
                  )?.components?.find(c => c.type === 'BODY')?.text ||
                    selectedNetwork?.Template?.template,
                  80,
                )
              : truncateText(selectedNetwork?.Template?.template, 50)}
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
            data={
              templates?.filter(t =>
                t?.networkId === 2 ? t?.templateJson : true,
              ) || []
            }
            nestedScrollEnabled={true}
            style={{ maxHeight: 200 }}
            contentContainerStyle={{ rowGap: 5, paddingBottom: 10 }}
            renderItem={({ item }) => {
              const templateJson =
                item?.networkId == 2 && item?.templateJson
                  ? safeJSONParse(item.templateJson)
                  : null;
              return (
                <View
                  style={[
                    styles.card,
                    { backgroundColor: theme.buttonBackColor },
                  ]}
                >
                  <View
                    style={{
                      position: 'absolute',
                      right: 5,
                      top: 3,
                      gap: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 999,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        openTemplate(item);
                      }}
                    >
                      <FontAwesome
                        name={'edit'}
                        size={Platform.OS === 'ios' ? 26 : 26}
                        color={theme.tintColor}
                      />
                    </TouchableOpacity>

                    <CheckBox
                      style={{
                        transform: [
                          { scaleX: Platform.OS === 'ios' ? 0.8 : 1.5 },
                          { scaleY: Platform.OS === 'ios' ? 0.8 : 1.5 },
                        ],
                        zIndex: 999,
                      }}
                      value={selectedNetwork?.Template?.id === item.id}
                      onValueChange={v => {
                        if (v) {
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
                      tintColor={theme.textColor}
                      onTintColor={theme.white}
                      onCheckColor={theme.white}
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
                      {templateJson?.templateName || item?.name}
                    </Text>
                  </Text>
                  {!templateJson ? (
                    <>
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
                    </>
                  ) : (
                    <Text
                      style={{
                        color: theme.textColor,
                        fontSize: 14,
                        fontWeight: 'bold',
                      }}
                    >
                      Language :{' '}
                      <Text
                        style={{
                          color: theme.textColor,
                          fontSize: 14,
                          fontWeight: 'normal',
                        }}
                      >
                        {templateJson?.templateLanguage}
                      </Text>
                    </Text>
                  )}

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
                      {item?.networkId === 2
                        ? truncateText(
                            templateJson?.components?.find(
                              c => c.type === 'BODY',
                            )?.text || item.template,
                            80,
                          )
                        : truncateText(item?.template, 50)}
                    </Text>
                  </Text>
                </View>
              );
            }}
          />
        </View>
      ) : null}

      <TemplateEditorModal
        isOpen={showTemplate}
        onClose={closeTemplate}
        template={selectedTemplate}
        onSave={updatedTemplate => {
          setTemplates(prev =>
            prev.map(tpl =>
              tpl.id === updatedTemplate.id
                ? { ...tpl, ...updatedTemplate }
                : tpl,
            ),
          );

          if (isNetworkSelected) {
            setCampaignInfo(prev => ({
              ...prev,
              networks: prev.networks.map(nt =>
                nt.networkId === network.networkId
                  ? {
                      ...nt,
                      Template:
                        nt.Template?.id === updatedTemplate.id
                          ? { ...nt.Template, ...updatedTemplate }
                          : nt.Template,
                    }
                  : nt,
              ),
            }));
          }
          closeTemplate();
        }}
      />

      {/* ── NEW: Remove network confirmation modal ── */}
      <Modal
        visible={showRemoveConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRemoveConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: theme.cardBackColor },
            ]}
          >
            {/* Title */}
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>
              Remove Network
            </Text>

            {/* Body */}
            <Text style={[styles.modalBody, { color: theme.textColor }]}>
              <Text style={{ fontWeight: 'bold' }}>
                {network.networkName || network?.name}
              </Text>{' '}
              is currently used in one or more schedules. Removing it will also
              delete those schedules. Do you want to continue?
            </Text>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              {/* No */}
              <TouchableOpacity
                onPress={() => setShowRemoveConfirm(false)}
                style={[
                  styles.modalBtn,
                  { backgroundColor: theme.buttonBackColor },
                ]}
              >
                <Text style={[styles.modalBtnText, { color: theme.textColor }]}>
                  No
                </Text>
              </TouchableOpacity>

              {/* Yes */}
              <TouchableOpacity
                onPress={handleConfirmedRemove}
                style={[styles.modalBtn, styles.modalBtnDanger]}
              >
                <Text style={[styles.modalBtnText, { color: '#fff' }]}>
                  Yes, Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  networkIcon: { width: 40, height: 40, marginRight: 10 },
  networkName: {
    fontSize: Platform.OS === 'ios' ? 12 : 14,
    fontWeight: 'bold',
  },
  // ── Modal styles ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: '100%',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalBtnDanger: {
    backgroundColor: '#e53935',
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Network;

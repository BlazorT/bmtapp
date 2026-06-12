import notifee, { AndroidImportance } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppLifecycle } from 'react-native-applifecycle';
import Toast from 'react-native-simple-toast';
import {
  CAMPAIGN_INTERESTS,
  GENDER_LIST,
  MAX_AGE,
  MIN_AGE,
} from '../../constants';
import {
  extractTagValue,
  keepOnlyAlphanumeric,
  safeJSONParse,
} from '../../helper/dateFormatter';
import { useJazzCash } from '../../hooks/useJazzCash';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';
import servicesettings from '../../modules/dataservices/servicesettings';
import PaymentView from '../../modules/payment/PaymentView';
import RNSButton from '../Button';
import JCPaymentConfirm from '../JCPaymentConfirm';
import AddSchedule from './AddSchedule';
import ScheduleList from './ScheduleList';
import { useAlert } from '../../context/AlertContext';

const CampaignSchedule = ({
  campaignInfo,
  setCampaignInfo,
  setIndex,
  priceData,
  setModalVisible,
  setUpdateMessage,
  setspinner,
  recipients,
  orgData,
  fetchRecipients,
  scheduleList,
  setScheduleList,
}) => {
  const { showAlert } = useAlert();

  const theme = useTheme();
  const { user } = useUser();
  const navigation = useNavigation();
  const { payJC, jcLoading } = useJazzCash();

  const [selectedGateway, setSelectedGetway] = useState(null);
  const [easypaisaOption, setEasypaisaOption] = useState('');
  const [easyPaisaMobileNumber, setEasyPaisaMobileNumber] = useState('');

  const [jazzCashMobileNumber, setJazzCashMobileNumber] = useState('');
  const [jazzCashNic, setJazzCashNic] = useState('');
  const [jazzCashOption, setJazzCashOption] = useState('');
  const [jazzCashTxnRefNo, setJazzCashTxnRefNo] = useState('');
  const [easypaisaOrderId, setEasypaisaOrderId] = useState('');
  const [showJCPayment, setShowJCPayment] = useState(false);

  const [scheduleTab, setScheduleTab] = React.useState(0);
  const [isUpdate, setIsUpdate] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (
        campaignInfo?.networks?.length > 0 &&
        scheduleList?.CompaignNetworks?.length === 0
      ) {
        const cNetworks =
          campaignInfo?.networks?.map(network => ({
            networkId: network.networkId,
            orgId: user.orgId,
            rowVer: 0,
            purchasedQouta: network.purchasedQouta,
            unitPriceInclTax: network.unitPriceInclTax,
            usedQuota: network.usedQuota,
            compaignId: 0,
            id: 0,
            desc: network.desc,
            status: network.status,
            createdBy: Number(user.id),
            lastUpdatedBy: Number(user.id),
            createdAt: moment().format(),
            lastUpdatedAt: moment().format(),
          })) ?? [];

        setScheduleList(prev => ({
          ...prev,
          networkId: cNetworks[0]?.networkId ?? prev.networkId,
          CompaignNetworks: [...prev.CompaignNetworks, ...cNetworks],
        }));
      }
    }, 100);
  }, []);

  const addSchedule = async ref => {
    try {
      let campaignBody = {
        id: campaignInfo.id,
        targetaudiance: JSON.stringify({
          interests: campaignInfo.interests
            ? campaignInfo.interests
                .map(index => {
                  const found = CAMPAIGN_INTERESTS[index];
                  return found ? found.name : null;
                })
                .filter(Boolean)
            : [], // removes nulls if index not found
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
        status: !orgData?.signature ? 4 : campaignInfo.status,
        orgId: Number(user.orgId),
        hashTags: campaignInfo.hashtag,
        description: campaignInfo?.template,
        name: campaignInfo?.template,
        title: campaignInfo?.template,
        autoGenerateLeads: campaignInfo.autoLead ? 1 : 0,
        createdAt: moment.utc().format(),
        startTime: moment
          .utc(campaignInfo.campaignStartDate)
          .local()
          .format('YYYY-MM-DDTHH:mm:ss'),
        finishTime: moment
          .utc(campaignInfo.campaignEndDate)
          .local()
          .format('YYYY-MM-DDTHH:mm:ss'),
        CompaignNetworks: campaignInfo.networks?.map(n => ({
          CompaignId: n?.id ? campaignInfo.id : 0,
          id: n?.id || 0,
          NetworkId: n?.networkId,
          Desc: n?.desc,
          Status: n?.status,
          Code: '',
          posttypejson: JSON.stringify(n?.postTypes || []),
          Template: n?.Template
            ? safeJSONParse(n?.Template?.templateJson)?.templateType === 2
              ? JSON.stringify({
                  template: JSON.stringify({
                    template: n?.Template?.template,
                    templateType: 2,
                  }),
                  subject: n?.Template?.subject,
                  title: n?.Template?.title,
                })
              : JSON.stringify({
                  template:
                    n?.Template?.networkId === 2
                      ? n?.Template?.templateJson
                      : n?.Template?.template,
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
          FinishTime: moment(s?.finishTime)
            .local()
            .format('YYYY-MM-DDTHH:mm:ss'),
          StartTime: moment(s?.startTime).local().format('YYYY-MM-DDTHH:mm:ss'),
          LastUpdatedAt: moment.utc().format(),
          CreatedBy: user?.id,
          CreatedAt: moment.utc().format(),
          LastUpdatedBy: user?.id,
          Status: s?.status,
          RowVer: 0,
          days: JSON.stringify(s?.days || []),
          Budget: s?.budget || 0,
          ContactsAlbums: JSON.stringify(s?.albums?.map(a => a.id)),
        })),
        totalBudget: campaignInfo.schedules.reduce((a, b) => a + b.budget, 0),
        Budget: campaignInfo.schedules.reduce((a, b) => a + b.budget, 0),
        discount: 0,
        remarks: '',
        paymentStatus: ref ? 1 : 2,
        paymentRef: ref || '',
        rowVer: 0,
      };
      // navigation.navigate('Payment', { campaignBody });
      // return;

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
      // if (!response.ok) {
      //   Toast.show('Something went wrong, please try again');
      //   return;
      // }
      const res = await response.json();
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
                campaignStartDate: moment().local().startOf('day').format(),
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
            }, 4000);
          }
        } else {
          localNotification('Campaign Created', campaignInfo.subject);
          setspinner(false);
          setModalVisible(true);
          setTimeout(() => {
            setModalVisible(false);
          }, 2000);
          setTimeout(() => {
            navigation.navigate('Campaigns', { isReload: true });
            setIndex(0);
            setCampaignInfo({
              id: 0,
              subject: '',
              hashtag: '',
              template: '',
              country: '',
              state: '',
              campaignStartDate: moment().local().startOf('day').format(),
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
          }, 2500);
        }
      }
    } catch (e) {
      console.error(e);
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

  const messagesByNetwork = campaignInfo?.schedules?.reduce((acc, curr) => {
    const networkId = curr.networkId;
    acc[networkId] = (acc[networkId] || 0) + (Number(curr.messageCount) || 0);
    return acc;
  }, {});

  const totalToPay = Object.entries(messagesByNetwork).reduce(
    (sum, [networkId, totalMessages]) => {
      const pricing = priceData?.find(p => p.networkId == networkId);
      if (!pricing) return sum;

      const quota = campaignInfo?.schedules?.find(
        n => n.networkId == networkId,
      );
      if (!quota) return sum;
      const remainingQuota =
        (Number(quota.purchasedQouta) || 0) - (Number(quota.usedQuota) || 0);

      const overUsed = Math.max(0, totalMessages - remainingQuota);

      const unitPrice =
        Number(pricing.unitPrice) - (Number(pricing.discount) || 0);
      const overUsedPrice = overUsed * unitPrice;

      return sum + overUsedPrice;
    },
    0,
  );

  const toPay = totalToPay;

  const easyPaisaQuickPay = async () => {
    const orderId =
      `${keepOnlyAlphanumeric((Number(user.orgId) ?? '') + 'RBMT')}` +
      'D' +
      moment().format('YYYYMMDDHHmmss');
    const transactionAmount = parseFloat(toPay?.toFixed(2));

    const xmlBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:dto="http://dto.transaction.partner.pg.systems.com/"
    xmlns:dto1="http://dto.common.pg.systems.com/">
       <soapenv:Header/>
       <soapenv:Body>
          <dto:initiateTransactionRequestType>
             <dto1:username>${
               selectedGateway.merchantAccountId ?? 'Hotmealndealz.'
             }</dto1:username>
             <dto1:password>${
               selectedGateway?.primaryKey ?? '915c7b18ee8adec0393e55690c34d328'
             }</dto1:password>
             <orderId>${orderId}</orderId>
             <storeId>${`760757`}</storeId>
             <transactionAmount>${transactionAmount}</transactionAmount>
             <transactionType>MA</transactionType>
             <mobileAccountNo>${easyPaisaMobileNumber}</mobileAccountNo>
             <emailAddress>${user?.email || ''}</emailAddress>
             <paymentTokenExpiryDateTime>${moment()
               .add(5, 'minute')
               .toISOString()}</paymentTokenExpiryDateTime >
          </dto:initiateTransactionRequestType>
       </soapenv:Body>
    </soapenv:Envelope>
    `;
    setEasypaisaOrderId(orderId);
    try {
      setspinner(true);
      const res = await fetch(
        selectedGateway?.url ??
          'https://easypay.easypaisa.com.pk/easypay-service/PartnerBusinessService',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml',
            SOAPAction: 'initiateTransaction',
            // Credentials: `${encodeBase64('znawazch@gmail.com:Blazor@025')}`,
          },
          body: xmlBody,
        },
      );
      const data = await res.text();
      const responseCode = extractTagValue(data, 'ns2:responseCode');
      const transactionId = extractTagValue(data, 'transactionId');
      if (data && responseCode == '0000') {
        addSchedule(btoa(data));
        Toast.show('Payment successful');
      } else {
        const message =
          'Payment is not success, possible reasons, account holder acceptance is not done or easy paisa account does not exist!';
        await showAlert({
          title: 'EasyPaisa Payment',
          message: message,
          type: 'error',
        });

        return;
      }
    } catch (e) {
      Toast.show(e?.message || 'Something went wrong, try again later!');
      await easyPaisaCheckStatus(orderId);
    } finally {
      setspinner(false);
    }
  };

  const easyPaisaCheckStatus = async orderId => {
    const xmlBody = `
    <soapenv:Envelope
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:dto="http://dto.transaction.partner.pg.systems.com/"
      xmlns:dto1="http://dto.common.pg.systems.com/"
    >
      <soapenv:Header />
      <soapenv:Body>
        <dto:inquireTransactionRequestType>
          <dto1:username>${selectedGateway?.merchantAccountId}</dto1:username>
          <dto1:password>${selectedGateway?.primaryKey}</dto1:password>
          <orderId>${orderId}</orderId>
          <accountNum>159130486</accountNum>
        </dto:inquireTransactionRequestType>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

    try {
      setspinner(true);
      const res = await fetch(
        selectedGateway?.url ??
          'https://easypay.easypaisa.com.pk/easypay-service/PartnerBusinessService',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml',
            SOAPAction: 'inquireTransactionResponseType',
            // Credentials: `${encodeBase64('znawazch@gmail.com:Blazor@025')}`,
          },
          body: xmlBody,
        },
      );
      const data = await res.text();
      const responseCode = extractTagValue(data, 'ns2:responseCode');
      const transactionStatus = extractTagValue(data, 'transactionStatus');
      if (responseCode === '0000' && transactionStatus) {
        if (transactionStatus === 'PAID') {
          Toast.show('Payment successful');
          addSchedule(btoa(data));
        }
        if (transactionStatus === 'FAILED') {
          const message =
            'Payment is not success, possible reasons, account holder acceptance is not done or easy paisa account does not exist!';
          await showAlert({
            title: 'EasyPaisa Payment',
            message: message,
            type: 'error',
          });

          setEasypaisaOrderId('');
        }
        if (transactionStatus === 'PENDING') {
          setspinner(true);
          return;
        }
      } else if (responseCode) {
        const message =
          'Payment could not be processed. Please verify your EasyPaisa account details and try again.';
        await showAlert({
          title: 'EasyPaisa Payment',
          message: message,
          type: 'error',
        });

        return;
      }
    } catch (e) {
      Toast.show(e?.message || 'Something went wrong, try again later!');
    } finally {
      setspinner(false);
    }
  };

  const makeJCMwalltet = async () => {
    const now = moment().local();
    const txnDateTime = now.format('YYYYMMDDHHmmss');

    // Generate TxnRefNo (first three letters of domain + timestamp)
    const txnRef = `BMT${txnDateTime}`;
    setJazzCashTxnRefNo(txnRef);

    const jcBody = {
      amount: parseInt(toPay?.toFixed(2) * 100)?.toString(), // will be sent as 200 (Rs 2.00)
      mobile: jazzCashMobileNumber,
      description: 'mobile',
      billRef:
        `${keepOnlyAlphanumeric((Number(user.orgId) ?? '') + 'RBMT')}` +
        'D' +
        moment().format('YYYYMMDDHHmmss'),
      cnic: jazzCashNic,
      ppmpf_1: keepOnlyAlphanumeric(user?.email ?? ''),
      txnRef,
      txnDT: txnDateTime,
      ppmpf_2: '',
    };
    const res = await payJC(jcBody);
    if (res) {
      const filteredResponse = {
        pp_TxnType: res.pp_TxnType || '',
        pp_Amount: res.pp_Amount || '',
        pp_BillReference: res.pp_BillReference || '',
        pp_ResponseCode: res.pp_ResponseCode || '',
        pp_RetreivalReferenceNo: res.pp_RetreivalReferenceNo || '',
        pp_SubMerchantID: res.pp_SubMerchantID || '',
        pp_TxnCurrency: res.pp_TxnCurrency || '',
        pp_TxnDateTime: res.pp_TxnDateTime || '',
        pp_TxnRefNo: res.pp_TxnRefNo || '',
        pp_MobileNumber: res.pp_MobileNumber || '',
        pp_CNIC: res.pp_CNIC || '',
        pp_SecureHash: res.pp_SecureHash || '',
      };

      setTimeout(
        async () => {
          if (res?.pp_ResponseCode === '157') {
            // toggleJCPayment();
            setShowJCPayment(true);
          } else if (res?.pp_ResponseCode === '000') {
            Toast.show(res?.pp_ResponseMessage);
            addSchedule(btoa(JSON.stringify(filteredResponse)));
          } else if (res?.pp_ResponseMessage) {
            setJazzCashTxnRefNo('');
            const message = `Payment did not approved.\n${
              res?.pp_ResponseMessage ||
              'JazzCash payment failed. Please try again.'
            }`;
            await showAlert({
              title: 'JazzCash Payment',
              message: message,
              type: 'error',
            });
            // Toast.show(message);
          }
        },
        Platform.OS === 'ios' ? 1000 : 0,
      );
    }
  };

  const payAndPlace = async () => {
    if (!selectedGateway) {
      Toast.show('Select a payment method to proceed');
      return;
    }
    if (selectedGateway?.name?.toLowerCase() == 'easypaisa') {
      if (easypaisaOption !== 'quickPay') {
        Toast.show('Select an EasyPaisa payment mode to continue.');
        return;
      }
      if (easyPaisaMobileNumber === '' || easyPaisaMobileNumber.length < 11) {
        Toast.show('Enter a valid EasyPaisa account number');
        return;
      }
      await easyPaisaQuickPay();
    }
    if (selectedGateway?.name?.toLowerCase() == 'jazzcash') {
      if (jazzCashOption !== 'wallet') {
        Toast.show('Select a JazzCash payment mode to continue.');
        return;
      }
      if (jazzCashMobileNumber === '' || jazzCashMobileNumber.length < 10) {
        Toast.show('Enter a valid JazzCash account number');
        return false;
      }
      if (jazzCashNic === '' || jazzCashNic.length < 6) {
        Toast.show('Please enter at least 6 digits of your cnic');
        return false;
      }
      await makeJCMwalltet();
    }
  };

  React.useEffect(() => {
    let isMounted = true;

    const listener = AppLifecycle.addEventListener('change', state => {
      if (!isMounted) return;
      if (state === 'active') {
        if (jazzCashTxnRefNo && jazzCashTxnRefNo !== '') {
          setShowJCPayment(true);
        }
        // if (easypaisaOrderId && easypaisaOrderId !== '') {
        //   // easyPaisaCheckStatus();
        // }
      }
    });

    return () => {
      isMounted = false;
      listener.remove();
    };
  }, []);
  // // ✅ format at the end
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
        {scheduleTab !== 2 ? (
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
        ) : null}
        {scheduleTab !== 2 ? (
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
        ) : null}
        {scheduleTab === 2 ? (
          <TouchableOpacity
            onPress={() => {
              setScheduleTab(2);
            }}
            style={{
              width: '100%',
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
              Select Payment Method
            </Text>
          </TouchableOpacity>
        ) : null}
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
          priceData={priceData}
          setIsUpdate={setIsUpdate}
          recipients={recipients}
          fetchRecipients={fetchRecipients}
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
            totalToPay={totalToPay}
          />
          <RNSButton
            style={{ width: '100%', marginTop: 10 }}
            bgColor={theme.buttonBackColor}
            caption={totalToPay > 0 ? 'Checkout' : 'Submit'}
            // onPress={addSchedule}
            onPress={() =>
              totalToPay > 0 ? setScheduleTab(2) : addSchedule('')
            }
          />
        </>
      )}
      {scheduleTab === 2 && (
        <View style={{ marginTop: 10 }}>
          <Modal visible={jcLoading} backdropColor={'transparent'} transparent>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)', // optional dim backdrop
              }}
            >
              <View
                style={{
                  backgroundColor: theme.modalBackColor,
                  paddingHorizontal: 15,
                  paddingVertical: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '90%',
                  borderRadius: 12,
                  shadowColor: theme.textColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                {selectedGateway?.logo ? (
                  <Image
                    source={{
                      uri: `data:image/png;base64,${selectedGateway.logo}`,
                    }}
                    style={{
                      width: 50,
                      height: 50,
                    }}
                    resizeMode="contain"
                  />
                ) : null}

                {/* Spinner */}
                <ActivityIndicator
                  color={theme.selectedCheckBox}
                  size="large"
                  style={{ marginVertical: 20 }}
                />

                {/* Status text */}
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: 4,
                    fontSize: 22,
                    color: theme.textColor,
                  }}
                >
                  Waiting for Payment Approval
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: theme.placeholderColor,
                    marginBottom: 20,
                  }}
                >
                  This may take up to 10 minutes
                </Text>

                {/* Divider */}
                <View
                  style={{
                    width: '100%',
                    height: 0.5,
                    backgroundColor: theme.placeholderColor,
                    marginBottom: 16,
                  }}
                />

                {/* Steps label */}
                <Text
                  style={{
                    alignSelf: 'flex-start',
                    color: theme.placeholderColor,
                    marginBottom: 10,
                    letterSpacing: 0.5,
                    fontSize: 12,
                  }}
                >
                  FOLLOW THESE STEPS
                </Text>

                {/* Steps */}
                {[
                  { step: '1', text: 'Open your JazzCash app' },
                  { step: '2', text: 'Tap the 👤 profile icon at top right' },
                  { step: '3', text: 'Tap on Payment Requests' },
                  { step: '4', text: 'Select the Pending tab' },
                  { step: '5', text: 'Approve your payment' },
                ].map(({ step, text }) => (
                  <View
                    key={step}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      marginBottom: 10,
                      width: '100%',
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: theme.selectedCheckBox,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: theme.textColor,
                          fontSize: 13,
                        }}
                      >
                        {step}
                      </Text>
                    </View>
                    <Text
                      style={{
                        flex: 1,
                        fontWeight: '700',
                        color: theme.textColor,
                        fontSize: 13,
                      }}
                    >
                      {text}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Modal>

          <PaymentView
            onPayComplete={addSchedule}
            selectedGateway={selectedGateway}
            easyPaisaMobileNumber={easyPaisaMobileNumber}
            easypaisaOption={easypaisaOption}
            setEasyPaisaMobileNumber={setEasyPaisaMobileNumber}
            setEasypaisaOption={setEasypaisaOption}
            setSelectedGetway={setSelectedGetway}
            jazzCashMobileNumber={jazzCashMobileNumber}
            jazzCashNic={jazzCashNic}
            jazzCashOption={jazzCashOption}
            setJazzCashMobileNumber={setJazzCashMobileNumber}
            setJazzCashNic={setJazzCashNic}
            setJazzCashOption={setJazzCashOption}
            toPay={toPay}
          />
          <JCPaymentConfirm
            isVisible={showJCPayment}
            toggleModal={() => setShowJCPayment(prev => !prev)}
            setShowJCPayment={setShowJCPayment}
            onCheckout={addSchedule}
            jazzCashTxnRefNo={jazzCashTxnRefNo}
            selectedGateway={selectedGateway}
            setPaymentError={async error => {
              const message = error;
              await showAlert({
                title: 'JazzCash Payment',
                message: message,
                type: 'error',
              });
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginVertical: 10,
            }}
          >
            <RNSButton
              style={{ width: '49%' }}
              bgColor={theme.buttonBackColor}
              caption="Cancel"
              onPress={() => setScheduleTab(1)}
            />

            <RNSButton
              style={{ width: '49%' }}
              bgColor={theme.buttonBackColor}
              caption="Pay & Place"
              onPress={payAndPlace}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CampaignSchedule;

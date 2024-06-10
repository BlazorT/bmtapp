import CheckBox from '@react-native-community/checkbox';
import moment from 'moment';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Toast from 'react-native-simple-toast';
import {useSelector} from 'react-redux';
import {useTheme} from '../../hooks/useTheme';
import {useUser} from '../../hooks/useUser';
import RNSButton from '../Button';
import RNSDropDown from '../Dropdown';
import CampaignNetwork from './CampaignNetwork';

const AddSchedule = ({
  campaignInfo,
  setCampaignInfo,
  setIndex,
  setScheduleTab,
  scheduleList,
  setScheduleList,
  isUpdate,
  setIsUpdate,
}) => {
  const theme = useTheme();
  const {user} = useUser();
  const lovs = useSelector(state => state.lovs).lovs;
  const [showStartDatePicker, setShowStartDatePicker] = React.useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = React.useState(false);
  const [scheduleMessageCount, setScheduleMessageCount] = React.useState(0);

  const days = [
    {name: 'Sun'},
    {name: 'Mon'},
    {name: 'Tue'},
    {name: 'Wed'},
    {name: 'Thu'},
    {name: 'Fri'},
    {name: 'Sat'},
  ];

  const addSchedule = () => {
    if (scheduleList.CompaignNetworks.length == 0) {
      Toast.show('Please select atleast one network');
      return;
    }
    if (scheduleList.days.length == 0) {
      Toast.show('Please select a day');
      return;
    }
    setCampaignInfo(prevState => ({
      ...prevState,
      schedules: [...prevState.schedules, scheduleList],
    }));
    setScheduleTab(1);
    console.log(scheduleList);
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
      intervalTypeId: 1,
      randomId: Math.floor(100000 + Math.random() * 900000),
    });
  };

  const updateSchedule = () => {
    console.log(scheduleList.CompaignNetworks.length);
    if (scheduleList.CompaignNetworks.length == 0) {
      Toast.show('Please select atleast one network');
      return;
    }
    setCampaignInfo(prevState => {
      const updatedSchedules = prevState.schedules.map(schedule =>
        schedule.randomId == scheduleList.randomId
          ? {...scheduleList}
          : schedule,
      );

      return {
        ...prevState,
        schedules: updatedSchedules,
      };
    });
    setScheduleTab(1);
    setIsUpdate(false);
    // console.log(scheduleList);
  };
  return (
    <View style={{marginTop: 10}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: 10,
          rowGap: 5,
          marginBottom: 10,
        }}>
        {campaignInfo.networks.map((network, index) => (
          <View
            key={index}
            style={{
              backgroundColor: theme.cardBackColor,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 6,
              paddingVertical: 6,
              borderRadius: 6,
            }}>
            <Text
              style={{color: theme.textColor, fontSize: 16, marginRight: 10}}>
              {network.desc} ({network.purchasedQouta})
            </Text>
            <CheckBox
              style={{
                transform: [{scale: 1.4}],
              }}
              boxType={'square'}
              tintColors={{
                true: theme.selectedCheckBox,
                false: theme.buttonBackColor,
              }}
              onValueChange={value => {
                if (value) {
                  setScheduleList({
                    ...scheduleList,
                    networkId: network.networkId,
                    CompaignNetworks: [
                      ...scheduleList.CompaignNetworks,
                      {
                        networkId: network.networkId,
                        orgId: user.orgid,
                        rowVer: 0,
                        purchasedQouta: network.purchasedQouta,
                        unitPriceInclTax: network.unitPriceInclTax,
                        usedQuota: network.usedQuota,
                        compaignId: 0,
                        id: 0,
                        desc: network.desc,
                        status: network.status,
                        createdBy: parseInt(user.id),
                        lastUpdatedBy: parseInt(user.id),
                        createdAt: moment().format(),
                        lastUpdatedAt: moment().format(),
                      },
                    ],
                  });
                } else {
                  setScheduleList({
                    ...scheduleList,
                    networkId:
                      CampaignNetwork.length == 0
                        ? CampaignNetwork[0].networkId
                        : 0,
                    CompaignNetworks: scheduleList.CompaignNetworks.filter(
                      item => item.networkId != network.networkId,
                    ),
                  });
                }
              }}
              value={
                scheduleList.CompaignNetworks.length > 0
                  ? scheduleList.CompaignNetworks.some(
                      item => item.networkId == network.networkId,
                    )
                  : false
              }
            />
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flex: 1,
          //   width: Dimensions.get('screen').width,
        }}>
        <View style={{width: '60%'}}>
          <RNSDropDown
            items={lovs['bmtlovs'].intervals}
            selectedIndex={scheduleList.intervalTypeId}
            onSelect={value => {
              console.log({value});
              setScheduleList({
                ...scheduleList,
                intervalTypeId: value,
              });
            }}
            style={{
              //   width: '80%',
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
              borderRadius: 6,
              height: 45,
              fontSize: 16,
              borderColor: '#ff00003d',
              borderWidth: 1,
            }}
            placeholder="Interval Type..."
            clearTextOnFocus={true}
            keyboardAppearance={'dark'}
          />
        </View>
        <View style={{width: '35%'}}>
          <TextInput
            placeholder="Minute (1-60)"
            placeholderTextColor={theme.placeholderColor}
            defaultValue={scheduleList.intervalTypeId == 5 ? '60' : '0'}
            value={scheduleList.interval}
            editable={scheduleList.intervalTypeId == 5 ? true : false}
            onChangeText={value => {
              if (value > 60) {
                Toast.show('Interval should be less than 60');
                return;
              }
              setScheduleList({
                ...scheduleList,
                interval: value,
              });
            }}
            style={{
              width: '100%',
              marginLeft: 15,
              paddingHorizontal: 10,
              backgroundColor: theme.inputBackColor,
              color: theme.textColor,
              borderRadius: 6,
              fontSize: 16,
              height: 45,
            }}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
      </View>
      <View
        style={{
          marginTop: 30,
          backgroundColor: theme.cardBackColor,
          paddingHorizontal: 10,
          paddingVertical: 10,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: 10,
          rowGap: 10,
          borderRadius: 6,
        }}>
        <>
          <Text
            style={{
              color: theme.textColor,
              fontSize: 18,
              position: 'absolute',
              top: -20,
              backgroundColor: theme.cardBackColor,
              paddingHorizontal: 10,
              borderTopRightRadius: 6,
              borderTopLeftRadius: 6,
            }}>
            Days
          </Text>
          {days.map((day, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                height: 40,
              }}>
              <CheckBox
                style={{
                  transform: [{scale: 1.4}],
                }}
                onValueChange={value => {
                  setScheduleList({
                    ...scheduleList,
                    days: [...scheduleList.days, index + 1],
                  });
                }}
                value={scheduleList.days.includes(index + 1)}
                boxType={'square'}
                tintColors={{
                  true: theme.selectedCheckBox,
                  false: theme.buttonBackColor,
                }}
              />
              <Text
                style={{
                  color: theme.textColor,
                  fontSize: 18,
                  textAlign: 'center',
                }}>
                {day.name}
              </Text>
            </View>
          ))}
        </>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 6,
        }}>
        <TouchableOpacity
          onPress={() => setShowStartDatePicker(true)}
          style={{
            backgroundColor: theme.inputBackColor,
            width: '48%',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{color: theme.textColor, fontSize: 17}}>
            {scheduleList.startTime
              ? moment(scheduleList.startTime).format('DD-MM-YYYY')
              : 'Campaign Start'}
          </Text>
        </TouchableOpacity>
        <DateTimePicker
          isVisible={showStartDatePicker}
          minimumDate={new Date()}
          maximumDate={
            campaignInfo.campaignEndDate !== ''
              ? new Date(campaignInfo.campaignEndDate)
              : new Date(new Date().setMonth(new Date().getMonth() + 4))
          }
          date={
            scheduleList.startTime !== ''
              ? new Date(scheduleList.startTime)
              : new Date()
          }
          mode="datetime"
          onConfirm={date => {
            setScheduleList({...scheduleList, startTime: date});
            setShowStartDatePicker(false);
          }}
          onCancel={() => setShowStartDatePicker(false)}
          pickerStyleIOS={{
            backgroundColor: theme.cardBackColor,
          }}
          textColor={theme.textColor}
          buttonTextColorIOS={theme.textColor}
          pickerContainerStyleIOS={{
            backgroundColor: theme.cardBackColor,
          }}
          customCancelButtonIOS={e => {
            console.log({e});
            return (
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(false)}
                style={{
                  width: '100%',
                  backgroundColor: theme.cardBackColor,
                  borderRadius: 10,
                  paddingVertical: 15,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    color: theme.textColor,
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            );
          }}
        />
        <TouchableOpacity
          onPress={() => setShowEndDatePicker(true)}
          style={{
            backgroundColor: theme.inputBackColor,
            width: '48%',
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 6,
            alignItems: 'center',
            borderWidth: 1,
          }}>
          <Text style={{color: theme.textColor, fontSize: 17}}>
            {scheduleList.finishTime
              ? moment(scheduleList.finishTime).format('DD-MM-YYYY')
              : 'Campaign End'}
          </Text>
          <DateTimePicker
            isVisible={showEndDatePicker}
            minimumDate={new Date(scheduleList.startTime)}
            mode="datetime"
            // date={
            //   campaignInfo.campaignEndDate !== ''
            //     ? new Date(campaignInfo.campaignEndDate)
            //     : new Date(new Date().setMonth(new Date().getDay() + 2))
            // }
            onConfirm={date => {
              setScheduleList({...scheduleList, finishTime: date});
              setShowEndDatePicker(false);
            }}
            onCancel={() => setShowEndDatePicker(false)}
            pickerStyleIOS={{
              backgroundColor: theme.cardBackColor,
            }}
            textColor={theme.textColor}
            buttonTextColorIOS={theme.textColor}
            pickerContainerStyleIOS={{
              backgroundColor: theme.cardBackColor,
            }}
            customCancelButtonIOS={e => {
              console.log({e});
              return (
                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(false)}
                  style={{
                    width: '100%',
                    backgroundColor: theme.cardBackColor,
                    borderRadius: 10,
                    paddingVertical: 15,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      color: theme.textColor,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={{marginTop: 10}}>
        <View>
          {scheduleList.CompaignNetworks.map((item, index) => (
            <View
              key={index}
              style={{
                backgroundColor: theme.cardBackColor,
                width: '100%',
                paddingVertical: 8,
                paddingHorizontal: 5,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                borderRadius: 6,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: theme.textColor,
                }}>
                {item.desc} : {item.purchasedQouta - item.usedQuota} /{' '}
                {scheduleMessageCount}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: theme.textColor,
                }}>
                Budget:{' '}
                {(scheduleMessageCount * item.unitPriceInclTax).toFixed(2)}{' '}
                {lovs['orgs'][0].currencyName}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 10,
        }}>
        <RNSButton
          style={{width: '46%'}}
          bgColor={theme.buttonBackColor}
          caption={isUpdate ? 'Cancel' : 'Back'}
          onPress={() => {
            if (isUpdate) {
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
                intervalTypeId: 1,
                randomId: Math.floor(100000 + Math.random() * 900000),
              });
              setIsUpdate(false);
            } else {
              setIndex(1);
            }
          }}
        />
        <RNSButton
          style={{width: '46%'}}
          bgColor={theme.buttonBackColor}
          caption={isUpdate ? 'Update' : '+ Schedule'}
          onPress={isUpdate ? updateSchedule : addSchedule}
        />
      </View>
    </View>
  );
};

export default AddSchedule;

const styles = StyleSheet.create({});

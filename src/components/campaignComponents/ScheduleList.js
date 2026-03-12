import moment from 'moment';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import { useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { useUser } from '../../hooks/useUser';

const ScheduleList = ({
  campaignInfo,
  setScheduleTab,
  setCampaignInfo,
  setScheduleList,
  setIsUpdate,
  totalToPay,
}) => {
  const theme = useTheme();
  const { user } = useUser();
  const lovs = useSelector(state => state.lovs).lovs;

  // After
  const [activeSwipeId, setActiveSwipeId] = React.useState(null);

  const getIntervalName = id => {
    const intervals = lovs['lovs'].intervals;
    return intervals.filter(interval => interval.id == id + 1)[0].name;
  };
  const currencyId = lovs['orgs']?.find(c => c.id === user?.orgId)?.currencyId;
  return (
    <View style={{ marginTop: 5 }}>
      <ScrollView
        contentContainerStyle={{ rowGap: 10 }}
        style={{ maxHeight: 500 }}
      >
        {campaignInfo.schedules.map((schedule, index) => (
          <GestureRecognizer
            key={index}
            // config={{velocityThreshold: 0.3, directionalOffsetThreshold: 80}}
            onSwipeRight={() => setActiveSwipeId(null)}
            onSwipeLeft={() => setActiveSwipeId(schedule.randomId)}
          >
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: theme.cardBackColor,
                borderRadius: 6,
              }}
            >
              <View style={{ width: '48%', rowGap: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: theme.textColor }}>Interval Type</Text>
                  <Text style={{ color: theme.textColor }}>
                    {getIntervalName(schedule.intervalTypeId)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: theme.textColor }}>Start Date</Text>
                  <Text style={{ color: theme.textColor }}>
                    {moment(schedule.startTime || schedule.StartTime).format(
                      'DD-MM-YYYY',
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: theme.textColor }}>Start Time</Text>
                  <Text style={{ color: theme.textColor }}>
                    {moment(schedule.startTime || schedule.StartTime).format(
                      'HH:mm',
                    )}
                  </Text>
                </View>
              </View>
              <View style={{ width: '48%', rowGap: 5 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: theme.textColor }}>Networks</Text>
                  <Text
                    style={{
                      color: theme.textColor,
                      position: 'absolute',
                      left: 65,
                      width: 20,
                      height: 20,
                      textAlign: 'center',
                      borderRadius: 50,
                      backgroundColor: theme.buttonBackColor,
                    }}
                  >
                    {schedule?.CompaignNetworks?.length}
                  </Text>

                  <Text style={{ color: theme.textColor }}>
                    {schedule?.budget?.toFixed(2) || '0.00'}{' '}
                    {lovs['lovs']?.currencies?.find(c => c.id === currencyId)
                      ?.code || ''}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: theme.textColor }}>Finish Date</Text>

                  <Text style={{ color: theme.textColor }}>
                    {moment(schedule.finishTime || schedule.FinishTime).format(
                      'DD-MM-YYYY',
                    )}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={{ color: theme.textColor }}>Finish Time</Text>
                  <Text style={{ color: theme.textColor }}>
                    {moment(schedule.finishTime || schedule.FinishTime).format(
                      'HH:mm',
                    )}
                  </Text>
                </View>
              </View>
              {activeSwipeId === schedule.randomId && (
                <View
                  style={{
                    position: 'absolute',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    backgroundColor: theme.inputBackColor,
                    alignItems: 'center',
                    alignSelf: 'flex-end',
                    width: Dimensions.get('screen').width - 20,
                    opacity: 0.7,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setActiveSwipeId(null)}
                    style={{
                      backgroundColor: theme.buttonBackColor,
                      paddingHorizontal: 30,
                      paddingVertical: 2,
                      height: 30,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: theme.textColor }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setScheduleList({
                        CompaignNetworks: schedule.CompaignNetworks,
                        id: schedule.id,
                        budget: schedule.budget,
                        rowVer: schedule.rowVer,
                        messageCount: schedule.messageCount,
                        orgId: schedule.orgId,
                        days: schedule.days,
                        networkId: schedule.networkId,
                        albums: schedule.albums,
                        compaignDetailId: schedule.compaignDetailId,
                        isFixedTime: schedule.isFixedTime,
                        startTime: schedule.startTime,
                        finishTime: schedule.finishTime,
                        interval: schedule.interval,
                        status: schedule.status,
                        intervalTypeId: schedule.intervalTypeId,
                        randomId: schedule.randomId,
                      });
                      setIsUpdate(true);
                      setScheduleTab(0);
                    }}
                    style={{
                      backgroundColor: theme.buttonBackColor,
                      paddingHorizontal: 30,
                      paddingVertical: 2,
                      height: 30,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: theme.textColor }}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setCampaignInfo({
                        ...campaignInfo,
                        schedules: campaignInfo.schedules.filter(
                          (s, i) => s.randomId !== schedule.randomId,
                        ),
                      });
                      setIsUpdate(false);
                      setScheduleTab(0);
                    }}
                    style={{
                      backgroundColor: theme.buttonBackColor,
                      paddingHorizontal: 30,
                      paddingVertical: 2,
                      height: 30,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: theme.textColor }}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </GestureRecognizer>
        ))}
      </ScrollView>
      <View
        style={{
          backgroundColor: theme.cardBackColor,
          borderRadius: 6,
          marginTop: 10,
          columnGap: 10,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text
            style={{ color: theme.textColor, fontSize: 18, fontWeight: '600' }}
          >
            Campaign Messages
          </Text>
          <Text
            style={{ color: theme.textColor, fontSize: 18, fontWeight: '600' }}
          >
            {campaignInfo.schedules
              .map((s, i) => s.messageCount)
              .reduce((a, b) => a + b, 0)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Text
            style={{ color: theme.textColor, fontSize: 18, fontWeight: '600' }}
          >
            Campaign Budget
          </Text>
          <Text
            style={{ color: theme.textColor, fontSize: 18, fontWeight: '600' }}
          >
            {campaignInfo?.schedules
              .map((s, i) => s?.budget || 0)
              .reduce((a, b) => a + b, 0)
              .toFixed(2)}{' '}
            {lovs['lovs']?.currencies?.find(c => c.id === currencyId)?.code ||
              ''}
          </Text>
        </View>
        {totalToPay > 0 ? (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Text
              style={{
                color: theme.textColor,
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              To Pay
            </Text>
            <Text
              style={{
                color: theme.textColor,
                fontSize: 18,
                fontWeight: '600',
              }}
            >
              {totalToPay.toFixed(2)}{' '}
              {lovs['lovs']?.currencies?.find(c => c.id === currencyId)?.code ||
                ''}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default ScheduleList;

import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {useTheme} from '../../hooks/useTheme';
import moment from 'moment';
import {useSelector} from 'react-redux';
import GestureRecognizer from 'react-native-swipe-gestures';
import RNSButton from '../Button';
import {useUser} from '../../hooks/useUser';

const ScheduleList = ({
  campaignInfo,
  setScheduleTab,
  setCampaignInfo,
  setScheduleList,
  setIsUpdate,
}) => {
  const theme = useTheme();
  const lovs = useSelector(state => state.lovs).lovs;
  const {user} = useUser();

  const [showEditDelBtns, setShowEditDelBtns] = React.useState(false);

  const getIntervalName = id => {
    console.log(campaignInfo.schedules);
    const intervals = lovs['bmtlovs'].intervals;
    // console.log(intervals);
    return intervals.filter(interval => interval.id == id + 1)[0].name;
  };

  return (
    <View style={{marginTop: 5}}>
      <ScrollView contentContainerStyle={{rowGap: 10}}>
        {campaignInfo.schedules.map((schedule, index) => (
          <GestureRecognizer
            key={index}
            // config={{velocityThreshold: 0.3, directionalOffsetThreshold: 80}}
            onSwipeRight={() => setShowEditDelBtns(false)}
            onSwipeLeft={() => setShowEditDelBtns(true)}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignContent: 'center',
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: theme.cardBackColor,
                borderRadius: 6,
              }}>
              <View style={{width: '48%', rowGap: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: theme.textColor}}>Interval Type</Text>
                  <Text style={{color: theme.textColor}}>
                    {getIntervalName(schedule.intervalTypeId)}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: theme.textColor}}>Start Date</Text>
                  <Text style={{color: theme.textColor}}>
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
                  }}>
                  <Text style={{color: theme.textColor}}>Start Time</Text>
                  <Text style={{color: theme.textColor}}>
                    {moment(schedule.startTime || schedule.StartTime).format(
                      'HH:mm',
                    )}
                  </Text>
                </View>
              </View>
              <View style={{width: '48%', rowGap: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: theme.textColor}}>Networks</Text>
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
                    }}>
                    {schedule.CompaignNetworks.length}
                  </Text>

                  <Text style={{color: theme.textColor}}>
                    {schedule.budget.toFixed(2)} {lovs['orgs'][0].currencyName}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: theme.textColor}}>Finish Date</Text>

                  <Text style={{color: theme.textColor}}>
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
                  }}>
                  <Text style={{color: theme.textColor}}>Finish Time</Text>
                  <Text style={{color: theme.textColor}}>
                    {moment(schedule.finishTime || schedule.FinishTime).format(
                      'HH:mm',
                    )}
                  </Text>
                </View>
              </View>
              {showEditDelBtns && (
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
                  }}>
                  <TouchableOpacity
                    onPress={() => setShowEditDelBtns(false)}
                    style={{
                      backgroundColor: theme.buttonBackColor,
                      paddingHorizontal: 30,
                      paddingVertical: 2,
                      height: 30,
                      borderRadius: 6,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: theme.textColor}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      console.log({schedule});
                      setScheduleList({
                        CompaignNetworks: schedule.CompaignNetworks,
                        id: schedule.id,
                        budget: schedule.budget,
                        rowVer: schedule.rowVer,
                        messageCount: schedule.messageCount,
                        orgId: schedule.orgId,
                        days: schedule.days,
                        networkId: schedule.networkId,
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
                    }}>
                    <Text style={{color: theme.textColor}}>Update</Text>
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
                    }}>
                    <Text style={{color: theme.textColor}}>Delete</Text>
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
        }}>
        <Text style={{color: theme.textColor, fontSize: 18, fontWeight: '600'}}>
          Campaign Messages: {'      '}
          {campaignInfo.schedules
            .map((s, i) => s.messageCount)
            .reduce((a, b) => a + b, 0)}
        </Text>
        <Text style={{color: theme.textColor, fontSize: 18, fontWeight: '600'}}>
          Campaign Budget: {'            '}
          {campaignInfo.schedules
            .map((s, i) => s.budget)
            .reduce((a, b) => a + b, 0)
            .toFixed(2)}{' '}
          {lovs['orgs'][0].currencyName}
        </Text>
      </View>
    </View>
  );
};

export default ScheduleList;

const styles = StyleSheet.create({});

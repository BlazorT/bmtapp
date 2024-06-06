import moment from 'moment';
import React, {Fragment, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSelector} from 'react-redux';
import {useTheme} from '../hooks/useTheme';
import {colors} from '../styles';
import {dateFormatter} from '../helper/dateFormatter';
const EMAIL = require('../../assets/images/Email.png');
const INSTAGRAM = require('../../assets/images/instagram.png');
const LINKEDIN = require('../../assets/images/linkedin.png');
const SNAPCHAT = require('../../assets/images/snapchat.png');
const TIKTOK = require('../../assets/images/tiktok.png');
const WHATSAPP = require('../../assets/images/Whatsapp.png');
const TWITTER = require('../../assets/images/Twitter.png');
const SMS = require('../../assets/images/SMS.png');
const FACEBOOK = require('../../assets/images/Facebook.png');
export default function MycampaignScheduleList(props) {
  const theme = useTheme();
  const lovs = useSelector(state => state.lovs).lovs;
  const [networkIcon, setNetworkIcon] = useState(EMAIL);
  const [orgCurrencyName, setOrgCurrencyName] = useState('');
  useEffect(() => {
    const orgsData = lovs['orgs'][0];
    console.log({orgsData});
    setOrgCurrencyName(orgsData.currencyName);

    //console.log('network my data ' + JSON.stringify(props.compaignQouta));
    //console.log('network my data ' + JSON.stringify(props.networkName));
    if (props.networkId == 1) {
      setNetworkIcon(SMS);
    }
    if (props.networkId == 2) {
      setNetworkIcon(WHATSAPP);
    }
    if (props.networkId == 3) {
      setNetworkIcon(EMAIL);
    }
    if (props.networkId == 4) {
      setNetworkIcon(TWITTER);
    }
    if (props.networkId == 5) {
      setNetworkIcon(FACEBOOK);
    }
    if (props.networkId == 6) {
      setNetworkIcon(INSTAGRAM);
    }
    if (props.networkId == 7) {
      setNetworkIcon(LINKEDIN);
    }
    if (props.networkId == 8) {
      setNetworkIcon(TIKTOK);
    }
    if (props.networkId == 9) {
      setNetworkIcon(SNAPCHAT);
    }
  }, []);

  const calculateDays = dayNumberString => {
    console.log({dayNumberString});
    const dayMap = {
      1: 'Sun',
      2: 'Mon',
      3: 'Tue',
      4: 'Wed',
      5: 'Thu',
      6: 'Fri',
      7: 'Sat',
    };

    const dayNumbers = dayNumberString.split(',').map(Number);
    const dayNames = dayNumbers.map(dayNumber => dayMap[dayNumber]);

    return dayNames.join(', ');
  };
  return (
    <Fragment>
      <View
        style={[styles.ModalMainView, {backgroundColor: theme.cardBackColor}]}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 5,
            paddingVertical: 5,
            borderRadius: 3,
          }}>
          <View>
            <Image
              resizeMode="contain"
              source={networkIcon}
              style={styles.socialMediaIcon}
            />
          </View>
          <View style={{flex: 1, marginLeft: 5, rowGap: 1}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={[
                  styles.IntervalTitleStyle,
                  {
                    color: theme.textColor,
                    textAlign: 'left',
                  },
                ]}>
                {'Interval Type: ' + props.intervaltypename}
              </Text>
              {props.days.length <= 10 && (
                <Text
                  style={[
                    styles.DaysStyle,
                    {
                      color: theme.textColor,
                      textAlign: 'left',
                    },
                  ]}>
                  {'Days: ' + calculateDays(props.days)}
                </Text>
              )}
            </View>
            {props.days.length > 10 && (
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}>
                <Text
                  style={[
                    styles.DaysStyle,
                    {color: theme.textColor, textAlign: 'justify'},
                  ]}>
                  {'Days: ' + calculateDays(props.days)}
                </Text>
              </View>
            )}
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={[styles.BudgetStyle, {color: theme.textColor}]}>
                {'Message Count: ' + props.messageCount}
              </Text>
              <Text style={[styles.TitleStyle, {color: theme.textColor}]}>
                {'Budget: ' + props.budget + ' ' + orgCurrencyName}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={styles.Itemdetail}>
                <Text style={[styles.StartTime, {color: theme.textColor}]}>
                  {dateFormatter(props.startTime)}
                </Text>
              </View>
              <View style={styles.ItemdetailMiddle}>
                <Text style={[styles.StartTime, {color: theme.textColor}]}>
                  {'~'}
                </Text>
              </View>
              <View style={styles.ItemFinishdetail}>
                <Text style={[styles.FinishTime, {color: theme.textColor}]}>
                  {dateFormatter(props.finishTime)}
                </Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}
const styles = StyleSheet.create({
  SettingIconView: {
    width: 12 + '%',
    alignItems: 'center',
  },
  SettingIcon: {
    fontSize: 25,
    color: 'black',
  },
  ModalMainView: {
    marginHorizontal: 10,
    paddingTop: 3,
    marginTop: 3 + '%',
    marginLeft: 2 + '%',
    marginRight: 2 + '%',
    width: 96 + '%',
    zIndex: 1,
    borderRadius: 6,
    backgroundColor: colors.PagePanelTab,
  },

  socialMediaIcon: {
    height: 55,
    width: 55,
  },
  IconText: {
    color: 'white',
    fontSize: 16,
  },
  TitleStyle: {
    fontSize: 14,
  },
  IntervalTitleStyle: {
    fontSize: 14,
  },
  DaysStyle: {
    fontSize: 14,
  },
  BudgetStyle: {
    fontSize: 14,
  },
  ActionButtonView: {
    width: 35 + '%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  NetworkCountView: {
    marginTop: 1,
    marginRight: 12,
    paddingTop: 6,
    backgroundColor: '#1da1f2',
    width: 29,
    height: 29,
    color: 'white',
    fontSize: 12,
    borderRadius: 50,
    textAlign: 'center',
  },
  ItemDetailViewsecond: {
    marginLeft: 1 + '%',
    flexDirection: 'row',
    marginTop: 1.5 + '%',
    width: 100 + '%',
    marginBottom: 3 + '%',
  },
  Itemdetail: {
    flexDirection: 'row',
  },
  ItemFinishdetail: {
    flexDirection: 'row',
  },
  ItemdetailMiddle: {
    flexDirection: 'row',
  },
  StartTime: {
    fontSize: 14,
  },
  FinishTime: {
    fontSize: 14,
  },
});

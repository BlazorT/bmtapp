import React, {Fragment, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../styles';
const deleteicon = require('../../assets/images/deleteicon.png');
const playicon = require('../../assets/images/playicon.png');
const EMAIL = require('../../assets/images/Email.png');
const INSTAGRAM = require('../../assets/images/instagram.png');
const LINKEDIN = require('../../assets/images/linkedin.png');
const SNAPCHAT = require('../../assets/images/snapchat.png');
const TIKTOK = require('../../assets/images/tiktok.png');
const WHATSAPP = require('../../assets/images/Whatsapp.png');
const TWITTER = require('../../assets/images/Twitter.png');
const SMS = require('../../assets/images/SMS.png');
const FACEBOOK = require('../../assets/images/Facebook.png');
const pauseicon = require('../../assets/images/pauseicon.png');
//import NumericInput from 'react-native-numeric-input'
//import CustomeAlert from './Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import { RNVoiceRecorder } from 'react-native-voice-recorder'
import moment from 'moment';
//const iconwave = require('../../assets/images/pages/wave.png');
export default function MycampaignScheduleList(props) {
  const [networkIcon, setNetworkIcon] = useState('');
  const [orgCurrencyName, setOrgCurrencyName] = useState('');
  const [orgCurrencyId, setOrgCurrencyId] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('OrgInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      console.log(
        'LoadOrgData LoadOrgData Asyncdata  ',
        JSON.stringify(Asyncdata),
      );
      var CurrencyIdDetail = Asyncdata.find(item => item.id === 1);
      console.log(
        'currencyId currencyId currencyId ',
        JSON.stringify(CurrencyIdDetail),
      );
      console.log(
        'currencyId currencyId currencyId ',
        JSON.stringify(CurrencyIdDetail.currencyId),
      );
      setOrgCurrencyId(CurrencyIdDetail.currencyId);
      setOrgCurrencyName(CurrencyIdDetail.currencyName);
    });
    console.log('network my data ' + JSON.stringify(props));
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
    //var NetworkDetail = data.data;
    //console.log('NetworkDetail NetworkDetail ' + JSON.stringify(NetworkDetail));
    //console.log('NetworkDetail .NetworkDetail is set ' + JSON.stringify(NetworkDetail[0].id));
  }, []);
  const [sidebarshowhide, setsidebarshowhide] = useState(false);
  const [modalVisibleButton, setModalVisibleButton] = useState(true);
  function ButtonShow() {
    var value = AsyncStorage.getItem('LoginInformation');
    value.then(data => {
      let Asyncdata = JSON.parse(data);
    });
    //  console.log('Asyncdata click ');
  }
  function sidebarshowhidefunction() {
    // console.log('sidebarshowhidefunction click ' + JSON.stringify(props));
    // if(sidebarshowhide == true)
    // {
    //      setsidebarshowhide(false)
    //  }
    //  if(sidebarshowhide == false)
    // {
    //    setsidebarshowhide(true)
    // }
    props.ActionButtonClick();
  }
  return (
    <Fragment>
      <View style={styles.ModalMainView}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              width: 18 + '%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              resizeMode="contain"
              source={networkIcon}
              style={styles.socialMediaIcon}
            />
          </View>
          <View style={{width: 80 + '%', marginLeft: 3, paddingTop: 1}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={styles.IntervalTitleStyle}>
                {'Interval Type: ' + props.intervaltypename}
              </Text>
              <Text style={styles.DaysStyle}>{'  Days: ' + props.days}</Text>
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={styles.BudgetStyle}>
                {'Message Count: ' + props.messageCount}
              </Text>
              <Text style={styles.TitleStyle}>
                {'Budget: ' + props.budget + ' ' + orgCurrencyName}
              </Text>
            </View>
            <View style={styles.ItemDetailViewsecond}>
              <View style={styles.Itemdetail}>
                <Text style={styles.StartTime}>
                  {moment(props.startTime).format('MM-DD-YY hh:mm a')}
                </Text>
              </View>
              <View style={styles.ItemdetailMiddle}>
                <Text style={styles.StartTime}>{'~'}</Text>
              </View>
              <View style={styles.ItemFinishdetail}>
                <Text style={styles.FinishTime}>
                  {moment(props.finishTime).format('MM-DD-YY hh:mm a')}
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
    //backgroundColor:'green',
    width: 12 + '%',
    alignItems: 'center',
    // position: 'absolute',
    // bottom:0,
    //zIndex:545,
    // right:-7,
    //top:-5,
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
    // backgroundColor: colors.red,
  },

  socialMediaIcon: {
    height: 60,
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor:'red'
    //tintColor:'#1da1f2',
  },
  IconText: {
    color: 'white',
    fontSize: 16,
    // fontWeight: "bold",
  },
  TitleStyle: {
    marginRight: 2 + '%',
    paddingTop: 3,
    fontSize: 14,
    color: 'black',
    width: 48 + '%',
    //backgroundColor:'blue'
  },
  IntervalTitleStyle: {
    marginRight: 2 + '%',
    paddingTop: 3,
    fontSize: 14,
    color: 'black',
    width: 52 + '%',
    //backgroundColor:'blue'
  },
  DaysStyle: {
    marginRight: 2 + '%',
    paddingTop: 3,
    fontSize: 14,
    color: 'black',
    width: 48 + '%',
    //backgroundColor:'red'
  },
  BudgetStyle: {
    marginRight: 2 + '%',
    paddingTop: 3,
    fontSize: 14,
    color: 'black',
    width: 54 + '%',
    //backgroundColor:'gray'
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
    // marginLeft: 12,
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
    width: 47 + '%',
    //width: Dimensions.get('window').width,
  },
  ItemFinishdetail: {
    flexDirection: 'row',
    width: 48 + '%',
    //backgroundColor:'orange'
    //width: Dimensions.get('window').width,
  },
  ItemdetailMiddle: {
    flexDirection: 'row',
    width: 5 + '%',
    //backgroundColor:'red'
  },
  StartTime: {
    //marginLeft: 10,
    fontSize: 14,
    color: colors.TextColorOther,
  },
  FinishTime: {
    marginLeft: 6,
    fontSize: 14,
    color: colors.TextColorOther,
  },
});

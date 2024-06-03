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
import Icons from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../hooks/useTheme';
//import { RNVoiceRecorder } from 'react-native-voice-recorder'
//const iconwave = require('../../assets/images/pages/wave.png');
export default function Myvehicle(props) {
  const theme = useTheme();
  const [networkIcon, setNetworkIcon] = useState('');
  useEffect(() => {
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
  }, []);
  const [sidebarshowhide, setsidebarshowhide] = useState(false);
  const [modalVisibleButton, setModalVisibleButton] = useState(true);
  function ButtonShow() {
    var value = AsyncStorage.getItem('LoginInformation');
    value.then(data => {
      let Asyncdata = JSON.parse(data);
    });
  }
  function sidebarshowhidefunction() {
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
      <View style={[styles.ModalMainView]}>
        <View
          style={{
            backgroundColor: theme.cardBackColor,
            paddingVertical: 12,
            paddingHorizontal: 12,
            borderRadius: 8,
          }}>
          <View style={{flexDirection: 'row'}}>
            <Image
              resizeMode="contain"
              source={networkIcon}
              style={styles.socialMediaIcon}
            />
            <Text
              style={{
                color: theme.textColor,
                fontSize: 14,
                marginTop: 3,
                width: 9 + '%',
              }}></Text>
            <Text
              style={{
                color: theme.textColor,
                fontSize: 16,
                marginTop: 3,
                width: 25 + '%',
              }}>
              {props.compaignQouta != null || props.compaignQouta != ''
                ? '0'
                : props.compaignQouta}
            </Text>
            <Text
              style={{
                color: theme.textColor,
                fontSize: 16,
                marginTop: 3,
                width: 25 + '%',
              }}>
              {props.freeQouta != null || props.freeQouta != ''
                ? ''
                : props.freeQouta}
              {props.freeQouta}
            </Text>
            <Text
              style={{
                color: theme.textColor,
                fontSize: 16,
                marginTop: 3,
                width: 21 + '%',
              }}>
              {props.compaignQouta != null || props.compaignQouta != ''
                ? '0'
                : props.compaignQouta - props.freeQouta}
            </Text>
            <TouchableOpacity
              style={styles.SettingIconView}
              onPress={() => sidebarshowhidefunction()}>
              <Icons
                style={[styles.SettingIcon, {color: theme.tintColor}]}
                name="setting"
              />
            </TouchableOpacity>
          </View>
        </View>
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
    paddingTop: 9,
    zIndex: 1,
    //height: Dimensions.get('window').height,
    //backgroundColor:'red',
  },
  sidebarViewRightupsideview: {
    width: 90,
    borderRadius: 10,
    position: 'absolute',
    right: 1,
    top: 49,
    // backgroundColor: 'green',
    zIndex: 4343,
  },
  sidebarViewRight: {
    //zIndex:434,
    //marginTop:122,
    //backgroundColor: '#222222',
    //backgroundColor: 'green',
    //borderRadius:10,
    // alignItems: 'center',
    //opacity: 0.7,
    // width: 90,
    //zIndex:23,
    //position: 'absolute',
    //right: 1,
  },
  SidebarIconView: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    //justifyContent: 'space-around',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    width: 90,
    //height:55,
  },
  ribbonIcon: {
    height: 28,
    width: 28,
    //tintColor:'#1da1f2',
    marginTop: 3,
  },
  socialMediaIcon: {
    height: 29,
    width: 29,
    //tintColor:'#1da1f2',
  },
  IconText: {
    color: 'white',
    fontSize: 16,
    // fontWeight: "bold",
  },
});

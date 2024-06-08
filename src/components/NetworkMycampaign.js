import React, {Fragment, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icons from 'react-native-vector-icons/AntDesign';
import EMAIL from '../../assets/images/Email.png';
import FACEBOOK from '../../assets/images/Facebook.png';
import SMS from '../../assets/images/SMS.png';
import TWITTER from '../../assets/images/Twitter.png';
import WHATSAPP from '../../assets/images/Whatsapp.png';
import INSTAGRAM from '../../assets/images/instagram.png';
import LINKEDIN from '../../assets/images/linkedin.png';
import SNAPCHAT from '../../assets/images/snapchat.png';
import TIKTOK from '../../assets/images/tiktok.png';
import {useTheme} from '../hooks/useTheme';
export default function Myvehicle(props) {
  const theme = useTheme();
  const [networkIcon, setNetworkIcon] = useState(SMS);
  useEffect(() => {
    console.log(props.item);
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
  function sidebarshowhidefunction() {
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
    width: 12 + '%',
    alignItems: 'center',
  },
  SettingIcon: {
    fontSize: 25,
    color: 'black',
  },
  ModalMainView: {
    marginHorizontal: 10,
    paddingTop: 9,
    zIndex: 1,
  },
  sidebarViewRightupsideview: {
    width: 90,
    borderRadius: 10,
    position: 'absolute',
    right: 1,
    top: 49,
    zIndex: 4343,
  },
  sidebarViewRight: {},
  SidebarIconView: {
    marginVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    width: 90,
  },
  ribbonIcon: {
    height: 28,
    width: 28,
    marginTop: 3,
  },
  socialMediaIcon: {
    height: 29,
    width: 29,
  },
  IconText: {
    color: 'white',
    fontSize: 16,
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import React, {Fragment, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, fonts} from '../styles';
const checkedCheckbox = require('../../assets/images/checkboxchecked.png');
const uncheckedCheckbox = require('../../assets/images/checkboxunchecked.png');
const EmailIcon = require('../../assets/images/Email.png');
const instagramIcon = require('../../assets/images/instagram.png');
const linkedinIcon = require('../../assets/images/linkedin.png');
const snapchatIcon = require('../../assets/images/snapchat.png');
const tiktokIcon = require('../../assets/images/tiktok.png');
const WhatsappIcon = require('../../assets/images/Whatsapp.png');
const TwitterIcon = require('../../assets/images/Twitter.png');
const SMSIcon = require('../../assets/images/SMS.png');
const FacebookIcon = require('../../assets/images/Facebook.png');
export default function NetworksView(props) {
  console.log('Network View  props ', JSON.stringify(props));
  const [selectSocialMediaNetwork, setSelectSocialMediaNetwork] = useState(
    false,
  );
  const [selectNetworkId, setSelectNetworkId] = useState('');
  const [socialmediaIcon, setSocialmediaIcon] = useState();
  useEffect(() => {
    //console.log('props all ' + JSON.stringify(props));
    if (props.networkData.length <= 1) {
      console.log('filteredArray empty 28');
    } else {
      const filteredArray = props.networkData.filter(
        item => item.networkId == props.networkId,
      );
      //console.log('filteredArray ' + JSON.stringify(filteredArray.length));
      if (filteredArray.length <= 0) {
        console.log('filteredArray empty ', filteredArray.length);
        setSelectSocialMediaNetwork(false);
      } else {
        console.log(
          'filteredArray ' + JSON.stringify(filteredArray[0].networkId),
        );
        setSelectNetworkId(filteredArray[0].networkId);
        setSelectSocialMediaNetwork(true);
      }
    }
    //console.log('props all id ' + JSON.stringify(props.id));
    // console.log('selectSocialMediaNetwork ' + selectSocialMediaNetwork);
    if (props.networkId == 1) {
      setSocialmediaIcon(SMSIcon);
    } else if (props.networkId == 2) {
      setSocialmediaIcon(WhatsappIcon);
    } else if (props.networkId == 3) {
      setSocialmediaIcon(EmailIcon);
    } else if (props.networkId == 4) {
      setSocialmediaIcon(TwitterIcon);
    } else if (props.networkId == 5) {
      setSocialmediaIcon(FacebookIcon);
    } else if (props.networkId == 6) {
      setSocialmediaIcon(instagramIcon);
    } else if (props.networkId == 7) {
      setSocialmediaIcon(linkedinIcon);
    } else if (props.networkId == 8) {
      setSocialmediaIcon(tiktokIcon);
    } else if (props.networkId == 9) {
      setSocialmediaIcon(snapchatIcon);
    }
  }, []);
  function NetworkSelect(props) {
    console.log('selectNetworkId selectNetworkId selectNetworkId props', props);
    console.log(
      'selectNetworkId selectNetworkId selectNetworkId selectNetworkId',
      selectNetworkId,
    );
    console.log(
      'selectNetworkId selectNetworkId selectNetworkId props.id',
      props.id,
    );
    // console.log('selectSocialMediaNetwork ', selectSocialMediaNetwork)
    //console.log('props.id ', props)
    AsyncStorage.getItem('LoginInformation').then(function(res) {
      let Asyncdata = JSON.parse(res);
      global.NextSchedule = 0;
      if (selectNetworkId.length >= 0) {
        console.log('NetworkSelect if case ');
        if (selectSocialMediaNetwork == true) {
          console.log('ActionNetworkDataRemoveClick ');
          setSelectSocialMediaNetwork(false);
          var currentdate = new Date();
          var SelectProps = {
            networkId: props.networkId,
            orgId: Number(props.orgId),
            rowVer: 0,
            purchasedQouta: props.purchasedQouta,
            unitPriceInclTax: props.unitPriceInclTax,
            usedQuota: props.usedQuota,
            compaignId: 0,
            id: 0,
            desc: props.networkDesc,
            status: 1,
            createdBy: Number(Asyncdata[0].id),
            lastUpdatedBy: Number(Asyncdata[0].id),
            createdAt: moment.utc(currentdate).format(),
            lastUpdatedAt: moment.utc(currentdate).format(),
          };
          props.ActionNetworkDataRemoveClick(SelectProps);
        }
        if (selectSocialMediaNetwork == false) {
          console.log('ActionNetworkDataClick ');
          var SelectProps = {
            networkId: props.networkId,
            orgId: Number(props.orgId),
            rowVer: 0,
            purchasedQouta: props.purchasedQouta,
            unitPriceInclTax: props.unitPriceInclTax,
            usedQuota: props.usedQuota,
            compaignId: 0,
            id: 0,
            desc: props.networkDesc,
            status: 1,
            createdBy: Number(Asyncdata[0].id),
            lastUpdatedBy: Number(Asyncdata[0].id),
            createdAt: moment.utc(currentdate).format(),
            lastUpdatedAt: moment.utc(currentdate).format(),
          };
          setSelectSocialMediaNetwork(true);
          props.ActionNetworkDataClick(SelectProps);
        }
      } else if (
        selectNetworkId.length >= 1 ||
        selectNetworkId == props.networkId
      ) {
        console.log('NetworkSelect else case ');
        if (selectSocialMediaNetwork == true) {
          console.log('ActionNetworkDataRemoveClick ');
          setSelectSocialMediaNetwork(false);
          var currentdate = new Date();
          var SelectProps = {
            networkId: props.networkId,
            orgId: Number(Asyncdata[0].orgid),
            rowVer: 0,
            purchasedQouta: props.purchasedQouta,
            unitPriceInclTax: props.unitPriceInclTax,
            usedQuota: props.usedQuota,
            compaignId: 0,
            id: 0,
            desc: props.networkDesc,
            status: 1,
            createdBy: Number(Asyncdata[0].id),
            lastUpdatedBy: Number(Asyncdata[0].id),
            createdAt: moment.utc(currentdate).format(),
            lastUpdatedAt: moment.utc(currentdate).format(),
          };
          props.ActionNetworkDataRemoveClick(SelectProps);
        }
        if (selectSocialMediaNetwork == false) {
          console.log('ActionNetworkDataClick ');
          var SelectProps = {
            networkId: props.networkId,
            orgId: Number(Asyncdata[0].orgid),
            rowVer: 0,
            purchasedQouta: props.purchasedQouta,
            unitPriceInclTax: props.unitPriceInclTax,
            usedQuota: props.usedQuota,
            compaignId: 0,
            id: 0,
            desc: props.networkDesc,
            status: 1,
            createdBy: Number(Asyncdata[0].id),
            lastUpdatedBy: Number(Asyncdata[0].id),
            createdAt: moment.utc(currentdate).format(),
            lastUpdatedAt: moment.utc(currentdate).format(),
          };
          setSelectSocialMediaNetwork(true);
          props.ActionNetworkDataClick(SelectProps);
        }
      }
    });
  }
  return (
    <Fragment>
      <View style={{width: Dimensions.get('window').width}}>
        <TouchableOpacity
          onPress={() => NetworkSelect(props)}
          style={styles.btnGetStarted}
        >
          <View style={{width: 20 + '%'}}>
            <Image
              resizeMode="contain"
              source={socialmediaIcon}
              style={styles.itemImage}
            />
          </View>
          <View style={{width: 65 + '%'}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.itemText}>{props.networkName}</Text>
              <Text style={styles.itemText}> ({props.purchasedQouta})</Text>
            </View>
            <Text style={styles.itemTextDetail}>
              {props.networkDesc == '' || props.networkDesc == null
                ? props.networkName
                : props.networkDesc}
            </Text>
          </View>
          {selectNetworkId == props.id ? (
            <View
              style={{
                width: 14 + '%',
                paddingTop: 17,
                paddingLeft: 5,
                zIndex: 902,
              }}
            >
              {selectSocialMediaNetwork == true ? (
                <Image
                  resizeMode="contain"
                  source={checkedCheckbox}
                  style={styles.checkboxChecked_Unchecked}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  source={uncheckedCheckbox}
                  style={styles.checkboxChecked_Unchecked}
                />
              )}
            </View>
          ) : (
            <View
              style={{
                width: 14 + '%',
                paddingTop: 17,
                paddingLeft: 5,
                zIndex: 902,
              }}
            >
              {selectSocialMediaNetwork == false ? (
                <Image
                  resizeMode="contain"
                  source={uncheckedCheckbox}
                  style={styles.checkboxChecked_Unchecked}
                />
              ) : (
                <Image
                  resizeMode="contain"
                  source={checkedCheckbox}
                  style={styles.checkboxChecked_Unchecked}
                />
              )}
            </View>
          )}
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}
const styles = StyleSheet.create({
  checkboxChecked_Unchecked: {
    // paddingRight:7,
    // paddingLeft:13,
    height: 37,
    width: 37,
  },
  btnGetStarted: {
    flexDirection: 'row',
    backgroundColor: colors.PanelTabList,
    //backgroundColor:colors.red,
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    fontSize: 25,
    marginTop: 10,
    marginBottom: 2,
    borderRadius: 6,
  },
  itemImage: {
    height: 45,
    width: 45,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 12,
  },
  itemText: {
    color: colors.TextColorOther,
    fontFamily: fonts.primary,
    marginTop: 11,
    fontSize: 19,
    fontWeight: 'bold',
  },
  itemTextDetail: {
    color: colors.TextColorOther,
    fontFamily: fonts.primary,
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    paddingRight: 5,
  },
});

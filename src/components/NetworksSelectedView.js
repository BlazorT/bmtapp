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
import {useTheme} from '../hooks/useTheme';
const checkedCheckbox = require('../../assets/images/checkboxchecked.png');
const uncheckedCheckbox = require('../../assets/images/checkboxunchecked.png');
const EMAIL = require('../../assets/images/Email.png');
const INSTAGRAM = require('../../assets/images/instagram.png');
const LINKEDIN = require('../../assets/images/linkedin.png');
const SNAPCHAT = require('../../assets/images/snapchat.png');
const TIKTOCK = require('../../assets/images/tiktok.png');
const WHATSAPP = require('../../assets/images/Whatsapp.png');
const TWITTER = require('../../assets/images/Twitter.png');
const SMS = require('../../assets/images/SMS.png');
const FACEBOOK = require('../../assets/images/Facebook.png');
export default function NetworksSelectedView(props) {
  const theme = useTheme();
  const [selectSocialMediaNetwork, setSelectSocialMediaNetwork] =
    useState(false);
  const [socialmediaIcon, setSocialmediaIcon] = useState([]);
  const [selectFinalNetworkId, setSelectFinalNetworkId] = useState('');
  useEffect(() => {
    //
    if (props.NetworkSelectedAddSchedule.length <= 0) {
    } else {
      const filteredFinalArray = props.NetworkSelectedAddSchedule.filter(
        item => item.networkId == props.networkId,
      );
      if (filteredFinalArray.length <= 0) {
        setSelectSocialMediaNetwork(false);
      } else {
        setSelectFinalNetworkId(filteredFinalArray[0].networkId);
        setSelectSocialMediaNetwork(true);
      }
    }
    setSocialmediaIcon(props.name);
  }, []);
  function NetworkSelect(props) {
    AsyncStorage.getItem('LoginInformation').then(function (res) {
      let Asyncdata = JSON.parse(res);
      global.NextSchedule = 0;

      if (selectFinalNetworkId.length >= 0) {
        if (selectSocialMediaNetwork == true) {
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
            desc: props.description,
            status: 1,
            createdBy: Number(Asyncdata[0].id),
            lastUpdatedBy: Number(Asyncdata[0].id),
            createdAt: moment.utc(currentdate).format(),
            lastUpdatedAt: moment.utc(currentdate).format(),
          };
          props.ActionNetworkSelectedDataRemoveClick(SelectProps);
        }
        if (selectSocialMediaNetwork == false) {
          var SelectProps = {
            networkId: props.networkId,
            orgId: Number(Asyncdata[0].orgid),
            rowVer: 0,
            purchasedQouta: props.purchasedQouta,
            unitPriceInclTax: props.unitPriceInclTax,
            usedQuota: props.usedQuota,
            compaignId: 0,
            id: 0,
            desc: props.description,
            status: 1,
            createdBy: Number(Asyncdata[0].id),
            lastUpdatedBy: Number(Asyncdata[0].id),
            createdAt: moment.utc(currentdate).format(),
            lastUpdatedAt: moment.utc(currentdate).format(),
          };
          setSelectSocialMediaNetwork(true);
          props.ActionNetworkSelectedDataClick(SelectProps);
        }
      } else if (
        selectFinalNetworkId.length >= 1 ||
        selectFinalNetworkId == props.networkId
      ) {
        if (selectSocialMediaNetwork == true) {
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
            desc: props.description,
            status: 1,
            createdBy: Number(Asyncdata[0].id),
            lastUpdatedBy: Number(Asyncdata[0].id),
            createdAt: moment.utc(currentdate).format(),
            lastUpdatedAt: moment.utc(currentdate).format(),
          };
          props.ActionNetworkSelectedDataRemoveClick(SelectProps);
        }
        if (selectSocialMediaNetwork == false) {
          var SelectProps = {
            networkId: props.networkId,
            orgId: Number(Asyncdata[0].orgid),
            rowVer: 0,
            purchasedQouta: props.purchasedQouta,
            unitPriceInclTax: props.unitPriceInclTax,
            usedQuota: props.usedQuota,
            compaignId: 0,
            id: 0,
            desc: props.description,
            status: 1,
            createdBy: Number(Asyncdata[0].id),
            lastUpdatedBy: Number(Asyncdata[0].id),
            createdAt: moment.utc(currentdate).format(),
            lastUpdatedAt: moment.utc(currentdate).format(),
          };
          setSelectSocialMediaNetwork(true);
          props.ActionNetworkSelectedDataClick(SelectProps);
        }
      }
    });
  }
  return (
    <Fragment>
      <View style={{width: 50 + '%', borderRadius: 5}}>
        <TouchableOpacity
          onPress={() => NetworkSelect(props)}
          style={{borderRadius: 5, marginTop: 8}}>
          <View style={[styles.btnGetStarted]}>
            <View
              style={{
                width: 36 + '%',
                flexDirection: 'row',
                paddingTop: 11,
                height: 45,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
                paddingLeft: 12,
                backgroundColor: theme.inputBackColor,
              }}>
              <Text style={[styles.itemText, {color: theme.textColor}]}>
                {socialmediaIcon}
              </Text>
              <Text style={[styles.itemQuotaText, {color: theme.textColor}]}>
                {' '}
                ({props.purchasedQouta})
              </Text>
            </View>
            {selectFinalNetworkId == props.networkId ? (
              <View
                style={{
                  width: 10 + '%',
                  height: 45,
                  paddingTop: 9,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  backgroundColor: theme.inputBackColor,
                  zIndex: 902,
                }}>
                {selectSocialMediaNetwork == true ? (
                  <Image
                    resizeMode="contain"
                    source={checkedCheckbox}
                    style={[
                      styles.checkboxChecked_Unchecked,
                      {tintColor: theme.selectedCheckBox},
                    ]}
                  />
                ) : (
                  <Image
                    resizeMode="contain"
                    source={uncheckedCheckbox}
                    style={[
                      styles.checkboxChecked_Unchecked,
                      {tintColor: theme.selectedCheckBox},
                    ]}
                  />
                )}
              </View>
            ) : (
              <View
                style={{
                  width: 10 + '%',
                  height: 45,
                  paddingTop: 9,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  backgroundColor: theme.inputBackColor,
                  zIndex: 902,
                }}>
                {selectSocialMediaNetwork == false ? (
                  <Image
                    resizeMode="contain"
                    source={uncheckedCheckbox}
                    style={[
                      styles.checkboxChecked_Unchecked,
                      {tintColor: theme.selectedCheckBox},
                    ]}
                  />
                ) : (
                  <Image
                    resizeMode="contain"
                    source={checkedCheckbox}
                    style={[
                      styles.checkboxChecked_Unchecked,
                      {tintColor: theme.selectedCheckBox},
                    ]}
                  />
                )}
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Fragment>
  );
}
const styles = StyleSheet.create({
  checkboxChecked_Unchecked: {
    // paddingRight:7,
    // paddingLeft:13,
    height: 25,
    width: 25,
  },
  btnGetStarted: {
    flexDirection: 'row',
    //backgroundColor:colors.PanelTabList,
    //backgroundColor:colors.red,
    width: Dimensions.get('window').width - 30,
    marginHorizontal: 15,
    fontSize: 25,
    // marginTop: 10,
    paddingRight: 12,
    marginRight: 12,
    //marginBottom:2,
    borderRadius: 6,
  },
  itemText: {
    color: colors.TextColorOther,
    fontFamily: fonts.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemQuotaText: {
    color: colors.TextColorOther,
    fontFamily: fonts.primary,
    fontSize: 12,
    paddingTop: 2,
    fontWeight: 'bold',
  },
});
